use agent_client_protocol_schema::v1::TerminalExitStatus;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, VecDeque};
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::{oneshot, Notify, RwLock};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TaskState {
    Running,
    Completed,
    Failed,
    Stopped,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerminalTaskSummary {
    pub id: String,
    pub chat_id: String,
    pub command: String,
    pub cwd: String,
    pub state: TaskState,
    pub exit_code: Option<i32>,
    pub started_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerminalTaskDetails {
    pub id: String,
    pub chat_id: String,
    pub command: String,
    pub cwd: String,
    pub state: TaskState,
    pub exit_code: Option<i32>,
    pub started_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
    pub output: String,
    pub truncated: bool,
}

pub struct TerminalBuffer {
    pub output: String,
    pub truncated: bool,
}

pub struct ManagedTask {
    pub id: String,
    pub chat_id: String,
    pub command: String,
    pub cwd: PathBuf,
    pub started_at: DateTime<Utc>,
    pub completed_at: RwLock<Option<DateTime<Utc>>>,
    pub state: RwLock<TaskState>,
    pub exit_code: RwLock<Option<i32>>,
    pub buffer: RwLock<TerminalBuffer>,
    pub output_limit: Option<usize>,
    pub exit_notify: Arc<Notify>,
    pub kill_tx: std::sync::Mutex<Option<oneshot::Sender<()>>>,
    pub killed_by_user: AtomicBool,
    pub exit_status: RwLock<Option<TerminalExitStatus>>,
}

impl ManagedTask {
    pub fn new(
        id: String,
        chat_id: String,
        command: String,
        cwd: PathBuf,
        output_limit: Option<u64>,
    ) -> Self {
        Self {
            id,
            chat_id,
            command,
            cwd,
            started_at: Utc::now(),
            completed_at: RwLock::new(None),
            state: RwLock::new(TaskState::Running),
            exit_code: RwLock::new(None),
            buffer: RwLock::new(TerminalBuffer {
                output: String::new(),
                truncated: false,
            }),
            output_limit: output_limit.and_then(|limit| usize::try_from(limit).ok()),
            exit_notify: Arc::new(Notify::new()),
            kill_tx: std::sync::Mutex::new(None),
            killed_by_user: AtomicBool::new(false),
            exit_status: RwLock::new(None),
        }
    }

    pub async fn append_output(&self, chunk: &str) {
        let mut buffer = self.buffer.write().await;
        buffer.output.push_str(chunk);

        if let Some(limit) = self.output_limit {
            if buffer.output.len() > limit {
                let mut trim_at = buffer.output.len() - limit;
                while trim_at < buffer.output.len() && !buffer.output.is_char_boundary(trim_at) {
                    trim_at += 1;
                }
                buffer.output.drain(..trim_at);
                buffer.truncated = true;
            }
        }
    }

    pub async fn record_exit(&self, status: Result<std::process::ExitStatus, std::io::Error>) {
        let now = Utc::now();
        *self.completed_at.write().await = Some(now);

        let was_killed = self.killed_by_user.load(Ordering::SeqCst);
        let mut state_guard = self.state.write().await;

        let (exit_code, acp_exit_status) = match status {
            Ok(s) => {
                let code = s.code();
                if was_killed {
                    *state_guard = TaskState::Stopped;
                } else if code == Some(0) {
                    *state_guard = TaskState::Completed;
                } else {
                    *state_guard = TaskState::Failed;
                }
                *self.exit_code.write().await = code;
                let acp_status = TerminalExitStatus::new()
                    .exit_code(code.and_then(|c| u32::try_from(c).ok()))
                    .signal(None::<String>);
                (code, acp_status)
            }
            Err(e) => {
                if was_killed {
                    *state_guard = TaskState::Stopped;
                } else {
                    *state_guard = TaskState::Failed;
                }
                let acp_status =
                    TerminalExitStatus::new().signal(Some(format!("wait_error: {}", e)));
                (None, acp_status)
            }
        };

        *self.exit_status.write().await = Some(acp_exit_status);
        self.exit_notify.notify_waiters();
        tracing::debug!(
            task_id = %self.id,
            chat_id = %self.chat_id,
            exit_code = ?exit_code,
            state = ?*state_guard,
            "Terminal task finished"
        );
    }

    pub fn stop(&self) -> bool {
        self.killed_by_user.store(true, Ordering::SeqCst);
        if let Some(tx) = self.kill_tx.lock().unwrap().take() {
            let _ = tx.send(());
            true
        } else {
            false
        }
    }

    pub async fn summary(&self) -> TerminalTaskSummary {
        TerminalTaskSummary {
            id: self.id.clone(),
            chat_id: self.chat_id.clone(),
            command: self.command.clone(),
            cwd: self.cwd.to_string_lossy().to_string(),
            state: *self.state.read().await,
            exit_code: *self.exit_code.read().await,
            started_at: self.started_at,
            completed_at: *self.completed_at.read().await,
        }
    }

    pub async fn details(&self) -> TerminalTaskDetails {
        let buffer = self.buffer.read().await;
        TerminalTaskDetails {
            id: self.id.clone(),
            chat_id: self.chat_id.clone(),
            command: self.command.clone(),
            cwd: self.cwd.to_string_lossy().to_string(),
            state: *self.state.read().await,
            exit_code: *self.exit_code.read().await,
            started_at: self.started_at,
            completed_at: *self.completed_at.read().await,
            output: buffer.output.clone(),
            truncated: buffer.truncated,
        }
    }
}

pub struct TerminalTaskTracker {
    max_tasks_per_chat: usize,
    tasks_by_chat: RwLock<HashMap<String, VecDeque<Arc<ManagedTask>>>>,
    tasks_by_id: RwLock<HashMap<String, Arc<ManagedTask>>>,
}

impl Default for TerminalTaskTracker {
    fn default() -> Self {
        Self::new(50)
    }
}

impl TerminalTaskTracker {
    pub fn new(max_tasks_per_chat: usize) -> Self {
        Self {
            max_tasks_per_chat,
            tasks_by_chat: RwLock::new(HashMap::new()),
            tasks_by_id: RwLock::new(HashMap::new()),
        }
    }

    pub async fn register_task(&self, task: Arc<ManagedTask>) {
        let mut by_id = self.tasks_by_id.write().await;
        let mut by_chat = self.tasks_by_chat.write().await;

        by_id.insert(task.id.clone(), task.clone());
        let chat_queue = by_chat.entry(task.chat_id.clone()).or_default();
        chat_queue.push_back(task.clone());

        // Bounded retention: prune oldest non-running task if queue exceeds limit
        while chat_queue.len() > self.max_tasks_per_chat {
            let mut removed_index = None;
            for (idx, candidate) in chat_queue.iter().enumerate() {
                let state = *candidate.state.read().await;
                if state != TaskState::Running {
                    removed_index = Some(idx);
                    break;
                }
            }
            if let Some(idx) = removed_index {
                if let Some(removed) = chat_queue.remove(idx) {
                    by_id.remove(&removed.id);
                }
            } else {
                break;
            }
        }
    }

    pub async fn get_task(&self, task_id: &str) -> Option<Arc<ManagedTask>> {
        self.tasks_by_id.read().await.get(task_id).cloned()
    }

    pub async fn list_chat_tasks(&self, chat_id: &str) -> Vec<TerminalTaskSummary> {
        let by_chat = self.tasks_by_chat.read().await;
        let Some(tasks) = by_chat.get(chat_id) else {
            return Vec::new();
        };

        let mut summaries = Vec::new();
        for task in tasks.iter().rev() {
            summaries.push(task.summary().await);
        }
        summaries
    }

    pub async fn active_task_count(&self, chat_id: &str) -> usize {
        let by_chat = self.tasks_by_chat.read().await;
        let Some(tasks) = by_chat.get(chat_id) else {
            return 0;
        };

        let mut count = 0;
        for task in tasks.iter() {
            if *task.state.read().await == TaskState::Running {
                count += 1;
            }
        }
        count
    }

    pub async fn stop_chat_tasks(&self, chat_id: &str) {
        let by_chat = self.tasks_by_chat.read().await;
        let Some(tasks) = by_chat.get(chat_id) else {
            return;
        };
        for task in tasks.iter() {
            task.stop();
        }
    }
}
