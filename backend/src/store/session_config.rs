//! Typed, ordered ACP session setup configuration.  Secrets are persisted only
//! in this narrowly-scoped table and callers receive redacted views.
use super::{StoreError, StoreResult};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum McpTransport {
    Stdio,
    Http,
    Sse,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpServerConfig {
    pub id: String,
    pub chat_id: String,
    pub position: i64,
    pub name: String,
    pub transport: McpTransport,
    pub url: Option<String>,
    pub command: Option<String>,
    #[serde(default)]
    pub args: Vec<String>,
    /// Header/env values are sensitive; callers must use `redacted` for API output.
    pub secrets: Vec<SecretField>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecretField {
    pub name: String,
    pub value: String,
}
#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct McpServerInput {
    pub name: String,
    pub transport: McpTransport,
    pub url: Option<String>,
    pub command: Option<String>,
    #[serde(default)]
    pub args: Vec<String>,
    #[serde(default)]
    pub secrets: Vec<SecretInput>,
}
#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SecretInput {
    pub name: String,
    pub value: Option<String>,
    #[serde(default)]
    pub action: SecretEdit,
}
#[derive(Debug, Clone, Default, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum SecretEdit {
    #[default]
    Replace,
    Keep,
    Remove,
}
#[derive(Debug, Clone, Serialize)]
pub struct McpServerView {
    pub id: String,
    pub position: i64,
    pub name: String,
    pub transport: McpTransport,
    pub url: Option<String>,
    pub command: Option<String>,
    pub args: Vec<String>,
    pub secrets: Vec<SecretPresence>,
}
#[derive(Debug, Clone, Serialize)]
pub struct SecretPresence {
    pub name: String,
    pub present: bool,
}
impl McpServerConfig {
    pub fn redacted(&self) -> McpServerView {
        McpServerView {
            id: self.id.clone(),
            position: self.position,
            name: self.name.clone(),
            transport: self.transport.clone(),
            url: self.url.clone(),
            command: self.command.clone(),
            args: self.args.clone(),
            secrets: self
                .secrets
                .iter()
                .map(|s| SecretPresence {
                    name: s.name.clone(),
                    present: !s.value.is_empty(),
                })
                .collect(),
        }
    }
}
#[derive(Debug, Clone)]
pub struct AdditionalRoot {
    pub chat_id: String,
    pub position: i64,
    pub project_id: String,
    pub canonical_path: String,
}

