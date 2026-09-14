use crate::acp::{AcpClient, SavedConfigRejected};
use crate::agents::{AgentRegistry, AgentRuntime};
use crate::events::{EventLog, EventPayload};
use crate::state::{ProcessState, TurnState};
use crate::store::{Chat, ChatWorkspace, Project, WorkspaceMode};
use crate::workspace;
use ::agent_client_protocol_schema::v1 as agent_client_protocol_schema;
use agent_client_protocol_schema::{PromptResponse, StopReason};
use std::collections::HashMap;
use std::path::{Component, Path, PathBuf};
use std::sync::{Arc, Mutex as StdMutex};
use std::time::{Duration, Instant};
use tokio::sync::{Mutex, OwnedMutexGuard, RwLock};

#[derive(Debug, Clone, Hash, Eq, PartialEq)]
pub struct SessionKey {
    pub agent: String,
    pub cwd: PathBuf,
}

pub struct AdmittedTurn {
    _guard: OwnedMutexGuard<()>,
    _checkout_guard: Option<OwnedMutexGuard<()>>,
    message: String,
    timeout: Option<Duration>,
    start_seq: u64,
}

pub struct AcpSession {
    store: Option<Arc<crate::store::Store>>,
    pub id: String,
    pub key: SessionKey,
    process_state: RwLock<ProcessState>,
    turn_state: RwLock<TurnState>,
    client: RwLock<Option<Arc<AcpClient>>>,
    acp_session_id: RwLock<Option<agent_client_protocol_schema::SessionId>>,
    // Last spawned wrapper PID. Kept independently of `client` so that even if
    // `mark_dead` takes the client (and the spawned shutdown task races with
    // agent-hub's own exit), `shutdown` still has a root pid to sweep descendants.
    child_root_pid: RwLock<Option<u32>>,
    runtime: Arc<AgentRuntime>,
    event_log: Arc<EventLog>,
    last_activity: RwLock<Instant>,
    turn_guard: Arc<Mutex<()>>,
    checkout_guard: Option<Arc<Mutex<()>>>,
    startup_lock: Mutex<()>,
}

impl AcpSession {
    pub fn new(
        key: SessionKey,
        runtime: Arc<AgentRuntime>,
        event_log: Arc<EventLog>,
        checkout_guard: Option<Arc<Mutex<()>>>,
    ) -> Self {
        Self {
            store: None,
            id: uuid::Uuid::new_v4().to_string(),
            key,
            process_state: RwLock::new(ProcessState::Stopped),
            turn_state: RwLock::new(TurnState::Idle),
            client: RwLock::new(None),
            acp_session_id: RwLock::new(None),
            child_root_pid: RwLock::new(None),
            runtime,
            event_log,
            last_activity: RwLock::new(Instant::now()),
            turn_guard: Arc::new(Mutex::new(())),
            checkout_guard,
            startup_lock: Mutex::new(()),
        }
    }

    pub async fn process_state(&self) -> ProcessState {
        let state = *self.process_state.read().await;
        if state == ProcessState::Running && self.client_disconnected().await {
            ProcessState::Dead
        } else {
            state
        }
    }

    pub async fn turn_state(&self) -> TurnState {
        *self.turn_state.read().await
    }

    async fn touch(&self) {
        *self.last_activity.write().await = Instant::now();
    }

    pub async fn last_activity(&self) -> Instant {
        *self.last_activity.read().await
    }

    async fn emit_state_change(
        &self,
        process: ProcessState,
        turn: TurnState,
    ) -> anyhow::Result<()> {
        self.event_log.append(
            &self.id,
            &self.key.agent,
            EventPayload::StateChange {
                process: process.to_string(),
                turn: turn.to_string(),
            },
        )?;
        Ok(())
    }

    async fn set_states(&self, process: ProcessState, turn: TurnState) -> anyhow::Result<()> {
        *self.process_state.write().await = process;
        *self.turn_state.write().await = turn;
        self.emit_state_change(process, turn).await
    }

    async fn mark_dead(&self) -> anyhow::Result<()> {
        let client = self.client.write().await.take();
        *self.child_root_pid.write().await = None;
        let state_result = self.set_states(ProcessState::Dead, TurnState::Idle).await;
        if let Some(client) = client {
            client.terminate().await;
            tokio::spawn(async move {
                client.shutdown().await;
            });
        }
        state_result
    }

    async fn finalize_turn_response(&self, resp: &PromptResponse) -> anyhow::Result<()> {
        let stop_reason = stop_reason_to_string(resp.stop_reason);
        self.event_log.append(
            &self.id,
            &self.key.agent,
            EventPayload::TurnComplete { stop_reason },
        )?;
        Ok(())
    }

