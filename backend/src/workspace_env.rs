use std::collections::HashMap;
use std::path::{Path, PathBuf};

#[derive(Debug)]
pub enum WorkspaceEnvError {
    DirenvNotFound,
    EnvrcBlocked {
        path: PathBuf,
        relative_path: String,
        message: String,
    },
    EnvrcEscapeBoundary {
        cwd: PathBuf,
        boundary: PathBuf,
    },
    DirenvFailed {
        message: String,
    },
    Io(std::io::Error),
}

impl std::fmt::Display for WorkspaceEnvError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::DirenvNotFound => {
                write!(f, "direnv was not found on PATH but .envrc was detected")
            }
            Self::EnvrcBlocked { message, .. } => {
                write!(
                    f,
                    "This project's workspace environment needs approval: {}",
                    message
                )
            }
            Self::EnvrcEscapeBoundary { cwd, boundary } => {
                write!(
                    f,
                    "No .envrc found within validated workspace boundary {} for cwd {}",
                    boundary.display(),
                    cwd.display()
                )
            }
            Self::DirenvFailed { message } => {
                write!(f, "Failed to resolve workspace environment: {}", message)
            }
            Self::Io(err) => write!(f, "{}", err),
        }
    }
}

impl std::error::Error for WorkspaceEnvError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Self::Io(err) => Some(err),
            _ => None,
        }
    }
}

impl From<std::io::Error> for WorkspaceEnvError {
    fn from(err: std::io::Error) -> Self {
        Self::Io(err)
    }
}

pub fn find_envrc_path(cwd: &Path, boundary: &Path) -> Option<PathBuf> {
    let (cwd_canon, boundary_canon) = match (cwd.canonicalize(), boundary.canonicalize()) {
        (Ok(c), Ok(b)) => (c, b),
        _ => (cwd.to_path_buf(), boundary.to_path_buf()),
    };

    if !cwd_canon.starts_with(&boundary_canon) {
        return None;
    }

    let mut curr: Option<&Path> = Some(&cwd_canon);
    while let Some(dir) = curr {
        let path = dir.join(".envrc");
        if path.is_file() {
            return Some(path);
        }
        if dir == boundary_canon {
            break;
        }
        curr = dir.parent();
    }
    None
}

pub fn has_envrc(cwd: &Path, boundary: &Path) -> bool {
    find_envrc_path(cwd, boundary).is_some()
}

/// The effective `.envrc` location relative to the workspace boundary, for
/// display/detail purposes. Falls back to the bare file name if the path
/// cannot be expressed relative to the boundary.
fn relative_envrc_path(envrc_path: &Path, boundary: &Path) -> String {
    let boundary_canon = boundary
        .canonicalize()
        .unwrap_or_else(|_| boundary.to_path_buf());
    let envrc_canon = envrc_path
        .canonicalize()
        .unwrap_or_else(|_| envrc_path.to_path_buf());
    envrc_canon
        .strip_prefix(&boundary_canon)
        .map(|rel| rel.to_string_lossy().replace('\\', "/"))
        .unwrap_or_else(|_| {
            envrc_canon
                .file_name()
                .map(|name| name.to_string_lossy().to_string())
                .unwrap_or_default()
        })
}

/// Drops ANSI CSI/OSC escape sequences and raw control characters (other
/// than `\n`/`\t`) from an external process diagnostic before it is stored
/// on an error or ever reaches a user-facing surface.
fn strip_terminal_noise(input: &str) -> String {
    let mut out = String::with_capacity(input.len());
    let mut chars = input.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '\u{1b}' {
            match chars.peek() {
                Some('[') => {
                    // CSI: ESC '[' ... final byte in 0x40-0x7E.
                    chars.next();
                    for d in chars.by_ref() {
                        if ('\u{40}'..='\u{7e}').contains(&d) {
                            break;
                        }
                    }
                }
                Some(']') => {
                    // OSC: ESC ']' ... terminated by BEL or the next ESC.
                    chars.next();
                    while let Some(&d) = chars.peek() {
                        if d == '\u{07}' {
                            chars.next();
                            break;
                        }
                        if d == '\u{1b}' {
                            break;
                        }
                        chars.next();
                    }
                }
                _ => {
                    // A lone/unsupported escape: drop just the ESC byte.
                }
            }
            continue;
        }
        if c.is_control() && c != '\n' && c != '\t' {
            continue;
        }
        out.push(c);
    }
    out
}

