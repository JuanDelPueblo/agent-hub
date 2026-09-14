use std::collections::HashMap;
use std::path::{Path, PathBuf};

#[derive(Debug)]
pub enum WorkspaceEnvError {
    DirenvNotFound,
    EnvrcBlocked { path: PathBuf, message: String },
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

pub fn has_envrc(cwd: &Path) -> bool {
    let mut curr = Some(cwd);
    while let Some(dir) = curr {
        if dir.join(".envrc").is_file() {
            return true;
        }
        curr = dir.parent();
    }
    false
}

pub async fn resolve_workspace_env(
    cwd: &Path,
) -> Result<HashMap<String, String>, WorkspaceEnvError> {
    if !has_envrc(cwd) {
        return Ok(std::env::vars().collect());
    }

    let output = match tokio::process::Command::new("direnv")
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
            let envrc_path = find_envrc_path(cwd).unwrap_or_else(|| cwd.join(".envrc"));
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
        let envrc_path = find_envrc_path(cwd).unwrap_or_else(|| cwd.join(".envrc"));
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

pub async fn direnv_allow(cwd: &Path) -> Result<(), WorkspaceEnvError> {
    let output = match tokio::process::Command::new("direnv")
        .arg("allow")
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

fn find_envrc_path(cwd: &Path) -> Option<PathBuf> {
    let mut curr = Some(cwd);
    while let Some(dir) = curr {
        let path = dir.join(".envrc");
        if path.is_file() {
            return Some(path);
        }
        curr = dir.parent();
    }
    None
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
}
