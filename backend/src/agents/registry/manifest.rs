//! The official ACP Registry v1 document.
//!
//! Every field is deserialized explicitly. The registry is an outside input,
//! so one malformed entry must not discard the whole catalog: `parse_catalog`
//! keeps the valid agents and reports each rejection with its reason.
//!
//! Nothing here infers a provider from an agent name. The catalog carries the
//! registry id, the display metadata, and the distribution exactly as
//! published.
use super::platform::PlatformTarget;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// The registry document version this adapter understands.
pub const SUPPORTED_REGISTRY_MAJOR: u64 = 1;

/// A validated registry catalog plus every entry that failed validation.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RegistryCatalog {
    pub version: String,
    pub agents: Vec<RegistryAgent>,
    #[serde(default)]
    pub rejected: Vec<RegistryRejection>,
}

impl RegistryCatalog {
    pub fn agent(&self, id: &str) -> Option<&RegistryAgent> {
        self.agents.iter().find(|agent| agent.id == id)
    }

    /// Case-insensitive substring match over the id, the name, and the
    /// description. An empty query returns everything.
    pub fn search(&self, query: &str) -> Vec<&RegistryAgent> {
        let needle = query.trim().to_lowercase();
        self.agents
            .iter()
            .filter(|agent| {
                needle.is_empty()
                    || agent.id.to_lowercase().contains(&needle)
                    || agent.name.to_lowercase().contains(&needle)
                    || agent.description.to_lowercase().contains(&needle)
            })
            .collect()
    }
}

/// One rejected registry entry, kept so the catalog can report what it
/// dropped instead of failing silently.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RegistryRejection {
    /// The id the entry claimed, when it had a usable one.
    pub id: Option<String>,
    pub reason: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RegistryAgent {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repository: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub website: Option<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub authors: Vec<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_url: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,
    pub distribution: RegistryDistribution,
}

/// The publication channels one agent offers. At least one is present.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct RegistryDistribution {
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub binary: BTreeMap<PlatformTarget, BinaryTarget>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub npx: Option<PackageDistribution>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uvx: Option<PackageDistribution>,
}

impl RegistryDistribution {
    pub fn is_empty(&self) -> bool {
        self.binary.is_empty() && self.npx.is_none() && self.uvx.is_none()
    }

    /// The distribution kinds this agent publishes, in the order Pueblo Hub
    /// prefers them: a native binary first, then the package runtimes.
    pub fn kinds(&self) -> Vec<DistributionKind> {
        let mut kinds = Vec::new();
        if !self.binary.is_empty() {
            kinds.push(DistributionKind::Binary);
        }
        if self.npx.is_some() {
            kinds.push(DistributionKind::Npx);
        }
        if self.uvx.is_some() {
            kinds.push(DistributionKind::Uvx);
        }
        kinds
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DistributionKind {
    Binary,
    Npx,
    Uvx,
}

impl DistributionKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Binary => "binary",
            Self::Npx => "npx",
            Self::Uvx => "uvx",
        }
    }
}

