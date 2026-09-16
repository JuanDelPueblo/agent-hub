//! Stable ACP v1 authentication metadata, plus a narrow legacy bridge.
//!
//! `initialize` returns `authMethods` and `agentCapabilities.auth`. This
//! module turns both into typed provider-neutral state. Batey never
//! reads an agent id to decide how an agent authenticates.
//!
//! A method type this build does not implement stays in the state as
//! `Unsupported`. The client reports it as unsupported instead of inventing
//! a fallback, because the stable schema treats an untyped method as `agent`
//! and a wrong guess would send the wrong RPC.
//!
//! The legacy `_meta["terminal-auth"]` extension is isolated here. Stable
//! ACP v1 remains canonical; the bridge only recognizes an explicit
//! command/args/label object on a non-terminal method and runs it in the
//! same PTY lifecycle as a stable terminal method, never through a shell.
use serde_json::Value;
use std::collections::BTreeMap;

/// The `type` value of a method the agent authenticates itself.
pub const AGENT_METHOD_TYPE: &str = "agent";
/// The `type` value of a method the client runs in an interactive terminal.
pub const TERMINAL_METHOD_TYPE: &str = "terminal";
/// The legacy extension key inside an auth-method `_meta` object.
pub const LEGACY_TERMINAL_AUTH_META_KEY: &str = "terminal-auth";
/// The legacy client-capability key Batey advertises when it implements the bridge.
pub const LEGACY_TERMINAL_AUTH_CLIENT_KEY: &str = "terminal-auth";

/// One authentication method the agent advertised at `initialize`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AuthMethod {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub kind: AuthMethodKind,
}

impl AuthMethod {
    /// The wire `type` value this method presents as.
    ///
    /// A legacy bridge method presents as `terminal` so the UI offers the
    /// terminal action instead of calling `authenticate`, which the stable
    /// schema forbids for terminal work. The internal kind stays distinct.
    pub fn type_name(&self) -> &str {
        match &self.kind {
            AuthMethodKind::Agent => AGENT_METHOD_TYPE,
            AuthMethodKind::Terminal(_) => TERMINAL_METHOD_TYPE,
            AuthMethodKind::LegacyTerminal(_) => TERMINAL_METHOD_TYPE,
            AuthMethodKind::Unsupported(kind) => kind,
        }
    }

    /// Whether this build can run the method.
    pub fn is_supported(&self, terminal_supported: bool) -> bool {
        match &self.kind {
            AuthMethodKind::Agent => true,
            AuthMethodKind::Terminal(_) => terminal_supported,
            AuthMethodKind::LegacyTerminal(_) => terminal_supported,
            AuthMethodKind::Unsupported(_) => false,
        }
    }

    /// Whether the method runs in a terminal (stable or legacy bridge).
    /// Neither kind may reach `authenticate`.
    pub fn is_terminal(&self) -> bool {
        matches!(
            &self.kind,
            AuthMethodKind::Terminal(_) | AuthMethodKind::LegacyTerminal(_)
        )
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AuthMethodKind {
    /// The agent authenticates itself through `authenticate(methodId)`.
    Agent,
    /// The client runs the configured agent program in a real terminal.
    /// The client must never pass this method to `authenticate`.
    Terminal(TerminalAuthMethod),
    /// Compatibility bridge for the deployed `_meta["terminal-auth"]`
    /// convention. The command comes from the agent's `initialize`
    /// response, never from a browser field. It runs in the same PTY
    /// lifecycle as a stable terminal method, never through a shell.
    /// Never pass this method to `authenticate`.
    LegacyTerminal(LegacyTerminalAuth),
    /// A method type the stable schema does not define, or one this build
    /// cannot run. The client keeps it and reports it as unsupported.
    Unsupported(String),
}

/// The deployed legacy terminal-auth descriptor.
///
/// `command` and `args` come from the agent's `initialize` response.
/// `label` is display text only.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LegacyTerminalAuth {
    pub command: String,
    pub args: Vec<String>,
    pub label: Option<String>,
}

/// Provider-neutral observed authentication state.
///
/// This is evidence Batey actually saw, never a durable claim. `Unknown`
/// means ACP supplied no evidence yet. `logout_supported` stays a pure
/// capability and never implies this state.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ObservedAuthState {
    #[default]
    Unknown,
    AuthenticationRequired,
    Authenticated,
}

