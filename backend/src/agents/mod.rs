//! The set of agents this Pueblo Hub knows about.
mod definition;
mod file;

pub use definition::{
    AgentAvailability, AgentDefinition, AgentLaunch, AgentRuntime, AgentSource, AgentSummary,
    DEFAULT_IDLE_TIMEOUT_SECS,
};
pub use file::parse_agents;

use std::collections::BTreeMap;
use std::sync::Arc;
use std::sync::RwLock;

/// The shared installed-agent catalog. The lock makes replacement and
/// removal safe for future registry and web-managed sources while callers
/// retain stable runtime handles for sessions already in flight.
#[derive(Debug, Default)]
pub struct AgentCatalog {
    entries: RwLock<BTreeMap<String, AgentEntry>>,
}

#[derive(Debug)]
struct AgentEntry {
    definition: Arc<AgentDefinition>,
    runtime: Arc<AgentRuntime>,
}

impl AgentCatalog {
    pub fn new(definitions: impl IntoIterator<Item = AgentDefinition>) -> Self {
        definitions.into_iter().collect()
    }

    pub fn definition(&self, id: &str) -> Option<Arc<AgentDefinition>> {
        self.entries
            .read()
            .expect("agent catalog lock poisoned")
            .get(id)
            .map(|entry| entry.definition.clone())
    }

    pub fn runtime(&self, id: &str) -> Option<Arc<AgentRuntime>> {
        self.entries
            .read()
            .expect("agent catalog lock poisoned")
            .get(id)
            .filter(|entry| entry.definition.availability == AgentAvailability::Available)
            .map(|entry| entry.runtime.clone())
    }

    pub fn contains(&self, id: &str) -> bool {
        self.entries
            .read()
            .expect("agent catalog lock poisoned")
            .contains_key(id)
    }

    pub fn is_available(&self, id: &str) -> bool {
        self.runtime(id).is_some()
    }

    /// Sorted agent ids.
    pub fn ids(&self) -> Vec<String> {
        self.entries
            .read()
            .expect("agent catalog lock poisoned")
            .keys()
            .cloned()
            .collect()
    }

    pub fn definitions(&self) -> Vec<Arc<AgentDefinition>> {
        self.entries
            .read()
            .expect("agent catalog lock poisoned")
            .values()
            .map(|entry| entry.definition.clone())
            .collect()
    }

    pub fn summaries(&self) -> Vec<AgentSummary> {
        self.entries
            .read()
            .expect("agent catalog lock poisoned")
            .values()
            .map(|entry| entry.definition.summary())
            .collect()
    }

    /// Inserts or replaces one installed agent. Existing session runtime
    /// handles remain valid because the catalog stores each projection in an
    /// `Arc` and only new lookups observe the replacement.
    pub fn upsert(&self, definition: AgentDefinition) -> Option<AgentDefinition> {
        let id = definition.id.clone();
        let entry = AgentEntry {
            runtime: Arc::new(definition.runtime()),
            definition: Arc::new(definition),
        };
        self.entries
            .write()
            .expect("agent catalog lock poisoned")
            .insert(id, entry)
            .map(|old| (*old.definition).clone())
    }

    pub fn remove(&self, id: &str) -> Option<AgentDefinition> {
        self.entries
            .write()
            .expect("agent catalog lock poisoned")
            .remove(id)
            .map(|old| (*old.definition).clone())
    }

    pub fn len(&self) -> usize {
        self.entries
            .read()
            .expect("agent catalog lock poisoned")
            .len()
    }

    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }
}

impl FromIterator<AgentDefinition> for AgentCatalog {
    fn from_iter<I: IntoIterator<Item = AgentDefinition>>(iter: I) -> Self {
        let catalog = Self::default();
        for definition in iter {
            catalog.upsert(definition);
        }
        catalog
    }
}

/// Compatibility name for callers that construct the pre-catalog model.
/// New code should use `AgentCatalog`.
pub type AgentRegistry = AgentCatalog;

#[cfg(test)]
mod tests {
    use super::*;

    fn registry() -> AgentCatalog {
        AgentCatalog::new([
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
        assert!(AgentCatalog::default().is_empty());
    }

    /// The runtime handle must reflect the definition it was built from.
    #[test]
    fn runtime_matches_definition() {
        let registry =
            AgentCatalog::new([AgentDefinition::codex_default().with_command("custom-acp".into())]);
        assert_eq!(
            registry.runtime("codex").unwrap().launch.command,
            "custom-acp"
        );
    }

    #[test]
    fn catalog_can_replace_and_remove_definitions() {
        let catalog = AgentCatalog::new([AgentDefinition::codex_default()]);
        catalog.upsert(AgentDefinition::codex_default().with_command("replacement".into()));
        assert_eq!(
            catalog.runtime("codex").unwrap().launch.command,
            "replacement"
        );
        assert!(catalog.remove("codex").is_some());
        assert!(catalog.runtime("codex").is_none());
    }

    #[test]
    fn unavailable_definition_is_listed_but_has_no_runtime() {
        let catalog = AgentCatalog::new([AgentDefinition::codex_default().with_available(false)]);
        assert_eq!(
            catalog.summaries()[0].availability,
            AgentAvailability::Unavailable
        );
        assert!(catalog.definition("codex").is_some());
        assert!(catalog.runtime("codex").is_none());
    }
}