/// One project's `.envrc` content identity: its location relative to the
/// workspace boundary and a cryptographic hash of its bytes.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EnvrcFingerprint {
    pub relative_path: String,
    pub content_hash: String,
}

/// Fingerprints the `.envrc` that governs `cwd` within `boundary`, or
/// `Ok(None)` when there is none to trust: no `.envrc` is present, it
/// vanished/became unreadable, or it is a symlink whose resolved target
/// escapes the validated workspace boundary. Only a boundary-safe file is
/// ever read and hashed, so a symlink-escaping `.envrc` can never be
/// fingerprinted, remembered, or auto-authorized through this function.
pub fn envrc_fingerprint(cwd: &Path, boundary: &Path) -> std::io::Result<Option<EnvrcFingerprint>> {
    let Some(envrc_path) = find_envrc_path(cwd, boundary) else {
        return Ok(None);
    };
    let boundary_canon = match boundary.canonicalize() {
        Ok(p) => p,
        Err(_) => return Ok(None),
    };
    let envrc_canon = match envrc_path.canonicalize() {
        Ok(p) => p,
        Err(_) => return Ok(None),
    };
    if !envrc_canon.starts_with(&boundary_canon) {
        return Ok(None);
    }
    let bytes = match std::fs::read(&envrc_canon) {
        Ok(bytes) => bytes,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(e) => return Err(e),
    };
    let relative_path = relative_envrc_path(&envrc_canon, &boundary_canon);
    let content_hash = crate::agents::registry::sha256_hex(&bytes);
    Ok(Some(EnvrcFingerprint {
        relative_path,
        content_hash,
    }))
}

pub async fn resolve_workspace_env(
    cwd: &Path,
    boundary: &Path,
) -> Result<HashMap<String, String>, WorkspaceEnvError> {
    resolve_workspace_env_internal("direnv", cwd, boundary).await
}

pub(crate) async fn resolve_workspace_env_internal(
    bin: &str,
    cwd: &Path,
    boundary: &Path,
) -> Result<HashMap<String, String>, WorkspaceEnvError> {
    let Some(envrc_path) = find_envrc_path(cwd, boundary) else {
        return Ok(std::env::vars().collect());
    };

    let output = match tokio::process::Command::new(bin)
        .arg("export")
        .arg("json")
        .current_dir(cwd)
        .output()
        .await
    {
        Ok(output) => output,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            return Err(WorkspaceEnvError::DirenvNotFound);
        }
        Err(e) => return Err(WorkspaceEnvError::Io(e)),
    };

    let stderr = strip_terminal_noise(String::from_utf8_lossy(&output.stderr).trim());

    if !output.status.success() {
        if is_blocked_message(&stderr) {
            return Err(WorkspaceEnvError::EnvrcBlocked {
                relative_path: relative_envrc_path(&envrc_path, boundary),
                path: envrc_path,
                message: stderr,
            });
        }
        return Err(WorkspaceEnvError::DirenvFailed { message: stderr });
    }

    if is_blocked_message(&stderr) {
        return Err(WorkspaceEnvError::EnvrcBlocked {
            relative_path: relative_envrc_path(&envrc_path, boundary),
            path: envrc_path,
            message: stderr,
        });
    }

    let stdout_str = String::from_utf8_lossy(&output.stdout);
    if stdout_str.trim().is_empty() {
        return Ok(std::env::vars().collect());
    }

    let diff: HashMap<String, Option<String>> = match serde_json::from_str(&stdout_str) {
        Ok(map) => map,
        Err(e) => {
            return Err(WorkspaceEnvError::DirenvFailed {
                message: strip_terminal_noise(&format!(
                    "Failed to parse direnv export json output: {}",
                    e
                )),
            });
        }
    };

    let mut merged: HashMap<String, String> = std::env::vars().collect();
    for (k, v) in diff {
        match v {
            Some(val) => {
                merged.insert(k, val);
            }
            None => {
                merged.remove(&k);
            }
        }
    }

    Ok(merged)
}

