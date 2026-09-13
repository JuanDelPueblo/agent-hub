use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::RwLock;
use tokio::sync::broadcast;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionEvent {
    pub seq: u64,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub session_id: String,
    pub agent: String,
    pub payload: EventPayload,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum EventPayload {
    UserMessage {
        text: String,
    },
    Error {
        message: String,
    },
    ConfigOptions {
        options: serde_json::Value,
    },
    MetadataChanged {},
    MessageChunk {
        text: String,
    },
    ThoughtChunk {
        text: String,
    },
    ToolCall {
        id: String,
        title: String,
        status: String,
    },
    ToolCallUpdate {
        id: String,
        status: String,
        output: Option<String>,
    },
    Plan {
        entries: Vec<PlanEntry>,
    },
    PermissionRequest {
        id: String,
        method: String,
        description: String,
    },
    PermissionResponse {
        id: String,
        granted: bool,
    },
    TurnComplete {
        stop_reason: String,
    },
    StateChange {
        process: String,
        turn: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlanEntry {
    pub content: String,
    pub status: String,
}

pub enum ReplayResult {
    Complete(Vec<SessionEvent>),
    Partial {
        events: Vec<SessionEvent>,
        oldest_available_seq: u64,
    },
}

pub struct EventLog {
    store: Option<std::sync::Arc<crate::store::Store>>,
    events: RwLock<VecDeque<SessionEvent>>,
    min_seq: AtomicU64,
    next_seq: AtomicU64,
    max_entries: usize,
    broadcast_tx: broadcast::Sender<SessionEvent>,
}

impl EventLog {
    pub fn new(max_entries: usize) -> Self {
        let (broadcast_tx, _) = broadcast::channel(1024);
        Self {
            store: None,
            events: RwLock::new(VecDeque::new()),
            min_seq: AtomicU64::new(0),
            next_seq: AtomicU64::new(1),
            max_entries,
            broadcast_tx,
        }
    }

    pub fn next_seq(&self) -> u64 {
        self.next_seq.load(Ordering::SeqCst)
    }

    pub fn persistent(store: std::sync::Arc<crate::store::Store>) -> anyhow::Result<Self> {
        let mut log = Self::new(10_000);
        let events = store.events()?;
        log.next_seq
            .store(events.last().map_or(1, |e| e.seq + 1), Ordering::SeqCst);
        log.min_seq
            .store(events.first().map_or(0, |e| e.seq), Ordering::SeqCst);
        *log.events.write().unwrap() = events.into();
        log.store = Some(store);
        // Browser approvals from a previous process can no longer authorize work.
        let previous = log.events.read().unwrap().clone();
        let mut pending = std::collections::HashMap::new();
        let mut active = std::collections::HashMap::new();
        for e in previous {
            match &e.payload {
                EventPayload::PermissionRequest { id, .. } => {
                    pending.insert(id.clone(), (e.session_id.clone(), e.agent.clone()));
                }
                EventPayload::PermissionResponse { id, .. } => {
                    pending.remove(id);
                }
                EventPayload::StateChange { turn, .. } if turn == "PROMPTING" => {
                    active.insert(e.session_id.clone(), e.agent.clone());
                }
                EventPayload::TurnComplete { .. } => {
                    active.remove(&e.session_id);
                }
                _ => {}
            }
        }
        for (id, (chat, agent)) in pending {
            log.append(
                &chat,
                &agent,
                EventPayload::PermissionResponse { id, granted: false },
            );
        }
        for (chat, agent) in active {
            log.append(
                &chat,
                &agent,
                EventPayload::TurnComplete {
                    stop_reason: "backend_restarted".into(),
                },
            );
        }
        Ok(log)
    }

    pub fn append(&self, session_id: &str, agent: &str, payload: EventPayload) -> u64 {
        // Sequence allocation, persistence and publication share ordering.
        let mut events = self.events.write().unwrap();
        let seq = self.next_seq.fetch_add(1, Ordering::SeqCst);
        let event = SessionEvent {
            seq,
            timestamp: chrono::Utc::now(),
            session_id: session_id.to_string(),
            agent: agent.to_string(),
            payload,
        };

        if let Some(store) = &self.store {
            if let Err(error) = store.save_event(&event) {
                tracing::error!(%error, "Failed to persist activity event");
            }
        }
        events.push_back(event.clone());

        while events.len() > self.max_entries {
            events.pop_front();
        }
        if let Some(first) = events.front() {
            self.min_seq.store(first.seq, Ordering::SeqCst);
        }
        let _ = self.broadcast_tx.send(event);

        seq
    }

    pub fn replay_from(&self, from_seq: u64) -> ReplayResult {
        let min = self.min_seq.load(Ordering::SeqCst);
        let events = self.events.read().unwrap();

        if from_seq > 0 && from_seq < min && min > 0 {
            let matching: Vec<SessionEvent> = events.iter().cloned().collect();
            return ReplayResult::Partial {
                events: matching,
                oldest_available_seq: min,
            };
        }

        let matching: Vec<SessionEvent> = events
            .iter()
            .filter(|e| e.seq >= from_seq)
            .cloned()
            .collect();
        ReplayResult::Complete(matching)
    }

    pub fn subscribe(&self) -> broadcast::Receiver<SessionEvent> {
        self.broadcast_tx.subscribe()
    }

    pub fn forget_chat(&self, id: &str) {
        self.events.write().unwrap().retain(|e| e.session_id != id);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;

    #[tokio::test]
    async fn test_event_log_append_and_replay() {
        let log = EventLog::new(100);
        let seq1 = log.append(
            "s1",
            "codex",
            EventPayload::MessageChunk {
                text: "hello".to_string(),
            },
        );
        let seq2 = log.append(
            "s1",
            "codex",
            EventPayload::MessageChunk {
                text: "world".to_string(),
            },
        );

        assert_eq!(seq1, 1);
        assert_eq!(seq2, 2);

        match log.replay_from(1) {
            ReplayResult::Complete(events) => assert_eq!(events.len(), 2),
            _ => panic!("Expected Complete"),
        }

        match log.replay_from(2) {
            ReplayResult::Complete(events) => assert_eq!(events.len(), 1),
            _ => panic!("Expected Complete"),
        }
    }

    #[tokio::test]
    async fn test_next_seq() {
        let log = EventLog::new(100);
        assert_eq!(log.next_seq(), 1);
        log.append(
            "s1",
            "codex",
            EventPayload::MessageChunk { text: "a".into() },
        );
        assert_eq!(log.next_seq(), 2);
    }

    #[tokio::test]
    async fn test_subscribe_receives_events() {
        let log = EventLog::new(100);
        let mut rx = log.subscribe();
        log.append(
            "s1",
            "codex",
            EventPayload::MessageChunk { text: "hi".into() },
        );
        let event = rx.recv().await.unwrap();
        assert_eq!(event.session_id, "s1");
        assert_eq!(event.agent, "codex");
    }

    #[tokio::test]
    async fn test_replay_from_future_seq() {
        let log = EventLog::new(100);
        log.append(
            "s1",
            "codex",
            EventPayload::MessageChunk { text: "a".into() },
        );
        match log.replay_from(999) {
            ReplayResult::Complete(events) => assert!(events.is_empty()),
            _ => panic!("Expected empty Complete"),
        }
    }

    #[tokio::test]
    async fn test_event_log_eviction() {
        let log = EventLog::new(3);
        for i in 0..5 {
            log.append(
                "s1",
                "codex",
                EventPayload::MessageChunk {
                    text: format!("msg{}", i),
                },
            );
        }

        match log.replay_from(1) {
            ReplayResult::Partial {
                events,
                oldest_available_seq,
            } => {
                assert_eq!(events.len(), 3);
                assert!(oldest_available_seq > 1);
            }
            _ => panic!("Expected Partial"),
        }
    }

    #[tokio::test]
    async fn test_replay_sees_event_before_broadcast_consumer_observes_it() {
        let log = Arc::new(EventLog::new(100));
        let mut rx = log.subscribe();

        let append_task = {
            let log = log.clone();
            tokio::spawn(async move {
                log.append(
                    "s1",
                    "codex",
                    EventPayload::MessageChunk {
                        text: "ordered".to_string(),
                    },
                )
            })
        };

        let event = rx.recv().await.unwrap();
        match log.replay_from(event.seq) {
            ReplayResult::Complete(events) => {
                assert!(events.iter().any(|replayed| replayed.seq == event.seq));
            }
            ReplayResult::Partial { .. } => panic!("Expected Complete"),
        }

        append_task.await.unwrap();
    }
}
