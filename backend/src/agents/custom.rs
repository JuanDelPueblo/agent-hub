//! Pueblo-managed custom ACP definitions.
//!
//! These are the definitions a user creates through the management API. They
//! persist, they are editable, and they own their id. Validation is
//! structural only: it checks that the command, the arguments, and the
//! environment can be handed to a process, and it never asks what the program
//! is or what provider it belongs to.
use super::definition::{AgentDisplay, AgentSource, DEFAULT_IDLE_TIMEOUT_SECS};
use super::installed::InstalledAgent;
use crate::acp::callbacks::CallbackPolicy;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// The longest idle timeout a definition may ask for: one day.
pub const MAX_IDLE_TIMEOUT_SECS: u64 = 86_400;
pub const MAX_ID_LENGTH: usize = 64;
pub const MAX_NAME_LENGTH: usize = 128;
pub const MAX_ARGS: usize = 256;
pub const MAX_ENV_VARS: usize = 256;

/// What a management surface sends to create or edit a custom definition.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CustomAgentInput {
    pub id: String,
    #[serde(default)]
    pub display_name: Option<String>,
    pub command: String,
    #[serde(default)]
    pub args: Vec<String>,
    #[serde(default)]
    pub env: BTreeMap<String, String>,
    #[serde(default)]
    pub idle_timeout: Option<u64>,
    /// Which provider reports quota for this agent. Absent means none;
    /// Pueblo Hub never derives one from the id or the command.
    #[serde(default)]
    pub usage_provider: Option<String>,
    #[serde(default)]
    pub metadata: Option<serde_json::Value>,
    #[serde(default)]
    pub default_permission_policy: Option<CallbackPolicy>,
    #[serde(default)]
    pub description: Option<String>,
}

/// One rejected field, so a management surface can point at the input.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ValidationIssue {
    pub field: String,
    pub message: String,
}

impl ValidationIssue {
    fn new(field: &str, message: impl Into<String>) -> Self {
        Self {
            field: field.to_string(),
            message: message.into(),
        }
    }
}

/// The answer a validate-only call returns.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ValidationReport {
    pub valid: bool,
    pub issues: Vec<ValidationIssue>,
}

impl CustomAgentInput {
    /// Every problem with the input, in field order. An empty list means the
    /// input can become a record.
    pub fn issues(&self) -> Vec<ValidationIssue> {
        let mut issues = Vec::new();
        check_id(&self.id, &mut issues);
        check_command(&self.command, &mut issues);
        check_display_name(self.display_name.as_deref(), &mut issues);
        check_args(&self.args, &mut issues);
        check_env(&self.env, &mut issues);
        check_idle_timeout(self.idle_timeout, &mut issues);
        check_usage_provider(self.usage_provider.as_deref(), &mut issues);
        check_metadata(self.metadata.as_ref(), &mut issues);
        issues
    }

    pub fn report(&self) -> ValidationReport {
        let issues = self.issues();
        ValidationReport {
            valid: issues.is_empty(),
            issues,
        }
    }

    /// A durable record, or the first failing field.
    pub fn into_record(self) -> Result<InstalledAgent, Vec<ValidationIssue>> {
        let issues = self.issues();
        if !issues.is_empty() {
            return Err(issues);
        }
        let id = self.id.trim().to_string();
        let display_name = self
            .display_name
            .map(|name| name.trim().to_string())
            .filter(|name| !name.is_empty())
            .unwrap_or_else(|| id.clone());
        let mut record = InstalledAgent::new(
            id,
            AgentSource::PuebloManaged,
            self.command.trim().to_string(),
        );
        record.display_name = display_name;
        record.args = self.args;
        record.env = self.env;
        record.idle_timeout_secs = self.idle_timeout.unwrap_or(DEFAULT_IDLE_TIMEOUT_SECS);
        record.usage_provider = self
            .usage_provider
            .map(|provider| provider.trim().to_string())
            .filter(|provider| !provider.is_empty());
        record.metadata = self.metadata.unwrap_or(serde_json::Value::Null);
        record.default_permission_policy = self.default_permission_policy.unwrap_or_default();
        record.display = AgentDisplay {
            description: self
                .description
                .map(|text| text.trim().to_string())
                .filter(|text| !text.is_empty()),
            ..AgentDisplay::default()
        };
        Ok(record)
    }

    /// Applies the input to an existing record, keeping its creation time and
    /// its id. The id in the input must match the record being edited.
    pub fn apply_to(
        self,
        existing: &InstalledAgent,
    ) -> Result<InstalledAgent, Vec<ValidationIssue>> {
        if self.id.trim() != existing.id {
            return Err(vec![ValidationIssue::new(
                "id",
                "An agent id cannot change. Remove the agent and create a new one.",
            )]);
        }
        let mut updated = self.into_record()?;
        updated.created_at = existing.created_at.clone();
        updated.touch();
        Ok(updated)
    }
}

