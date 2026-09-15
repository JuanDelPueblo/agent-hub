//! Declarative agent definitions for deployment configuration.
//!
//! The NixOS module generates this file from typed options and passes it with
//! `--declarative-agents-file`. Entries feed the same catalog as every other
//! source with `AgentSource::Declarative` and stay read-only through the
//! mutable web management APIs. Secrets never belong here: use `pass_env` to
//! name runtime environment variables that systemd `EnvironmentFile` supplies.

use super::{
    definition::AgentDisplay, AgentCatalog, AgentDefinition, AgentSource, DEFAULT_IDLE_TIMEOUT_SECS,
};
use crate::acp::callbacks::CallbackPolicy;
use serde::Deserialize;
use std::collections::HashMap;
use std::time::Duration;

/// One entry of the declarative agents file. Only `command` is required; every
/// other field has the same meaning as the matching agents-file or custom
/// management field. An `npx` or `uvx` agent is a manual entry with
/// `command = "npx"` and a pinned package spec in `args`, so no live registry
/// lookup happens at evaluation or at startup.
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct DeclarativeFileEntry {
    command: String,
    #[serde(default)]
    args: Vec<String>,
    #[serde(default)]
    env: HashMap<String, String>,
    #[serde(default, alias = "passEnv", alias = "env_from_environment")]
    pass_env: Vec<String>,
    #[serde(default = "default_idle", alias = "idleTimeout")]
    idle_timeout: u64,
    #[serde(default, alias = "displayName")]
    display_name: Option<String>,
    #[serde(default, alias = "usageProvider")]
    usage_provider: Option<String>,
    #[serde(default)]
    metadata: Option<serde_json::Value>,
    #[serde(default, alias = "defaultPermissionPolicy")]
    default_permission_policy: Option<CallbackPolicy>,
    #[serde(default)]
    description: Option<String>,
}

fn default_idle() -> u64 {
    DEFAULT_IDLE_TIMEOUT_SECS
}

/// Parses a declarative agents document into a catalog with
/// `AgentSource::Declarative`. An empty object is valid and yields an empty
/// catalog, so a deployment with no declarative agents passes no definitions.
pub fn parse_declarative_agents(json: &str) -> anyhow::Result<AgentCatalog> {
    let entries: HashMap<String, DeclarativeFileEntry> = serde_json::from_str(json)?;
    let catalog = AgentCatalog::default();
    let mut ids: Vec<String> = entries.keys().cloned().collect();
    ids.sort();
    for id in ids {
        let entry = entries.get(&id).expect("sorted id missing");
        validate_id(&id)?;
        validate_command(&entry.command)?;
        validate_args(&entry.args)?;
        validate_env(&entry.env)?;
        validate_pass_env(&entry.pass_env)?;
        validate_idle_timeout(entry.idle_timeout)?;
        validate_usage_provider(entry.usage_provider.as_deref())?;
        validate_metadata(entry.metadata.as_ref())?;
        let display_name = entry.display_name.clone().unwrap_or_else(|| id.clone());
        if display_name.trim().len() > super::custom::MAX_NAME_LENGTH {
            anyhow::bail!("Declarative agent '{id}' has a display name that is too long");
        }
        let definition = AgentDefinition::new(id.clone(), entry.command.trim().to_string())
            .with_args(entry.args.clone())
            .with_env(entry.env.clone())
            .with_pass_env(entry.pass_env.clone())
            .with_idle_timeout(Duration::from_secs(entry.idle_timeout))
            .with_display_name(display_name)
            .with_usage_provider(
                entry
                    .usage_provider
                    .clone()
                    .map(|provider| provider.trim().to_string())
                    .filter(|provider| !provider.is_empty()),
            )
            .with_metadata(entry.metadata.clone().unwrap_or(serde_json::Value::Null))
            .with_callback_policy(entry.default_permission_policy.clone().unwrap_or_default())
            .with_display(AgentDisplay {
                description: entry
                    .description
                    .clone()
                    .map(|text| text.trim().to_string())
                    .filter(|text| !text.is_empty()),
                ..AgentDisplay::default()
            })
            .with_source(AgentSource::Declarative);
        catalog.insert(definition).map_err(|collision| {
            anyhow::anyhow!("Declarative agents file defines a duplicate id: {collision}")
        })?;
    }
    Ok(catalog)
}

fn validate_id(id: &str) -> anyhow::Result<()> {
    anyhow::ensure!(
        !id.is_empty()
            && id.len() <= super::custom::MAX_ID_LENGTH
            && id
                .chars()
                .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_'),
        "Invalid declarative agent id '{id}'"
    );
    Ok(())
}

fn validate_command(command: &str) -> anyhow::Result<()> {
    anyhow::ensure!(
        !command.trim().is_empty(),
        "Declarative agent command is empty"
    );
    anyhow::ensure!(
        !command.chars().any(|c| c.is_control()),
        "Declarative agent command holds control characters"
    );
    Ok(())
}

fn validate_args(args: &[String]) -> anyhow::Result<()> {
    anyhow::ensure!(
        args.len() <= super::custom::MAX_ARGS,
        "Declarative agent takes too many arguments"
    );
    anyhow::ensure!(
        !args.iter().any(|arg| arg.contains('\0')),
        "Declarative agent argument holds a null byte"
    );
    Ok(())
}

