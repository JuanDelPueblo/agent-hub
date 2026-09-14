//! Chat and turn operations.
use super::{workspaces::workspace_error, ChatView, HubService, ServiceError, ServiceResult};
use crate::acp::callbacks::CallbackPolicy;
use crate::store::{validate_name, Chat, ChatWorkspace, WorkspaceMode};
use crate::workspace::{self, BranchInfo, ManagedPaths, RepoInfo};
use serde::Deserialize;
use serde_json::Value;
use std::collections::HashMap;
use std::path::{Path, PathBuf};

/// Optional workspace selection supplied with chat creation.
#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct WorkspaceSelection {
    pub mode: WorkspaceMode,
    pub branch: Option<String>,
}

/// The fields `edit_chat` may change. `None` leaves a field alone.
#[derive(Debug, Default, Clone)]
pub struct ChatEdit {
    pub title: Option<String>,
    pub archived: Option<bool>,
    pub permission_policy: Option<CallbackPolicy>,
}

/// A prompt must fit this range. The limit keeps one request from filling the
/// event log and the agent's context at once.
const MAX_PROMPT_BYTES: usize = 100_000;

impl HubService {
    /// Adds the live process and turn state to a stored chat. A chat with no
    /// live session reads as stopped and idle.
    pub(crate) async fn view(&self, chat: Chat) -> ChatView {
        let (process_state, turn_state) = match self.sessions.get_by_id(&chat.id).await {
            Some(live) => (
                live.process_state().await.to_string(),
                live.turn_state().await.to_string(),
            ),
            None => ("STOPPED".into(), "IDLE".into()),
        };
        let workspace = match self.store.workspace(&chat.id) {
            Ok(workspace) => workspace.map(Into::into),
            Err(error) => {
                tracing::warn!(
                    chat_id = %chat.id,
                    %error,
                    "Failed to read chat workspace metadata; omitting display summary"
                );
                None
            }
        };
        ChatView {
            chat,
            process_state,
            turn_state,
            workspace,
        }
    }

    pub async fn list_chats(&self, project_id: &str) -> ServiceResult<Vec<ChatView>> {
        self.store.project(project_id)?;
        let chats: Vec<Chat> = self
            .store
            .chats()?
            .into_iter()
            .filter(|c| c.project_id == project_id)
            .collect();
        let mut views = Vec::with_capacity(chats.len());
        for chat in chats {
            views.push(self.view(chat).await);
        }
        Ok(views)
    }

    pub async fn get_chat(&self, chat_id: &str) -> ServiceResult<ChatView> {
        let chat = self.store.chat(chat_id)?;
        Ok(self.view(chat).await)
    }

    pub async fn create_chat(
        &self,
        project_id: &str,
        agent: &str,
        title: Option<String>,
    ) -> ServiceResult<ChatView> {
        self.create_chat_with_workspace(project_id, agent, title, None)
            .await
    }

