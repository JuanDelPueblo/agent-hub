//! Chat rows. `project_id` has its own column because the foreign key and the
//! per-project listing need it; the rest stays a JSON document in `data`.
use super::validation::validate_name;
use anyhow::{Context, Result};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Chat {
    pub id: String,
    pub project_id: String,
    pub agent: String,
    pub title: String,
    pub acp_session_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub archived: bool,
    pub permission_policy: crate::acp::callbacks::CallbackPolicy,
    pub config_values: Value,
    #[serde(default)]
    pub title_overridden: bool,
}

pub(crate) fn new(project_id: String, agent: String, title: Option<String>) -> Result<Chat> {
    let (final_title, title_overridden) = match title {
        Some(t) if !t.trim().is_empty() => {
            validate_name(&t)?;
            let trimmed = t.trim().to_string();
            let overridden = trimmed != "New chat";
            (trimmed, overridden)
        }
        _ => ("New chat".to_string(), false),
    };
    let now = chrono::Utc::now().to_rfc3339();
    Ok(Chat {
        id: uuid::Uuid::new_v4().to_string(),
        project_id,
        agent,
        title: final_title,
        acp_session_id: None,
        created_at: now.clone(),
        updated_at: now,
        archived: false,
        permission_policy: Default::default(),
        config_values: serde_json::json!({}),
        title_overridden,
    })
}

pub(crate) fn list(conn: &Connection) -> Result<Vec<Chat>> {
    let mut stmt = conn.prepare("SELECT data FROM chats ORDER BY rowid")?;
    let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
    rows.map(|r| Ok(serde_json::from_str(&r?)?)).collect()
}

pub(crate) fn get(conn: &Connection, id: &str) -> Result<Chat> {
    let data: Option<String> = conn
        .query_row("SELECT data FROM chats WHERE id=?1", [id], |r| r.get(0))
        .optional()?;
    Ok(serde_json::from_str(&data.context("Chat not found")?)?)
}

pub(crate) fn insert(conn: &Connection, c: &Chat) -> Result<()> {
    conn.execute(
        "INSERT INTO chats (id, project_id, data) VALUES (?1, ?2, ?3)",
        params![c.id, c.project_id, serde_json::to_string(c)?],
    )?;
    Ok(())
}

/// Read/modify/write. The caller holds the connection lock for the whole call,
/// so a config notification cannot overwrite a concurrent rename.
pub(crate) fn update(conn: &Connection, id: &str, edit: impl FnOnce(&mut Chat)) -> Result<Chat> {
    let data: String = conn.query_row("SELECT data FROM chats WHERE id=?1", [id], |r| r.get(0))?;
    let mut c: Chat = serde_json::from_str(&data)?;
    edit(&mut c);
    c.updated_at = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "UPDATE chats SET data=?2 WHERE id=?1",
        params![id, serde_json::to_string(&c)?],
    )?;
    Ok(c)
}

pub(crate) fn delete(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM chats WHERE id=?1", [id])?;
    Ok(())
}