    pub async fn ensure_running(&self) -> anyhow::Result<()> {
        // Serialize startup per chat. A second caller waits here, then
        // re-reads the process state below and reuses the RUNNING client
        // instead of failing on STARTING or spawning a second process.
        // Separate from `turn_guard`: `admit_turn`, `resume`, and
        // `set_config` can already hold `turn_guard` when they call here.
        let _startup_guard = self.startup_lock.lock().await;
        if let Some(store) = &self.store {
            let chat = store.chat(&self.id)?;
            anyhow::ensure!(
                !chat.archived,
                "Chat is archived; restore it before reconnecting"
            );
            let project = store.project(&chat.project_id)?;
            let workspace = store.workspace(&chat.id)?;
            let state_worktrees = store.worktrees_dir();
            let key_cwd = self.key.cwd.clone();
            tokio::task::spawn_blocking(move || {
                validate_persistent_workspace(
                    &chat,
                    &project,
                    workspace.as_ref(),
                    &state_worktrees,
                    &key_cwd,
                )
            })
            .await??;
        }
        let ps = *self.process_state.read().await;
        if ps == ProcessState::Running && !self.client_disconnected().await {
            return Ok(());
        }
        if !ps.can_start() && ps != ProcessState::Running {
            anyhow::bail!("Cannot start agent in state {}", ps);
        }

        self.set_states(ProcessState::Starting, TurnState::Idle)
            .await?;

        let policy = if let Some(store) = &self.store {
            store.chat(&self.id)?.permission_policy
        } else {
            self.runtime.default_permission_policy.clone()
        };
        let client = match AcpClient::spawn(
            &self.runtime.launch.command,
            &self.runtime.launch.args,
            &self.runtime.launch.env,
            &self.key.cwd,
            policy,
            self.id.clone(),
            self.key.agent.clone(),
            self.event_log.clone(),
            self.store.clone(),
        )
        .await
        {
            Ok(c) => c,
            Err(e) => {
                self.set_states(ProcessState::Dead, TurnState::Idle).await?;
                return Err(e);
            }
        };

        // Track the wrapper PID immediately so initialize/new_session failures
        // (which run client.shutdown()) still have a root pid available for the
        // tree sweep. Cleared on every failure path below.
        *self.child_root_pid.write().await = client.root_pid();

        if let Err(e) =
            tokio::time::timeout(Duration::from_secs(60), client.initialize(&self.key.cwd))
                .await
                .unwrap_or_else(|_| Err(anyhow::anyhow!("ACP initialize timed out")))
        {
            client.shutdown().await;
            *self.child_root_pid.write().await = None;
            self.set_states(ProcessState::Dead, TurnState::Idle).await?;
            return Err(e);
        }

        let saved = self
            .acp_session_id
            .read()
            .await
            .as_ref()
            .map(|s| s.to_string());
        let new_session = match tokio::time::timeout(
            Duration::from_secs(60),
            client.open_session(&self.key.cwd, saved.as_deref()),
        )
        .await
        .unwrap_or_else(|_| Err(anyhow::anyhow!("ACP session setup timed out")))
        {
            Ok(s) => s,
            Err(e) => {
                client.shutdown().await;
                *self.child_root_pid.write().await = None;
                self.set_states(ProcessState::Dead, TurnState::Idle).await?;
                return Err(e);
            }
        };

        *self.acp_session_id.write().await = Some(new_session.clone().into());
        if let Some(store) = &self.store {
            // Persist immediately, before config or prompts can fail.
            if let Err(e) =
                store.update_chat(&self.id, |c| c.acp_session_id = Some(new_session.clone()))
            {
                client.shutdown().await;
                self.set_states(ProcessState::Dead, TurnState::Idle).await?;
                return Err(e.into());
            }
            let values = store.chat(&self.id)?.config_values;
            if let Some(values) = values.as_object() {
                for (id, value) in values {
                    let result = tokio::time::timeout(
                        Duration::from_secs(30),
                        client.set_config(&new_session.clone().into(), id, value.clone()),
                    )
                    .await;
                    match result {
                        // A timeout applying saved config is transient: keep
                        // `config_values` so the ordinary Retry path appears.
                        Err(_) => {
                            client.shutdown().await;
                            *self.child_root_pid.write().await = None;
                            self.set_states(ProcessState::Dead, TurnState::Idle).await?;
                            anyhow::bail!(
                                "Timed out applying saved ACP option {id}; retry to reconnect"
                            );
                        }
                        // A genuine agent rejection or locally invalid stale
                        // config keeps its typed identity for `resume_chat`
                        // to map to `SavedConfigRejected`. Return it unwrapped
                        // so the downcast survives.
                        Ok(Err(error)) if error.is::<SavedConfigRejected>() => {
                            client.shutdown().await;
                            *self.child_root_pid.write().await = None;
                            self.set_states(ProcessState::Dead, TurnState::Idle).await?;
                            return Err(error);
                        }
                        // Transport disconnects, writer failures, and malformed
                        // agent responses are transient: preserve the saved
                        // option and let Retry reconnect.
                        Ok(Err(error)) => {
                            client.shutdown().await;
                            *self.child_root_pid.write().await = None;
                            self.set_states(ProcessState::Dead, TurnState::Idle).await?;
                            return Err(anyhow::anyhow!(
                                "Failed to reapply saved ACP option {id}; retry to reconnect: {error}"
                            ));
                        }
                        Ok(Ok(_)) => {}
                    }
                }
            }
        }
        self.event_log.append(
            &self.id,
            &self.key.agent,
            EventPayload::ConfigOptions {
                options: client.config_options.read().await.clone(),
            },
        )?;
        *self.client.write().await = Some(Arc::new(client));
        self.set_states(ProcessState::Running, TurnState::Idle)
            .await?;

        Ok(())
    }

