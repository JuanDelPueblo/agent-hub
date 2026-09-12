use axum::{
    body::{to_bytes, Body},
    http::Request,
};
use ccgonext::{
    config::{parse_agents, AgentConfig, Config},
    events::{EventLog, EventPayload},
    session::SessionManager,
    store::Store,
    web::{router, AppState},
};
use serde_json::{json, Value};
use std::{sync::Arc, time::Duration};
use tower::ServiceExt;

fn manager(root: &std::path::Path, can_load: bool) -> Arc<SessionManager> {
    let store = Arc::new(Store::open(&root.join("hub.db")).unwrap());
    let log = Arc::new(EventLog::persistent(store.clone()).unwrap());
    let history = root.join("history");
    std::fs::create_dir_all(&history).unwrap();
    let agent = AgentConfig::codex_default()
        .with_command("python3".into())
        .with_args(vec![
            format!("{}/tests/fake_acp.py", env!("CARGO_MANIFEST_DIR")),
            history.display().to_string(),
            if can_load { "load" } else { "no-load" }.into(),
        ])
        .with_idle_timeout(Duration::ZERO);
    SessionManager::with_store(
        std::collections::HashMap::from([("codex".into(), agent)]),
        log,
        Some(store),
    )
}

#[tokio::test]
async fn independent_sessions_resume_config_permission_and_idle_cleanup() {
    let tmp = tempfile::tempdir().unwrap();
    let mgr = manager(tmp.path(), true);
    let db = mgr.store.as_ref().unwrap();
    let project = db
        .create_project("test".into(), tmp.path().display().to_string())
        .unwrap();
    let a = db
        .create_chat(project.id.clone(), "codex".into(), "one".into())
        .unwrap();
    let b = db
        .create_chat(project.id, "codex".into(), "two".into())
        .unwrap();
    let one = mgr.get_by_id(&a.id).await.unwrap();
    let two = mgr.get_by_id(&b.id).await.unwrap();
    assert!(!Arc::ptr_eq(&one, &two));
    let (r1, r2) = tokio::join!(one.ask("hi".into(), None), two.ask("hi".into(), None));
    assert_ne!(r1.unwrap(), r2.unwrap());
    let sid = db.chat(&a.id).unwrap().acp_session_id.unwrap();
    assert!(one
        .ask("next".into(), None)
        .await
        .unwrap()
        .contains(":2:small"));
    one.set_config("model", json!("large")).await.unwrap();
    assert!(one.set_config("model", json!("invalid")).await.is_err());
    let mut events = mgr.event_log().subscribe();
    let prompt = {
        let one = one.clone();
        tokio::spawn(async move { one.ask("permission".into(), None).await })
    };
    let permission = tokio::time::timeout(Duration::from_secs(10), async {
        loop {
            if let EventPayload::PermissionRequest { id, .. } = events.recv().await.unwrap().payload
            {
                break id;
            }
        }
    })
    .await
    .unwrap();
    one.respond_to_permission(&permission, true).await;
    assert_eq!(prompt.await.unwrap().unwrap(), "yes");
    mgr.reap_idle().await;
    assert_eq!(db.chats().unwrap().len(), 2);
    assert_eq!(
        one.process_state().await,
        ccgonext::state::ProcessState::Stopped
    );
    mgr.shutdown_all().await;
    drop(one);
    drop(two);
    drop(mgr);
    let mgr = manager(tmp.path(), true);
    let one = mgr.get_by_id(&a.id).await.unwrap();
    let result = one.ask("after restart".into(), None).await.unwrap();
    assert_eq!(result, format!("{sid}:4:large"));
    let history = match mgr.event_log().replay_from(0) {
        ccgonext::events::ReplayResult::Complete(e)
        | ccgonext::events::ReplayResult::Partial { events: e, .. } => e,
    };
    assert!(!history
        .iter()
        .any(|e| matches!(&e.payload, EventPayload::MessageChunk {text} if text == "REPLAY")));
    mgr.shutdown_all().await;
}

