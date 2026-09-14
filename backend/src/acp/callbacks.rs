use ::agent_client_protocol_schema::v1 as agent_client_protocol_schema;
use agent_client_protocol_schema::{
    CreateTerminalRequest, CreateTerminalResponse, KillTerminalRequest, KillTerminalResponse,
    PermissionOptionId, ReadTextFileRequest, ReadTextFileResponse, ReleaseTerminalRequest,
    ReleaseTerminalResponse, RequestPermissionOutcome, RequestPermissionRequest,
    RequestPermissionResponse, SelectedPermissionOutcome, TerminalOutputRequest,
    TerminalOutputResponse, WaitForTerminalExitRequest, WaitForTerminalExitResponse,
    WriteTextFileRequest, WriteTextFileResponse,
};
use clap::ValueEnum;
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use std::path::PathBuf;
use std::sync::Arc;
use tokio::io::AsyncReadExt;
use tokio::sync::{oneshot, RwLock};

use super::process::AcpProcess;
use crate::events::{EventLog, EventPayload};
use crate::tasks::{ManagedTask, TerminalTaskTracker};

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq, Eq, ValueEnum)]
#[serde(rename_all = "kebab-case")]
pub enum CallbackPolicy {
    DenyAll,
    ReadOnly,
    #[default]
    Ask,
    AutoApprove,
}

pub struct PendingPermission {
    pub tx: oneshot::Sender<bool>,
}

pub struct CallbackHandler {
    policy: std::sync::RwLock<CallbackPolicy>,
    session_id: String,
    agent_name: String,
    event_log: Arc<EventLog>,
    cwd: PathBuf,
    base_env: Arc<HashMap<String, String>>,
    pub pending_permissions: Arc<RwLock<HashMap<String, PendingPermission>>>,
    task_tracker: Arc<TerminalTaskTracker>,
    active_terminals: Arc<RwLock<HashSet<String>>>,
}

impl CallbackHandler {
    fn policy(&self) -> CallbackPolicy {
        self.policy.read().unwrap().clone()
    }
    pub fn set_policy(&self, policy: CallbackPolicy) {
        *self.policy.write().unwrap() = policy;
    }
    pub fn new(
        policy: CallbackPolicy,
        session_id: String,
        agent_name: String,
        event_log: Arc<EventLog>,
        cwd: PathBuf,
        base_env: Arc<HashMap<String, String>>,
        task_tracker: Arc<TerminalTaskTracker>,
    ) -> Self {
        Self {
            policy: std::sync::RwLock::new(policy),
            session_id,
            agent_name,
            event_log,
            cwd,
            base_env,
            pending_permissions: Arc::new(RwLock::new(HashMap::new())),
            task_tracker,
            active_terminals: Arc::new(RwLock::new(HashSet::new())),
        }
    }

    fn resolve_path(
        &self,
        path: &std::path::Path,
        allow_missing_leaf: bool,
    ) -> Result<PathBuf, agent_client_protocol_schema::Error> {
        let absolute = if path.is_absolute() {
            path.to_path_buf()
        } else {
            self.cwd.join(path)
        };

        let canonical = if allow_missing_leaf && !absolute.exists() {
            let parent = absolute.parent().ok_or_else(|| {
                agent_client_protocol_schema::Error::new(-32002, "Path has no parent")
            })?;
            let canonical_parent = parent.canonicalize().map_err(|e| {
                agent_client_protocol_schema::Error::new(
                    -32002,
                    format!("Path canonicalization failed: {}", e),
                )
            })?;
            let leaf = absolute.file_name().ok_or_else(|| {
                agent_client_protocol_schema::Error::new(-32002, "Path has no leaf")
            })?;
            canonical_parent.join(leaf)
        } else {
            absolute.canonicalize().map_err(|e| {
                agent_client_protocol_schema::Error::new(
                    -32002,
                    format!("Path canonicalization failed: {}", e),
                )
            })?
        };

        self.validate_path(&canonical, allow_missing_leaf)?;
        Ok(canonical)
    }

