//! Application metadata, never a substitute for the agent's own conversation state.
//!
//! `Store` is the only owner of the SQLite connection. Each domain module holds
//! the SQL for one entity and takes a `&Connection`, so this facade decides how
//! long the lock is held and which calls share a transaction. Domain modules
//! never take the lock themselves, because `std::sync::Mutex` is not reentrant.
mod chats;
mod events;
pub mod migrations;
mod projects;
mod validation;

pub use chats::Chat;
pub use projects::Project;
pub use validation::{validate_name, validate_project_path};

use anyhow::Result;
use rusqlite::Connection;
use std::{path::Path, sync::Mutex};

pub struct Store(Mutex<Connection>);

impl Store {
    pub fn open(path: &Path) -> Result<Self> {
        let mut db = Connection::open(path)?;
        db.busy_timeout(std::time::Duration::from_secs(5))?;
        // Both pragmas must run outside a transaction. SQLite rejects
        // `journal_mode=WAL` inside one and silently ignores `foreign_keys`.
        db.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        migrations::migrate(&mut db)?;
        Ok(Self(Mutex::new(db)))
    }

    pub fn projects(&self) -> Result<Vec<Project>> {
        projects::list(&self.0.lock().unwrap())
    }

    pub fn project(&self, id: &str) -> Result<Project> {
        projects::get(&self.0.lock().unwrap(), id)
    }

    pub fn save_project(&self, p: &Project) -> Result<()> {
        projects::save(&self.0.lock().unwrap(), p)
    }

    pub fn create_project(&self, name: String, path: String) -> Result<Project> {
        let p = projects::new(name, path)?;
        self.save_project(&p)?;
        Ok(p)
    }

    pub fn delete_project(&self, id: &str) -> Result<()> {
        projects::delete(&self.0.lock().unwrap(), id)
    }

    pub fn chats(&self) -> Result<Vec<Chat>> {
        chats::list(&self.0.lock().unwrap())
    }

    pub fn chat(&self, id: &str) -> Result<Chat> {
        chats::get(&self.0.lock().unwrap(), id)
    }

    pub fn create_chat(
        &self,
        project_id: String,
        agent: String,
        title: Option<String>,
    ) -> Result<Chat> {
        let c = chats::new(project_id, agent, title)?;
        chats::insert(&self.0.lock().unwrap(), &c)?;
        Ok(c)
    }

    /// Read/modify/write under one lock so a config notification cannot overwrite a rename.
    pub fn update_chat(&self, id: &str, edit: impl FnOnce(&mut Chat)) -> Result<Chat> {
        chats::update(&self.0.lock().unwrap(), id, edit)
    }

    /// A chat and its events go together, so one transaction covers both tables.
    pub fn delete_chat(&self, id: &str) -> Result<()> {
        let mut db = self.0.lock().unwrap();
        let tx = db.transaction()?;
        chats::delete(&tx, id)?;
        events::delete_for_session(&tx, id)?;
        tx.commit()?;
        Ok(())
    }

    pub fn save_event(&self, event: &crate::events::SessionEvent) -> Result<()> {
        events::save(&self.0.lock().unwrap(), event)
    }

    pub fn events(&self) -> Result<Vec<crate::events::SessionEvent>> {
        events::recent(&self.0.lock().unwrap())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;

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

    /// Two writers that touch different fields must not lose each other's work.
    /// A read outside the lock followed by a write inside it would drop one.
    #[test]
    fn update_chat_is_read_modify_write() {
        let tmp = tempfile::tempdir().unwrap();
        let db = Arc::new(Store::open(&tmp.path().join("hub.db")).unwrap());
        let p = db
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let chat = db.create_chat(p.id, "codex".into(), None).unwrap();

        let titles = {
            let db = db.clone();
            let id = chat.id.clone();
            std::thread::spawn(move || {
                for i in 0..50 {
                    db.update_chat(&id, |c| c.title = format!("title-{i}"))
                        .unwrap();
                }
            })
        };
        let sessions = {
            let db = db.clone();
            let id = chat.id.clone();
            std::thread::spawn(move || {
                for i in 0..50 {
                    db.update_chat(&id, |c| c.acp_session_id = Some(format!("acp-{i}")))
                        .unwrap();
                }
            })
        };
        titles.join().unwrap();
        sessions.join().unwrap();

        let final_chat = db.chat(&chat.id).unwrap();
        assert!(final_chat.title.starts_with("title-"), "rename was lost");
        assert!(
            final_chat
                .acp_session_id
                .as_deref()
                .is_some_and(|s| s.starts_with("acp-")),
            "ACP session id was lost"
        );
    }

    /// Deleting one chat must not touch another chat's history.
    #[test]
    fn delete_chat_only_removes_that_chat_events() {
        use crate::events::EventPayload;
        let tmp = tempfile::tempdir().unwrap();
        let db = Arc::new(Store::open(&tmp.path().join("hub.db")).unwrap());
        let p = db
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        let doomed = db.create_chat(p.id.clone(), "codex".into(), None).unwrap();
        let kept = db.create_chat(p.id, "codex".into(), None).unwrap();

        let log = crate::events::EventLog::persistent(db.clone()).unwrap();
        log.append(
            &doomed.id,
            "codex",
            EventPayload::MessageChunk { text: "a".into() },
        );
        log.append(
            &kept.id,
            "codex",
            EventPayload::MessageChunk { text: "b".into() },
        );

        db.delete_chat(&doomed.id).unwrap();

        let remaining = db.events().unwrap();
        assert!(remaining.iter().all(|e| e.session_id != doomed.id));
        assert_eq!(
            remaining.iter().filter(|e| e.session_id == kept.id).count(),
            1
        );
    }
}
