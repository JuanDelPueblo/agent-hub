//! The Hub service drives a real ACP agent with no HTTP in the picture.
//!
//! This is the proof that a later MCP or federation surface can reuse these
//! operations instead of reimplementing chat and session behavior.
use agent_hub::{
    agents::{AgentDefinition, AgentRegistry},
    config::Config,
    events::{EventLog, EventPayload},
    service::{ChatEdit, HubService, ServiceError},
    session::SessionManager,
    store::Store,
};
use std::{sync::Arc, time::Duration};

fn hub(root: &std::path::Path) -> (Arc<HubService>, Arc<SessionManager>) {
    let store = Arc::new(Store::open(&root.join("hub.db")).unwrap());
    let log = Arc::new(EventLog::persistent(store.clone()).unwrap());
    let history = root.join("history");
    std::fs::create_dir_all(&history).unwrap();
    let agent = AgentDefinition::codex_default()
        .with_command("python3".into())
        .with_args(vec![
            format!("{}/tests/fake_acp.py", env!("CARGO_MANIFEST_DIR")),
            history.display().to_string(),
            "load".into(),
        ]);
    let agents = Arc::new(AgentRegistry::new([agent]));
    let sessions = SessionManager::with_store(agents.clone(), log, Some(store.clone()));
    let mut config = Config {
        agents: agents.clone(),
        ..Default::default()
    };
    config.web.project_roots = vec![root.display().to_string()];
    (
        HubService::new(store, sessions.clone(), agents, &config),
        sessions,
    )
}

/// Waits for the turn the prompt started to finish.
async fn await_turn(log: &EventLog, chat_id: &str) {
    let mut rx = log.subscribe();
    let deadline = tokio::time::Instant::now() + Duration::from_secs(20);
    loop {
        let event = tokio::time::timeout_at(deadline, rx.recv())
            .await
            .expect("turn did not finish in time")
            .unwrap();
        if event.session_id == chat_id {
            match event.payload {
                EventPayload::TurnComplete { .. } => return,
                EventPayload::Error { message } => panic!("turn failed: {message}"),
                _ => {}
            }
        }
    }
}

/// Applies a configuration change once the turn lock is free.
async fn set_config_when_idle(
    hub: &HubService,
    chat_id: &str,
    option_id: &str,
    value: serde_json::Value,
) {
    let deadline = tokio::time::Instant::now() + Duration::from_secs(10);
    loop {
        match hub.set_chat_config(chat_id, option_id, value.clone()).await {
            Ok(_) => return,
            Err(e) if tokio::time::Instant::now() < deadline => {
                assert!(
                    e.to_string().contains("Wait for the active turn"),
                    "unexpected error: {e}"
                );
                tokio::time::sleep(Duration::from_millis(20)).await;
            }
            Err(e) => panic!("configuration never applied: {e}"),
        }
    }
}