    fn validate_path(
        &self,
        path: &std::path::Path,
        allow_missing_leaf: bool,
    ) -> Result<(), agent_client_protocol_schema::Error> {
        let canonical_cwd = self.cwd.canonicalize().map_err(|e| {
            agent_client_protocol_schema::Error::new(
                -32002,
                format!("Failed to canonicalize cwd: {}", e),
            )
        })?;

        let canonical_target = if allow_missing_leaf && !path.exists() {
            let parent = path.parent().ok_or_else(|| {
                agent_client_protocol_schema::Error::new(-32002, "Path has no parent")
            })?;
            let canonical_parent = parent.canonicalize().map_err(|e| {
                agent_client_protocol_schema::Error::new(
                    -32002,
                    format!("Path canonicalization failed: {}", e),
                )
            })?;
            let leaf = path.file_name().ok_or_else(|| {
                agent_client_protocol_schema::Error::new(-32002, "Path has no leaf")
            })?;
            canonical_parent.join(leaf)
        } else {
            path.canonicalize().map_err(|e| {
                agent_client_protocol_schema::Error::new(
                    -32002,
                    format!("Path canonicalization failed: {}", e),
                )
            })?
        };

        if !canonical_target.starts_with(&canonical_cwd) {
            return Err(agent_client_protocol_schema::Error::new(
                -32003,
                format!(
                    "Path {} is outside allowed workspace {}",
                    path.display(),
                    self.cwd.display()
                ),
            ));
        }

        Ok(())
    }

    async fn get_terminal(
        &self,
        terminal_id: &agent_client_protocol_schema::TerminalId,
    ) -> agent_client_protocol_schema::Result<Arc<ManagedTask>> {
        if !self
            .active_terminals
            .read()
            .await
            .contains(terminal_id.0.as_ref())
        {
            return Err(agent_client_protocol_schema::Error::new(
                -32004,
                "Terminal not found",
            ));
        }
        self.task_tracker
            .get_task(terminal_id.0.as_ref())
            .await
            .ok_or_else(|| agent_client_protocol_schema::Error::new(-32004, "Terminal not found"))
    }

    async fn request_user_permission(
        &self,
        tool_name: &str,
        description: String,
        title: Option<String>,
        kind: Option<String>,
    ) -> bool {
        let (tx, rx) = oneshot::channel();
        let perm_id = uuid::Uuid::new_v4().to_string();

        self.pending_permissions
            .write()
            .await
            .insert(perm_id.clone(), PendingPermission { tx });

        if let Err(e) = self.event_log.append(
            &self.session_id,
            &self.agent_name,
            EventPayload::PermissionRequest {
                id: perm_id.clone(),
                method: tool_name.to_string(),
                description,
                title,
                kind,
            },
        ) {
            tracing::error!("Failed to emit PermissionRequest event: {}", e);
            self.pending_permissions.write().await.remove(&perm_id);
            return false;
        }

        rx.await.unwrap_or(false)
    }

    async fn with_write_permission(
        &self,
        tool_name: &str,
        description: String,
    ) -> agent_client_protocol_schema::Result<()> {
        match self.policy() {
            CallbackPolicy::DenyAll => Err(agent_client_protocol_schema::Error::new(
                -32001,
                "Permission denied by policy",
            )),
            CallbackPolicy::ReadOnly => Err(agent_client_protocol_schema::Error::new(
                -32001,
                "Write operations not allowed in ReadOnly mode",
            )),
            CallbackPolicy::Ask => {
                let granted = self
                    .request_user_permission(tool_name, description, None, None)
                    .await;
                if granted {
                    Ok(())
                } else {
                    Err(agent_client_protocol_schema::Error::new(
                        -32001,
                        "Permission denied by user",
                    ))
                }
            }
            CallbackPolicy::AutoApprove => Ok(()),
        }
    }

