//! The durable record behind one installed agent.
//!
//! Registry installs and Batey-managed definitions share this record and the
//! one catalog it feeds. A registry install stores a snapshot of the chosen
//! manifest and distribution, so the agent launches from pinned data and
//! never contacts the live registry to start a session.
use super::definition::{
    AgentAvailability, AgentDefinition, AgentDisplay, AgentSource, DEFAULT_IDLE_TIMEOUT_SECS,
};
use super::registry::PlatformTarget;
use crate::acp::callbacks::CallbackPolicy;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::path::{Path, PathBuf};
use std::time::Duration;

/// The launch data a registry install pinned, plus where it came from.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RegistrySnapshot {
    /// The registry id, which stays separate from the Batey catalog id so a
    /// legacy Batey id is never rewritten into a registry id.
    pub registry_id: String,
    pub registry_version: String,
    pub distribution: InstalledDistribution,
    /// Where the extracted binary lives. Absent for package distributions.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub install_dir: Option<String>,
    pub installed_at: String,
}

/// The pinned distribution. Every field needed to launch is here, so a
/// registry outage cannot stop an installed agent.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum InstalledDistribution {
    Binary {
        target: PlatformTarget,
        archive: String,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        sha256: Option<String>,
        /// The launch command the manifest named, relative to `install_dir`.
        cmd: String,
        #[serde(default)]
        args: Vec<String>,
        #[serde(default)]
        env: BTreeMap<String, String>,
        /// Whether the download was checked against registry integrity
        /// metadata. False means the manifest carried no digest.
        #[serde(default)]
        integrity_verified: bool,
    },
    Npx {
        /// The exact package spec, version included. It is never re-resolved.
        package: String,
        #[serde(default)]
        args: Vec<String>,
        #[serde(default)]
        env: BTreeMap<String, String>,
    },
    Uvx {
        package: String,
        #[serde(default)]
        args: Vec<String>,
        #[serde(default)]
        env: BTreeMap<String, String>,
    },
}

impl InstalledDistribution {
    pub fn kind(&self) -> super::registry::DistributionKind {
        use super::registry::DistributionKind;
        match self {
            Self::Binary { .. } => DistributionKind::Binary,
            Self::Npx { .. } => DistributionKind::Npx,
            Self::Uvx { .. } => DistributionKind::Uvx,
        }
    }

    /// The external program a package distribution needs on `PATH`. A binary
    /// distribution needs nothing beyond its own extracted files.
    pub fn runtime_requirement(&self) -> Option<&'static str> {
        match self {
            Self::Binary { .. } => None,
            Self::Npx { .. } => "npx".into(),
            Self::Uvx { .. } => "uvx".into(),
        }
    }

    pub fn package(&self) -> Option<&str> {
        match self {
            Self::Binary { .. } => None,
            Self::Npx { package, .. } | Self::Uvx { package, .. } => Some(package),
        }
    }
}

