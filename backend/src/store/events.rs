//! Event rows. `EventLog` owns `seq`, so this module never generates one.
use crate::events::SessionEvent;
use anyhow::Result;
use rusqlite::{params, Connection};

/// The replay window. `EventLog` holds the same number in memory.
const REPLAY_LIMIT: usize = 10_000;

pub(crate) fn save(conn: &Connection, event: &SessionEvent) -> Result<()> {
    conn.execute(
        "INSERT INTO events (seq, session_id, data) VALUES (?1, ?2, ?3)",
        params![
            i64::try_from(event.seq)?,
            event.session_id,
            serde_json::to_string(event)?
        ],
    )?;
    Ok(())
}

/// The most recent `REPLAY_LIMIT` events, oldest first.
pub(crate) fn recent(conn: &Connection) -> Result<Vec<SessionEvent>> {
    let mut stmt = conn.prepare(&format!(
        "SELECT data FROM (SELECT seq,data FROM events ORDER BY seq DESC LIMIT {REPLAY_LIMIT}) \
         ORDER BY seq"
    ))?;
    let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
    rows.map(|r| Ok(serde_json::from_str(&r?)?)).collect()
}

pub(crate) fn delete_for_session(conn: &Connection, session_id: &str) -> Result<()> {
    conn.execute("DELETE FROM events WHERE session_id=?1", [session_id])?;
    Ok(())
}
