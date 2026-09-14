//! The Hub operations every control surface shares.
//!
//! HTTP handlers are adapters over this layer. A later MCP or federation
//! surface calls the same methods instead of reimplementing chat and session
//! behavior, so a chat created over one surface is immediately visible and
//! manageable on the other.
//!
//! This layer coordinates the store, the session manager, the event log, and
//! the agent registry. It never speaks ACP itself; that stays in `acp/`.
mod chats;
mod error;
mod projects;
mod view;
mod workspaces;

pub use chats::{ChatEdit, WorkspaceSelection};
pub use error::{ServiceError, ServiceResult};
pub use view::ChatView;
pub use workspaces::{WorkspaceBranch, WorkspaceOptions};

use crate::agents::AgentRegistry;
use crate::config::Config;
use crate::events::{EventLog, EventPayload};
use crate::session::{AcpSession, SessionManager};
use crate::store::Store;
use std::sync::Arc;
use std::time::Duration;

pub struct HubService {
    store: Arc<Store>,
    sessions: Arc<SessionManager>,
    events: Arc<EventLog>,
    agents: Arc<AgentRegistry>,
    workspace_lock: tokio::sync::Mutex<()>,
    /// The boundary every project path is validated against.
    project_roots: Vec<String>,
    prompt_timeout: Option<Duration>,
}

impl HubService {
    pub fn new(
        store: Arc<Store>,
        sessions: Arc<SessionManager>,
        agents: Arc<AgentRegistry>,
        config: &Config,
    ) -> Arc<Self> {
        Arc::new(Self {
            events: sessions.event_log().clone(),
            store,
            sessions,
            agents,
            workspace_lock: tokio::sync::Mutex::new(()),
            project_roots: config.web.project_roots.clone(),
            prompt_timeout: config.timeouts.prompt.map(Duration::from_secs),
        })
    }

    /// Builds the service when the session manager has a store. A session
    /// manager without one runs the legacy non-persistent routes instead.
    pub fn from_session_manager(
        sessions: Arc<SessionManager>,
        config: &Config,
    ) -> Option<Arc<Self>> {
        let store = sessions.store.clone()?;
        Some(Self::new(store, sessions, config.agents.clone(), config))
    }

    /// Sorted agent ids.
    pub fn list_agents(&self) -> Vec<String> {
        self.agents.ids()
    }

    /// Tells every connected client that project or chat metadata moved. A
    /// chat created over any surface therefore appears on the others at once.
    ///
    /// Best-effort only: the project/chat SQLite rows are authoritative, so a
    /// failure to publish the invalidation event is logged but never turns a
    /// completed mutation into an error. Turn/activity events stay fail-closed
    /// in their own call sites.
    pub(crate) fn notify_metadata_changed(&self) {
        if let Err(error) = self.events.append("", "", EventPayload::MetadataChanged {}) {
            tracing::warn!(
                %error,
                "Failed to publish metadata_changed invalidation; SQLite rows remain authoritative"
            );
        }
    }

    /// The live session for a chat, with the same distinctions the HTTP layer
    /// made before: an unknown chat is not found, and a chat whose agent left
    /// the configuration is a conflict rather than a missing chat.
    pub(crate) async fn live(&self, chat_id: &str) -> ServiceResult<Arc<AcpSession>> {
        let chat = self.store.chat(chat_id)?;
        if !self.sessions.has_agent(&chat.agent) {
            return Err(ServiceError::Conflict(
                "This chat's agent is no longer configured".into(),
            ));
        }
        self.sessions
            .get_by_id(chat_id)
            .await
            .ok_or_else(|| ServiceError::NotFound("Chat not found".into()))
    }
}
