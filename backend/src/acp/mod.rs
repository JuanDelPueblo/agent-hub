pub mod callbacks;
pub mod process;
pub mod protocol;
#[cfg(windows)]
mod windows_job;

use ::agent_client_protocol_schema::v1 as agent_client_protocol_schema;
use ::agent_client_protocol_schema::ProtocolVersion;
use agent_client_protocol_schema::{
    CancelNotification, ContentBlock, CreateTerminalRequest, InitializeRequest, InitializeResponse,
    KillTerminalRequest, NewSessionRequest, NewSessionResponse, PromptRequest, PromptResponse,
    ReadTextFileRequest, ReleaseTerminalRequest, RequestPermissionRequest, SessionId,
    SessionNotification, SessionUpdate, TerminalOutputRequest, TextContent, ToolCallContent,
    WaitForTerminalExitRequest, WriteTextFileRequest, CLIENT_METHOD_NAMES,
};
use std::collections::HashMap;
use std::path::Path;
use std::sync::atomic::{AtomicBool, AtomicI64, Ordering};
use std::sync::Arc;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt};
use tokio::sync::{mpsc, oneshot, Mutex};
use tokio::task::JoinHandle;

use crate::events::{EventLog, EventPayload};

use self::callbacks::{CallbackHandler, CallbackPolicy};
use self::process::{drain_stderr, AcpProcess};
use self::protocol::{
    IncomingKind, IncomingMessage, JsonRpcNotification, JsonRpcRequest, JsonRpcResponse,
};

type ResponseResult = anyhow::Result<serde_json::Value>;
type SharedChild = Arc<Mutex<Option<Box<dyn process_wrap::tokio::TokioChildWrapper>>>>;

/// A saved ACP option the agent genuinely rejects, or that is locally invalid.
///
/// Carries the `option_id` so `HubService::resume_chat` can map it to
/// `ServiceError::SavedConfigRejected` without parsing an error string.
/// Transient failures (timeouts, transport disconnects, writer failures,
/// malformed agent responses) must NOT use this type: they stay as plain
/// `anyhow` errors so the ordinary Retry path appears and `config_values`
/// are preserved.
#[derive(Debug)]
pub struct SavedConfigRejected {
    pub option_id: String,
    pub message: String,
}

impl std::fmt::Display for SavedConfigRejected {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for SavedConfigRejected {}

enum WriterMsg {
    Line(String),
    Shutdown,
}

pub struct AcpClient {
    replaying: Arc<AtomicBool>,
    pub capabilities: tokio::sync::RwLock<serde_json::Value>,
    pub config_options: Arc<tokio::sync::RwLock<serde_json::Value>>,
    pub available_commands: Arc<tokio::sync::RwLock<serde_json::Value>>,
    pub session_modes: Arc<tokio::sync::RwLock<serde_json::Value>>,
    pub last_usage: Arc<tokio::sync::RwLock<serde_json::Value>>,
    pub agent_info: tokio::sync::RwLock<serde_json::Value>,
    pub auth_methods: tokio::sync::RwLock<serde_json::Value>,
    writer_tx: mpsc::Sender<WriterMsg>,
    pending: Arc<Mutex<HashMap<i64, oneshot::Sender<ResponseResult>>>>,
    next_id: AtomicI64,
    writer_handle: Mutex<Option<JoinHandle<()>>>,
    reader_handle: Mutex<Option<JoinHandle<()>>>,
    wait_handle: Mutex<Option<JoinHandle<()>>>,
    stderr_handle: Mutex<Option<JoinHandle<()>>>,
    child: SharedChild,
    child_root_pid: Option<u32>,
    callback_handler: Arc<CallbackHandler>,
    connected: Arc<AtomicBool>,
}

impl AcpClient {
    #[allow(clippy::too_many_arguments)]
    pub async fn spawn(
        command: &str,
        args: &[String],
        env_vars: &HashMap<String, String>,
        cwd: &Path,
        policy: CallbackPolicy,
        session_id: String,
        agent_name: String,
        event_log: Arc<EventLog>,
        store: Option<Arc<crate::store::Store>>,
        task_tracker: Arc<crate::tasks::TerminalTaskTracker>,
    ) -> anyhow::Result<Self> {
        let proc = AcpProcess::spawn(command, args, env_vars, cwd)?;

        let (writer_tx, writer_rx) = mpsc::channel::<WriterMsg>(64);
        let pending: Arc<Mutex<HashMap<i64, oneshot::Sender<ResponseResult>>>> =
            Arc::new(Mutex::new(HashMap::new()));
        let connected = Arc::new(AtomicBool::new(true));

        let callback_handler = Arc::new(CallbackHandler::new(
            policy,
            session_id.clone(),
            agent_name.clone(),
            event_log.clone(),
            cwd.to_path_buf(),
            Arc::new(env_vars.clone()),
            task_tracker,
        ));

        let child_root_pid = proc.root_pid;
        let child = Arc::new(Mutex::new(Some(proc.child)));

        let writer_handle = tokio::spawn(writer_task(
            proc.stdin,
            writer_rx,
            connected.clone(),
            child.clone(),
            child_root_pid,
        ));

        let stderr_handle = tokio::spawn(drain_stderr(proc.stderr, agent_name.clone()));

        let config_options = Arc::new(tokio::sync::RwLock::new(serde_json::json!([])));
        let available_commands = Arc::new(tokio::sync::RwLock::new(serde_json::json!([])));
        let session_modes = Arc::new(tokio::sync::RwLock::new(serde_json::Value::Null));
        let last_usage = Arc::new(tokio::sync::RwLock::new(serde_json::Value::Null));
        let replaying = Arc::new(AtomicBool::new(false));
        let reader_handle = tokio::spawn(reader_task(
            proc.stdout,
            pending.clone(),
            connected.clone(),
            callback_handler.clone(),
            writer_tx.clone(),
            child.clone(),
            child_root_pid,
            event_log.clone(),
            session_id,
            agent_name,
            config_options.clone(),
            available_commands.clone(),
            session_modes.clone(),
            last_usage.clone(),
            replaying.clone(),
            store,
        ));

        let wait_handle = tokio::spawn(wait_task(child.clone(), child_root_pid, connected.clone()));

        Ok(Self {
            replaying,
            capabilities: tokio::sync::RwLock::new(serde_json::json!({})),
            config_options,
            available_commands,
            session_modes,
            last_usage,
            agent_info: tokio::sync::RwLock::new(serde_json::Value::Null),
            auth_methods: tokio::sync::RwLock::new(serde_json::json!([])),
            writer_tx,
            pending,
            next_id: AtomicI64::new(1),
            writer_handle: Mutex::new(Some(writer_handle)),
            reader_handle: Mutex::new(Some(reader_handle)),
            wait_handle: Mutex::new(Some(wait_handle)),
            stderr_handle: Mutex::new(Some(stderr_handle)),
            child,
            child_root_pid,
            callback_handler,
            connected,
        })
    }

    pub(crate) async fn send_request<P: serde::Serialize>(
        &self,
        method: &'static str,
        params: P,
    ) -> anyhow::Result<serde_json::Value> {
        if !self.is_connected() {
            anyhow::bail!("ACP agent connection closed");
        }

        let id = self.next_id.fetch_add(1, Ordering::SeqCst);
        let req = JsonRpcRequest::new(id.into(), method, params);
        let line = serde_json::to_string(&req)?;

        let (tx, rx) = oneshot::channel();
        {
            let mut pending = self.pending.lock().await;
            pending.insert(id, tx);
        }

        if !self.is_connected() {
            let mut pending = self.pending.lock().await;
            if let Some(tx) = pending.remove(&id) {
                let _ = tx.send(Err(anyhow::anyhow!("ACP agent connection closed")));
            }
            anyhow::bail!("ACP agent connection closed");
        }

        if self.writer_tx.send(WriterMsg::Line(line)).await.is_err() {
            let mut pending = self.pending.lock().await;
            pending.remove(&id);
            anyhow::bail!("Writer channel closed");
        }

        rx.await
            .map_err(|_| anyhow::anyhow!("Response channel dropped"))?
    }

