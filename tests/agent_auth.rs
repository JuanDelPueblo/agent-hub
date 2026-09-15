//! Stable ACP v1 agent-level authentication: metadata, `authenticate`,
//! capability-gated `logout`, the structured `auth_required` state, and the
//! shared REST contract.
use axum::{
    body::{to_bytes, Body},
    http::Request,
};
use pueblo_hub::{
    agents::{AgentDefinition, AgentRegistry},
    auth::TERMINAL_AUTH_SUPPORTED,
    config::{Config, PathOverrides, PuebloPaths},
    events::EventLog,
    service::HubService,
    session::SessionManager,
    store::Store,
    web::{router, AppState},
};
use serde_json::Value;
use std::{path::Path, sync::Arc};
use tower::ServiceExt;

/// An agent whose ACP process is the fake peer in one of its auth modes.
fn agent(id: &str, history: &Path, mode: &str) -> AgentDefinition {
    AgentDefinition::new(id, "python3").with_args(vec![
        format!("{}/tests/fake_acp.py", env!("CARGO_MANIFEST_DIR")),
        history.display().to_string(),
        mode.into(),
    ])
}

struct Harness {
    app: axum::Router,
    hub: Arc<HubService>,
    sessions: Arc<SessionManager>,
    root: tempfile::TempDir,
}

impl Harness {
    /// Builds a hub whose catalog holds one agent per named auth mode.
    fn new(modes: &[(&str, &str)]) -> Self {
        let root = tempfile::tempdir().unwrap();
        let paths = PuebloPaths::from_overrides(PathOverrides {
            database: Some(root.path().join("hub.db")),
            data_dir: Some(root.path().join("data")),
            state_dir: Some(root.path().join("state")),
            ..Default::default()
        });
        let store = Arc::new(Store::open(&paths.database).unwrap());
        let events = Arc::new(EventLog::persistent(store.clone()).unwrap());
        let definitions: Vec<AgentDefinition> = modes
            .iter()
            .map(|(id, mode)| {
                let history = root.path().join(id);
                std::fs::create_dir_all(&history).unwrap();
                agent(id, &history, mode)
            })
            .collect();
        let agents = Arc::new(AgentRegistry::new(definitions));
        let sessions = SessionManager::with_store(agents.clone(), events, Some(store.clone()));
        let mut config = Config {
            paths,
            agents: agents.clone(),
            ..Default::default()
        };
        config.web.project_roots = vec![root.path().display().to_string()];
        let config = Arc::new(config);
        let hub = HubService::new(store, sessions.clone(), agents, &config);
        let app = router(AppState::new(sessions.clone(), config, 8765));
        Self {
            app,
            hub,
            sessions,
            root,
        }
    }

    fn history(&self, agent_id: &str) -> std::path::PathBuf {
        self.root.path().join(agent_id)
    }

    /// What the fake agent recorded for one request kind, if anything.
    fn recorded(&self, agent_id: &str, file: &str) -> Option<Value> {
        let path = self.history(agent_id).join(file);
        path.exists()
            .then(|| serde_json::from_str(&std::fs::read_to_string(path).unwrap()).unwrap())
    }

    async fn request(&self, method: &str, uri: &str) -> (u16, Value) {
        let response = self
            .app
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("host", "127.0.0.1:8765")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        let status = response.status().as_u16();
        let bytes = to_bytes(response.into_body(), 1_000_000).await.unwrap();
        let body = serde_json::from_slice(&bytes).unwrap_or(Value::Null);
        (status, body)
    }
}

/// The advertised methods survive with their kinds, and a kind this build
/// cannot run comes back as unsupported rather than as a guessed fallback.
#[tokio::test]
async fn auth_methods_and_capabilities_are_preserved_by_kind() {
    let harness = Harness::new(&[("full", "auth"), ("plain", "auth-no-logout")]);
    let (status, body) = harness.request("GET", "/api/agents/full/auth").await;
    assert_eq!(status, 200, "{body}");
    assert_eq!(body["agent_id"], "full");
    assert_eq!(body["logout_supported"], true);
    assert_eq!(body["terminal_supported"], TERMINAL_AUTH_SUPPORTED);

    let methods = body["methods"].as_array().unwrap();
    assert_eq!(methods.len(), 4, "{body}");
    // An untyped method is an agent method, per the stable schema.
    assert_eq!(methods[0]["id"], "api-key");
    assert_eq!(methods[0]["type"], "agent");
    assert_eq!(methods[0]["name"], "API key");
    assert_eq!(methods[0]["description"], "Paste an API key");
    assert_eq!(methods[0]["supported"], true);
    assert_eq!(methods[2]["id"], "tui");
    assert_eq!(methods[2]["type"], "terminal");
    assert_eq!(methods[2]["supported"], TERMINAL_AUTH_SUPPORTED);
    // The unknown kind is kept and reported, never turned into `agent`.
    assert_eq!(methods[3]["id"], "future");
    assert_eq!(methods[3]["type"], "browser-popup");
    assert_eq!(methods[3]["supported"], false);

    let (status, body) = harness.request("GET", "/api/agents/plain/auth").await;
    assert_eq!(status, 200);
    assert_eq!(body["logout_supported"], false);
    harness.sessions.shutdown_all().await;
}

