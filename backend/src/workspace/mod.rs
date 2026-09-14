use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};

/// Default bound for every `git` invocation.
pub const GIT_TIMEOUT: Duration = Duration::from_secs(30);

/// Branch prefix for managed chat worktrees.
pub const MANAGED_PREFIX: &str = "agent-hub/chat/";

/// Bounded error type. `Conflict` signals a safe refusal, never a failure.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum WorkspaceError {
    /// Safe refusal with a clear reason (dirty checkout, external switch...).
    Conflict(String),
    /// Hard failure (missing repo, missing branch, git error...).
    Failed(String),
}

impl std::fmt::Display for WorkspaceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Conflict(m) | Self::Failed(m) => write!(f, "{m}"),
        }
    }
}

impl std::error::Error for WorkspaceError {}

/// Repository inspection result.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RepoInfo {
    pub is_git: bool,
    pub root: Option<PathBuf>,
    pub subdir: Option<PathBuf>,
    pub branch: Option<String>,
    pub head_sha: Option<String>,
    pub dirty: bool,
}

/// One local branch.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BranchInfo {
    pub name: String,
    pub sha: String,
    pub current: bool,
}

/// Managed worktree location.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ManagedPaths {
    pub branch: String,
    pub worktree: PathBuf,
}

/// Outcome of managed recovery.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Recovered {
    Reused(PathBuf),
    Recreated(PathBuf),
}

/// Run `git` with captured output, `GIT_TERMINAL_PROMPT=0`, no network, bounded time.
fn run_git(dir: &Path, args: &[&str], timeout: Duration) -> Result<String, WorkspaceError> {
    let mut child = Command::new("git")
        .args(args)
        .current_dir(dir)
        .env("GIT_TERMINAL_PROMPT", "0")
        .env("GIT_OPTIONAL_LOCKS", "0")
        .stdin(Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| WorkspaceError::Failed(format!("cannot run git: {e}")))?;
    let start = Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(status)) => {
                let mut out = String::new();
                let mut err = String::new();
                use std::io::Read as _;
                if let Some(mut s) = child.stdout.take() {
                    let _ = s.read_to_string(&mut out);
                }
                if let Some(mut s) = child.stderr.take() {
                    let _ = s.read_to_string(&mut err);
                }
                if status.success() {
                    return Ok(out.trim_end().to_string());
                }
                let detail = if err.trim().is_empty() {
                    out.trim().to_string()
                } else {
                    err.trim().to_string()
                };
                return Err(WorkspaceError::Failed(format!(
                    "git {} failed: {detail}",
                    args.join(" ")
                )));
            }
            Ok(None) => {
                if start.elapsed() > timeout {
                    let _ = child.kill();
                    let _ = child.wait();
                    return Err(WorkspaceError::Failed(format!(
                        "git {} timed out",
                        args.join(" ")
                    )));
                }
                std::thread::sleep(Duration::from_millis(10));
            }
            Err(e) => return Err(WorkspaceError::Failed(format!("git wait failed: {e}"))),
        }
    }
}

fn run_git_ok(dir: &Path, args: &[&str]) -> Result<String, WorkspaceError> {
    run_git(dir, args, GIT_TIMEOUT)
}

fn is_hex40(s: &str) -> bool {
    s.len() == 40 && s.bytes().all(|b| b.is_ascii_hexdigit())
}

