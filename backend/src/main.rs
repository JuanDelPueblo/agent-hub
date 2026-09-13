use agent_hub::{
    agents::parse_agents, config::Config, events::EventLog, session::SessionManager, store::Store,
    web::WebServer,
};
use clap::Parser;
use std::{path::PathBuf, sync::Arc};

#[derive(Parser)]
#[command(about = "Persistent single-owner ACP project/chat supervisor", version)]
struct Args {
    #[arg(long, env = "AGENT_HUB_DATABASE")]
    database: PathBuf,
    #[arg(long, env = "AGENT_HUB_AGENTS_FILE")]
    agents_file: Option<PathBuf>,
    #[arg(long, default_value_t = 8765, env = "AGENT_HUB_PORT")]
    port: u16,
    #[arg(long, env = "AGENT_HUB_PUBLIC_ORIGIN")]
    public_origin: Option<String>,
    #[arg(
        long,
        required = true,
        env = "AGENT_HUB_PROJECT_ROOTS",
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
    let store = Arc::new(Store::open(&args.database)?);
    let events = Arc::new(EventLog::persistent(store.clone())?);
    let mut config = Config::default();
    config.server.port = args.port;
    config.web.public_origin = args.public_origin;
    config.web.project_roots = args.project_root;
    if let Some(path) = args.agents_file {
        config.agents = Arc::new(parse_agents(&std::fs::read_to_string(path)?)?);
    }
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
