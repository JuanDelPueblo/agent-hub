//! Application metadata, never a substitute for the agent's own conversation state.
//!
//! `Store` is the only owner of the SQLite connection. Each domain module holds
//! the SQL for one entity and takes a `&Connection`, so this facade decides how
//! long the lock is held and which calls share a transaction. Domain modules
//! never take the lock themselves, because `std::sync::Mutex` is not reentrant.
mod chats;
mod events;
pub mod migrations;
mod projects;
mod validation;
mod workspaces;

pub use chats::Chat;
pub use projects::Project;
pub use validation::{validate_name, validate_project_path};
pub use workspaces::{ChatWorkspace, WorkspaceMode};

use rusqlite::Connection;
use std::{
    path::{Path, PathBuf},
    sync::Mutex,
};

#[derive(Debug)]
pub enum StoreError {
    NotFound(String),
    Validation(String),
    Internal(anyhow::Error),
}

pub type StoreResult<T> = std::result::Result<T, StoreError>;

impl std::fmt::Display for StoreError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotFound(m) | Self::Validation(m) => f.write_str(m),
            Self::Internal(e) => write!(f, "{e}"),
        }
    }
}

impl std::error::Error for StoreError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Self::Internal(e) => Some(e.as_ref()),
            _ => None,
        }
    }
}

impl From<rusqlite::Error> for StoreError {
    fn from(e: rusqlite::Error) -> Self {
        Self::Internal(e.into())
    }
}

impl From<serde_json::Error> for StoreError {
    fn from(e: serde_json::Error) -> Self {
        Self::Internal(e.into())
    }
}

impl From<anyhow::Error> for StoreError {
    fn from(e: anyhow::Error) -> Self {
        Self::Internal(e)
    }
}

pub struct Store {
    conn: Mutex<Connection>,
    state_dir: PathBuf,
}

/// Resolve the directory that holds Hub state for a database path.
///
/// The managed-worktree root lives directly below it. Relative database
/// paths resolve against the current working directory so the root stays
/// deterministic no matter when the caller asks for it.
pub(crate) fn state_dir_for_database(path: &Path) -> PathBuf {
    if path.as_os_str() == ":memory:" {
        return std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    }
    let absolute = if path.is_absolute() {
        path.to_path_buf()
    } else {
        std::env::current_dir()
            .unwrap_or_else(|_| PathBuf::from("."))
            .join(path)
    };
    absolute.parent().map(Path::to_path_buf).unwrap_or(absolute)
}

impl Store {
    pub fn open(path: &Path) -> StoreResult<Self> {
        let state_dir = state_dir_for_database(path);
        let mut db = Connection::open(path)?;
        db.busy_timeout(std::time::Duration::from_secs(5))?;
        migrations::check_version(&db)?;
        // Both pragmas must run outside a transaction. SQLite rejects
        // `journal_mode=WAL` inside one and silently ignores `foreign_keys`.
        db.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        migrations::migrate(&mut db)?;
        Ok(Self {
            conn: Mutex::new(db),
            state_dir,
        })
    }

    /// Directory that holds the database file and Hub-managed state.
    pub fn state_dir(&self) -> &Path {
        &self.state_dir
    }

    /// Deterministic root for Hub-managed external worktrees:
    /// `<database parent>/worktrees`. The directory is resolved, never
    /// created here; worktree creation stays outside `Store`.
    pub fn worktrees_dir(&self) -> PathBuf {
        self.state_dir.join("worktrees")
    }

    /// Alias for the managed-worktree root. Same value as `worktrees_dir`.
    pub fn managed_worktree_root(&self) -> PathBuf {
        self.worktrees_dir()
    }

    pub fn projects(&self) -> StoreResult<Vec<Project>> {
        projects::list(&self.conn.lock().unwrap())
    }

    pub fn project(&self, id: &str) -> StoreResult<Project> {
        projects::get(&self.conn.lock().unwrap(), id)
    }

    pub fn save_project(&self, p: &Project) -> StoreResult<()> {
        projects::save(&self.conn.lock().unwrap(), p)
    }

    pub fn create_project(&self, name: String, path: String) -> StoreResult<Project> {
        let p = projects::new(name, path)?;
        self.save_project(&p)?;
        Ok(p)
    }

    pub fn delete_project(&self, id: &str) -> StoreResult<()> {
        projects::delete(&self.conn.lock().unwrap(), id)
    }