    pub async fn handle_request_permission(
        &self,
        req: RequestPermissionRequest,
    ) -> RequestPermissionResponse {
        let make_response = |option_id: PermissionOptionId| {
            RequestPermissionResponse::new(RequestPermissionOutcome::Selected(
                SelectedPermissionOutcome::new(option_id),
            ))
        };

        let deny_option = req
            .options
            .iter()
            .find(|o| {
                matches!(
                    o.kind,
                    agent_client_protocol_schema::PermissionOptionKind::RejectOnce
                )
            })
            .or_else(|| {
                req.options.iter().find(|o| {
                    matches!(
                        o.kind,
                        agent_client_protocol_schema::PermissionOptionKind::RejectAlways
                    )
                })
            })
            .map(|o| o.option_id.clone());

        let approve_option = req
            .options
            .iter()
            .find(|o| {
                matches!(
                    o.kind,
                    agent_client_protocol_schema::PermissionOptionKind::AllowOnce
                )
            })
            .or_else(|| {
                req.options.iter().find(|o| {
                    matches!(
                        o.kind,
                        agent_client_protocol_schema::PermissionOptionKind::AllowAlways
                    )
                })
            })
            .map(|o| o.option_id.clone());

        match self.policy() {
            CallbackPolicy::DenyAll => {
                if let Some(deny_id) = deny_option {
                    make_response(deny_id)
                } else {
                    RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled)
                }
            }
            CallbackPolicy::ReadOnly => {
                if let Some(deny_id) = deny_option {
                    make_response(deny_id)
                } else {
                    RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled)
                }
            }
            CallbackPolicy::Ask => {
                let (title, description, kind) = format_permission_tool_call(&req.tool_call);
                let granted = self
                    .request_user_permission("session/request_permission", description, title, kind)
                    .await;

                if granted {
                    if let Some(approve_id) = approve_option {
                        make_response(approve_id)
                    } else {
                        RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled)
                    }
                } else if let Some(deny_id) = deny_option {
                    make_response(deny_id)
                } else {
                    RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled)
                }
            }
            CallbackPolicy::AutoApprove => {
                if let Some(approve_id) = approve_option {
                    make_response(approve_id)
                } else if let Some(first) = req.options.first() {
                    make_response(first.option_id.clone())
                } else {
                    RequestPermissionResponse::new(RequestPermissionOutcome::Cancelled)
                }
            }
        }
    }

    pub async fn handle_read_file(
        &self,
        req: ReadTextFileRequest,
    ) -> agent_client_protocol_schema::Result<ReadTextFileResponse> {
        match self.policy() {
            CallbackPolicy::DenyAll => Err(agent_client_protocol_schema::Error::new(
                -32001,
                "File read denied by policy",
            )),
            _ => {
                let path = self.resolve_path(&req.path, false)?;
                let content = tokio::fs::read_to_string(&path).await.map_err(|e| {
                    agent_client_protocol_schema::Error::new(-32002, format!("Read failed: {}", e))
                })?;
                Ok(ReadTextFileResponse::new(content))
            }
        }
    }

    pub async fn handle_write_file(
        &self,
        req: WriteTextFileRequest,
    ) -> agent_client_protocol_schema::Result<WriteTextFileResponse> {
        let path = self.resolve_path(&req.path, true)?;
        self.with_write_permission("fs/write_text_file", format!("Write to {}", path.display()))
            .await?;
        tokio::fs::write(&path, &req.content).await.map_err(|e| {
            agent_client_protocol_schema::Error::new(-32002, format!("Write failed: {}", e))
        })?;
        Ok(WriteTextFileResponse::new())
    }

    pub async fn handle_create_terminal(
        &self,
        req: CreateTerminalRequest,
    ) -> agent_client_protocol_schema::Result<CreateTerminalResponse> {
        self.with_write_permission(
            "terminal/create",
            format!("Execute {} {:?}", req.command, req.args),
        )
        .await?;

        let cwd = match req.cwd.as_ref() {
            Some(cwd) => self.resolve_path(cwd, false)?,
            None => self.cwd.clone(),
        };
        self.validate_path(&cwd, false)?;

        let env = crate::workspace_env::merge_terminal_env(&self.base_env, &req.env);
        let process = AcpProcess::spawn(&req.command, &req.args, &env, &cwd).map_err(|e| {
            agent_client_protocol_schema::Error::new(
                -32002,
                format!("Terminal spawn failed: {}", e),
            )
        })?;

        let terminal_id = uuid::Uuid::new_v4().to_string();
        let cmd_summary = if req.args.is_empty() {
            req.command.clone()
        } else {
            format!("{} {}", req.command, req.args.join(" "))
        };
        let task = Arc::new(ManagedTask::new(
            terminal_id.clone(),
            self.session_id.clone(),
            cmd_summary,
            cwd.clone(),
            req.output_byte_limit,
        ));

        let stdout = process.stdout;
        let stderr = process.stderr;
        drop(process.stdin);
        let (kill_tx, kill_rx) = oneshot::channel();
        *task.kill_tx.lock().unwrap() = Some(kill_tx);

        self.task_tracker.register_task(task.clone()).await;
        self.active_terminals
            .write()
            .await
            .insert(terminal_id.clone());

        let drain_handles = vec![
            tokio::spawn(drain_terminal_stream(stdout, task.clone())),
            tokio::spawn(drain_terminal_stream(stderr, task.clone())),
        ];
        tokio::spawn(supervise_terminal(
            process.child,
            task,
            kill_rx,
            drain_handles,
            self.event_log.clone(),
        ));
        let _ = self
            .event_log
            .append("", "", EventPayload::MetadataChanged {});

        Ok(CreateTerminalResponse::new(terminal_id))
    }

    pub async fn handle_terminal_output(
        &self,
        req: TerminalOutputRequest,
    ) -> agent_client_protocol_schema::Result<TerminalOutputResponse> {
        let task = self.get_terminal(&req.terminal_id).await?;
        let buffer = task.buffer.read().await;
        let exit_status = task.exit_status.read().await.clone();
        Ok(
            TerminalOutputResponse::new(buffer.output.clone(), buffer.truncated)
                .exit_status(exit_status),
        )
    }

    pub async fn handle_release_terminal(
        &self,
        req: ReleaseTerminalRequest,
    ) -> agent_client_protocol_schema::Result<ReleaseTerminalResponse> {
        let task = self.get_terminal(&req.terminal_id).await?;
        self.active_terminals
            .write()
            .await
            .remove(req.terminal_id.0.as_ref());
        task.stop();
        Ok(ReleaseTerminalResponse::new())
    }

    pub async fn handle_kill_terminal(
        &self,
        req: KillTerminalRequest,
    ) -> agent_client_protocol_schema::Result<KillTerminalResponse> {
        let task = self.get_terminal(&req.terminal_id).await?;
        task.stop();
        Ok(KillTerminalResponse::new())
    }

    pub async fn handle_wait_for_terminal_exit(
        &self,
        req: WaitForTerminalExitRequest,
    ) -> agent_client_protocol_schema::Result<WaitForTerminalExitResponse> {
        let task = self.get_terminal(&req.terminal_id).await?;
        loop {
            let notified = task.exit_notify.notified();
            tokio::pin!(notified);
            notified.as_mut().enable();

            if let Some(exit_status) = task.exit_status.read().await.clone() {
                return Ok(WaitForTerminalExitResponse::new(exit_status));
            }
            notified.await;
        }
    }

    pub async fn respond_permission(&self, perm_id: &str, granted: bool) -> bool {
        let mut pending = self.pending_permissions.write().await;
        if let Some(p) = pending.remove(perm_id) {
            return p.tx.send(granted).is_ok();
        }
        false
    }

    pub async fn cancel_all_pending(&self) {
        let mut pending = self.pending_permissions.write().await;
        for (_, p) in pending.drain() {
            let _ = p.tx.send(false);
        }
    }

    pub async fn shutdown(&self) {
        self.cancel_all_pending().await;

        let active_ids: Vec<String> = self.active_terminals.write().await.drain().collect();
        for id in active_ids {
            if let Some(task) = self.task_tracker.get_task(&id).await {
                task.stop();
            }
        }
    }
}

