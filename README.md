# Pueblo Hub

An uncomplicated hub to connect and manage all your ACP agents together.

No more shuffling around various tmux sessions or relying on each agent's proprietary remote control interface. Pueblo Hub allows you to drive agents such as Codex, Claude Code, and OpenCode across multiple projects at the same time through a beautiful Material 3 web page that you self-host. Agents can run in parallel using separate worktrees to prevent conflicts and maximize your usage quota across each LLM provider.

## Features

- **Angular Material Adaptive UI**: A standalone Angular application using Angular Material/CDK primitives and adaptive layouts responsive to compact, medium, and expanded window sizes.
- **Persistent Projects & Chats**: Multiple independent chats per project across different or identical agents. Full process lifecycle management with automatic session resumption, cancel, stop, and reconnect.
- **Server-Side Project Creation**: Create projects by browsing existing server directories with boundary enforcement or cloning remote Git repositories directly.
- **Streamlined Chat Flow**: New chat creation lets users choose the starting local branch and workspace mode for Git projects; Pueblo Hub automatically connects ACP session and displays configuration options immediately before the first prompt.
- **Dynamic Titles**: ACP agents automatically supply chat titles after conversations start, with persistent storage and optional manual rename overrides.
- **Permission & Configuration Control**: Dynamic ACP config options (grouped selects, booleans) and strict Pueblo Hub permission policies (`ask`, `read-only`, `auto-approve`, `deny-all`).
- **Single-Service Architecture**: Single Rust binary embeds production-hashed frontend assets with optimized HTTP caching and WebSocket streaming.
- **Workspace Environments & Direnv Authorization**: Automatically loads authorized workspace environments via direnv (`direnv export json`) for both main project checkouts and isolated worktrees. When an `.envrc` is blocked or untrusted, Pueblo Hub surfaces an inline authorization banner in the chat UI, securely invoking `direnv allow` against verified workspace paths.
- **Terminal Task Supervision**: Long-running ACP terminal commands are tracked as first-class background tasks. Users can monitor active tasks, view bounded UTF-8 output logs, and stop tasks directly from the web interface.
- **One interface for your agents** - Connect ACP-compatible agents and manage them from the same place instead of jumping between terminals and separate remote interfaces. Pueblo Hub currently works with agents such as Codex, Claude Code, and OpenCode.

- **Persistent projects and chats** - Organize chats under projects and come back to them later without having to recreate your setup. Pueblo Hub keeps the agent process and session management behind the scenes so you can focus on the conversation.

- **Parallel worktrees** - Run multiple agents against the same Git project without making them fight over a working directory. Isolated chats get their own worktree and branch by default, allowing agents to work independently while keeping your main checkout alone.

- **Project checkout mode** - Not everything needs a worktree. Chats can work directly inside the project's existing checkout when you want an agent operating on the branch and files already there.

Prompts have no silence timeout by default, so a quiet long-running tool call is
not killed. Set `--prompt-timeout <seconds>` (or
`PUEBLO_HUB_PROMPT_TIMEOUT`) only when an inactivity watchdog is required.

- **A proper interface for agent work** - Follow conversations, streaming responses, tool calls, plans, permission requests, and agent state through a responsive Material 3 interface. Pueblo Hub is designed for desktop and mobile layouts so your agents aren't tied to the terminal where you started them.

- **Agent configuration** - Configure available agents and their launch commands in one place while keeping per-chat options and permission policies close to the conversation. Pueblo Hub talks to agents through ACP rather than maintaining a separate chat implementation for every provider.

- **Git work stays safe** - Pueblo Hub treats your existing work as something it does not own. It will not silently reset, clean, stash, rebase, switch, or delete Git work to make its own job easier.

- **Self-hosted** - Run Pueblo Hub on your own machine or server and put it behind the authentication and HTTPS setup you prefer. The backend only binds to localhost by default rather than exposing itself directly to the network.

## Workspace Environments & Terminal Tasks

### Direnv Integration & Authorization

Pueblo Hub integrates with `direnv` to ensure ACP agent processes and terminal executions run with the expected local toolchains, environment variables, and shell configurations:
- **Automatic Resolution**: Whenever an agent process starts or creates a terminal, Pueblo Hub resolves the authorized environment using `direnv export json`.
- **Security-First Authorization**: Unapproved `.envrc` files are never auto-executed or sourced directly. If direnv reports that a workspace `.envrc` is blocked, Pueblo Hub catches the blocked state and surfaces a "Workspace environment blocked" banner in the web UI.
- **Strict Path Validation**: Environment authorizations only operate on paths derived from authenticated, Pueblo-managed chat workspace metadata, preventing path injection or traversal.