impl ObservedAuthState {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Unknown => "unknown",
            Self::AuthenticationRequired => "authentication_required",
            Self::Authenticated => "authenticated",
        }
    }
}

/// What a terminal method adds to the configured agent invocation.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct TerminalAuthMethod {
    /// Arguments appended to the base arguments, in advertised order.
    pub args: Vec<String>,
    /// Environment values that override the same names in the base
    /// environment.
    pub env: BTreeMap<String, String>,
}

/// The authentication state one `initialize` response describes.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct AgentAuthState {
    pub methods: Vec<AuthMethod>,
    /// Whether `agentCapabilities.auth.logout` was advertised.
    pub logout_supported: bool,
}

impl AgentAuthState {
    pub fn method(&self, id: &str) -> Option<&AuthMethod> {
        self.methods.iter().find(|method| method.id == id)
    }

    /// Reads both halves of the stable authentication metadata.
    pub fn from_initialize(auth_methods: &Value, agent_capabilities: &Value) -> Self {
        Self {
            methods: parse_auth_methods(auth_methods),
            logout_supported: parse_logout_capability(agent_capabilities),
        }
    }
}

/// Reads the advertised `authMethods` array.
///
/// An entry without a usable `id` cannot be selected, so it is dropped. Every
/// other entry is kept, including a type this build does not implement.
///
/// A stable `type: "terminal"` always wins. Only a non-terminal method with
/// an explicit `_meta["terminal-auth"]` command object becomes the legacy
/// bridge. That object never falls through to ordinary `authenticate`.
pub fn parse_auth_methods(value: &Value) -> Vec<AuthMethod> {
    let Some(entries) = value.as_array() else {
        return Vec::new();
    };
    let mut methods = Vec::with_capacity(entries.len());
    for entry in entries {
        let Some(id) = entry.get("id").and_then(Value::as_str) else {
            tracing::debug!("Dropped an auth method without an id");
            continue;
        };
        if id.is_empty() {
            tracing::debug!("Dropped an auth method with an empty id");
            continue;
        }
        let name = entry
            .get("name")
            .and_then(Value::as_str)
            .unwrap_or(id)
            .to_owned();
        let description = entry
            .get("description")
            .and_then(Value::as_str)
            .map(ToOwned::to_owned);
        // Stable terminal wins over the legacy bridge.
        let stable_terminal = matches!(
            entry.get("type"),
            Some(Value::String(kind)) if kind == TERMINAL_METHOD_TYPE
        );
        let kind = if stable_terminal {
            AuthMethodKind::Terminal(parse_terminal_method(entry))
        } else if let Some(legacy) = parse_legacy_terminal_meta(entry) {
            AuthMethodKind::LegacyTerminal(legacy)
        } else {
            // The stable schema treats a missing `type` as `agent`.
            match entry.get("type") {
                None | Some(Value::Null) => AuthMethodKind::Agent,
                Some(Value::String(kind)) if kind == AGENT_METHOD_TYPE => AuthMethodKind::Agent,
                Some(Value::String(kind)) => AuthMethodKind::Unsupported(kind.clone()),
                Some(other) => AuthMethodKind::Unsupported(other.to_string()),
            }
        };
        methods.push(AuthMethod {
            id: id.to_owned(),
            name,
            description,
            kind,
        });
    }
    methods
}

