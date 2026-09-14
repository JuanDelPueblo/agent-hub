//! Workspace discovery shared by the HTTP and other Hub surfaces.

use super::{HubService, ServiceError, ServiceResult};
use crate::workspace::{self, WorkspaceError};
use serde::Serialize;
use std::path::PathBuf;

/// The Git choices available when creating a chat.
///
/// Server-side repository and worktree paths intentionally do not appear in
/// this transport shape. They are durable implementation metadata, not UI
/// display data.
#[derive(Debug, Clone, Serialize)]
pub struct WorkspaceOptions {
    pub is_git: bool,
    pub current_branch: Option<String>,
    pub head_sha: Option<String>,
    pub dirty: bool,
    pub branches: Vec<WorkspaceBranch>,
}

#[derive(Debug, Clone, Serialize)]
pub struct WorkspaceBranch {
    pub name: String,
    pub sha: String,
    pub current: bool,
}

pub(crate) fn workspace_error(error: WorkspaceError) -> ServiceError {
    match error {
        WorkspaceError::Conflict(message) => ServiceError::Conflict(message),
        WorkspaceError::Failed(message) => ServiceError::Invalid(message),
    }
}

impl HubService {
    /// Inspect the project's effective Git repository and list local branches.
    /// All Git commands run on the blocking pool because the workspace engine
    /// deliberately uses synchronous Git plumbing.
    pub async fn workspace_options(&self, project_id: &str) -> ServiceResult<WorkspaceOptions> {
        let project = self.store.project(project_id)?;
        let path = PathBuf::from(project.path);
        let result = tokio::task::spawn_blocking(move || {
            let info = workspace::inspect(&path)?;
            let branches = if info.is_git {
                let root = info
                    .root
                    .as_deref()
                    .ok_or_else(|| WorkspaceError::Failed("Git root is unavailable".into()))?;
                workspace::list_local_branches(root)?
            } else {
                Vec::new()
            };
            Ok::<_, WorkspaceError>((info, branches))
        })
        .await
        .map_err(|error| ServiceError::Internal(anyhow::anyhow!(error)))?
        .map_err(workspace_error)?;

        let (info, branches) = result;
        let branches = branches
            .into_iter()
            .map(|branch| WorkspaceBranch {
                name: branch.name,
                sha: branch.sha,
                current: branch.current,
            })
            .collect();
        Ok(WorkspaceOptions {
            is_git: info.is_git,
            current_branch: info.branch,
            head_sha: info.head_sha,
            dirty: info.dirty,
            branches,
        })
    }
}
