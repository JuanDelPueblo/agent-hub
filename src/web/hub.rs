use super::AppState;
use crate::{
    acp::callbacks::CallbackPolicy,
    events::EventPayload,
    store::{validate_name, validate_project_path, Store},
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Deserialize;
use serde_json::{json, Value};
use std::sync::Arc;

pub struct ApiError(StatusCode, String);
impl From<anyhow::Error> for ApiError {
    fn from(e: anyhow::Error) -> Self {
        Self(StatusCode::BAD_REQUEST, e.to_string())
    }
}
impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        (self.0, Json(json!({"error":self.1}))).into_response()
    }
}
type Result<T> = std::result::Result<T, ApiError>;
fn store(s: &AppState) -> Result<&Arc<Store>> {
    s.session_manager.store.as_ref().ok_or(ApiError(
        StatusCode::SERVICE_UNAVAILABLE,
        "Run the agent-hub binary for persistent projects".into(),
    ))
}
fn changed(s: &AppState) {
    s.session_manager
        .event_log()
        .append("", "", EventPayload::MetadataChanged {});
}
async fn session(s: &AppState, id: &str) -> Result<Arc<crate::session::AcpSession>> {
    let c = store(s)?
        .chat(id)
        .map_err(|_| ApiError(StatusCode::NOT_FOUND, "Chat not found".into()))?;
    if !s.session_manager.has_agent(&c.agent) {
        return Err(ApiError(
            StatusCode::CONFLICT,
            "This chat's agent is no longer configured".into(),
        ));
    }
    s.session_manager
        .get_by_id(id)
        .await
        .ok_or(ApiError(StatusCode::NOT_FOUND, "Chat not found".into()))
}

