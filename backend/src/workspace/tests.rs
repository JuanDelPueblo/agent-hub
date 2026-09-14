use super::*;
use std::fs;
use std::process::Command;

fn git(dir: &Path, args: &[&str]) {
    let st = Command::new("git")
        .args(args)
        .current_dir(dir)
        .env("GIT_TERMINAL_PROMPT", "0")
        .output()
        .expect("git run");
    assert!(st.status.success(), "git {args:?}: {}", String::from_utf8_lossy(&st.stderr));
}

fn init_repo() -> tempfile::TempDir {
    let td = tempfile::tempdir().unwrap();
    git(td.path(), &["init", "-b", "main"]);
    git(td.path(), &["config", "user.email", "t@t.t"]);
    git(td.path(), &["config", "user.name", "t"]);
    fs::write(td.path().join("f.txt"), "a").unwrap();
    git(td.path(), &["add", "."]);
    git(td.path(), &["commit", "-m", "init"]);
    td
}

#[test]
fn branches_resolve_without_network() {
    let td = init_repo();
    git(td.path(), &["branch", "feat"]);
    let branches = list_local_branches(td.path()).unwrap();
    assert!(branches.iter().any(|b| b.name == "main" && b.current));
    assert!(branches.iter().any(|b| b.name == "feat"));
    let sha = resolve_ref(td.path(), "feat").unwrap();
    assert!(is_hex40(&sha));
}

#[test]
fn direct_switch_clean_and_dirty_refusal() {
    let td = init_repo();
    git(td.path(), &["branch", "feat"]);
    fs::write(td.path().join("f.txt"), "dirty").unwrap();
    assert!(inspect(td.path()).dirty);
    let err = prepare_direct(td.path(), "feat").unwrap_err();
    assert!(matches!(err, WorkspaceError::Conflict(_)));
    // Restore clean, switch works.
    git(td.path(), &["checkout", "--", "."]);
    prepare_direct(td.path(), "feat").unwrap();
    assert_eq!(inspect(td.path()).branch.as_deref(), Some("feat"));
}

#[test]
fn direct_same_branch_preserves_dirty() {
    let td = init_repo();
    fs::write(td.path().join("f.txt"), "dirty").unwrap();
    prepare_direct(td.path(), "main").unwrap();
    assert_eq!(fs::read_to_string(td.path().join("f.txt")).unwrap(), "dirty");
}

#[test]
fn managed_two_isolated_worktrees_and_nested_paths() {
    let td = init_repo();
    git(td.path(), &["branch", "feat"]);
    let base = resolve_ref(td.path(), "feat").unwrap();
    // Nested project path inside repo.
    let nested = td.path().join("sub/dir");
    fs::create_dir_all(&nested).unwrap();
    let info = inspect(&nested);
    assert!(info.is_git);
    assert!(info.subdir.unwrap().to_str().unwrap().contains("sub"));
    let ws = tempfile::tempdir().unwrap();
    let a = provision_managed(td.path(), ws.path(), "chat1", &base).unwrap();
    let b = provision_managed(td.path(), ws.path(), "chat2", &base).unwrap();
    assert!(a.worktree.exists() && b.worktree.exists());
    fs::write(a.worktree.join("only-a.txt"), "x").unwrap();
    assert!(!b.worktree.join("only-a.txt").exists());
    // Primary checkout untouched: still on main.
    assert_eq!(inspect(td.path()).branch.as_deref(), Some("main"));
}

#[test]
fn managed_recovery_and_removal() {
    let td = init_repo();
    let base = resolve_ref(td.path(), "main").unwrap();
    let ws = tempfile::tempdir().unwrap();
    let m = provision_managed(td.path(), ws.path(), "chat9", &base).unwrap();
    assert!(matches!(
        recover_managed(td.path(), ws.path(), "chat9").unwrap(),
        Recovered::Reused(_)
    ));
    // Simulate missing worktree: remove via git, keep branch, recreate.
    git(td.path(), &["worktree", "remove", "--force", m.worktree.to_str().unwrap()]);
    assert!(matches!(
        recover_managed(td.path(), ws.path(), "chat9").unwrap(),
        Recovered::Recreated(_)
    ));
    // Dirty removal refused.
    fs::write(ws.path().join("chat9/f.txt"), "dirty").unwrap();
    // Need commit context: dirty check via status.
    let err = remove_managed(td.path(), ws.path(), "chat9").unwrap_err();
    assert!(matches!(err, WorkspaceError::Conflict(_)));
    git(&m.worktree, &["checkout", "--", "."]);
    remove_managed(td.path(), ws.path(), "chat9").unwrap();
    // Branch preserved.
    assert!(is_hex40(&resolve_ref(td.path(), "agent-hub/chat/chat9").unwrap()));
}

#[test]
fn direct_validation_reports_external_switch() {
    let td = init_repo();
    git(td.path(), &["branch", "feat"]);
    let root = inspect(td.path()).root.unwrap();
    validate_direct(td.path(), &root, "main").unwrap();
    git(td.path(), &["checkout", "feat"]);
    let err = validate_direct(td.path(), &root, "main").unwrap_err();
    assert!(matches!(err, WorkspaceError::Conflict(_)));
}