/// Inspect a path. Never fails: non-Git paths report `is_git=false`.
pub fn inspect(path: &Path) -> RepoInfo {
    let not_git = RepoInfo {
        is_git: false,
        root: None,
        subdir: None,
        branch: None,
        head_sha: None,
        dirty: false,
    };
    if !path.exists() {
        return not_git;
    }
    let root = match run_git_ok(path, &["rev-parse", "--show-toplevel"]) {
        Ok(o) => PathBuf::from(o.trim()),
        Err(_) => return not_git,
    };
    // Canonical root: resolve symlinks where possible.
    let root = root.canonicalize().unwrap_or(root);
    let subdir = match path.canonicalize().unwrap_or_else(|_| path.to_path_buf()) {
        p => p
            .strip_prefix(&root)
            .ok()
            .map(|s| s.to_path_buf())
            .filter(|s| !s.as_os_str().is_empty()),
    };
    let head_sha = run_git_ok(path, &["rev-parse", "HEAD"])
        .ok()
        .map(|s| s.trim().to_string())
        .filter(|s| is_hex40(s));
    let branch = run_git_ok(path, &["symbolic-ref", "--short", "-q", "HEAD"])
        .ok()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty());
    let dirty = match run_git_ok(path, &["status", "--porcelain"]) {
        Ok(o) => !o.trim().is_empty(),
        Err(_) => false,
    };
    RepoInfo {
        is_git: true,
        root: Some(root),
        subdir,
        branch,
        head_sha,
        dirty,
    }
}

/// List local branches. Never touches the network.
pub fn list_local_branches(repo: &Path) -> Result<Vec<BranchInfo>, WorkspaceError> {
    let out = run_git_ok(
        repo,
        &["for-each-ref", "--format=%(refname:short)%00%(objectname)%00%(HEAD)", "refs/heads"],
    )?;
    let mut out_v = Vec::new();
    for line in out.lines() {
        let mut parts = line.split('\0');
        let (Some(name), Some(sha), Some(head)) =
            (parts.next(), parts.next(), parts.next())
        else {
            continue;
        };
        if name.is_empty() || !is_hex40(sha.trim()) {
            continue;
        }
        out_v.push(BranchInfo {
            name: name.to_string(),
            sha: sha.trim().to_string(),
            current: head.trim() == "*",
        });
    }
    out_v.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(out_v)
}

/// Resolve a local branch or ref to an immutable commit SHA.
pub fn resolve_ref(repo: &Path, name: &str) -> Result<String, WorkspaceError> {
    let name = name.trim();
    if name.is_empty() {
        return Err(WorkspaceError::Failed("empty ref".to_string()));
    }
    let sha = run_git_ok(repo, &["rev-parse", "--verify", &format!("{name}^{{commit}}")])?;
    let sha = sha.trim().to_string();
    if !is_hex40(&sha) {
        return Err(WorkspaceError::Failed(format!("unresolvable ref: {name}")));
    }
    Ok(sha)
}

fn managed_branch(chat_id: &str) -> String {
    format!("{MANAGED_PREFIX}{chat_id}")
}

/// Provision an isolated branch + external worktree from `base_commit`.
///
/// Never modifies the primary checkout. Only ordinary `git` commands run.
pub fn provision_managed(
    repo: &Path,
    workspace_root: &Path,
    chat_id: &str,
    base_commit: &str,
) -> Result<ManagedPaths, WorkspaceError> {
    if chat_id.trim().is_empty() || chat_id.contains('/') || chat_id.contains('.') {
        return Err(WorkspaceError::Failed("invalid chat id".to_string()));
    }
    if !is_hex40(base_commit.trim()) {
        return Err(WorkspaceError::Failed("base commit must be a SHA".to_string()));
    }
    let base = base_commit.trim().to_string();
    // Verify base resolves to a commit in this repo.
    let verified = run_git_ok(repo, &["rev-parse", "--verify", &format!("{base}^{{commit}}")])?;
    if verified.trim() != base {
        return Err(WorkspaceError::Failed("unknown base commit".to_string()));
    }
    let branch = managed_branch(chat_id);
    let branch_exists = run_git_ok(repo, &["rev-parse", "--verify", &format!("refs/heads/{branch}")]).is_ok();
    let mut created_branch = false;
    if !branch_exists {
        run_git_ok(repo, &["branch", &branch, &base])?;
        created_branch = true;
    }
    std::fs::create_dir_all(workspace_root)
        .map_err(|e| WorkspaceError::Failed(format!("cannot create workspace root: {e}")))?;
    let worktree = workspace_root.join(chat_id);
    if worktree.exists() {
        if created_branch {
            let _ = rollback_provision(repo, &branch, true);
        }
        return Err(WorkspaceError::Failed("worktree path already exists".to_string()));
    }
    if let Err(e) = run_git_ok(repo, &["worktree", "add", &worktree_string(&worktree)?, &branch]) {
        if created_branch {
            let _ = rollback_provision(repo, &branch, true);
        }
        return Err(e);
    }
    Ok(ManagedPaths { branch, worktree })
}

