//! Chat and turn operations.
use super::{ChatView, HubService, ServiceError, ServiceResult};
use crate::acp::callbacks::CallbackPolicy;
use crate::store::{validate_name, Chat};
use serde_json::Value;

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
        ChatView {
            chat,
            process_state,
            turn_state,
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
        if !self.sessions.has_agent(agent) {
            return Err(ServiceError::Invalid("Unknown agent".into()));
        }
        self.store.project(project_id)?;
        let chat = self
            .store
            .create_chat(project_id.to_string(), agent.to_string(), title)?;
        self.notify_metadata_changed()?;
        Ok(self.view(chat).await)
    }

    pub async fn edit_chat(&self, chat_id: &str, edit: ChatEdit) -> ServiceResult<ChatView> {
        if let Some(title) = &edit.title {
            validate_name(title)?;
        }
        let live = self.live(chat_id).await?;
        let chat = live
            .edit_metadata(edit.title, edit.archived, edit.permission_policy)
            .await?;
        self.notify_metadata_changed()?;
        Ok(self.view(chat).await)
    }

    pub async fn delete_chat(&self, chat_id: &str) -> ServiceResult<()> {
        let live = self.live(chat_id).await?;
        live.delete_metadata().await?;
        self.events.forget_chat(chat_id);
        self.sessions.remove_session(chat_id).await;
        self.notify_metadata_changed()?;
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
        tokio::spawn(async move {
            let _ = live.ask(text, timeout).await;
        });
        Ok(())
    }

    pub async fn resume_chat(&self, chat_id: &str) -> ServiceResult<ChatView> {
        if let Err(error) = self.live(chat_id).await?.resume().await {
            let message = error.to_string();
            if let Some(rest) = message.strip_prefix("saved_config_rejected:") {
                if let Some((option_id, detail)) = rest.split_once(':') {
                    return Err(ServiceError::SavedConfigRejected {
                        option_id: option_id.to_string(),
                        message: detail.to_string(),
                    });
                }
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
        Ok(self.live(chat_id).await?.config_options().await)
    }

    pub async fn set_chat_config(
        &self,
        chat_id: &str,
        option_id: &str,
        value: Value,
    ) -> ServiceResult<Value> {
        Ok(self
            .live(chat_id)
            .await?
            .set_config(option_id, value)
            .await?)
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