    async fn send_notification<P: serde::Serialize>(
        &self,
        method: &'static str,
        params: P,
    ) -> anyhow::Result<()> {
        let notif = JsonRpcNotification::new(method, params);
        let line = serde_json::to_string(&notif)?;
        self.writer_tx
            .send(WriterMsg::Line(line))
            .await
            .map_err(|_| anyhow::anyhow!("Writer channel closed"))?;
        Ok(())
    }

    pub async fn initialize(&self, _cwd: &Path) -> anyhow::Result<InitializeResponse> {
        // Advertise only stable v1 capabilities Pueblo actually implements:
        // filesystem read/write, terminal, boolean session config, and form
        // plus URL elicitation. Never advertise partial capabilities.
        let caps = agent_client_protocol_schema::ClientCapabilities::new()
            .fs(agent_client_protocol_schema::FileSystemCapabilities::new()
                .read_text_file(true)
                .write_text_file(true))
            .terminal(true)
            .session(
                agent_client_protocol_schema::ClientSessionCapabilities::new().config_options(
                    agent_client_protocol_schema::SessionConfigOptionsCapabilities::new().boolean(
                        agent_client_protocol_schema::BooleanConfigOptionCapabilities::new(),
                    ),
                ),
            )
            .elicitation(
                agent_client_protocol_schema::ElicitationCapabilities::new()
                    .form(agent_client_protocol_schema::ElicitationFormCapabilities::new())
                    .url(agent_client_protocol_schema::ElicitationUrlCapabilities::new()),
            );
        let req = InitializeRequest::new(ProtocolVersion::LATEST)
            .client_info(agent_client_protocol_schema::Implementation::new(
                "pueblo-hub",
                env!("CARGO_PKG_VERSION"),
            ))
            .client_capabilities(caps);
        let result = self.send_request("initialize", req).await?;
        let response: InitializeResponse = serde_json::from_value(result.clone())?;
        // Target stable ACP v1 only. Reject pre-release or future versions
        // explicitly rather than negotiating silently.
        anyhow::ensure!(
            response.protocol_version == ProtocolVersion::LATEST,
            "Agent negotiated unsupported protocol version {}",
            response.protocol_version.as_u16()
        );
        *self.capabilities.write().await = result
            .get("agentCapabilities")
            .cloned()
            .unwrap_or(serde_json::json!({}));
        // Preserve generic agent identity and auth metadata for later use.
        // T107 owns login/logout; this layer only stores what initialize saw.
        *self.agent_info.write().await = result
            .get("agentInfo")
            .cloned()
            .unwrap_or(serde_json::Value::Null);
        *self.auth_methods.write().await = result
            .get("authMethods")
            .cloned()
            .unwrap_or(serde_json::json!([]));
        Ok(response)
    }

    pub async fn new_session(&self, cwd: &Path) -> anyhow::Result<NewSessionResponse> {
        let req = NewSessionRequest::new(cwd.to_path_buf());
        let result = self.send_request("session/new", req).await?;
        Ok(serde_json::from_value(result)?)
    }

    /// Preserve the agent's identity. Never fall back to session/new on resume failure.
    pub async fn open_session(&self, cwd: &Path, saved: Option<&str>) -> anyhow::Result<String> {
        let params = serde_json::json!({"cwd":cwd,"mcpServers":[],"sessionId":saved});
        let result = if let Some(id) = saved {
            let caps = self.capabilities.read().await.clone();
            let method = if caps["loadSession"] == true {
                "session/load"
            } else if caps
                .pointer("/sessionCapabilities/resume")
                .is_some_and(|v| v.is_object())
            {
                "session/resume"
            } else {
                anyhow::bail!("This agent cannot resume saved chat {id}. Create a new chat to start another conversation.")
            };
            // Our durable event log already contains the displayed history.
            // Loading still restores agent-owned state; do not append its replay twice.
            self.replaying.store(true, Ordering::SeqCst);
            let result = self.send_request(method, params).await;
            self.replaying.store(false, Ordering::SeqCst);
            result?
        } else {
            self.send_request("session/new", NewSessionRequest::new(cwd.to_path_buf()))
                .await?
        };
        *self.config_options.write().await = result
            .get("configOptions")
            .cloned()
            .unwrap_or(serde_json::json!([]));
        // Preserve advertised modes/current mode generically. Absent means
        // the agent has no legacy mode support.
        *self.session_modes.write().await = result
            .get("modes")
            .cloned()
            .unwrap_or(serde_json::Value::Null);
        // Reset commands and usage on (re)open; live updates repopulate them.
        *self.available_commands.write().await = serde_json::json!([]);
        *self.last_usage.write().await = serde_json::Value::Null;
        if let Some(saved) = saved {
            if let Some(returned) = result["sessionId"].as_str() {
                anyhow::ensure!(
                    returned == saved,
                    "Agent returned a different session identity on resume"
                );
            }
            Ok(saved.to_owned())
        } else {
            Ok(result["sessionId"]
                .as_str()
                .ok_or_else(|| anyhow::anyhow!("Agent omitted sessionId"))?
                .to_owned())
        }
    }

    pub async fn set_config(
        &self,
        session_id: &SessionId,
        id: &str,
        value: serde_json::Value,
    ) -> anyhow::Result<serde_json::Value> {
        // A stale saved value that no longer matches the agent's advertised
        // options is a genuine rejection: the user must reset that option.
        // Map the local validation failure to the typed rejection.
        if let Err(error) = validate_config_value(&*self.config_options.read().await, id, &value) {
            return Err(anyhow::Error::new(SavedConfigRejected {
                option_id: id.to_owned(),
                message: format!(
                    "Saved ACP option {id} could not be reapplied; reset that option before reconnecting ({error})"
                ),
            }));
        }
        // Stable wire shape: `select` sends a bare value id, `boolean`
        // requires the `type: "boolean"` discriminator. Build the params
        // from the advertised option kind so strict agents accept both.
        let is_boolean = self
            .config_options
            .read()
            .await
            .as_array()
            .and_then(|a| {
                a.iter()
                    .find(|o| o.get("id").and_then(|v| v.as_str()) == Some(id))
            })
            .and_then(|o| o.get("type").and_then(|v| v.as_str()))
            == Some("boolean");
        let params = if is_boolean {
            serde_json::json!({"sessionId":session_id,"configId":id,"type":"boolean","value":value})
        } else {
            serde_json::json!({"sessionId":session_id,"configId":id,"value":value})
        };
        let result = self
            .send_request("session/set_config_option", params)
            .await
            .map_err(|error| {
                // Only an agent RPC rejection is a saved-config rejection.
                // Transport disconnects, writer failures, and dropped response
                // channels are transient and must keep the ordinary Retry path.
                let message = error.to_string();
                if message.starts_with("RPC error") {
                    anyhow::Error::new(SavedConfigRejected {
                        option_id: id.to_owned(),
                        message: format!(
                            "Saved ACP option {id} could not be reapplied; reset that option before reconnecting ({message})"
                        ),
                    })
                } else {
                    error
                }
            })?;
        let options = result
            .get("configOptions")
            .filter(|v| v.is_array())
            .ok_or_else(|| anyhow::anyhow!("Agent omitted authoritative configOptions"))?
            .clone();
        *self.config_options.write().await = options.clone();
        Ok(options)
    }