    async fn admit_turn(
        &self,
        message: String,
        timeout: Option<Duration>,
    ) -> anyhow::Result<AdmittedTurn> {
        let guard = match self.turn_guard.clone().try_lock_owned() {
            Ok(guard) => guard,
            Err(_) => {
                let current_turn = self.turn_state().await;
                anyhow::bail!("Agent busy (turn state: {})", current_turn);
            }
        };

        let current_turn = self.turn_state().await;
        if !current_turn.can_prompt() {
            anyhow::bail!("Agent busy (turn state: {})", current_turn);
        }

        let checkout_guard = match &self.checkout_guard {
            Some(lock) => Some(lock.clone().try_lock_owned().map_err(|_| {
                anyhow::anyhow!("Another chat is already working in this project checkout")
            })?),
            None => None,
        };

        self.touch().await;
        self.ensure_running().await?;

        self.event_log.append(
            &self.id,
            &self.key.agent,
            EventPayload::UserMessage {
                text: message.clone(),
            },
        )?;

        self.set_states(ProcessState::Running, TurnState::Prompting)
            .await?;

        let start_seq = self.event_log.next_seq();

        Ok(AdmittedTurn {
            _guard: guard,
            _checkout_guard: checkout_guard,
            message,
            timeout,
            start_seq,
        })
    }

    pub async fn start_turn(
        self: &Arc<Self>,
        message: String,
        timeout: Option<Duration>,
    ) -> anyhow::Result<()> {
        let admitted = self.admit_turn(message, timeout).await?;
        let this = self.clone();
        tokio::spawn(async move {
            let _ = this.run_admitted_turn(admitted).await;
        });
        Ok(())
    }

    pub async fn ask(&self, message: String, timeout: Option<Duration>) -> anyhow::Result<String> {
        let admitted = self.admit_turn(message, timeout).await?;
        self.run_admitted_turn(admitted).await
    }

    async fn run_admitted_turn(&self, admitted: AdmittedTurn) -> anyhow::Result<String> {
        let AdmittedTurn {
            _guard,
            message,
            timeout,
            start_seq,
            ..
        } = admitted;
        let result = self.execute_prompt(&message, timeout, start_seq).await;
        if let Err(error) = &result {
            let stop_reason = if error.is::<PromptTimeout>() {
                "timeout"
            } else {
                "error"
            };
            let _ = self.finalize_failed_turn(error, stop_reason);
        }
        result
    }

    async fn execute_prompt(
        &self,
        message: &str,
        timeout: Option<Duration>,
        start_seq: u64,
    ) -> anyhow::Result<String> {
        let client = match self.client.read().await.as_ref().cloned() {
            Some(c) => c,
            None => {
                let _ = self.set_states(ProcessState::Dead, TurnState::Idle).await;
                anyhow::bail!("No client");
            }
        };
        let sid = match self.acp_session_id.read().await.clone() {
            Some(s) => s,
            None => {
                let _ = self.set_states(ProcessState::Dead, TurnState::Idle).await;
                anyhow::bail!("No ACP session");
            }
        };

        let prompt_future = client.prompt(&sid, message);
        tokio::pin!(prompt_future);

        let mut event_rx = self.event_log.subscribe();
        let session_id = self.id.clone();
        let mut sleep_future = timeout.map(|value| Box::pin(tokio::time::sleep(value)));

        let attempt = loop {
            tokio::select! {
                result = &mut prompt_future => {
                    break PromptAttempt::Completed(result);
                }
                event = event_rx.recv() => {
                    match event {
                        Ok(evt) if evt.session_id == session_id => {
                            self.touch().await;
                            if let Some(timeout) = timeout {
                                sleep_future = Some(Box::pin(tokio::time::sleep(timeout)));
                            }
                        }
                        _ => {}
                    }
                }
                _ = async { if let Some(sleep) = &mut sleep_future { sleep.await } }, if sleep_future.is_some() => {
                    let has_pending_perm = !client
                        .callback_handler()
                        .pending_permissions
                        .read()
                        .await
                        .is_empty();
                    if has_pending_perm {
                        sleep_future = timeout.map(|value| Box::pin(tokio::time::sleep(value)));
                    } else {
                        break PromptAttempt::TimedOut;
                    }
                }
            }
        };

        match attempt {
            PromptAttempt::Completed(Ok(resp)) => {
                self.set_states(ProcessState::Running, TurnState::Idle)
                    .await?;
                self.touch().await;
                if let Err(error) = self.finalize_turn_response(&resp).await {
                    let _ = self.mark_dead().await;
                    return Err(error);
                }
                self.try_sync_acp_title(&client).await?;
                Ok(self.collect_message_text(start_seq).await)
            }
            PromptAttempt::Completed(Err(err)) => {
                if self.client_disconnected().await {
                    self.mark_dead().await?;
                } else {
                    self.set_states(ProcessState::Running, TurnState::Idle)
                        .await?;
                    self.touch().await;
                }
                Err(err)
            }
            PromptAttempt::TimedOut => {
                self.mark_dead().await?;
                Err(PromptTimeout.into())
            }
        }
    }

    fn finalize_failed_turn(&self, error: &anyhow::Error, stop_reason: &str) -> anyhow::Result<()> {
        self.event_log.append(
            &self.id,
            &self.key.agent,
            EventPayload::Error {
                message: error.to_string(),
            },
        )?;
        self.event_log.append(
            &self.id,
            &self.key.agent,
            EventPayload::TurnComplete {
                stop_reason: stop_reason.into(),
            },
        )?;
        Ok(())
    }

    async fn client_disconnected(&self) -> bool {
        let client = self.client.read().await;
        client.as_ref().map(|c| !c.is_connected()).unwrap_or(true)
    }

    async fn supports_resume(&self) -> bool {
        match self.client.read().await.as_ref() {
            Some(client) => client.supports_resume().await,
            None => false,
        }
    }

    async fn collect_message_text(&self, start_seq: u64) -> String {
        let events = self.event_log.replay_from(start_seq);
        match events {
            crate::events::ReplayResult::Complete(evts)
            | crate::events::ReplayResult::Partial { events: evts, .. } => evts
                .iter()
                .filter(|e| e.session_id == self.id)
                .filter_map(|e| match &e.payload {
                    EventPayload::MessageChunk { text } => Some(text.as_str()),
                    _ => None,
                })
                .collect::<Vec<_>>()
                .join(""),
        }
    }