fn check_id(id: &str, issues: &mut Vec<ValidationIssue>) {
    let id = id.trim();
    if id.is_empty() {
        issues.push(ValidationIssue::new("id", "An agent needs an id."));
        return;
    }
    if id.len() > MAX_ID_LENGTH {
        issues.push(ValidationIssue::new(
            "id",
            format!("An agent id holds at most {MAX_ID_LENGTH} characters."),
        ));
    }
    // The same rule the agents file uses, so a definition can move between
    // the file and the management API without a rename.
    if !id
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
    {
        issues.push(ValidationIssue::new(
            "id",
            "An agent id holds letters, digits, '-', and '_' only.",
        ));
    }
}

fn check_command(command: &str, issues: &mut Vec<ValidationIssue>) {
    let command = command.trim();
    if command.is_empty() {
        issues.push(ValidationIssue::new("command", "An agent needs a command."));
        return;
    }
    if has_control_characters(command) {
        issues.push(ValidationIssue::new(
            "command",
            "A command holds no control characters.",
        ));
    }
}

fn check_display_name(display_name: Option<&str>, issues: &mut Vec<ValidationIssue>) {
    let Some(name) = display_name else { return };
    if name.trim().len() > MAX_NAME_LENGTH {
        issues.push(ValidationIssue::new(
            "display_name",
            format!("A display name holds at most {MAX_NAME_LENGTH} characters."),
        ));
    }
    if has_control_characters(name) {
        issues.push(ValidationIssue::new(
            "display_name",
            "A display name holds no control characters.",
        ));
    }
}

fn check_args(args: &[String], issues: &mut Vec<ValidationIssue>) {
    if args.len() > MAX_ARGS {
        issues.push(ValidationIssue::new(
            "args",
            format!("An agent takes at most {MAX_ARGS} arguments."),
        ));
    }
    if args.iter().any(|arg| arg.contains('\0')) {
        issues.push(ValidationIssue::new(
            "args",
            "An argument holds no null byte.",
        ));
    }
}

fn check_env(env: &BTreeMap<String, String>, issues: &mut Vec<ValidationIssue>) {
    if env.len() > MAX_ENV_VARS {
        issues.push(ValidationIssue::new(
            "env",
            format!("An agent takes at most {MAX_ENV_VARS} environment variables."),
        ));
    }
    for (key, value) in env {
        if key.trim().is_empty() {
            issues.push(ValidationIssue::new(
                "env",
                "An environment variable needs a name.",
            ));
            break;
        }
        if key.contains('=') || key.contains('\0') || value.contains('\0') {
            issues.push(ValidationIssue::new(
                "env",
                format!("The environment variable '{key}' has an unusable name or value."),
            ));
            break;
        }
    }
}

fn check_idle_timeout(idle_timeout: Option<u64>, issues: &mut Vec<ValidationIssue>) {
    let Some(seconds) = idle_timeout else { return };
    if seconds == 0 || seconds > MAX_IDLE_TIMEOUT_SECS {
        issues.push(ValidationIssue::new(
            "idle_timeout",
            format!("An idle timeout runs from 1 to {MAX_IDLE_TIMEOUT_SECS} seconds."),
        ));
    }
}

fn check_usage_provider(usage_provider: Option<&str>, issues: &mut Vec<ValidationIssue>) {
    let Some(provider) = usage_provider else {
        return;
    };
    if provider.trim().len() > MAX_ID_LENGTH || has_control_characters(provider) {
        issues.push(ValidationIssue::new(
            "usage_provider",
            "A usage provider is a short plain identifier.",
        ));
    }
}

fn check_metadata(metadata: Option<&serde_json::Value>, issues: &mut Vec<ValidationIssue>) {
    let Some(metadata) = metadata else { return };
    if !metadata.is_object() && !metadata.is_null() {
        issues.push(ValidationIssue::new(
            "metadata",
            "Metadata is a JSON object.",
        ));
    }
}