    pub async fn available_commands_snapshot(&self) -> serde_json::Value {
        self.available_commands.read().await.clone()
    }

    pub async fn session_modes_snapshot(&self) -> serde_json::Value {
        self.session_modes.read().await.clone()
    }

    pub async fn agent_info_snapshot(&self) -> serde_json::Value {
        self.agent_info.read().await.clone()
    }

    pub async fn auth_methods_snapshot(&self) -> serde_json::Value {
        self.auth_methods.read().await.clone()
    }

    pub async fn usage_snapshot(&self) -> serde_json::Value {
        self.last_usage.read().await.clone()
    }

    /// Capability-gated legacy `session/set_mode`. Fails explicitly when the
    /// agent never advertised modes instead of sending speculatively.
    pub async fn set_mode(&self, session_id: &SessionId, mode_id: &str) -> anyhow::Result<()> {
        let has_modes = {
            let modes = self.session_modes.read().await;
            match &*modes {
                serde_json::Value::Null => false,
                v => {
                    v.get("available_modes")
                        .and_then(|a| a.as_array())
                        .is_some_and(|a| !a.is_empty())
                        || v.get("availableModes")
                            .and_then(|a| a.as_array())
                            .is_some_and(|a| !a.is_empty())
                }
            }
        };
        anyhow::ensure!(has_modes, "Agent does not advertise session modes");
        self.send_request(
            "session/set_mode",
            serde_json::json!({"sessionId":session_id,"modeId":mode_id}),
        )
        .await?;
        Ok(())
    }

    /// Capability-gated `session/delete` for agent-owned remote history.
    /// Pueblo's own chat deletion stays separate; this only removes the
    /// agent's remote session record.
    pub async fn delete_remote_session(&self, session_id: &str) -> anyhow::Result<()> {
        anyhow::ensure!(
            self.capabilities
                .read()
                .await
                .pointer("/sessionCapabilities/delete")
                .is_some_and(|v| v.is_object()),
            "Agent does not advertise session/delete"
        );
        self.send_request(
            "session/delete",
            serde_json::json!({"sessionId":session_id}),
        )
        .await?;
        Ok(())
    }

    /// Generic stable `$/cancel_request` for a single outstanding JSON-RPC
    /// request. Distinct from `session/cancel`, which cancels a whole turn.
    /// The receiver may ignore `$`-prefixed notifications; never treat a
    /// failure here as a turn failure.
    pub async fn cancel_request(&self, request_id: i64) {
        let _ = self
            .send_notification(
                "$/cancel_request",
                serde_json::json!({"requestId":request_id}),
            )
            .await;
    }

    pub async fn close_session(&self, session_id: &SessionId) {
        if self
            .capabilities
            .read()
            .await
            .pointer("/sessionCapabilities/close")
            .is_some_and(|v| v.is_object())
        {
            let _ = tokio::time::timeout(
                std::time::Duration::from_secs(5),
                self.send_request("session/close", serde_json::json!({"sessionId":session_id})),
            )
            .await;
        }
    }

    pub async fn supports_resume(&self) -> bool {
        let capabilities = self.capabilities.read().await;
        capabilities["loadSession"] == true
            || capabilities
                .pointer("/sessionCapabilities/resume")
                .is_some_and(|value| value.is_object())
    }

    pub async fn list_sessions(
        &self,
        cwd: &Path,
        cursor: Option<String>,
    ) -> anyhow::Result<serde_json::Value> {
        anyhow::ensure!(
            self.capabilities
                .read()
                .await
                .pointer("/sessionCapabilities/list")
                .is_some_and(|v| v.is_object()),
            "Agent does not advertise session/list"
        );
        self.send_request(
            "session/list",
            serde_json::json!({"cwd":cwd,"cursor":cursor}),
        )
        .await
    }

    pub async fn prompt(
        &self,
        session_id: &SessionId,
        text: &str,
    ) -> anyhow::Result<PromptResponse> {
        let req = PromptRequest::new(
            session_id.clone(),
            vec![ContentBlock::Text(TextContent::new(text))],
        );
        let result = self.send_request("session/prompt", req).await?;
        Ok(serde_json::from_value(result)?)
    }

    pub async fn cancel(&self, session_id: &SessionId) -> anyhow::Result<()> {
        let notif = CancelNotification::new(session_id.clone());
        self.send_notification("session/cancel", notif).await
    }

    pub fn callback_handler(&self) -> &Arc<CallbackHandler> {
        &self.callback_handler
    }

    pub fn is_connected(&self) -> bool {
        self.connected.load(Ordering::SeqCst)
    }

    pub fn root_pid(&self) -> Option<u32> {
        self.child_root_pid
    }

    pub async fn terminate(&self) {
        self.connected.store(false, Ordering::SeqCst);
        start_kill_child(&self.child, self.child_root_pid).await;
    }