### Terminal Task Tracking

Agents that invoke long-running build, test, or watch commands via ACP terminal callbacks are supervised by Pueblo Hub:
- **Active Task Monitoring**: Chat headers and cards indicate ongoing terminal tasks and keep the chat in a working status.
- **Inspection & Control**: The "Terminal tasks" dialog provides a split-view of recent and running commands, command-line arguments, working directory, exit status, and real-time output.
- **Manual Termination**: Users can terminate running background commands at any time.

## Quick start

### Running Pueblo Hub

Pueblo Hub currently uses Nix to provide its environment.

Enter the development environment with direnv:

```sh
direnv allow
```

or directly with Nix:

```sh
nix develop
```

Build the complete application with embedded frontend assets:

```sh
nix build .#pueblo-hub
```

Run it directly from the flake without building first:

```sh
nix run .#pueblo-hub -- --project-root /path/to/projects
```

`nix run` launches the same canonical package binary that `nix build`
produces. `nix run .#pueblo-hub -- --help` shows every option.

This produces `result/bin/pueblo-hub`, which includes the embedded production
frontend:

```sh
result/bin/pueblo-hub \
  --project-root /path/to/projects \
  --agents-file agents.json \
  --registry-url https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json \
  --public-origin https://example.com \
  --port 9123
```

The database is optional. Without an explicit `--database` (or
`PUEBLO_HUB_DATABASE`), Pueblo uses the platform's XDG-style data location:
`$XDG_DATA_HOME/pueblo-hub/pueblo-hub.sqlite3` (falling back to
`~/.local/share/pueblo-hub`). Managed worktrees are kept in the same Pueblo
path model. An explicit database retains the existing layout, with worktrees
beside its parent in `worktrees/`; no existing data is moved or removed.

The path options `--data-dir`, `--config-dir`, `--state-dir`, `--log-dir`, and
`--worktrees-dir` have matching `PUEBLO_HUB_*_DIR` environment variables.
`--host` / `PUEBLO_HUB_HOST` controls the bind address and defaults to
`127.0.0.1`; `--port` / `PUEBLO_HUB_PORT` controls the port.

For standalone backend development without embedded frontend assets:

```sh
cargo build --bin pueblo-hub
```

This produces `target/debug/pueblo-hub`:

```sh
target/debug/pueblo-hub --help
```

The fake backend accepts two options:

| Option | Meaning |
| --- | --- |
| `--port <number>` | Listen port. Default 8765. |
| `--latency <factor>` | Multiplier for every simulated delay. `0.1` is fast, `3` is slow. Default 1. |

### Seeded data

The fake backend starts with three projects, four chats, and a finished conversation in each chat. The folder picker browses a synthetic directory tree under `/home/dev/projects`, so the picker never depends on the layout of your machine.

### Prompt scenarios

A keyword in the prompt selects the turn that the fake agent streams. This makes a UI state reproducible.

| Keyword | Streamed turn |
| --- | --- |
| `plan` | Thought, then a plan that advances through its steps. |
| `tool` | Tool calls only, without a thought block. |
| `permission` | A permission request that waits for your answer. |
| `error` | An error event and a failed turn. |
| `long` | A long answer, for scrolling and layout checks. |
| `quiet` | One short message. |
| (anything else) | A full turn: thought, plan, tool calls, permission request, and answer. |

The permission policy of the chat still applies. A chat set to `auto-approve`, `deny-all`, or `read-only` answers the request without the browser, exactly like `backend/src/acp/callbacks.rs`.

Cancel, stop, resume, archive, rename, and delete all work. Turn state, process state, and the event sequence follow the same rules as the Rust backend, so the reconnect and replay paths get exercised.

### Limits

The fake backend is a development tool. It keeps everything in memory, so a restart resets it. It has no authentication, no database, and no access to the real filesystem. It never runs an agent. Test protocol behavior against the Rust backend and the integration tests in `tests/`.

## Projects and Chats

Create a project pointing to an existing directory under a configured project root or clone from a Git repository. Canonical paths reject missing directories and symlink escapes. Create as many chats as needed, including several using the same agent in one project. Each chat has a stable UUID, independent process, ACP session ID, turn lock, permission policy, and selected ACP configuration values.

### Git chat workspaces

