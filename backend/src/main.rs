use clap::Parser;
use pueblo_hub::{
    agents::parse_agents, config::Config, events::EventLog, session::SessionManager, store::Store,
    web::WebServer,
};
use std::{ffi::OsString, path::PathBuf, sync::Arc};

const ENV_ALIASES: &[(&str, &str)] = &[
    ("PUEBLO_HUB_DATABASE", "AGENT_HUB_DATABASE"),
    ("PUEBLO_HUB_AGENTS_FILE", "AGENT_HUB_AGENTS_FILE"),
    ("PUEBLO_HUB_PORT", "AGENT_HUB_PORT"),
    ("PUEBLO_HUB_PUBLIC_ORIGIN", "AGENT_HUB_PUBLIC_ORIGIN"),
    ("PUEBLO_HUB_PROMPT_TIMEOUT", "AGENT_HUB_PROMPT_TIMEOUT"),
    ("PUEBLO_HUB_PROJECT_ROOTS", "AGENT_HUB_PROJECT_ROOTS"),
    ("PUEBLO_HUB_WIN_JOB_DEBUG", "AGENT_HUB_WIN_JOB_DEBUG"),
];

fn preferred_environment_value(
    canonical: Option<OsString>,
    legacy: Option<OsString>,
) -> Option<OsString> {
    canonical.or(legacy)
}

/// Populate canonical environment names from the old namespace before Clap
/// reads them. Command-line arguments and canonical variables already win.
fn apply_legacy_environment_aliases() {
    for &(canonical, legacy) in ENV_ALIASES {
        let canonical_value = std::env::var_os(canonical);
        if let Some(value) = preferred_environment_value(canonical_value, std::env::var_os(legacy))
        {
            if std::env::var_os(canonical).is_none() {
                // This runs before the application starts any work. No other
                // thread can observe or mutate these process configuration
                // variables during the alias normalization.
                unsafe { std::env::set_var(canonical, value) };
            }
        }
    }
}

#[derive(Parser)]
#[command(about = "Persistent single-owner ACP project/chat supervisor", version)]
struct Args {
    #[arg(long, env = "PUEBLO_HUB_DATABASE")]
    database: PathBuf,
    #[arg(long, env = "PUEBLO_HUB_AGENTS_FILE")]
    agents_file: Option<PathBuf>,
    #[arg(long, default_value_t = 8765, env = "PUEBLO_HUB_PORT")]
    port: u16,
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
    apply_legacy_environment_aliases();
    let args = Args::parse();
    let store = Arc::new(Store::open(&args.database)?);
    let events = Arc::new(EventLog::persistent(store.clone())?);
    let mut config = Config::default();
    config.server.port = args.port;
    config.web.public_origin = args.public_origin;
    config.web.project_roots = args.project_root;
    config.timeouts.prompt = args.prompt_timeout;
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

#[cfg(test)]
mod tests {
    use super::preferred_environment_value;
    use std::ffi::OsString;

    #[test]
    fn canonical_environment_value_precedes_legacy_alias() {
        assert_eq!(
            preferred_environment_value(
                Some(OsString::from("canonical")),
                Some(OsString::from("legacy")),
            ),
            Some(OsString::from("canonical"))
        );
    }

    #[test]
    fn legacy_environment_value_is_used_when_canonical_is_absent() {
        assert_eq!(
            preferred_environment_value(None, Some(OsString::from("legacy"))),
            Some(OsString::from("legacy"))
        );
    }
}
