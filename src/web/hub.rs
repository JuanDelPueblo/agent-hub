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
impl From<std::io::Error> for ApiError {
    fn from(e: std::io::Error) -> Self {
        Self(StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
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

#[derive(Debug, serde::Serialize, Deserialize)]
pub struct DirectoryEntry {
    pub name: String,
    pub path: String,
}

#[derive(Debug, serde::Serialize, Deserialize)]
pub struct Breadcrumb {
    pub name: String,
    pub path: String,
}

#[derive(Debug, serde::Serialize, Deserialize)]
pub struct DirectoryListing {
    pub current: String,
    pub name: String,
    pub parent: Option<String>,
    pub roots: Vec<String>,
    pub breadcrumbs: Vec<Breadcrumb>,
    pub directories: Vec<DirectoryEntry>,
}

#[derive(Deserialize)]
pub struct DirectoryQuery {
    pub path: Option<String>,
}

pub async fn filesystem_directories(
    State(s): State<AppState>,
    Query(q): Query<DirectoryQuery>,
) -> Result<Json<DirectoryListing>> {
    let roots = &s.config.web.project_roots;
    if roots.is_empty() {
        return Err(ApiError(
            StatusCode::SERVICE_UNAVAILABLE,
            "No project roots configured".into(),
        ));
    }
    let canonical_roots: Vec<std::path::PathBuf> = roots
        .iter()
        .filter_map(|r| std::path::Path::new(r).canonicalize().ok())
        .collect();
    if canonical_roots.is_empty() {
        return Err(ApiError(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Configured project roots do not exist on disk".into(),
        ));
    }

    let target_path = match q.path.as_deref().filter(|p| !p.trim().is_empty()) {
        Some(p) => {
            let path_obj = std::path::Path::new(p);
            if !path_obj.is_absolute() {
                return Err(ApiError(
                    StatusCode::BAD_REQUEST,
                    "Directory path must be absolute".into(),
                ));
            }
            path_obj
                .canonicalize()
                .map_err(|_| ApiError(StatusCode::NOT_FOUND, "Directory does not exist".into()))?
        }
        None => canonical_roots[0].clone(),
    };

    if !target_path.is_dir() {
        return Err(ApiError(
            StatusCode::BAD_REQUEST,
            "Path is not a directory".into(),
        ));
    }

    let matching_root = canonical_roots
        .iter()
        .find(|root| target_path.starts_with(root))
        .ok_or_else(|| {
            ApiError(
                StatusCode::FORBIDDEN,
                "Directory is outside configured project roots".into(),
            )
        })?;

    let parent = target_path.parent().and_then(|p| {
        if canonical_roots.iter().any(|r| p.starts_with(r)) {
            Some(p.to_string_lossy().into_owned())
        } else {
            None
        }
    });

    let mut directories = Vec::new();
    if let Ok(entries) = std::fs::read_dir(&target_path) {
        for entry in entries.flatten() {
            let file_name = entry.file_name().to_string_lossy().into_owned();
            if file_name.starts_with('.') {
                continue;
            }
            if let Ok(meta) = entry.metadata() {
                if meta.is_dir() {
                    if let Ok(canon) = entry.path().canonicalize() {
                        if canon.is_dir() && canonical_roots.iter().any(|r| canon.starts_with(r)) {
                            directories.push(DirectoryEntry {
                                name: file_name,
                                path: canon.to_string_lossy().into_owned(),
                            });
                        }
                    }
                }
            }
        }
    }
    directories.sort_by_key(|a| a.name.to_lowercase());

    let mut breadcrumbs = Vec::new();
    let root_name = matching_root
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| matching_root.to_string_lossy().into_owned());
    breadcrumbs.push(Breadcrumb {
        name: root_name,
        path: matching_root.to_string_lossy().into_owned(),
    });

    if let Ok(relative) = target_path.strip_prefix(matching_root) {
        let mut cur = matching_root.clone();
        for comp in relative.components() {
            let comp_str = comp.as_os_str().to_string_lossy().into_owned();
            cur.push(&comp_str);
            breadcrumbs.push(Breadcrumb {
                name: comp_str,
                path: cur.to_string_lossy().into_owned(),
            });
        }
    }

    let dir_name = target_path
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| target_path.to_string_lossy().into_owned());

    Ok(Json(DirectoryListing {
        current: target_path.to_string_lossy().into_owned(),
        name: dir_name,
        parent,
        roots: roots.clone(),
        breadcrumbs,
        directories,
    }))
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CloneProjectInput {
    pub url: String,
    pub parent_path: String,
    pub name: Option<String>,
}

pub fn validate_git_url(url: &str) -> anyhow::Result<()> {
    let trimmed = url.trim();
    if trimmed.is_empty() {
        anyhow::bail!("Repository URL cannot be empty");
    }
    if trimmed.starts_with("file://")
        || trimmed.starts_with('/')
        || trimmed.starts_with("./")
        || trimmed.starts_with("../")
        || trimmed.starts_with('~')
        || trimmed.contains("::")
    {
        anyhow::bail!("Unsafe or unsupported repository URL transport");
    }
    let is_http_ssh = trimmed.starts_with("https://")
        || trimmed.starts_with("http://")
        || trimmed.starts_with("ssh://");
    let is_scp_ssh = trimmed.contains('@') && trimmed.contains(':') && !trimmed.contains("://");
    if !is_http_ssh && !is_scp_ssh {
        anyhow::bail!("Repository URL must be a valid HTTPS or SSH URL");
    }
    Ok(())
}

pub fn derive_repo_name(url: &str) -> Option<String> {
    let trimmed = url.trim().trim_end_matches('/');
    let without_git = trimmed.strip_suffix(".git").unwrap_or(trimmed);
    let last_part = without_git.rsplit(['/', ':']).next()?;
    let clean = last_part.trim();
    if clean.is_empty() {
        None
    } else {
        Some(clean.to_string())
    }
}

pub fn sanitize_credentials(msg: &str) -> String {
    let mut out = String::new();
    let mut remaining = msg;
    while let Some(proto_idx) = remaining.find("://") {
        out.push_str(&remaining[..proto_idx + 3]);
        let after_proto = &remaining[proto_idx + 3..];
        if let Some(at_idx) = after_proto.find('@') {
            let user_info = &after_proto[..at_idx];
            if !user_info.contains([' ', '/', '\n', '\r']) {
                if let Some(colon_idx) = user_info.find(':') {
                    out.push_str(&user_info[..colon_idx + 1]);
                    out.push_str("***");
                } else {
                    out.push_str(user_info);
                }
                out.push('@');
                remaining = &after_proto[at_idx + 1..];
                continue;
            }
        }
        remaining = after_proto;
    }
    out.push_str(remaining);
    out
}

pub async fn clone_project(
    State(s): State<AppState>,
    Json(input): Json<CloneProjectInput>,
) -> Result<Json<Value>> {
    validate_git_url(&input.url)?;
    let parent_path = validate_project_path(&input.parent_path, &s.config.web.project_roots)?;
    let name = match input.name.filter(|n| !n.trim().is_empty()) {
        Some(n) => n.trim().to_string(),
        None => derive_repo_name(&input.url)
            .ok_or_else(|| anyhow::anyhow!("Could not derive project name from repository URL"))?,
    };
    validate_name(&name)?;

    let dest = std::path::Path::new(&parent_path).join(&name);
    if dest.exists() {
        return Err(ApiError(
            StatusCode::CONFLICT,
            format!("Destination directory already exists: {}", dest.display()),
        ));
    }

    let mut cmd = tokio::process::Command::new("git");
    cmd.arg("clone")
        .arg("--")
        .arg(&input.url)
        .arg(&dest)
        .env("GIT_TERMINAL_PROMPT", "0");

    let output = match tokio::time::timeout(std::time::Duration::from_secs(300), cmd.output()).await
    {
        Ok(res) => res.map_err(|e| {
            if dest.exists() {
                let _ = std::fs::remove_dir_all(&dest);
            }
            ApiError(
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to execute git: {e}"),
            )
        })?,
        Err(_) => {
            if dest.exists() {
                let _ = std::fs::remove_dir_all(&dest);
            }
            return Err(ApiError(
                StatusCode::GATEWAY_TIMEOUT,
                "Git clone timed out after 5 minutes".into(),
            ));
        }
    };

    if !output.status.success() {
        if dest.exists() {
            let _ = std::fs::remove_dir_all(&dest);
        }
        let stderr = String::from_utf8_lossy(&output.stderr);
        let sanitized = sanitize_credentials(&stderr);
        return Err(ApiError(
            StatusCode::BAD_REQUEST,
            format!("Git clone failed: {}", sanitized.trim()),
        ));
    }

    let p = store(&s)?.create_project(name, dest.canonicalize()?.display().to_string())?;
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
    pub agent: String,
    pub title: Option<String>,
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
