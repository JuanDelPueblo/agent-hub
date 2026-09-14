use agent_hub::{
    agents::{AgentDefinition, AgentRegistry},
    events::EventLog,
    session::SessionManager,
    state::TurnState,
    store::{ChatWorkspace, Store, WorkspaceMode},
    workspace,
};
use std::{path::Path, process::Command, sync::Arc, time::Duration};

struct Fixture {
    _temp: tempfile::TempDir,
    manager: Arc<SessionManager>,
    store: Arc<Store>,
    repository: std::path::PathBuf,
    commit: String,
}

impl Fixture {
    fn new() -> Self {
        let temp = tempfile::tempdir().unwrap();
        let repository = temp.path().join("repository");
        std::fs::create_dir_all(repository.join("nested")).unwrap();
        git(&repository, &["init", "-b", "main"]);
        git(
            &repository,
            &["config", "user.email", "tests@example.invalid"],
        );
        git(&repository, &["config", "user.name", "Agent Hub tests"]);
        std::fs::write(repository.join("nested/file.txt"), "fixture\n").unwrap();
        git(&repository, &["add", "."]);
        git(&repository, &["commit", "-m", "fixture"]);
        let commit = git_output(&repository, &["rev-parse", "HEAD"]);

        let store = Arc::new(Store::open(&temp.path().join("hub.db")).unwrap());
        let history = temp.path().join("history");
        std::fs::create_dir_all(&history).unwrap();
        let agent = AgentDefinition::codex_default()
            .with_command("python3".into())
            .with_args(vec![
                format!("{}/tests/fake_acp.py", env!("CARGO_MANIFEST_DIR")),
                history.display().to_string(),
                "load".into(),
            ])
            .with_idle_timeout(Duration::from_secs(900));
        let events = Arc::new(EventLog::persistent(store.clone()).unwrap());
        let manager = SessionManager::with_store(
            Arc::new(AgentRegistry::new([agent])),
            events,
            Some(store.clone()),
        );

        Self {
            _temp: temp,
            manager,
            store,
            repository,
            commit,
        }
    }

    fn project(&self) -> agent_hub::store::Project {
        self.store
            .create_project("fixture".into(), self.repository.display().to_string())
            .unwrap()
    }

    fn managed_chat(&self) -> (agent_hub::store::Chat, ChatWorkspace) {
        let project = self.project();
        let chat = self
            .store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let paths = workspace::provision_managed(
            &self.repository,
            &self.store.worktrees_dir(),
            &chat.id,
            &self.commit,
        )
        .unwrap();
        let metadata = ChatWorkspace::new(
            chat.id.clone(),
            project.id,
            WorkspaceMode::ManagedWorktree,
            self.repository.display().to_string(),
            paths.worktree.display().to_string(),
            "nested".into(),
            Some(paths.branch),
            Some(self.commit.clone()),
        );
        self.store.insert_workspace(&metadata).unwrap();
        (chat, metadata)
    }

    fn direct_chat(&self, branch: &str) -> agent_hub::store::Chat {
        let project = self.project();
        let chat = self
            .store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let metadata = ChatWorkspace::new(
            chat.id.clone(),
            project.id,
            WorkspaceMode::ProjectCheckout,
            self.repository.display().to_string(),
            self.repository.display().to_string(),
            "nested".into(),
            Some(branch.into()),
            Some(self.commit.clone()),
        );
        self.store.insert_workspace(&metadata).unwrap();
        chat
    }
}

fn git(dir: &Path, args: &[&str]) {
    let output = Command::new("git")
        .args(args)
        .current_dir(dir)
        .output()
        .unwrap();
    assert!(
        output.status.success(),
        "git {} failed: {}",
        args.join(" "),
        String::from_utf8_lossy(&output.stderr)
    );
}

fn git_output(dir: &Path, args: &[&str]) -> String {
    let output = Command::new("git")
        .args(args)
        .current_dir(dir)
        .output()
        .unwrap();
    assert!(output.status.success());
    String::from_utf8(output.stdout).unwrap().trim().into()
}