    pub fn chats(&self) -> StoreResult<Vec<Chat>> {
        chats::list(&self.conn.lock().unwrap())
    }

    pub fn chat(&self, id: &str) -> StoreResult<Chat> {
        chats::get(&self.conn.lock().unwrap(), id)
    }

    pub fn create_chat(
        &self,
        project_id: String,
        agent: String,
        title: Option<String>,
    ) -> StoreResult<Chat> {
        let c = self.new_chat(project_id, agent, title)?;
        self.insert_chat(&c)?;
        Ok(c)
    }

    /// Build a chat with its final ID without making it visible yet. Services
    /// use this to name external resources before the durable transaction.
    pub(crate) fn new_chat(
        &self,
        project_id: String,
        agent: String,
        title: Option<String>,
    ) -> StoreResult<Chat> {
        chats::new(project_id, agent, title)
    }

    fn insert_chat(&self, chat: &Chat) -> StoreResult<()> {
        chats::insert(&self.conn.lock().unwrap(), chat)
    }

    /// Persist a newly-created chat and its workspace as one atomic mutation.
    /// Neither row is visible if either insert fails.
    pub(crate) fn insert_chat_with_workspace(
        &self,
        chat: &Chat,
        workspace: &ChatWorkspace,
    ) -> StoreResult<()> {
        let mut db = self.conn.lock().unwrap();
        let tx = db.transaction()?;
        chats::insert(&tx, chat)?;
        workspaces::insert(&tx, workspace)?;
        tx.commit()?;
        Ok(())
    }

    /// Read/modify/write under one lock so a config notification cannot overwrite a rename.
    pub fn update_chat(&self, id: &str, edit: impl FnOnce(&mut Chat)) -> StoreResult<Chat> {
        chats::update(&self.conn.lock().unwrap(), id, edit)
    }

    pub fn touch_chat(&self, id: &str, updated_at: &str) -> StoreResult<Chat> {
        chats::touch(&self.conn.lock().unwrap(), id, updated_at)
    }

    /// A chat and its events go together, so one transaction covers both tables.
    /// The workspace row goes away through the `chat_workspaces` foreign key.
    pub fn delete_chat(&self, id: &str) -> StoreResult<()> {
        let mut db = self.conn.lock().unwrap();
        let tx = db.transaction()?;
        chats::delete(&tx, id)?;
        events::delete_for_session(&tx, id)?;
        tx.commit()?;
        Ok(())
    }

    pub fn insert_workspace(&self, ws: &ChatWorkspace) -> StoreResult<()> {
        workspaces::insert(&self.conn.lock().unwrap(), ws)
    }

    /// Returns `None` for chats without a workspace row, which includes
    /// every chat created before workspaces existed.
    pub fn workspace(&self, chat_id: &str) -> StoreResult<Option<ChatWorkspace>> {
        workspaces::get(&self.conn.lock().unwrap(), chat_id)
    }

    pub fn delete_workspace(&self, chat_id: &str) -> StoreResult<()> {
        workspaces::delete(&self.conn.lock().unwrap(), chat_id)
    }

    pub fn list_workspaces(&self) -> StoreResult<Vec<ChatWorkspace>> {
        workspaces::list(&self.conn.lock().unwrap())
    }

    pub fn list_project_workspaces(&self, project_id: &str) -> StoreResult<Vec<ChatWorkspace>> {
        workspaces::list_for_project(&self.conn.lock().unwrap(), project_id)
    }

    pub fn save_event(&self, event: &crate::events::SessionEvent) -> StoreResult<()> {
        events::save(&self.conn.lock().unwrap(), event)
    }

    pub fn events(&self) -> StoreResult<Vec<crate::events::SessionEvent>> {
        events::recent(&self.conn.lock().unwrap())
    }

    /// Durable rows needed to repair pending permissions and interrupted
    /// turns on startup, in sequence order. See `events::recovery`.
    pub fn recovery_events(&self) -> StoreResult<Vec<crate::events::SessionEvent>> {
        events::recovery(&self.conn.lock().unwrap())
    }

    pub fn event_page(
        &self,
        from_seq: u64,
        through_seq: u64,
        limit: usize,
    ) -> StoreResult<Vec<crate::events::SessionEvent>> {
        events::page(&self.conn.lock().unwrap(), from_seq, through_seq, limit)
    }