impl std::fmt::Display for DistributionKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.as_str())
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BinaryTarget {
    pub archive: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sha256: Option<String>,
    pub cmd: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub args: Vec<String>,
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub env: BTreeMap<String, String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PackageDistribution {
    pub package: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub args: Vec<String>,
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub env: BTreeMap<String, String>,
}

// ------------------------------------------------------------------ parsing

/// The document shape, before per-agent validation. Unknown document keys are
/// tolerated: the published registry already carries an `extensions` key that
/// the agent schema does not describe.
#[derive(Deserialize)]
struct RawDocument {
    version: String,
    agents: Vec<serde_json::Value>,
}

/// Unknown agent keys are tolerated for the same reason. `preview` never
/// reaches a published registry, so it needs no handling here.
#[derive(Deserialize)]
struct RawAgent {
    id: Option<String>,
    name: Option<String>,
    version: Option<String>,
    description: Option<String>,
    repository: Option<String>,
    website: Option<String>,
    #[serde(default)]
    authors: Vec<String>,
    license: Option<String>,
    license_url: Option<String>,
    icon: Option<String>,
    distribution: Option<RawDistribution>,
}

#[derive(Deserialize)]
struct RawDistribution {
    #[serde(default)]
    binary: BTreeMap<String, BinaryTarget>,
    #[serde(default)]
    npx: Option<PackageDistribution>,
    #[serde(default)]
    uvx: Option<PackageDistribution>,
}

/// Parses one registry document. The document itself must be well formed and
/// must declare a supported major version; individual agents that fail
/// validation are reported through `RegistryCatalog::rejected`.
pub fn parse_catalog(json: &str) -> anyhow::Result<RegistryCatalog> {
    let document: RawDocument = serde_json::from_str(json)
        .map_err(|error| anyhow::anyhow!("Malformed registry: {error}"))?;
    let major = document
        .version
        .split('.')
        .next()
        .and_then(|part| part.parse::<u64>().ok())
        .ok_or_else(|| {
            anyhow::anyhow!("Registry version '{}' is not a version", document.version)
        })?;
    anyhow::ensure!(
        major == SUPPORTED_REGISTRY_MAJOR,
        "Registry version {} is not supported (this build reads version {}.x)",
        document.version,
        SUPPORTED_REGISTRY_MAJOR
    );

    let mut agents: Vec<RegistryAgent> = Vec::new();
    let mut rejected = Vec::new();
    for raw in document.agents {
        let claimed_id = raw.get("id").and_then(|id| id.as_str()).map(str::to_string);
        match validate_agent(raw) {
            Ok(agent) => {
                // A duplicate id makes the entry ambiguous, so neither copy
                // silently wins.
                if agents.iter().any(|existing| existing.id == agent.id) {
                    rejected.push(RegistryRejection {
                        id: Some(agent.id.clone()),
                        reason: "duplicate agent id in the registry document".into(),
                    });
                    continue;
                }
                agents.push(agent);
            }
            Err(reason) => rejected.push(RegistryRejection {
                id: claimed_id,
                reason: reason.to_string(),
            }),
        }
    }
    agents.sort_by(|left, right| left.id.cmp(&right.id));
    Ok(RegistryCatalog {
        version: document.version,
        agents,
        rejected,
    })
}

fn validate_agent(raw: serde_json::Value) -> anyhow::Result<RegistryAgent> {
    let raw: RawAgent = serde_json::from_value(raw)?;
    let id = required(raw.id, "id")?;
    anyhow::ensure!(is_valid_registry_id(&id), "invalid agent id '{id}'");
    let name = required(raw.name, "name")?;
    let version = required(raw.version, "version")?;
    let description = required(raw.description, "description")?;
    let distribution = raw
        .distribution
        .ok_or_else(|| anyhow::anyhow!("missing distribution"))?;

    let mut binary = BTreeMap::new();
    for (target_name, target) in distribution.binary {
        let target_key: PlatformTarget = target_name
            .parse()
            .map_err(|error: String| anyhow::anyhow!("{error}"))?;
        anyhow::ensure!(
            !target.archive.trim().is_empty(),
            "empty archive URL for {target_key}"
        );
        anyhow::ensure!(
            is_https(&target.archive),
            "archive URL for {target_key} is not https"
        );
        anyhow::ensure!(!target.cmd.trim().is_empty(), "empty cmd for {target_key}");
        if let Some(sha256) = &target.sha256 {
            anyhow::ensure!(
                is_sha256_hex(sha256),
                "sha256 for {target_key} is not 64 hex characters"
            );
        }
        binary.insert(target_key, target);
    }
    if let Some(package) = &distribution.npx {
        anyhow::ensure!(!package.package.trim().is_empty(), "empty npx package");
    }
    if let Some(package) = &distribution.uvx {
        anyhow::ensure!(!package.package.trim().is_empty(), "empty uvx package");
    }

    let distribution = RegistryDistribution {
        binary,
        npx: distribution.npx,
        uvx: distribution.uvx,
    };
    anyhow::ensure!(!distribution.is_empty(), "no usable distribution");

    Ok(RegistryAgent {
        id,
        name,
        version,
        description,
        repository: raw.repository,
        website: raw.website,
        authors: raw.authors,
        license: raw.license,
        license_url: raw.license_url,
        icon: raw.icon,
        distribution,
    })
}

fn required(value: Option<String>, field: &str) -> anyhow::Result<String> {
    let value = value.unwrap_or_default();
    anyhow::ensure!(!value.trim().is_empty(), "missing {field}");
    Ok(value)
}

/// The registry schema pattern: `^[a-z][a-z0-9-]*$`.
fn is_valid_registry_id(id: &str) -> bool {
    let mut chars = id.chars();
    chars.next().is_some_and(|first| first.is_ascii_lowercase())
        && chars.all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '-')
}

