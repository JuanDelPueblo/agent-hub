//! Project rows. The row keeps the whole struct as a JSON document in `data`;
//! only the identifier needs its own column.
use super::validation::validate_name;
use super::{StoreError, StoreResult};
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
    /// Whether this project has a durable "remember for project" `.envrc`
    /// authorization grant. Derived at read time, like `chat_count`; never
    /// part of the stored JSON document.
    #[serde(default)]
    pub envrc_remembered: bool,
    #[serde(default)]
    pub envrc_relative_path: Option<String>,
}

/// `chat_count` and `envrc_relative_path` are derived, so every read
/// recomputes them instead of storing them.
const SELECT_WITH_COUNT: &str = "SELECT p.data, \
    (SELECT COUNT(*) FROM chats c WHERE c.project_id = p.id) AS chat_count, \
    g.relative_path AS envrc_relative_path \
    FROM projects p \
    LEFT JOIN project_envrc_grants g ON g.project_id = p.id";

fn row_to_project(
    data: String,
    count: i64,
    envrc_relative_path: Option<String>,
) -> StoreResult<Project> {
    let mut p: Project = serde_json::from_str(&data)?;
    p.chat_count = count as usize;
    p.envrc_remembered = envrc_relative_path.is_some();
    p.envrc_relative_path = envrc_relative_path;
    Ok(p)
}

pub(crate) fn new(name: String, path: String) -> StoreResult<Project> {
    validate_name(&name)?;
    let now = chrono::Utc::now().to_rfc3339();
    Ok(Project {
        id: uuid::Uuid::new_v4().to_string(),
        name,
        path,
        created_at: now.clone(),
        updated_at: now,
        chat_count: 0,
        envrc_remembered: false,
        envrc_relative_path: None,
    })
}

pub(crate) fn list(conn: &Connection) -> StoreResult<Vec<Project>> {
    let mut stmt = conn.prepare(&format!("{SELECT_WITH_COUNT} ORDER BY p.rowid"))?;
    let rows = stmt.query_map([], |r| {
        let data: String = r.get(0)?;
        let count: i64 = r.get(1)?;
        let envrc_relative_path: Option<String> = r.get(2)?;
        Ok((data, count, envrc_relative_path))
    })?;
    let mut projects = Vec::new();
    for r in rows {
        let (data, count, envrc_relative_path) = r?;
        projects.push(row_to_project(data, count, envrc_relative_path)?);
    }
    Ok(projects)
}

pub(crate) fn get(conn: &Connection, id: &str) -> StoreResult<Project> {
    let mut stmt = conn.prepare(&format!("{SELECT_WITH_COUNT} WHERE p.id = ?1"))?;
    let row = stmt
        .query_row(params![id], |r| {
            let data: String = r.get(0)?;
            let count: i64 = r.get(1)?;
            let envrc_relative_path: Option<String> = r.get(2)?;
            Ok((data, count, envrc_relative_path))
        })
        .optional()?;
    match row {
        Some((data, count, envrc_relative_path)) => {
            row_to_project(data, count, envrc_relative_path)
        }
        None => Err(StoreError::NotFound("Project not found".into())),
    }
}

pub(crate) fn save(conn: &Connection, p: &Project) -> StoreResult<()> {
    conn.execute(
        "INSERT INTO projects (id, data) VALUES (?1, ?2) \
         ON CONFLICT(id) DO UPDATE SET data=excluded.data",
        params![p.id, serde_json::to_string(p)?],
    )?;
    Ok(())
}

pub(crate) fn delete(conn: &Connection, id: &str) -> StoreResult<()> {
    let affected = conn.execute("DELETE FROM projects WHERE id=?1", [id])?;
    if affected == 0 {
        return Err(StoreError::NotFound("Project not found".into()));
    }
    Ok(())
}
