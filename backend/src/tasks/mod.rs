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

pub const DEFAULT_MAX_OUTPUT_BYTES: usize = 1024 * 1024;

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
    pub output_limit: usize,
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
            output_limit: match output_limit.and_then(|limit| usize::try_from(limit).ok()) {
                Some(requested) => requested.min(DEFAULT_MAX_OUTPUT_BYTES),
                None => DEFAULT_MAX_OUTPUT_BYTES,
            },
            exit_notify: Arc::new(Notify::new()),
            kill_tx: std::sync::Mutex::new(None),
            killed_by_user: AtomicBool::new(false),
            exit_status: RwLock::new(None),
        }
    }

    pub async fn append_output(&self, chunk: &str) {
        let mut buffer = self.buffer.write().await;
        buffer.output.push_str(chunk);

        if buffer.output.len() > self.output_limit {
            let mut trim_at = buffer.output.len() - self.output_limit;
            while trim_at < buffer.output.len() && !buffer.output.is_char_boundary(trim_at) {
                trim_at += 1;
            }
            buffer.output.drain(..trim_at);
            buffer.truncated = true;
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

#[derive(Default)]
struct TrackerInner {
    tasks_by_chat: HashMap<String, VecDeque<Arc<ManagedTask>>>,
    tasks_by_id: HashMap<String, Arc<ManagedTask>>,
}

pub struct TerminalTaskTracker {
    max_tasks_per_chat: usize,
    inner: RwLock<TrackerInner>,
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
            inner: RwLock::new(TrackerInner::default()),
        }
    }

    pub async fn register_task(&self, task: Arc<ManagedTask>) {
        {
            let mut inner = self.inner.write().await;
            inner.tasks_by_id.insert(task.id.clone(), task.clone());
            inner
                .tasks_by_chat
                .entry(task.chat_id.clone())
                .or_default()
                .push_back(task.clone());
        }
        self.prune_chat_tasks(&task.chat_id).await;
    }

    pub async fn prune_chat_tasks(&self, chat_id: &str) {
        let candidates = {
            let inner = self.inner.read().await;
            match inner.tasks_by_chat.get(chat_id) {
                Some(queue) if queue.len() > self.max_tasks_per_chat => {
                    queue.iter().cloned().collect::<Vec<_>>()
                }
                _ => return,
            }
        };

        let mut completed_task_ids = Vec::new();
        for candidate in &candidates {
            let state = *candidate.state.read().await;
            if state != TaskState::Running {
                completed_task_ids.push(candidate.id.clone());
            }
        }

        if completed_task_ids.is_empty() {
            return;
        }

        let mut inner = self.inner.write().await;
        let TrackerInner {
            tasks_by_chat,
            tasks_by_id,
        } = &mut *inner;
        if let Some(queue) = tasks_by_chat.get_mut(chat_id) {
            let mut to_remove = queue.len().saturating_sub(self.max_tasks_per_chat);
            for task_id in completed_task_ids {
                if to_remove == 0 {
                    break;
                }
                if let Some(pos) = queue.iter().position(|t| t.id == task_id) {
                    queue.remove(pos);
                    tasks_by_id.remove(&task_id);
                    to_remove -= 1;
                }
            }
        }
    }

    pub async fn get_task(&self, task_id: &str) -> Option<Arc<ManagedTask>> {
        self.inner.read().await.tasks_by_id.get(task_id).cloned()
    }

    pub async fn list_chat_tasks(&self, chat_id: &str) -> Vec<TerminalTaskSummary> {
        let tasks = {
            let inner = self.inner.read().await;
            inner.tasks_by_chat.get(chat_id).cloned()
        };
        let Some(tasks) = tasks else {
            return Vec::new();
        };

        let mut summaries = Vec::with_capacity(tasks.len());
        for task in tasks.iter().rev() {
            summaries.push(task.summary().await);
        }
        summaries
    }

    pub async fn active_task_count(&self, chat_id: &str) -> usize {
        let tasks = {
            let inner = self.inner.read().await;
            inner.tasks_by_chat.get(chat_id).cloned()
        };
        let Some(tasks) = tasks else {
            return 0;
        };

        let mut count = 0;
        for task in &tasks {
            if *task.state.read().await == TaskState::Running {
                count += 1;
            }
        }
        count
    }

    pub async fn stop_chat_tasks(&self, chat_id: &str) {
        let tasks = {
            let inner = self.inner.read().await;
            inner.tasks_by_chat.get(chat_id).cloned()
        };
        if let Some(tasks) = tasks {
            for task in tasks {
                task.stop();
            }
        }
    }

    pub async fn forget_chat(&self, chat_id: &str) {
        let mut inner = self.inner.write().await;
        if let Some(tasks) = inner.tasks_by_chat.remove(chat_id) {
            for task in tasks {
                inner.tasks_by_id.remove(&task.id);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_output_limit_default_and_agent_override() {
        let task_default = ManagedTask::new(
            "task-1".into(),
            "chat-1".into(),
            "test".into(),
            PathBuf::from("/tmp"),
            None,
        );
        assert_eq!(task_default.output_limit, DEFAULT_MAX_OUTPUT_BYTES);

        let task_small = ManagedTask::new(
            "task-2".into(),
            "chat-1".into(),
            "test".into(),
            PathBuf::from("/tmp"),
            Some(20),
        );
        assert_eq!(task_small.output_limit, 20);
        task_small
            .append_output("hello world 1234567890 extra bytes")
            .await;
        let details = task_small.details().await;
        assert_eq!(details.output.len(), 20);
        assert!(details.truncated);

        let task_large = ManagedTask::new(
            "task-3".into(),
            "chat-1".into(),
            "test".into(),
            PathBuf::from("/tmp"),
            Some(100 * 1024 * 1024),
        );
        assert_eq!(task_large.output_limit, DEFAULT_MAX_OUTPUT_BYTES);
    }

    #[tokio::test]
    async fn test_forget_chat_clears_tasks_and_indexes() {
        let tracker = TerminalTaskTracker::new(10);
        let task1 = Arc::new(ManagedTask::new(
            "t1".into(),
            "c1".into(),
            "echo 1".into(),
            PathBuf::from("/tmp"),
            None,
        ));
        let task2 = Arc::new(ManagedTask::new(
            "t2".into(),
            "c2".into(),
            "echo 2".into(),
            PathBuf::from("/tmp"),
            None,
        ));

        tracker.register_task(task1.clone()).await;
        tracker.register_task(task2.clone()).await;

        assert_eq!(tracker.list_chat_tasks("c1").await.len(), 1);
        assert_eq!(tracker.list_chat_tasks("c2").await.len(), 1);
        assert!(tracker.get_task("t1").await.is_some());
        assert!(tracker.get_task("t2").await.is_some());

        tracker.forget_chat("c1").await;

        assert_eq!(tracker.list_chat_tasks("c1").await.len(), 0);
        assert!(tracker.get_task("t1").await.is_none());
        assert_eq!(tracker.list_chat_tasks("c2").await.len(), 1);
        assert!(tracker.get_task("t2").await.is_some());
    }
    #[tokio::test]
    async fn test_prune_on_task_completion_without_discarding_running_tasks() {
        let tracker = Arc::new(TerminalTaskTracker::new(2));
        let t1 = Arc::new(ManagedTask::new(
            "t1".into(),
            "c1".into(),
            "echo 1".into(),
            PathBuf::from("/tmp"),
            None,
        ));
        let t2 = Arc::new(ManagedTask::new(
            "t2".into(),
            "c1".into(),
            "echo 2".into(),
            PathBuf::from("/tmp"),
            None,
        ));
        let t3 = Arc::new(ManagedTask::new(
            "t3".into(),
            "c1".into(),
            "echo 3".into(),
            PathBuf::from("/tmp"),
            None,
        ));

        tracker.register_task(t1.clone()).await;
        tracker.register_task(t2.clone()).await;
        tracker.register_task(t3.clone()).await;

        // All 3 are running, so none should be pruned even though max is 2
        assert_eq!(tracker.list_chat_tasks("c1").await.len(), 3);

        // t1 completes -> triggers pruning on task completion
        t1.record_exit(Ok(std::process::ExitStatus::default()))
            .await;
        tracker.prune_chat_tasks("c1").await;

        // Now t1 should be pruned, queue length drops to 2 (t2 and t3, which are still running)
        let remaining = tracker.list_chat_tasks("c1").await;
        assert_eq!(remaining.len(), 2);
        assert!(tracker.get_task("t1").await.is_none());
        assert!(tracker.get_task("t2").await.is_some());
        assert!(tracker.get_task("t3").await.is_some());
    }

    #[tokio::test]
    async fn test_no_deadlock_between_register_and_forget() {
        let tracker = Arc::new(TerminalTaskTracker::new(50));
        let tracker1 = tracker.clone();
        let tracker2 = tracker.clone();

        let h1 = tokio::spawn(async move {
            for i in 0..100 {
                let task = Arc::new(ManagedTask::new(
                    format!("reg-{}", i),
                    "c1".into(),
                    "cmd".into(),
                    PathBuf::from("/tmp"),
                    None,
                ));
                tracker1.register_task(task).await;
            }
        });

        let h2 = tokio::spawn(async move {
            for _ in 0..100 {
                tracker2.forget_chat("c1").await;
            }
        });

        tokio::try_join!(h1, h2).unwrap();
    }
}
