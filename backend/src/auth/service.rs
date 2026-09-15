//! The agent-level authentication coordinator.
//!
//! Authentication belongs to an installed agent, not to a chat. A user must
//! be able to log an agent in before any chat exists, and a login must not
//! disturb a chat that is already running a turn. This coordinator therefore
//! starts its own short-lived ACP processes and never touches a chat session.
//!
//! Every process it starts uses the installed catalog runtime, a Pueblo-owned
//! working directory, and the sanitized per-agent environment. It never reads
//! a project `.envrc`, because an agent-level login has no project.
use super::flow::{TerminalAuthFlow, TerminalAuthFlowView, TerminalAuthFlows, TerminalFlowState};
use super::pty::{PtyCommand, TERMINAL_AUTH_SUPPORTED};
use crate::acp::auth::{AgentAuthState, AuthMethodKind, TerminalAuthMethod};
use crate::acp::callbacks::CallbackPolicy;
use crate::acp::AcpClient;
use crate::agents::{AgentCatalog, AgentRuntime};
use crate::events::EventLog;
use crate::session::SessionManager;
use serde::Serialize;
use std::collections::{BTreeMap, HashMap};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::RwLock;

/// How long a probe result answers a read before Pueblo Hub probes again.
/// Every probe starts an agent process, so repeated reads must not start one
/// each time. Every authentication change refreshes the entry immediately.
const AUTH_CACHE_TTL: Duration = Duration::from_secs(15);
/// How long one probe may take, including process start and `initialize`.
const PROBE_TIMEOUT: Duration = Duration::from_secs(90);
/// The private event log of the probe processes. Nothing subscribes to it, so
/// no authentication traffic can reach a durable chat event.
const PROBE_EVENT_CAPACITY: usize = 64;

/// A failure of an authentication operation, in transport-neutral terms.
#[derive(Debug)]
pub enum AgentAuthError {
    NotFound(String),
    Invalid(String),
    Conflict(String),
    Unavailable(String),
    Internal(anyhow::Error),
}

impl std::fmt::Display for AgentAuthError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotFound(m) | Self::Invalid(m) | Self::Conflict(m) | Self::Unavailable(m) => {
                f.write_str(m)
            }
            Self::Internal(e) => write!(f, "{e}"),
        }
    }
}

impl std::error::Error for AgentAuthError {}

type AuthResult<T> = std::result::Result<T, AgentAuthError>;

/// One advertised authentication method, as clients see it.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct AuthMethodView {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    /// The advertised method type, including a type this build cannot run.
    #[serde(rename = "type")]
    pub method_type: String,
    /// Whether this build can run the method.
    pub supported: bool,
}

/// The authentication state of one installed agent.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct AgentAuthView {
    pub agent_id: String,
    pub methods: Vec<AuthMethodView>,
    /// Whether the agent advertised the stable logout capability.
    pub logout_supported: bool,
    /// Whether this build runs terminal authentication at all.
    pub terminal_supported: bool,
}

impl AgentAuthView {
    fn new(agent_id: &str, state: &AgentAuthState) -> Self {
        Self {
            agent_id: agent_id.to_owned(),
            methods: state
                .methods
                .iter()
                .map(|method| AuthMethodView {
                    id: method.id.clone(),
                    name: method.name.clone(),
                    description: method.description.clone(),
                    method_type: method.type_name().to_owned(),
                    supported: method.is_supported(TERMINAL_AUTH_SUPPORTED),
                })
                .collect(),
            logout_supported: state.logout_supported,
            terminal_supported: TERMINAL_AUTH_SUPPORTED,
        }
    }
}

struct CachedState {
    state: AgentAuthState,
    read_at: Instant,
}

pub struct AgentAuthService {
    agents: Arc<AgentCatalog>,
    sessions: Arc<SessionManager>,
    /// The working directory every authentication process runs in. It belongs
    /// to Pueblo Hub, so no browser path and no project workspace is involved.
    work_dir: PathBuf,
    flows: Arc<TerminalAuthFlows>,
    cache: RwLock<HashMap<String, CachedState>>,
    /// Serializes probes, so a burst of reads cannot start a burst of agent
    /// processes.
    probe_lock: tokio::sync::Mutex<()>,
    /// A private in-memory log for the probe processes.
    events: Arc<EventLog>,
    /// A tracker separate from the chat task tracker, so an authentication
    /// process never appears among a chat's terminal tasks.
    tasks: Arc<crate::tasks::TerminalTaskTracker>,
}

impl std::fmt::Debug for AgentAuthService {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("AgentAuthService")
            .field("work_dir", &self.work_dir)
            .finish_non_exhaustive()
    }
}

