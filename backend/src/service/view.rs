//! The chat shape every caller receives.
use crate::events::SessionEvent;
use crate::store::{Chat, ChatWorkspace, WorkspaceMode};
use serde::Serialize;

/// The safe, read-only workspace metadata exposed to browser clients.
/// Filesystem locations deliberately do not cross this boundary.
#[derive(Debug, Clone, Serialize)]
pub struct ChatWorkspaceSummary {
    pub mode: WorkspaceMode,
    pub branch: Option<String>,
    pub base_commit: Option<String>,
}

impl From<ChatWorkspace> for ChatWorkspaceSummary {
    fn from(workspace: ChatWorkspace) -> Self {
        Self {
            mode: workspace.mode,
            branch: workspace.branch,
            base_commit: workspace.base_commit,
        }
    }
}

/// A stored chat plus its live process and turn state. The field names match
/// what the browser already reads, plus safe display-only workspace metadata.
#[derive(Debug, Clone, Serialize)]
pub struct ChatView {
    #[serde(flatten)]
    pub chat: Chat,
    pub turn_started_at: Option<chrono::DateTime<chrono::Utc>>,
    pub process_state: String,
    pub turn_state: String,
    pub workspace: Option<ChatWorkspaceSummary>,
    #[serde(default)]
    pub active_tasks: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct ChatHistoryPage {
    pub events: Vec<SessionEvent>,
    pub next_cursor: Option<u64>,
    pub has_older: bool,
}