pub async fn direnv_allow(cwd: &Path, boundary: &Path) -> Result<(), WorkspaceEnvError> {
    direnv_allow_internal("direnv", cwd, boundary).await
}

pub(crate) async fn direnv_allow_internal(
    bin: &str,
    cwd: &Path,
    boundary: &Path,
) -> Result<(), WorkspaceEnvError> {
    let Some(envrc_path) = find_envrc_path(cwd, boundary) else {
        return Err(WorkspaceEnvError::EnvrcEscapeBoundary {
            cwd: cwd.to_path_buf(),
            boundary: boundary.to_path_buf(),
        });
    };

    let output = match tokio::process::Command::new(bin)
        .arg("allow")
        .arg(&envrc_path)
        .current_dir(cwd)
        .output()
        .await
    {
        Ok(output) => output,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            return Err(WorkspaceEnvError::DirenvNotFound);
        }
        Err(e) => return Err(WorkspaceEnvError::Io(e)),
    };

    if !output.status.success() {
        let stderr = strip_terminal_noise(String::from_utf8_lossy(&output.stderr).trim());
        return Err(WorkspaceEnvError::DirenvFailed { message: stderr });
    }

    Ok(())
}

/// Reverts a prior `direnv allow` for the `.envrc` governing `cwd` within
/// `boundary`. Used to fail closed when a fingerprint taken after an
/// automatic or remembered `allow` no longer matches the one taken before
/// it (the content changed, vanished, or started escaping the boundary in
/// that window).
pub async fn direnv_deny(cwd: &Path, boundary: &Path) -> Result<(), WorkspaceEnvError> {
    direnv_deny_internal("direnv", cwd, boundary).await
}

pub(crate) async fn direnv_deny_internal(
    bin: &str,
    cwd: &Path,
    boundary: &Path,
) -> Result<(), WorkspaceEnvError> {
    let Some(envrc_path) = find_envrc_path(cwd, boundary) else {
        return Err(WorkspaceEnvError::EnvrcEscapeBoundary {
            cwd: cwd.to_path_buf(),
            boundary: boundary.to_path_buf(),
        });
    };

    let output = match tokio::process::Command::new(bin)
        .arg("deny")
        .arg(&envrc_path)
        .current_dir(cwd)
        .output()
        .await
    {
        Ok(output) => output,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            return Err(WorkspaceEnvError::DirenvNotFound);
        }
        Err(e) => return Err(WorkspaceEnvError::Io(e)),
    };

    if !output.status.success() {
        let stderr = strip_terminal_noise(String::from_utf8_lossy(&output.stderr).trim());
        return Err(WorkspaceEnvError::DirenvFailed { message: stderr });
    }

    Ok(())
}

fn is_blocked_message(msg: &str) -> bool {
    let lower = msg.to_lowercase();
    lower.contains("is blocked")
        || lower.contains("direnv allow")
        || lower.contains("direnv: error")
        || lower.contains("not allowed")
}

pub fn merge_launch_env(
    workspace_env: &HashMap<String, String>,
    launch_env: &HashMap<String, String>,
) -> HashMap<String, String> {
    let mut env = workspace_env.clone();
    for (k, v) in launch_env {
        env.insert(k.clone(), v.clone());
    }
    env
}

/// Moves the named variables out of the process environment and returns them
/// as a stash. Startup calls this once for `--secret-env-vars` before any
/// child process is spawned, so a secret supplied through systemd
/// `EnvironmentFile` never reaches the inherited workspace environment that
/// every agent would otherwise share. Only names listed by some agent's
/// `pass_env` (or the explicit secret list) are taken; everything else stays.
pub fn take_secret_env(names: &[String]) -> HashMap<String, String> {
    let mut secrets = HashMap::new();
    for name in names {
        let name = name.trim();
        if name.is_empty() {
            continue;
        }
        if let Ok(value) = std::env::var(name) {
            secrets.insert(name.to_string(), value);
            std::env::remove_var(name);
        }
    }
    secrets
}

