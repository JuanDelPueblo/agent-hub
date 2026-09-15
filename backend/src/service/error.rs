//! A transport-neutral error for Hub operations.
//!
//! The HTTP layer maps these to status codes. A later MCP or federation
//! adapter maps the same variants to its own error shape, so the operations
//! themselves never name a transport.

use std::path::PathBuf;

#[derive(Debug)]
pub enum ServiceError {
    NotFound(String),
    Invalid(String),
    Conflict(String),
    Unavailable(String),
    Timeout(String),
    SavedConfigRejected {
        option_id: String,
        message: String,
    },
    EnvrcBlocked {
        path: PathBuf,
        relative_path: String,
        message: String,
    },
    /// The agent needs authentication before it can serve the request. The
    /// chat, its session row, and its history all stay intact, so the user
    /// authenticates the agent and continues.
    AuthRequired {
        agent_id: String,
        message: String,
    },
    Internal(anyhow::Error),
}

pub type ServiceResult<T> = std::result::Result<T, ServiceError>;

impl std::fmt::Display for ServiceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotFound(m)
            | Self::Invalid(m)
            | Self::Conflict(m)
            | Self::Unavailable(m)
            | Self::Timeout(m) => f.write_str(m),
            Self::SavedConfigRejected { message, .. } => f.write_str(message),
            Self::EnvrcBlocked { .. } => {
                f.write_str("This project's workspace environment needs approval.")
            }
            Self::AuthRequired { message, .. } => f.write_str(message),
            Self::Internal(e) => write!(f, "{e}"),
        }
    }
}

impl std::error::Error for ServiceError {}

impl From<crate::store::StoreError> for ServiceError {
    fn from(e: crate::store::StoreError) -> Self {
        match e {
            crate::store::StoreError::NotFound(m) => Self::NotFound(m),
            crate::store::StoreError::Validation(m) => Self::Invalid(m),
            crate::store::StoreError::Internal(e) => Self::Internal(e),
        }
    }
}

/// An error that bubbles out of the session is a bad request or conflict.
/// The HTTP layer answered those with 400 before the service layer existed,
/// and that contract is asserted by the integration tests.
impl From<anyhow::Error> for ServiceError {
    fn from(e: anyhow::Error) -> Self {
        // Recognized from the stable ACP error code, never from the wording
        // of an agent's message.
        if let Some(auth) = e.downcast_ref::<crate::acp::AuthRequired>() {
            return Self::AuthRequired {
                agent_id: auth.agent.clone(),
                message: format!(
                    "Agent '{}' requires authentication before it can continue",
                    auth.agent
                ),
            };
        }
        if let Some(env_err) = e.downcast_ref::<crate::workspace_env::WorkspaceEnvError>() {
            match env_err {
                crate::workspace_env::WorkspaceEnvError::EnvrcBlocked {
                    path,
                    relative_path,
                    message,
                } => {
                    return Self::EnvrcBlocked {
                        path: path.clone(),
                        relative_path: relative_path.clone(),
                        message: message.clone(),
                    };
                }
                _ => return Self::Invalid(e.to_string()),
            }
        }
        Self::Invalid(e.to_string())
    }
}

impl From<crate::workspace_env::WorkspaceEnvError> for ServiceError {
    fn from(e: crate::workspace_env::WorkspaceEnvError) -> Self {
        match e {
            crate::workspace_env::WorkspaceEnvError::EnvrcBlocked {
                path,
                relative_path,
                message,
            } => Self::EnvrcBlocked {
                path,
                relative_path,
                message,
            },
            _ => Self::Invalid(e.to_string()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn message_survives_conversion() {
        let e: ServiceError = anyhow::anyhow!("Chat is archived").into();
        assert!(matches!(e, ServiceError::Invalid(_)));
        assert_eq!(e.to_string(), "Chat is archived");
    }

    #[test]
    fn every_variant_displays_its_message() {
        assert_eq!(ServiceError::NotFound("gone".into()).to_string(), "gone");
        assert_eq!(ServiceError::Conflict("busy".into()).to_string(), "busy");
        assert_eq!(ServiceError::Timeout("slow".into()).to_string(), "slow");
        assert_eq!(
            ServiceError::SavedConfigRejected {
                option_id: "model".into(),
                message: "rejected".into()
            }
            .to_string(),
            "rejected"
        );
        assert_eq!(
            ServiceError::Internal(anyhow::anyhow!("boom")).to_string(),
            "boom"
        );
    }

    #[test]
    fn envrc_blocked_displays_a_fixed_friendly_message_never_the_raw_diagnostic() {
        let err = ServiceError::EnvrcBlocked {
            path: PathBuf::from("/home/user/.local/state/batey/worktrees/chat-abc123/.envrc"),
            relative_path: ".envrc".into(),
            message: "direnv: error /home/user/.../.envrc is blocked. Run `direnv allow`.".into(),
        };
        assert_eq!(
            err.to_string(),
            "This project's workspace environment needs approval."
        );
        assert!(!err.to_string().contains("direnv"));
        assert!(!err.to_string().contains("chat-abc123"));
    }
}