    /// Create a chat and, for Git projects, provision its selected workspace
    /// before publishing either row or the metadata invalidation event.
    pub async fn create_chat_with_workspace(
        &self,
        project_id: &str,
        agent: &str,
        title: Option<String>,
        selection: Option<WorkspaceSelection>,
    ) -> ServiceResult<ChatView> {
        if !self.sessions.has_agent(agent) {
            return Err(ServiceError::Invalid("Unknown agent".into()));
        }
        let project = self.store.project(project_id)?;
        let _workspace_guard = self.workspace_lock.lock().await;
        let project_path = PathBuf::from(&project.path);
        let (info, branches) = inspect_with_branches(project_path.clone()).await?;

        if !info.is_git {
            if selection.is_some() {
                return Err(ServiceError::Invalid(
                    "Git workspace selection is only valid for Git projects".into(),
                ));
            }
            let chat = self
                .store
                .create_chat(project_id.to_string(), agent.to_string(), title)?;
            self.notify_metadata_changed();
            return Ok(self.view(chat).await);
        }

        let root = info
            .root
            .clone()
            .ok_or_else(|| ServiceError::Internal(anyhow::anyhow!("Git root is unavailable")))?;
        let project_subdir = info
            .subdir
            .clone()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned();
        let project_id_owned = project_id.to_string();
        let chat = self
            .store
            .new_chat(project_id.to_string(), agent.to_string(), title)?;
        let mode = selection
            .as_ref()
            .map(|choice| choice.mode)
            .unwrap_or(WorkspaceMode::ManagedWorktree);
        let requested_branch = selection
            .as_ref()
            .and_then(|choice| choice.branch.as_deref())
            .map(str::trim)
            .filter(|branch| !branch.is_empty())
            .map(ToOwned::to_owned);
        // Every direct checkout operation must reserve the same mutex that
        // direct and legacy turns use. The branch in `info` is only a
        // snapshot from before this reservation.
        let _checkout_guard = (mode == WorkspaceMode::ProjectCheckout)
            .then(|| {
                self.sessions
                    .try_acquire_checkout_guard(&root)
                    .map_err(|error| ServiceError::Conflict(error.to_string()))
            })
            .transpose()?;

        let (workspace, managed_paths) = match mode {
            WorkspaceMode::ManagedWorktree => {
                let base_commit = match requested_branch.as_deref() {
                    Some(branch) => local_branch_sha(&branches, branch)?,
                    None => {
                        if info.dirty {
                            return Err(ServiceError::Conflict(
                                "Git checkout is dirty; choose an explicit workspace mode and branch"
                                    .into(),
                            ));
                        }
                        info.head_sha.clone().ok_or_else(|| {
                            ServiceError::Invalid("Git HEAD is not a commit".into())
                        })?
                    }
                };
                let repo_for_blocking = root.clone();
                let workspace_root = self.store.managed_worktree_root();
                let chat_id = chat.id.clone();
                let cleanup_chat_id = chat_id.clone();
                let subdir = PathBuf::from(&project_subdir);
                let provision_base_commit = base_commit.clone();
                let (paths, workspace) = tokio::task::spawn_blocking(move || {
                    let paths = workspace::provision_managed(
                        &repo_for_blocking,
                        &workspace_root,
                        &chat_id,
                        &provision_base_commit,
                    )
                    .map_err(workspace_error)?;
                    let effective = paths.worktree.join(&subdir);
                    if !effective.is_dir() {
                        let message = format!(
                            "Project subdirectory does not exist in managed worktree: {}",
                            subdir.display()
                        );
                        let cleanup = cleanup_managed(
                            &repo_for_blocking,
                            &workspace_root,
                            &paths,
                            &cleanup_chat_id,
                            &provision_base_commit,
                        );
                        return Err(managed_cleanup_error(message, cleanup));
                    }
                    let workspace = ChatWorkspace::new(
                        chat_id,
                        project_id_owned,
                        WorkspaceMode::ManagedWorktree,
                        repo_for_blocking.to_string_lossy().into_owned(),
                        paths.worktree.to_string_lossy().into_owned(),
                        subdir.to_string_lossy().into_owned(),
                        Some(paths.branch.clone()),
                        Some(provision_base_commit),
                    );
                    Ok::<_, ServiceError>((paths, workspace))
                })
                .await
                .map_err(|error| ServiceError::Internal(anyhow::anyhow!(error)))??;
                (workspace, Some((paths, base_commit)))
            }
            WorkspaceMode::ProjectCheckout => {
                let (current_info, _) = inspect_with_branches(project_path.clone()).await?;
                let branch = requested_branch
                    .or(current_info.branch.clone())
                    .ok_or_else(|| {
                        ServiceError::Conflict(
                            "Project checkout mode requires an attached local branch".into(),
                        )
                    })?;
                // `prepare_direct` refuses dirty branch switches, but a live
                // direct/legacy chat must be checked before we ask it to do so.
                if current_info.branch.as_deref() != Some(branch.as_str()) {
                    self.ensure_primary_checkout_available(&root).await?;
                }
                let repo_for_blocking = root.clone();
                let subdir = PathBuf::from(&project_subdir);
                let branch_for_blocking = branch.clone();
                let base_commit = tokio::task::spawn_blocking(move || {
                    workspace::prepare_direct(&repo_for_blocking, &branch_for_blocking)
                        .map_err(workspace_error)?;
                    let effective = repo_for_blocking.join(&subdir);
                    if !effective.is_dir() {
                        return Err(ServiceError::Invalid(format!(
                            "Project subdirectory does not exist in project checkout: {}",
                            subdir.display()
                        )));
                    }
                    workspace::resolve_ref(&repo_for_blocking, &branch_for_blocking)
                        .map_err(workspace_error)
                })
                .await
                .map_err(|error| ServiceError::Internal(anyhow::anyhow!(error)))??;
                let workspace = ChatWorkspace::new(
                    chat.id.clone(),
                    project_id.to_string(),
                    WorkspaceMode::ProjectCheckout,
                    root.to_string_lossy().into_owned(),
                    root.to_string_lossy().into_owned(),
                    project_subdir,
                    Some(branch),
                    Some(base_commit),
                );
                (workspace, None)
            }
        };

        if let Err(error) = self.store.insert_chat_with_workspace(&chat, &workspace) {
            if let Some((paths, base_commit)) = managed_paths {
                let repo = root.clone();
                let workspace_root = self.store.managed_worktree_root();
                let chat_id = chat.id.clone();
                let cleanup = tokio::task::spawn_blocking(move || {
                    cleanup_managed(&repo, &workspace_root, &paths, &chat_id, &base_commit)
                })
                .await
                .map_err(|join| ServiceError::Internal(anyhow::anyhow!(join)))?;
                if let Err(cleanup_error) = cleanup {
                    tracing::error!(
                        chat_id = %chat.id,
                        %cleanup_error,
                        "Managed chat creation persistence failed; orphan branch/worktree preserved"
                    );
                    return Err(ServiceError::Internal(anyhow::anyhow!(
                        "Could not persist chat: {error}; cleanup did not complete: {cleanup_error}"
                    )));
                }
            }
            return Err(ServiceError::Internal(anyhow::anyhow!(
                "Could not persist chat: {error}"
            )));
        }
        self.notify_metadata_changed();
        Ok(self.view(chat).await)
    }