impl AgentAuthService {
    pub fn new(
        agents: Arc<AgentCatalog>,
        sessions: Arc<SessionManager>,
        work_dir: PathBuf,
    ) -> Arc<Self> {
        Arc::new(Self {
            agents,
            sessions,
            work_dir,
            flows: Arc::new(TerminalAuthFlows::new()),
            cache: RwLock::new(HashMap::new()),
            probe_lock: tokio::sync::Mutex::new(()),
            events: Arc::new(EventLog::new(PROBE_EVENT_CAPACITY)),
            tasks: Arc::new(crate::tasks::TerminalTaskTracker::default()),
        })
    }

    /// The authentication state of one agent. A recent probe answers without
    /// starting another process.
    pub async fn auth_view(&self, agent_id: &str) -> AuthResult<AgentAuthView> {
        let state = self.state(agent_id, false).await?;
        Ok(AgentAuthView::new(agent_id, &state))
    }

    /// Runs the stable `authenticate` method for one advertised `agent`
    /// method, then reads the authoritative state again.
    pub async fn authenticate(&self, agent_id: &str, method_id: &str) -> AuthResult<AgentAuthView> {
        let client = self.connect(agent_id).await?;
        let state = client.auth_state().await;
        let method = state
            .method(method_id)
            .ok_or_else(|| {
                AgentAuthError::NotFound(format!(
                    "Agent '{agent_id}' does not advertise the authentication method '{method_id}'"
                ))
            })
            .cloned();
        let outcome = match method {
            Err(error) => Err(error),
            Ok(method) => match &method.kind {
                AuthMethodKind::Agent => client
                    .authenticate(method_id)
                    .await
                    .map(|_| ())
                    .map_err(|error| AgentAuthError::Invalid(error.to_string())),
                AuthMethodKind::Terminal(_) => Err(AgentAuthError::Invalid(format!(
                    "Authentication method '{method_id}' runs in a terminal. Start a terminal authentication flow instead."
                ))),
                AuthMethodKind::Unsupported(kind) => Err(AgentAuthError::Invalid(format!(
                    "Authentication method '{method_id}' uses the unsupported type '{kind}'"
                ))),
            },
        };
        client.shutdown().await;
        outcome?;
        self.refresh_after_change(agent_id).await
    }

    /// Runs the capability-gated stable `logout` method, then reads the
    /// authoritative state again.
    ///
    /// Pueblo Hub chats, sessions, and history are untouched. Logout only
    /// removes the credentials the agent itself holds.
    pub async fn logout(&self, agent_id: &str) -> AuthResult<AgentAuthView> {
        let client = self.connect(agent_id).await?;
        let supported = client.auth_state().await.logout_supported;
        let outcome = if supported {
            client
                .logout()
                .await
                .map(|_| ())
                .map_err(|error| AgentAuthError::Invalid(error.to_string()))
        } else {
            Err(AgentAuthError::Conflict(format!(
                "Agent '{agent_id}' does not support logout"
            )))
        };
        client.shutdown().await;
        outcome?;
        self.refresh_after_change(agent_id).await
    }

    /// Starts a terminal authentication flow for one advertised `terminal`
    /// method.
    ///
    /// The command comes from the installed runtime and from the method the
    /// agent advertised. Nothing in it comes from the request.
    pub async fn start_terminal(
        self: &Arc<Self>,
        agent_id: &str,
        method_id: &str,
    ) -> AuthResult<TerminalAuthFlowView> {
        if !TERMINAL_AUTH_SUPPORTED {
            return Err(AgentAuthError::Unavailable(
                "Terminal authentication is not supported on this platform".into(),
            ));
        }
        let runtime = self.runtime(agent_id)?;
        let state = self.state(agent_id, true).await?;
        let method = state.method(method_id).ok_or_else(|| {
            AgentAuthError::NotFound(format!(
                "Agent '{agent_id}' does not advertise the authentication method '{method_id}'"
            ))
        })?;
        let terminal = match &method.kind {
            AuthMethodKind::Terminal(terminal) => terminal,
            AuthMethodKind::Agent => {
                return Err(AgentAuthError::Invalid(format!(
                    "Authentication method '{method_id}' is not a terminal method"
                )))
            }
            AuthMethodKind::Unsupported(kind) => {
                return Err(AgentAuthError::Invalid(format!(
                    "Authentication method '{method_id}' uses the unsupported type '{kind}'"
                )))
            }
        };

        let cwd = self.work_dir()?;
        let command = terminal_command(&runtime, terminal, &self.agent_env(&runtime), &cwd);
        let flow = self
            .flows
            .start(agent_id, method_id, &command)
            .map_err(|error| AgentAuthError::Conflict(error.to_string()))?;
        self.watch_terminal_flow(flow.clone());
        Ok(flow.view())
    }