    pub async fn shutdown(&self) {
        self.callback_handler.shutdown().await;
        self.connected.store(false, Ordering::SeqCst);
        let _ = self.writer_tx.try_send(WriterMsg::Shutdown);
        kill_child(&self.child, self.child_root_pid).await;

        let writer = self.writer_handle.lock().await.take();
        let reader = self.reader_handle.lock().await.take();
        let stderr = self.stderr_handle.lock().await.take();
        let wait = self.wait_handle.lock().await.take();
        if let Some(h) = &writer {
            h.abort();
        }
        if let Some(h) = &reader {
            h.abort();
        }
        if let Some(h) = &stderr {
            h.abort();
        }
        if let Some(h) = &wait {
            h.abort();
        }
        if let Some(h) = wait {
            let _ = h.await;
        }
        kill_child(&self.child, self.child_root_pid).await;
        if let Some(h) = writer {
            let _ = h.await;
        }
        if let Some(h) = reader {
            let _ = h.await;
        }
        if let Some(h) = stderr {
            let _ = h.await;
        }
        fail_pending_requests(&self.pending, "ACP client shutdown".to_string()).await;
    }
}

impl Drop for AcpClient {
    fn drop(&mut self) {
        // Process-tree teardown is asymmetric per OS:
        //
        // - Windows: JobOwnedChild::drop closes the job HANDLE, which fires
        //   KILL_ON_JOB_CLOSE and kills every process in the tree.
        //
        // - Unix: tokio's kill_on_drop only SIGKILLs the *direct* child, not
        //   the process group. The actual subtree teardown happens through the
        //   explicit `c.start_kill()` call below (process-wrap's
        //   ProcessGroupChild::start_kill = killpg(-pgid, SIGKILL)). If we
        //   can't acquire the child lock — extremely rare since tasks are
        //   aborted right above — the killpg never fires from here and we fall
        //   back to whatever the inner Child does on drop (direct-child kill).
        //   Force-killing pueblo-hub itself on Unix (no Drop runs) is a known
        //   limitation; we have no JobObject equivalent.
        self.connected.store(false, Ordering::SeqCst);
        if let Ok(mut handle) = self.writer_handle.try_lock() {
            if let Some(h) = handle.take() {
                h.abort();
            }
        }
        if let Ok(mut handle) = self.reader_handle.try_lock() {
            if let Some(h) = handle.take() {
                h.abort();
            }
        }
        if let Ok(mut handle) = self.stderr_handle.try_lock() {
            if let Some(h) = handle.take() {
                h.abort();
            }
        }
        if let Ok(mut handle) = self.wait_handle.try_lock() {
            if let Some(h) = handle.take() {
                h.abort();
            }
        }
        if let Ok(mut child) = self.child.try_lock() {
            if let Some(mut c) = child.take() {
                if let Err(e) = c.start_kill() {
                    tracing::warn!(root_pid = ?self.child_root_pid, error = %e, "AcpClient::drop: start_kill failed");
                }
            }
        }
    }
}

async fn start_kill_child(child: &SharedChild, root_pid: Option<u32>) {
    let mut guard = child.lock().await;
    if let Some(c) = guard.as_mut() {
        if let Err(e) = c.start_kill() {
            tracing::warn!(?root_pid, error = %e, "start_kill_child: start_kill failed");
        }
    }
}

async fn fail_pending_requests(
    pending: &Arc<Mutex<HashMap<i64, oneshot::Sender<ResponseResult>>>>,
    message: String,
) {
    let mut pending = pending.lock().await;
    for (_, tx) in pending.drain() {
        let _ = tx.send(Err(anyhow::anyhow!(message.clone())));
    }
}

async fn writer_task(
    mut stdin: tokio::process::ChildStdin,
    mut rx: mpsc::Receiver<WriterMsg>,
    connected: Arc<AtomicBool>,
    child: SharedChild,
    child_root_pid: Option<u32>,
) {
    let mut needs_child_cleanup = false;
    while let Some(msg) = rx.recv().await {
        match msg {
            WriterMsg::Line(line) => {
                let data = format!("{}\n", line);
                if stdin.write_all(data.as_bytes()).await.is_err() {
                    needs_child_cleanup = true;
                    break;
                }
                if stdin.flush().await.is_err() {
                    needs_child_cleanup = true;
                    break;
                }
            }
            WriterMsg::Shutdown => {
                let _ = stdin.shutdown().await;
                break;
            }
        }
    }

    connected.store(false, Ordering::SeqCst);
    if needs_child_cleanup {
        kill_child(&child, child_root_pid).await;
    }
}

#[allow(clippy::too_many_arguments)]
async fn reader_task(
    mut stdout: tokio::io::BufReader<tokio::process::ChildStdout>,
    pending: Arc<Mutex<HashMap<i64, oneshot::Sender<ResponseResult>>>>,
    connected: Arc<AtomicBool>,
    callback_handler: Arc<CallbackHandler>,
    writer_tx: mpsc::Sender<WriterMsg>,
    child: SharedChild,
    child_root_pid: Option<u32>,
    event_log: Arc<EventLog>,
    session_id: String,
    agent_name: String,
    config_options: Arc<tokio::sync::RwLock<serde_json::Value>>,
    available_commands: Arc<tokio::sync::RwLock<serde_json::Value>>,
    session_modes: Arc<tokio::sync::RwLock<serde_json::Value>>,
    last_usage: Arc<tokio::sync::RwLock<serde_json::Value>>,
    replaying: Arc<AtomicBool>,
    store: Option<Arc<crate::store::Store>>,
) {
    let request_semaphore = Arc::new(tokio::sync::Semaphore::new(16));
    let mut line = String::new();
    loop {
        line.clear();
        match stdout.read_line(&mut line).await {
            Ok(0) => break,
            Ok(_) => {
                let trimmed = line.trim();
                if trimmed.is_empty() {
                    continue;
                }

                let msg: IncomingMessage = match serde_json::from_str(trimmed) {
                    Ok(m) => m,
                    Err(e) => {
                        tracing::debug!(agent = %agent_name, "Invalid JSON from agent: {}", e);
                        continue;
                    }
                };

                match msg.classify() {
                    IncomingKind::Response { id, result, error } => {
                        let numeric_id = match &id {
                            agent_client_protocol_schema::RequestId::Number(n) => *n,
                            _ => continue,
                        };
                        let mut pending = pending.lock().await;
                        pending.retain(|_, tx| !tx.is_closed());
                        if let Some(tx) = pending.remove(&numeric_id) {
                            let response = if let Some(err) = error {
                                Err(anyhow::anyhow!("RPC error {}: {}", err.code, err.message))
                            } else {
                                Ok(result.unwrap_or(serde_json::Value::Null))
                            };
                            let _ = tx.send(response);
                        }
                    }
                    IncomingKind::Notification { method, params } => {
                        if method == "session/update" {
                            // Dynamic snapshots update memory even during ACP
                            // replay so the state stays queryable after
                            // reconnect. Events emit only for live updates to
                            // avoid duplicating durable history, except for
                            // the authoritative config snapshot which keeps
                            // its historical behavior.
                            let kind = params
                                .pointer("/update/sessionUpdate")
                                .and_then(|v| v.as_str())
                                .unwrap_or("");
                            if kind == "config_option_update" {
                                if let Some(options) = params
                                    .pointer("/update/configOptions")
                                    .filter(|v| v.is_array())
                                {
                                    *config_options.write().await = options.clone();
                                    if let Err(error) = event_log.append(
                                        &session_id,
                                        &agent_name,
                                        EventPayload::ConfigOptions {
                                            options: options.clone(),
                                        },
                                    ) {
                                        tracing::error!(%error, "Stopping ACP reader after event persistence failure");
                                        break;
                                    }
                                }
                            } else if kind == "available_commands_update" {
                                if let Ok(notif) =
                                    serde_json::from_value::<SessionNotification>(params.clone())
                                {
                                    if let SessionUpdate::AvailableCommandsUpdate(u) = &notif.update
                                    {
                                        let cmds = serde_json::to_value(&u.available_commands)
                                            .unwrap_or(serde_json::json!([]));
                                        *available_commands.write().await = cmds.clone();
                                        if !replaying.load(Ordering::SeqCst) {
                                            if let Err(error) = event_log.append(
                                                &session_id,
                                                &agent_name,
                                                EventPayload::AvailableCommands { commands: cmds },
                                            ) {
                                                tracing::error!(%error, "Stopping ACP reader after event persistence failure");
                                                break;
                                            }
                                        }
                                    }
                                }
                                if replaying.load(Ordering::SeqCst) {
                                    continue;
                                }
                                // Already handled above; avoid double emit.
                                continue;
                            } else if kind == "current_mode_update" {
                                if let Ok(notif) =
                                    serde_json::from_value::<SessionNotification>(params.clone())
                                {
                                    if let SessionUpdate::CurrentModeUpdate(u) = &notif.update {
                                        let new_id = u.current_mode_id.to_string();
                                        // Merge into stored SessionModeState so
                                        // available modes survive the update.
                                        let mut guard = session_modes.write().await;
                                        let mut state = (*guard).clone();
                                        if state.is_null() {
                                            state = serde_json::json!({
                                                "current_mode_id": new_id,
                                                "available_modes": []
                                            });
                                        } else if let Some(obj) = state.as_object_mut() {
                                            obj.insert(
                                                "current_mode_id".to_string(),
                                                serde_json::Value::String(new_id.clone()),
                                            );
                                            // Accept both wire casings for the
                                            // current id when merging.
                                            obj.insert(
                                                "currentModeId".to_string(),
                                                serde_json::Value::String(new_id),
                                            );
                                        }
                                        *guard = state.clone();
                                        drop(guard);
                                        if !replaying.load(Ordering::SeqCst) {
                                            if let Err(error) = event_log.append(
                                                &session_id,
                                                &agent_name,
                                                EventPayload::SessionModes { state },
                                            ) {
                                                tracing::error!(%error, "Stopping ACP reader after event persistence failure");
                                                break;
                                            }
                                        }
                                    }
                                }
                                if replaying.load(Ordering::SeqCst) {
                                    continue;
                                }
                                continue;
                            } else if kind == "usage_update" {
                                if let Ok(notif) =
                                    serde_json::from_value::<SessionNotification>(params.clone())
                                {
                                    if let SessionUpdate::UsageUpdate(u) = &notif.update {
                                        let snapshot = serde_json::json!({
                                            "used": u.used,
                                            "size": u.size,
                                            "cost": u.cost,
                                        });
                                        *last_usage.write().await = snapshot;
                                        if !replaying.load(Ordering::SeqCst) {
                                            let (amount, currency) = u
                                                .cost
                                                .as_ref()
                                                .map(|c| (Some(c.amount), Some(c.currency.clone())))
                                                .unwrap_or((None, None));
                                            if let Err(error) = event_log.append(
                                                &session_id,
                                                &agent_name,
                                                EventPayload::UsageUpdate {
                                                    used: u.used,
                                                    size: u.size,
                                                    cost_amount: amount,
                                                    cost_currency: currency,
                                                },
                                            ) {
                                                tracing::error!(%error, "Stopping ACP reader after event persistence failure");
                                                break;
                                            }
                                        }
                                    }
                                }
                                if replaying.load(Ordering::SeqCst) {
                                    continue;
                                }
                                continue;
                            }
                            if replaying.load(Ordering::SeqCst) {
                                continue;
                            }
                            if let Ok(notif) = serde_json::from_value::<SessionNotification>(params)
                            {
                                if let Err(error) = handle_session_update(
                                    &event_log,
                                    &store,
                                    &session_id,
                                    &agent_name,
                                    &notif.update,
                                    &available_commands,
                                    &session_modes,
                                    &last_usage,
                                )
                                .await
                                {
                                    tracing::error!(%error, "Stopping ACP reader after event persistence failure");
                                    break;
                                }
                            }
                        } else if method == CLIENT_METHOD_NAMES.elicitation_complete
                            || method == "elicitation/complete"
                        {
                            // Agent signals a URL elicitation finished
                            // out-of-band. Clear pending state and tell the
                            // UI to dismiss it. Never log secret material.
                            if let Ok(notif) = serde_json::from_value::<
                                agent_client_protocol_schema::CompleteElicitationNotification,
                            >(params)
                            {
                                let eid = notif.elicitation_id.to_string();
                                callback_handler.complete_elicitation(&eid).await;
                                let _ = event_log.append(
                                    &session_id,
                                    &agent_name,
                                    EventPayload::ElicitationComplete {
                                        elicitation_id: eid,
                                    },
                                );
                            }
                        } else if method.starts_with("$/") {
                            // Protocol-level notifications are advisory.
                            // `$`-prefixed methods may be ignored per spec.
                            continue;
                        }
                    }
                    IncomingKind::Request { id, method, params } => {
                        let handler = callback_handler.clone();
                        let tx = writer_tx.clone();
                        let sem = request_semaphore.clone();
                        tokio::spawn(async move {
                            let _permit = match sem.acquire().await {
                                Ok(p) => p,
                                Err(_) => return,
                            };
                            let response =
                                handle_agent_request(&method, params, &id, &handler).await;

                            let resp = JsonRpcResponse {
                                jsonrpc: "2.0",
                                id,
                                result: response.as_ref().ok().cloned(),
                                error: response.err().map(|e| protocol::JsonRpcError {
                                    code: -32000,
                                    message: e.to_string(),
                                    data: None,
                                }),
                            };

                            if let Ok(line) = serde_json::to_string(&resp) {
                                let _ = tx.send(WriterMsg::Line(line)).await;
                            }
                        });
                    }
                    IncomingKind::Invalid => {
                        tracing::debug!(agent = %agent_name, "Invalid JSON-RPC message");
                    }
                }
            }
            Err(e) => {
                tracing::debug!(agent = %agent_name, "stdout read error: {}", e);
                break;
            }
        }
    }

    connected.store(false, Ordering::SeqCst);
    let _ = event_log.append(
        &session_id,
        &agent_name,
        EventPayload::StateChange {
            process: "DEAD".into(),
            turn: "IDLE".into(),
        },
    );
    kill_child(&child, child_root_pid).await;
    fail_pending_requests(
        &pending,
        format!("ACP agent connection closed for {}", agent_name),
    )
    .await;
}

pub fn validate_config_value(
    options: &serde_json::Value,
    id: &str,
    value: &serde_json::Value,
) -> anyhow::Result<()> {
    let option = options
        .as_array()
        .and_then(|a| a.iter().find(|o| o["id"] == id))
        .ok_or_else(|| anyhow::anyhow!("Unknown ACP config option"))?;
    fn contains(options: &serde_json::Value, value: &serde_json::Value) -> bool {
        options.as_array().is_some_and(|a| {
            a.iter()
                .any(|o| o.get("value") == Some(value) || contains(&o["options"], value))
        })
    }
    let valid = match option["type"].as_str() {
        Some("select") => contains(&option["options"], value),
        Some("boolean") => value.is_boolean(),
        _ => false,
    };
    anyhow::ensure!(valid, "Unsupported ACP config value");
    Ok(())
}

async fn handle_agent_request(
    method: &str,
    params: serde_json::Value,
    id: &agent_client_protocol_schema::RequestId,
    handler: &CallbackHandler,
) -> Result<serde_json::Value, String> {
    match method {
        m if m == CLIENT_METHOD_NAMES.session_request_permission => {
            let req: RequestPermissionRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            let resp = handler.handle_request_permission(req).await;
            serde_json::to_value(resp).map_err(|e| e.to_string())
        }
        m if m == CLIENT_METHOD_NAMES.elicitation_create => {
            let req: agent_client_protocol_schema::CreateElicitationRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            let rpc_id = match id {
                agent_client_protocol_schema::RequestId::Number(n) => n.to_string(),
                agent_client_protocol_schema::RequestId::Str(s) => s.to_string(),
                agent_client_protocol_schema::RequestId::Null => "null".to_string(),
            };
            let resp = handler.handle_elicitation(rpc_id, req).await;
            serde_json::to_value(resp).map_err(|e| e.to_string())
        }
        m if m == CLIENT_METHOD_NAMES.fs_read_text_file => {
            let req: ReadTextFileRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            match handler.handle_read_file(req).await {
                Ok(resp) => serde_json::to_value(resp).map_err(|e| e.to_string()),
                Err(e) => Err(e.to_string()),
            }
        }
        m if m == CLIENT_METHOD_NAMES.fs_write_text_file => {
            let req: WriteTextFileRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            match handler.handle_write_file(req).await {
                Ok(resp) => serde_json::to_value(resp).map_err(|e| e.to_string()),
                Err(e) => Err(e.to_string()),
            }
        }
        m if m == CLIENT_METHOD_NAMES.terminal_create => {
            let req: CreateTerminalRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            match handler.handle_create_terminal(req).await {
                Ok(resp) => serde_json::to_value(resp).map_err(|e| e.to_string()),
                Err(e) => Err(e.to_string()),
            }
        }
        m if m == CLIENT_METHOD_NAMES.terminal_output => {
            let req: TerminalOutputRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            match handler.handle_terminal_output(req).await {
                Ok(resp) => serde_json::to_value(resp).map_err(|e| e.to_string()),
                Err(e) => Err(e.to_string()),
            }
        }
        m if m == CLIENT_METHOD_NAMES.terminal_release => {
            let req: ReleaseTerminalRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            match handler.handle_release_terminal(req).await {
                Ok(resp) => serde_json::to_value(resp).map_err(|e| e.to_string()),
                Err(e) => Err(e.to_string()),
            }
        }
        m if m == CLIENT_METHOD_NAMES.terminal_wait_for_exit => {
            let req: WaitForTerminalExitRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            match handler.handle_wait_for_terminal_exit(req).await {
                Ok(resp) => serde_json::to_value(resp).map_err(|e| e.to_string()),
                Err(e) => Err(e.to_string()),
            }
        }
        m if m == CLIENT_METHOD_NAMES.terminal_kill => {
            let req: KillTerminalRequest =
                serde_json::from_value(params).map_err(|e| e.to_string())?;
            match handler.handle_kill_terminal(req).await {
                Ok(resp) => serde_json::to_value(resp).map_err(|e| e.to_string()),
                Err(e) => Err(e.to_string()),
            }
        }
        _ => Err(format!("Unknown method: {}", method)),
    }
}

#[allow(clippy::too_many_arguments)]
async fn handle_session_update(
    event_log: &EventLog,
    store: &Option<Arc<crate::store::Store>>,
    session_id: &str,
    agent_name: &str,
    update: &SessionUpdate,
    available_commands: &Arc<tokio::sync::RwLock<serde_json::Value>>,
    session_modes: &Arc<tokio::sync::RwLock<serde_json::Value>>,
    last_usage: &Arc<tokio::sync::RwLock<serde_json::Value>>,
) -> anyhow::Result<()> {
    let payload = match update {
        SessionUpdate::SessionInfoUpdate(info) => {
            // Preserve title for the chat row plus generic updated_at.
            // Unknown _meta stays opaque; no provider interpretation.
            let title_opt = match &info.title {
                ::agent_client_protocol_schema::MaybeUndefined::Value(t) => {
                    let trimmed = t.trim();
                    if !trimmed.is_empty() && trimmed.len() <= 200 {
                        if let Some(st) = store {
                            let mut changed = false;
                            let _ = st.update_chat(session_id, |c| {
                                if !c.title_overridden && c.title != trimmed {
                                    c.title = trimmed.to_string();
                                    changed = true;
                                }
                            });
                            if changed {
                                event_log.append(
                                    session_id,
                                    agent_name,
                                    EventPayload::MetadataChanged {},
                                )?;
                            }
                        }
                        Some(trimmed.to_string())
                    } else {
                        None
                    }
                }
                _ => None,
            };
            let updated_at_opt = match &info.updated_at {
                ::agent_client_protocol_schema::MaybeUndefined::Value(t) => {
                    let trimmed = t.trim();
                    if trimmed.is_empty() {
                        None
                    } else {
                        Some(trimmed.to_string())
                    }
                }
                _ => None,
            };
            // Emit generic session metadata even when the title was
            // ignored for the chat row, so updated_at is not silently
            // dropped. Skip entirely when the agent sent nothing useful.
            if title_opt.is_none() && updated_at_opt.is_none() {
                // Still check Null-clear: if either was explicit Null, emit
                // a clear marker so the UI can drop stale metadata.
                let title_is_null = matches!(
                    &info.title,
                    ::agent_client_protocol_schema::MaybeUndefined::Null
                );
                let updated_is_null = matches!(
                    &info.updated_at,
                    ::agent_client_protocol_schema::MaybeUndefined::Null
                );
                if !title_is_null && !updated_is_null {
                    return Ok(());
                }
            }
            EventPayload::SessionInfo {
                title: title_opt,
                updated_at: updated_at_opt,
            }
        }
        SessionUpdate::UserMessageChunk(_) => {
            // Agent-reflected user chunks must not duplicate Pueblo's
            // locally persisted UserMessage during replay/resume. The local
            // echo in admit_turn is authoritative; drop the reflection.
            return Ok(());
        }
        SessionUpdate::AgentMessageChunk(chunk) => {
            let text = match &chunk.content {
                ContentBlock::Text(t) => t.text.as_str(),
                _ => return Ok(()),
            };
            if text.is_empty() {
                return Ok(());
            }
            EventPayload::MessageChunk {
                text: text.to_string(),
                message_id: chunk.message_id.as_ref().map(|m| m.to_string()),
            }
        }
        SessionUpdate::AgentThoughtChunk(chunk) => {
            let text = match &chunk.content {
                ContentBlock::Text(t) => t.text.as_str(),
                _ => return Ok(()),
            };
            if text.is_empty() {
                return Ok(());
            }
            EventPayload::ThoughtChunk {
                text: text.to_string(),
                message_id: chunk.message_id.as_ref().map(|m| m.to_string()),
            }
        }
        SessionUpdate::ToolCall(tc) => {
            let title = extract_tool_call_title(Some(&tc.title), tc.raw_input.as_ref());
            let kind = serde_json::to_value(tc.kind)
                .ok()
                .and_then(|v| v.as_str().map(ToOwned::to_owned))
                .or_else(|| Some(format!("{:?}", tc.kind).to_lowercase()));
            let parent_id = extract_parent_id(tc.meta.as_ref());
            let locations = if tc.locations.is_empty() {
                None
            } else {
                serde_json::to_value(&tc.locations).ok()
            };
            EventPayload::ToolCall {
                id: tc.tool_call_id.to_string(),
                title,
                status: "in_progress".to_string(),
                kind,
                parent_id,
                locations,
            }
        }
        SessionUpdate::ToolCallUpdate(tcu) => {
            let title = tcu
                .fields
                .title
                .as_deref()
                .map(|t| extract_tool_call_title(Some(t), tcu.fields.raw_input.as_ref()))
                .or_else(|| {
                    tcu.fields
                        .raw_input
                        .as_ref()
                        .map(|i| extract_tool_call_title(None, Some(i)))
                });
            let kind = tcu.fields.kind.map(|k| {
                serde_json::to_value(k)
                    .ok()
                    .and_then(|v| v.as_str().map(ToOwned::to_owned))
                    .unwrap_or_else(|| format!("{:?}", k).to_lowercase())
            });
            let locations = tcu
                .fields
                .locations
                .as_ref()
                .filter(|l| !l.is_empty())
                .and_then(|l| serde_json::to_value(l).ok());
            EventPayload::ToolCallUpdate {
                id: tcu.tool_call_id.to_string(),
                status: serialize_optional_enum(&tcu.fields.status),
                title,
                kind,
                output: clean_tool_output(format_tool_call_output(&tcu.fields)),
                locations,
            }
        }
        SessionUpdate::Plan(plan) => {
            let entries = plan
                .entries
                .iter()
                .map(|e| crate::events::PlanEntry {
                    content: e.content.clone(),
                    status: format!("{:?}", e.status),
                })
                .collect();
            EventPayload::Plan { entries }
        }
        SessionUpdate::AvailableCommandsUpdate(u) => {
            let cmds = serde_json::to_value(&u.available_commands).unwrap_or(serde_json::json!([]));
            *available_commands.write().await = cmds.clone();
            EventPayload::AvailableCommands { commands: cmds }
        }
        SessionUpdate::CurrentModeUpdate(u) => {
            let new_id = u.current_mode_id.to_string();
            let mut guard = session_modes.write().await;
            let mut state = (*guard).clone();
            if state.is_null() {
                state = serde_json::json!({
                    "current_mode_id": new_id,
                    "available_modes": []
                });
            } else if let Some(obj) = state.as_object_mut() {
                obj.insert(
                    "current_mode_id".to_string(),
                    serde_json::Value::String(new_id.clone()),
                );
                obj.insert(
                    "currentModeId".to_string(),
                    serde_json::Value::String(new_id),
                );
            }
            *guard = state.clone();
            drop(guard);
            EventPayload::SessionModes { state }
        }
        SessionUpdate::ConfigOptionUpdate(u) => {
            // Authoritative snapshot; reader_task already emitted for live
            // updates. This path covers direct handling (tests) and keeps
            // ordering/descriptions/values/groups/categories generically.
            let options = serde_json::to_value(&u.config_options).unwrap_or(serde_json::json!([]));
            EventPayload::ConfigOptions { options }
        }
        SessionUpdate::UsageUpdate(u) => {
            let snapshot = serde_json::json!({
                "used": u.used,
                "size": u.size,
                "cost": u.cost,
            });
            *last_usage.write().await = snapshot;
            let (amount, currency) = u
                .cost
                .as_ref()
                .map(|c| (Some(c.amount), Some(c.currency.clone())))
                .unwrap_or((None, None));
            EventPayload::UsageUpdate {
                used: u.used,
                size: u.size,
                cost_amount: amount,
                cost_currency: currency,
            }
        }
        _ => return Ok(()),
    };

    event_log.append(session_id, agent_name, payload)?;
    Ok(())
}

fn serialize_optional_enum<T: serde::Serialize>(value: &Option<T>) -> String {
    value
        .as_ref()
        .and_then(|inner| serde_json::to_value(inner).ok())
        .and_then(|serialized| serialized.as_str().map(ToOwned::to_owned))
        .unwrap_or_else(|| "unknown".to_string())
}

fn format_tool_call_output(
    fields: &agent_client_protocol_schema::ToolCallUpdateFields,
) -> Option<String> {
    if let Some(content) = &fields.content {
        let parts = content
            .iter()
            .filter_map(|item| match item {
                ToolCallContent::Content(content) => match &content.content {
                    ContentBlock::Text(text) => Some(text.text.clone()),
                    other => serde_json::to_string(other).ok(),
                },
                ToolCallContent::Diff(diff) => serde_json::to_string(diff).ok(),
                ToolCallContent::Terminal(terminal) => {
                    Some(format!("terminal: {}", terminal.terminal_id))
                }
                _ => None,
            })
            .filter(|part| !part.is_empty())
            .collect::<Vec<_>>();
        if !parts.is_empty() {
            return Some(parts.join("\n"));
        }
    }

    fields.raw_output.as_ref().map(|raw_output| {
        raw_output
            .as_str()
            .map(ToOwned::to_owned)
            .unwrap_or_else(|| raw_output.to_string())
    })
}

fn clean_tool_output(output: Option<String>) -> Option<String> {
    let s = output?;
    let trimmed = s.trim();
    if trimmed.starts_with("```") && trimmed.ends_with("```") && trimmed.len() >= 6 {
        let inner = &trimmed[3..trimmed.len() - 3];
        let content = if let Some(newline_pos) = inner.find('\n') {
            &inner[newline_pos + 1..]
        } else {
            inner
        };
        Some(content.trim_end().to_string())
    } else {
        Some(s)
    }
}

fn extract_tool_call_title(title: Option<&str>, raw_input: Option<&serde_json::Value>) -> String {
    if let Some(t) = title {
        let trimmed = t.trim();
        if !trimmed.is_empty()
            && trimmed != "Read File"
            && trimmed != "Terminal"
            && trimmed != "Tool Call"
        {
            return trimmed.to_string();
        }
    }

    if let Some(input) = raw_input {
        if let Some(cmd) = input.get("command").and_then(|c| c.as_str()) {
            return format!("Terminal: {}", cmd);
        }
        if let Some(path) = input
            .get("file_path")
            .or_else(|| input.get("path"))
            .and_then(|p| p.as_str())
        {
            return format!("Read: {}", path);
        }
        if let Some(desc) = input.get("description").and_then(|d| d.as_str()) {
            return desc.to_string();
        }
    }

    title
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .unwrap_or_else(|| "Tool Call".to_string())
}

fn extract_parent_id(meta: Option<&agent_client_protocol_schema::Meta>) -> Option<String> {
    meta.and_then(|m| serde_json::to_value(m).ok())
        .and_then(|v| {
            v.pointer("/claudeCode/parentToolUseId")
                .and_then(|p| p.as_str())
                .map(ToOwned::to_owned)
        })
}

async fn wait_task(child: SharedChild, child_root_pid: Option<u32>, connected: Arc<AtomicBool>) {
    loop {
        {
            let mut guard = child.lock().await;
            let Some(c) = guard.as_mut() else { break };
            match c.try_wait() {
                Ok(Some(_)) | Err(_) => break,
                Ok(None) => {}
            }
        }
        tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    }
    connected.store(false, Ordering::SeqCst);
    kill_child(&child, child_root_pid).await;
}

async fn kill_child(child: &SharedChild, root_pid: Option<u32>) {
    let Some(mut c) = child.lock().await.take() else {
        return;
    };
    if let Err(e) = c.start_kill() {
        tracing::warn!(?root_pid, error = %e, "kill_child: start_kill failed");
    }
    // Wait briefly for the wrapper to observe exit so subsequent shutdown work
    // doesn't race the kill. On Windows TerminateJobObject is asynchronous;
    // 5s is plenty for the kernel to tear the tree down.
    let _ = tokio::task::spawn_blocking(move || {
        let deadline = std::time::Instant::now() + std::time::Duration::from_secs(5);
        loop {
            match c.try_wait() {
                Ok(Some(_)) | Err(_) => return,
                Ok(None) if std::time::Instant::now() >= deadline => {
                    tracing::warn!(?root_pid, "kill_child: timed out waiting for exit");
                    return;
                }
                Ok(None) => std::thread::sleep(std::time::Duration::from_millis(50)),
            }
        }
    })
    .await;
}

#[cfg(test)]
mod tests {
    use super::agent_client_protocol_schema::{TextContent, ToolCallContent, ToolCallUpdateFields};
    use super::*;

