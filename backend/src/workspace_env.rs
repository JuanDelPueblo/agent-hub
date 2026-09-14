use std::collections::HashMap;
use std::path::{Path, PathBuf};

#[derive(Debug)]
pub enum WorkspaceEnvError {
    DirenvNotFound,
    EnvrcBlocked { path: PathBuf, message: String },
    EnvrcEscapeBoundary { cwd: PathBuf, boundary: PathBuf },
    DirenvFailed { message: String },
    Io(std::io::Error),
}

impl std::fmt::Display for WorkspaceEnvError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::DirenvNotFound => {
                write!(f, "direnv was not found on PATH but .envrc was detected")
            }
            Self::EnvrcBlocked { message, .. } => {
                write!(f, "Workspace environment is blocked: {}", message)
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

    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        if is_blocked_message(&stderr) {
            return Err(WorkspaceEnvError::EnvrcBlocked {
                path: envrc_path,
                message: stderr.trim().to_string(),
            });
        }
        return Err(WorkspaceEnvError::DirenvFailed {
            message: stderr.trim().to_string(),
        });
    }

    if is_blocked_message(&stderr) {
        return Err(WorkspaceEnvError::EnvrcBlocked {
            path: envrc_path,
            message: stderr.trim().to_string(),
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
                message: format!("Failed to parse direnv export json output: {}", e),
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
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(WorkspaceEnvError::DirenvFailed {
            message: stderr.trim().to_string(),
        });
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
    use tokio::io::AsyncBufReadExt;

    #[test]
    fn test_merge_precedence() {
        let mut base = HashMap::new();
        base.insert("PUEBLO".to_string(), "1".to_string());
        base.insert("OVERRIDE".to_string(), "base".to_string());

        let mut launch = HashMap::new();
        launch.insert("OVERRIDE".to_string(), "launch".to_string());
        launch.insert("LAUNCH_ONLY".to_string(), "launch".to_string());

        let merged = merge_launch_env(&base, &launch);
        assert_eq!(merged.get("PUEBLO").unwrap(), "1");
        assert_eq!(merged.get("OVERRIDE").unwrap(), "launch");
        assert_eq!(merged.get("LAUNCH_ONLY").unwrap(), "launch");

        let terminal_overlay = vec![agent_client_protocol_schema::v1::EnvVariable::new(
            "OVERRIDE", "terminal",
        )];
        let term_merged = merge_terminal_env(&merged, &terminal_overlay);
        assert_eq!(term_merged.get("OVERRIDE").unwrap(), "terminal");
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
        let envrc_path = temp_dir.path().join(".envrc");
        std::fs::write(&envrc_path, "export DIREnv_TEST_VAR=pueblo_test_123\n").unwrap();

        // 1. Unapproved .envrc must return EnvrcBlocked
        let err = resolve_workspace_env(temp_dir.path(), temp_dir.path())
            .await
            .unwrap_err();
        match err {
            WorkspaceEnvError::EnvrcBlocked { path, message } => {
                let expected_canonical = envrc_path
                    .canonicalize()
                    .unwrap_or_else(|_| envrc_path.clone());
                let actual_canonical = path.canonicalize().unwrap_or_else(|_| path.clone());
                assert_eq!(actual_canonical, expected_canonical);
                let lower = message.to_lowercase();
                assert!(lower.contains("blocked") || lower.contains("allow"));
            }
            other => panic!("expected EnvrcBlocked, got {:?}", other),
        }

        // 2. Authorize via direnv_allow
        direnv_allow(temp_dir.path(), temp_dir.path())
            .await
            .expect("direnv allow should succeed");

        // 3. Now resolve_workspace_env must succeed and include exported variable
        let resolved = resolve_workspace_env(temp_dir.path(), temp_dir.path())
            .await
            .expect("resolve should succeed after allow");
        assert_eq!(
            resolved.get("DIREnv_TEST_VAR").map(|s| s.as_str()),
            Some("pueblo_test_123")
        );
    }

    #[tokio::test]
    async fn test_unset_variable_propagation_and_spawn() {
        let temp_dir = tempfile::tempdir().unwrap();
        let test_unset_key = "PUEBLO_TEST_INHERITED_UNSET_VAR";
        unsafe {
            std::env::set_var(test_unset_key, "should_be_removed_by_direnv");
        }

        std::fs::write(
            temp_dir.path().join(".envrc"),
            format!(
                "unset {}\nexport PUEBLO_RETAINED_TEST=kept\n",
                test_unset_key
            ),
        )
        .unwrap();

        direnv_allow(temp_dir.path(), temp_dir.path())
            .await
            .unwrap();

        let resolved = resolve_workspace_env(temp_dir.path(), temp_dir.path())
            .await
            .unwrap();
        assert!(!resolved.contains_key(test_unset_key));
        assert_eq!(
            resolved.get("PUEBLO_RETAINED_TEST").map(|s| s.as_str()),
            Some("kept")
        );

        let proc = crate::acp::process::AcpProcess::spawn(
            "sh",
            &[
                "-c".into(),
                format!(
                    "echo UNSET=${} RETAINED=$PUEBLO_RETAINED_TEST",
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

        direnv_allow(root, root).await.unwrap();

        let resolved = resolve_workspace_env(&nested_worktree, root).await.unwrap();
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
}
