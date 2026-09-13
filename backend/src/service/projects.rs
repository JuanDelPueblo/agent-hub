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
        self.notify_metadata_changed();
        Ok(project)
    }

    /// Registers a directory that is already on disk, such as a finished clone.
    /// The caller has canonicalized the path, so this does not re-derive it.
    pub fn register_cloned_project(
        &self,
        name: String,
        canonical_path: String,
    ) -> ServiceResult<Project> {
        let project = self.store.create_project(name, canonical_path)?;
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

    pub fn delete_project(&self, id: &str) -> ServiceResult<()> {
        if self.store.chats()?.iter().any(|c| c.project_id == id) {
            return Err(ServiceError::Conflict(
                "Delete the project's chats first (project files are never deleted)".into(),
            ));
        }
        self.store.delete_project(id)?;
        self.notify_metadata_changed();
        Ok(())
    }
}