fn has_control_characters(value: &str) -> bool {
    value.chars().any(|c| c.is_control())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn valid() -> CustomAgentInput {
        CustomAgentInput {
            id: "private-acp".into(),
            display_name: Some("Private ACP".into()),
            command: "/opt/agents/private-acp".into(),
            args: vec!["--acp".into()],
            env: BTreeMap::from([("TOKEN_NAME".to_string(), "value".to_string())]),
            idle_timeout: Some(300),
            usage_provider: Some("internal".into()),
            metadata: Some(serde_json::json!({"team": "platform"})),
            default_permission_policy: Some(CallbackPolicy::ReadOnly),
            description: Some("Our own agent".into()),
        }
    }

    #[test]
    fn a_complete_input_becomes_a_record() {
        let record = valid().into_record().unwrap();
        assert_eq!(record.id, "private-acp");
        assert_eq!(record.source, AgentSource::PuebloManaged);
        assert_eq!(record.display_name, "Private ACP");
        assert_eq!(record.command, "/opt/agents/private-acp");
        assert_eq!(record.args, vec!["--acp"]);
        assert_eq!(record.env["TOKEN_NAME"], "value");
        assert_eq!(record.idle_timeout_secs, 300);
        assert_eq!(record.usage_provider.as_deref(), Some("internal"));
        assert_eq!(record.metadata["team"], "platform");
        assert_eq!(record.default_permission_policy, CallbackPolicy::ReadOnly);
        assert_eq!(record.display.description.as_deref(), Some("Our own agent"));
        assert!(!record.retired);
        assert!(record.registry.is_none());
    }

    #[test]
    fn defaults_fill_the_optional_fields() {
        let record = CustomAgentInput {
            id: "minimal".into(),
            command: "minimal-acp".into(),
            ..CustomAgentInput::default()
        }
        .into_record()
        .unwrap();
        assert_eq!(record.display_name, "minimal");
        assert_eq!(record.idle_timeout_secs, DEFAULT_IDLE_TIMEOUT_SECS);
        assert_eq!(record.default_permission_policy, CallbackPolicy::Ask);
        assert_eq!(record.metadata, serde_json::Value::Null);
        // A provider is never derived from an id or a command.
        assert_eq!(record.usage_provider, None);
    }

    /// An id that matches a well-known provider must still get no provider.
    #[test]
    fn a_provider_is_never_inferred() {
        for id in ["codex", "claude", "gemini"] {
            let record = CustomAgentInput {
                id: id.into(),
                command: format!("{id}-acp"),
                ..CustomAgentInput::default()
            }
            .into_record()
            .unwrap();
            assert_eq!(record.usage_provider, None, "{id} inferred a provider");
        }
    }

    #[test]
    fn every_field_rule_is_reported_with_its_field() {
        let issues = CustomAgentInput {
            id: "bad id!".into(),
            display_name: Some("x".repeat(MAX_NAME_LENGTH + 1)),
            command: "  ".into(),
            args: vec!["ok\0".into()],
            env: BTreeMap::from([("BAD=NAME".to_string(), "v".to_string())]),
            idle_timeout: Some(0),
            usage_provider: Some("x".repeat(MAX_ID_LENGTH + 1)),
            metadata: Some(serde_json::json!(["not", "an", "object"])),
            default_permission_policy: None,
            description: None,
        }
        .issues();
        let fields: Vec<&str> = issues.iter().map(|issue| issue.field.as_str()).collect();
        for field in [
            "id",
            "command",
            "display_name",
            "args",
            "env",
            "idle_timeout",
            "usage_provider",
            "metadata",
        ] {
            assert!(fields.contains(&field), "{field} was accepted: {fields:?}");
        }
    }

    #[test]
    fn an_empty_id_or_command_is_refused() {
        assert!(CustomAgentInput::default().into_record().is_err());
        let report = CustomAgentInput {
            id: String::new(),
            command: "acp".into(),
            ..CustomAgentInput::default()
        }
        .report();
        assert!(!report.valid);
        assert_eq!(report.issues[0].field, "id");
    }

    #[test]
    fn a_long_id_or_timeout_is_refused() {
        let issues = CustomAgentInput {
            id: "a".repeat(MAX_ID_LENGTH + 1),
            command: "acp".into(),
            idle_timeout: Some(MAX_IDLE_TIMEOUT_SECS + 1),
            ..CustomAgentInput::default()
        }
        .issues();
        assert_eq!(issues.len(), 2);
    }

    #[test]
    fn a_valid_input_reports_no_issue() {
        let report = valid().report();
        assert!(report.valid);
        assert!(report.issues.is_empty());
    }

    #[test]
    fn an_edit_keeps_the_creation_time_and_refuses_a_rename() {
        let original = valid().into_record().unwrap();
        let mut edited_input = valid();
        edited_input.display_name = Some("Renamed".into());
        edited_input.command = "/opt/agents/v2".into();
        let edited = edited_input.apply_to(&original).unwrap();
        assert_eq!(edited.id, original.id);
        assert_eq!(edited.created_at, original.created_at);
        assert_eq!(edited.display_name, "Renamed");
        assert_eq!(edited.command, "/opt/agents/v2");

        let mut renamed = valid();
        renamed.id = "other".into();
        let issues = renamed.apply_to(&original).unwrap_err();
        assert_eq!(issues[0].field, "id");
    }

    /// The input rejects an unknown field, so a typo fails instead of being
    /// silently dropped.
    #[test]
    fn unknown_input_fields_are_refused() {
        assert!(serde_json::from_str::<CustomAgentInput>(
            r#"{"id":"a","command":"b","typo":true}"#
        )
        .is_err());
        assert!(serde_json::from_str::<CustomAgentInput>(r#"{"id":"a","command":"b"}"#).is_ok());
    }
}
