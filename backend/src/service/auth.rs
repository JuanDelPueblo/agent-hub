//! Agent-level authentication operations every control surface shares.
//!
//! `AgentAuthService` owns the ACP and PTY work. This layer adds the Hub
//! rules: which agent ids exist, and how a failure becomes a transport-neutral
//! error. An HTTP handler calls these methods and maps the error; it never
//! decides which authentication method to run.
use super::{HubService, ServiceError, ServiceResult};
use crate::auth::{AgentAuthError, AgentAuthView, TerminalAuthFlow, TerminalAuthFlowView};
use std::sync::Arc;

impl From<AgentAuthError> for ServiceError {
    fn from(error: AgentAuthError) -> Self {
        match error {
            AgentAuthError::NotFound(message) => Self::NotFound(message),
            AgentAuthError::Invalid(message) => Self::Invalid(message),
            AgentAuthError::Conflict(message) => Self::Conflict(message),
            AgentAuthError::Unavailable(message) => Self::Unavailable(message),
            AgentAuthError::Internal(error) => Self::Internal(error),
        }
    }
}

impl HubService {
    /// The authentication methods and capabilities one agent advertises.
    pub async fn agent_auth(&self, agent_id: &str) -> ServiceResult<AgentAuthView> {
        Ok(self.agent_auth.auth_view(agent_id).await?)
    }

    /// Runs one advertised `agent` authentication method.
    pub async fn authenticate_agent(
        &self,
        agent_id: &str,
        method_id: &str,
    ) -> ServiceResult<AgentAuthView> {
        Ok(self.agent_auth.authenticate(agent_id, method_id).await?)
    }

    /// Runs the capability-gated stable logout method.
    ///
    /// Pueblo Hub chats, sessions, and history stay exactly as they are.
    pub async fn logout_agent(&self, agent_id: &str) -> ServiceResult<AgentAuthView> {
        Ok(self.agent_auth.logout(agent_id).await?)
    }

    /// Starts a terminal authentication flow for one advertised `terminal`
    /// method.
    pub async fn start_terminal_auth(
        &self,
        agent_id: &str,
        method_id: &str,
    ) -> ServiceResult<TerminalAuthFlowView> {
        Ok(self.agent_auth.start_terminal(agent_id, method_id).await?)
    }

    pub fn terminal_auth_flow(&self, flow_id: &str) -> ServiceResult<TerminalAuthFlowView> {
        Ok(self.agent_auth.terminal_flow_view(flow_id)?)
    }

    pub fn cancel_terminal_auth(&self, flow_id: &str) -> ServiceResult<TerminalAuthFlowView> {
        Ok(self.agent_auth.cancel_terminal_flow(flow_id)?)
    }

    /// The live flow one socket attaches to.
    pub fn terminal_auth_socket(&self, flow_id: &str) -> ServiceResult<Arc<TerminalAuthFlow>> {
        Ok(self.agent_auth.terminal_flow(flow_id)?)
    }
}
