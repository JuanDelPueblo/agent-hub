//! Stable ACP v1 authentication metadata.
//!
//! `initialize` returns `authMethods` and `agentCapabilities.auth`. This
//! module turns both into typed provider-neutral state. Pueblo Hub never
//! reads an agent id to decide how an agent authenticates.
//!
//! A method type this build does not implement stays in the state as
//! `Unsupported`. The client reports it as unsupported instead of inventing
//! a fallback, because the stable schema treats an untyped method as `agent`
//! and a wrong guess would send the wrong RPC.
use serde_json::Value;
use std::collections::BTreeMap;

/// The `type` value of a method the agent authenticates itself.
pub const AGENT_METHOD_TYPE: &str = "agent";
/// The `type` value of a method the client runs in an interactive terminal.
pub const TERMINAL_METHOD_TYPE: &str = "terminal";

/// One authentication method the agent advertised at `initialize`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AuthMethod {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub kind: AuthMethodKind,
}

impl AuthMethod {
    /// The wire `type` value this method came from.
    pub fn type_name(&self) -> &str {
        match &self.kind {
            AuthMethodKind::Agent => AGENT_METHOD_TYPE,
            AuthMethodKind::Terminal(_) => TERMINAL_METHOD_TYPE,
            AuthMethodKind::Unsupported(kind) => kind,
        }
    }

    /// Whether this build can run the method.
    pub fn is_supported(&self, terminal_supported: bool) -> bool {
        match &self.kind {
            AuthMethodKind::Agent => true,
            AuthMethodKind::Terminal(_) => terminal_supported,
            AuthMethodKind::Unsupported(_) => false,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AuthMethodKind {
    /// The agent authenticates itself through `authenticate(methodId)`.
    Agent,
    /// The client runs the configured agent program in a real terminal.
    /// The client must never pass this method to `authenticate`.
    Terminal(TerminalAuthMethod),
    /// A method type the stable schema does not define, or one this build
    /// cannot run. The client keeps it and reports it as unsupported.
    Unsupported(String),
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
        // The stable schema treats a missing `type` as `agent`.
        let kind = match entry.get("type") {
            None | Some(Value::Null) => AuthMethodKind::Agent,
            Some(Value::String(kind)) if kind == AGENT_METHOD_TYPE => AuthMethodKind::Agent,
            Some(Value::String(kind)) if kind == TERMINAL_METHOD_TYPE => {
                AuthMethodKind::Terminal(parse_terminal_method(entry))
            }
            Some(Value::String(kind)) => AuthMethodKind::Unsupported(kind.clone()),
            Some(other) => AuthMethodKind::Unsupported(other.to_string()),
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
/// An absent or null value means the agent has no logout support.
pub fn parse_logout_capability(agent_capabilities: &Value) -> bool {
    agent_capabilities
        .pointer("/auth/logout")
        .is_some_and(Value::is_object)
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
}