    pub fn terminal_flow(&self, flow_id: &str) -> AuthResult<Arc<TerminalAuthFlow>> {
        self.flows
            .get(flow_id)
            .ok_or_else(|| AgentAuthError::NotFound("Authentication flow not found".into()))
    }

    pub fn terminal_flow_view(&self, flow_id: &str) -> AuthResult<TerminalAuthFlowView> {
        Ok(self.terminal_flow(flow_id)?.view())
    }

    pub fn cancel_terminal_flow(&self, flow_id: &str) -> AuthResult<TerminalAuthFlowView> {
        let flow = self.terminal_flow(flow_id)?;
        flow.cancel();
        Ok(flow.view())
    }

    /// Ends every flow and kills every process tree.
    pub fn shutdown(&self) {
        self.flows.shutdown_all();
    }

    /// Reads the authoritative state again after an authentication change,
    /// and lets stopped sessions pick up the new credentials.
    async fn refresh_after_change(&self, agent_id: &str) -> AuthResult<AgentAuthView> {
        // A stopped session starts again from the catalog, so retiring it
        // makes the next start observe the new credentials. A starting or
        // running session keeps its process: an active turn must survive an
        // authentication change.
        self.sessions
            .invalidate_stopped_sessions_for_agent(agent_id)
            .await;
        let state = self.state(agent_id, true).await?;
        Ok(AgentAuthView::new(agent_id, &state))
    }

    /// Refreshes the agent state once a terminal flow succeeds.
    ///
    /// A successful terminal command means the agent stored its own
    /// credentials. The stable protocol forbids `authenticate` for that
    /// method, so Pueblo Hub starts the agent again and reads `initialize`.
    fn watch_terminal_flow(self: &Arc<Self>, flow: Arc<TerminalAuthFlow>) {
        let service = self.clone();
        tokio::spawn(async move {
            if flow.wait_finished().await != TerminalFlowState::Succeeded {
                return;
            }
            if let Err(error) = service.refresh_after_change(&flow.agent_id).await {
                tracing::warn!(
                    agent = %flow.agent_id,
                    %error,
                    "Could not read the agent authentication state after terminal authentication"
                );
            }
        });
    }

    /// The typed authentication state, from the cache or from a fresh probe.
    async fn state(&self, agent_id: &str, force: bool) -> AuthResult<AgentAuthState> {
        if !force {
            if let Some(cached) = self.cache.read().await.get(agent_id) {
                if cached.read_at.elapsed() < AUTH_CACHE_TTL {
                    return Ok(cached.state.clone());
                }
            }
        }
        let _probe_guard = self.probe_lock.lock().await;
        if !force {
            if let Some(cached) = self.cache.read().await.get(agent_id) {
                if cached.read_at.elapsed() < AUTH_CACHE_TTL {
                    return Ok(cached.state.clone());
                }
            }
        }
        let client = self.connect(agent_id).await?;
        let state = client.auth_state().await;
        client.shutdown().await;
        self.cache.write().await.insert(
            agent_id.to_owned(),
            CachedState {
                state: state.clone(),
                read_at: Instant::now(),
            },
        );
        Ok(state)
    }

    /// Starts one agent process and completes `initialize`.
    ///
    /// The caller owns the returned client and must shut it down. The process
    /// never opens a session, so it can never run a turn.
    async fn connect(&self, agent_id: &str) -> AuthResult<AcpClient> {
        let runtime = self.runtime(agent_id)?;
        let cwd = self.work_dir()?;
        let env = self.agent_env(&runtime);
        let client = tokio::time::timeout(
            PROBE_TIMEOUT,
            AcpClient::spawn(
                &runtime.launch.command,
                &runtime.launch.args,
                &env,
                &cwd,
                // The probe process never receives a prompt, so it has no
                // legitimate reason to edit a file or run a command.
                CallbackPolicy::DenyAll,
                format!("agent-auth:{agent_id}"),
                agent_id.to_owned(),
                self.events.clone(),
                None,
                self.tasks.clone(),
            ),
        )
        .await
        .map_err(|_| {
            AgentAuthError::Unavailable(format!("Agent '{agent_id}' did not start in time"))
        })?
        .map_err(|error| AgentAuthError::Unavailable(error.to_string()))?;

        match tokio::time::timeout(PROBE_TIMEOUT, client.initialize(&cwd)).await {
            Ok(Ok(_)) => Ok(client),
            Ok(Err(error)) => {
                client.shutdown().await;
                Err(AgentAuthError::Unavailable(format!(
                    "Agent '{agent_id}' could not report its authentication methods: {error}"
                )))
            }
            Err(_) => {
                client.shutdown().await;
                Err(AgentAuthError::Unavailable(format!(
                    "Agent '{agent_id}' did not answer initialize in time"
                )))
            }
        }
    }