/// The client advertises terminal authentication only when it truly runs a
/// PTY. An agent reads that flag before it offers a terminal method.
#[tokio::test]
async fn client_advertises_terminal_auth_capability_truthfully() {
    let harness = Harness::new(&[("full", "auth")]);
    let (status, _) = harness.request("GET", "/api/agents/full/auth").await;
    assert_eq!(status, 200);
    let recorded = harness.recorded("full", "initialize.json").unwrap();
    assert_eq!(
        recorded[0]["auth"]["terminal"],
        Value::Bool(TERMINAL_AUTH_SUPPORTED)
    );
    harness.sessions.shutdown_all().await;
}

/// An `agent` method reaches the stable `authenticate` request with the id
/// the client selected, and the state is read again afterwards.
#[tokio::test]
async fn agent_method_authenticate_succeeds_and_refreshes_state() {
    let harness = Harness::new(&[("full", "auth")]);
    let (status, body) = harness
        .request("POST", "/api/agents/full/auth/api-key")
        .await;
    assert_eq!(status, 200, "{body}");
    assert_eq!(body["agent_id"], "full");
    let sent = harness.recorded("full", "authenticate.json").unwrap();
    assert_eq!(sent.as_array().unwrap().len(), 1);
    assert_eq!(sent[0]["methodId"], "api-key");
    // One process ran `authenticate`, and a second read the refreshed state.
    let initializes = harness.recorded("full", "initialize.json").unwrap();
    assert_eq!(initializes.as_array().unwrap().len(), 2);
    harness.sessions.shutdown_all().await;
}

/// An agent that rejects the method reports a failure. Pueblo Hub never
/// reports success it did not get.
#[tokio::test]
async fn agent_method_authenticate_error_is_reported() {
    let harness = Harness::new(&[("full", "auth")]);
    let (status, body) = harness
        .request("POST", "/api/agents/full/auth/api-key-broken")
        .await;
    assert_eq!(status, 400, "{body}");
    assert!(
        body["error"].as_str().unwrap().contains("Key rejected"),
        "{body}"
    );
    harness.sessions.shutdown_all().await;
}

/// The stable schema forbids `authenticate` for a terminal method. The
/// request is refused, and no `authenticate` ever reaches the agent.
#[tokio::test]
async fn terminal_methods_never_reach_authenticate() {
    let harness = Harness::new(&[("full", "auth")]);
    let (status, body) = harness.request("POST", "/api/agents/full/auth/tui").await;
    assert_eq!(status, 400, "{body}");
    assert!(
        body["error"].as_str().unwrap().contains("terminal"),
        "{body}"
    );
    assert!(harness.recorded("full", "authenticate.json").is_none());
    harness.sessions.shutdown_all().await;
}

/// An unknown method kind is reported as unsupported. Guessing `agent` would
/// send the wrong request.
#[tokio::test]
async fn unknown_method_kinds_are_refused_without_a_fallback() {
    let harness = Harness::new(&[("full", "auth")]);
    let (status, body) = harness
        .request("POST", "/api/agents/full/auth/future")
        .await;
    assert_eq!(status, 400, "{body}");
    assert!(
        body["error"].as_str().unwrap().contains("browser-popup"),
        "{body}"
    );
    assert!(harness.recorded("full", "authenticate.json").is_none());

    // A method the agent never advertised is not found.
    let (status, _) = harness
        .request("POST", "/api/agents/full/auth/invented")
        .await;
    assert_eq!(status, 404);
    assert!(harness.recorded("full", "authenticate.json").is_none());
    harness.sessions.shutdown_all().await;
}

