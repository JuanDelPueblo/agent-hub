//! Project operations.
use super::chats::map_chat_deletion_error;
use super::workspaces::workspace_error;
use super::{HubService, ServiceError, ServiceResult};
use crate::state::TurnState;
use crate::store::{validate_name, validate_project_path, Chat, Project};
use crate::workspace;

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
        self.notify_metadata_changed();
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
        self.notify_metadata_changed();
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
        self.notify_metadata_changed();
        Ok(project)
    }

    /// Deletes a project and every chat it owns as one cascading Batey
    /// metadata operation. Project files at `Project.path` are never
    /// touched; only the project registration and its chats' durable
    /// metadata (and any managed worktrees they own) go away.
    ///
    /// A preflight pass runs before any chat is deleted, so a predictable
    /// blocker (an active turn/task, a dirty managed worktree, or an
    /// external additional-root reference) is reported without leaving the
    /// project half-deleted.
    pub async fn delete_project(&self, id: &str) -> ServiceResult<()> {
        self.store.project(id)?;
        if self
            .store
            .additional_root_references_project_externally(id)?
        {
            return Err(ServiceError::Conflict(
                "Remove this project from every other chat's additional workspace roots before deleting it".into(),
            ));
        }
        let chats: Vec<Chat> = self
            .store
            .chats()?
            .into_iter()
            .filter(|c| c.project_id == id)
            .collect();

        self.preflight_project_chat_deletion(&chats).await?;

        // Delete every owned chat through the same safe path a standalone
        // chat deletion uses, so worktree/session/event cleanup is
        // identical either way. A conflict discovered here despite the
        // preflight above (a race) can still leave some chats already
        // removed; making that impossible would require one Git transaction
        // across every managed worktree, which Git does not offer.
        for chat in &chats {
            self.delete_chat(&chat.id).await?;
        }

        self.store.delete_project(id)?;
        self.notify_metadata_changed();
        Ok(())
    }

    /// Detects blockers before any of the project's chats is deleted: an
    /// active turn, an active terminal task, or a dirty managed worktree.
    /// Finding one after half the project's chats are already gone would
    /// leave the project in a confusing, hard-to-recover partial state.
    async fn preflight_project_chat_deletion(&self, chats: &[Chat]) -> ServiceResult<()> {
        for chat in chats {
            if self.sessions.has_agent(&chat.agent) {
                if let Some(session) = self.sessions.get_by_id(&chat.id).await {
                    if session.turn_state().await != TurnState::Idle {
                        return Err(ServiceError::Conflict(format!(
                            "Chat '{}' has an active turn; wait for it or cancel it before deleting the project",
                            chat.title
                        )));
                    }
                }
            }
            if self
                .sessions
                .task_tracker()
                .active_task_count(&chat.id)
                .await
                > 0
            {
                return Err(ServiceError::Conflict(format!(
                    "Chat '{}' has an active task; wait for it or stop it before deleting the project",
                    chat.title
                )));
            }
            let managed_cleanup = crate::session::resolve_managed_cleanup(&self.store, chat)
                .await
                .map_err(map_chat_deletion_error)?;
            if let Some((repository_root, worktree_root, branch)) = managed_cleanup {
                let chat_id = chat.id.clone();
                let dirty = tokio::task::spawn_blocking(move || {
                    workspace::managed_worktree_dirty(
                        &repository_root,
                        &worktree_root,
                        &chat_id,
                        &branch,
                    )
                })
                .await
                .map_err(|error| ServiceError::Internal(anyhow::anyhow!(error)))?
                .map_err(workspace_error)?;
                if dirty {
                    return Err(ServiceError::Conflict(format!(
                        "Chat '{}' has unsaved changes in its managed worktree; commit or discard them before deleting the project",
                        chat.title
                    )));
                }
            }
        }
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
