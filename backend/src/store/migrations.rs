//! Ordered, versioned schema migrations.
//!
//! `PRAGMA user_version` holds the schema version. Each migration runs in its
//! own transaction and advances that version inside the same transaction, so a
//! failure leaves the database exactly where it was. There is no destructive
//! reset: an unreadable database is reported, never recreated.
//!
//! A migration may only use schema changes and narrowly-scoped data
//! initialization (`CREATE TABLE`, `CREATE INDEX`, `ALTER TABLE ... ADD
//! COLUMN`, `INSERT`, and `UPDATE`). SQLite's 12-step table rebuild
//! needs `PRAGMA foreign_keys=OFF` outside the transaction, so it needs its own
//! handling if it is ever required.
//!
//! Write every migration so that running it twice is safe. Prefer
//! `IF NOT EXISTS`. When a statement has no such form, give the migration a
//! `precondition` that reports whether the work is still needed. Pueblo Hub
//! v0.2 wrote `user_version=1` on every open, so a database that was upgraded,
//! opened once by v0.2, and then upgraded again arrives claiming to be
//! version 1 with the newer schema already in place.
use anyhow::{Context, Result};
use rusqlite::{Connection, TransactionBehavior};

pub struct Migration {
    pub version: i64,
    pub name: &'static str,
    pub sql: &'static str,
    /// A query returning non-zero while `sql` still needs to run.
    ///
    /// Pueblo Hub v0.2 set `user_version=1` on every open, so rolling back to
    /// it and forward again presents an upgraded database that claims to be
    /// version 1. A migration whose statements are not already idempotent
    /// needs this guard to stay safe in that case.
    pub precondition: Option<&'static str>,
}

