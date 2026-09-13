//! Application metadata, never a substitute for the agent's own conversation state.
use anyhow::{bail, Context, Result};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{path::Path, sync::Mutex};

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

pub struct Store(Mutex<Connection>);

impl Store {
    pub fn open(path: &Path) -> Result<Self> {
        let db = Connection::open(path)?;
        db.busy_timeout(std::time::Duration::from_secs(5))?;
        db.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
            CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, data TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY, data TEXT NOT NULL);
            PRAGMA user_version=1;")?;
        Ok(Self(Mutex::new(db)))
    }

    pub fn projects(&self) -> Result<Vec<Project>> {
        let db = self.0.lock().unwrap();
        let mut stmt = db.prepare(
            "SELECT p.data, (SELECT COUNT(*) FROM chats c WHERE c.project_id = p.id) AS chat_count FROM projects p ORDER BY p.rowid",
        )?;
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

    pub fn project(&self, id: &str) -> Result<Project> {
        let db = self.0.lock().unwrap();
        let mut stmt = db.prepare(
            "SELECT p.data, (SELECT COUNT(*) FROM chats c WHERE c.project_id = p.id) AS chat_count FROM projects p WHERE p.id = ?1",
        )?;
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

    pub fn save_project(&self, p: &Project) -> Result<()> {
        self.0.lock().unwrap().execute(
            "INSERT INTO projects VALUES (?1,?2) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
            params![p.id, serde_json::to_string(p)?],
        )?;
        Ok(())
    }

    pub fn create_project(&self, name: String, path: String) -> Result<Project> {
        validate_name(&name)?;
        let now = chrono::Utc::now().to_rfc3339();
        let p = Project {
            id: uuid::Uuid::new_v4().to_string(),
            name,
            path,
            created_at: now.clone(),
            updated_at: now,
            chat_count: 0,
        };
        self.save_project(&p)?;
        Ok(p)
    }

    pub fn delete_project(&self, id: &str) -> Result<()> {
        self.0
            .lock()
            .unwrap()
            .execute("DELETE FROM projects WHERE id=?1", [id])?;
        Ok(())
    }

    pub fn chats(&self) -> Result<Vec<Chat>> {
        let db = self.0.lock().unwrap();
        let mut stmt = db.prepare("SELECT data FROM chats ORDER BY rowid")?;
        let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
        rows.map(|r| Ok(serde_json::from_str(&r?)?)).collect()
    }

    pub fn chat(&self, id: &str) -> Result<Chat> {
        let data: Option<String> = self
            .0
            .lock()
            .unwrap()
            .query_row("SELECT data FROM chats WHERE id=?1", [id], |r| r.get(0))
            .optional()?;
        Ok(serde_json::from_str(&data.context("Chat not found")?)?)
    }

    pub fn create_chat(
        &self,
        project_id: String,
        agent: String,
        title: Option<String>,
    ) -> Result<Chat> {
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
        let c = Chat {
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
        };
        self.0.lock().unwrap().execute(
            "INSERT INTO chats VALUES (?1,?2,?3)",
            params![c.id, c.project_id, serde_json::to_string(&c)?],
        )?;
        Ok(c)
    }

    /// Read/modify/write under one lock so a config notification cannot overwrite a rename.
    pub fn update_chat(&self, id: &str, edit: impl FnOnce(&mut Chat)) -> Result<Chat> {
        let db = self.0.lock().unwrap();
        let data: String =
            db.query_row("SELECT data FROM chats WHERE id=?1", [id], |r| r.get(0))?;
        let mut c: Chat = serde_json::from_str(&data)?;
        edit(&mut c);
        c.updated_at = chrono::Utc::now().to_rfc3339();
        db.execute(
            "UPDATE chats SET data=?2 WHERE id=?1",
            params![id, serde_json::to_string(&c)?],
        )?;
        Ok(c)
    }

    pub fn delete_chat(&self, id: &str) -> Result<()> {
        let mut db = self.0.lock().unwrap();
        let tx = db.transaction()?;
        tx.execute("DELETE FROM chats WHERE id=?1", [id])?;
        tx.execute(
            "DELETE FROM events WHERE json_extract(data,'$.session_id')=?1",
            [id],
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn save_event(&self, event: &crate::events::SessionEvent) -> Result<()> {
        self.0.lock().unwrap().execute(
            "INSERT INTO events VALUES (?1,?2)",
            params![i64::try_from(event.seq)?, serde_json::to_string(event)?],
        )?;
        Ok(())
    }

    pub fn events(&self) -> Result<Vec<crate::events::SessionEvent>> {
        let db = self.0.lock().unwrap();
        let mut stmt = db.prepare("SELECT data FROM (SELECT seq,data FROM events ORDER BY seq DESC LIMIT 10000) ORDER BY seq")?;
        let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
        rows.map(|r| Ok(serde_json::from_str(&r?)?)).collect()
    }
}

pub fn validate_name(name: &str) -> Result<()> {
    if name.trim().is_empty() || name.len() > 200 {
        bail!("Name must contain 1–200 bytes")
    }
    Ok(())
}

pub fn validate_project_path(path: &str, roots: &[String]) -> Result<String> {
    let input = Path::new(path);
    if !input.is_absolute() {
        bail!("Project path must be absolute")
    }
    let canonical = input
        .canonicalize()
        .context("Project directory does not exist")?;
    if !canonical.is_dir() {
        bail!("Project path must be a directory")
    }
    if !roots
        .iter()
        .filter_map(|r| Path::new(r).canonicalize().ok())
        .any(|r| canonical.starts_with(r))
    {
        bail!("Project directory is outside the configured project roots")
    }
    Ok(canonical.to_string_lossy().into_owned())
}

#[cfg(test)]
mod tests {
    use super::*;
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
    #[test]
    fn paths_must_exist_and_stay_inside_roots() {
        let tmp = tempfile::tempdir().unwrap();
        let roots = vec![tmp.path().display().to_string()];
        assert!(validate_project_path(&roots[0], &roots).is_ok());
        assert!(validate_project_path("/", &roots).is_err());
        assert!(validate_project_path("relative", &roots).is_err());
        assert!(validate_name(" ").is_err());
    }
}