fn worktree_string(p: &Path) -> Result<String, WorkspaceError> {
    p.to_str()
        .map(str::to_string)
        .ok_or_else(|| WorkspaceError::Failed("non-utf8 path".to_string()))
}

/// Prepare the primary checkout for direct use of `branch`.
///
/// Already checked out: files and index stay untouched, even when dirty.
/// Other branch: switch only when clean. Never stash, reset, clean, or force.
pub fn prepare_direct(repo: &Path, branch: &str) -> Result<(), WorkspaceError> {
    let branch = branch.trim();
    if branch.is_empty() {
        return Err(WorkspaceError::Failed("empty branch".to_string()));
    }
    // Branch must exist locally.
    resolve_ref(repo, branch).map_err(|_| {
        WorkspaceError::Failed(format!("branch does not exist: {branch}"))
    })?;
    let current = run_git_ok(repo, &["symbolic-ref", "--short", "-q", "HEAD"])
        .ok()
        .map(|s| s.trim().to_string())
        .unwrap_or_default();
    if current == branch {
        return Ok(());
    }
    let dirty = !run_git_ok(repo, &["status", "--porcelain"])?.trim().is_empty();
    if dirty {
        return Err(WorkspaceError::Conflict(format!(
            "checkout is dirty; refuse to switch from {current} to {branch}"
        )));
    }
    run_git_ok(repo, &["checkout", branch])?;
    Ok(())
}

/// Validate a direct workspace: repo matches, branch exists, checkout still on it.
pub fn validate_direct(
    repo: &Path,
    expected_root: &Path,
    expected_branch: &str,
) -> Result<(), WorkspaceError> {
    let info = inspect(repo);
    if !info.is_git {
        return Err(WorkspaceError::Failed("repository no longer exists".to_string()));
    }
    let root = info.root.unwrap_or_default();
    let canon_expected = expected_root.canonicalize().unwrap_or_else(|_| expected_root.to_path_buf());
    let canon_root = root.canonicalize().unwrap_or(root);
    if canon_root != canon_expected {
        return Err(WorkspaceError::Failed("repository mismatch".to_string()));
    }
    resolve_ref(repo, expected_branch)
        .map_err(|_| WorkspaceError::Failed(format!("branch no longer exists: {expected_branch}")))?;
    match info.branch {
        Some(cur) if cur == expected_branch => Ok(()),
        Some(cur) => Err(WorkspaceError::Conflict(format!(
            "checkout moved externally to {cur}; expected {expected_branch}"
        ))),
        None => Err(WorkspaceError::Conflict("checkout is detached".to_string())),
    }
}

