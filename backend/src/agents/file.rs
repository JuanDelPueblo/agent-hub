//! The agent file `--agents-file` names. Server-owned executable definitions;
//! never accepted from HTTP clients.
use super::{AgentDefinition, AgentRegistry, AgentSource, DEFAULT_IDLE_TIMEOUT_SECS};
use serde::Deserialize;
use std::collections::HashMap;
use std::time::Duration;

/// `command` is the only required field, so a file written for v0.2 still
/// parses. `deny_unknown_fields` stays, so a typo fails loudly.
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct AgentFileEntry {
    command: String,
    #[serde(default)]
    args: Vec<String>,
    #[serde(default)]
    env: HashMap<String, String>,
    #[serde(default = "default_idle")]
    idle_timeout: u64,
    #[serde(default)]
    display_name: Option<String>,
    #[serde(default)]
    usage_provider: Option<String>,
    #[serde(default)]
    metadata: Option<serde_json::Value>,
}

fn default_idle() -> u64 {
    DEFAULT_IDLE_TIMEOUT_SECS
}

pub fn parse_agents(json: &str) -> anyhow::Result<AgentRegistry> {
    let entries: HashMap<String, AgentFileEntry> = serde_json::from_str(json)?;
    anyhow::ensure!(!entries.is_empty(), "At least one agent is required");
    entries
        .into_iter()
        .map(|(id, e)| {
            anyhow::ensure!(
                !id.is_empty()
                    && id
                        .chars()
                        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_'),
                "Invalid agent name"
            );
            anyhow::ensure!(!e.command.trim().is_empty(), "Agent command is empty");
            let display_name = e.display_name.unwrap_or_else(|| id.clone());
            Ok(AgentDefinition::new(id, e.command)
                .with_args(e.args)
                .with_env(e.env)
                .with_idle_timeout(Duration::from_secs(e.idle_timeout))
                .with_display_name(display_name)
                // Absent means "no provider", never a guess based on the id.
                .with_usage_provider(e.usage_provider)
                .with_metadata(e.metadata.unwrap_or(serde_json::Value::Null))
                .with_source(AgentSource::File))
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The exact block AGENTS.md documents must keep parsing.
    #[test]
    fn documented_v0_2_file_still_parses() {
        let registry = parse_agents(
            r#"{
              "codex": { "command": "codex-acp" },
              "claude": { "command": "claude-agent-acp" },
              "opencode": { "command": "opencode", "args": ["acp"] },
              "antigravity": { "command": "agy_acp_server.par", "args": ["--uid="] }
            }"#,
        )
        .unwrap();
        assert_eq!(
            registry.ids(),
            vec!["antigravity", "claude", "codex", "opencode"]
        );
        let opencode = registry.definition("opencode").unwrap();
        assert_eq!(opencode.launch.args, vec!["acp"]);
        assert_eq!(
            opencode.launch.idle_timeout,
            Duration::from_secs(DEFAULT_IDLE_TIMEOUT_SECS)
        );
        assert_eq!(opencode.source, AgentSource::File);
    }

    #[test]
    fn optional_new_fields_parse() {
        let registry = parse_agents(
            r#"{"codex":{"command":"codex-acp","display_name":"Codex CLI",
                "usage_provider":"codex","metadata":{"registry":"example"},
                "env":{"KEY":"value"},"idle_timeout":30}}"#,
        )
        .unwrap();
        let def = registry.definition("codex").unwrap();
        assert_eq!(def.display_name, "Codex CLI");
        assert_eq!(def.usage_provider.as_deref(), Some("codex"));
        assert_eq!(def.metadata["registry"], "example");
        assert_eq!(def.launch.env.get("KEY").unwrap(), "value");
        assert_eq!(def.launch.idle_timeout, Duration::from_secs(30));
    }

    #[test]
    fn display_name_defaults_to_the_key() {
        let registry = parse_agents(r#"{"custom":{"command":"acp"}}"#).unwrap();
        assert_eq!(
            registry.definition("custom").unwrap().display_name,
            "custom"
        );
    }

    /// An id that matches a known provider must not acquire one implicitly.
    #[test]
    fn usage_provider_is_never_inferred_from_id() {
        let registry =
            parse_agents(r#"{"codex":{"command":"codex-acp"},"claude":{"command":"c"}}"#).unwrap();
        assert_eq!(registry.definition("codex").unwrap().usage_provider, None);
        assert_eq!(registry.definition("claude").unwrap().usage_provider, None);
    }

    #[test]
    fn invalid_files_are_rejected() {
        assert!(parse_agents("{}").is_err(), "empty file accepted");
        assert!(parse_agents(r#"{"bad":{"command":""}}"#).is_err());
        assert!(parse_agents(r#"{"bad":{"command":"acp","unknown":true}}"#).is_err());
        assert!(parse_agents(r#"{"bad name":{"command":"acp"}}"#).is_err());
    }
}