Git chats default to **Isolated worktree**. When creating a chat, choose the
starting local branch; Pueblo Hub creates a deterministic branch named
`pueblo-hub/chat/<chat-id>` and a separate managed worktree. Uncommitted changes
in the primary checkout are not copied into it. The branch and workspace
identity are visible in the chat header and configuration panel.

Users may explicitly choose **Project checkout**, which operates on the real
project checkout and the selected branch. Switching that checkout is allowed
only when it is safe (clean and not in use). Direct and legacy chats share the
same repository checkout turn lock and therefore cannot work concurrently.
Pueblo Hub never silently switches a direct chat back to its expected branch on
resume.

Deleting a clean managed chat removes its worktree but retains its branch.
Deletion refuses to discard dirty or untracked managed-worktree files. Direct
and legacy chat deletion leaves the repository checkout and Git state alone.

Opening a chat automatically connects the agent process and loads ACP configuration options immediately. Sending a prompt also connects automatically if stopped. `session/load` or advertised `session/resume` restores agent-owned conversation state.

Stop process and idle reaping preserve the chat and ACP session ID. Pueblo Hub
only reaps an idle process when its ACP agent advertises `session/load` or
`session/resume`; otherwise it keeps the process alive so the chat remains
usable. The default eligible idle timeout is 900 seconds. Cancel turn sends
`session/cancel` and resolves pending browser permissions. Archive stops an idle
process and keeps metadata; Restore makes the chat usable again. Delete removes
local metadata/activity only, never project files or the agent's own session
history.

## Configuration

Agents are configured in `agents.json`:

```json
{
  "codex": {
    "command": "codex-acp"
  },
  "claude": {
    "command": "claude-agent-acp"
  },
  "opencode": {
    "command": "opencode",
    "args": ["acp"]
  }
}
```

Definitions accept optional `args` (array), `env` (object), `idle_timeout`
(seconds), `display_name` (string), `usage_provider` (string), and `metadata`
(object). Pueblo Hub never derives a usage provider from the agent name.
The server binds to `127.0.0.1`. Put authenticated HTTPS in front of it before exposing Pueblo Hub remotely.

`--registry-url` (or `PUEBLO_HUB_REGISTRY_URL`) selects the HTTPS ACP Registry
catalog. Registry installs store a pinned launch snapshot locally; browsing or
refreshing the catalog is never required to resume a chat.

The agent-management API is provider-neutral:

- `GET` / `POST /api/agents`, `PATCH` / `DELETE /api/agents/:id`, and `POST /api/agents/validate` manage custom definitions.
- `GET /api/agents/registry`, `POST /api/agents/registry/refresh`, and `POST /api/agents/registry/install` browse and install registry entries.
- `POST /api/agents/:id/update` updates an installed registry agent.

Built-in and `agents.json` definitions are read-only through this API. Agent
summaries report source, availability, mutability, display metadata, and an
unavailable reason when applicable; launch commands and environment values are
never returned.

Agent authentication is provider-neutral too, and it belongs to the agent
rather than to a chat:

- `GET /api/agents/:id/auth` reports the methods the agent advertised at
  `initialize`, whether it supports logout, and whether this build runs
  terminal authentication. A method type Pueblo Hub cannot run comes back as
  unsupported; Pueblo Hub never guesses a fallback for it.
- `POST /api/agents/:id/auth/:methodId` runs an `agent` method through the
  stable `authenticate` request.
- `POST /api/agents/:id/logout` runs the stable `logout` request. It goes out
  only when the agent advertised that capability, and it never touches Pueblo
  Hub chats, sessions, or history.
- `POST /api/agents/:id/auth/terminal/:methodId` starts a `terminal` method in
  a real PTY and returns a flow. `GET /api/agent-auth/:flowId`,
  `POST /api/agent-auth/:flowId/cancel`, and `GET /api/agent-auth/:flowId/ws`
  read, cancel, and drive that flow.

A terminal flow reproduces the configured agent invocation: the same
executable, the same arguments with the advertised ones appended, the same
sanitized environment with the advertised values overriding it, and a
Pueblo-owned working directory. No request supplies an executable, an
argument, a working directory, or an environment value, so the API cannot
become a remote shell. Terminal input and output stay in memory: they never
reach the event log, the database, or the server log. Cancelling a flow, a
flow nobody watches, and server shutdown all kill the whole process tree.

An agent that answers `auth_required` produces a recoverable `409` with
`"code": "auth_required"` and the agent id. The chat and its history stay
exactly as they were.

