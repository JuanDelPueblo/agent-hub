//! Project rows. The row keeps the whole struct as a JSON document in `data`;
//! only the identifier needs its own column.
use super::validation::validate_name;
use anyhow::{bail, Result};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
    pub created_at: String,
    pub updated_at: String,
    #[serde(default)]
    pub chat_count: usize,
}

/// `chat_count` is derived, so every read recomputes it instead of storing it.
const SELECT_WITH_COUNT: &str = "SELECT p.data, \
    (SELECT COUNT(*) FROM chats c WHERE c.project_id = p.id) AS chat_count \
    FROM projects p";

pub(crate) fn new(name: String, path: String) -> Result<Project> {
    validate_name(&name)?;
    let now = chrono::Utc::now().to_rfc3339();
    Ok(Project {
        id: uuid::Uuid::new_v4().to_string(),
        name,
        path,
        created_at: now.clone(),
        updated_at: now,
        chat_count: 0,
    })
}

pub(crate) fn list(conn: &Connection) -> Result<Vec<Project>> {
    let mut stmt = conn.prepare(&format!("{SELECT_WITH_COUNT} ORDER BY p.rowid"))?;
    let rows = stmt.query_map([], |r| {
        let data: String = r.get(0)?;
        let count: i64 = r.get(1)?;
        Ok((data, count as usize))
    })?;
    rows.map(|r| {
        let (data, count) = r?;
        let mut p: Project = serde_json::from_str(&data)?;
        p.chat_count = count;
        Ok(p)
    })
    .collect()
}

pub(crate) fn get(conn: &Connection, id: &str) -> Result<Project> {
    let mut stmt = conn.prepare(&format!("{SELECT_WITH_COUNT} WHERE p.id = ?1"))?;
    let row = stmt
        .query_row(params![id], |r| {
            let data: String = r.get(0)?;
            let count: i64 = r.get(1)?;
            Ok((data, count as usize))
        })
        .optional()?;
    match row {
        Some((data, count)) => {
            let mut p: Project = serde_json::from_str(&data)?;
            p.chat_count = count;
            Ok(p)
        }
        None => bail!("Project not found"),
    }
}

pub(crate) fn save(conn: &Connection, p: &Project) -> Result<()> {
    conn.execute(
        "INSERT INTO projects (id, data) VALUES (?1, ?2) \
         ON CONFLICT(id) DO UPDATE SET data=excluded.data",
        params![p.id, serde_json::to_string(p)?],
    )?;
    Ok(())
}

pub(crate) fn delete(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM projects WHERE id=?1", [id])?;
    Ok(())
}