#[tokio::test]
async fn full_chat_lifecycle_without_http() {
    let tmp = tempfile::tempdir().unwrap();
    let (hub, sessions) = hub(tmp.path());
    let log = sessions.event_log().clone();

    let project = hub
        .create_project("demo".into(), tmp.path().display().to_string())
        .unwrap();
    assert_eq!(hub.list_projects().unwrap().len(), 1);

    let chat = hub.create_chat(&project.id, "codex", None).await.unwrap();
    assert_eq!(chat.process_state, "STOPPED");
    assert_eq!(chat.turn_state, "IDLE");
    assert_eq!(hub.list_chats(&project.id).await.unwrap().len(), 1);

    hub.prompt_chat(&chat.chat.id, "hello".into())
        .await
        .unwrap();
    await_turn(&log, &chat.chat.id).await;
    assert_eq!(
        hub.get_chat(&chat.chat.id).await.unwrap().process_state,
        "RUNNING"
    );

    let options = hub.chat_config(&chat.chat.id).await.unwrap();
    let option_id = options[0]["id"].as_str().unwrap().to_string();
    // `TurnComplete` is appended before `ask` returns, so the turn lock can
    // still be held for a moment after the event arrives.
    set_config_when_idle(&hub, &chat.chat.id, &option_id, serde_json::json!("large")).await;
    assert_eq!(
        hub.get_chat(&chat.chat.id)
            .await
            .unwrap()
            .chat
            .config_values[&option_id],
        serde_json::json!("large")
    );

    let renamed = hub
        .edit_chat(
            &chat.chat.id,
            ChatEdit {
                title: Some("renamed".into()),
                ..Default::default()
            },
        )
        .await
        .unwrap();
    assert_eq!(renamed.chat.title, "renamed");
    assert!(renamed.chat.title_overridden);

    hub.stop_chat(&chat.chat.id).await.unwrap();
    assert_eq!(
        hub.get_chat(&chat.chat.id).await.unwrap().process_state,
        "STOPPED"
    );

    hub.delete_chat(&chat.chat.id).await.unwrap();
    assert!(hub.list_chats(&project.id).await.unwrap().is_empty());
    hub.delete_project(&project.id).unwrap();
    assert!(hub.list_projects().unwrap().is_empty());

    sessions.shutdown_all().await;
}

#[tokio::test]
async fn failed_turn_emits_error_then_exactly_one_completion() {
    let tmp = tempfile::tempdir().unwrap();
    let (hub, sessions) = hub(tmp.path());
    let log = sessions.event_log().clone();
    let project = hub
        .create_project("demo".into(), tmp.path().display().to_string())
        .unwrap();
    let chat = hub.create_chat(&project.id, "codex", None).await.unwrap();
    let mut events = log.subscribe();

    hub.prompt_chat(&chat.chat.id, "rpc-error".into())
        .await
        .unwrap();

    let mut terminal_events = Vec::new();
    let deadline = tokio::time::Instant::now() + Duration::from_secs(20);
    while terminal_events.len() < 2 {
        let event = tokio::time::timeout_at(deadline, events.recv())
            .await
            .expect("failed turn did not finish in time")
            .unwrap();
        if event.session_id == chat.chat.id
            && matches!(
                &event.payload,
                EventPayload::Error { .. } | EventPayload::TurnComplete { .. }
            )
        {
            terminal_events.push(event.payload);
        }
    }

    assert!(matches!(terminal_events[0], EventPayload::Error { .. }));
    assert!(matches!(
        terminal_events[1],
        EventPayload::TurnComplete { ref stop_reason } if stop_reason == "error"
    ));
    tokio::time::sleep(Duration::from_millis(50)).await;
    let completions = log
        .replay_page(1, log.high_watermark().unwrap(), 10_000)
        .unwrap()
        .into_iter()
        .filter(|event| {
            event.session_id == chat.chat.id
                && matches!(event.payload, EventPayload::TurnComplete { .. })
        })
        .count();
    assert_eq!(completions, 1);

    sessions.shutdown_all().await;
}

