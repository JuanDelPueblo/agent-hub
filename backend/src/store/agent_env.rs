//! Private per-agent environment overrides.
//!
//! One row per variable, scoped by the Batey catalog id. The values are
//! Batey-owned and separate from the immutable Registry launch snapshot and
//! from the Batey-managed launch `env`: registry updates and custom edits
//! never touch this table, so overrides survive them. Uninstall deletes the
//! rows when the installed row goes away; a retired row keeps its rows while
//! the historical record exists, but they are inert because a retired agent
//! never starts a new process.
//!
//! Callers must use the presence view for API output. The full values stay
//! inside the process-spawn path only.

use super::{StoreError, StoreResult};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// The most variables one agent may override. It matches the custom-agent
/// launch limit, so one surface cannot hold more than the other.
pub const MAX_AGENT_ENV_VARS: usize = 256;
/// The longest variable name. It matches the agent id limit, so names stay
/// short enough for logs that mention them.
pub const MAX_AGENT_ENV_NAME_LENGTH: usize = 256;
/// The longest stored value (64 KiB). It holds API keys and short flags
/// without room for unbounded blobs.
pub const MAX_AGENT_ENV_VALUE_LENGTH: usize = 64 * 1024;

/// How one variable changes. It mirrors the MCP `SecretEdit` pattern, so one
/// editing model covers both surfaces.
#[derive(Debug, Clone, Default, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum AgentEnvAction {
    #[default]
    Replace,
    Keep,
    Remove,
}

/// One variable edit. `Keep` and `Remove` never carry a value; `Replace`
/// always does (an empty string sets an empty value for flags).
#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AgentEnvEdit {
    pub name: String,
    pub value: Option<String>,
    #[serde(default)]
    pub action: AgentEnvAction,
}

/// What the API returns: names and presence only, never values.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct AgentEnvPresence {
    pub name: String,
    pub present: bool,
}

/// Whether `name` is a usable environment-variable name. It allows arbitrary
/// provider names (`CODEX_API_KEY`, `GEMINI_API_KEY`, `GH_TOKEN`,
/// `COPILOT_GITHUB_TOKEN`, `NO_BROWSER`, ...) without hard-coding any of
/// them: a leading letter or underscore followed by letters, digits, or
/// underscores.
pub fn is_valid_env_name(name: &str) -> bool {
    if name.is_empty() || name.len() > MAX_AGENT_ENV_NAME_LENGTH {
        return false;
    }
    let mut chars = name.chars();
    match chars.next() {
        Some(first) if first.is_ascii_alphabetic() || first == '_' => {}
        _ => return false,
    }
    chars.all(|c| c.is_ascii_alphanumeric() || c == '_')
}

fn check_name(name: &str) -> StoreResult<String> {
    let trimmed = name.trim().to_string();
    if !is_valid_env_name(&trimmed) {
        return Err(StoreError::Validation(format!(
            "The environment variable '{trimmed}' has an unusable name. \
             A name starts with a letter or underscore and holds letters, digits, and underscores."
        )));
    }
    Ok(trimmed)
}

fn check_value(value: &str) -> StoreResult<()> {
    if value.contains('\0') {
        return Err(StoreError::Validation(
            "An environment value holds no null byte.".into(),
        ));
    }
    if value.len() > MAX_AGENT_ENV_VALUE_LENGTH {
        return Err(StoreError::Validation(format!(
            "An environment value holds at most {MAX_AGENT_ENV_VALUE_LENGTH} bytes."
        )));
    }
    Ok(())
}

/// Every override for one agent, with values. It is for the process-spawn
/// path only; API output must map it through `presence_of`.
pub(crate) fn list(conn: &Connection, agent_id: &str) -> StoreResult<BTreeMap<String, String>> {
    let mut statement = conn
        .prepare("SELECT name, value FROM agent_env_overrides WHERE agent_id=?1 ORDER BY name")?;
    let rows = statement.query_map([agent_id], |row| {
        let name: String = row.get(0)?;
        let value: String = row.get(1)?;
        Ok((name, value))
    })?;
    let mut out = BTreeMap::new();
    for row in rows {
        let (name, value) = row?;
        out.insert(name, value);
    }
    Ok(out)
}

