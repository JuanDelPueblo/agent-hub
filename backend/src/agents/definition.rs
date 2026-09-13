//! What Agent Hub knows about one ACP agent.
//!
//! `AgentLaunch` holds what it takes to start the process. Everything the
//! process does not need — a display name, a usage provider, registry
//! metadata — sits beside it, so later subsystems extend `AgentDefinition`
//! without touching the session layer or the ACP layer.
use crate::acp::callbacks::CallbackPolicy;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::Duration;

pub const DEFAULT_IDLE_TIMEOUT_SECS: u64 = 900;

/// Everything needed to start an ACP process, and nothing else.
#[derive(Debug, Clone)]
pub struct AgentLaunch {
    pub command: String,
    pub args: Vec<String>,
    pub env: HashMap<String, String>,
    pub idle_timeout: Duration,
}

/// Where a definition came from. The registry phase adds more sources.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AgentSource {
    /// Compiled into Agent Hub.
    #[default]
    Builtin,
    /// Read from the file `--agents-file` names.
    File,
}

#[derive(Debug, Clone)]
pub struct AgentDefinition {
    pub id: String,
    pub display_name: String,
    pub launch: AgentLaunch,
    /// Which provider reports quota and account status for this agent. The
    /// usage subsystem resolves it. Agent Hub never infers it from `id`.
    pub usage_provider: Option<String>,
    pub source: AgentSource,
    /// Opaque to Agent Hub today. The registry phase gives it meaning.
    pub metadata: serde_json::Value,
    /// The policy a session uses when no stored chat supplies one.
    pub default_permission_policy: CallbackPolicy,
}

/// The subset the session layer and the ACP layer may see. Keeping it separate
/// stops unrelated agent metadata from reaching the process supervisor.
#[derive(Debug, Clone)]
pub struct AgentRuntime {
    pub id: String,
    pub launch: AgentLaunch,
    pub default_permission_policy: CallbackPolicy,
}

impl AgentDefinition {
    pub fn new(id: impl Into<String>, command: impl Into<String>) -> Self {
        let id = id.into();
        Self {
            display_name: id.clone(),
            id,
            launch: AgentLaunch {
                command: command.into(),
                args: Vec::new(),
                env: HashMap::new(),
                idle_timeout: Duration::from_secs(DEFAULT_IDLE_TIMEOUT_SECS),
            },
            usage_provider: None,
            source: AgentSource::Builtin,
            metadata: serde_json::Value::Null,
            default_permission_policy: CallbackPolicy::Ask,
        }
    }

    pub fn runtime(&self) -> AgentRuntime {
        AgentRuntime {
            id: self.id.clone(),
            launch: self.launch.clone(),
            default_permission_policy: self.default_permission_policy.clone(),
        }
    }

    pub fn codex_default() -> Self {
        Self::new("codex", "codex-acp")
    }

    pub fn gemini_default() -> Self {
        Self::new("gemini", "gemini").with_args(vec!["--acp".to_string()])
    }

    pub fn opencode_default() -> Self {
        Self::new("opencode", "opencode").with_args(vec!["acp".to_string()])
    }

    pub fn claudecode_default() -> Self {
        Self::new("claude", "claude-agent-acp")
    }

    pub fn antigravity_default() -> Self {
        Self::new("antigravity", "agy_acp_server.par")
    }

    /// An empty command is ignored, so a blank override cannot break a launch.
    pub fn with_command(mut self, command: String) -> Self {
        if !command.trim().is_empty() {
            self.launch.command = command;
        }
        self
    }

    pub fn with_args(mut self, args: Vec<String>) -> Self {
        self.launch.args = args;
        self
    }

    pub fn extend_args(mut self, args: impl IntoIterator<Item = String>) -> Self {
        self.launch.args.extend(args);
        self
    }

    pub fn with_env(mut self, env: HashMap<String, String>) -> Self {
        self.launch.env = env;
        self
    }

    pub fn with_idle_timeout(mut self, idle_timeout: Duration) -> Self {
        self.launch.idle_timeout = idle_timeout;
        self
    }

    pub fn with_callback_policy(mut self, policy: CallbackPolicy) -> Self {
        self.default_permission_policy = policy;
        self
    }

    pub fn with_display_name(mut self, display_name: String) -> Self {
        self.display_name = display_name;
        self
    }

    pub fn with_usage_provider(mut self, provider: Option<String>) -> Self {
        self.usage_provider = provider;
        self
    }