Deployments can also supply `--declarative-agents-file` (or
`PUEBLO_HUB_DECLARATIVE_AGENTS_FILE`). It has the same shape as `agents.json`
plus `pass_env`, `default_permission_policy`, and `description`, feeds the
same catalog with `AgentSource::Declarative`, and stays read-only in the
management APIs. An `npx` or `uvx` agent is just a pinned manual launch such
as `command = "npx"` with `args = ["--yes", "package-acp@1.2.3", "--acp"]`,
so no live registry lookup happens. The NixOS module generates this file for
you; see the production deployment section below.

## Production deployment

Pueblo Hub behaves like a normal nixpkgs-style package and NixOS service.
Another flake can consume it directly without copying packaging code. The OCI
image is built from exactly the same package.

### Flake package and overlay

```sh
nix build .#pueblo-hub
nix run .#pueblo-hub -- --help
```

The version comes from `Cargo.toml`, so there is one authoritative source.

A downstream flake can use the package through the overlay:

```nix
{
  inputs.pueblo-hub.url = "github:JuanDelPueblo/pueblo-hub";
  outputs = { nixpkgs, pueblo-hub, ... }: {
    # makes pkgs.pueblo-hub available with the same derivation
    nixpkgs.overlays = [ pueblo-hub.overlays.default ];
  };
}
```

Or override the service package with the canonical build:

```nix
services.pueblo-hub.package = pueblo-hub.packages.${system}.pueblo-hub;
```

### Minimal NixOS configuration

```nix
{
  inputs.pueblo-hub.url = "github:JuanDelPueblo/pueblo-hub";
  outputs = { nixpkgs, pueblo-hub, ... }: {
    nixosConfigurations.server = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        pueblo-hub.nixosModules.default
        {
          services.pueblo-hub.enable = true;
          services.pueblo-hub.projectRoots = [ "/srv/projects" ];
        }
      ];
    };
  };
}
```

That is the whole thing for a standard deployment. Importing
`pueblo-hub.nixosModules.default` also installs the Pueblo overlay, so the
default `services.pueblo-hub.package` resolves with nothing else to set;
override it only when you want a different build. Add network options only
when you need them, such as `services.pueblo-hub.host`, `.port`, or
`.publicOrigin`. The module also exposes typed options for prompt timeout,
registry URL, data/state/config/log/worktree locations, runtime packages,
environment values, environment files, and declarative agents. Run
`nixos-option services.pueblo-hub` to browse them.

The service starts at the normal multi-user target, restarts on failure,
shuts down gracefully on SIGTERM, and cleans up supervised ACP descendants
through its control group, so no agent processes are left behind after a
stop or restart. Sandboxing is intentionally light: agents must still work
in project roots, use Git, start terminal tasks, and resolve workspace
environments.

Nix workspace environments work out of the box. The service PATH provides
`direnv` and the Nix tooling needed for `use flake` and nix-direnv style
`.envrc` files without a custom Pueblo package, and the service sets
`NIX_CONFIG=experimental-features = nix-command flakes` for its own
environment, so no system-wide Nix settings are required. Pueblo Hub never
auto-authorizes `.envrc` files. When an environment is blocked, authorize
it from the chat UI, which runs `direnv allow` against the verified
workspace path.

Supported registry `npx` and `uvx` agents work with the generic runtimes in
`services.pueblo-hub.runtimePackages`, which defaults to Node (`npx`) and
`uv` (`uvx`). Extend or override that list for your deployment, but do not
expect project toolchains there. Remove an entry and its agents are reported
deterministically unavailable instead of failing at session start.

### Service user and paths

By default the module creates a dedicated `pueblo-hub` system user and group
and gives it a stable HOME at `/var/lib/pueblo-hub`. Agent authentication
and configuration stored there survives restarts and package upgrades.
Persistent Pueblo state lives under systemd directory management
(`StateDirectory=pueblo-hub`), with deterministic `--data-dir`,
`--state-dir`, and `--config-dir` instead of root's HOME. Redirecting them
needs no manual setup either: the module creates and chowns every
Pueblo-owned directory through tmpfiles, so `dataDir = "/srv/pueblo-data"`
just works. Project roots are the exception on purpose — they hold your
data, so the service never takes ownership of them.

To run as an existing account instead:

```nix
services.pueblo-hub.user = "alice";
services.pueblo-hub.group = "users";
```

An explicitly selected user or group is assumed to exist and is never
redefined. Give that account read and write access to every entry in
`services.pueblo-hub.projectRoots`, and make sure its HOME persists if your
agents keep auth there.