    async fn ensure_primary_checkout_available(&self, repository_root: &Path) -> ServiceResult<()> {
        let chats = self.store.chats()?;
        let projects = self.store.projects()?;
        let workspaces = self.store.list_workspaces()?;
        let root = repository_root.to_path_buf();
        let direct_chat_ids = tokio::task::spawn_blocking(move || {
            let project_paths: HashMap<_, _> = projects
                .into_iter()
                .map(|project| (project.id, PathBuf::from(project.path)))
                .collect();
            let mut ids = Vec::new();
            for chat in chats {
                let workspace = workspaces.iter().find(|ws| ws.chat_id == chat.id);
                match workspace {
                    Some(ws) if ws.mode == WorkspaceMode::ManagedWorktree => continue,
                    Some(ws)
                        if ws.mode == WorkspaceMode::ProjectCheckout
                            && Path::new(&ws.repository_root) == root =>
                    {
                        ids.push(chat.id);
                    }
                    None => {
                        let Some(path) = project_paths.get(&chat.project_id) else {
                            continue;
                        };
                        let info = workspace::inspect(path).map_err(workspace_error)?;
                        if info.root.as_ref() == Some(&root) {
                            ids.push(chat.id);
                        }
                    }
                    _ => {}
                }
            }
            Ok::<_, ServiceError>(ids)
        })
        .await
        .map_err(|error| ServiceError::Internal(anyhow::anyhow!(error)))??;

        for chat_id in direct_chat_ids {
            if let Some(session) = self.sessions.get_by_id(&chat_id).await {
                if session.process_state().await.is_running() {
                    return Err(ServiceError::Conflict(format!(
                        "Cannot switch the primary checkout while chat {chat_id} has a live Agent Hub process"
                    )));
                }
            }
        }
        Ok(())
    }

    pub async fn edit_chat(&self, chat_id: &str, edit: ChatEdit) -> ServiceResult<ChatView> {
        if let Some(title) = &edit.title {
            validate_name(title)?;
        }
        let live = self.live(chat_id).await?;
        let chat = live
            .edit_metadata(edit.title, edit.archived, edit.permission_policy)
            .await?;
        self.notify_metadata_changed();
        Ok(self.view(chat).await)
    }

    pub async fn delete_chat(&self, chat_id: &str) -> ServiceResult<()> {
        let live = self.live(chat_id).await?;
        live.delete_metadata().await.map_err(|error| {
            if let Some(error) = error.downcast_ref::<workspace::WorkspaceError>() {
                return match error {
                    workspace::WorkspaceError::Conflict(message) => {
                        ServiceError::Conflict(message.clone())
                    }
                    workspace::WorkspaceError::Failed(message) => {
                        ServiceError::Invalid(message.clone())
                    }
                };
            }
            ServiceError::Invalid(error.to_string())
        })?;
        self.events.forget_chat(chat_id);
        self.sessions.remove_session(chat_id).await;
        self.notify_metadata_changed();
        Ok(())
    }

    /// Starts a turn and returns as soon as it is accepted.
    ///
    /// The turn runs in a task that owns the session, so a client that
    /// disconnects cannot cancel work the agent already started. Every
    /// completion and failure reaches the caller over the event stream.
    pub async fn prompt_chat(&self, chat_id: &str, text: String) -> ServiceResult<()> {
        if text.trim().is_empty() || text.len() > MAX_PROMPT_BYTES {
            return Err(ServiceError::Invalid(format!(
                "Prompt must contain 1–{MAX_PROMPT_BYTES} bytes"
            )));
        }
        let live = self.live(chat_id).await?;
        let timeout = self.prompt_timeout;
        if let Err(error) = live.start_turn(text, timeout).await {
            if let Some(rejected) = error.downcast_ref::<crate::acp::SavedConfigRejected>() {
                return Err(ServiceError::SavedConfigRejected {
                    option_id: rejected.option_id.clone(),
                    message: rejected.message.clone(),
                });
            }
            return Err(error.into());
        }
        Ok(())
    }

