//! Project operations.
use super::{HubService, ServiceError, ServiceResult};
use crate::store::{validate_name, validate_project_path, Project};

impl HubService {
    pub fn list_projects(&self) -> ServiceResult<Vec<Project>> {
        Ok(self.store.projects()?)
    }

    pub fn get_project(&self, id: &str) -> ServiceResult<Project> {
        Ok(self.store.project(id)?)
    }

    pub fn create_project(&self, name: String, path: String) -> ServiceResult<Project> {
        let path = validate_project_path(&path, &self.project_roots)?;
        let project = self.store.create_project(name, path)?;
        self.notify_metadata_changed()?;
        Ok(project)
    }

    /// Registers a directory that is already on disk, such as a finished clone.
    /// Validates the path against configured project roots before saving.
    pub(crate) fn register_cloned_project(
        &self,
        name: String,
        canonical_path: String,
    ) -> ServiceResult<Project> {
        let path = validate_project_path(&canonical_path, &self.project_roots)?;
        let project = self.store.create_project(name, path)?;
        self.notify_metadata_changed()?;
        Ok(project)
    }

    pub fn edit_project(&self, id: &str, name: String, path: String) -> ServiceResult<Project> {
        validate_name(&name)?;
        let path = validate_project_path(&path, &self.project_roots)?;
        let mut project = self.store.project(id)?;
        // A saved ACP session belongs to the directory it was created in, so a
        // project with chats cannot move.
        if project.path != path && self.store.chats()?.iter().any(|c| c.project_id == id) {
            return Err(ServiceError::Conflict(
                "Move or delete the project's chats before changing its path; \
                 saved ACP sessions belong to their original directory"
                    .into(),
            ));
        }
        project.name = name;
        project.path = path;
        project.updated_at = chrono::Utc::now().to_rfc3339();
        self.store.save_project(&project)?;
        self.notify_metadata_changed()?;
        Ok(project)
    }

    pub fn delete_project(&self, id: &str) -> ServiceResult<()> {
        self.store.project(id)?;
        if self.store.chats()?.iter().any(|c| c.project_id == id) {
            return Err(ServiceError::Conflict(
                "Delete the project's chats first (project files are never deleted)".into(),
            ));
        }
        self.store.delete_project(id)?;
        self.notify_metadata_changed()?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::agents::{AgentDefinition, AgentRegistry};
    use crate::config::Config;
    use crate::events::EventLog;
    use crate::session::SessionManager;
    use crate::store::Store;
    use std::sync::Arc;

    fn test_hub(root: &std::path::Path) -> Arc<HubService> {
        let store = Arc::new(Store::open(&root.join("hub.db")).unwrap());
        let log = Arc::new(EventLog::persistent(store.clone()).unwrap());
        let agent = AgentDefinition::codex_default();
        let agents = Arc::new(AgentRegistry::new([agent]));
        let sessions = SessionManager::with_store(agents.clone(), log, Some(store.clone()));
        let mut config = Config {
            agents: agents.clone(),
            ..Default::default()
        };
        config.web.project_roots = vec![root.display().to_string()];
        HubService::new(store, sessions, agents, &config)
    }

    #[tokio::test]
    async fn register_cloned_project_enforces_path_validation() {
        let tmp = tempfile::tempdir().unwrap();
        let hub = test_hub(tmp.path());

        // Escaping / outside path rejected
        assert!(matches!(
            hub.register_cloned_project("escape".into(), "/outside/root".into()),
            Err(ServiceError::Invalid(_))
        ));

        // Non-existent path rejected
        assert!(matches!(
            hub.register_cloned_project(
                "nope".into(),
                tmp.path().join("nonexistent").display().to_string()
            ),
            Err(ServiceError::Invalid(_))
        ));

        // Valid path within project roots succeeds
        let valid_dir = tmp.path().join("cloned");
        std::fs::create_dir_all(&valid_dir).unwrap();
        let p = hub
            .register_cloned_project("cloned".into(), valid_dir.display().to_string())
            .unwrap();
        assert_eq!(p.name, "cloned");
        assert_eq!(hub.get_project(&p.id).unwrap().name, "cloned");
    }
}
