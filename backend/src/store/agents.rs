//! Durable installed-agent records.
//!
//! One table holds both registry installs and Batey-managed definitions, so
//! there is one durable source for the one runtime catalog. The `source`
//! column stays queryable because ownership decides which API may change a
//! row. Everything else lives in the JSON `data` blob, the same shape the
//! projects and chats tables use.
use super::{StoreError, StoreResult};
use crate::agents::{AgentSource, InstalledAgent};
use rusqlite::{params, Connection, OptionalExtension};

const SELECT_COLUMNS: &str = "id, source, data FROM installed_agents";

fn row_to_agent(row: &rusqlite::Row<'_>) -> rusqlite::Result<InstalledAgent> {
    let data: String = row.get(2)?;
    serde_json::from_str(&data).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(2, rusqlite::types::Type::Text, Box::new(error))
    })
}

pub(crate) fn list(conn: &Connection) -> StoreResult<Vec<InstalledAgent>> {
    let mut statement = conn.prepare(&format!("SELECT {SELECT_COLUMNS} ORDER BY id"))?;
    let rows = statement.query_map([], row_to_agent)?;
    let mut agents = Vec::new();
    for row in rows {
        agents.push(row?);
    }
    Ok(agents)
}

pub(crate) fn get(conn: &Connection, id: &str) -> StoreResult<Option<InstalledAgent>> {
    Ok(conn
        .query_row(
            &format!("SELECT {SELECT_COLUMNS} WHERE id=?1"),
            [id],
            row_to_agent,
        )
        .optional()?)
}

/// Inserts a new record. A row that already holds this id is a conflict, so
/// an install or a create never overwrites another source's definition.
pub(crate) fn insert(conn: &Connection, agent: &InstalledAgent) -> StoreResult<()> {
    if let Some(existing) = get(conn, &agent.id)? {
        return Err(StoreError::Validation(format!(
            "An agent with id '{}' already exists (source: {}).",
            agent.id, existing.source
        )));
    }
    conn.execute(
        "INSERT INTO installed_agents (id, source, data, created_at, updated_at) \
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            agent.id,
            agent.source.as_str(),
            serde_json::to_string(agent)?,
            agent.created_at,
            agent.updated_at,
        ],
    )?;
    Ok(())
}

/// Replaces an existing record. The stored `source` must match, so a registry
/// lifecycle call can never rewrite a Batey-managed row and the reverse.
pub(crate) fn update(conn: &Connection, agent: &InstalledAgent) -> StoreResult<()> {
    let existing = get(conn, &agent.id)?
        .ok_or_else(|| StoreError::NotFound(format!("Agent '{}' not found", agent.id)))?;
    if existing.source != agent.source {
        return Err(StoreError::Validation(format!(
            "Agent '{}' is owned by the {} source, not {}.",
            agent.id, existing.source, agent.source
        )));
    }
    conn.execute(
        "UPDATE installed_agents SET data=?2, updated_at=?3 WHERE id=?1",
        params![agent.id, serde_json::to_string(agent)?, agent.updated_at,],
    )?;
    Ok(())
}

pub(crate) fn delete(conn: &Connection, id: &str) -> StoreResult<()> {
    let removed = conn.execute("DELETE FROM installed_agents WHERE id=?1", [id])?;
    if removed == 0 {
        return Err(StoreError::NotFound(format!("Agent '{id}' not found")));
    }
    Ok(())
}

/// Whether any chat names this agent. Uninstall consults this before it
/// removes a row, so durable chats never lose the agent they refer to.
pub(crate) fn chat_count_for_agent(conn: &Connection, agent_id: &str) -> StoreResult<u64> {
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM chats WHERE json_extract(data, '$.agent') = ?1",
        [agent_id],
        |row| row.get(0),
    )?;
    Ok(count.max(0) as u64)
}

/// Every agent id a chat names, so startup can tell which ids still matter.
pub(crate) fn referenced_agent_ids(conn: &Connection) -> StoreResult<Vec<String>> {
    let mut statement = conn.prepare(
        "SELECT DISTINCT json_extract(data, '$.agent') FROM chats \
         WHERE json_extract(data, '$.agent') IS NOT NULL ORDER BY 1",
    )?;
    let rows = statement.query_map([], |row| row.get::<_, String>(0))?;
    let mut ids = Vec::new();
    for row in rows {
        ids.push(row?);
    }
    Ok(ids)
}

