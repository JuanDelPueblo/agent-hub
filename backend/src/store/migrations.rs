//! Ordered, versioned schema migrations.
//!
//! `PRAGMA user_version` holds the schema version. Each migration runs in its
//! own transaction and advances that version inside the same transaction, so a
//! failure leaves the database exactly where it was. There is no destructive
//! reset: an unreadable database is reported, never recreated.
//!
//! A migration may only use `CREATE TABLE`, `CREATE INDEX`,
//! `ALTER TABLE ... ADD COLUMN`, and `UPDATE`. SQLite's 12-step table rebuild
//! needs `PRAGMA foreign_keys=OFF` outside the transaction, so it needs its own
//! handling if it is ever required.
use anyhow::{Context, Result};
use rusqlite::{Connection, TransactionBehavior};

pub struct Migration {
    pub version: i64,
    pub name: &'static str,
    pub sql: &'static str,
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
    },
    Migration {
        version: 3,
        name: "chats_project_id_index",
        // `projects()` counts chats per project with a correlated subquery, and
        // the cascade on project deletion looks the same column up.
        sql: "CREATE INDEX IF NOT EXISTS idx_chats_project_id ON chats(project_id);",
    },
];

pub fn latest_version() -> i64 {
    MIGRATIONS.last().map_or(0, |m| m.version)
}

pub(crate) fn migrate(db: &mut Connection) -> Result<()> {
    apply(db, MIGRATIONS)
}

fn apply(db: &mut Connection, migrations: &[Migration]) -> Result<()> {
    debug_assert!(
        migrations.windows(2).all(|w| w[0].version < w[1].version),
        "migrations must be ordered by ascending version"
    );
    let latest = migrations.last().map_or(0, |m| m.version);
    let current = user_version(db)?;
    anyhow::ensure!(
        current <= latest,
        "Database schema version {current} comes from a newer Agent Hub \
         (this build understands version {latest}). Upgrade Agent Hub or restore a backup."
    );

    for m in migrations.iter().filter(|m| m.version > current) {
        // Immediate takes the write lock before the version re-check, so a
        // second process on the same file cannot apply a migration twice.
        let tx = db.transaction_with_behavior(TransactionBehavior::Immediate)?;
        if user_version(&tx)? >= m.version {
            tx.rollback()?;
            continue;
        }
        tx.execute_batch(m.sql)
            .with_context(|| format!("Schema migration {} ({}) failed", m.version, m.name))?;
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
        for expected in ["chats", "events", "projects"] {
            assert!(tables.contains(&expected.to_string()), "missing {expected}");
        }
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
            },
            Migration {
                version: 2,
                name: "broken",
                sql: "CREATE TABLE half (id TEXT); THIS IS NOT SQL;",
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
        drop(conn);

        let err = Store::open(&path).err().unwrap();
        assert!(err.to_string().contains("newer Agent Hub"), "{err}");

        let conn = Connection::open(&path).unwrap();
        assert_eq!(user_version(&conn).unwrap(), 999);
        assert!(table_names(&conn).is_empty(), "database was modified");
    }
}