    pub async fn shutdown(&self) {
        let root_pid = *self.child_root_pid.read().await;
        tracing::info!(
            agent = %self.key.agent,
            session = %self.id,
            ?root_pid,
            "session shutdown begin"
        );
        let client = self.client.write().await.take();
        if let Some(c) = client {
            if let Some(sid) = self.acp_session_id.read().await.as_ref() {
                c.close_session(sid).await;
            }
            c.shutdown().await;
        }
        *self.child_root_pid.write().await = None;
        if let Err(error) = self
            .set_states(ProcessState::Stopped, TurnState::Idle)
            .await
        {
            tracing::error!(%error, "Failed to persist stopped session state");
        }
        tracing::info!(
            agent = %self.key.agent,
            session = %self.id,
            "session shutdown done"
        );
    }

    pub async fn respond_to_permission(&self, perm_id: &str, granted: bool) -> bool {
        let client = self.client.read().await;
        if let Some(c) = client.as_ref() {
            return c
                .callback_handler()
                .respond_permission(perm_id, granted)
                .await;
        }
        false
    }

    pub async fn resume(&self) -> anyhow::Result<()> {
        let _guard = self
            .turn_guard
            .try_lock()
            .map_err(|_| anyhow::anyhow!("Chat is busy"))?;
        self.touch().await;
        self.ensure_running().await
    }

    pub async fn stop(&self) -> anyhow::Result<()> {
        let _guard = self
            .turn_guard
            .try_lock()
            .map_err(|_| anyhow::anyhow!("Cancel the active turn before stopping"))?;
        self.shutdown().await;
        Ok(())
    }

    pub async fn edit_metadata(
        &self,
        title: Option<String>,
        archived: Option<bool>,
        policy: Option<crate::acp::callbacks::CallbackPolicy>,
    ) -> anyhow::Result<crate::store::Chat> {
        let _guard = self.turn_guard.try_lock().map_err(|_| {
            anyhow::anyhow!("Wait for or cancel the active turn before editing the chat")
        })?;
        let store = self
            .store
            .as_ref()
            .ok_or_else(|| anyhow::anyhow!("Chat is not persistent"))?;
        let c = store.update_chat(&self.id, |c| {
            if let Some(title) = title {
                c.title = title;
                c.title_overridden = true;
            }
            if let Some(archived) = archived {
                c.archived = archived;
            }
            if let Some(policy) = policy {
                c.permission_policy = policy;
            }
        })?;
        if let Some(client) = self.client.read().await.as_ref() {
            client
                .callback_handler()
                .set_policy(c.permission_policy.clone());
        }
        Ok(c)
    }

    pub async fn delete_metadata(&self) -> anyhow::Result<()> {
        let _guard = self
            .turn_guard
            .try_lock()
            .map_err(|_| anyhow::anyhow!("Cancel the active turn before deleting the chat"))?;
        let store = self
            .store
            .as_ref()
            .ok_or_else(|| anyhow::anyhow!("Chat is not persistent"))?;

        // Read and validate the workspace while the deletion guard is held.
        // In particular, an unreadable workspace row must not fall through to
        // the legacy/no-workspace path.
        let chat = store.chat(&self.id)?;
        let project = store.project(&chat.project_id)?;
        let workspace = store.workspace(&chat.id)?;
        let managed_cleanup = match workspace {
            None => None,
            Some(workspace) => {
                anyhow::ensure!(
                    workspace.chat_id == chat.id && workspace.project_id == chat.project_id,
                    "chat workspace metadata does not belong to this chat"
                );
                match workspace.mode {
                    WorkspaceMode::ManagedWorktree => {
                        let state_worktrees = store.worktrees_dir();
                        let chat_for_validation = chat.clone();
                        let project_for_validation = project.clone();
                        let workspace_for_validation = workspace.clone();
                        Some(
                            tokio::task::spawn_blocking(move || {
                                prepare_managed_deletion(
                                    &chat_for_validation,
                                    &project_for_validation,
                                    &workspace_for_validation,
                                    &state_worktrees,
                                )
                            })
                            .await??,
                        )
                    }
                    // A direct checkout is user-owned. Its metadata is
                    // removed below, but no Git command is allowed here.
                    WorkspaceMode::ProjectCheckout => None,
                }
            }
        };

        self.shutdown().await;

        if let Some((repository_root, worktree_root)) = managed_cleanup {
            let chat_id = chat.id.clone();
            tokio::task::spawn_blocking(move || {
                workspace::remove_managed(&repository_root, &worktree_root, &chat_id)
            })
            .await??;
        }

        // This is deliberately after managed cleanup. If the transaction
        // fails, the workspace row and branch remain available for a safe
        // retry/recovery; no compensating Git cleanup is attempted.
        store.delete_chat(&self.id)?;
        Ok(())
    }

    pub async fn cancel(&self) -> anyhow::Result<()> {
        let client = self
            .client
            .read()
            .await
            .clone()
            .ok_or_else(|| anyhow::anyhow!("Chat is stopped"))?;
        // Resolve callbacks before cancellation, so the prompt can finish.
        client
            .callback_handler()
            .pending_permissions
            .write()
            .await
            .clear();
        let sid = self
            .acp_session_id
            .read()
            .await
            .clone()
            .ok_or_else(|| anyhow::anyhow!("No ACP session"))?;
        client.cancel(&sid).await
    }