    pub fn with_source(mut self, source: AgentSource) -> Self {
        self.source = source;
        self
    }

    pub fn with_metadata(mut self, metadata: serde_json::Value) -> Self {
        self.metadata = metadata;
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builtin_commands() {
        assert_eq!(AgentDefinition::codex_default().launch.command, "codex-acp");
        assert!(AgentDefinition::codex_default().launch.args.is_empty());
        assert_eq!(
            AgentDefinition::codex_default().default_permission_policy,
            CallbackPolicy::Ask
        );

        let gemini = AgentDefinition::gemini_default();
        assert_eq!(gemini.launch.command, "gemini");
        assert_eq!(gemini.launch.args, vec!["--acp"]);

        let opencode = AgentDefinition::opencode_default();
        assert_eq!(opencode.launch.command, "opencode");
        assert_eq!(opencode.launch.args, vec!["acp"]);

        assert_eq!(
            AgentDefinition::claudecode_default().launch.command,
            "claude-agent-acp"
        );
        assert_eq!(
            AgentDefinition::antigravity_default().launch.command,
            "agy_acp_server.par"
        );
    }

    /// Every built-in must carry its own id. Antigravity once derived from the
    /// Codex definition and would otherwise inherit the id `codex`.
    #[test]
    fn builtin_ids_are_distinct() {
        let ids: Vec<String> = [
            AgentDefinition::codex_default(),
            AgentDefinition::gemini_default(),
            AgentDefinition::opencode_default(),
            AgentDefinition::claudecode_default(),
            AgentDefinition::antigravity_default(),
        ]
        .iter()
        .map(|d| d.id.clone())
        .collect();
        let mut unique = ids.clone();
        unique.sort();
        unique.dedup();
        assert_eq!(ids.len(), unique.len(), "duplicate built-in agent id");
        assert_eq!(AgentDefinition::antigravity_default().id, "antigravity");
        assert_eq!(AgentDefinition::claudecode_default().id, "claude");
    }

    /// A name that matches a known provider must still not imply one. The
    /// usage subsystem attaches providers explicitly.
    #[test]
    fn usage_provider_is_never_inferred_from_id() {
        for def in [
            AgentDefinition::codex_default(),
            AgentDefinition::claudecode_default(),
            AgentDefinition::opencode_default(),
            AgentDefinition::antigravity_default(),
        ] {
            assert_eq!(def.usage_provider, None, "{} inferred a provider", def.id);
        }
    }

    #[test]
    fn display_name_defaults_to_id() {
        let def = AgentDefinition::codex_default();
        assert_eq!(def.display_name, def.id);
    }

    #[test]
    fn with_command_ignores_blank_overrides() {
        assert_eq!(
            AgentDefinition::codex_default()
                .with_command("my-codex".into())
                .launch
                .command,
            "my-codex"
        );
        assert_eq!(
            AgentDefinition::codex_default()
                .with_command(String::new())
                .launch
                .command,
            "codex-acp"
        );
        assert_eq!(
            AgentDefinition::codex_default()
                .with_command("   ".into())
                .launch
                .command,
            "codex-acp"
        );
    }

    #[test]
    fn args_builders() {
        assert_eq!(
            AgentDefinition::gemini_default()
                .with_args(vec!["--yolo".into(), "--fast".into()])
                .launch
                .args,
            vec!["--yolo", "--fast"]
        );
        assert_eq!(
            AgentDefinition::codex_default()
                .with_args(vec!["-a".into(), "never".into()])
                .extend_args(vec!["--read-only".into()])
                .launch
                .args,
            vec!["-a", "never", "--read-only"]
        );
    }

    #[test]
    fn with_callback_policy() {
        assert_eq!(
            AgentDefinition::codex_default()
                .with_callback_policy(CallbackPolicy::DenyAll)
                .default_permission_policy,
            CallbackPolicy::DenyAll
        );
    }

    /// The runtime view must carry the launch data and nothing more.
    #[test]
    fn runtime_carries_launch_data() {
        let def = AgentDefinition::codex_default()
            .with_idle_timeout(Duration::from_secs(5))
            .with_usage_provider(Some("codex".into()))
            .with_metadata(serde_json::json!({"registry": "example"}));
        let runtime = def.runtime();
        assert_eq!(runtime.id, "codex");
        assert_eq!(runtime.launch.command, "codex-acp");
        assert_eq!(runtime.launch.idle_timeout, Duration::from_secs(5));
    }
}