async fn drain_terminal_stream<R>(mut reader: R, task: Arc<ManagedTask>)
where
    R: tokio::io::AsyncRead + Unpin + Send + 'static,
{
    let mut buf = [0_u8; 4096];
    let mut leftover = Vec::new();
    loop {
        match reader.read(&mut buf).await {
            Ok(0) => break,
            Ok(n) => {
                let data = if leftover.is_empty() {
                    &buf[..n]
                } else {
                    leftover.extend_from_slice(&buf[..n]);
                    leftover.as_slice()
                };

                let valid_len = match std::str::from_utf8(data) {
                    Ok(_) => data.len(),
                    Err(e) => e.valid_up_to(),
                };

                if valid_len > 0 {
                    let text = unsafe { std::str::from_utf8_unchecked(&data[..valid_len]) };
                    task.append_output(text).await;
                }

                let remaining = &data[valid_len..];
                if remaining.is_empty() {
                    leftover.clear();
                } else if remaining.len() >= 4 {
                    let chunk = String::from_utf8_lossy(remaining);
                    task.append_output(chunk.as_ref()).await;
                    leftover.clear();
                } else {
                    let saved = remaining.to_vec();
                    leftover.clear();
                    leftover = saved;
                }
            }
            Err(_) => break,
        }
    }

    if !leftover.is_empty() {
        let chunk = String::from_utf8_lossy(&leftover);
        task.append_output(chunk.as_ref()).await;
    }
}