async fn wait_for_turn_state(session: &agent_hub::session::AcpSession, expected: TurnState) {
    for _ in 0..1_000 {
        if session.turn_state().await == expected {
            return;
        }
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    panic!("session did not reach turn state {expected}");
}

#[tokio::test]
async fn managed_sessions_use_nested_worktrees_and_recover_missing_worktrees() {
    let fixture = Fixture::new();
    let (chat, metadata) = fixture.managed_chat();
    let session = fixture.manager.get_by_id(&chat.id).await.unwrap();
    assert_eq!(
        session.key.cwd,
        Path::new(&metadata.workspace_path).join("nested")
    );

    std::fs::remove_dir_all(&metadata.workspace_path).unwrap();
    session.ask("hello".into(), None).await.unwrap();
    assert!(Path::new(&metadata.workspace_path).join("nested").is_dir());
    fixture.manager.shutdown_all().await;
}

#[tokio::test]
async fn managed_checkout_turns_do_not_share_a_lock() {
    let fixture = Fixture::new();
    let (first, _) = fixture.managed_chat();
    let (second, _) = fixture.managed_chat();
    let first_session = fixture.manager.get_by_id(&first.id).await.unwrap();
    let second_session = fixture.manager.get_by_id(&second.id).await.unwrap();

    first_session
        .start_turn("wait".into(), Some(Duration::from_secs(5)))
        .await
        .unwrap();
    second_session
        .start_turn("wait".into(), Some(Duration::from_secs(5)))
        .await
        .unwrap();
    wait_for_turn_state(&first_session, TurnState::Prompting).await;
    wait_for_turn_state(&second_session, TurnState::Prompting).await;
    wait_for_turn_state(&first_session, TurnState::Idle).await;
    wait_for_turn_state(&second_session, TurnState::Idle).await;
    fixture.manager.shutdown_all().await;
}

#[tokio::test]
async fn unsafe_managed_recovery_and_direct_branch_mismatch_prevent_spawn() {
    let fixture = Fixture::new();
    let (managed, metadata) = fixture.managed_chat();
    std::fs::remove_dir_all(&metadata.workspace_path).unwrap();
    std::fs::create_dir_all(&metadata.workspace_path).unwrap();
    std::fs::write(
        Path::new(&metadata.workspace_path).join("foreign.txt"),
        "keep",
    )
    .unwrap();
    let managed_session = fixture.manager.get_by_id(&managed.id).await.unwrap();
    let error = managed_session.ask("hello".into(), None).await.unwrap_err();
    assert!(error
        .to_string()
        .contains("managed workspace recovery failed"));

    let branch = git_output(&fixture.repository, &["branch", "--show-current"]);
    git(&fixture.repository, &["branch", "other"]);
    let direct = fixture.direct_chat(&branch);
    let direct_session = fixture.manager.get_by_id(&direct.id).await.unwrap();
    git(&fixture.repository, &["checkout", "other"]);
    let error = direct_session.ask("hello".into(), None).await.unwrap_err();
    assert!(error.to_string().contains("checkout moved externally"));
    fixture.manager.shutdown_all().await;
}

#[tokio::test]
async fn direct_checkout_turns_are_rejected_while_owned_then_can_run() {
    let fixture = Fixture::new();
    let branch = git_output(&fixture.repository, &["branch", "--show-current"]);
    let first = fixture.direct_chat(&branch);
    let second = fixture.direct_chat(&branch);
    let first_session = fixture.manager.get_by_id(&first.id).await.unwrap();
    let second_session = fixture.manager.get_by_id(&second.id).await.unwrap();

    first_session
        .start_turn("wait".into(), Some(Duration::from_millis(100)))
        .await
        .unwrap();
    wait_for_turn_state(&first_session, TurnState::Prompting).await;
    let error = second_session
        .start_turn("hello".into(), None)
        .await
        .unwrap_err();
    assert_eq!(
        error.to_string(),
        "Another chat is already working in this project checkout"
    );

    wait_for_turn_state(&first_session, TurnState::Idle).await;
    second_session.ask("hello".into(), None).await.unwrap();
    fixture.manager.shutdown_all().await;
}

#[tokio::test]
async fn legacy_sessions_keep_the_project_directory() {
    let fixture = Fixture::new();
    let project = fixture.project();
    let chat = fixture
        .store
        .create_chat(project.id, "codex".into(), None)
        .unwrap();
    let session = fixture.manager.get_by_id(&chat.id).await.unwrap();
    assert_eq!(session.key.cwd, Path::new(&project.path));
    session.ask("hello".into(), None).await.unwrap();
    fixture.manager.shutdown_all().await;
}