/// The complete environment one agent process starts with.
///
/// The workspace environment always starts from the Batey process
/// environment, which may still carry a secret that no list named (for
/// example, an operator added it to an environment file but to no redaction
/// list). Scrubbing every stashed name first keeps that accident from
/// leaking, and only the names this agent's `pass_env` lists are then
/// injected back from the stash. An agent that lists nothing receives no
/// secret, even a web-managed one.
pub fn resolve_agent_env(
    workspace_env: &HashMap<String, String>,
    launch_env: &HashMap<String, String>,
    pass_env: &[String],
    secrets: &HashMap<String, String>,
) -> HashMap<String, String> {
    let merged = merge_launch_env(workspace_env, launch_env);
    let scrubbed: HashMap<String, String> = merged
        .into_iter()
        .filter(|(name, _)| !secrets.contains_key(name))
        .collect();
    apply_pass_env_from(scrubbed, pass_env, secrets)
}

pub(crate) fn apply_pass_env_from(
    mut base: HashMap<String, String>,
    pass_env: &[String],
    source: &HashMap<String, String>,
) -> HashMap<String, String> {
    for name in pass_env {
        if let Some(value) = source.get(name) {
            base.insert(name.clone(), value.clone());
        }
    }
    base
}

pub fn merge_terminal_env(
    base: &HashMap<String, String>,
    req_env: &[agent_client_protocol_schema::v1::EnvVariable],
) -> HashMap<String, String> {
    let mut env = base.clone();
    for item in req_env {
        env.insert(item.name.clone(), item.value.clone());
    }
    env
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::os::unix::fs::PermissionsExt;
    use tokio::io::AsyncBufReadExt;

    fn fake_direnv(root: &Path) -> PathBuf {
        let path = root.join("fake-direnv");
        std::fs::write(
            &path,
            r##"#!/bin/sh
set -eu

if [ "$1" = "allow" ]; then
    touch "$2.allowed"
    exit 0
fi

if [ "$1" = "deny" ]; then
    rm -f "$2.allowed"
    exit 0
fi

dir="$PWD"
while [ ! -f "$dir/.envrc" ]; do
    parent=$(dirname "$dir")
    [ "$parent" = "$dir" ] && exit 1
    dir="$parent"
done

if [ ! -f "$dir/.envrc.allowed" ]; then
    echo "direnv: error .envrc is blocked" >&2
    exit 1
fi

json=""
while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
        export\ *=*) assignment=${line#export }; key=${assignment%%=*}; value=${assignment#*=}; item="\"$key\":\"$value\"" ;;
        unset\ *) key=${line#unset }; item="\"$key\":null" ;;
        *) continue ;;
    esac
    [ -z "$json" ] || json="$json,"
    json="$json$item"
done < "$dir/.envrc"
printf '{%s}\n' "$json"
"##,
        )
        .unwrap();
        std::fs::set_permissions(&path, std::fs::Permissions::from_mode(0o755)).unwrap();
        path
    }

    #[test]
    fn test_merge_precedence() {
        let mut base = HashMap::new();
        base.insert("BATEY".to_string(), "1".to_string());
        base.insert("OVERRIDE".to_string(), "base".to_string());

        let mut launch = HashMap::new();
        launch.insert("OVERRIDE".to_string(), "launch".to_string());
        launch.insert("LAUNCH_ONLY".to_string(), "launch".to_string());

        let merged = merge_launch_env(&base, &launch);
        assert_eq!(merged.get("BATEY").unwrap(), "1");
        assert_eq!(merged.get("OVERRIDE").unwrap(), "launch");
        assert_eq!(merged.get("LAUNCH_ONLY").unwrap(), "launch");

        let terminal_overlay = vec![agent_client_protocol_schema::v1::EnvVariable::new(
            "OVERRIDE", "terminal",
        )];
        let term_merged = merge_terminal_env(&merged, &terminal_overlay);
        assert_eq!(term_merged.get("OVERRIDE").unwrap(), "terminal");
    }

    #[test]
    fn test_pass_env_overlays_process_values_and_keeps_missing() {
        let mut base = HashMap::new();
        base.insert("SECRET".to_string(), "workspace".to_string());
        base.insert("KEEP".to_string(), "base".to_string());
        let mut source = HashMap::new();
        source.insert("SECRET".to_string(), "runtime".to_string());

        let merged =
            apply_pass_env_from(base, &["SECRET".to_string(), "ABSENT".to_string()], &source);
        assert_eq!(merged.get("SECRET").unwrap(), "runtime");
        assert_eq!(merged.get("KEEP").unwrap(), "base");
        assert!(!merged.contains_key("ABSENT"));
    }

    /// Two agents with two different secrets must never see each other's
    /// values, and an agent that lists nothing must see neither. The
    /// workspace base deliberately still carries both secrets, simulating a
    /// process environment that an environment file filled, so the test
    /// proves the scrub-then-inject order rather than a clean fixture.
    #[test]
    fn agent_secrets_are_isolated_per_agent() {
        let workspace_base: HashMap<String, String> = HashMap::from([
            ("PATH".to_string(), "/bin".to_string()),
            ("AGENT_A_TOKEN".to_string(), "aaa".to_string()),
            ("AGENT_B_TOKEN".to_string(), "bbb".to_string()),
        ]);
        let launch_env = HashMap::new();
        let secrets: HashMap<String, String> = HashMap::from([
            ("AGENT_A_TOKEN".to_string(), "aaa".to_string()),
            ("AGENT_B_TOKEN".to_string(), "bbb".to_string()),
        ]);

        let env_a = resolve_agent_env(
            &workspace_base,
            &launch_env,
            &["AGENT_A_TOKEN".to_string()],
            &secrets,
        );
        assert_eq!(env_a.get("AGENT_A_TOKEN").map(String::as_str), Some("aaa"));
        assert!(!env_a.contains_key("AGENT_B_TOKEN"));
        assert_eq!(env_a.get("PATH").map(String::as_str), Some("/bin"));

        let env_b = resolve_agent_env(
            &workspace_base,
            &launch_env,
            &["AGENT_B_TOKEN".to_string()],
            &secrets,
        );
        assert_eq!(env_b.get("AGENT_B_TOKEN").map(String::as_str), Some("bbb"));
        assert!(!env_b.contains_key("AGENT_A_TOKEN"));

        // A web-managed agent lists no pass_env and receives no secret.
        let env_plain = resolve_agent_env(&workspace_base, &launch_env, &[], &secrets);
        assert!(!env_plain.contains_key("AGENT_A_TOKEN"));
        assert!(!env_plain.contains_key("AGENT_B_TOKEN"));
        assert_eq!(env_plain.get("PATH").map(String::as_str), Some("/bin"));
    }

    #[test]
    fn take_secret_env_moves_listed_names_out_of_the_process() {
        unsafe {
            std::env::set_var("BATEY_TEST_SECRET_TAKE_A", "aaa");
            std::env::set_var("BATEY_TEST_SECRET_TAKE_B", "bbb");
        }
        let stashed = take_secret_env(&[
            "BATEY_TEST_SECRET_TAKE_A".to_string(),
            "  ".to_string(),
            "BATEY_TEST_SECRET_TAKE_ABSENT".to_string(),
        ]);
        assert_eq!(
            stashed.get("BATEY_TEST_SECRET_TAKE_A").map(String::as_str),
            Some("aaa")
        );
        assert!(std::env::var("BATEY_TEST_SECRET_TAKE_A").is_err());
        // Anything not listed is left alone.
        assert_eq!(
            std::env::var("BATEY_TEST_SECRET_TAKE_B").as_deref(),
            Ok("bbb")
        );
        unsafe {
            std::env::remove_var("BATEY_TEST_SECRET_TAKE_B");
        }
    }

    #[tokio::test]
    async fn test_no_envrc_returns_base_env() {
        let temp_dir = tempfile::tempdir().unwrap();
        assert!(!has_envrc(temp_dir.path(), temp_dir.path()));
        let env = resolve_workspace_env(temp_dir.path(), temp_dir.path())
            .await
            .unwrap();
        assert_eq!(env.get("PATH"), std::env::var("PATH").ok().as_ref());
    }

    #[tokio::test]
    async fn additional_root_envrc_is_not_consulted_for_primary_workspace() {
        let primary = tempfile::tempdir().unwrap();
        let additional = tempfile::tempdir().unwrap();
        std::fs::write(
            additional.path().join(".envrc"),
            "export LEAKED_FROM_ADDITIONAL_ROOT=1\n",
        )
        .unwrap();

        // Session startup resolves only its primary cwd/boundary. An envrc in
        // an attached root is neither discovered nor handed to direnv.
        assert!(!has_envrc(primary.path(), primary.path()));
        assert!(has_envrc(additional.path(), additional.path()));
        let env = resolve_workspace_env(primary.path(), primary.path())
            .await
            .unwrap();
        assert_ne!(
            env.get("LEAKED_FROM_ADDITIONAL_ROOT"),
            Some(&"1".to_string())
        );

        // The remember/auto-allow fingerprint is computed against the
        // primary boundary only; an additional root's .envrc must never
        // contribute to it, matching its exclusion from env resolution.
        assert!(envrc_fingerprint(primary.path(), primary.path())
            .unwrap()
            .is_none());
        assert!(envrc_fingerprint(additional.path(), additional.path())
            .unwrap()
            .is_some());
    }

    #[tokio::test]
    async fn test_missing_direnv_executable() {
        let temp_dir = tempfile::tempdir().unwrap();
        std::fs::write(temp_dir.path().join(".envrc"), "export TEST_VAR=123\n").unwrap();
        assert!(has_envrc(temp_dir.path(), temp_dir.path()));

        let err = resolve_workspace_env_internal(
            "nonexistent-direnv-cmd-9999",
            temp_dir.path(),
            temp_dir.path(),
        )
        .await
        .unwrap_err();
        assert!(matches!(err, WorkspaceEnvError::DirenvNotFound));

        let err_allow = direnv_allow_internal(
            "nonexistent-direnv-cmd-9999",
            temp_dir.path(),
            temp_dir.path(),
        )
        .await
        .unwrap_err();
        assert!(matches!(err_allow, WorkspaceEnvError::DirenvNotFound));
    }

    #[tokio::test]
    async fn test_blocked_envrc_and_direnv_allow_flow() {
        let temp_dir = tempfile::tempdir().unwrap();
        let direnv = fake_direnv(temp_dir.path());
        let envrc_path = temp_dir.path().join(".envrc");
        std::fs::write(&envrc_path, "export DIREnv_TEST_VAR=batey_test_123\n").unwrap();

        // 1. Unapproved .envrc must return EnvrcBlocked
        let err = resolve_workspace_env_internal(
            direnv.to_str().unwrap(),
            temp_dir.path(),
            temp_dir.path(),
        )
        .await
        .unwrap_err();
        match err {
            WorkspaceEnvError::EnvrcBlocked {
                path,
                relative_path,
                message,
            } => {
                let expected_canonical = envrc_path
                    .canonicalize()
                    .unwrap_or_else(|_| envrc_path.clone());
                let actual_canonical = path.canonicalize().unwrap_or_else(|_| path.clone());
                assert_eq!(actual_canonical, expected_canonical);
                assert_eq!(relative_path, ".envrc");
                let lower = message.to_lowercase();
                assert!(lower.contains("blocked") || lower.contains("allow"));
            }
            other => panic!("expected EnvrcBlocked, got {:?}", other),
        }

        // 2. Authorize via direnv_allow
        direnv_allow_internal(direnv.to_str().unwrap(), temp_dir.path(), temp_dir.path())
            .await
            .expect("direnv allow should succeed");

        // 3. Now resolve_workspace_env must succeed and include exported variable
        let resolved = resolve_workspace_env_internal(
            direnv.to_str().unwrap(),
            temp_dir.path(),
            temp_dir.path(),
        )
        .await
        .expect("resolve should succeed after allow");
        assert_eq!(
            resolved.get("DIREnv_TEST_VAR").map(|s| s.as_str()),
            Some("batey_test_123")
        );
    }

    #[tokio::test]
    async fn test_unset_variable_propagation_and_spawn() {
        let temp_dir = tempfile::tempdir().unwrap();
        let direnv = fake_direnv(temp_dir.path());
        let test_unset_key = "BATEY_TEST_INHERITED_UNSET_VAR";
        unsafe {
            std::env::set_var(test_unset_key, "should_be_removed_by_direnv");
        }

        std::fs::write(
            temp_dir.path().join(".envrc"),
            format!(
                "unset {}\nexport BATEY_RETAINED_TEST=kept\n",
                test_unset_key
            ),
        )
        .unwrap();

        direnv_allow_internal(direnv.to_str().unwrap(), temp_dir.path(), temp_dir.path())
            .await
            .unwrap();

        let resolved = resolve_workspace_env_internal(
            direnv.to_str().unwrap(),
            temp_dir.path(),
            temp_dir.path(),
        )
        .await
        .unwrap();
        assert!(!resolved.contains_key(test_unset_key));
        assert_eq!(
            resolved.get("BATEY_RETAINED_TEST").map(|s| s.as_str()),
            Some("kept")
        );

        let proc = crate::acp::process::AcpProcess::spawn(
            "sh",
            &[
                "-c".into(),
                format!(
                    "echo UNSET=${} RETAINED=$BATEY_RETAINED_TEST",
                    test_unset_key
                ),
            ],
            &resolved,
            temp_dir.path(),
        )
        .expect("spawn sh should succeed");

        let mut reader = proc.stdout;
        let mut line = String::new();
        reader.read_line(&mut line).await.unwrap();
        assert_eq!(line.trim(), "UNSET= RETAINED=kept");

        unsafe {
            std::env::remove_var(test_unset_key);
        }
    }

    #[tokio::test]
    async fn test_worktree_and_direct_checkout_nested_envrc() {
        let temp_dir = tempfile::tempdir().unwrap();
        let direnv = fake_direnv(temp_dir.path());
        let root = temp_dir.path();
        let envrc_path = root.join(".envrc");
        std::fs::write(&envrc_path, "export WORKTREE_TEST_VAR=nested_authorized\n").unwrap();

        let nested_worktree = root.join("worktrees").join("branch-xyz");
        std::fs::create_dir_all(&nested_worktree).unwrap();

        assert!(has_envrc(&nested_worktree, root));
        let found = find_envrc_path(&nested_worktree, root).unwrap();
        let expected_canonical = envrc_path
            .canonicalize()
            .unwrap_or_else(|_| envrc_path.clone());
        let found_canonical = found.canonicalize().unwrap_or_else(|_| found.clone());
        assert_eq!(found_canonical, expected_canonical);

        direnv_allow_internal(direnv.to_str().unwrap(), root, root)
            .await
            .unwrap();

        let resolved =
            resolve_workspace_env_internal(direnv.to_str().unwrap(), &nested_worktree, root)
                .await
                .unwrap();
        assert_eq!(
            resolved.get("WORKTREE_TEST_VAR").map(|s| s.as_str()),
            Some("nested_authorized")
        );
    }

    #[tokio::test]
    async fn test_refuses_to_discover_or_authorize_envrc_above_boundary() {
        let temp_dir = tempfile::tempdir().unwrap();
        let root = temp_dir.path();
        let ancestor_envrc = root.join(".envrc");
        std::fs::write(&ancestor_envrc, "export ANCESTOR_VAR=escaped\n").unwrap();

        let boundary = root.join("workspace_boundary");
        let nested_cwd = boundary.join("packages").join("app");
        std::fs::create_dir_all(&nested_cwd).unwrap();

        // 1. Inside boundary, there is no .envrc
        assert!(!has_envrc(&nested_cwd, &boundary));
        assert!(find_envrc_path(&nested_cwd, &boundary).is_none());

        // 2. Resolving workspace env returns base env without discovering ancestor .envrc
        let resolved = resolve_workspace_env(&nested_cwd, &boundary).await.unwrap();
        assert!(!resolved.contains_key("ANCESTOR_VAR"));

        // 3. Attempting to direnv_allow above boundary is explicitly rejected
        let err = direnv_allow(&nested_cwd, &boundary).await.unwrap_err();
        assert!(matches!(err, WorkspaceEnvError::EnvrcEscapeBoundary { .. }));
    }

    #[test]
    fn strip_terminal_noise_removes_ansi_and_control_bytes() {
        let raw = "\x1b[31mdirenv: error .envrc is blocked\x1b[0m\r\nline two\t\x07";
        let cleaned = strip_terminal_noise(raw);
        assert_eq!(cleaned, "direnv: error .envrc is blocked\nline two\t");
        assert!(!cleaned.contains('\u{1b}'));
    }

    #[test]
    fn strip_terminal_noise_drops_osc_sequences() {
        let raw = "before\x1b]0;window title\x07after";
        assert_eq!(strip_terminal_noise(raw), "beforeafter");
    }

    #[tokio::test]
    async fn envrc_fingerprint_matches_identical_content_and_changes_on_edit() {
        let temp_dir = tempfile::tempdir().unwrap();
        let root = temp_dir.path();
        std::fs::write(root.join(".envrc"), "export FP_TEST=1\n").unwrap();

        let first = envrc_fingerprint(root, root).unwrap().unwrap();
        let again = envrc_fingerprint(root, root).unwrap().unwrap();
        assert_eq!(first, again);
        assert_eq!(first.relative_path, ".envrc");

        std::fs::write(root.join(".envrc"), "export FP_TEST=2\n").unwrap();
        let after_edit = envrc_fingerprint(root, root).unwrap().unwrap();
        assert_ne!(first.content_hash, after_edit.content_hash);
        assert_eq!(after_edit.relative_path, first.relative_path);
    }

    #[tokio::test]
    async fn envrc_fingerprint_is_none_without_an_envrc() {
        let temp_dir = tempfile::tempdir().unwrap();
        assert!(envrc_fingerprint(temp_dir.path(), temp_dir.path())
            .unwrap()
            .is_none());
    }

    #[tokio::test]
    async fn envrc_fingerprint_rejects_symlink_escaping_the_boundary() {
        let temp_dir = tempfile::tempdir().unwrap();
        let outside = temp_dir.path().join("outside_secret.envrc");
        std::fs::write(&outside, "export SHOULD_NEVER_BE_FINGERPRINTED=1\n").unwrap();

        let boundary = temp_dir.path().join("boundary");
        std::fs::create_dir_all(&boundary).unwrap();
        std::os::unix::fs::symlink(&outside, boundary.join(".envrc")).unwrap();

        // The symlink itself lives inside the boundary, so it is discovered...
        assert!(find_envrc_path(&boundary, &boundary).is_some());
        // ...but its resolved target escapes the boundary, so it must never
        // be hashed, remembered, or auto-authorized.
        assert!(envrc_fingerprint(&boundary, &boundary).unwrap().is_none());
    }

    #[tokio::test]
    async fn direnv_deny_reverts_a_prior_allow() {
        let temp_dir = tempfile::tempdir().unwrap();
        let direnv = fake_direnv(temp_dir.path());
        std::fs::write(temp_dir.path().join(".envrc"), "export DENY_TEST_VAR=1\n").unwrap();

        direnv_allow_internal(direnv.to_str().unwrap(), temp_dir.path(), temp_dir.path())
            .await
            .unwrap();
        resolve_workspace_env_internal(direnv.to_str().unwrap(), temp_dir.path(), temp_dir.path())
            .await
            .expect("resolve should succeed once allowed");

        direnv_deny_internal(direnv.to_str().unwrap(), temp_dir.path(), temp_dir.path())
            .await
            .expect("direnv deny should succeed");

        let err = resolve_workspace_env_internal(
            direnv.to_str().unwrap(),
            temp_dir.path(),
            temp_dir.path(),
        )
        .await
        .unwrap_err();
        assert!(matches!(err, WorkspaceEnvError::EnvrcBlocked { .. }));
    }
}