async fn supervise_terminal(
    mut child: Box<dyn process_wrap::tokio::TokioChildWrapper>,
    task: Arc<ManagedTask>,
    mut kill_rx: oneshot::Receiver<()>,
    drain_handles: Vec<tokio::task::JoinHandle<()>>,
    event_log: Arc<crate::events::EventLog>,
) {
    let status = loop {
        tokio::select! {
            _ = &mut kill_rx => {
                let _ = child.start_kill();
            }
            _ = tokio::time::sleep(std::time::Duration::from_millis(50)) => {}
        }
        match child.try_wait() {
            Ok(Some(status)) => break Ok(status),
            Ok(None) => {}
            Err(error) => break Err(error),
        }
    };
    // The direct child may exit while descendants remain. Both ProcessGroup
    // and JobObject wrappers use this final kill/drop to reap the whole tree.
    let _ = child.start_kill();

    for handle in drain_handles {
        let _ = handle.await;
    }

    task.record_exit(status).await;
    let _ = event_log.append("", "", EventPayload::MetadataChanged {});
}

fn format_permission_tool_call(
    tool_call: &agent_client_protocol_schema::ToolCallUpdate,
) -> (Option<String>, String, Option<String>) {
    let kind_str = tool_call.fields.kind.map(|k| {
        serde_json::to_value(k)
            .ok()
            .and_then(|v| v.as_str().map(ToOwned::to_owned))
            .unwrap_or_else(|| format!("{:?}", k).to_lowercase())
    });
    let title_opt = tool_call.fields.title.clone();

    let is_plan = title_opt.as_deref() == Some("Approve Plan")
        || tool_call
            .meta
            .as_ref()
            .and_then(|m| serde_json::to_value(m).ok())
            .and_then(|v| {
                v.pointer("/claudeCode/toolName")
                    .and_then(|s| s.as_str())
                    .map(|s| s == "ExitPlanMode")
            })
            .unwrap_or(false)
        || tool_call
            .fields
            .raw_input
            .as_ref()
            .and_then(|i| i.get("plan"))
            .is_some();

    if is_plan {
        let plan_text = tool_call
            .fields
            .raw_input
            .as_ref()
            .and_then(|i| i.get("plan"))
            .and_then(|p| p.as_str())
            .map(|s| s.to_string())
            .or_else(|| {
                tool_call.fields.content.as_ref().and_then(|content| {
                    content.iter().find_map(|item| match item {
                        agent_client_protocol_schema::ToolCallContent::Content(c) => {
                            match &c.content {
                                agent_client_protocol_schema::ContentBlock::Text(t) => {
                                    Some(t.text.clone())
                                }
                                _ => None,
                            }
                        }
                        _ => None,
                    })
                })
            })
            .unwrap_or_else(|| "Plan ready for approval".to_string());

        return (
            Some("Approve Plan".to_string()),
            plan_text,
            Some("switch_mode".to_string()),
        );
    }

    let description = if let Some(raw_input) = &tool_call.fields.raw_input {
        if let Some(cmd) = raw_input.get("command").and_then(|c| c.as_str()) {
            format!("Execute command: {}", cmd)
        } else if let Some(path) = raw_input
            .get("file_path")
            .or_else(|| raw_input.get("path"))
            .and_then(|p| p.as_str())
        {
            format!("File: {}", path)
        } else if let Some(desc) = raw_input.get("description").and_then(|d| d.as_str()) {
            desc.to_string()
        } else {
            tool_call
                .fields
                .title
                .clone()
                .unwrap_or_else(|| "Action requested".to_string())
        }
    } else if let Some(content) = &tool_call.fields.content {
        let text_parts: Vec<String> = content
            .iter()
            .filter_map(|item| match item {
                agent_client_protocol_schema::ToolCallContent::Content(c) => match &c.content {
                    agent_client_protocol_schema::ContentBlock::Text(t) => Some(t.text.clone()),
                    _ => None,
                },
                _ => None,
            })
            .collect();
        if !text_parts.is_empty() {
            text_parts.join("\n")
        } else {
            tool_call
                .fields
                .title
                .clone()
                .unwrap_or_else(|| "Action requested".to_string())
        }
    } else {
        tool_call
            .fields
            .title
            .clone()
            .unwrap_or_else(|| "Action requested".to_string())
    };

    (title_opt, description, kind_str)
}

