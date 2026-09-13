//! Event rows. `EventLog` owns `seq`, so this module never generates one.
use super::StoreResult;
use crate::events::SessionEvent;
use rusqlite::{params, Connection};

/// The replay window. `EventLog` holds the same number in memory.
const REPLAY_LIMIT: usize = 10_000;

pub(crate) fn save(conn: &Connection, event: &SessionEvent) -> StoreResult<()> {
    conn.execute(
        "INSERT INTO events (seq, session_id, data) VALUES (?1, ?2, ?3)",
        params![
            i64::try_from(event.seq).map_err(|e| anyhow::anyhow!(e))?,
            event.session_id,
            serde_json::to_string(event)?
        ],
    )?;
    Ok(())
}

/// The most recent `REPLAY_LIMIT` events, oldest first.
pub(crate) fn recent(conn: &Connection) -> StoreResult<Vec<SessionEvent>> {
    let mut stmt = conn.prepare(&format!(
        "SELECT data FROM (SELECT seq,data FROM events ORDER BY seq DESC LIMIT {REPLAY_LIMIT}) \
         ORDER BY seq"
    ))?;
    let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
    let mut events = Vec::new();
    for r in rows {
        let data = r?;
        events.push(serde_json::from_str(&data)?);
    }
    Ok(events)
}

pub(crate) fn delete_for_session(conn: &Connection, session_id: &str) -> StoreResult<()> {
    conn.execute("DELETE FROM events WHERE session_id=?1", [session_id])?;
    Ok(())
}