pub(crate) fn sources(conn: &Connection) -> StoreResult<Vec<(String, AgentSource)>> {
    let mut statement = conn.prepare("SELECT id, source FROM installed_agents ORDER BY id")?;
    let rows = statement.query_map([], |row| {
        let id: String = row.get(0)?;
        let source: String = row.get(1)?;
        Ok((id, source))
    })?;
    let mut out = Vec::new();
    for row in rows {
        let (id, source) = row?;
        let source = source
            .parse::<AgentSource>()
            .map_err(StoreError::Validation)?;
        out.push((id, source));
    }
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::agents::{CustomAgentInput, InstalledDistribution, RegistrySnapshot};
    use crate::store::Store;

    fn custom(id: &str) -> InstalledAgent {
        CustomAgentInput {
            id: id.into(),
            command: format!("{id}-acp"),
            ..CustomAgentInput::default()
        }
        .into_record()
        .unwrap()
    }

    fn registry(id: &str, version: &str) -> InstalledAgent {
        let mut record = InstalledAgent::new(id.into(), AgentSource::Registry, "npx".into());
        record.registry = Some(RegistrySnapshot {
            registry_id: format!("{id}-acp"),
            registry_version: version.into(),
            distribution: InstalledDistribution::Npx {
                package: format!("{id}@{version}"),
                args: Vec::new(),
                env: Default::default(),
            },
            install_dir: None,
            installed_at: chrono::Utc::now().to_rfc3339(),
        });
        record
    }

    #[test]
    fn records_survive_a_restart() {
        let tmp = tempfile::tempdir().unwrap();
        let path = tmp.path().join("hub.db");
        let store = Store::open(&path).unwrap();
        store.insert_agent(&custom("private")).unwrap();
        store.insert_agent(&registry("codex", "1.11.0")).unwrap();
        drop(store);

        let store = Store::open(&path).unwrap();
        let agents = store.installed_agents().unwrap();
        assert_eq!(agents.len(), 2);
        assert_eq!(agents[0].id, "codex");
        assert_eq!(agents[0].source, AgentSource::Registry);
        assert_eq!(
            agents[0].registry.as_ref().unwrap().registry_version,
            "1.11.0"
        );
        assert_eq!(agents[1].id, "private");
        assert_eq!(agents[1].source, AgentSource::BateyManaged);
    }

    #[test]
    fn a_duplicate_id_is_a_conflict_rather_than_an_overwrite() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        store.insert_agent(&custom("shared")).unwrap();
        let error = store
            .insert_agent(&registry("shared", "1.0.0"))
            .unwrap_err();
        assert!(error.to_string().contains("already exists"), "{error}");
        assert_eq!(
            store.installed_agent("shared").unwrap().unwrap().source,
            AgentSource::BateyManaged
        );
    }

    #[test]
    fn an_update_cannot_change_the_owning_source() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        store.insert_agent(&custom("private")).unwrap();

        let mut stolen = custom("private");
        stolen.source = AgentSource::Registry;
        let error = store.update_agent(&stolen).unwrap_err();
        assert!(error.to_string().contains("owned by"), "{error}");

        let mut edited = custom("private");
        edited.display_name = "Renamed".into();
        store.update_agent(&edited).unwrap();
        assert_eq!(
            store
                .installed_agent("private")
                .unwrap()
                .unwrap()
                .display_name,
            "Renamed"
        );
    }

    #[test]
    fn updating_or_deleting_a_missing_row_is_not_found() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        assert!(store.update_agent(&custom("absent")).is_err());
        assert!(store.delete_agent("absent").is_err());
        assert!(store.installed_agent("absent").unwrap().is_none());
    }

    #[test]
    fn chat_references_are_counted_per_agent() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        let project = store
            .create_project("project".into(), tmp.path().display().to_string())
            .unwrap();
        store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        store
            .create_chat(project.id, "private".into(), None)
            .unwrap();

        assert_eq!(store.chat_count_for_agent("codex").unwrap(), 2);
        assert_eq!(store.chat_count_for_agent("private").unwrap(), 1);
        assert_eq!(store.chat_count_for_agent("absent").unwrap(), 0);
        assert_eq!(
            store.referenced_agent_ids().unwrap(),
            vec!["codex".to_string(), "private".to_string()]
        );
    }

    #[test]
    fn sources_are_listed_for_collision_checks() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        store.insert_agent(&custom("private")).unwrap();
        store.insert_agent(&registry("codex", "1.0.0")).unwrap();
        assert_eq!(
            store.installed_agent_sources().unwrap(),
            vec![
                ("codex".to_string(), AgentSource::Registry),
                ("private".to_string(), AgentSource::BateyManaged),
            ]
        );
    }

    #[test]
    fn deleting_a_record_leaves_the_other_rows_alone() {
        let tmp = tempfile::tempdir().unwrap();
        let store = Store::open(&tmp.path().join("hub.db")).unwrap();
        store.insert_agent(&custom("one")).unwrap();
        store.insert_agent(&custom("two")).unwrap();
        store.delete_agent("one").unwrap();
        let remaining = store.installed_agents().unwrap();
        assert_eq!(remaining.len(), 1);
        assert_eq!(remaining[0].id, "two");
    }
}
