use clap::Parser;
use pueblo_hub::{
    agents::{parse_agents, AgentManager, HostRuntimeProbe},
    config::{Config, PathOverrides, PuebloPaths},
    events::EventLog,
    session::SessionManager,
    store::Store,
    web::WebServer,
};
use std::{path::PathBuf, sync::Arc};

#[derive(Parser)]
#[command(about = "Persistent single-owner ACP project/chat supervisor", version)]
struct Args {
    #[arg(long, env = "PUEBLO_HUB_DATABASE")]
    database: Option<PathBuf>,
    #[arg(long, env = "PUEBLO_HUB_DATA_DIR")]
    data_dir: Option<PathBuf>,
    #[arg(long, env = "PUEBLO_HUB_CONFIG_DIR")]
    config_dir: Option<PathBuf>,
    #[arg(long, env = "PUEBLO_HUB_STATE_DIR")]
    state_dir: Option<PathBuf>,
    #[arg(long, env = "PUEBLO_HUB_LOG_DIR")]
    log_dir: Option<PathBuf>,
    #[arg(long, env = "PUEBLO_HUB_WORKTREES_DIR")]
    worktrees_dir: Option<PathBuf>,
    #[arg(long, env = "PUEBLO_HUB_AGENTS_FILE")]
    agents_file: Option<PathBuf>,
    /// The ACP Registry document to read. The default is the official one.
    #[arg(long, env = "PUEBLO_HUB_REGISTRY_URL")]
    registry_url: Option<String>,
    #[arg(long, default_value_t = 8765, env = "PUEBLO_HUB_PORT")]
    port: u16,
    #[arg(long, default_value = "127.0.0.1", env = "PUEBLO_HUB_HOST")]
    host: String,
    #[arg(long, env = "PUEBLO_HUB_PUBLIC_ORIGIN")]
    public_origin: Option<String>,
    /// Optional inactivity watchdog for prompts. Unset means no silence timeout.
    #[arg(long, env = "PUEBLO_HUB_PROMPT_TIMEOUT")]
    prompt_timeout: Option<u64>,
    #[arg(
        long,
        required = true,
        env = "PUEBLO_HUB_PROJECT_ROOTS",
        value_delimiter = ','
    )]
    project_root: Vec<String>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();
    let args = Args::parse();
    let paths = PuebloPaths::from_overrides(PathOverrides {
        database: args.database,
        data_dir: args.data_dir,
        config_dir: args.config_dir,
        state_dir: args.state_dir,
        log_dir: args.log_dir,
        managed_worktrees: args.worktrees_dir,
    });
    let store = Arc::new(Store::open_with_paths(&paths)?);
    let events = Arc::new(EventLog::persistent(store.clone())?);
    let mut config = Config {
        paths,
        ..Config::default()
    };
    config.server.port = args.port;
    config.server.host = args.host;
    config.web.public_origin = args.public_origin;
    config.web.project_roots = args.project_root;
    config.timeouts.prompt = args.prompt_timeout;
    if let Some(path) = args.agents_file {
        config.agents = Arc::new(parse_agents(&std::fs::read_to_string(path)?)?);
    }
    if let Some(url) = args.registry_url {
        config.registry.url = url;
    }

    // Durable installed agents join the same catalog the sessions read. An id
    // that a declarative source already defines fails here, so a collision is
    // reported instead of resolved by precedence.
    let agent_manager = AgentManager::new(
        store.clone(),
        config.agents.clone(),
        config.registry.client(config.paths.registry_cache.clone()),
        config.paths.installed_agents.clone(),
        Arc::new(HostRuntimeProbe),
    );
    let loaded = agent_manager
        .load_persisted()
        .map_err(|error| anyhow::anyhow!("{error}"))?;
    tracing::info!(count = loaded, "loaded installed agents");
    config.agent_manager = Some(agent_manager);

    let manager = SessionManager::with_store(config.agents.clone(), events, Some(store));
    let web = WebServer::new(manager.clone(), Arc::new(config));
    #[cfg(unix)]
    let mut term = tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())?;
    let shutdown = async {
        #[cfg(unix)]
        tokio::select! { _ = term.recv() => {}, _ = tokio::signal::ctrl_c() => {} }
        #[cfg(not(unix))]
        let _ = tokio::signal::ctrl_c().await;
    };
    let result = tokio::select! { r = web.run() => r, _ = shutdown => Ok(()) };
    manager.shutdown_all().await;
    result
}