    fn runtime(&self, agent_id: &str) -> AuthResult<Arc<AgentRuntime>> {
        if let Some(runtime) = self.agents.runtime(agent_id) {
            return Ok(runtime);
        }
        if self.agents.contains(agent_id) {
            return Err(AgentAuthError::Unavailable(format!(
                "Agent '{agent_id}' is not available"
            )));
        }
        Err(AgentAuthError::NotFound(format!(
            "Unknown agent '{agent_id}'"
        )))
    }

    /// The sanitized environment one authentication process starts with.
    ///
    /// The base is the Pueblo Hub process environment, which startup already
    /// emptied of every stashed secret. `resolve_agent_env` scrubs the stashed
    /// names again and injects only the names this agent's `pass_env` lists,
    /// so one agent never observes another agent's secret.
    fn agent_env(&self, runtime: &AgentRuntime) -> HashMap<String, String> {
        let base: HashMap<String, String> = std::env::vars().collect();
        crate::workspace_env::resolve_agent_env(
            &base,
            &runtime.launch.env,
            &runtime.launch.pass_env,
            &self.sessions.secret_env(),
        )
    }

    fn work_dir(&self) -> AuthResult<PathBuf> {
        std::fs::create_dir_all(&self.work_dir).map_err(|error| {
            AgentAuthError::Internal(anyhow::anyhow!(
                "Could not create the authentication working directory {}: {error}",
                self.work_dir.display()
            ))
        })?;
        Ok(self.work_dir.clone())
    }
}

/// Builds the exact terminal authentication invocation.
///
/// The stable rule is precise, so this stays one small pure function a test
/// can check:
///
/// - the base executable is unchanged;
/// - the base arguments are unchanged;
/// - the method arguments follow them, in advertised order;
/// - the environment is the same sanitized base environment;
/// - the method environment overrides the same names in that base.
pub fn terminal_command(
    runtime: &AgentRuntime,
    method: &TerminalAuthMethod,
    base_env: &HashMap<String, String>,
    cwd: &Path,
) -> PtyCommand {
    let mut args = runtime.launch.args.clone();
    args.extend(method.args.iter().cloned());
    let mut env: BTreeMap<String, String> = base_env
        .iter()
        .map(|(name, value)| (name.clone(), value.clone()))
        .collect();
    for (name, value) in &method.env {
        env.insert(name.clone(), value.clone());
    }
    PtyCommand {
        program: runtime.launch.command.clone(),
        args,
        env,
        cwd: cwd.to_path_buf(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::agents::AgentDefinition;

    fn runtime() -> AgentRuntime {
        AgentDefinition::new("demo", "demo-acp")
            .with_args(vec!["acp".into(), "--stdio".into()])
            .with_env(HashMap::from([("BASE_ONLY".into(), "base".into())]))
            .runtime()
    }

    #[test]
    fn terminal_command_appends_method_args_after_base_args() {
        let method = TerminalAuthMethod {
            args: vec!["login".into(), "--device".into()],
            env: BTreeMap::new(),
        };
        let command = terminal_command(
            &runtime(),
            &method,
            &HashMap::new(),
            Path::new("/var/lib/pueblo"),
        );
        assert_eq!(command.program, "demo-acp");
        assert_eq!(command.args, vec!["acp", "--stdio", "login", "--device"]);
        assert_eq!(command.cwd, Path::new("/var/lib/pueblo"));
    }

    #[test]
    fn method_env_overrides_the_base_env() {
        let method = TerminalAuthMethod {
            args: Vec::new(),
            env: BTreeMap::from([
                ("SHARED".into(), "from-method".into()),
                ("METHOD_ONLY".into(), "yes".into()),
            ]),
        };
        let base = HashMap::from([
            ("SHARED".to_string(), "from-base".to_string()),
            ("BASE_ONLY".to_string(), "kept".to_string()),
        ]);
        let command = terminal_command(&runtime(), &method, &base, Path::new("/tmp"));
        assert_eq!(
            command.env.get("SHARED").map(String::as_str),
            Some("from-method")
        );
        assert_eq!(
            command.env.get("BASE_ONLY").map(String::as_str),
            Some("kept")
        );
        assert_eq!(
            command.env.get("METHOD_ONLY").map(String::as_str),
            Some("yes")
        );
    }

    /// A method that advertises nothing must reproduce the base invocation.
    #[test]
    fn an_empty_method_reproduces_the_base_invocation() {
        let base = HashMap::from([("BASE_ONLY".to_string(), "kept".to_string())]);
        let command = terminal_command(
            &runtime(),
            &TerminalAuthMethod::default(),
            &base,
            Path::new("/tmp"),
        );
        assert_eq!(command.program, "demo-acp");
        assert_eq!(command.args, vec!["acp", "--stdio"]);
        assert_eq!(command.env.len(), 1);
    }
}