    pub async fn config_options(&self) -> serde_json::Value {
        if let Some(client) = self.client.read().await.as_ref() {
            client.config_options.read().await.clone()
        } else {
            serde_json::json!([])
        }
    }

    pub async fn set_config(
        &self,
        id: &str,
        value: serde_json::Value,
    ) -> anyhow::Result<serde_json::Value> {
        let _guard = self.turn_guard.try_lock().map_err(|_| {
            anyhow::anyhow!("Wait for the active turn before changing configuration")
        })?;
        self.ensure_running().await?;
        let client = self
            .client
            .read()
            .await
            .clone()
            .ok_or_else(|| anyhow::anyhow!("Chat is stopped"))?;
        let sid = self
            .acp_session_id
            .read()
            .await
            .clone()
            .ok_or_else(|| anyhow::anyhow!("No ACP session"))?;
        let options = tokio::time::timeout(
            Duration::from_secs(30),
            client.set_config(&sid, id, value.clone()),
        )
        .await??;
        if let Some(store) = &self.store {
            let authoritative = options
                .as_array()
                .and_then(|entries| entries.iter().find(|option| option["id"] == id))
                .and_then(|option| option.get("currentValue"))
                .cloned()
                .unwrap_or(value);
            store.update_chat(&self.id, |c| {
                c.config_values[id] = authoritative;
            })?;
        }
        self.touch().await;
        self.event_log.append(
            &self.id,
            &self.key.agent,
            EventPayload::ConfigOptions {
                options: options.clone(),
            },
        )?;
        Ok(options)
    }

    pub async fn list_remote_sessions(
        &self,
        cursor: Option<String>,
    ) -> anyhow::Result<serde_json::Value> {
        self.resume().await?;
        let client = self
            .client
            .read()
            .await
            .clone()
            .ok_or_else(|| anyhow::anyhow!("Chat is stopped"))?;
        tokio::time::timeout(
            Duration::from_secs(30),
            client.list_sessions(&self.key.cwd, cursor),
        )
        .await?
    }