    pub fn chat_event_page(
        &self,
        session_id: &str,
        before_seq: Option<u64>,
        through_seq: Option<u64>,
        limit: usize,
    ) -> StoreResult<(Vec<crate::events::SessionEvent>, bool)> {
        events::chat_page(
            &self.conn.lock().unwrap(),
            session_id,
            before_seq,
            through_seq,
            limit,
        )
    }

    pub fn active_turn_started_at(
        &self,
        session_id: &str,
    ) -> StoreResult<Option<chrono::DateTime<chrono::Utc>>> {
        events::active_turn_started_at(&self.conn.lock().unwrap(), session_id)
    }

    pub fn max_event_seq(&self) -> StoreResult<u64> {
        events::max_seq(&self.conn.lock().unwrap())
    }

    #[cfg(test)]
    pub(crate) fn set_query_only(&self) {
        self.conn
            .lock()
            .unwrap()
            .execute_batch("PRAGMA query_only=ON")
            .unwrap();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;

    #[test]
    fn restart_and_independent_chats() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        let db = Store::open(&path).unwrap();
        let p = db
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let a = db
            .create_chat(p.id.clone(), "codex".into(), Some("one".into()))
            .unwrap();
        let b = db
            .create_chat(p.id.clone(), "codex".into(), Some("two".into()))
            .unwrap();
        assert_ne!(a.id, b.id);
        db.update_chat(&a.id, |c| c.acp_session_id = Some("remote-one".into()))
            .unwrap();
        drop(db);
        let db = Store::open(&path).unwrap();
        assert_eq!(db.projects().unwrap().len(), 1);
        assert_eq!(db.chats().unwrap().len(), 2);
        assert_eq!(
            db.chat(&a.id).unwrap().acp_session_id.as_deref(),
            Some("remote-one")
        );
        assert!(db.chat(&b.id).unwrap().acp_session_id.is_none());
        assert_eq!(
            b.permission_policy,
            crate::acp::callbacks::CallbackPolicy::Ask
        );
    }

    /// Two writers that touch different fields must not lose each other's work.
    /// A read outside the lock followed by a write inside it would drop one.
    #[test]
    fn update_chat_is_read_modify_write() {
        let tmp = tempfile::tempdir().unwrap();
        let db = Arc::new(Store::open(&tmp.path().join("hub.db")).unwrap());
        let p = db
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let chat = db.create_chat(p.id, "codex".into(), None).unwrap();

        let titles = {
            let db = db.clone();
            let id = chat.id.clone();
            std::thread::spawn(move || {
                for i in 0..50 {
                    db.update_chat(&id, |c| c.title = format!("title-{i}"))
                        .unwrap();
                }
            })
        };
        let sessions = {
            let db = db.clone();
            let id = chat.id.clone();
            std::thread::spawn(move || {
                for i in 0..50 {
                    db.update_chat(&id, |c| c.acp_session_id = Some(format!("acp-{i}")))
                        .unwrap();
                }
            })
        };
        titles.join().unwrap();
        sessions.join().unwrap();

        let final_chat = db.chat(&chat.id).unwrap();
        assert!(final_chat.title.starts_with("title-"), "rename was lost");
        assert!(
            final_chat
                .acp_session_id
                .as_deref()
                .is_some_and(|s| s.starts_with("acp-")),
            "ACP session id was lost"
        );
    }

    #[test]
    fn chats_are_listed_by_activity_newest_first_with_id_tie_breaker() {
        let tmp = tempfile::tempdir().unwrap();
        let db = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = db
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let older = db
            .create_chat(project.id.clone(), "codex".into(), Some("older".into()))
            .unwrap();
        let newer = db
            .create_chat(project.id, "codex".into(), Some("newer".into()))
            .unwrap();

        db.touch_chat(&older.id, "2026-01-01T00:00:00Z").unwrap();
        db.touch_chat(&newer.id, "2026-02-01T00:00:00Z").unwrap();
        let listed = db.chats().unwrap();
        assert_eq!(listed[0].id, newer.id);
        assert_eq!(listed[1].id, older.id);

        db.touch_chat(&older.id, "2026-02-01T00:00:00Z").unwrap();
        let tied = db.chats().unwrap();
        let mut expected = [newer.id.clone(), older.id.clone()];
        expected.sort_by(|left, right| right.cmp(left));
        assert_eq!(tied[0].id, expected[0]);
        assert_eq!(tied[1].id, expected[1]);
    }

