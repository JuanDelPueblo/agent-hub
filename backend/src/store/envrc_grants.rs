//! Durable project-level `.envrc` authorization grants.
//!
//! One row per project: the effective `.envrc` location (relative to a
//! chat's workspace boundary) and a content hash of the exact bytes the
//! user approved when they chose "Remember for project". A new grant
//! replaces the prior one wholesale, so editing `.envrc` always requires
//! approval again.
use super::StoreResult;
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ProjectEnvrcGrant {
    pub project_id: String,
    pub relative_path: String,
    pub content_hash: String,
    pub created_at: String,
}

const SELECT_COLUMNS: &str =
    "project_id, relative_path, content_hash, created_at FROM project_envrc_grants";

fn row_to_grant(row: &rusqlite::Row<'_>) -> rusqlite::Result<ProjectEnvrcGrant> {
    Ok(ProjectEnvrcGrant {
        project_id: row.get(0)?,
        relative_path: row.get(1)?,
        content_hash: row.get(2)?,
        created_at: row.get(3)?,
    })
}

pub(crate) fn remember(
    conn: &Connection,
    project_id: &str,
    relative_path: String,
    content_hash: String,
) -> StoreResult<ProjectEnvrcGrant> {
    let grant = ProjectEnvrcGrant {
        project_id: project_id.to_string(),
        relative_path,
        content_hash,
        created_at: chrono::Utc::now().to_rfc3339(),
    };
    conn.execute(
        "INSERT INTO project_envrc_grants (project_id, relative_path, content_hash, created_at) \
         VALUES (?1, ?2, ?3, ?4) \
         ON CONFLICT(project_id) DO UPDATE SET \
            relative_path=excluded.relative_path, \
            content_hash=excluded.content_hash, \
            created_at=excluded.created_at",
        params![
            grant.project_id,
            grant.relative_path,
            grant.content_hash,
            grant.created_at,
        ],
    )?;
    Ok(grant)
}

pub(crate) fn get(conn: &Connection, project_id: &str) -> StoreResult<Option<ProjectEnvrcGrant>> {
    let row = conn
        .query_row(
            &format!("SELECT {SELECT_COLUMNS} WHERE project_id=?1"),
            [project_id],
            row_to_grant,
        )
        .optional()?;
    Ok(row)
}

pub(crate) fn forget(conn: &Connection, project_id: &str) -> StoreResult<()> {
    conn.execute(
        "DELETE FROM project_envrc_grants WHERE project_id=?1",
        [project_id],
    )?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::store::Store;

    #[test]
    fn remember_then_get_round_trips() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();

        assert!(store.project_envrc_grant(&project.id).unwrap().is_none());

        let grant = store
            .remember_project_envrc_grant(&project.id, ".envrc".into(), "hash1".into())
            .unwrap();
        assert_eq!(grant.relative_path, ".envrc");
        assert_eq!(grant.content_hash, "hash1");

        let fetched = store.project_envrc_grant(&project.id).unwrap().unwrap();
        assert_eq!(fetched, grant);
    }

    #[test]
    fn remembering_again_replaces_the_prior_grant() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();

        store
            .remember_project_envrc_grant(&project.id, ".envrc".into(), "hash1".into())
            .unwrap();
        store
            .remember_project_envrc_grant(&project.id, ".envrc".into(), "hash2".into())
            .unwrap();

        let fetched = store.project_envrc_grant(&project.id).unwrap().unwrap();
        assert_eq!(fetched.content_hash, "hash2");
    }

    #[test]
    fn forget_is_idempotent_and_removes_the_grant() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();

        store.forget_project_envrc_grant(&project.id).unwrap();

        store
            .remember_project_envrc_grant(&project.id, ".envrc".into(), "hash1".into())
            .unwrap();
        store.forget_project_envrc_grant(&project.id).unwrap();
        assert!(store.project_envrc_grant(&project.id).unwrap().is_none());

        store.forget_project_envrc_grant(&project.id).unwrap();
    }

    #[test]
    fn deleting_project_cascades_to_its_grant() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        store
            .remember_project_envrc_grant(&project.id, ".envrc".into(), "hash1".into())
            .unwrap();

        store.delete_project(&project.id).unwrap();

        let conn = rusqlite::Connection::open(tmp.path().join("hub.db")).unwrap();
        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM project_envrc_grants", [], |r| {
                r.get(0)
            })
            .unwrap();
        assert_eq!(count, 0);
    }

    #[test]
    fn grant_never_crosses_projects() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project_a = store
            .create_project("a".into(), tmp.path().display().to_string())
            .unwrap();
        let project_b = store
            .create_project("b".into(), tmp.path().display().to_string())
            .unwrap();

        store
            .remember_project_envrc_grant(&project_a.id, ".envrc".into(), "same-hash".into())
            .unwrap();

        assert!(store.project_envrc_grant(&project_b.id).unwrap().is_none());
    }
}