#[tokio::test]
async fn unsupported_resume_never_creates_another_conversation() {
    let tmp = tempfile::tempdir().unwrap();
    let mgr = manager(tmp.path(), false);
    let db = mgr.store.as_ref().unwrap();
    let p = db
        .create_project("test".into(), tmp.path().display().to_string())
        .unwrap();
    let chat = db.create_chat(p.id, "codex".into(), "chat".into()).unwrap();
    let s = mgr.get_by_id(&chat.id).await.unwrap();
    s.ask("hi".into(), None).await.unwrap();
    let saved = db.chat(&chat.id).unwrap().acp_session_id;
    s.stop().await.unwrap();
    assert!(s
        .resume()
        .await
        .unwrap_err()
        .to_string()
        .contains("cannot resume"));
    assert_eq!(db.chat(&chat.id).unwrap().acp_session_id, saved);
    assert_eq!(
        std::fs::read_dir(tmp.path().join("history"))
            .unwrap()
            .count(),
        1
    );
    mgr.shutdown_all().await;
}

#[tokio::test]
async fn api_validation_and_chat_identity() {
    let tmp = tempfile::tempdir().unwrap();
    let mgr = manager(tmp.path(), true);
    let mut config = Config::default();
    config.web.project_roots = vec![tmp.path().display().to_string()];
    let app = router(AppState {
        session_manager: mgr.clone(),
        config: Arc::new(config),
        server_port: 8765,
    });
    async fn call(app: &axum::Router, method: &str, path: &str, body: Value) -> (u16, Value) {
        let r = app
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(path)
                    .header("host", "127.0.0.1:8765")
                    .header("content-type", "application/json")
                    .body(Body::from(body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();
        let status = r.status().as_u16();
        let body = to_bytes(r.into_body(), 1_000_000).await.unwrap();
        (status, serde_json::from_slice(&body).unwrap_or(Value::Null))
    }
    assert_eq!(
        call(
            &app,
            "POST",
            "/api/projects",
            json!({"name":"bad","path":"/"})
        )
        .await
        .0,
        400
    );
    let (status, p) = call(
        &app,
        "POST",
        "/api/projects",
        json!({"name":"ok","path":tmp.path()}),
    )
    .await;
    assert_eq!(status, 200);
    let path = format!("/api/projects/{}/chats", p["id"].as_str().unwrap());
    assert_eq!(
        call(
            &app,
            "POST",
            &path,
            json!({"agent":"/bin/sh","title":"bad"})
        )
        .await
        .0,
        400
    );
    let (_, a) = call(&app, "POST", &path, json!({"agent":"codex","title":"a"})).await;
    let (_, b) = call(&app, "POST", &path, json!({"agent":"codex","title":"b"})).await;
    assert_ne!(a["id"], b["id"]);
    assert_eq!(a["permission_policy"], "ask");
    let response = app
        .oneshot(
            Request::builder()
                .uri("/api/projects")
                .header("host", "127.0.0.1:8765")
                .header("origin", "https://evil.example")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(response.status(), 403);
    mgr.shutdown_all().await;
}

#[test]
fn generic_configuration_is_validated() {
    let agents =
        parse_agents(r#"{"custom":{"command":"/nix/store/example/bin/acp","args":["--stdio"]}}"#)
            .unwrap();
    assert_eq!(agents["custom"].acp_args, vec!["--stdio"]);
    assert!(parse_agents(r#"{"bad":{"command":""}}"#).is_err());
    assert!(parse_agents(r#"{"bad":{"command":"acp","unknown":true}}"#).is_err());
    let options = json!([{"id":"model","type":"select","options":[{"group":"provider","options":[{"value":"x"}]}]},{"id":"fast","type":"boolean"}]);
    assert!(ccgonext::acp::validate_config_value(&options, "model", &json!("x")).is_ok());
    assert!(ccgonext::acp::validate_config_value(&options, "fast", &json!(true)).is_ok());
    assert!(ccgonext::acp::validate_config_value(&options, "fast", &json!("true")).is_err());
}
