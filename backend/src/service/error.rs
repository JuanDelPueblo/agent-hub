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
    SavedConfigRejected { option_id: String, message: String },
    EnvrcBlocked { path: PathBuf, message: String },
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
            Self::EnvrcBlocked { message, .. } => f.write_str(message),
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
        if let Some(env_err) = e.downcast_ref::<crate::workspace_env::WorkspaceEnvError>() {
            match env_err {
                crate::workspace_env::WorkspaceEnvError::EnvrcBlocked { path, message } => {
                    return Self::EnvrcBlocked {
                        path: path.clone(),
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
            crate::workspace_env::WorkspaceEnvError::EnvrcBlocked { path, message } => {
                Self::EnvrcBlocked { path, message }
            }
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
            ServiceError::EnvrcBlocked {
                path: PathBuf::from("/test/.envrc"),
                message: "blocked".into()
            }
            .to_string(),
            "blocked"
        );
        assert_eq!(
            ServiceError::Internal(anyhow::anyhow!("boom")).to_string(),
            "boom"
        );
    }
}