    #[tokio::test]
    async fn test_handle_agent_request_accepts_schema_method_names() {
        let temp = tempfile::tempdir().unwrap();
        let file_path = temp.path().join("note.txt");
        std::fs::write(&file_path, "hello").unwrap();

        let tracker = Arc::new(crate::tasks::TerminalTaskTracker::default());
        let handler = CallbackHandler::new(
            CallbackPolicy::ReadOnly,
            "session-1".into(),
            "codex".into(),
            Arc::new(EventLog::new(100)),
            temp.path().to_path_buf(),
            Arc::new(std::collections::HashMap::new()),
            tracker,
        );

        let params =
            serde_json::to_value(ReadTextFileRequest::new("session-1", file_path)).unwrap();
        let result = handle_agent_request(
            CLIENT_METHOD_NAMES.fs_read_text_file,
            params,
            &agent_client_protocol_schema::RequestId::Number(1),
            &handler,
        )
        .await
        .unwrap();

        assert_eq!(result["content"], "hello");
    }

    #[test]
    fn test_format_tool_call_output_prefers_text_content() {
        let fields = ToolCallUpdateFields::new().content(vec![ToolCallContent::Content(
            agent_client_protocol_schema::Content::new(ContentBlock::Text(TextContent::new(
                "tool output",
            ))),
        )]);

        assert_eq!(
            format_tool_call_output(&fields),
            Some("tool output".to_string())
        );
    }