pub async fn projects(State(s): State<AppState>) -> Result<Json<Value>> {
    Ok(Json(json!(store(&s)?.projects()?)))
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ProjectInput {
    name: String,
    path: String,
}
pub async fn create_project(
    State(s): State<AppState>,
    Json(p): Json<ProjectInput>,
) -> Result<Json<Value>> {
    let path = validate_project_path(&p.path, &s.config.web.project_roots)?;
    let p = store(&s)?.create_project(p.name, path)?;
    changed(&s);
    Ok(Json(json!(p)))
}
pub async fn edit_project(
    State(s): State<AppState>,
    Path(id): Path<String>,
    Json(input): Json<ProjectInput>,
) -> Result<Json<Value>> {
    validate_name(&input.name)?;
    let path = validate_project_path(&input.path, &s.config.web.project_roots)?;
    let db = store(&s)?;
    let mut p = db.project(&id)?;
    if p.path != path && db.chats()?.iter().any(|c| c.project_id == id) {
        return Err(ApiError(StatusCode::CONFLICT, "Move or delete the project's chats before changing its path; saved ACP sessions belong to their original directory".into()));
    }
    p.name = input.name;
    p.path = path;
    p.updated_at = chrono::Utc::now().to_rfc3339();
    db.save_project(&p)?;
    changed(&s);
    Ok(Json(json!(p)))
}
pub async fn delete_project(
    State(s): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Value>> {
    let db = store(&s)?;
    if db.chats()?.iter().any(|c| c.project_id == id) {
        return Err(ApiError(
            StatusCode::CONFLICT,
            "Delete the project's chats first (project files are never deleted)".into(),
        ));
    }
    db.delete_project(&id)?;
    changed(&s);
    Ok(Json(json!({"success":true})))
}
pub async fn chats(State(s): State<AppState>, Path(id): Path<String>) -> Result<Json<Value>> {
    let db = store(&s)?;
    db.project(&id)?;
    let chats: Vec<_> = db
        .chats()?
        .into_iter()
        .filter(|c| c.project_id == id)
        .collect();
    let mut result = Vec::new();
    for chat in chats {
        result.push(chat_view(&s, chat).await);
    }
    Ok(Json(json!(result)))
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ChatInput {
    agent: String,
    title: String,
}
pub async fn create_chat(
    State(s): State<AppState>,
    Path(id): Path<String>,
    Json(c): Json<ChatInput>,
) -> Result<Json<Value>> {
    if !s.session_manager.has_agent(&c.agent) {
        return Err(ApiError(StatusCode::BAD_REQUEST, "Unknown agent".into()));
    }
    let db = store(&s)?;
    db.project(&id)?;
    let c = db.create_chat(id, c.agent, c.title)?;
    changed(&s);
    Ok(Json(chat_view(&s, c).await))
}
async fn chat_view(s: &AppState, c: crate::store::Chat) -> Value {
    let live = s.session_manager.get_by_id(&c.id).await;
    let (process, turn) = if let Some(live) = live {
        (
            live.process_state().await.to_string(),
            live.turn_state().await.to_string(),
        )
    } else {
        ("STOPPED".into(), "IDLE".into())
    };
    let mut value = json!(c);
    value["process_state"] = json!(process);
    value["turn_state"] = json!(turn);
    value
}
pub async fn chat(State(s): State<AppState>, Path(id): Path<String>) -> Result<Json<Value>> {
    Ok(Json(chat_view(&s, store(&s)?.chat(&id)?).await))
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ChatEdit {
    title: Option<String>,
    archived: Option<bool>,
    permission_policy: Option<CallbackPolicy>,
}
pub async fn edit_chat(
    State(s): State<AppState>,
    Path(id): Path<String>,
    Json(edit): Json<ChatEdit>,
) -> Result<Json<Value>> {
    if let Some(title) = &edit.title {
        validate_name(title)?;
    }
    let live = session(&s, &id).await?;
    let c = live
        .edit_metadata(edit.title, edit.archived, edit.permission_policy)
        .await?;
    changed(&s);
    Ok(Json(chat_view(&s, c).await))
}
pub async fn delete_chat(State(s): State<AppState>, Path(id): Path<String>) -> Result<Json<Value>> {
    let live = session(&s, &id).await?;
    live.delete_metadata().await?;
    s.session_manager.event_log().forget_chat(&id);
    s.session_manager.remove_session(&id).await;
    changed(&s);
    Ok(Json(json!({"success":true})))
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Prompt {
    text: String,
}
pub async fn prompt(
    State(s): State<AppState>,
    Path(id): Path<String>,
    Json(p): Json<Prompt>,
) -> Result<(StatusCode, Json<Value>)> {
    if p.text.trim().is_empty() || p.text.len() > 100_000 {
        return Err(ApiError(
            StatusCode::BAD_REQUEST,
            "Prompt must contain 1–100000 bytes".into(),
        ));
    }
    let live = session(&s, &id).await?;
    let log = s.session_manager.event_log().clone();
    let timeout = std::time::Duration::from_secs(s.config.timeouts.default);
    // Own the task independently of HTTP disconnects. All completion/error state is streamed.
    tokio::spawn(async move {
        if let Err(e) = live.ask(p.text, Some(timeout)).await {
            log.append(
                &live.id,
                &live.key.agent,
                EventPayload::Error {
                    message: e.to_string(),
                },
            );
        }
    });
    Ok((StatusCode::ACCEPTED, Json(json!({"accepted":true}))))
}
pub async fn resume(State(s): State<AppState>, Path(id): Path<String>) -> Result<Json<Value>> {
    session(&s, &id).await?.resume().await?;
    Ok(Json(chat_view(&s, store(&s)?.chat(&id)?).await))
}
pub async fn cancel(State(s): State<AppState>, Path(id): Path<String>) -> Result<Json<Value>> {
    session(&s, &id).await?.cancel().await?;
    Ok(Json(json!({"success":true})))
}
pub async fn stop(State(s): State<AppState>, Path(id): Path<String>) -> Result<Json<Value>> {
    session(&s, &id).await?.stop().await?;
    Ok(Json(json!({"success":true})))
}
pub async fn config(State(s): State<AppState>, Path(id): Path<String>) -> Result<Json<Value>> {
    Ok(Json(session(&s, &id).await?.config_options().await))
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ConfigEdit {
    id: String,
    value: Value,
}
pub async fn set_config(
    State(s): State<AppState>,
    Path(id): Path<String>,
    Json(c): Json<ConfigEdit>,
) -> Result<Json<Value>> {
    Ok(Json(
        session(&s, &id).await?.set_config(&c.id, c.value).await?,
    ))
}
#[derive(Deserialize)]
pub struct Cursor {
    cursor: Option<String>,
}
pub async fn remote_sessions(
    State(s): State<AppState>,
    Path(id): Path<String>,
    Query(q): Query<Cursor>,
) -> Result<Json<Value>> {
    Ok(Json(
        session(&s, &id)
            .await?
            .list_remote_sessions(q.cursor)
            .await?,
    ))
}
pub async fn agents(State(s): State<AppState>) -> Json<Value> {
    let mut agents: Vec<_> = s.config.agents.keys().cloned().collect();
    agents.sort();
    Json(json!(agents))
}