/// Names and presence only, sorted by name. Values never leave the store.
pub(crate) fn presence(conn: &Connection, agent_id: &str) -> StoreResult<Vec<AgentEnvPresence>> {
    Ok(list(conn, agent_id)?
        .keys()
        .map(|name| AgentEnvPresence {
            name: name.clone(),
            present: true,
        })
        .collect())
}

/// Applies `Keep`/`Replace`/`Remove` edits. It returns the full map for the
/// caller to map through a presence view; it never logs values.
pub(crate) fn apply_edits(
    conn: &Connection,
    agent_id: &str,
    edits: &[AgentEnvEdit],
) -> StoreResult<BTreeMap<String, String>> {
    let mut current = list(conn, agent_id)?;
    for edit in edits {
        let name = check_name(&edit.name)?;
        match edit.action {
            AgentEnvAction::Keep => {
                if edit.value.is_some() {
                    return Err(StoreError::Validation(format!(
                        "The environment variable '{name}' is kept, so it takes no value."
                    )));
                }
                if !current.contains_key(&name) {
                    return Err(StoreError::Validation(format!(
                        "Cannot keep the unknown environment variable '{name}'."
                    )));
                }
            }
            AgentEnvAction::Remove => {
                if edit.value.is_some() {
                    return Err(StoreError::Validation(format!(
                        "The environment variable '{name}' is removed, so it takes no value."
                    )));
                }
                current.remove(&name);
                conn.execute(
                    "DELETE FROM agent_env_overrides WHERE agent_id=?1 AND name=?2",
                    params![agent_id, name],
                )?;
            }
            AgentEnvAction::Replace => {
                let value = edit.value.clone().ok_or_else(|| {
                    StoreError::Validation(format!(
                        "A replacement value is required for the environment variable '{name}'."
                    ))
                })?;
                check_value(&value)?;
                if !current.contains_key(&name) && current.len() >= MAX_AGENT_ENV_VARS {
                    return Err(StoreError::Validation(format!(
                        "An agent takes at most {MAX_AGENT_ENV_VARS} environment overrides."
                    )));
                }
                current.insert(name.clone(), value.clone());
                conn.execute(
                    "INSERT INTO agent_env_overrides (agent_id, name, value) VALUES (?1, ?2, ?3) \
                     ON CONFLICT (agent_id, name) DO UPDATE SET value=excluded.value",
                    params![agent_id, name, value],
                )?;
            }
        }
    }
    Ok(current)
}

