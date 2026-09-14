use pueblo_hub::{
    agents::{AgentDefinition, AgentRegistry},
    config::Config,
    events::EventLog,
    service::HubService,
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
        git(&repository, &["config", "user.name", "Pueblo Hub tests"]);
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

    fn project(&self) -> pueblo_hub::store::Project {
        self.store
            .create_project("fixture".into(), self.repository.display().to_string())
            .unwrap()
    }

    fn nested_project(&self) -> pueblo_hub::store::Project {
        self.store
            .create_project(
                "nested fixture".into(),
                self.repository.join("nested").display().to_string(),
            )
            .unwrap()
    }

    fn managed_chat(&self) -> (pueblo_hub::store::Chat, ChatWorkspace) {
        let project = self.nested_project();
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

    fn direct_chat(&self, branch: &str) -> pueblo_hub::store::Chat {
        let project = self.project();
        self.direct_chat_for_project(&project, branch, "")
    }

    fn direct_chat_for_project(
        &self,
        project: &pueblo_hub::store::Project,
        branch: &str,
        project_subdir: &str,
    ) -> pueblo_hub::store::Chat {
        let chat = self
            .store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let metadata = ChatWorkspace::new(
            chat.id.clone(),
            project.id.clone(),
            WorkspaceMode::ProjectCheckout,
            self.repository.display().to_string(),
            self.repository.display().to_string(),
            project_subdir.into(),
            Some(branch.into()),
            Some(self.commit.clone()),
        );
        self.store.insert_workspace(&metadata).unwrap();
        chat
    }

    fn direct_chat_with_metadata(
        &self,
        project: &pueblo_hub::store::Project,
        repository_root: &Path,
        workspace_path: &Path,
        project_subdir: &str,
        branch: &str,
    ) -> pueblo_hub::store::Chat {
        let chat = self
            .store
            .create_chat(project.id.clone(), "codex".into(), None)
            .unwrap();
        let metadata = ChatWorkspace::new(
            chat.id.clone(),
            project.id.clone(),
            WorkspaceMode::ProjectCheckout,
            repository_root.display().to_string(),
            workspace_path.display().to_string(),
            project_subdir.into(),
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

async fn wait_for_turn_state(session: &pueblo_hub::session::AcpSession, expected: TurnState) {
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
async fn managed_workspace_recovers_through_fresh_service_and_preserves_dirty_files() {
    let fixture = Fixture::new();
    let project = fixture.project();
    let agents = Arc::new(AgentRegistry::new([AgentDefinition::codex_default()
        .with_command("python3".into())
        .with_args(vec![
            format!("{}/tests/fake_acp.py", env!("CARGO_MANIFEST_DIR")),
            fixture._temp.path().join("history").display().to_string(),
            "load".into(),
        ])]));
    let mut config = Config {
        agents: agents.clone(),
        ..Default::default()
    };
    config.web.project_roots = vec![fixture._temp.path().display().to_string()];
    let events = Arc::new(EventLog::persistent(fixture.store.clone()).unwrap());
    let sessions = SessionManager::with_store(agents.clone(), events, Some(fixture.store.clone()));
    let hub = HubService::new(fixture.store.clone(), sessions.clone(), agents, &config);
    let chat = hub.create_chat(&project.id, "codex", None).await.unwrap();
    let workspace = fixture.store.workspace(&chat.chat.id).unwrap().unwrap();
    let worktree = Path::new(&workspace.workspace_path);
    std::fs::remove_dir_all(worktree).unwrap();
    sessions.shutdown_all().await;

    let store = Arc::new(Store::open(&fixture._temp.path().join("hub.db")).unwrap());
    let history = fixture._temp.path().join("history");
    let agents = Arc::new(AgentRegistry::new([AgentDefinition::codex_default()
        .with_command("python3".into())
        .with_args(vec![
            format!("{}/tests/fake_acp.py", env!("CARGO_MANIFEST_DIR")),
            history.display().to_string(),
            "load".into(),
        ])]));
    let events = Arc::new(EventLog::persistent(store.clone()).unwrap());
    let sessions = SessionManager::with_store(agents.clone(), events, Some(store.clone()));
    let hub = HubService::new(store.clone(), sessions.clone(), agents, &config);
    let session = sessions.get_by_id(&chat.chat.id).await.unwrap();
    hub.get_chat(&chat.chat.id).await.unwrap();
    session.ask("recover".into(), None).await.unwrap();
    assert!(worktree.join("nested").is_dir());

    std::fs::write(worktree.join("keep.txt"), "do not discard\n").unwrap();
    sessions.shutdown_all().await;

    let store = Arc::new(Store::open(&fixture._temp.path().join("hub.db")).unwrap());
    let events = Arc::new(EventLog::persistent(store.clone()).unwrap());
    let sessions = SessionManager::with_store(config.agents.clone(), events, Some(store.clone()));
    let hub = HubService::new(store, sessions.clone(), config.agents.clone(), &config);
    let session = sessions.get_by_id(&chat.chat.id).await.unwrap();
    hub.get_chat(&chat.chat.id).await.unwrap();
    session.ask("dirty restart".into(), None).await.unwrap();
    assert_eq!(
        std::fs::read_to_string(worktree.join("keep.txt")).unwrap(),
        "do not discard\n"
    );
    sessions.shutdown_all().await;
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
async fn nested_legacy_and_direct_chats_share_the_repository_checkout_lock() {
    let fixture = Fixture::new();
    let project = fixture.nested_project();
    let legacy = fixture
        .store
        .create_chat(project.id.clone(), "codex".into(), None)
        .unwrap();
    let direct = fixture.direct_chat_for_project(&project, "main", "nested");
    let legacy_session = fixture.manager.get_by_id(&legacy.id).await.unwrap();
    let direct_session = fixture.manager.get_by_id(&direct.id).await.unwrap();

    assert_eq!(legacy_session.key.cwd, Path::new(&project.path));
    legacy_session
        .start_turn("wait".into(), Some(Duration::from_secs(5)))
        .await
        .unwrap();
    wait_for_turn_state(&legacy_session, TurnState::Prompting).await;
    let error = direct_session
        .start_turn("hello".into(), None)
        .await
        .unwrap_err();
    assert_eq!(
        error.to_string(),
        "Another chat is already working in this project checkout"
    );

    wait_for_turn_state(&legacy_session, TurnState::Idle).await;
    fixture.manager.shutdown_all().await;
}

#[tokio::test]
async fn corrupted_direct_workspace_metadata_cannot_redirect_startup() {
    let fixture = Fixture::new();
    let project = fixture.nested_project();
    let foreign = fixture._temp.path().join("foreign");
    std::fs::create_dir_all(&foreign).unwrap();
    git(&foreign, &["init", "-b", "main"]);
    git(&foreign, &["config", "user.email", "tests@example.invalid"]);
    git(&foreign, &["config", "user.name", "Pueblo Hub tests"]);
    std::fs::write(foreign.join("foreign.txt"), "foreign\n").unwrap();
    git(&foreign, &["add", "."]);
    git(&foreign, &["commit", "-m", "foreign"]);

    let wrong_repository =
        fixture.direct_chat_with_metadata(&project, &foreign, &foreign, "", "main");
    let wrong_repository_session = fixture
        .manager
        .get_by_id(&wrong_repository.id)
        .await
        .unwrap();
    let error = wrong_repository_session
        .ask("hello".into(), None)
        .await
        .unwrap_err();
    assert!(error
        .to_string()
        .contains("direct workspace repository does not match the registered project"));

    let wrong_subdir = fixture.direct_chat_with_metadata(
        &project,
        &fixture.repository,
        &fixture.repository,
        "",
        "main",
    );
    let wrong_subdir_session = fixture.manager.get_by_id(&wrong_subdir.id).await.unwrap();
    let error = wrong_subdir_session
        .ask("hello".into(), None)
        .await
        .unwrap_err();
    assert!(error
        .to_string()
        .contains("workspace project subdirectory does not match the registered project"));
    fixture.manager.shutdown_all().await;
}

#[tokio::test]
async fn unreadable_workspace_metadata_does_not_downgrade_to_legacy_session() {
    let fixture = Fixture::new();
    let project = fixture.nested_project();
    let chat = fixture.direct_chat_for_project(&project, "main", "nested");

    let raw = rusqlite::Connection::open(fixture._temp.path().join("hub.db")).unwrap();
    raw.execute_batch("PRAGMA ignore_check_constraints = ON;")
        .unwrap();
    raw.execute(
        "UPDATE chat_workspaces SET mode = ?1 WHERE chat_id = ?2",
        rusqlite::params!["not-a-workspace-mode", chat.id.as_str()],
    )
    .unwrap();

    assert!(fixture.manager.get_by_id(&chat.id).await.is_none());
    assert!(fixture.manager.list_sessions().await.is_empty());
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