#[tokio::test]
async fn errors_carry_the_kind_the_caller_needs() {
    let tmp = tempfile::tempdir().unwrap();
    let (hub, sessions) = hub(tmp.path());
    let project = hub
        .create_project("demo".into(), tmp.path().display().to_string())
        .unwrap();

    // An unknown chat is not found, whichever operation asks for it.
    assert!(matches!(
        hub.cancel_chat("nope").await,
        Err(ServiceError::NotFound(_))
    ));
    assert!(matches!(
        hub.edit_chat("nope", ChatEdit::default()).await,
        Err(ServiceError::NotFound(_))
    ));

    // An agent that is not configured is a bad request, not a missing chat.
    assert!(matches!(
        hub.create_chat(&project.id, "gemini", None).await,
        Err(ServiceError::Invalid(m)) if m == "Unknown agent"
    ));

    // A project that still holds chats cannot be deleted or moved.
    let chat = hub.create_chat(&project.id, "codex", None).await.unwrap();
    assert!(matches!(
        hub.delete_project(&project.id),
        Err(ServiceError::Conflict(_))
    ));
    let other = tmp.path().join("elsewhere");
    std::fs::create_dir_all(&other).unwrap();
    assert!(matches!(
        hub.edit_project(&project.id, "demo".into(), other.display().to_string()),
        Err(ServiceError::Conflict(_))
    ));

    // A path outside the configured roots is refused.
    assert!(matches!(
        hub.create_project("escape".into(), "/".into()),
        Err(ServiceError::Invalid(_))
    ));

    // Missing get_chat returns NotFound
    assert!(matches!(
        hub.get_chat("nope").await,
        Err(ServiceError::NotFound(_))
    ));

    // Missing get_project returns NotFound
    assert!(matches!(
        hub.get_project("nope"),
        Err(ServiceError::NotFound(_))
    ));

    // Missing-project list_chats returns NotFound
    assert!(matches!(
        hub.list_chats("nope").await,
        Err(ServiceError::NotFound(_))
    ));

    // Missing-project create_chat returns NotFound
    assert!(matches!(
        hub.create_chat("nope", "codex", None).await,
        Err(ServiceError::NotFound(_))
    ));

    // An empty prompt never reaches the agent.
    assert!(matches!(
        hub.prompt_chat(&chat.chat.id, "   ".into()).await,
        Err(ServiceError::Invalid(_))
    ));

    // An internal SQLite failure returns ServiceError::Internal.
    {
        let raw = rusqlite::Connection::open(tmp.path().join("hub.db")).unwrap();
        raw.execute_batch("DROP TABLE projects;").unwrap();
    }
    assert!(matches!(
        hub.list_projects(),
        Err(ServiceError::Internal(_))
    ));

    sessions.shutdown_all().await;
}

#[tokio::test]
async fn rejected_saved_config_blocks_until_only_that_option_is_reset() {
    let root = tempfile::tempdir().unwrap();
    let store = Arc::new(Store::open(&root.path().join("hub.db")).unwrap());
    let log = Arc::new(EventLog::persistent(store.clone()).unwrap());
    let history = root.path().join("history");
    std::fs::create_dir_all(&history).unwrap();
    let agent = AgentDefinition::codex_default()
        .with_command("python3".into())
        .with_args(vec![
            format!("{}/tests/fake_acp.py", env!("CARGO_MANIFEST_DIR")),
            history.display().to_string(),
            "reject-config".into(),
        ]);
    let agents = Arc::new(AgentRegistry::new([agent]));
    let sessions = SessionManager::with_store(agents.clone(), log, Some(store.clone()));
    let mut config = Config {
        agents: agents.clone(),
        ..Default::default()
    };
    config.web.project_roots = vec![root.path().display().to_string()];
    let hub = HubService::new(store.clone(), sessions.clone(), agents, &config);
    let project = hub
        .create_project("demo".into(), root.path().display().to_string())
        .unwrap();
    let chat = hub.create_chat(&project.id, "codex", None).await.unwrap();
    hub.resume_chat(&chat.chat.id).await.unwrap();
    hub.stop_chat(&chat.chat.id).await.unwrap();
    store
        .update_chat(&chat.chat.id, |chat| {
            chat.config_values["model"] = serde_json::json!("large");
        })
        .unwrap();

    assert!(matches!(
        hub.resume_chat(&chat.chat.id).await,
        Err(ServiceError::SavedConfigRejected { option_id, .. }) if option_id == "model"
    ));
    hub.clear_saved_config(&chat.chat.id, "model")
        .await
        .unwrap();
    hub.resume_chat(&chat.chat.id).await.unwrap();
    assert!(store
        .chat(&chat.chat.id)
        .unwrap()
        .config_values
        .get("model")
        .is_none());
    sessions.shutdown_all().await;
}