fn validate_env(env: &HashMap<String, String>) -> anyhow::Result<()> {
    anyhow::ensure!(
        env.len() <= super::custom::MAX_ENV_VARS,
        "Declarative agent takes too many environment variables"
    );
    for (key, value) in env {
        anyhow::ensure!(
            !key.trim().is_empty() && !key.contains('=') && !key.contains('\0'),
            "Declarative agent has an unusable environment variable name '{key}'"
        );
        anyhow::ensure!(
            !value.contains('\0'),
            "Declarative agent environment variable '{key}' holds a null byte"
        );
    }
    Ok(())
}

fn validate_pass_env(pass_env: &[String]) -> anyhow::Result<()> {
    anyhow::ensure!(
        pass_env.len() <= super::custom::MAX_ENV_VARS,
        "Declarative agent passes through too many environment variables"
    );
    for name in pass_env {
        anyhow::ensure!(
            !name.trim().is_empty() && !name.contains('=') && !name.contains('\0'),
            "Declarative agent has an unusable pass_env name '{name}'"
        );
    }
    Ok(())
}

fn validate_idle_timeout(seconds: u64) -> anyhow::Result<()> {
    anyhow::ensure!(
        (1..=super::custom::MAX_IDLE_TIMEOUT_SECS).contains(&seconds),
        "Declarative agent idle timeout runs from 1 to {} seconds",
        super::custom::MAX_IDLE_TIMEOUT_SECS
    );
    Ok(())
}

fn validate_usage_provider(provider: Option<&str>) -> anyhow::Result<()> {
    if let Some(provider) = provider {
        anyhow::ensure!(
            provider.trim().len() <= super::custom::MAX_ID_LENGTH
                && !provider.chars().any(|c| c.is_control()),
            "Declarative agent usage provider is not a short plain identifier"
        );
    }
    Ok(())
}

fn validate_metadata(metadata: Option<&serde_json::Value>) -> anyhow::Result<()> {
    if let Some(metadata) = metadata {
        anyhow::ensure!(
            metadata.is_object() || metadata.is_null(),
            "Declarative agent metadata is a JSON object"
        );
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn an_empty_document_yields_an_empty_catalog() {
        let catalog = parse_declarative_agents("{}").unwrap();
        assert!(catalog.is_empty());
    }

    #[test]
    fn a_manual_entry_parses_with_declarative_source() {
        let catalog = parse_declarative_agents(
            r#"{"private":{"command":"/opt/agents/private-acp","args":["--acp"],
                "env":{"REGION":"eu"},"pass_env":["PRIVATE_TOKEN"],"idle_timeout":300,
                "display_name":"Private","usage_provider":"internal",
                "metadata":{"team":"platform"},"default_permission_policy":"read-only",
                "description":"Our agent"}}"#,
        )
        .unwrap();
        let def = catalog.definition("private").unwrap();
        assert_eq!(def.source, AgentSource::Declarative);
        assert_eq!(def.launch.command, "/opt/agents/private-acp");
        assert_eq!(def.launch.args, vec!["--acp"]);
        assert_eq!(def.launch.env["REGION"], "eu");
        assert_eq!(def.launch.pass_env, vec!["PRIVATE_TOKEN"]);
        assert_eq!(def.launch.idle_timeout, Duration::from_secs(300));
        assert_eq!(def.display_name, "Private");
        assert_eq!(def.usage_provider.as_deref(), Some("internal"));
        assert_eq!(def.metadata["team"], "platform");
        assert_eq!(def.default_permission_policy, CallbackPolicy::ReadOnly);
        assert_eq!(def.display.description.as_deref(), Some("Our agent"));
        assert_eq!(
            def.summary().mutability,
            super::super::AgentMutability::ReadOnly
        );
    }

    #[test]
    fn a_pinned_npx_entry_is_a_manual_pinned_launch() {
        let catalog = parse_declarative_agents(
            r#"{"pkg":{"command":"npx","args":["--yes","package-acp@1.2.3","--acp"]}}"#,
        )
        .unwrap();
        let def = catalog.definition("pkg").unwrap();
        assert_eq!(def.launch.command, "npx");
        assert_eq!(def.launch.args[1], "package-acp@1.2.3");
        assert_eq!(def.source, AgentSource::Declarative);
    }

    #[test]
    fn a_nix_store_command_is_natural() {
        let catalog = parse_declarative_agents(
            r#"{"custom":{"command":"/nix/store/example/bin/acp","args":["--stdio"]}}"#,
        )
        .unwrap();
        assert_eq!(
            catalog.definition("custom").unwrap().launch.command,
            "/nix/store/example/bin/acp"
        );
    }

    #[test]
    fn invalid_documents_are_rejected() {
        assert!(parse_declarative_agents(r#"{"bad":{"command":""}}"#).is_err());
        assert!(parse_declarative_agents(r#"{"bad":{"command":"acp","unknown":true}}"#).is_err());
        assert!(parse_declarative_agents(r#"{"bad name":{"command":"acp"}}"#).is_err());
        assert!(
            parse_declarative_agents(r#"{"a":{"command":"acp","pass_env":["BAD=NAME"]}}"#).is_err()
        );
        assert!(parse_declarative_agents(r#"{"a":{"command":"acp","idle_timeout":0}}"#).is_err());
    }

    #[test]
    fn a_declarative_id_collides_explicitly_with_another_source() {
        let catalog = AgentCatalog::new([AgentDefinition::codex_default()]);
        let declarative = parse_declarative_agents(r#"{"codex":{"command":"other-acp"}}"#).unwrap();
        let collision = catalog
            .insert((*declarative.definition("codex").unwrap()).clone())
            .unwrap_err();
        assert_eq!(collision.existing, AgentSource::Builtin);
        assert_eq!(collision.incoming, AgentSource::Declarative);
    }
}
