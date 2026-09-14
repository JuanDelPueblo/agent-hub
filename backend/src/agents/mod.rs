//! The set of agents this Pueblo Hub knows about.
mod definition;
mod file;

pub use definition::{
    AgentDefinition, AgentLaunch, AgentRuntime, AgentSource, DEFAULT_IDLE_TIMEOUT_SECS,
};
pub use file::parse_agents;

use std::collections::BTreeMap;
use std::sync::Arc;

/// Definitions keyed by id. A `BTreeMap` keeps `ids()` sorted, which the
/// `/api/agents` response depends on.
#[derive(Debug, Default)]
pub struct AgentRegistry {
    by_id: BTreeMap<String, AgentDefinition>,
    /// Built once so the session layer can clone a handle instead of the
    /// whole definition on every lookup.
    runtimes: BTreeMap<String, Arc<AgentRuntime>>,
}

impl AgentRegistry {
    pub fn new(definitions: impl IntoIterator<Item = AgentDefinition>) -> Self {
        definitions.into_iter().collect()
    }

    pub fn definition(&self, id: &str) -> Option<&AgentDefinition> {
        self.by_id.get(id)
    }

    pub fn runtime(&self, id: &str) -> Option<Arc<AgentRuntime>> {
        self.runtimes.get(id).cloned()
    }

    pub fn contains(&self, id: &str) -> bool {
        self.by_id.contains_key(id)
    }

    /// Sorted agent ids.
    pub fn ids(&self) -> Vec<String> {
        self.by_id.keys().cloned().collect()
    }

    pub fn definitions(&self) -> impl Iterator<Item = &AgentDefinition> {
        self.by_id.values()
    }

    pub fn len(&self) -> usize {
        self.by_id.len()
    }

    pub fn is_empty(&self) -> bool {
        self.by_id.is_empty()
    }
}

impl FromIterator<AgentDefinition> for AgentRegistry {
    fn from_iter<I: IntoIterator<Item = AgentDefinition>>(iter: I) -> Self {
        let mut registry = Self::default();
        for definition in iter {
            registry
                .runtimes
                .insert(definition.id.clone(), Arc::new(definition.runtime()));
            registry.by_id.insert(definition.id.clone(), definition);
        }
        registry
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn registry() -> AgentRegistry {
        AgentRegistry::new([
            AgentDefinition::opencode_default(),
            AgentDefinition::codex_default(),
            AgentDefinition::claudecode_default(),
        ])
    }

    #[test]
    fn ids_are_sorted() {
        assert_eq!(registry().ids(), vec!["claude", "codex", "opencode"]);
    }

    #[test]
    fn lookup_by_id() {
        let registry = registry();
        assert!(registry.contains("codex"));
        assert!(!registry.contains("gemini"));
        assert_eq!(registry.definition("codex").unwrap().id, "codex");
        assert_eq!(
            registry.runtime("codex").unwrap().launch.command,
            "codex-acp"
        );
        assert!(registry.runtime("gemini").is_none());
        assert_eq!(registry.len(), 3);
        assert!(!registry.is_empty());
        assert!(AgentRegistry::default().is_empty());
    }

    /// The runtime handle must reflect the definition it was built from.
    #[test]
    fn runtime_matches_definition() {
        let registry =
            AgentRegistry::new(
                [AgentDefinition::codex_default().with_command("custom-acp".into())],
            );
        assert_eq!(
            registry.runtime("codex").unwrap().launch.command,
            "custom-acp"
        );
    }
}