    async fn try_sync_acp_title(&self, client: &Arc<AcpClient>) -> anyhow::Result<()> {
        if let Some(store) = &self.store {
            if let Ok(chat) = store.chat(&self.id) {
                if !chat.title_overridden && chat.title == "New chat" {
                    if let Ok(Ok(sessions_val)) = tokio::time::timeout(
                        Duration::from_secs(5),
                        client.list_sessions(&self.key.cwd, None),
                    )
                    .await
                    {
                        if let Some(sessions) =
                            sessions_val.get("sessions").and_then(|s| s.as_array())
                        {
                            if let Some(active_sid) = self.acp_session_id.read().await.as_ref() {
                                let active_str = active_sid.to_string();
                                for s_entry in sessions {
                                    if s_entry.get("sessionId").and_then(|v| v.as_str())
                                        == Some(&active_str)
                                    {
                                        if let Some(title) =
                                            s_entry.get("title").and_then(|v| v.as_str())
                                        {
                                            let trimmed = title.trim();
                                            if !trimmed.is_empty() && trimmed.len() <= 200 {
                                                let _ = store.update_chat(&self.id, |c| {
                                                    if !c.title_overridden {
                                                        c.title = trimmed.to_string();
                                                    }
                                                });
                                                self.event_log.append(
                                                    &self.id,
                                                    &self.key.agent,
                                                    EventPayload::MetadataChanged {},
                                                )?;
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        Ok(())
    }
}

/// Resolve a relative project subdirectory without allowing durable metadata
/// to redirect a session outside its checkout.
fn join_project_subdir(base: &Path, project_subdir: &str) -> anyhow::Result<PathBuf> {
    let subdir = Path::new(project_subdir);
    anyhow::ensure!(
        !subdir.is_absolute(),
        "workspace project subdirectory must be relative"
    );
    for component in subdir.components() {
        anyhow::ensure!(
            !matches!(component, Component::ParentDir | Component::Prefix(_)),
            "workspace project subdirectory escapes the checkout"
        );
    }
    Ok(base.join(subdir))
}

fn absolute_path(path: &Path) -> PathBuf {
    if path.is_absolute() {
        path.to_path_buf()
    } else {
        std::env::current_dir()
            .unwrap_or_else(|_| PathBuf::from("."))
            .join(path)
    }
}

fn checkout_key(path: &Path) -> PathBuf {
    let absolute = absolute_path(path);
    absolute.canonicalize().unwrap_or(absolute)
}

fn persistent_session_paths(
    store: &crate::store::Store,
    chat: &Chat,
    project: &Project,
    workspace: Option<&ChatWorkspace>,
    legacy_repository_root: Option<&Path>,
) -> (PathBuf, Option<PathBuf>) {
    match workspace {
        Some(workspace) if workspace.mode == WorkspaceMode::ManagedWorktree => {
            // Use the deterministic location even when the row is corrupt. A
            // startup validation failure must never cause ACP to follow the
            // arbitrary managed path stored in the database.
            let worktree = store.worktrees_dir().join(&chat.id);
            let cwd = join_project_subdir(&worktree, &workspace.project_subdir)
                .unwrap_or_else(|_| project.path.clone().into());
            (cwd, None)
        }
        Some(workspace) if workspace.mode == WorkspaceMode::ProjectCheckout => {
            let checkout = PathBuf::from(&workspace.workspace_path);
            let cwd = join_project_subdir(&checkout, &workspace.project_subdir)
                .unwrap_or_else(|_| project.path.clone().into());
            (
                cwd,
                Some(checkout_key(Path::new(&workspace.repository_root))),
            )
        }
        Some(_) | None => {
            let cwd = PathBuf::from(&project.path);
            let checkout = legacy_repository_root.unwrap_or(&cwd);
            let checkout = checkout_key(checkout);
            (cwd, Some(checkout))
        }
    }
}

fn ensure_cwd_inside_checkout(base: &Path, project_subdir: &str) -> anyhow::Result<PathBuf> {
    let cwd = join_project_subdir(base, project_subdir)?;
    let canonical_base = base
        .canonicalize()
        .map_err(|e| anyhow::anyhow!("cannot validate checkout path {}: {e}", base.display()))?;
    let canonical_cwd = cwd.canonicalize().map_err(|e| {
        anyhow::anyhow!(
            "effective workspace directory {} does not exist: {e}",
            cwd.display()
        )
    })?;
    anyhow::ensure!(
        canonical_cwd.starts_with(&canonical_base),
        "effective workspace directory escapes the checkout"
    );
    anyhow::ensure!(
        canonical_cwd.is_dir(),
        "effective workspace directory is not a directory"
    );
    Ok(cwd)
}

fn ensure_same_path(left: &Path, right: &Path, message: &str) -> anyhow::Result<()> {
    let left = left
        .canonicalize()
        .map_err(|e| anyhow::anyhow!("cannot validate path {}: {e}", left.display()))?;
    let right = right
        .canonicalize()
        .map_err(|e| anyhow::anyhow!("cannot validate path {}: {e}", right.display()))?;
    anyhow::ensure!(left == right, "{message}");
    Ok(())
}

fn validate_project_subdir(
    project: &Project,
    repository_root: &Path,
    project_subdir: &str,
) -> anyhow::Result<()> {
    let effective = ensure_cwd_inside_checkout(repository_root, project_subdir)?;
    ensure_same_path(
        &effective,
        Path::new(&project.path),
        "workspace project subdirectory does not match the registered project",
    )
}

fn validate_persistent_workspace(
    chat: &Chat,
    project: &Project,
    workspace: Option<&ChatWorkspace>,
    state_worktrees: &Path,
    key_cwd: &Path,
) -> anyhow::Result<()> {
    let Some(workspace) = workspace else {
        // Keep the pre-workspace behavior for chats created by older builds.
        anyhow::ensure!(
            Path::new(&project.path).canonicalize()? == key_cwd,
            "Project directory changed; review the project path"
        );
        return Ok(());
    };

    anyhow::ensure!(
        workspace.chat_id == chat.id && workspace.project_id == chat.project_id,
        "chat workspace metadata does not belong to this chat"
    );

    match workspace.mode {
        WorkspaceMode::ManagedWorktree => {
            let expected_worktree = state_worktrees.join(&chat.id);
            anyhow::ensure!(
                Path::new(&workspace.workspace_path) == expected_worktree,
                "managed workspace path is not Agent Hub's deterministic worktree"
            );

            let info = workspace::inspect(Path::new(&project.path))
                .map_err(|e| anyhow::anyhow!("cannot validate managed repository: {e}"))?;
            let repository_root = info
                .root
                .filter(|_| info.is_git)
                .ok_or_else(|| anyhow::anyhow!("managed workspace repository no longer exists"))?;
            ensure_same_path(
                &repository_root,
                Path::new(&workspace.repository_root),
                "managed workspace repository mismatch",
            )?;
            validate_project_subdir(project, &repository_root, &workspace.project_subdir)?;

            let expected_branch = format!("{}{}", workspace::MANAGED_PREFIX, chat.id);
            anyhow::ensure!(
                workspace.branch.as_deref() == Some(expected_branch.as_str()),
                "managed workspace branch metadata is invalid"
            );
            workspace::recover_managed(&repository_root, state_worktrees, &chat.id)
                .map_err(|e| anyhow::anyhow!("managed workspace recovery failed: {e}"))?;
            let effective =
                ensure_cwd_inside_checkout(&expected_worktree, &workspace.project_subdir)?;
            ensure_same_path(
                &effective,
                key_cwd,
                "persistent session workspace changed; reconnect to refresh it",
            )?;
        }
        WorkspaceMode::ProjectCheckout => {
            let registered_info = workspace::inspect(Path::new(&project.path))
                .map_err(|e| anyhow::anyhow!("cannot validate project repository: {e}"))?;
            let registered_root = registered_info
                .root
                .filter(|_| registered_info.is_git)
                .ok_or_else(|| {
                    anyhow::anyhow!("registered project is no longer a Git repository")
                })?;
            ensure_same_path(
                &registered_root,
                Path::new(&workspace.repository_root),
                "direct workspace repository does not match the registered project",
            )?;
            let checkout = Path::new(&workspace.workspace_path);
            ensure_same_path(
                checkout,
                &registered_root,
                "direct workspace is not the primary repository checkout",
            )?;
            let branch = workspace
                .branch
                .as_deref()
                .ok_or_else(|| anyhow::anyhow!("direct workspace has no persisted branch"))?;
            workspace::validate_direct(checkout, Path::new(&workspace.repository_root), branch)
                .map_err(|e| anyhow::anyhow!("direct workspace validation failed: {e}"))?;
            validate_project_subdir(project, &registered_root, &workspace.project_subdir)?;
            let effective = ensure_cwd_inside_checkout(checkout, &workspace.project_subdir)?;
            ensure_same_path(
                &effective,
                key_cwd,
                "persistent session workspace changed; reconnect to refresh it",
            )?;
        }
    }
    Ok(())
}

/// Validate the durable identity used by managed-chat deletion and return
/// only paths derived from the registered project and Hub state. The
/// persisted repository/worktree fields are checked, never used as command
/// inputs.
fn prepare_managed_deletion(
    chat: &Chat,
    project: &Project,
    workspace: &ChatWorkspace,
    state_worktrees: &Path,
) -> anyhow::Result<(PathBuf, PathBuf)> {
    let expected_worktree = state_worktrees.join(&chat.id);
    anyhow::ensure!(
        Path::new(&workspace.workspace_path) == expected_worktree,
        "managed workspace path is not Agent Hub's deterministic worktree"
    );

    let info = workspace::inspect(Path::new(&project.path))
        .map_err(|_| anyhow::anyhow!("registered project is not a usable Git repository"))?;
    let repository_root = info
        .root
        .filter(|_| info.is_git)
        .ok_or_else(|| anyhow::anyhow!("registered project is not a Git repository"))?;
    let persisted_repository = Path::new(&workspace.repository_root)
        .canonicalize()
        .map_err(|_| anyhow::anyhow!("managed workspace repository metadata is unreadable"))?;
    anyhow::ensure!(
        persisted_repository == repository_root,
        "managed workspace repository does not match the registered project"
    );

    let registered_project = Path::new(&project.path)
        .canonicalize()
        .map_err(|_| anyhow::anyhow!("registered project path is unreadable"))?;
    let project_subdir = registered_project
        .strip_prefix(&repository_root)
        .map_err(|_| anyhow::anyhow!("registered project is outside its Git repository"))?;
    anyhow::ensure!(
        Path::new(&workspace.project_subdir) == project_subdir,
        "managed workspace project metadata does not match the registered project"
    );

    let expected_branch = format!("{}{}", workspace::MANAGED_PREFIX, chat.id);
    anyhow::ensure!(
        workspace.branch.as_deref() == Some(expected_branch.as_str()),
        "managed workspace branch metadata is invalid"
    );

    Ok((repository_root, state_worktrees.to_path_buf()))
}

enum PromptAttempt {
    Completed(anyhow::Result<PromptResponse>),
    TimedOut,
}

#[derive(Debug)]
struct PromptTimeout;

impl std::fmt::Display for PromptTimeout {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.write_str("Request timed out")
    }
}

impl std::error::Error for PromptTimeout {}

fn stop_reason_to_string(stop_reason: StopReason) -> String {
    serde_json::to_value(stop_reason)
        .ok()
        .and_then(|value| value.as_str().map(ToOwned::to_owned))
        .unwrap_or_else(|| "unknown".to_string())
}

pub struct SessionManager {
    sessions: RwLock<HashMap<String, Arc<AcpSession>>>,
    sessions_by_id: RwLock<HashMap<String, Arc<AcpSession>>>,
    agents: Arc<AgentRegistry>,
    event_log: Arc<EventLog>,
    checkout_guards: StdMutex<HashMap<PathBuf, Arc<Mutex<()>>>>,
    pub store: Option<Arc<crate::store::Store>>,
}

impl SessionManager {
    pub fn new(agents: Arc<AgentRegistry>, event_log: Arc<EventLog>) -> Arc<Self> {
        Self::with_store(agents, event_log, None)
    }

    pub fn with_store(
        agents: Arc<AgentRegistry>,
        event_log: Arc<EventLog>,
        store: Option<Arc<crate::store::Store>>,
    ) -> Arc<Self> {
        let mgr = Arc::new(Self {
            store,
            sessions: RwLock::new(HashMap::new()),
            sessions_by_id: RwLock::new(HashMap::new()),
            agents,
            event_log,
            checkout_guards: StdMutex::new(HashMap::new()),
        });

        let weak = Arc::downgrade(&mgr);
        tokio::spawn(async move {
            loop {
                tokio::time::sleep(Duration::from_secs(60)).await;
                let Some(mgr) = weak.upgrade() else { break };
                mgr.reap_idle().await;
            }
        });

        mgr
    }

    pub async fn get_or_create(&self, agent: &str, cwd: &Path) -> anyhow::Result<Arc<AcpSession>> {
        anyhow::ensure!(
            self.store.is_none(),
            "Persistent sessions must be looked up by chat ID"
        );
        let key = SessionKey {
            agent: agent.to_string(),
            cwd: cwd.to_path_buf(),
        };

        {
            let sessions = self.sessions.read().await;
            if let Some(s) = sessions.values().find(|s| s.key == key) {
                return Ok(s.clone());
            }
        }

        let runtime = self
            .agents
            .runtime(agent)
            .ok_or_else(|| anyhow::anyhow!("Unknown agent: {}", agent))?;

        let mut sessions = self.sessions.write().await;
        if let Some(session) = sessions.values().find(|s| s.key == key) {
            return Ok(session.clone());
        }

        let session = Arc::new(AcpSession::new(
            key.clone(),
            runtime,
            self.event_log.clone(),
            None,
        ));
        let mut by_id = self.sessions_by_id.write().await;
        sessions.insert(session.id.clone(), session.clone());
        by_id.insert(session.id.clone(), session.clone());

        Ok(session)
    }

    pub async fn get_by_id(&self, session_id: &str) -> Option<Arc<AcpSession>> {
        {
            let sessions = self.sessions.read().await;
            if let Some(session) = sessions.get(session_id) {
                return Some(session.clone());
            }
        }
        let store = self.store.as_ref()?;
        let chat = store.chat(session_id).ok()?;
        let project = store.project(&chat.project_id).ok()?;
        let runtime = self.agents.runtime(&chat.agent)?;
        let workspace = match store.workspace(&chat.id) {
            Ok(workspace) => workspace,
            Err(error) => {
                tracing::error!(
                    session_id,
                    %error,
                    "Cannot reconstruct persistent session: workspace metadata is unreadable"
                );
                return None;
            }
        };
        let legacy_project_path = (workspace.is_none()).then(|| project.path.clone());
        let legacy_repository_root = if let Some(path) = legacy_project_path {
            tokio::task::spawn_blocking(move || workspace::inspect(Path::new(&path)))
                .await
                .ok()
                .and_then(Result::ok)
                .and_then(|info| info.is_git.then_some(info.root).flatten())
        } else {
            None
        };
        let (cwd, checkout_key) = persistent_session_paths(
            store,
            &chat,
            &project,
            workspace.as_ref(),
            legacy_repository_root.as_deref(),
        );
        let checkout_guard = checkout_key.map(|key| self.checkout_guard(key));
        let mut session = AcpSession::new(
            SessionKey {
                agent: chat.agent,
                cwd,
            },
            runtime,
            self.event_log.clone(),
            checkout_guard,
        );
        session.id = chat.id;
        session.store = Some(store.clone());
        *session.acp_session_id.get_mut() = chat.acp_session_id.map(Into::into);
        let session = Arc::new(session);
        let mut sessions = self.sessions.write().await;
        if let Some(existing) = sessions.get(session_id) {
            return Some(existing.clone());
        }
        sessions.insert(session.id.clone(), session.clone());
        Some(session)
    }

    fn checkout_guard(&self, key: PathBuf) -> Arc<Mutex<()>> {
        let mut guards = self
            .checkout_guards
            .lock()
            .expect("checkout guard map poisoned");
        guards
            .entry(key)
            .or_insert_with(|| Arc::new(Mutex::new(())))
            .clone()
    }

    /// Try to reserve the shared mutex for a primary Git checkout.
    ///
    /// Direct and legacy turns use this same map and key, so callers that
    /// mutate the checkout can fail without waiting for an agent turn.
    pub fn try_acquire_checkout_guard(
        &self,
        repository_root: &Path,
    ) -> anyhow::Result<OwnedMutexGuard<()>> {
        self.checkout_guard(checkout_key(repository_root))
            .try_lock_owned()
            .map_err(|_| {
                anyhow::anyhow!("Another chat is already working in this project checkout")
            })
    }

    pub async fn list_sessions(&self) -> Vec<crate::web::SessionInfo> {
        let sessions: Vec<(String, Arc<AcpSession>)> = self
            .sessions
            .read()
            .await
            .iter()
            .map(|(key, session)| (key.clone(), session.clone()))
            .collect();
        let mut result = Vec::new();
        for (_key, session) in sessions {
            let ps = session.process_state().await;
            let ts = session.turn_state().await;
            result.push(crate::web::SessionInfo {
                id: session.id.clone(),
                agent: session.key.agent.clone(),
                cwd: session.key.cwd.to_string_lossy().to_string(),
                process_state: ps.to_string(),
                turn_state: ts.to_string(),
            });
        }
        result
    }

    pub async fn get_all_status(&self) -> Vec<(String, ProcessState, TurnState)> {
        let sessions: Vec<(String, Arc<AcpSession>)> = self
            .sessions
            .read()
            .await
            .iter()
            .map(|(key, session)| (key.clone(), session.clone()))
            .collect();
        let mut result = Vec::new();
        for (_key, session) in sessions {
            let ps = session.process_state().await;
            let ts = session.turn_state().await;
            result.push((session.key.agent.clone(), ps, ts));
        }
        result
    }

    pub async fn shutdown_all(&self) {
        let sessions = {
            let mut sessions = self.sessions.write().await;
            let drained = sessions
                .drain()
                .map(|(_, session)| session)
                .collect::<Vec<_>>();
            self.sessions_by_id.write().await.clear();
            drained
        };

        for session in sessions {
            session.shutdown().await;
        }
    }

    pub async fn reap_idle(&self) {
        let sessions: Vec<(String, Arc<AcpSession>)> = self
            .sessions
            .read()
            .await
            .iter()
            .map(|(key, session)| (key.clone(), session.clone()))
            .collect();
        let mut to_reap = Vec::new();

        for (key, session) in sessions {
            let ps = session.process_state().await;
            if ps != ProcessState::Running {
                continue;
            }
            let ts = session.turn_state().await;
            if ts != TurnState::Idle {
                continue;
            }
            if !session.supports_resume().await {
                continue;
            }
            let elapsed = session.last_activity().await.elapsed();
            if elapsed > session.runtime.launch.idle_timeout {
                to_reap.push(key.clone());
            }
        }

        for key in to_reap {
            if let Some(session) = self.get_by_id(&key).await {
                if let Ok(_guard) = session.turn_guard.try_lock() {
                    if session.last_activity().await.elapsed() > session.runtime.launch.idle_timeout
                    {
                        session.shutdown().await;
                    }
                }
            }
        }
    }

    pub fn event_log(&self) -> &Arc<EventLog> {
        &self.event_log
    }

    pub fn has_agent(&self, name: &str) -> bool {
        self.agents.contains(name)
    }

    pub async fn remove_session(&self, key: &str) -> Option<Arc<AcpSession>> {
        let session = self.sessions.write().await.remove(key);
        if let Some(session) = &session {
            self.sessions_by_id.write().await.remove(&session.id);
        }
        session
    }
}