    #[test]
    fn test_serialize_optional_enum_uses_wire_name() {
        let status = Some(agent_client_protocol_schema::ToolCallStatus::Completed);

        assert_eq!(serialize_optional_enum(&status), "completed");
    }

    #[test]
    fn test_clean_tool_output_strips_markdown_code_fence() {
        let fenced = Some("```rust\nfn main() {}\n```".to_string());
        assert_eq!(clean_tool_output(fenced), Some("fn main() {}".to_string()));

        let unfenced = Some("plain output".to_string());
        assert_eq!(
            clean_tool_output(unfenced),
            Some("plain output".to_string())
        );
    }

    #[test]
    fn test_extract_tool_call_title() {
        assert_eq!(
            extract_tool_call_title(
                Some("Read File"),
                Some(&serde_json::json!({"file_path": "src/lib.rs"}))
            ),
            "Read: src/lib.rs"
        );
        assert_eq!(
            extract_tool_call_title(
                Some("Terminal"),
                Some(&serde_json::json!({"command": "cargo check"}))
            ),
            "Terminal: cargo check"
        );
        assert_eq!(
            extract_tool_call_title(Some("Read src/lib.rs (1 - 50)"), None),
            "Read src/lib.rs (1 - 50)"
        );
    }

    fn test_log() -> Arc<EventLog> {
        Arc::new(EventLog::new(100))
    }