/// Reads the deployed legacy `_meta["terminal-auth"]` bridge object.
///
/// Returns `None` unless the object carries a usable command. The shape is
/// `{ "command": "...", "args": [...], "label": "..." }`. `args` defaults
/// to empty and `label` is display text only. Anything else is not the
/// bridge and must stay an ordinary method.
pub fn parse_legacy_terminal_meta(entry: &Value) -> Option<LegacyTerminalAuth> {
    let meta = entry.get("_meta")?.get(LEGACY_TERMINAL_AUTH_META_KEY)?;
    let obj = meta.as_object()?;
    let command = obj.get("command")?.as_str()?;
    if !is_valid_legacy_command(command) {
        tracing::debug!("Dropped a legacy terminal-auth entry with an invalid command");
        return None;
    }
    let args = match obj.get("args") {
        None | Some(Value::Null) => Vec::new(),
        Some(Value::Array(items)) => {
            let mut out = Vec::with_capacity(items.len());
            for item in items {
                let Some(text) = item.as_str() else {
                    tracing::debug!("Dropped a legacy terminal-auth entry with a non-string arg");
                    return None;
                };
                if !is_valid_legacy_arg(text) {
                    tracing::debug!("Dropped a legacy terminal-auth entry with an invalid arg");
                    return None;
                }
                out.push(text.to_owned());
            }
            out
        }
        Some(_) => {
            tracing::debug!("Dropped a legacy terminal-auth entry with a non-array args");
            return None;
        }
    };
    if args.len() > 64 {
        tracing::debug!("Dropped a legacy terminal-auth entry with too many args");
        return None;
    }
    let label = obj
        .get("label")
        .and_then(Value::as_str)
        .filter(|label| !label.is_empty() && label.len() <= 200)
        .map(ToOwned::to_owned);
    Some(LegacyTerminalAuth {
        command: command.to_owned(),
        args,
        label,
    })
}

fn is_valid_legacy_command(command: &str) -> bool {
    if command.is_empty() || command.len() > 1024 {
        return false;
    }
    if command.contains('\0') || command.contains('\n') || command.contains('\r') {
        return false;
    }
    // Never a shell line. The bridge runs one program directly.
    for marker in [";", "&&", "||", "|", "`", "$(", "\n"] {
        if command.contains(marker) {
            return false;
        }
    }
    true
}

fn is_valid_legacy_arg(arg: &str) -> bool {
    if arg.len() > 4096 {
        return false;
    }
    !arg.contains('\0')
}

/// Validates a legacy bridge descriptor before execution.
///
/// The command must be usable without a shell and the args must be plain
/// strings. The caller still runs it directly, never through `sh -c`.
pub fn validate_legacy_terminal_auth(legacy: &LegacyTerminalAuth) -> anyhow::Result<()> {
    anyhow::ensure!(
        is_valid_legacy_command(&legacy.command),
        "Legacy terminal-auth command is invalid"
    );
    anyhow::ensure!(
        legacy.args.len() <= 64,
        "Legacy terminal-auth args are too long"
    );
    for arg in &legacy.args {
        anyhow::ensure!(
            is_valid_legacy_arg(arg),
            "Legacy terminal-auth argument is invalid"
        );
    }
    Ok(())
}

fn parse_terminal_method(entry: &Value) -> TerminalAuthMethod {
    let args = entry
        .get("args")
        .and_then(Value::as_array)
        .map(|args| {
            args.iter()
                .filter_map(Value::as_str)
                .map(ToOwned::to_owned)
                .collect()
        })
        .unwrap_or_default();
    let env = entry
        .get("env")
        .and_then(Value::as_object)
        .map(|env| {
            env.iter()
                .filter_map(|(name, value)| {
                    value.as_str().map(|value| (name.clone(), value.to_owned()))
                })
                .collect()
        })
        .unwrap_or_default();
    TerminalAuthMethod { args, env }
}

/// Whether the agent advertised the stable logout capability.
///
/// The stable schema defines `agentCapabilities.auth.logout` as an object.
/// An absent or null value means the agent has no logout support. This is a
/// capability only; it never implies the observed authentication state.
pub fn parse_logout_capability(agent_capabilities: &Value) -> bool {
    agent_capabilities
        .pointer("/auth/logout")
        .is_some_and(Value::is_object)
}

