use crate::agents::{AgentCatalog, AgentDefinition};
use std::sync::Arc;

#[derive(Debug, Clone)]
pub struct Config {
    pub server: ServerConfig,
    /// Shared with `SessionManager`, so the two can never drift apart.
    pub agents: Arc<AgentCatalog>,
    pub timeouts: TimeoutConfig,
    pub web: WebConfig,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            server: ServerConfig::default(),
            agents: Arc::new(AgentCatalog::new([
                AgentDefinition::codex_default(),
                AgentDefinition::antigravity_default(),
                AgentDefinition::opencode_default(),
                AgentDefinition::claudecode_default(),
            ])),
            timeouts: TimeoutConfig::default(),
            web: WebConfig::default(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct ServerConfig {
    pub port: u16,
    pub host: String,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            port: 8765,
            host: "127.0.0.1".to_string(),
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct TimeoutConfig {
    pub prompt: Option<u64>,
}

#[derive(Debug, Clone, Default)]
pub struct WebConfig {
    pub auth_token: Option<String>,
    pub project_root: String,
    pub public_origin: Option<String>,
    pub project_roots: Vec<String>,
}

impl Config {
    pub fn get_agent(&self, id: &str) -> Option<Arc<AgentDefinition>> {
        self.agents.definition(id)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_config() {
        let config = Config::default();
        assert_eq!(
            config.agents.ids(),
            vec!["antigravity", "claude", "codex", "opencode"]
        );
        assert_eq!(config.server.port, 8765);
        assert_eq!(config.server.host, "127.0.0.1");
        assert_eq!(config.timeouts.prompt, None);
        assert!(config.web.auth_token.is_none());
    }

    #[test]
    fn get_agent() {
        let config = Config::default();
        assert_eq!(
            config.get_agent("codex").unwrap().launch.command,
            "codex-acp"
        );
        assert!(config.get_agent("nonexistent").is_none());
    }
}