fn decode(data: String) -> StoreResult<McpServerConfig> {
    Ok(serde_json::from_str(&data)?)
}
pub(crate) fn mcp_list(conn: &Connection, chat: &str) -> StoreResult<Vec<McpServerConfig>> {
    let mut s =
        conn.prepare("SELECT data FROM chat_mcp_servers WHERE chat_id=?1 ORDER BY position")?;
    let values = s
        .query_map([chat], |r| r.get(0))?
        .map(|r| decode(r?))
        .collect();
    values
}
pub(crate) fn mcp_get(conn: &Connection, chat: &str, id: &str) -> StoreResult<McpServerConfig> {
    conn.query_row(
        "SELECT data FROM chat_mcp_servers WHERE chat_id=?1 AND id=?2",
        params![chat, id],
        |r| r.get(0),
    )
    .optional()?
    .map(decode)
    .transpose()?
    .ok_or_else(|| StoreError::NotFound("MCP server not found".into()))
}
pub(crate) fn mcp_insert(conn: &Connection, v: &McpServerConfig) -> StoreResult<()> {
    conn.execute(
        "INSERT INTO chat_mcp_servers(id,chat_id,position,data) VALUES(?1,?2,?3,?4)",
        params![v.id, v.chat_id, v.position, serde_json::to_string(v)?],
    )?;
    Ok(())
}
pub(crate) fn mcp_update(conn: &Connection, v: &McpServerConfig) -> StoreResult<()> {
    if conn.execute(
        "UPDATE chat_mcp_servers SET data=?3 WHERE chat_id=?1 AND id=?2",
        params![v.chat_id, v.id, serde_json::to_string(v)?],
    )? == 0
    {
        return Err(StoreError::NotFound("MCP server not found".into()));
    };
    Ok(())
}
pub(crate) fn mcp_delete(conn: &Connection, chat: &str, id: &str) -> StoreResult<()> {
    if conn.execute(
        "DELETE FROM chat_mcp_servers WHERE chat_id=?1 AND id=?2",
        params![chat, id],
    )? == 0
    {
        return Err(StoreError::NotFound("MCP server not found".into()));
    };
    let ids: Vec<String> = {
        let mut s =
            conn.prepare("SELECT id FROM chat_mcp_servers WHERE chat_id=?1 ORDER BY position")?;
        let values = s
            .query_map([chat], |r| r.get(0))?
            .collect::<Result<_, _>>()?;
        values
    };
    for (p, id) in ids.iter().enumerate() {
        conn.execute(
            "UPDATE chat_mcp_servers SET position=?3 WHERE chat_id=?1 AND id=?2",
            params![chat, id, p as i64],
        )?;
    }
    Ok(())
}
pub(crate) fn mcp_reorder(conn: &mut Connection, chat: &str, ids: &[String]) -> StoreResult<()> {
    let current = mcp_list(conn, chat)?;
    if current.len() != ids.len() || current.iter().any(|v| !ids.contains(&v.id)) {
        return Err(StoreError::Validation(
            "MCP order must contain every server exactly once".into(),
        ));
    };
    let temp_base = current
        .iter()
        .map(|server| server.position)
        .max()
        .unwrap_or(-1)
        .checked_add(current.len() as i64 + 1)
        .ok_or_else(|| StoreError::Internal(anyhow::anyhow!("MCP position range exhausted")))?;
    let tx = conn.transaction()?;
    // `position` has a non-negative CHECK constraint.  Move every row into a
    // disjoint non-negative range before occupying the requested positions.
    // This also keeps UNIQUE(chat_id, position) true throughout the update.
    for (p, id) in ids.iter().enumerate() {
        tx.execute(
            "UPDATE chat_mcp_servers SET position=?3 WHERE chat_id=?1 AND id=?2",
            params![chat, id, temp_base + p as i64],
        )?;
    }
    for (p, id) in ids.iter().enumerate() {
        tx.execute(
            "UPDATE chat_mcp_servers SET position=?3 WHERE chat_id=?1 AND id=?2",
            params![chat, id, p as i64],
        )?;
    }
    tx.commit()?;
    Ok(())
}
pub(crate) fn roots_list(conn: &Connection, chat: &str) -> StoreResult<Vec<AdditionalRoot>> {
    let mut s=conn.prepare("SELECT chat_id,position,project_id,canonical_path FROM chat_additional_roots WHERE chat_id=?1 ORDER BY position")?;
    let values = s
        .query_map([chat], |r| {
            Ok(AdditionalRoot {
                chat_id: r.get(0)?,
                position: r.get(1)?,
                project_id: r.get(2)?,
                canonical_path: r.get(3)?,
            })
        })?
        .collect::<Result<_, _>>()
        .map_err(Into::into);
    values
}
pub(crate) fn roots_replace(
    conn: &mut Connection,
    chat: &str,
    roots: &[AdditionalRoot],
) -> StoreResult<()> {
    let tx = conn.transaction()?;
    tx.execute("DELETE FROM chat_additional_roots WHERE chat_id=?1", [chat])?;
    for r in roots {
        tx.execute("INSERT INTO chat_additional_roots(chat_id,position,project_id,canonical_path) VALUES(?1,?2,?3,?4)",params![r.chat_id,r.position,r.project_id,r.canonical_path])?;
    }
    tx.commit()?;
    Ok(())
}
/// Whether some chat that does *not* belong to `project_id` still lists it
/// as an additional workspace root. A chat that belongs to `project_id`
/// itself does not count: deleting a project already deletes that chat, so
/// its own reference is not an external dependency.
pub(crate) fn roots_reference_project_externally(
    conn: &Connection,
    project_id: &str,
) -> StoreResult<bool> {
    Ok(conn.query_row(
        "SELECT EXISTS(\
             SELECT 1 FROM chat_additional_roots r \
             JOIN chats c ON c.id = r.chat_id \
             WHERE r.project_id = ?1 AND c.project_id != ?1\
         )",
        [project_id],
        |r| r.get(0),
    )?)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::store::Store;

    #[test]
    fn ordered_mcp_and_project_roots_survive_restart_without_exposing_secret_values() {
        let temp = tempfile::tempdir().unwrap();
        let db = temp.path().join("hub.db");
        let root_a = temp.path().join("a");
        let root_b = temp.path().join("b");
        std::fs::create_dir_all(&root_a).unwrap();
        std::fs::create_dir_all(&root_b).unwrap();
        let store = Store::open(&db).unwrap();
        let primary = store
            .create_project(
                "a".into(),
                root_a.canonicalize().unwrap().to_string_lossy().into(),
            )
            .unwrap();
        let additional = store
            .create_project(
                "b".into(),
                root_b.canonicalize().unwrap().to_string_lossy().into(),
            )
            .unwrap();
        let chat = store
            .create_chat(primary.id, "agent".into(), Some("chat".into()))
            .unwrap();
        let value = McpServerConfig {
            id: "mcp".into(),
            chat_id: chat.id.clone(),
            position: 0,
            name: "private".into(),
            transport: McpTransport::Http,
            url: Some("https://example.test/mcp".into()),
            command: None,
            args: vec![],
            secrets: vec![SecretField {
                name: "Authorization".into(),
                value: "do-not-leak".into(),
            }],
        };
        store.insert_mcp_server(&value).unwrap();
        let second = McpServerConfig {
            id: "mcp-two".into(),
            chat_id: chat.id.clone(),
            position: 1,
            name: "second".into(),
            transport: McpTransport::Stdio,
            url: None,
            command: Some("/bin/true".into()),
            args: vec![],
            secrets: vec![],
        };
        store.insert_mcp_server(&second).unwrap();
        // Regression for the non-negative position CHECK: a swap must not
        // use a negative temporary position and the exact order must persist.
        store
            .reorder_mcp_servers(&chat.id, &[second.id.clone(), value.id.clone()])
            .unwrap();
        store
            .replace_additional_roots(
                &chat.id,
                &[AdditionalRoot {
                    chat_id: chat.id.clone(),
                    position: 0,
                    project_id: additional.id.clone(),
                    canonical_path: additional.path,
                }],
            )
            .unwrap();
        drop(store);
        let reopened = Store::open(&db).unwrap();
        let saved = reopened.mcp_servers(&chat.id).unwrap();
        assert_eq!(
            saved
                .iter()
                .map(|server| server.id.as_str())
                .collect::<Vec<_>>(),
            ["mcp-two", "mcp"]
        );
        assert_eq!(saved[1].secrets[0].value, "do-not-leak");
        let exposed = serde_json::to_string(&saved[1].redacted()).unwrap();
        assert!(exposed.contains("present"));
        assert!(!exposed.contains("do-not-leak"));
        assert_eq!(
            reopened.additional_roots(&chat.id).unwrap()[0].project_id,
            additional.id
        );
    }
}
