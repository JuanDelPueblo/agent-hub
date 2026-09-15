//! Stable ACP v1 completeness: commands, modes, usage, message IDs,
//! session/delete, cancellation semantics, and metadata preservation.

use pueblo_hub::{
    agents::{AgentDefinition, AgentRegistry},
    config::Config,
    events::{EventLog, EventPayload},
    service::HubService,
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

async fn collect_text(log: &EventLog, chat_id: &str, start_seq: u64) -> String {
    match log.replay_from(start_seq) {
        pueblo_hub::events::ReplayResult::Complete(events)
        | pueblo_hub::events::ReplayResult::Partial { events, .. } => events
            .iter()
            .filter(|e| e.session_id == chat_id)
            .filter_map(|e| match &e.payload {
                EventPayload::MessageChunk { text, .. } => Some(text.as_str()),
                _ => None,
            })
            .collect::<Vec<_>>()
            .join(""),
    }
}

#[tokio::test]
async fn slash_commands_appear_and_invoke_as_prompt_text() {
    let tmp = tempfile::tempdir().unwrap();
    let (service, sessions) = hub(tmp.path());
    let log = sessions.event_log().clone();
    let project = service
        .create_project("demo".into(), tmp.path().display().to_string())
        .unwrap();
    let chat = service.create_chat(&project.id, "codex", None).await.unwrap();

    service.prompt_chat(&chat.chat.id, "commands".into()).await.unwrap();
    await_turn(&log, &chat.chat.id).await;

    let commands = service.chat_commands(&chat.chat.id).await.unwrap();
    let arr = commands.as_array().expect("commands array");
    assert_eq!(arr.len(), 2);
    assert_eq!(arr[0]["name"], "plan");
    assert_eq!(arr[0]["input"]["hint"], "goal");

    // Invoking a command is ordinary prompt text, not a command RPC.
    service
        .prompt_chat(&chat.chat.id, "/plan draft the router".into())
        .await
        .unwrap();
    await_turn(&log, &chat.chat.id).await;

    sessions.shutdown_all().await;
}

#[tokio::test]
async fn boolean_config_and_legacy_modes_fallback() {
    let tmp = tempfile::tempdir().unwrap();
    let (service, sessions) = hub(tmp.path());
    let log = sessions.event_log().clone();
    let project = service
        .create_project("demo".into(), tmp.path().display().to_string())
        .unwrap();
    let chat = service.create_chat(&project.id, "codex", None).await.unwrap();

    // Stable boolean option works and retains generic metadata.
    let options = service.chat_config(&chat.chat.id).await.unwrap();
    assert!(options.as_array().unwrap().iter().any(|o| o["id"] == "web_search" && o["type"] == "boolean"));
    service
        .set_chat_config(&chat.chat.id, "web_search", serde_json::json!(true))
        .await
        .unwrap();

    // Legacy modes work as fallback when no `mode` config category covers them.
    let modes = service.chat_modes(&chat.chat.id).await.unwrap();
    assert_eq!(modes["current_mode_id"], "ask");
    service.set_chat_mode(&chat.chat.id, "act").await.unwrap();
    let modes = service.chat_modes(&chat.chat.id).await.unwrap();
    assert_eq!(modes["current_mode_id"], "act");

    // Dynamic mode update during a session is preserved.
    service.prompt_chat(&chat.chat.id, "modes".into()).await.unwrap();
    await_turn(&log, &chat.chat.id).await;
    let modes = service.chat_modes(&chat.chat.id).await.unwrap();
    assert_eq!(modes["current_mode_id"], "act");

    sessions.shutdown_all().await;
}

#[tokio::test]
async fn usage_message_ids_and_user_chunk_no_duplication() {
    let tmp = tempfile::tempdir().unwrap();
    let (service, sessions) = hub(tmp.path());
    let log = sessions.event_log().clone();
    let project = service
        .create_project("demo".into(), tmp.path().display().to_string())
        .unwrap();
    let chat = service.create_chat(&project.id, "codex", None).await.unwrap();

    let start = log.next_seq();
    service.prompt_chat(&chat.chat.id, "usage".into()).await.unwrap();
    await_turn(&log, &chat.chat.id).await;
    let usage = service.chat_usage(&chat.chat.id).await.unwrap();
    assert_eq!(usage["used"], 100);
    assert_eq!(usage["size"], 2000);

    let start2 = log.next_seq();
    service.prompt_chat(&chat.chat.id, "message-id".into()).await.unwrap();
    await_turn(&log, &chat.chat.id).await;
    let text = collect_text(&log, &chat.chat.id, start2).await;
    assert!(text.contains("part-1"));
    assert!(text.contains("next"));
    // Message IDs survive through the event model.
    let events = match log.replay_from(start2) {
        pueblo_hub::events::ReplayResult::Complete(e) => e,
        _ => panic!("expected complete"),
    };
    let chunks: Vec<_> = events
        .iter()
        .filter_map(|e| match &e.payload {
            EventPayload::MessageChunk { message_id, .. } => Some(message_id.clone()),
            _ => None,
        })
        .collect();
    assert!(chunks.iter().any(|id| id.as_deref() == Some("m1")));
    assert!(chunks.iter().any(|id| id.as_deref() == Some("m2")));

    // user_message_chunk reflections never duplicate local history.
    let before: Vec<_> = match log.replay_from(start) {
        pueblo_hub::events::ReplayResult::Complete(e) => e,
        _ => panic!("expected complete"),
    }
    .into_iter()
    .filter(|e| e.session_id == chat.chat.id && matches!(e.payload, EventPayload::UserMessage { .. }))
    .collect();
    let user_count_before = before.len();
    service.prompt_chat(&chat.chat.id, "user-chunk".into()).await.unwrap();
    await_turn(&log, &chat.chat.id).await;
    let after: Vec<_> = match log.replay_from(start) {
        pueblo_hub::events::ReplayResult::Complete(e) => e,
        _ => panic!("expected complete"),
    }
    .into_iter()
    .filter(|e| e.session_id == chat.chat.id && matches!(e.payload, EventPayload::UserMessage { .. }))
    .collect();
    // One new local user message, no duplicate from the reflected chunk.
    assert_eq!(after.len(), user_count_before + 1);

    sessions.shutdown_all().await;
}

#[tokio::test]
async fn remote_session_delete_is_capability_gated() {
    let tmp = tempfile::tempdir().unwrap();
    let (service, sessions) = hub(tmp.path());
    let project = service
        .create_project("demo".into(), tmp.path().display().to_string())
        .unwrap();
    let chat = service.create_chat(&project.id, "codex", None).await.unwrap();

    let listed = service.remote_sessions(&chat.chat.id, None).await.unwrap();
    let sessions_arr = listed["sessions"].as_array().unwrap().clone();
    assert!(!sessions_arr.is_empty());
    // Delete one remote session; Pueblo's own chat remains.
    let remote_id = sessions_arr[0]["sessionId"].as_str().unwrap().to_string();
    // The live session itself may be the first entry; pick a non-live one when possible.
    let target = sessions_arr
        .iter()
        .find(|s| s["sessionId"].as_str() != Some(remote_id.as_str()))
        .and_then(|s| s["sessionId"].as_str())
        .unwrap_or(&remote_id)
        .to_string();
    service.delete_remote_session(&chat.chat.id, &target).await.unwrap();
    let listed2 = service.remote_sessions(&chat.chat.id, None).await.unwrap();
    assert!(!listed2["sessions"]
        .as_array()
        .unwrap()
        .iter()
        .any(|s| s["sessionId"] == target));
    // Pueblo chat still exists.
    assert!(service.get_chat(&chat.chat.id).await.is_ok());

    sessions.shutdown_all().await;
}

#[tokio::test]
async fn tool_locations_and_session_info_preserved() {
    let tmp = tempfile::tempdir().unwrap();
    let (service, sessions) = hub(tmp.path());
    let log = sessions.event_log().clone();
    let project = service
        .create_project("demo".into(), tmp.path().display().to_string())
        .unwrap();
    let chat = service.create_chat(&project.id, "codex", None).await.unwrap();

    service.prompt_chat(&chat.chat.id, "tool-loc".into()).await.unwrap();
    await_turn(&log, &chat.chat.id).await;
    let events = match log.replay_from(1) {
        pueblo_hub::events::ReplayResult::Complete(e) => e,
        _ => panic!("expected complete"),
    };
    assert!(events.iter().any(|e| matches!(
        &e.payload,
        EventPayload::ToolCall { locations: Some(_), .. }
    )));

    service
        .prompt_chat(&chat.chat.id, "title:Hello World".into())
        .await
        .unwrap();
    await_turn(&log, &chat.chat.id).await;
    assert_eq!(service.get_chat(&chat.chat.id).await.unwrap().chat.title, "Hello World");

    sessions.shutdown_all().await;
}