    type SharedJson = Arc<tokio::sync::RwLock<serde_json::Value>>;

    #[allow(clippy::type_complexity)]
    fn test_arcs() -> (SharedJson, SharedJson, SharedJson) {
        (
            Arc::new(tokio::sync::RwLock::new(serde_json::json!([]))),
            Arc::new(tokio::sync::RwLock::new(serde_json::Value::Null)),
            Arc::new(tokio::sync::RwLock::new(serde_json::Value::Null)),
        )
    }

    #[tokio::test]
    async fn test_available_commands_preserve_ordering_and_hints() {
        let log = test_log();
        let (cmds, modes, usage) = test_arcs();
        let update = SessionUpdate::AvailableCommandsUpdate(
            agent_client_protocol_schema::AvailableCommandsUpdate::new(vec![
                agent_client_protocol_schema::AvailableCommand::new("plan", "Make a plan").input(
                    agent_client_protocol_schema::AvailableCommandInput::Unstructured(
                        agent_client_protocol_schema::UnstructuredCommandInput::new("goal"),
                    ),
                ),
                agent_client_protocol_schema::AvailableCommand::new("review", "Review changes"),
            ]),
        );
        handle_session_update(&log, &None, "s1", "codex", &update, &cmds, &modes, &usage)
            .await
            .unwrap();
        assert_eq!(cmds.read().await.as_array().unwrap().len(), 2);
        let events = match log.replay_from(1) {
            crate::events::ReplayResult::Complete(e) => e,
            _ => panic!("expected complete"),
        };
        assert!(matches!(
            &events[0].payload,
            crate::events::EventPayload::AvailableCommands { commands } if commands.as_array().unwrap().len() == 2
        ));
    }