/// Archives download over TLS only. Plain HTTP is never accepted.
pub fn is_https(url: &str) -> bool {
    url.len() > "https://".len() && url[.."https://".len()].eq_ignore_ascii_case("https://")
}

pub fn is_sha256_hex(value: &str) -> bool {
    value.len() == 64 && value.chars().all(|c| c.is_ascii_hexdigit())
}

#[cfg(test)]
mod tests {
    use super::*;

    const VALID: &str = r#"{
      "version": "1.0.0",
      "agents": [
        {
          "id": "example-acp",
          "name": "Example",
          "version": "1.2.3",
          "description": "An example agent",
          "repository": "https://example.invalid/repo",
          "website": "https://example.invalid",
          "authors": ["Someone"],
          "license": "MIT",
          "license_url": "https://example.invalid/LICENSE",
          "icon": "https://example.invalid/icon.svg",
          "distribution": {
            "binary": {
              "linux-x86_64": {
                "archive": "https://example.invalid/example-linux-x86_64.tar.gz",
                "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "cmd": "./example",
                "args": ["serve"],
                "env": {"EXAMPLE": "1"}
              }
            },
            "npx": { "package": "@scope/example@1.2.3", "args": ["--acp"] }
          }
        }
      ],
      "extensions": []
    }"#;

    #[test]
    fn full_entry_is_preserved() {
        let catalog = parse_catalog(VALID).unwrap();
        assert_eq!(catalog.version, "1.0.0");
        assert!(catalog.rejected.is_empty());
        let agent = catalog.agent("example-acp").unwrap();
        assert_eq!(agent.name, "Example");
        assert_eq!(agent.version, "1.2.3");
        assert_eq!(agent.description, "An example agent");
        assert_eq!(
            agent.repository.as_deref(),
            Some("https://example.invalid/repo")
        );
        assert_eq!(agent.website.as_deref(), Some("https://example.invalid"));
        assert_eq!(agent.authors, vec!["Someone"]);
        assert_eq!(agent.license.as_deref(), Some("MIT"));
        assert_eq!(
            agent.license_url.as_deref(),
            Some("https://example.invalid/LICENSE")
        );
        assert_eq!(
            agent.icon.as_deref(),
            Some("https://example.invalid/icon.svg")
        );

        let target = &agent.distribution.binary[&PlatformTarget::LinuxX86_64];
        assert_eq!(target.cmd, "./example");
        assert_eq!(target.args, vec!["serve"]);
        assert_eq!(target.env["EXAMPLE"], "1");
        assert!(target.sha256.is_some());
        let npx = agent.distribution.npx.as_ref().unwrap();
        assert_eq!(npx.package, "@scope/example@1.2.3");
        assert_eq!(npx.args, vec!["--acp"]);
        assert_eq!(
            agent.distribution.kinds(),
            vec![DistributionKind::Binary, DistributionKind::Npx]
        );
    }

    /// The document key `extensions` is not in the agent schema but it is in
    /// the published registry, so unknown keys must not fail the parse.
    #[test]
    fn unknown_keys_are_tolerated() {
        let catalog = parse_catalog(
            r#"{"version":"1.0.0","future":true,"agents":[
                {"id":"a","name":"A","version":"1.0.0","description":"d","surprise":1,
                 "distribution":{"npx":{"package":"a@1.0.0"}}}]}"#,
        )
        .unwrap();
        assert_eq!(catalog.agents.len(), 1);
    }

    /// A malformed document is an error. A malformed entry is a rejection, so
    /// one bad agent never costs the user the rest of the catalog.
    #[test]
    fn malformed_document_fails_and_malformed_entries_are_reported() {
        assert!(parse_catalog("not json").is_err());
        assert!(parse_catalog(r#"{"agents":[]}"#).is_err());
        assert!(parse_catalog(r#"{"version":"2.0.0","agents":[]}"#).is_err());
        assert!(parse_catalog(r#"{"version":"nope","agents":[]}"#).is_err());

        let catalog = parse_catalog(
            r#"{"version":"1.1.0","agents":[
                {"id":"good","name":"Good","version":"1.0.0","description":"d",
                 "distribution":{"uvx":{"package":"good==1.0.0"}}},
                {"id":"No Caps","name":"Bad","version":"1.0.0","description":"d",
                 "distribution":{"npx":{"package":"x@1"}}},
                {"id":"missing-name","version":"1.0.0","description":"d",
                 "distribution":{"npx":{"package":"x@1"}}},
                {"id":"no-distribution","name":"Bad","version":"1.0.0","description":"d"},
                {"id":"empty-distribution","name":"Bad","version":"1.0.0","description":"d",
                 "distribution":{}},
                {"id":"bad-platform","name":"Bad","version":"1.0.0","description":"d",
                 "distribution":{"binary":{"solaris-sparc":{"archive":"https://e.invalid/a.tgz","cmd":"./a"}}}},
                {"id":"bad-digest","name":"Bad","version":"1.0.0","description":"d",
                 "distribution":{"binary":{"linux-x86_64":{"archive":"https://e.invalid/a.tgz","cmd":"./a","sha256":"abc"}}}},
                {"id":"plain-http","name":"Bad","version":"1.0.0","description":"d",
                 "distribution":{"binary":{"linux-x86_64":{"archive":"http://e.invalid/a.tgz","cmd":"./a"}}}}
            ]}"#,
        )
        .unwrap();
        assert_eq!(catalog.agents.len(), 1);
        assert_eq!(catalog.agents[0].id, "good");
        assert_eq!(catalog.rejected.len(), 7);
        assert!(catalog
            .rejected
            .iter()
            .any(|r| r.id.as_deref() == Some("plain-http") && r.reason.contains("https")));
        assert!(catalog
            .rejected
            .iter()
            .any(|r| r.id.as_deref() == Some("missing-name") && r.reason.contains("name")));
    }

    #[test]
    fn duplicate_ids_are_rejected_rather_than_resolved_by_precedence() {
        let catalog = parse_catalog(
            r#"{"version":"1.0.0","agents":[
                {"id":"dup","name":"First","version":"1.0.0","description":"d",
                 "distribution":{"npx":{"package":"dup@1.0.0"}}},
                {"id":"dup","name":"Second","version":"2.0.0","description":"d",
                 "distribution":{"npx":{"package":"dup@2.0.0"}}}
            ]}"#,
        )
        .unwrap();
        assert_eq!(catalog.agents.len(), 1);
        assert_eq!(catalog.agent("dup").unwrap().name, "First");
        assert_eq!(catalog.rejected.len(), 1);
        assert!(catalog.rejected[0].reason.contains("duplicate"));
    }

    #[test]
    fn search_matches_id_name_and_description() {
        let catalog = parse_catalog(VALID).unwrap();
        assert_eq!(catalog.search("").len(), 1);
        assert_eq!(catalog.search("EXAMPLE-ACP").len(), 1);
        assert_eq!(catalog.search("an example").len(), 1);
        assert_eq!(catalog.search("nothing").len(), 0);
    }

    #[test]
    fn agents_are_sorted_by_id() {
        let catalog = parse_catalog(
            r#"{"version":"1.0.0","agents":[
                {"id":"zeta","name":"Z","version":"1.0.0","description":"d",
                 "distribution":{"npx":{"package":"z@1.0.0"}}},
                {"id":"alpha","name":"A","version":"1.0.0","description":"d",
                 "distribution":{"npx":{"package":"a@1.0.0"}}}
            ]}"#,
        )
        .unwrap();
        let ids: Vec<&str> = catalog.agents.iter().map(|a| a.id.as_str()).collect();
        assert_eq!(ids, vec!["alpha", "zeta"]);
    }

    #[test]
    fn https_and_digest_helpers() {
        assert!(is_https("https://example.invalid/a"));
        assert!(is_https("HTTPS://example.invalid/a"));
        assert!(!is_https("http://example.invalid/a"));
        assert!(!is_https("https://"));
        assert!(!is_https("file:///tmp/a"));
        assert!(is_sha256_hex(
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        ));
        assert!(!is_sha256_hex("e3b0c4"));
        assert!(!is_sha256_hex(&"z".repeat(64)));
    }
}