#[cfg(test)]
mod tests {
    use super::agent_client_protocol_schema::{
        CreateTerminalRequest, PermissionOption, ReleaseTerminalRequest,
        SessionId as SchemaSessionId, TerminalOutputRequest, WaitForTerminalExitRequest,
        WriteTextFileRequest,
    };
    use super::*;
    use std::sync::Arc;

    fn make_handler(policy: CallbackPolicy) -> CallbackHandler {
        let event_log = Arc::new(crate::events::EventLog::new(100));
        let tracker = Arc::new(TerminalTaskTracker::default());
        CallbackHandler::new(
            policy,
            "test-session".into(),
            "test-agent".into(),
            event_log,
            std::env::temp_dir(),
            Arc::new(std::env::vars().collect()),
            tracker,
        )
    }

    #[test]
    fn test_callback_policy_default() {
        assert_eq!(CallbackPolicy::default(), CallbackPolicy::Ask);
    }

    #[test]
    fn test_callback_policy_serde() {
        let json = serde_json::to_string(&CallbackPolicy::AutoApprove).unwrap();
        assert_eq!(json, "\"auto-approve\"");
        let parsed: CallbackPolicy = serde_json::from_str("\"deny-all\"").unwrap();
        assert_eq!(parsed, CallbackPolicy::DenyAll);
    }

    #[tokio::test]
    async fn test_deny_all_rejects_read() {
        let handler = make_handler(CallbackPolicy::DenyAll);
        let req = ReadTextFileRequest::new("s1", std::path::PathBuf::from("/nonexistent"));
        let result = handler.handle_read_file(req).await;
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_read_only_allows_read() {
        let handler = make_handler(CallbackPolicy::ReadOnly);
        let tmp = tempfile::NamedTempFile::new().unwrap();
        std::fs::write(tmp.path(), "hello").unwrap();
        let req = ReadTextFileRequest::new("s1", tmp.path().to_path_buf());
        let result = handler.handle_read_file(req).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap().content, "hello");
    }

