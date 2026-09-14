use crate::agents::{
    registry::{default_fetch, HttpFetch, RegistryClient, DEFAULT_REGISTRY_URL},
    AgentCatalog, AgentDefinition, AgentManager,
};
use std::{
    env,
    path::{Path, PathBuf},
    sync::Arc,
};

const APP_NAME: &str = "pueblo-hub";

/// All filesystem locations owned by Pueblo Hub.
///
/// An explicitly supplied database keeps the historical layout: managed
/// worktrees remain beside that database. Defaults are only used when no
/// database was supplied, so starting a newer binary cannot relocate an
/// existing installation implicitly.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PuebloPaths {
    pub data_dir: PathBuf,
    pub config_dir: PathBuf,
    pub state_dir: PathBuf,
    pub log_dir: PathBuf,
    pub database: PathBuf,
    pub managed_worktrees: PathBuf,
    pub registry_cache: PathBuf,
    pub installed_agents: PathBuf,
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct PathOverrides {
    pub database: Option<PathBuf>,
    pub data_dir: Option<PathBuf>,
    pub config_dir: Option<PathBuf>,
    pub state_dir: Option<PathBuf>,
    pub log_dir: Option<PathBuf>,
    pub managed_worktrees: Option<PathBuf>,
}

impl PuebloPaths {
    pub fn from_overrides(overrides: PathOverrides) -> Self {
        let explicit_database = overrides.database.is_some();
        let database = overrides.database.clone().unwrap_or_else(|| {
            overrides
                .data_dir
                .clone()
                .unwrap_or_else(default_data_dir)
                .join("pueblo-hub.sqlite3")
        });
        let data_dir = overrides.data_dir.unwrap_or_else(default_data_dir);
        let config_dir = overrides.config_dir.unwrap_or_else(default_config_dir);
        let state_dir = overrides.state_dir.unwrap_or_else(|| {
            if explicit_database {
                PuebloPaths::state_dir_for_database(&database)
            } else {
                default_state_dir()
            }
        });
        let log_dir = overrides.log_dir.unwrap_or_else(|| state_dir.join("logs"));
        let managed_worktrees = overrides.managed_worktrees.unwrap_or_else(|| {
            if explicit_database {
                database
                    .parent()
                    .unwrap_or(Path::new("."))
                    .join("worktrees")
            } else {
                data_dir.join("worktrees")
            }
        });
        Self {
            data_dir: data_dir.clone(),
            config_dir,
            state_dir,
            log_dir,
            database,
            managed_worktrees,
            registry_cache: data_dir.join("registry-cache"),
            installed_agents: data_dir.join("agents"),
        }
    }

    pub fn from_environment(overrides: PathOverrides) -> Self {
        Self::from_overrides(PathOverrides {
            database: overrides
                .database
                .or_else(|| env_path("PUEBLO_HUB_DATABASE")),
            data_dir: overrides
                .data_dir
                .or_else(|| env_path("PUEBLO_HUB_DATA_DIR")),
            config_dir: overrides
                .config_dir
                .or_else(|| env_path("PUEBLO_HUB_CONFIG_DIR")),
            state_dir: overrides
                .state_dir
                .or_else(|| env_path("PUEBLO_HUB_STATE_DIR")),
            log_dir: overrides.log_dir.or_else(|| env_path("PUEBLO_HUB_LOG_DIR")),
            managed_worktrees: overrides
                .managed_worktrees
                .or_else(|| env_path("PUEBLO_HUB_WORKTREES_DIR")),
        })
    }

    pub fn state_dir_for_database(path: &Path) -> PathBuf {
        if path.as_os_str() == ":memory:" {
            return env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
        }
        let absolute = if path.is_absolute() {
            path.to_path_buf()
        } else {
            env::current_dir()
                .unwrap_or_else(|_| PathBuf::from("."))
                .join(path)
        };
        absolute.parent().map(Path::to_path_buf).unwrap_or(absolute)
    }
}

fn env_path(name: &str) -> Option<PathBuf> {
    env::var_os(name)
        .filter(|value| !value.is_empty())
        .map(PathBuf::from)
}