/// Logout goes out only when the agent advertised the capability.
#[tokio::test]
async fn logout_is_capability_gated() {
    let harness = Harness::new(&[("full", "auth"), ("plain", "auth-no-logout")]);
    let (status, body) = harness.request("POST", "/api/agents/full/logout").await;
    assert_eq!(status, 200, "{body}");
    assert_eq!(
        harness
            .recorded("full", "logout.json")
            .unwrap()
            .as_array()
            .unwrap()
            .len(),
        1
    );

    let (status, body) = harness.request("POST", "/api/agents/plain/logout").await;
    assert_eq!(status, 409, "{body}");
    assert!(harness.recorded("plain", "logout.json").is_none());
    harness.sessions.shutdown_all().await;
}

#[tokio::test]
async fn unknown_agents_are_not_found() {
    let harness = Harness::new(&[("full", "auth")]);
    for (method, uri) in [
        ("GET", "/api/agents/nobody/auth"),
        ("POST", "/api/agents/nobody/auth/api-key"),
        ("POST", "/api/agents/nobody/logout"),
        ("POST", "/api/agents/nobody/auth/terminal/tui"),
        ("GET", "/api/agent-auth/does-not-exist"),
        ("POST", "/api/agent-auth/does-not-exist/cancel"),
    ] {
        let (status, body) = harness.request(method, uri).await;
        assert_eq!(status, 404, "{method} {uri} returned {status}: {body}");
    }
    harness.sessions.shutdown_all().await;
}

/// An agent that answers `auth_required` produces a recoverable structured
/// state. The chat row, its workspace, and its history all survive.
#[tokio::test]
async fn auth_required_is_structured_and_keeps_durable_chat_data() {
    let harness = Harness::new(&[("gated", "auth-required")]);
    let project = harness
        .hub
        .create_project("demo".into(), harness.root.path().display().to_string())
        .unwrap();
    let chat = harness
        .hub
        .create_chat(&project.id, "gated", None)
        .await
        .unwrap();

    let (status, body) = harness
        .request("POST", &format!("/api/chats/{}/resume", chat.chat.id))
        .await;
    assert_eq!(status, 409, "{body}");
    assert_eq!(body["code"], "auth_required");
    assert_eq!(body["details"]["agent_id"], "gated");

    // The failure is recoverable: nothing durable was destroyed.
    let (status, reread) = harness
        .request("GET", &format!("/api/chats/{}", chat.chat.id))
        .await;
    assert_eq!(status, 200, "{reread}");
    assert_eq!(reread["id"], chat.chat.id);
    let (status, history) = harness
        .request("GET", &format!("/api/chats/{}/history", chat.chat.id))
        .await;
    assert_eq!(status, 200, "{history}");
    // The agent still advertises how to authenticate.
    let (status, auth) = harness.request("GET", "/api/agents/gated/auth").await;
    assert_eq!(status, 200, "{auth}");
    assert!(!auth["methods"].as_array().unwrap().is_empty());
    harness.sessions.shutdown_all().await;
}

/// Every authentication route sits behind the shared web authentication
/// middleware, including the flow socket.
#[tokio::test]
async fn web_authentication_middleware_protects_every_auth_route() {
    let root = tempfile::tempdir().unwrap();
    let store = Arc::new(Store::open(&root.path().join("hub.db")).unwrap());
    let events = Arc::new(EventLog::persistent(store.clone()).unwrap());
    let history = root.path().join("full");
    std::fs::create_dir_all(&history).unwrap();
    let agents = Arc::new(AgentRegistry::new([agent("full", &history, "auth")]));
    let sessions = SessionManager::with_store(agents.clone(), events, Some(store));
    let mut config = Config {
        agents: agents.clone(),
        ..Default::default()
    };
    config.web.auth_token = Some("secret-token".into());
    config.web.project_roots = vec![root.path().display().to_string()];
    let app = router(AppState::new(sessions.clone(), Arc::new(config), 8765));

    let routes = [
        ("GET", "/api/agents/full/auth"),
        ("POST", "/api/agents/full/auth/api-key"),
        ("POST", "/api/agents/full/logout"),
        ("POST", "/api/agents/full/auth/terminal/tui"),
        ("GET", "/api/agent-auth/any-flow"),
        ("POST", "/api/agent-auth/any-flow/cancel"),
        ("GET", "/api/agent-auth/any-flow/ws"),
    ];
    for (method, uri) in routes {
        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("host", "127.0.0.1:8765")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(
            response.status(),
            401,
            "{method} {uri} answered without a token"
        );
    }

    // A foreign origin is refused even with the right token.
    let response = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/agents/full/auth")
                .header("host", "127.0.0.1:8765")
                .header("origin", "https://evil.example")
                .header("authorization", "Bearer secret-token")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(response.status(), 403);
    sessions.shutdown_all().await;
}
