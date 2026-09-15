//! Per-agent secret isolation through real session startup.
//!
//! Two agents with two different secrets start real ACP processes. Each
//! process must observe exactly its own secret: the startup drain removes
//! both names from the inherited environment, and each session injects only
//! the names its agent lists in `pass_env`.
use batey::{
    agents::{AgentDefinition, AgentRegistry},
    config::Config,
    events::EventLog,
    service::HubService,
    session::SessionManager,
    store::Store,
    workspace_env::take_secret_env,
};
use std::sync::Arc;

const SECRET_A: &str = "BATEY_TEST_ISOLATION_TOKEN_A";
const SECRET_B: &str = "BATEY_TEST_ISOLATION_TOKEN_B";

fn agent(id: &str, history: &std::path::Path, pass_env: &[&str]) -> AgentDefinition {
    AgentDefinition::new(id, "python3")
        .with_args(vec![
            format!("{}/tests/fake_acp.py", env!("CARGO_MANIFEST_DIR")),
            history.display().to_string(),
            "dump-env".into(),
        ])
        .with_pass_env(pass_env.iter().map(|name| name.to_string()).collect())
}

fn read_dump(history: &std::path::Path) -> serde_json::Value {
    let dumps: Vec<_> = std::fs::read_dir(history)
        .unwrap()
        .filter_map(|entry| entry.ok())
        .filter(|entry| {
            entry
                .path()
                .extension()
                .is_some_and(|extension| extension == "json")
        })
        .collect();
    assert_eq!(
        dumps.len(),
        1,
        "expected one environment dump, got {dumps:?}"
    );
    serde_json::from_str(&std::fs::read_to_string(dumps[0].path()).unwrap()).unwrap()
}

#[tokio::test]
async fn agents_cannot_see_each_others_secrets() {
    unsafe {
        std::env::set_var(SECRET_A, "secret-value-a");
        std::env::set_var(SECRET_B, "secret-value-b");
    }
    // Startup takes both names out of the process environment into a stash,
    // exactly like the binary does for `--secret-env-vars`.
    let stash = take_secret_env(&[SECRET_A.to_string(), SECRET_B.to_string()]);
    assert!(std::env::var(SECRET_A).is_err());
    assert!(std::env::var(SECRET_B).is_err());

    let root = tempfile::tempdir().unwrap();
    let history_a = root.path().join("history-a");
    let history_b = root.path().join("history-b");
    std::fs::create_dir_all(&history_a).unwrap();
    std::fs::create_dir_all(&history_b).unwrap();
    let agents = Arc::new(AgentRegistry::new([
        agent("agent-a", &history_a, &[SECRET_A]),
        agent("agent-b", &history_b, &[SECRET_B]),
    ]));
    let store = Arc::new(Store::open(&root.path().join("hub.db")).unwrap());
    let log = Arc::new(EventLog::persistent(store.clone()).unwrap());
    let sessions = SessionManager::with_store(agents.clone(), log, Some(store.clone()));
    sessions.set_secret_env(stash);
    let mut config = Config {
        agents: agents.clone(),
        ..Default::default()
    };
    config.web.project_roots = vec![root.path().display().to_string()];
    let hub = HubService::new(store, sessions.clone(), agents, &config);
    let project = hub
        .create_project("demo".into(), root.path().display().to_string())
        .unwrap();

    for (agent_id, history, own, other) in [
        ("agent-a", &history_a, SECRET_A, SECRET_B),
        ("agent-b", &history_b, SECRET_B, SECRET_A),
    ] {
        let chat = hub.create_chat(&project.id, agent_id, None).await.unwrap();
        sessions
            .get_by_id(&chat.chat.id)
            .await
            .expect("chat session missing")
            .ensure_running()
            .await
            .expect("agent did not start");
        let observed = read_dump(history);
        assert_eq!(
            observed.get(own).and_then(|value| value.as_str()),
            Some(if own == SECRET_A {
                "secret-value-a"
            } else {
                "secret-value-b"
            }),
            "{agent_id} did not receive its own secret"
        );
        assert!(
            observed.get(other).is_none(),
            "{agent_id} observed the other agent's secret"
        );
    }

    sessions.shutdown_all().await;
}