    #[tokio::test]
    async fn test_current_mode_update_merges_and_old_agents_without_modes_work() {
        let log = test_log();
        let (cmds, modes, usage) = test_arcs();
        // Agent without modes: Null stays Null, no crash.
        let update = SessionUpdate::CurrentModeUpdate(
            agent_client_protocol_schema::CurrentModeUpdate::new("act"),
        );
        handle_session_update(&log, &None, "s1", "codex", &update, &cmds, &modes, &usage)
            .await
            .unwrap();
        assert_eq!(modes.read().await["current_mode_id"], "act");
    }

    #[tokio::test]
    async fn test_user_message_chunk_does_not_duplicate() {
        let log = test_log();
        let (cmds, modes, usage) = test_arcs();
        let chunk = agent_client_protocol_schema::ContentChunk::new(ContentBlock::Text(
            TextContent::new("hello"),
        ));
        let update = SessionUpdate::UserMessageChunk(chunk);
        handle_session_update(&log, &None, "s1", "codex", &update, &cmds, &modes, &usage)
            .await
            .unwrap();
        let events = match log.replay_from(1) {
            crate::events::ReplayResult::Complete(e) => e,
            _ => panic!("expected complete"),
        };
        assert!(events.is_empty());
    }

    #[tokio::test]
    async fn test_message_ids_survive_and_old_chunks_without_ids_work() {
        let log = test_log();
        let (cmds, modes, usage) = test_arcs();
        let with_id = SessionUpdate::AgentMessageChunk(
            agent_client_protocol_schema::ContentChunk::new(ContentBlock::Text(TextContent::new(
                "hi",
            )))
            .message_id("msg-1"),
        );
        handle_session_update(&log, &None, "s1", "codex", &with_id, &cmds, &modes, &usage)
            .await
            .unwrap();
        let without_id =
            SessionUpdate::AgentMessageChunk(agent_client_protocol_schema::ContentChunk::new(
                ContentBlock::Text(TextContent::new("old")),
            ));
        handle_session_update(
            &log,
            &None,
            "s1",
            "codex",
            &without_id,
            &cmds,
            &modes,
            &usage,
        )
        .await
        .unwrap();
        let events = match log.replay_from(1) {
            crate::events::ReplayResult::Complete(e) => e,
            _ => panic!("expected complete"),
        };
        assert_eq!(events.len(), 2);
        assert!(matches!(
            &events[0].payload,
            crate::events::EventPayload::MessageChunk { message_id: Some(id), .. } if id == "msg-1"
        ));
        assert!(matches!(
            &events[1].payload,
            crate::events::EventPayload::MessageChunk {
                message_id: None,
                ..
            }
        ));
    }

    #[tokio::test]
    async fn test_usage_update_exposes_context_and_cost_generically() {
        let log = test_log();
        let (cmds, modes, usage) = test_arcs();
        let update = SessionUpdate::UsageUpdate(
            agent_client_protocol_schema::UsageUpdate::new(100, 2000)
                .cost(agent_client_protocol_schema::Cost::new(0.5, "USD")),
        );
        handle_session_update(&log, &None, "s1", "codex", &update, &cmds, &modes, &usage)
            .await
            .unwrap();
        assert_eq!(usage.read().await["used"], 100);
        let events = match log.replay_from(1) {
            crate::events::ReplayResult::Complete(e) => e,
            _ => panic!("expected complete"),
        };
        assert!(matches!(
            &events[0].payload,
            crate::events::EventPayload::UsageUpdate {
                used: 100,
                size: 2000,
                cost_amount: Some(_),
                cost_currency: Some(_),
                ..
            }
        ));
    }

    #[tokio::test]
    async fn test_tool_locations_preserved() {
        let log = test_log();
        let (cmds, modes, usage) = test_arcs();
        let tc = agent_client_protocol_schema::ToolCall::new("t1", "Edit").locations(vec![
            agent_client_protocol_schema::ToolCallLocation::new("/a/b.rs").line(3_u32),
        ]);
        let update = SessionUpdate::ToolCall(tc);
        handle_session_update(&log, &None, "s1", "codex", &update, &cmds, &modes, &usage)
            .await
            .unwrap();
        let events = match log.replay_from(1) {
            crate::events::ReplayResult::Complete(e) => e,
            _ => panic!("expected complete"),
        };
        assert!(matches!(
            &events[0].payload,
            crate::events::EventPayload::ToolCall {
                locations: Some(_),
                ..
            }
        ));
    }

    #[test]
    fn test_validate_boolean_config_and_select() {
        let options = serde_json::json!([
            {"id": "model", "type": "select", "options": [{"value": "small", "name": "Small"}]},
            {"id": "web", "type": "boolean"}
        ]);
        assert!(validate_config_value(&options, "model", &serde_json::json!("small")).is_ok());
        assert!(validate_config_value(&options, "model", &serde_json::json!("big")).is_err());
        assert!(validate_config_value(&options, "web", &serde_json::json!(true)).is_ok());
        assert!(validate_config_value(&options, "web", &serde_json::json!("yes")).is_err());
    }
}