/// Deletes every override for one agent. Uninstall calls this when the
/// installed row goes away; a retired row keeps its rows until it is deleted.
pub(crate) fn delete_for_agent(conn: &Connection, agent_id: &str) -> StoreResult<()> {
    conn.execute(
        "DELETE FROM agent_env_overrides WHERE agent_id=?1",
        [agent_id],
    )?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::store::Store;

    fn edit_replace(name: &str, value: &str) -> AgentEnvEdit {
        AgentEnvEdit {
            name: name.into(),
            value: Some(value.into()),
            action: AgentEnvAction::Replace,
        }
    }

    #[test]
    fn valid_names_cover_provider_keys_and_flags() {
        for name in [
            "CODEX_API_KEY",
            "OPENAI_API_KEY",
            "GEMINI_API_KEY",
            "GH_TOKEN",
            "COPILOT_GITHUB_TOKEN",
            "NO_BROWSER",
            "_PRIVATE",
            "a1",
        ] {
            assert!(is_valid_env_name(name), "{name} should be valid");
        }
        for name in ["", "1ABC", "HAS-DASH", "HAS SPACE", "HAS=EQUALS", "ünicode"] {
            assert!(!is_valid_env_name(name), "{name} should be refused");
        }
    }

    #[test]
    fn crud_survives_a_restart_without_exposing_values() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        let store = Store::open(&path).unwrap();
        store
            .apply_agent_env_edits("codex", &[edit_replace("CODEX_API_KEY", "secret-value")])
            .unwrap();
        store
            .apply_agent_env_edits("codex", &[edit_replace("NO_BROWSER", "1")])
            .unwrap();
        drop(store);

        let store = Store::open(&path).unwrap();
        let full = store.agent_env("codex").unwrap();
        assert_eq!(
            full.get("CODEX_API_KEY").map(String::as_str),
            Some("secret-value")
        );
        let presence = store.agent_env_presence("codex").unwrap();
        assert_eq!(presence.len(), 2);
        let exposed = serde_json::to_string(&presence).unwrap();
        assert!(exposed.contains("CODEX_API_KEY"));
        assert!(!exposed.contains("secret-value"));

        let other = store.agent_env("claude").unwrap();
        assert!(other.is_empty());
    }

    #[test]
    fn keep_replace_remove_follow_the_secret_pattern() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        store
            .apply_agent_env_edits("codex", &[edit_replace("CODEX_API_KEY", "one")])
            .unwrap();

        // Keep needs an existing name and no value.
        store
            .apply_agent_env_edits(
                "codex",
                &[AgentEnvEdit {
                    name: "CODEX_API_KEY".into(),
                    value: None,
                    action: AgentEnvAction::Keep,
                }],
            )
            .unwrap();
        assert!(store
            .apply_agent_env_edits(
                "codex",
                &[AgentEnvEdit {
                    name: "ABSENT".into(),
                    value: None,
                    action: AgentEnvAction::Keep,
                }]
            )
            .is_err());

        // Replace updates and creates; an empty value sets a flag.
        store
            .apply_agent_env_edits("codex", &[edit_replace("CODEX_API_KEY", "two")])
            .unwrap();
        assert_eq!(store.agent_env("codex").unwrap()["CODEX_API_KEY"], "two");
        store
            .apply_agent_env_edits("codex", &[edit_replace("NO_BROWSER", "")])
            .unwrap();
        assert_eq!(store.agent_env("codex").unwrap()["NO_BROWSER"], "");

        // Remove is idempotent and takes no value.
        store
            .apply_agent_env_edits(
                "codex",
                &[AgentEnvEdit {
                    name: "CODEX_API_KEY".into(),
                    value: None,
                    action: AgentEnvAction::Remove,
                }],
            )
            .unwrap();
        assert!(!store
            .agent_env("codex")
            .unwrap()
            .contains_key("CODEX_API_KEY"));
        store
            .apply_agent_env_edits(
                "codex",
                &[AgentEnvEdit {
                    name: "CODEX_API_KEY".into(),
                    value: None,
                    action: AgentEnvAction::Remove,
                }],
            )
            .unwrap();
    }

    #[test]
    fn invalid_names_and_values_are_refused_without_echoing_values() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        for bad in ["", "1BAD", "HAS-DASH", "HAS=EQUALS", "HAS SPACE"] {
            let error = store
                .apply_agent_env_edits("codex", &[edit_replace(bad, "value")])
                .unwrap_err();
            assert!(error.to_string().contains("unusable name"), "{error}");
            assert!(!error.to_string().contains("super-secret-value"));
        }
        let error = store
            .apply_agent_env_edits("codex", &[edit_replace("OK_NAME", "has\0nul")])
            .unwrap_err();
        assert!(error.to_string().contains("null byte"), "{error}");

        // Replace needs a value; Keep and Remove take none.
        assert!(store
            .apply_agent_env_edits(
                "codex",
                &[AgentEnvEdit {
                    name: "OK_NAME".into(),
                    value: None,
                    action: AgentEnvAction::Replace,
                }]
            )
            .is_err());
        store
            .apply_agent_env_edits("codex", &[edit_replace("OK_NAME", "v")])
            .unwrap();
        assert!(store
            .apply_agent_env_edits(
                "codex",
                &[AgentEnvEdit {
                    name: "OK_NAME".into(),
                    value: Some("v".into()),
                    action: AgentEnvAction::Keep,
                }]
            )
            .is_err());
    }

    #[test]
    fn deleting_an_agent_cleans_up_its_overrides_only() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        store
            .apply_agent_env_edits("codex", &[edit_replace("CODEX_API_KEY", "a")])
            .unwrap();
        store
            .apply_agent_env_edits("claude", &[edit_replace("GH_TOKEN", "b")])
            .unwrap();
        store.delete_agent_env_for_agent("codex").unwrap();
        assert!(store.agent_env("codex").unwrap().is_empty());
        assert_eq!(store.agent_env("claude").unwrap()["GH_TOKEN"], "b");
    }
}