    pub async fn resume_chat(&self, chat_id: &str) -> ServiceResult<ChatView> {
        if let Err(error) = self.live(chat_id).await?.resume().await {
            if let Some(rejected) = error.downcast_ref::<crate::acp::SavedConfigRejected>() {
                return Err(ServiceError::SavedConfigRejected {
                    option_id: rejected.option_id.clone(),
                    message: rejected.message.clone(),
                });
            }
            return Err(error.into());
        }
        let chat = self.store.chat(chat_id)?;
        Ok(self.view(chat).await)
    }

    pub async fn clear_saved_config(&self, chat_id: &str, option_id: &str) -> ServiceResult<()> {
        let live = self.live(chat_id).await?;
        if live.turn_state().await != crate::state::TurnState::Idle {
            return Err(ServiceError::Conflict(
                "Wait for the active turn before resetting configuration".into(),
            ));
        }
        let chat = self.store.update_chat(chat_id, |chat| {
            if let Some(values) = chat.config_values.as_object_mut() {
                values.remove(option_id);
            }
        })?;
        if chat.config_values.get(option_id).is_some() {
            return Err(ServiceError::Internal(anyhow::anyhow!(
                "Failed to reset saved configuration"
            )));
        }
        Ok(())
    }

    pub async fn cancel_chat(&self, chat_id: &str) -> ServiceResult<()> {
        self.live(chat_id).await?.cancel().await?;
        Ok(())
    }

    pub async fn stop_chat(&self, chat_id: &str) -> ServiceResult<()> {
        self.live(chat_id).await?.stop().await?;
        Ok(())
    }

    pub async fn chat_config(&self, chat_id: &str) -> ServiceResult<Value> {
        let live = self.live(chat_id).await?;
        if let Err(error) = live.ensure_running().await {
            if let Some(rejected) = error.downcast_ref::<crate::acp::SavedConfigRejected>() {
                return Err(ServiceError::SavedConfigRejected {
                    option_id: rejected.option_id.clone(),
                    message: rejected.message.clone(),
                });
            }
            return Err(error.into());
        }
        Ok(live.config_options().await)
    }

    pub async fn set_chat_config(
        &self,
        chat_id: &str,
        option_id: &str,
        value: Value,
    ) -> ServiceResult<Value> {
        let live = self.live(chat_id).await?;
        match live.set_config(option_id, value).await {
            Ok(v) => Ok(v),
            Err(error) => {
                if let Some(rejected) = error.downcast_ref::<crate::acp::SavedConfigRejected>() {
                    Err(ServiceError::SavedConfigRejected {
                        option_id: rejected.option_id.clone(),
                        message: rejected.message.clone(),
                    })
                } else {
                    Err(error.into())
                }
            }
        }
    }

    pub async fn remote_sessions(
        &self,
        chat_id: &str,
        cursor: Option<String>,
    ) -> ServiceResult<Value> {
        Ok(self
            .live(chat_id)
            .await?
            .list_remote_sessions(cursor)
            .await?)
    }
}

async fn inspect_with_branches(path: PathBuf) -> ServiceResult<(RepoInfo, Vec<BranchInfo>)> {
    tokio::task::spawn_blocking(move || {
        let info = workspace::inspect(&path).map_err(workspace_error)?;
        let branches = match info.root.as_deref() {
            Some(root) => workspace::list_local_branches(root).map_err(workspace_error)?,
            None => Vec::new(),
        };
        Ok::<_, ServiceError>((info, branches))
    })
    .await
    .map_err(|error| ServiceError::Internal(anyhow::anyhow!(error)))?
}

fn local_branch_sha(branches: &[BranchInfo], branch: &str) -> ServiceResult<String> {
    branches
        .iter()
        .find(|candidate| candidate.name == branch)
        .map(|candidate| candidate.sha.clone())
        .ok_or_else(|| ServiceError::Invalid(format!("Local branch does not exist: {branch}")))
}

fn cleanup_managed(
    repository_root: &Path,
    workspace_root: &Path,
    paths: &ManagedPaths,
    chat_id: &str,
    base_commit: &str,
) -> Result<(), String> {
    workspace::remove_managed(repository_root, workspace_root, chat_id).map_err(|error| {
        format!(
            "managed worktree removal was refused ({error}); preserved branch {} and worktree {}",
            paths.branch,
            paths.worktree.display()
        )
    })?;
    workspace::rollback_provision(repository_root, &paths.branch, base_commit, true).map_err(
        |error| {
            format!(
                "managed branch rollback was refused ({error}); preserved branch {} after removing worktree {}",
                paths.branch,
                paths.worktree.display()
            )
        },
    )
}

fn managed_cleanup_error(message: String, cleanup: Result<(), String>) -> ServiceError {
    match cleanup {
        Ok(()) => ServiceError::Invalid(message),
        Err(cleanup_error) => ServiceError::Internal(anyhow::anyhow!("{message}; {cleanup_error}")),
    }
}