    #[test]
    fn worktrees_dir_lives_beside_database() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        let db = Store::open(&path).unwrap();
        assert_eq!(db.state_dir(), tmp.path());
        assert_eq!(db.worktrees_dir(), tmp.path().join("worktrees"));
        assert_eq!(db.managed_worktree_root(), tmp.path().join("worktrees"));
    }

    #[test]
    fn relative_database_paths_resolve_under_cwd() {
        let cwd = std::env::current_dir().unwrap();
        let resolved = state_dir_for_database(Path::new("hub.db"));
        assert_eq!(resolved, cwd);
        let resolved = state_dir_for_database(Path::new("data/hub.db"));
        assert_eq!(resolved, cwd.join("data"));
        let absolute = std::path::PathBuf::from("/var/lib/agent-hub/hub.db");
        assert_eq!(
            state_dir_for_database(&absolute),
            std::path::PathBuf::from("/var/lib/agent-hub")
        );
    }

    /// Deleting one chat must not touch another chat's history.
    #[test]
    fn delete_chat_only_removes_that_chat_events() {
        use crate::events::EventPayload;
        let tmp = tempfile::tempdir().unwrap();
        let db = Arc::new(Store::open(&tmp.path().join("hub.db")).unwrap());
        let p = db
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let doomed = db.create_chat(p.id.clone(), "codex".into(), None).unwrap();
        let kept = db.create_chat(p.id, "codex".into(), None).unwrap();

        let log = crate::events::EventLog::persistent(db.clone()).unwrap();
        log.append(
            &doomed.id,
            "codex",
            EventPayload::MessageChunk { text: "a".into() },
        )
        .unwrap();
        log.append(
            &kept.id,
            "codex",
            EventPayload::MessageChunk { text: "b".into() },
        )
        .unwrap();

        db.delete_chat(&doomed.id).unwrap();

        let remaining = db.events().unwrap();
        assert!(remaining.iter().all(|e| e.session_id != doomed.id));
        assert_eq!(
            remaining.iter().filter(|e| e.session_id == kept.id).count(),
            1
        );
    }

    #[test]
    fn chat_event_pages_are_bounded_and_do_not_scan_other_chat_history() {
        use crate::events::{EventPayload, SessionEvent};
        let tmp = tempfile::tempdir().unwrap();
        let db = Store::open(&tmp.path().join("hub.db")).unwrap();
        let mut connection = db.conn.lock().unwrap();
        let transaction = connection.transaction().unwrap();
        for index in 0..20_050 {
            let event = SessionEvent {
                seq: index + 1,
                timestamp: chrono::Utc::now(),
                session_id: if index % 2 == 0 {
                    "target".into()
                } else {
                    "other".into()
                },
                agent: "codex".into(),
                payload: EventPayload::MessageChunk {
                    text: index.to_string(),
                },
            };
            transaction
                .execute(
                    "INSERT INTO events (seq, session_id, data) VALUES (?1, ?2, ?3)",
                    rusqlite::params![
                        event.seq as i64,
                        event.session_id,
                        serde_json::to_string(&event).unwrap(),
                    ],
                )
                .unwrap();
        }
        transaction.commit().unwrap();
        drop(connection);

        let (first, has_older) = db.chat_event_page("target", None, None, 100).unwrap();
        assert_eq!(first.len(), 100);
        assert!(has_older);
        assert!(first.iter().all(|event| event.session_id == "target"));
        assert!(first.windows(2).all(|pair| pair[0].seq < pair[1].seq));

        let (bounded, has_older) = db
            .chat_event_page("target", None, Some(10_000), 100)
            .unwrap();
        assert!(bounded.iter().all(|event| event.seq <= 10_000));
        assert!(has_older);

        let mut total = first.len();
        if has_older {
            let mut cursor = first.first().unwrap().seq;
            loop {
                let (page, more) = db
                    .chat_event_page("target", Some(cursor), None, 100)
                    .unwrap();
                if page.is_empty() {
                    break;
                }
                assert!(page.iter().all(|event| event.session_id == "target"));
                cursor = page.first().unwrap().seq;
                total += page.len();
                if !more {
                    break;
                }
            }
        }
        assert_eq!(total, 10_025);
    }
}