/// The legacy client `_meta` value Batey sends when it implements the bridge.
///
/// Only advertised when the PTY path actually exists. An agent uses it to
/// decide whether to include the `_meta["terminal-auth"]` descriptor.
pub fn legacy_terminal_auth_client_meta_value() -> Value {
    serde_json::json!({ LEGACY_TERMINAL_AUTH_CLIENT_KEY: true })
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn untyped_methods_are_agent_methods() {
        let methods = parse_auth_methods(&json!([
            {"id": "api-key", "name": "API key", "description": "Paste a key"}
        ]));
        assert_eq!(methods.len(), 1);
        assert_eq!(methods[0].id, "api-key");
        assert_eq!(methods[0].name, "API key");
        assert_eq!(methods[0].description.as_deref(), Some("Paste a key"));
        assert_eq!(methods[0].kind, AuthMethodKind::Agent);
        assert_eq!(methods[0].type_name(), "agent");
        assert!(methods[0].is_supported(false));
    }

    #[test]
    fn explicit_agent_type_stays_an_agent_method() {
        let methods = parse_auth_methods(&json!([{"id": "a", "name": "A", "type": "agent"}]));
        assert_eq!(methods[0].kind, AuthMethodKind::Agent);
    }

    #[test]
    fn terminal_methods_keep_their_args_and_env() {
        let methods = parse_auth_methods(&json!([{
            "id": "tui",
            "name": "Terminal login",
            "type": "terminal",
            "args": ["login", "--device"],
            "env": {"AUTH_MODE": "device"}
        }]));
        let AuthMethodKind::Terminal(terminal) = &methods[0].kind else {
            panic!("expected a terminal method, got {:?}", methods[0].kind);
        };
        assert_eq!(terminal.args, vec!["login", "--device"]);
        assert_eq!(
            terminal.env.get("AUTH_MODE").map(String::as_str),
            Some("device")
        );
        assert!(methods[0].is_supported(true));
        assert!(!methods[0].is_supported(false));
    }

    /// An unknown type must never fall back to `agent`: that would send
    /// `authenticate` for a method the agent does not handle that way.
    #[test]
    fn unknown_method_types_are_preserved_as_unsupported() {
        let methods = parse_auth_methods(&json!([
            {"id": "future", "name": "Future", "type": "browser"},
            {"id": "weird", "name": "Weird", "type": 7}
        ]));
        assert_eq!(
            methods[0].kind,
            AuthMethodKind::Unsupported("browser".into())
        );
        assert_eq!(methods[0].type_name(), "browser");
        assert!(!methods[0].is_supported(true));
        assert!(matches!(methods[1].kind, AuthMethodKind::Unsupported(_)));
    }

    #[test]
    fn methods_without_an_id_are_dropped() {
        let methods = parse_auth_methods(&json!([
            {"name": "No id"},
            {"id": "", "name": "Empty id"},
            {"id": "ok"}
        ]));
        assert_eq!(methods.len(), 1);
        assert_eq!(methods[0].id, "ok");
        // A missing name falls back to the id so the entry stays selectable.
        assert_eq!(methods[0].name, "ok");
    }

    #[test]
    fn absent_auth_methods_read_as_empty() {
        assert!(parse_auth_methods(&Value::Null).is_empty());
        assert!(parse_auth_methods(&json!({})).is_empty());
    }

    #[test]
    fn logout_capability_needs_an_object() {
        assert!(parse_logout_capability(&json!({"auth": {"logout": {}}})));
        assert!(!parse_logout_capability(&json!({"auth": {"logout": null}})));
        assert!(!parse_logout_capability(&json!({"auth": {}})));
        assert!(!parse_logout_capability(&json!({})));
        // A truthy non-object is not the stable shape.
        assert!(!parse_logout_capability(&json!({"auth": {"logout": true}})));
    }

    #[test]
    fn state_reads_both_halves_of_initialize() {
        let state = AgentAuthState::from_initialize(
            &json!([{"id": "a", "name": "A"}]),
            &json!({"auth": {"logout": {}}}),
        );
        assert!(state.logout_supported);
        assert_eq!(state.method("a").map(|m| m.name.as_str()), Some("A"));
        assert!(state.method("missing").is_none());
    }

    #[test]
    fn observed_state_defaults_to_unknown_and_round_trips() {
        assert_eq!(ObservedAuthState::default(), ObservedAuthState::Unknown);
        assert_eq!(ObservedAuthState::Unknown.as_str(), "unknown");
        assert_eq!(
            ObservedAuthState::AuthenticationRequired.as_str(),
            "authentication_required"
        );
        assert_eq!(ObservedAuthState::Authenticated.as_str(), "authenticated");
        for state in [
            ObservedAuthState::Unknown,
            ObservedAuthState::AuthenticationRequired,
            ObservedAuthState::Authenticated,
        ] {
            let wire = serde_json::to_value(state).unwrap();
            let back: ObservedAuthState = serde_json::from_value(wire).unwrap();
            assert_eq!(back, state);
        }
    }

    #[test]
    fn legacy_opencode_fixture_becomes_a_terminal_bridge() {
        let methods = parse_auth_methods(&json!([{
            "id": "opencode-login",
            "name": "Log in with OpenCode",
            "description": "Run `opencode auth login` in the terminal",
            "_meta": {
                "terminal-auth": {
                    "command": "opencode",
                    "args": ["auth", "login"],
                    "label": "OpenCode Login"
                }
            }
        }]));
        assert_eq!(methods.len(), 1);
        let AuthMethodKind::LegacyTerminal(legacy) = &methods[0].kind else {
            panic!("expected a legacy bridge, got {:?}", methods[0].kind);
        };
        assert_eq!(legacy.command, "opencode");
        assert_eq!(legacy.args, vec!["auth", "login"]);
        assert_eq!(legacy.label.as_deref(), Some("OpenCode Login"));
        // Presents as terminal so the UI never calls `authenticate`.
        assert_eq!(methods[0].type_name(), "terminal");
        assert!(methods[0].is_terminal());
        assert!(methods[0].is_supported(true));
        assert!(!methods[0].is_supported(false));
        validate_legacy_terminal_auth(legacy).unwrap();
    }

    #[test]
    fn legacy_copilot_fixture_becomes_a_terminal_bridge() {
        let methods = parse_auth_methods(&json!([{
            "id": "copilot-login",
            "name": "Log in with Copilot CLI",
            "description": "Run `copilot login` in the terminal",
            "_meta": {
                "terminal-auth": {
                    "command": "/opt/homebrew/Caskroom/copilot-cli/1.0.63/copilot",
                    "args": ["login"],
                    "label": "Copilot Login"
                }
            }
        }]));
        let AuthMethodKind::LegacyTerminal(legacy) = &methods[0].kind else {
            panic!("expected a legacy bridge, got {:?}", methods[0].kind);
        };
        assert_eq!(
            legacy.command,
            "/opt/homebrew/Caskroom/copilot-cli/1.0.63/copilot"
        );
        assert_eq!(legacy.args, vec!["login"]);
        assert_eq!(methods[0].type_name(), "terminal");
        validate_legacy_terminal_auth(legacy).unwrap();
    }

    #[test]
    fn stable_terminal_wins_over_legacy_metadata() {
        let methods = parse_auth_methods(&json!([{
            "id": "tui",
            "name": "Terminal",
            "type": "terminal",
            "args": ["login"],
            "_meta": {
                "terminal-auth": {
                    "command": "opencode",
                    "args": ["auth", "login"],
                    "label": "OpenCode Login"
                }
            }
        }]));
        assert!(matches!(methods[0].kind, AuthMethodKind::Terminal(_)));
    }

    #[test]
    fn legacy_bridge_needs_a_usable_command() {
        // Missing command is not the bridge; stays an ordinary agent method.
        let methods = parse_auth_methods(&json!([{
            "id": "a",
            "name": "A",
            "_meta": {"terminal-auth": {"args": ["login"]}}
        }]));
        assert_eq!(methods[0].kind, AuthMethodKind::Agent);
        // A shell line is never a bridge command.
        let methods = parse_auth_methods(&json!([{
            "id": "b",
            "name": "B",
            "_meta": {"terminal-auth": {"command": "opencode; rm -rf /", "args": []}}
        }]));
        assert_eq!(methods[0].kind, AuthMethodKind::Agent);
        // Non-string args are not the bridge.
        let methods = parse_auth_methods(&json!([{
            "id": "c",
            "name": "C",
            "_meta": {"terminal-auth": {"command": "opencode", "args": [7]}}
        }]));
        assert_eq!(methods[0].kind, AuthMethodKind::Agent);
    }

    #[test]
    fn legacy_client_meta_advertises_the_bridge_key() {
        let value = legacy_terminal_auth_client_meta_value();
        assert_eq!(
            value.get("terminal-auth"),
            Some(&serde_json::Value::Bool(true))
        );
    }
}