### Declarative agents

```nix
services.pueblo-hub.agents.my-agent = {
  command = "${pkgs.my-agent}/bin/my-acp";
  args = [ "--stdio" ];
  displayName = "My agent";
  idleTimeout = 300;
  usageProvider = "internal";
  defaultPermissionPolicy = "ask";
  description = "Our own agent";
  env.REGION = "eu";
  passEnv = [ "MY_AGENT_TOKEN" ];
};
services.pueblo-hub.agents.pkg = {
  npx.package = "package-acp@1.2.3";
  npx.args = [ "--acp" ];
};
```

Each agent sets exactly one of `command`, `npx`, or `uvx`. A Nix package
path works naturally as `command`. Pinned `npx` (`pkg@1.2.3`) and `uvx`
(`pkg==1.2.3`) launches are reproducible and never fetch a mutable
`latest` entry during evaluation or startup. Binary registry installs are
covered the same way: point `command` at a Nix-provided store path with an
explicit source instead of downloading latest. Declarative agents appear
with source `declarative`, stay read-only in the web management APIs, and
live happily beside web-managed custom and registry agents. An id that any
other source already owns fails clearly at startup instead of silently
winning.

### Secrets and environment files

Never put API keys, tokens, or passwords in `env`. Those values land in the
Nix store. Name them with `passEnv` and supply the values at runtime:

```nix
services.pueblo-hub.environmentFiles = [ "/run/secrets/pueblo-hub.env" ];
services.pueblo-hub.agents.my-agent.passEnv = [ "MY_AGENT_TOKEN" ];
```

Where `/run/secrets/pueblo-hub.env` holds `MY_AGENT_TOKEN=...`. Use
`services.pueblo-hub.environment` only for non-secret values.

The boundary is real, not advisory. At startup Pueblo moves every listed
secret name out of its own environment into a stash, so the inherited
workspace environment that all agents share never carries them. Each value
is then injected only into the agents whose `passEnv` names it. An agent
that names nothing — including every web-managed custom agent — receives
no secret, and one agent never sees another agent's token. Names that
should be stripped but injected nowhere belong in
`services.pueblo-hub.secretEnvVars`.

### Containers

```sh
nix build .#pueblo-hub-oci
docker load -i result  # prints the tag, e.g. pueblo-hub:0.3.0
docker run --rm -p 127.0.0.1:8765:8765 \
  -v pueblo-data:/data \
  -v "$PWD/projects:/projects" \
  pueblo-hub:0.3.0
```

The image is built with `dockerTools` from the canonical package, not a
second compiler path, and there is no Dockerfile to drift. It runs non-root,
binds `0.0.0.0:8765`, keeps HOME and state in `/data`, and expects projects
in `/projects`:

```sh
docker load -i result
docker run --rm -p 127.0.0.1:8765:8765 \
  -v pueblo-data:/data \
  -v "$PWD/projects:/projects" \
  pueblo-hub:latest
```

Persist `/data` if you want the database and ACP-agent auth to survive
container replacement. A named volume inherits the image's non-root
ownership and just works; a host bind mount must be writable by UID 65534
(the image user). Mount each project root under `/projects` (or pass
your own `--project-root` flags plus matching mounts). A runtime smoke test
lives in `nix/oci-smoke.sh` and checks `/api/status` plus the embedded
frontend with temporary mounts.

### Developing Pueblo Hub

Clone the repository and enter its Nix environment:

```sh
git clone https://github.com/JuanDelPueblo/pueblo-hub.git
cd pueblo-hub
direnv allow
```

The frontend can be developed independently:

```sh
cd frontend
npm run dev
```

Then open `http://localhost:4200`.

The standard final check for any implementation task is:

```sh
nix run .#verify
```

It runs the full source-level suite — Rust formatting, clippy, Rust tests, frontend tests, the frontend production build, and fake-backend tests — using tools supplied by Nix, so you don't need to enter `nix develop` first.

Before submitting backend changes:

```sh
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo nextest run
```

For frontend changes:

```sh
cd frontend
npm test
npm run build
```

The complete application with embedded frontend assets is built authoritatively with:

```sh
nix build .#pueblo-hub
```

This build is packaging and release verification. It does not rerun the Rust test suite. `nix run .#verify` remains the verification path.

## License

GPL-3.0-only.

Backend forked from github.com/missdeer/ccgonext.

Pueblo Hub does not include proprietary agent binaries.