/// One durable installed-agent row.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct InstalledAgent {
    /// The Batey catalog id. It is chosen once and never rewritten.
    pub id: String,
    pub source: AgentSource,
    pub display_name: String,
    pub command: String,
    #[serde(default)]
    pub args: Vec<String>,
    #[serde(default)]
    pub env: BTreeMap<String, String>,
    pub idle_timeout_secs: u64,
    #[serde(default)]
    pub usage_provider: Option<String>,
    #[serde(default)]
    pub metadata: serde_json::Value,
    #[serde(default)]
    pub default_permission_policy: CallbackPolicy,
    #[serde(default)]
    pub display: AgentDisplay,
    #[serde(default)]
    pub registry: Option<RegistrySnapshot>,
    /// Set when the agent was uninstalled while durable chats still named it.
    /// The catalog keeps the entry so those chats stay readable, and marks it
    /// unavailable so no new session starts.
    #[serde(default)]
    pub retired: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retired_reason: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl InstalledAgent {
    pub fn new(id: String, source: AgentSource, command: String) -> Self {
        let now = chrono::Utc::now().to_rfc3339();
        Self {
            display_name: id.clone(),
            id,
            source,
            command,
            args: Vec::new(),
            env: BTreeMap::new(),
            idle_timeout_secs: DEFAULT_IDLE_TIMEOUT_SECS,
            usage_provider: None,
            metadata: serde_json::Value::Null,
            default_permission_policy: CallbackPolicy::Ask,
            display: AgentDisplay::default(),
            registry: None,
            retired: false,
            retired_reason: None,
            created_at: now.clone(),
            updated_at: now,
        }
    }

    /// The catalog projection. `probe` decides availability, so the catalog
    /// reports a missing runtime instead of failing at session start.
    pub fn to_definition(&self, probe: &dyn RuntimeProbe) -> AgentDefinition {
        let definition = AgentDefinition::new(self.id.clone(), self.command.clone())
            .with_args(self.args.clone())
            .with_env(self.env.clone().into_iter().collect())
            .with_idle_timeout(Duration::from_secs(self.idle_timeout_secs))
            .with_display_name(self.display_name.clone())
            .with_usage_provider(self.usage_provider.clone())
            .with_metadata(self.metadata.clone())
            .with_callback_policy(self.default_permission_policy.clone())
            .with_display(self.display.clone())
            .with_source(self.source);
        match self.unavailable_reason(probe) {
            Some(reason) => definition.with_unavailable_reason(reason),
            None => definition,
        }
    }

    fn unavailable_reason(&self, probe: &dyn RuntimeProbe) -> Option<String> {
        if self.retired {
            return Some(
                self.retired_reason
                    .clone()
                    .unwrap_or_else(|| "This agent was uninstalled.".into()),
            );
        }
        let snapshot = self.registry.as_ref()?;
        match &snapshot.distribution {
            InstalledDistribution::Binary { .. } => {
                let installed = Path::new(&self.command);
                probe.is_file(installed).then_some(()).map_or_else(
                    || {
                        Some(format!(
                            "The installed binary is missing at {}. Reinstall the agent.",
                            self.command
                        ))
                    },
                    |()| None,
                )
            }
            InstalledDistribution::Npx { .. } | InstalledDistribution::Uvx { .. } => {
                let required = snapshot.distribution.runtime_requirement()?;
                probe.on_path(required).then_some(()).map_or_else(
                    || Some(format!("'{required}' was not found on PATH.")),
                    |()| None,
                )
            }
        }
    }

    pub fn availability(&self, probe: &dyn RuntimeProbe) -> AgentAvailability {
        match self.unavailable_reason(probe) {
            Some(_) => AgentAvailability::Unavailable,
            None => AgentAvailability::Available,
        }
    }

    pub fn touch(&mut self) {
        self.updated_at = chrono::Utc::now().to_rfc3339();
    }
}

/// How the catalog checks that an installed agent can still start. It is a
/// trait so tests decide what exists without touching the host.
pub trait RuntimeProbe: Send + Sync {
    /// Whether an executable of this name is on `PATH`.
    fn on_path(&self, program: &str) -> bool;
    /// Whether this exact path is a file.
    fn is_file(&self, path: &Path) -> bool;
}

/// The probe that reads the real host.
#[derive(Debug, Default, Clone, Copy)]
pub struct HostRuntimeProbe;

impl RuntimeProbe for HostRuntimeProbe {
    fn on_path(&self, program: &str) -> bool {
        which(program).is_some()
    }

    fn is_file(&self, path: &Path) -> bool {
        path.is_file()
    }
}

/// A `PATH` lookup with no shell and no provider-specific knowledge. Windows
/// extensions come from `PATHEXT`, with the documented default as a fallback.
pub fn which(program: &str) -> Option<PathBuf> {
    which_in(program, std::env::var_os("PATH")?.as_os_str())
}

/// The search itself, with the search path supplied. Tests call this so they
/// never change the environment of the whole test process.
pub fn which_in(program: &str, search_path: &std::ffi::OsStr) -> Option<PathBuf> {
    if program.is_empty() {
        return None;
    }
    let candidate = Path::new(program);
    if candidate.components().count() > 1 || candidate.is_absolute() {
        return candidate.is_file().then(|| candidate.to_path_buf());
    }
    for directory in std::env::split_paths(search_path) {
        if directory.as_os_str().is_empty() {
            continue;
        }
        let direct = directory.join(program);
        if is_executable_file(&direct) {
            return Some(direct);
        }
        for extension in executable_extensions() {
            let with_extension = directory.join(format!("{program}{extension}"));
            if is_executable_file(&with_extension) {
                return Some(with_extension);
            }
        }
    }
    None
}