    #[tokio::test]
    async fn test_read_only_rejects_write() {
        let handler = make_handler(CallbackPolicy::ReadOnly);
        let req = WriteTextFileRequest::new("s1", std::path::PathBuf::from("/tmp/test"), "data");
        let result = handler.handle_write_file(req).await;
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_auto_approve_allows_write() {
        let handler = make_handler(CallbackPolicy::AutoApprove);
        let tmp = tempfile::NamedTempFile::new().unwrap();
        let req = WriteTextFileRequest::new("s1", tmp.path().to_path_buf(), "written");
        let result = handler.handle_write_file(req).await;
        assert!(result.is_ok());
        let content = std::fs::read_to_string(tmp.path()).unwrap();
        assert_eq!(content, "written");
    }

    #[tokio::test]
    async fn test_auto_approve_allows_creating_new_file() {
        let temp = tempfile::tempdir().unwrap();
        let event_log = Arc::new(crate::events::EventLog::new(100));
        let tracker = Arc::new(TerminalTaskTracker::default());
        let handler = CallbackHandler::new(
            CallbackPolicy::AutoApprove,
            "test-session".into(),
            "test-agent".into(),
            event_log,
            temp.path().to_path_buf(),
            Arc::new(std::env::vars().collect()),
            tracker,
        );
        let target = temp.path().join("new-file.txt");

        let req = WriteTextFileRequest::new("s1", target.clone(), "created");
        handler.handle_write_file(req).await.unwrap();

        assert_eq!(std::fs::read_to_string(target).unwrap(), "created");
    }

    #[tokio::test]
    async fn test_auto_approve_prefers_allow_once_over_allow_always() {
        let handler = make_handler(CallbackPolicy::AutoApprove);

        let request = RequestPermissionRequest::new(
            SchemaSessionId::new("s1"),
            agent_client_protocol_schema::ToolCallUpdate::new(
                "tool-1",
                agent_client_protocol_schema::ToolCallUpdateFields::new(),
            ),
            vec![
                PermissionOption::new(
                    "allow-always",
                    "Always allow",
                    agent_client_protocol_schema::PermissionOptionKind::AllowAlways,
                ),
                PermissionOption::new(
                    "allow-once",
                    "Allow once",
                    agent_client_protocol_schema::PermissionOptionKind::AllowOnce,
                ),
            ],
        );

        let response = handler.handle_request_permission(request).await;
        match response.outcome {
            RequestPermissionOutcome::Selected(selected) => {
                assert_eq!(selected.option_id, "allow-once".into());
            }
            other => panic!("unexpected outcome: {:?}", other),
        }
    }

    #[tokio::test]
    async fn test_read_only_denies_permission_requests() {
        let event_log = Arc::new(crate::events::EventLog::new(100));
        let tracker = Arc::new(TerminalTaskTracker::default());
        let handler = CallbackHandler::new(
            CallbackPolicy::ReadOnly,
            "test-session".into(),
            "test-agent".into(),
            event_log,
            std::env::temp_dir(),
            Arc::new(std::env::vars().collect()),
            tracker,
        );

        let request = RequestPermissionRequest::new(
            SchemaSessionId::new("s1"),
            agent_client_protocol_schema::ToolCallUpdate::new(
                "tool-1",
                agent_client_protocol_schema::ToolCallUpdateFields::new(),
            ),
            vec![
                PermissionOption::new(
                    "allow-1",
                    "Allow once",
                    agent_client_protocol_schema::PermissionOptionKind::AllowOnce,
                ),
                PermissionOption::new(
                    "deny-1",
                    "Reject once",
                    agent_client_protocol_schema::PermissionOptionKind::RejectOnce,
                ),
            ],
        );

        let response = handler.handle_request_permission(request).await;
        match response.outcome {
            RequestPermissionOutcome::Selected(selected) => {
                assert_eq!(selected.option_id, "deny-1".into());
            }
            other => panic!("unexpected outcome: {:?}", other),
        }
    }

    #[tokio::test]
    async fn test_auto_approve_terminal_callbacks_work() {
        let handler = make_handler(CallbackPolicy::AutoApprove);
        let (command, args) = terminal_echo_command("hello-from-terminal");
        let create = CreateTerminalRequest::new("s1", command).args(args);
        let created = handler.handle_create_terminal(create).await.unwrap();

        let waited = handler
            .handle_wait_for_terminal_exit(WaitForTerminalExitRequest::new(
                "s1",
                created.terminal_id.clone(),
            ))
            .await
            .unwrap();
        assert_eq!(waited.exit_status.exit_code, Some(0));

        let output = handler
            .handle_terminal_output(TerminalOutputRequest::new(
                "s1",
                created.terminal_id.clone(),
            ))
            .await
            .unwrap();
        assert!(output.output.contains("hello-from-terminal"));

        handler
            .handle_release_terminal(ReleaseTerminalRequest::new("s1", created.terminal_id))
            .await
            .unwrap();
    }

    #[tokio::test]
    async fn test_terminal_output_is_truncated_to_limit() {
        let handler = make_handler(CallbackPolicy::AutoApprove);
        let (command, args) = terminal_echo_command("123456789");
        let create = CreateTerminalRequest::new("s1", command)
            .args(args)
            .output_byte_limit(5_u64);
        let created = handler.handle_create_terminal(create).await.unwrap();

        handler
            .handle_wait_for_terminal_exit(WaitForTerminalExitRequest::new(
                "s1",
                created.terminal_id.clone(),
            ))
            .await
            .unwrap();

        let output = handler
            .handle_terminal_output(TerminalOutputRequest::new(
                "s1",
                created.terminal_id.clone(),
            ))
            .await
            .unwrap();

        assert!(output.truncated);
        assert!(output.output.len() <= 5);
        assert!(output.output.contains("6789") || output.output.contains("789"));
    }

    #[tokio::test]
    async fn test_shutdown_releases_terminals() {
        let handler = make_handler(CallbackPolicy::AutoApprove);
        let (command, args) = terminal_echo_command("shutdown-check");
        let create = CreateTerminalRequest::new("s1", command).args(args);
        let created = handler.handle_create_terminal(create).await.unwrap();

        handler.shutdown().await;

        let result = handler
            .handle_terminal_output(TerminalOutputRequest::new("s1", created.terminal_id))
            .await;
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_respond_permission() {
        let handler = make_handler(CallbackPolicy::Ask);
        let (tx, rx) = tokio::sync::oneshot::channel();
        {
            let mut pending = handler.pending_permissions.write().await;
            pending.insert("perm-1".into(), PendingPermission { tx });
        }
        handler.respond_permission("perm-1", true).await;
        assert!(rx.await.unwrap());
    }

    #[tokio::test]
    async fn test_cancel_all_pending() {
        let handler = make_handler(CallbackPolicy::Ask);
        let (tx1, rx1) = tokio::sync::oneshot::channel();
        let (tx2, rx2) = tokio::sync::oneshot::channel();
        {
            let mut pending = handler.pending_permissions.write().await;
            pending.insert("p1".into(), PendingPermission { tx: tx1 });
            pending.insert("p2".into(), PendingPermission { tx: tx2 });
        }
        handler.cancel_all_pending().await;
        assert!(!rx1.await.unwrap());
        assert!(!rx2.await.unwrap());
        assert!(handler.pending_permissions.read().await.is_empty());
    }

    fn terminal_echo_command(message: &str) -> (String, Vec<String>) {
        if cfg!(windows) {
            (
                "cmd".to_string(),
                vec!["/C".to_string(), format!("echo {}", message)],
            )
        } else {
            (
                "sh".to_string(),
                vec!["-c".to_string(), format!("printf '{}\\n'", message)],
            )
        }
    }

    #[test]
    fn test_format_permission_tool_call_plan_mode() {
        use super::agent_client_protocol_schema::{
            ToolCallId, ToolCallUpdate, ToolCallUpdateFields,
        };
        let update = ToolCallUpdate::new(
            ToolCallId::new("call-1"),
            ToolCallUpdateFields::new()
                .title("Approve Plan".to_string())
                .raw_input(serde_json::json!({
                    "plan": "### Step 1: Fix bug\n### Step 2: Add test"
                })),
        );
        let (title, description, kind) = format_permission_tool_call(&update);
        assert_eq!(title, Some("Approve Plan".to_string()));
        assert_eq!(description, "### Step 1: Fix bug\n### Step 2: Add test");
        assert_eq!(kind, Some("switch_mode".to_string()));
    }

    #[test]
    fn test_format_permission_tool_call_command() {
        use super::agent_client_protocol_schema::{
            ToolCallId, ToolCallUpdate, ToolCallUpdateFields,
        };
        let update = ToolCallUpdate::new(
            ToolCallId::new("call-2"),
            ToolCallUpdateFields::new()
                .title("Run tests".to_string())
                .raw_input(serde_json::json!({
                    "command": "cargo test --all"
                })),
        );
        let (title, description, kind) = format_permission_tool_call(&update);
        assert_eq!(title, Some("Run tests".to_string()));
        assert_eq!(description, "Execute command: cargo test --all");
        assert!(kind.is_none());
    }

    #[cfg(target_os = "linux")]
    #[tokio::test]
    async fn releasing_terminal_reaps_descendants() {
        let temp = tempfile::tempdir().unwrap();
        let tracker = Arc::new(TerminalTaskTracker::default());
        let handler = CallbackHandler::new(
            CallbackPolicy::AutoApprove,
            "session-1".into(),
            "codex".into(),
            Arc::new(crate::events::EventLog::new(100)),
            temp.path().to_path_buf(),
            Arc::new(std::env::vars().collect()),
            tracker,
        );
        let response = handler
            .handle_create_terminal(
                CreateTerminalRequest::new(SchemaSessionId::new("s1"), "sh").args(vec![
                    "-c".into(),
                    "sleep 30 & echo $! > child.pid; wait".into(),
                ]),
            )
            .await
            .unwrap();
        let pid_file = temp.path().join("child.pid");
        for _ in 0..100 {
            if pid_file.exists() {
                break;
            }
            tokio::time::sleep(std::time::Duration::from_millis(20)).await;
        }
        let pid = std::fs::read_to_string(&pid_file).unwrap();
        handler
            .handle_release_terminal(ReleaseTerminalRequest::new(
                SchemaSessionId::new("s1"),
                response.terminal_id,
            ))
            .await
            .unwrap();
        for _ in 0..100 {
            if !std::path::Path::new(&format!("/proc/{pid}")).exists() {
                return;
            }
            tokio::time::sleep(std::time::Duration::from_millis(20)).await;
        }
        panic!("terminal descendant {pid} survived release");
    }
}