/// Recover a managed worktree without destroying user work.
pub fn recover_managed(
    repo: &Path,
    workspace_root: &Path,
    chat_id: &str,
) -> Result<Recovered, WorkspaceError> {
    let branch = managed_branch(chat_id);
    let worktree = workspace_root.join(chat_id);
    let _branch_sha = match run_git_ok(repo, &["rev-parse", "--verify", &format!("refs/heads/{branch}")]) {
        Ok(o) => o.trim().to_string(),
        Err(_) => {
            // Prune stale worktree metadata, then report.
            let _ = run_git_ok(repo, &["worktree", "prune"]);
            return Err(WorkspaceError::Failed(format!("managed branch missing: {branch}")));
        }
    };
    // Ask git about registered worktrees.
    let list = run_git_ok(repo, &["worktree", "list", "--porcelain"])?;
    let registered: Vec<String> = list
        .lines()
        .filter_map(|l| l.strip_prefix("worktree ").map(str::to_string))
        .collect();
    let wt_str = worktree_string(&worktree)?;
    let registered_here = registered.iter().any(|w| Path::new(w) == worktree);
    if worktree.exists() && registered_here {
        // Verify the worktree HEAD branch matches, else error (never switch behind back).
        let wt_branch = run_git_ok(&worktree, &["symbolic-ref", "--short", "-q", "HEAD"])
            .ok()
            .map(|s| s.trim().to_string())
            .unwrap_or_default();
        if wt_branch != branch {
            return Err(WorkspaceError::Failed(format!(
                "worktree on wrong branch: {wt_branch}"
            )));
        }
        // Verify same repository (common dir / toplevel).
        let wt_top = run_git_ok(&worktree, &["rev-parse", "--show-toplevel"])
            .unwrap_or_default();
        if Path::new(wt_top.trim()) != worktree {
            return Err(WorkspaceError::Failed("repository mismatch".to_string()));
        }
        return Ok(Recovered::Reused(worktree));
    }
    if worktree.exists() && !registered_here {
        return Err(WorkspaceError::Failed(
            "worktree path exists but is not registered".to_string(),
        ));
    }
    // Missing worktree + surviving branch: prune stale metadata, recreate safely.
    let _ = run_git_ok(repo, &["worktree", "prune"]);
    // Recheck nothing occupies the path.
    if worktree.exists() {
        return Err(WorkspaceError::Failed("worktree path blocked".to_string()));
    }
    run_git_ok(repo, &["worktree", "add", &wt_str, &branch])?;
    Ok(Recovered::Recreated(worktree))
}

/// Remove a managed worktree. Dirty worktrees are refused. Branch is preserved.
pub fn remove_managed(
    repo: &Path,
    workspace_root: &Path,
    chat_id: &str,
) -> Result<(), WorkspaceError> {
    let worktree = workspace_root.join(chat_id);
    if !worktree.exists() {
        let _ = run_git_ok(repo, &["worktree", "prune"]);
        return Ok(());
    }
    let dirty = !run_git_ok(&worktree, &["status", "--porcelain"])?.trim().is_empty();
    if dirty {
        return Err(WorkspaceError::Conflict("managed worktree is dirty; refuse to remove".to_string()));
    }
    run_git_ok(repo, &["worktree", "remove", &worktree_string(&worktree)?])?;
    Ok(())
}

/// Roll back provisioning. Only removes `branch` when it was newly created and
/// holds no commits beyond its base (no user work can be lost).
pub fn rollback_provision(
    repo: &Path,
    branch: &str,
    created_branch: bool,
) -> Result<(), WorkspaceError> {
    if !created_branch {
        return Ok(());
    }
    // Refuse when the branch is checked out in any worktree.
    let list = run_git_ok(repo, &["worktree", "list", "--porcelain"]).unwrap_or_default();
    let mut cur_wt: Option<String> = None;
    for line in list.lines() {
        if let Some(w) = line.strip_prefix("worktree ") {
            cur_wt = Some(w.to_string());
        }
        if let Some(b) = line.strip_prefix("branch ") {
            let short = b.strip_prefix("refs/heads/").unwrap_or(b);
            if short == branch {
                // If the worktree path still exists, user work may live there.
                if let Some(w) = &cur_wt {
                    if Path::new(w).exists() {
                        return Err(WorkspaceError::Conflict(
                            "refuse rollback: branch is checked out".to_string(),
                        ));
                    }
                } else {
                    return Err(WorkspaceError::Conflict(
                        "refuse rollback: branch is checked out".to_string(),
                    ));
                }
            }
        }
    }
    // Safe delete: `-d` refuses unmerged work. Never use `-D`.
    run_git_ok(repo, &["branch", "-d", branch])?;
    Ok(())
}

#[cfg(test)]
mod tests;