fn is_executable_file(path: &Path) -> bool {
    if !path.is_file() {
        return false;
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        path.metadata()
            .map(|metadata| metadata.permissions().mode() & 0o111 != 0)
            .unwrap_or(false)
    }
    #[cfg(not(unix))]
    {
        true
    }
}

fn executable_extensions() -> Vec<String> {
    if !cfg!(windows) {
        return Vec::new();
    }
    let raw = std::env::var("PATHEXT").unwrap_or_else(|_| ".COM;.EXE;.BAT;.CMD".to_string());
    raw.split(';')
        .map(str::trim)
        .filter(|extension| !extension.is_empty())
        .map(str::to_lowercase)
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A probe that answers from a fixed list, so the test never depends on
    /// what the host happens to have installed.
    struct FakeProbe {
        on_path: Vec<&'static str>,
        files: Vec<PathBuf>,
    }

    impl RuntimeProbe for FakeProbe {
        fn on_path(&self, program: &str) -> bool {
            self.on_path.contains(&program)
        }
        fn is_file(&self, path: &Path) -> bool {
            self.files.iter().any(|known| known == path)
        }
    }

    fn npx_record() -> InstalledAgent {
        let mut record = InstalledAgent::new("codex".into(), AgentSource::Registry, "npx".into());
        record.args = vec!["--yes".into(), "@scope/codex-acp@1.11.0".into()];
        record.registry = Some(RegistrySnapshot {
            registry_id: "codex-acp".into(),
            registry_version: "1.11.0".into(),
            distribution: InstalledDistribution::Npx {
                package: "@scope/codex-acp@1.11.0".into(),
                args: Vec::new(),
                env: BTreeMap::new(),
            },
            install_dir: None,
            installed_at: chrono::Utc::now().to_rfc3339(),
        });
        record
    }

    #[test]
    fn record_round_trips_through_json() {
        let record = npx_record();
        let json = serde_json::to_string(&record).unwrap();
        let parsed: InstalledAgent = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed, record);
    }

    #[test]
    fn a_package_distribution_reports_its_runtime_requirement() {
        let record = npx_record();
        let snapshot = record.registry.as_ref().unwrap();
        assert_eq!(snapshot.distribution.runtime_requirement(), Some("npx"));
        assert_eq!(
            snapshot.distribution.package(),
            Some("@scope/codex-acp@1.11.0")
        );

        let available = FakeProbe {
            on_path: vec!["npx"],
            files: Vec::new(),
        };
        assert_eq!(
            record.availability(&available),
            AgentAvailability::Available
        );

        let missing = FakeProbe {
            on_path: Vec::new(),
            files: Vec::new(),
        };
        assert_eq!(
            record.availability(&missing),
            AgentAvailability::Unavailable
        );
        let definition = record.to_definition(&missing);
        assert!(definition.unavailable_reason.unwrap().contains("npx"));
    }

    #[test]
    fn a_binary_distribution_needs_its_installed_file() {
        let mut record = InstalledAgent::new(
            "amp".into(),
            AgentSource::Registry,
            "/data/agents/amp/0.9.0/amp-acp".into(),
        );
        record.registry = Some(RegistrySnapshot {
            registry_id: "amp-acp".into(),
            registry_version: "0.9.0".into(),
            distribution: InstalledDistribution::Binary {
                target: PlatformTarget::LinuxX86_64,
                archive: "https://e.invalid/amp.tar.gz".into(),
                sha256: None,
                cmd: "./amp-acp".into(),
                args: Vec::new(),
                env: BTreeMap::new(),
                integrity_verified: false,
            },
            install_dir: Some("/data/agents/amp/0.9.0".into()),
            installed_at: chrono::Utc::now().to_rfc3339(),
        });
        assert_eq!(
            record
                .registry
                .as_ref()
                .unwrap()
                .distribution
                .runtime_requirement(),
            None
        );

        let present = FakeProbe {
            on_path: Vec::new(),
            files: vec![PathBuf::from("/data/agents/amp/0.9.0/amp-acp")],
        };
        assert_eq!(record.availability(&present), AgentAvailability::Available);

        let gone = FakeProbe {
            on_path: Vec::new(),
            files: Vec::new(),
        };
        let definition = record.to_definition(&gone);
        assert_eq!(definition.availability, AgentAvailability::Unavailable);
        assert!(definition.unavailable_reason.unwrap().contains("missing"));
    }

    /// A retired record stays in the catalog so the chats that name it keep
    /// their history, and it never becomes launchable again by probing.
    #[test]
    fn a_retired_record_is_always_unavailable() {
        let mut record = npx_record();
        record.retired = true;
        record.retired_reason = Some("Uninstalled on request.".into());
        let probe = FakeProbe {
            on_path: vec!["npx"],
            files: Vec::new(),
        };
        let definition = record.to_definition(&probe);
        assert_eq!(definition.availability, AgentAvailability::Unavailable);
        assert_eq!(
            definition.unavailable_reason.as_deref(),
            Some("Uninstalled on request.")
        );
    }

    /// A Batey-managed definition carries no registry snapshot, so nothing
    /// is probed and the user's own command is offered as written.
    #[test]
    fn a_custom_record_is_available_without_probing() {
        let record =
            InstalledAgent::new("private".into(), AgentSource::BateyManaged, "my-acp".into());
        let probe = FakeProbe {
            on_path: Vec::new(),
            files: Vec::new(),
        };
        let definition = record.to_definition(&probe);
        assert_eq!(definition.availability, AgentAvailability::Available);
        assert_eq!(definition.source, AgentSource::BateyManaged);
        assert_eq!(definition.launch.command, "my-acp");
    }

    #[test]
    fn definition_carries_every_stored_launch_field() {
        let mut record =
            InstalledAgent::new("private".into(), AgentSource::BateyManaged, "my-acp".into());
        record.display_name = "My Agent".into();
        record.args = vec!["--acp".into()];
        record.env.insert("KEY".into(), "value".into());
        record.idle_timeout_secs = 42;
        record.usage_provider = Some("internal".into());
        record.metadata = serde_json::json!({"team": "platform"});
        record.default_permission_policy = CallbackPolicy::ReadOnly;
        record.display.description = Some("Private agent".into());

        let probe = FakeProbe {
            on_path: Vec::new(),
            files: Vec::new(),
        };
        let definition = record.to_definition(&probe);
        assert_eq!(definition.display_name, "My Agent");
        assert_eq!(definition.launch.args, vec!["--acp"]);
        assert_eq!(definition.launch.env["KEY"], "value");
        assert_eq!(definition.launch.idle_timeout, Duration::from_secs(42));
        assert_eq!(definition.usage_provider.as_deref(), Some("internal"));
        assert_eq!(definition.metadata["team"], "platform");
        assert_eq!(
            definition.default_permission_policy,
            CallbackPolicy::ReadOnly
        );
        assert_eq!(
            definition.display.description.as_deref(),
            Some("Private agent")
        );
    }

    #[test]
    fn which_finds_a_program_in_path_and_ignores_a_missing_one() {
        let tmp = tempfile::tempdir().unwrap();
        let program = tmp.path().join("batey-test-program");
        std::fs::write(&program, "#!/bin/sh\n").unwrap();
        #[cfg(unix)]
        std::fs::set_permissions(
            &program,
            std::os::unix::fs::PermissionsExt::from_mode(0o755),
        )
        .unwrap();
        let search_path = tmp.path().as_os_str();

        assert_eq!(which_in("batey-test-program", search_path), Some(program));
        assert_eq!(which_in("batey-test-absent", search_path), None);
        assert_eq!(which_in("", search_path), None);
    }

    #[test]
    fn which_ignores_non_executable_files() {
        let tmp = tempfile::tempdir().unwrap();
        let program = tmp.path().join("opencode");
        std::fs::write(&program, "not executable").unwrap();
        assert_eq!(which_in("opencode", tmp.path().as_os_str()), None);
    }

    /// An explicit path is checked directly, never searched for on `PATH`.
    #[test]
    fn which_accepts_an_explicit_path() {
        let tmp = tempfile::tempdir().unwrap();
        let program = tmp.path().join("agent-acp");
        std::fs::write(&program, "#!/bin/sh\n").unwrap();
        #[cfg(unix)]
        std::fs::set_permissions(
            &program,
            std::os::unix::fs::PermissionsExt::from_mode(0o755),
        )
        .unwrap();
        let empty = std::ffi::OsStr::new("");
        assert_eq!(
            which_in(&program.display().to_string(), empty),
            Some(program)
        );
        assert_eq!(
            which_in(&tmp.path().join("absent").display().to_string(), empty),
            None
        );
    }
}
