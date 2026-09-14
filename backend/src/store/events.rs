//! Event rows. `EventLog` owns `seq`, so this module never generates one.
use super::{StoreError, StoreResult};
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
///
/// This populates the in-memory replay cache only. Restart recovery must not
/// use it: the rows it needs can sit outside this window.
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

/// Durable restart-recovery state in sequence order.
///
/// Startup-only work: returns every row whose payload can leave a turn
/// interrupted or a permission pending. `json_extract` avoids a migration;
/// recovery runs once per start so the per-row JSON parse is acceptable.
/// Callers must not use this for replay: it omits all other payload types.
pub(crate) fn recovery(conn: &Connection) -> StoreResult<Vec<SessionEvent>> {
    let mut stmt = conn.prepare(
        "SELECT data FROM events \
         WHERE json_extract(data, '$.payload.type') IN \
         ('permission_request', 'permission_response', 'state_change', 'turn_complete') \
         ORDER BY seq",
    )?;
    let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
    let mut events = Vec::new();
    for r in rows {
        let data = r?;
        events.push(serde_json::from_str(&data)?);
    }
    Ok(events)
}

pub(crate) fn page(
    conn: &Connection,
    from_seq: u64,
    through_seq: u64,
    limit: usize,
) -> StoreResult<Vec<SessionEvent>> {
    let mut stmt = conn
        .prepare("SELECT data FROM events WHERE seq >= ?1 AND seq <= ?2 ORDER BY seq LIMIT ?3")?;
    let rows = stmt.query_map(
        params![
            i64::try_from(from_seq).map_err(|e| anyhow::anyhow!(e))?,
            i64::try_from(through_seq).map_err(|e| anyhow::anyhow!(e))?,
            i64::try_from(limit).map_err(|e| anyhow::anyhow!(e))?,
        ],
        |r| r.get::<_, String>(0),
    )?;
    let mut events = Vec::new();
    for row in rows {
        events.push(serde_json::from_str(&row?)?);
    }
    Ok(events)
}

pub(crate) fn max_seq(conn: &Connection) -> StoreResult<u64> {
    let value: i64 =
        conn.query_row("SELECT COALESCE(MAX(seq), 0) FROM events", [], |r| r.get(0))?;
    u64::try_from(value).map_err(|e| StoreError::Internal(e.into()))
}

pub(crate) fn delete_for_session(conn: &Connection, session_id: &str) -> StoreResult<()> {
    conn.execute("DELETE FROM events WHERE session_id=?1", [session_id])?;
    Ok(())
}