pub const MIGRATIONS: &[Migration] = &[
    Migration {
    version: 1,
    name: "baseline_v0_2",
    // The schema v0.2 shipped. Every v0.2 database already reports
    // user_version=1, so those files skip this migration and only run the
    // later ones. A new file starts at 0 and gets this.
    sql: "
        CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY, data TEXT NOT NULL);",
        // `CREATE TABLE IF NOT EXISTS` is already idempotent.
        precondition: None,
    },
    Migration {
        version: 2,
        name: "events_session_id_column",
        // Deleting a chat matched events with
        // `json_extract(data,'$.session_id')`, which scans and parses the whole
        // table. The column carries no foreign key on purpose: `EventLog`
        // writes an empty session id for hub-wide events, and a non-persistent
        // session writes an id that is not a chat row.
        sql: "
        ALTER TABLE events ADD COLUMN session_id TEXT NOT NULL DEFAULT '';
        UPDATE events SET session_id = COALESCE(json_extract(data, '$.session_id'), '');
        CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);",
        // SQLite has no `ADD COLUMN IF NOT EXISTS`, so ask directly.
        precondition: Some(
            "SELECT COUNT(*)=0 FROM pragma_table_info('events') WHERE name='session_id'",
        ),
    },
    Migration {
        version: 3,
        name: "chats_project_id_index",
        // `projects()` counts chats per project with a correlated subquery, and
        // the cascade on project deletion looks the same column up.
        sql: "CREATE INDEX IF NOT EXISTS idx_chats_project_id ON chats(project_id);",
        // `CREATE INDEX IF NOT EXISTS` is already idempotent.
        precondition: None,
    },
    Migration {
        version: 4,
        name: "chat_workspaces",
        // Durable Phase 2 workspace metadata. One row per chat at most:
        // `chat_id` is both the primary key and the cascade back to the chat.
        // `workspace_path` is the managed external worktree root in managed
        // mode and the primary checkout root in project-checkout mode, so
        // only managed paths are unique and several direct chats may share
        // one checkout. No Git or filesystem work happens here.
        sql: "CREATE TABLE IF NOT EXISTS chat_workspaces (
            chat_id TEXT PRIMARY KEY REFERENCES chats(id) ON DELETE CASCADE,
            project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            mode TEXT NOT NULL CHECK(mode IN ('managed_worktree', 'project_checkout')),
            repository_root TEXT NOT NULL,
            workspace_path TEXT NOT NULL,
            project_subdir TEXT NOT NULL DEFAULT '',
            branch TEXT,
            base_commit TEXT,
            created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_chat_workspaces_project_id ON chat_workspaces(project_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_workspaces_managed_path ON chat_workspaces(workspace_path) WHERE mode='managed_worktree';",
        // `CREATE TABLE/INDEX IF NOT EXISTS` is already idempotent.
        precondition: None,
    },
    Migration {
        version: 5,
        name: "chat_title_sequence",
        // The sequence is separate from chat rows because SQLite's ordinary
        // rowid may be reused after deleting the highest row. Keeping the
        // next value in a durable singleton makes default titles monotonic.
        sql: "CREATE TABLE IF NOT EXISTS chat_title_sequence (
            id INTEGER PRIMARY KEY CHECK(id = 1),
            next_number INTEGER NOT NULL
        );
        INSERT OR IGNORE INTO chat_title_sequence (id, next_number)
        SELECT 1, MAX(
            COALESCE((SELECT MAX(rowid) + 1 FROM chats), 1),
            COALESCE((
                SELECT MAX(CAST(substr(title, 10) AS INTEGER)) + 1
                FROM (
                    SELECT json_extract(data, '$.title') AS title
                    FROM chats
                )
                WHERE title GLOB 'New chat [0-9]*'
                  AND printf('New chat %d', CAST(substr(title, 10) AS INTEGER)) = title
            ), 1)
        );",
        precondition: None,
    },
    Migration {
        version: 6,
        name: "installed_agents",
        // Durable installed-agent records. Registry installs and
        // Pueblo-managed definitions share one table, because they share one
        // runtime catalog. `source` stays a column so ownership checks and
        // collision checks do not parse the blob. No foreign key points at
        // this table: a chat names its agent by id, and that chat must stay
        // readable after the agent is uninstalled.
        sql: "CREATE TABLE IF NOT EXISTS installed_agents (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL CHECK(source IN ('pueblo_managed', 'registry')),
            data TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_installed_agents_source ON installed_agents(source);",
        // `CREATE TABLE/INDEX IF NOT EXISTS` is already idempotent.
        precondition: None,
    },
];

pub fn latest_version() -> i64 {
    MIGRATIONS.last().map_or(0, |m| m.version)
}

pub(crate) fn check_version(conn: &Connection) -> Result<()> {
    let latest = latest_version();
    let current = user_version(conn)?;
    anyhow::ensure!(
        current <= latest,
        "Database schema version {current} comes from a newer Pueblo Hub \
         (this build understands version {latest}). Upgrade Pueblo Hub or restore a backup."
    );
    Ok(())
}

pub(crate) fn migrate(db: &mut Connection) -> Result<()> {
    apply(db, MIGRATIONS)
}

fn apply(db: &mut Connection, migrations: &[Migration]) -> Result<()> {
    debug_assert!(
        migrations.windows(2).all(|w| w[0].version < w[1].version),
        "migrations must be ordered by ascending version"
    );
    check_version(db)?;
    let current = user_version(db)?;

    for m in migrations.iter().filter(|m| m.version > current) {
        // Immediate takes the write lock before the version re-check, so a
        // second process on the same file cannot apply a migration twice.
        let tx = db.transaction_with_behavior(TransactionBehavior::Immediate)?;
        if user_version(&tx)? >= m.version {
            tx.rollback()?;
            continue;
        }
        if needs_body(&tx, m)? {
            tx.execute_batch(m.sql)
                .with_context(|| format!("Schema migration {} ({}) failed", m.version, m.name))?;
        } else {
            tracing::info!(
                version = m.version,
                name = m.name,
                "schema migration already applied; advancing version only"
            );
        }
        tx.pragma_update(None, "user_version", m.version)?;
        tx.commit()?;
        tracing::info!(
            version = m.version,
            name = m.name,
            "applied schema migration"
        );
    }
    Ok(())
}

