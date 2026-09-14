//! Durable chat workspace records.
//!
//! Phase 2 persistence only. This module never runs Git commands and never
//! touches the filesystem. It stores one row per chat describing where that
//! chat works: either a Hub-managed external worktree or the repository's
//! primary checkout.
use super::{StoreError, StoreResult};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use std::{fmt, str::FromStr};

/// Where a chat works.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum WorkspaceMode {
    ManagedWorktree,
    ProjectCheckout,
}

impl WorkspaceMode {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::ManagedWorktree => "managed_worktree",
            Self::ProjectCheckout => "project_checkout",
        }
    }
}

impl fmt::Display for WorkspaceMode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

impl FromStr for WorkspaceMode {
    type Err = StoreError;

    fn from_str(s: &str) -> StoreResult<Self> {
        match s {
            "managed_worktree" => Ok(Self::ManagedWorktree),
            "project_checkout" => Ok(Self::ProjectCheckout),
            other => Err(StoreError::Validation(format!(
                "Unknown workspace mode '{other}'"
            ))),
        }
    }
}

/// One durable workspace record per chat.
///
/// `workspace_path` is the managed external worktree root in managed mode
/// and the repository's primary checkout root in project-checkout mode.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ChatWorkspace {
    pub chat_id: String,
    pub project_id: String,
    pub mode: WorkspaceMode,
    pub repository_root: String,
    pub workspace_path: String,
    pub project_subdir: String,
    pub branch: Option<String>,
    pub base_commit: Option<String>,
    pub created_at: String,
}

impl ChatWorkspace {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        chat_id: String,
        project_id: String,
        mode: WorkspaceMode,
        repository_root: String,
        workspace_path: String,
        project_subdir: String,
        branch: Option<String>,
        base_commit: Option<String>,
    ) -> Self {
        Self {
            chat_id,
            project_id,
            mode,
            repository_root,
            workspace_path,
            project_subdir,
            branch,
            base_commit,
            created_at: chrono::Utc::now().to_rfc3339(),
        }
    }
}

const SELECT_COLUMNS: &str = "chat_id, project_id, mode, repository_root, \
     workspace_path, project_subdir, branch, base_commit, created_at \
     FROM chat_workspaces";

fn row_to_workspace(row: &rusqlite::Row<'_>) -> rusqlite::Result<ChatWorkspace> {
    let mode_text: String = row.get(2)?;
    let mode = mode_text.parse::<WorkspaceMode>().map_err(|e| {
        rusqlite::Error::FromSqlConversionFailure(
            2,
            rusqlite::types::Type::Text,
            Box::new(std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                e.to_string(),
            )),
        )
    })?;
    Ok(ChatWorkspace {
        chat_id: row.get(0)?,
        project_id: row.get(1)?,
        mode,
        repository_root: row.get(3)?,
        workspace_path: row.get(4)?,
        project_subdir: row.get(5)?,
        branch: row.get(6)?,
        base_commit: row.get(7)?,
        created_at: row.get(8)?,
    })
}

pub(crate) fn insert(conn: &Connection, ws: &ChatWorkspace) -> StoreResult<()> {
    let chat_project_id: Option<String> = conn
        .query_row(
            "SELECT project_id FROM chats WHERE id=?1",
            [ws.chat_id.as_str()],
            |row| row.get(0),
        )
        .optional()?;
    let chat_project_id = match chat_project_id {
        Some(project_id) => project_id,
        None => return Err(StoreError::NotFound("Chat not found".into())),
    };
    if chat_project_id != ws.project_id {
        return Err(StoreError::Validation(
            "Workspace project does not match chat project".into(),
        ));
    }

    conn.execute(
        "INSERT INTO chat_workspaces \
         (chat_id, project_id, mode, repository_root, workspace_path, \
          project_subdir, branch, base_commit, created_at) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            ws.chat_id,
            ws.project_id,
            ws.mode.as_str(),
            ws.repository_root,
            ws.workspace_path,
            ws.project_subdir,
            ws.branch,
            ws.base_commit,
            ws.created_at,
        ],
    )?;
    Ok(())
}