fn home_dir() -> PathBuf {
    env_path("HOME")
        .or_else(|| env_path("USERPROFILE"))
        .unwrap_or_else(|| PathBuf::from("."))
}

fn default_data_dir() -> PathBuf {
    env_path("XDG_DATA_HOME")
        .unwrap_or_else(|| home_dir().join(".local/share"))
        .join(APP_NAME)
}

fn default_config_dir() -> PathBuf {
    env_path("XDG_CONFIG_HOME")
        .unwrap_or_else(|| home_dir().join(".config"))
        .join(APP_NAME)
}

fn default_state_dir() -> PathBuf {
    env_path("XDG_STATE_HOME")
        .unwrap_or_else(|| home_dir().join(".local/state"))
        .join(APP_NAME)
}

/// How Pueblo Hub reaches the ACP Registry.
#[derive(Clone)]
pub struct RegistryConfig {
    pub url: String,
    /// The transport. Tests replace it with fixtures, so no test reaches the
    /// public registry.
    pub http: Arc<dyn HttpFetch>,
}

impl Default for RegistryConfig {
    fn default() -> Self {
        Self {
            url: DEFAULT_REGISTRY_URL.to_string(),
            http: default_fetch(),
        }
    }
}

impl std::fmt::Debug for RegistryConfig {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("RegistryConfig")
            .field("url", &self.url)
            .finish_non_exhaustive()
    }
}

impl RegistryConfig {
    pub fn client(&self, cache_dir: PathBuf) -> Arc<RegistryClient> {
        Arc::new(RegistryClient::new(
            self.url.clone(),
            cache_dir,
            self.http.clone(),
        ))
    }
}

#[derive(Debug, Clone)]
pub struct Config {
    pub paths: PuebloPaths,
    pub server: ServerConfig,
    /// Shared with `SessionManager`, so the two can never drift apart.
    pub agents: Arc<AgentCatalog>,
    /// The manager that owns the durable installed-agent rows. Startup builds
    /// one, loads the rows, and passes it here so every surface shares it.
    pub agent_manager: Option<Arc<AgentManager>>,
    pub registry: RegistryConfig,
    pub timeouts: TimeoutConfig,
    pub web: WebConfig,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            paths: PuebloPaths::from_environment(PathOverrides::default()),
            server: ServerConfig::default(),
            agents: Arc::new(AgentCatalog::new([
                AgentDefinition::codex_default(),
                AgentDefinition::antigravity_default(),
                AgentDefinition::opencode_default(),
                AgentDefinition::claudecode_default(),
            ])),
            agent_manager: None,
            registry: RegistryConfig::default(),
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

    #[test]
    fn explicit_database_preserves_sibling_worktrees() {
        let paths = PuebloPaths::from_overrides(PathOverrides {
            database: Some(PathBuf::from("/old/hub.db")),
            data_dir: Some(PathBuf::from("/new/data")),
            ..Default::default()
        });
        assert_eq!(paths.database, PathBuf::from("/old/hub.db"));
        assert_eq!(paths.managed_worktrees, PathBuf::from("/old/worktrees"));
    }

    #[test]
    fn explicit_worktrees_and_roots_override_derived_paths() {
        let paths = PuebloPaths::from_overrides(PathOverrides {
            data_dir: Some(PathBuf::from("/data")),
            config_dir: Some(PathBuf::from("/config")),
            state_dir: Some(PathBuf::from("/state")),
            log_dir: Some(PathBuf::from("/logs")),
            managed_worktrees: Some(PathBuf::from("/worktrees")),
            ..Default::default()
        });
        assert_eq!(paths.database, PathBuf::from("/data/pueblo-hub.sqlite3"));
        assert_eq!(paths.managed_worktrees, PathBuf::from("/worktrees"));
        assert_eq!(paths.registry_cache, PathBuf::from("/data/registry-cache"));
        assert_eq!(paths.installed_agents, PathBuf::from("/data/agents"));
        assert_eq!(paths.log_dir, PathBuf::from("/logs"));
    }
}