/// Whether this migration's statements still have work to do.
fn needs_body(conn: &Connection, m: &Migration) -> Result<bool> {
    match m.precondition {
        None => Ok(true),
        Some(sql) => Ok(conn.query_row(sql, [], |r| r.get::<_, i64>(0))? != 0),
    }
}

fn user_version(conn: &Connection) -> Result<i64> {
    Ok(conn.query_row("PRAGMA user_version", [], |r| r.get(0))?)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::store::Store;
    use rusqlite::params;

    /// A verbatim copy of the schema v0.2 created. It is deliberately not
    /// derived from `MIGRATIONS[0]`, or the upgrade test would prove nothing.
    const V0_2_SCHEMA: &str = "PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
        CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY, data TEXT NOT NULL);
        PRAGMA user_version=1;";

    fn table_names(conn: &Connection) -> Vec<String> {
        let mut stmt = conn
            .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
            .unwrap();
        let rows = stmt.query_map([], |r| r.get::<_, String>(0)).unwrap();
        rows.map(|r| r.unwrap()).collect()
    }

    #[test]
    fn migrations_are_strictly_ordered() {
        assert!(MIGRATIONS.windows(2).all(|w| w[0].version < w[1].version));
        assert_eq!(MIGRATIONS.first().map(|m| m.version), Some(1));
    }

    #[test]
    fn fresh_database_reaches_latest_version() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        let store = Store::open(&path).unwrap();
        drop(store);

        let conn = Connection::open(&path).unwrap();
        assert_eq!(user_version(&conn).unwrap(), latest_version());
        let tables = table_names(&conn);
        for expected in ["chats", "chat_workspaces", "events", "projects"] {
            assert!(tables.contains(&expected.to_string()), "missing {expected}");
        }
    }

    #[test]
    fn chat_workspaces_schema_has_expected_keys_and_indexes() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        Store::open(&path).unwrap();

        let conn = Connection::open(&path).unwrap();
        let sql: String = conn
            .query_row(
                "SELECT sql FROM sqlite_master WHERE type='table' AND name='chat_workspaces'",
                [],
                |r| r.get(0),
            )
            .unwrap();
        for expected in [
            "chat_id TEXT PRIMARY KEY",
            "REFERENCES chats(id) ON DELETE CASCADE",
            "REFERENCES projects(id) ON DELETE CASCADE",
            "CHECK(mode IN ('managed_worktree', 'project_checkout'))",
        ] {
            assert!(sql.contains(expected), "missing {expected} in {sql}");
        }
        for index in [
            "idx_chat_workspaces_project_id",
            "idx_chat_workspaces_managed_path",
        ] {
            let count: i64 = conn
                .query_row(
                    "SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND name=?1",
                    [index],
                    |r| r.get(0),
                )
                .unwrap();
            assert_eq!(count, 1, "index {index} is missing");
        }
        let partial: String = conn
            .query_row(
                "SELECT sql FROM sqlite_master WHERE type='index' \
                 AND name='idx_chat_workspaces_managed_path'",
                [],
                |r| r.get(0),
            )
            .unwrap();
        assert!(
            partial.contains("WHERE mode='managed_worktree'"),
            "managed-path uniqueness must be partial, got {partial}"
        );
    }

    #[test]
    fn v0_2_chats_stay_readable_without_workspace_rows() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");

        let legacy = Connection::open(&path).unwrap();
        legacy.execute_batch(V0_2_SCHEMA).unwrap();
        legacy
            .execute(
                "INSERT INTO projects (id, data) VALUES ('p1', '{\"id\":\"p1\"}')",
                [],
            )
            .unwrap();
        legacy
            .execute(
                "INSERT INTO chats (id, project_id, data) VALUES ('c1','p1','{\"id\":\"c1\"}')",
                [],
            )
            .unwrap();
        drop(legacy);

        let store = Store::open(&path).unwrap();
        assert!(store.workspace("c1").unwrap().is_none());
        assert!(store.list_workspaces().unwrap().is_empty());
        assert!(store.list_project_workspaces("p1").unwrap().is_empty());
    }

    #[test]
    fn v0_2_database_upgrades_in_place() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");

        let legacy = Connection::open(&path).unwrap();
        legacy.execute_batch(V0_2_SCHEMA).unwrap();
        legacy
            .execute(
                "INSERT INTO projects (id, data) VALUES ('p1', '{\"id\":\"p1\"}')",
                [],
            )
            .unwrap();
        legacy
            .execute(
                "INSERT INTO chats (id, project_id, data) VALUES ('c1','p1','{\"id\":\"c1\"}')",
                [],
            )
            .unwrap();
        legacy
            .execute(
                "INSERT INTO events (seq, data) VALUES (1, '{\"session_id\":\"c1\"}')",
                [],
            )
            .unwrap();
        assert_eq!(user_version(&legacy).unwrap(), 1);
        drop(legacy);

        Store::open(&path).unwrap();

        let conn = Connection::open(&path).unwrap();
        assert_eq!(user_version(&conn).unwrap(), latest_version());
        for (table, id) in [("projects", "p1"), ("chats", "c1")] {
            let count: i64 = conn
                .query_row(
                    &format!("SELECT COUNT(*) FROM {table} WHERE id=?1"),
                    [id],
                    |r| r.get(0),
                )
                .unwrap();
            assert_eq!(count, 1, "{table} row was lost during the upgrade");
        }
        let events: i64 = conn
            .query_row("SELECT COUNT(*) FROM events", [], |r| r.get(0))
            .unwrap();
        assert_eq!(events, 1, "event row was lost during the upgrade");
    }

    #[test]
    fn v5_title_sequence_starts_beyond_legacy_chat_rows_and_titles() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");

        let legacy = Connection::open(&path).unwrap();
        legacy.execute_batch(V0_2_SCHEMA).unwrap();
        legacy
            .execute(
                "INSERT INTO projects (id, data) VALUES ('p1', '{\"id\":\"p1\"}')",
                [],
            )
            .unwrap();
        // Explicit rowids exercise the durable row identity, while the larger
        // exact title suffix proves migration does not collide with old
        // numbered defaults even when it exceeds the rowid high-water mark.
        legacy
            .execute(
                "INSERT INTO chats (rowid, id, project_id, data) VALUES
                 (5, 'c5', 'p1', '{\"title\":\"New chat 2\"}'),
                 (7, 'c7', 'p1', '{\"title\":\"New chat 20\"}')",
                [],
            )
            .unwrap();
        drop(legacy);

        let store = Store::open(&path).unwrap();
        let created = store
            .create_chat("p1".into(), "codex".into(), None)
            .unwrap();
        assert_eq!(created.title, "New chat 21");
        assert!(!created.title_overridden);
    }

    /// Migration 2 must derive the new column from the JSON every existing row
    /// already carries, including the empty id `EventLog` writes for hub-wide
    /// events.
    #[test]
    fn backfill_populates_session_id_for_legacy_rows() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");

        let legacy = Connection::open(&path).unwrap();
        legacy.execute_batch(V0_2_SCHEMA).unwrap();
        for (seq, session) in [(1, "chat-a"), (2, "chat-b"), (3, "")] {
            legacy
                .execute(
                    "INSERT INTO events (seq, data) VALUES (?1, ?2)",
                    params![seq, format!("{{\"session_id\":\"{session}\"}}")],
                )
                .unwrap();
        }
        drop(legacy);

        Store::open(&path).unwrap();

        let conn = Connection::open(&path).unwrap();
        let mut stmt = conn
            .prepare("SELECT seq, session_id FROM events ORDER BY seq")
            .unwrap();
        let rows: Vec<(i64, String)> = stmt
            .query_map([], |r| Ok((r.get(0)?, r.get(1)?)))
            .unwrap()
            .map(|r| r.unwrap())
            .collect();
        assert_eq!(
            rows,
            vec![
                (1, "chat-a".to_string()),
                (2, "chat-b".to_string()),
                (3, String::new()),
            ]
        );

        let index: i64 = conn
            .query_row(
                "SELECT COUNT(*) FROM sqlite_master \
                 WHERE type='index' AND name='idx_events_session_id'",
                [],
                |r| r.get(0),
            )
            .unwrap();
        assert_eq!(index, 1, "the session_id index is missing");
    }

    /// Pueblo Hub v0.2 wrote `user_version=1` on every open. A user who rolls
    /// back to it and then forward again presents an upgraded database that
    /// claims to be version 1, so the migrations must not run their statements
    /// a second time.
    #[test]
    fn reapplying_over_a_reset_version_marker_is_safe() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");

        let legacy = Connection::open(&path).unwrap();
        legacy.execute_batch(V0_2_SCHEMA).unwrap();
        legacy
            .execute(
                "INSERT INTO events (seq, data) VALUES (1, '{\"session_id\":\"chat-a\"}')",
                [],
            )
            .unwrap();
        drop(legacy);

        Store::open(&path).unwrap();

        // Stand in for v0.2 reopening the upgraded file.
        let reset = Connection::open(&path).unwrap();
        reset.pragma_update(None, "user_version", 1_i64).unwrap();
        drop(reset);

        Store::open(&path).expect("re-upgrade after a reset version marker failed");

        let conn = Connection::open(&path).unwrap();
        assert_eq!(user_version(&conn).unwrap(), latest_version());
        let session_id: String = conn
            .query_row("SELECT session_id FROM events WHERE seq=1", [], |r| {
                r.get(0)
            })
            .unwrap();
        assert_eq!(session_id, "chat-a", "backfilled data was lost");
    }

    #[test]
    fn failed_migration_rolls_back() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        let mut conn = Connection::open(&path).unwrap();

        let table = &[
            Migration {
                version: 1,
                name: "good",
                sql: "CREATE TABLE good (id TEXT PRIMARY KEY);",
                precondition: None,
            },
            Migration {
                version: 2,
                name: "broken",
                sql: "CREATE TABLE half (id TEXT); THIS IS NOT SQL;",
                precondition: None,
            },
        ];

        let err = apply(&mut conn, table).unwrap_err();
        assert!(err.to_string().contains("Schema migration 2"));
        // The first migration committed; the second left nothing behind.
        assert_eq!(user_version(&conn).unwrap(), 1);
        let tables = table_names(&conn);
        assert!(tables.contains(&"good".to_string()));
        assert!(
            !tables.contains(&"half".to_string()),
            "partial DDL survived"
        );
    }

    #[test]
    fn newer_schema_version_is_refused() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        let conn = Connection::open(&path).unwrap();
        conn.pragma_update(None, "user_version", 999_i64).unwrap();
        conn.pragma_update(None, "journal_mode", "DELETE").unwrap();
        drop(conn);

        let err = Store::open(&path).err().unwrap();
        assert!(err.to_string().contains("newer Pueblo Hub"), "{err}");

        let conn = Connection::open(&path).unwrap();
        assert_eq!(user_version(&conn).unwrap(), 999);
        assert!(table_names(&conn).is_empty(), "database was modified");
        let mode: String = conn
            .query_row("PRAGMA journal_mode", [], |r| r.get(0))
            .unwrap();
        assert_eq!(
            mode.to_uppercase(),
            "DELETE",
            "journal_mode was mutated before version check"
        );
    }
}