/// Returns `None` when the chat has no workspace row. Chats created before
/// workspaces existed stay readable through this path.
pub(crate) fn get(conn: &Connection, chat_id: &str) -> StoreResult<Option<ChatWorkspace>> {
    let row = conn
        .query_row(
            &format!("SELECT {SELECT_COLUMNS} WHERE chat_id=?1"),
            [chat_id],
            row_to_workspace,
        )
        .optional()?;
    Ok(row)
}

pub(crate) fn delete(conn: &Connection, chat_id: &str) -> StoreResult<()> {
    conn.execute("DELETE FROM chat_workspaces WHERE chat_id=?1", [chat_id])?;
    Ok(())
}

pub(crate) fn list(conn: &Connection) -> StoreResult<Vec<ChatWorkspace>> {
    let mut stmt = conn.prepare(&format!("SELECT {SELECT_COLUMNS} ORDER BY rowid"))?;
    let rows = stmt.query_map([], row_to_workspace)?;
    let mut out = Vec::new();
    for r in rows {
        out.push(r?);
    }
    Ok(out)
}

pub(crate) fn list_for_project(
    conn: &Connection,
    project_id: &str,
) -> StoreResult<Vec<ChatWorkspace>> {
    let mut stmt = conn.prepare(&format!(
        "SELECT {SELECT_COLUMNS} WHERE project_id=?1 ORDER BY rowid"
    ))?;
    let rows = stmt.query_map([project_id], row_to_workspace)?;
    let mut out = Vec::new();
    for r in rows {
        out.push(r?);
    }
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::store::Store;

    fn setup() -> (tempfile::TempDir, Store, String, String) {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let chat = store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let project_id = project.id.clone();
        let chat_id = chat.id.clone();
        (tmp, store, project_id, chat_id)
    }

    fn managed_ws(chat_id: &str, project_id: &str, workspace_path: &str) -> ChatWorkspace {
        ChatWorkspace::new(
            chat_id.into(),
            project_id.into(),
            WorkspaceMode::ManagedWorktree,
            "/repo".into(),
            workspace_path.into(),
            String::new(),
            Some("agent-hub/chat/test".into()),
            Some("abc123".into()),
        )
    }

    fn checkout_ws(chat_id: &str, project_id: &str, workspace_path: &str) -> ChatWorkspace {
        ChatWorkspace::new(
            chat_id.into(),
            project_id.into(),
            WorkspaceMode::ProjectCheckout,
            "/repo".into(),
            workspace_path.into(),
            String::new(),
            None,
            None,
        )
    }

    #[test]
    fn workspace_modes_round_trip() {
        assert_eq!(
            "managed_worktree".parse::<WorkspaceMode>().unwrap(),
            WorkspaceMode::ManagedWorktree
        );
        assert_eq!(
            "project_checkout".parse::<WorkspaceMode>().unwrap(),
            WorkspaceMode::ProjectCheckout
        );
        assert!("other".parse::<WorkspaceMode>().is_err());
        assert_eq!(WorkspaceMode::ManagedWorktree.as_str(), "managed_worktree");
        assert_eq!(WorkspaceMode::ProjectCheckout.as_str(), "project_checkout");
    }

    #[test]
    fn managed_and_checkout_modes_survive_restart() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        let project_id;
        let managed_chat;
        let checkout_chat;
        {
            let store = Store::open(&path).unwrap();
            let project = store
                .create_project("project".into(), tmp.path().display().to_string())
                .unwrap();
            project_id = project.id.clone();
            managed_chat = store
                .create_chat(project.id.clone(), "codex".into(), None)
                .unwrap();
            checkout_chat = store
                .create_chat(project.id.clone(), "codex".into(), None)
                .unwrap();
            store
                .insert_workspace(&managed_ws(
                    &managed_chat.id,
                    &project.id,
                    tmp.path().join("wt-one").display().to_string().as_str(),
                ))
                .unwrap();
            store
                .insert_workspace(&checkout_ws(&checkout_chat.id, &project.id, "/repo"))
                .unwrap();
        }
        let store = Store::open(&path).unwrap();
        let managed = store.workspace(&managed_chat.id).unwrap().unwrap();
        assert_eq!(managed.mode, WorkspaceMode::ManagedWorktree);
        assert_eq!(managed.project_id, project_id);
        let checkout = store.workspace(&checkout_chat.id).unwrap().unwrap();
        assert_eq!(checkout.mode, WorkspaceMode::ProjectCheckout);
        assert_eq!(checkout.workspace_path, "/repo");
        assert_eq!(store.list_workspaces().unwrap().len(), 2);
        assert_eq!(store.list_project_workspaces(&project_id).unwrap().len(), 2);
    }

    #[test]
    fn chat_has_at_most_one_workspace() {
        let (_tmp, store, project_id, chat_id) = setup();
        store
            .insert_workspace(&managed_ws(&chat_id, &project_id, "/wt-one"))
            .unwrap();
        let again = store.insert_workspace(&checkout_ws(&chat_id, &project_id, "/repo"));
        assert!(again.is_err(), "second workspace for one chat succeeded");
        assert_eq!(store.list_workspaces().unwrap().len(), 1);
    }

    #[test]
    fn workspace_project_must_match_chat_project() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let other_project = store
            .create_project("other project".into(), tmp.path().display().to_string())
            .unwrap();
        let chat = store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let other_chat = store
            .create_chat(other_project.id.clone(), "codex".into(), None)
            .unwrap();

        store
            .insert_workspace(&checkout_ws(&chat.id, &project.id, "/repo"))
            .unwrap();
        let rejected =
            store.insert_workspace(&checkout_ws(&other_chat.id, &project.id, "/other-repo"));

        assert!(matches!(rejected, Err(StoreError::Validation(_))));
        assert!(store.workspace(&other_chat.id).unwrap().is_none());
        assert_eq!(store.list_workspaces().unwrap().len(), 1);
    }

    #[test]
    fn multiple_project_checkouts_may_share_one_path() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let a = store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let b = store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        store
            .insert_workspace(&checkout_ws(&a.id, &project.id, "/repo"))
            .unwrap();
        store
            .insert_workspace(&checkout_ws(&b.id, &project.id, "/repo"))
            .unwrap();
        assert_eq!(store.list_workspaces().unwrap().len(), 2);
    }

    #[test]
    fn managed_worktree_paths_cannot_collide() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let a = store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let b = store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        store
            .insert_workspace(&managed_ws(&a.id, &project.id, "/wt-shared"))
            .unwrap();
        let collision = store.insert_workspace(&managed_ws(&b.id, &project.id, "/wt-shared"));
        assert!(collision.is_err(), "managed path collision succeeded");
    }

    #[test]
    fn deleting_chat_removes_workspace_through_fk() {
        let (_tmp, store, project_id, chat_id) = setup();
        store
            .insert_workspace(&managed_ws(&chat_id, &project_id, "/wt-one"))
            .unwrap();
        store.delete_chat(&chat_id).unwrap();
        assert!(store.workspace(&chat_id).unwrap().is_none());
        assert!(store.list_workspaces().unwrap().is_empty());
    }

    #[test]
    fn chats_without_workspace_rows_continue_to_work() {
        let (_tmp, store, _project_id, chat_id) = setup();
        assert!(store.workspace(&chat_id).unwrap().is_none());
        assert!(store.list_workspaces().unwrap().is_empty());
        let chat = store.chat(&chat_id).unwrap();
        assert_eq!(chat.id, chat_id);
        store.delete_workspace(&chat_id).unwrap();
    }

    #[test]
    fn explicit_delete_removes_only_that_workspace() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let a = store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let b = store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        store
            .insert_workspace(&managed_ws(&a.id, &project.id, "/wt-a"))
            .unwrap();
        store
            .insert_workspace(&managed_ws(&b.id, &project.id, "/wt-b"))
            .unwrap();
        store.delete_workspace(&a.id).unwrap();
        assert!(store.workspace(&a.id).unwrap().is_none());
        assert!(store.workspace(&b.id).unwrap().is_some());
    }
}
