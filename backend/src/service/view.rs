//! The chat shape every caller receives.
use crate::store::Chat;
use serde::Serialize;

/// A stored chat plus its live process and turn state. The field names match
/// what the browser already reads, so the HTTP payload does not change.
#[derive(Debug, Clone, Serialize)]
pub struct ChatView {
    #[serde(flatten)]
    pub chat: Chat,
    pub process_state: String,
    pub turn_state: String,
}
