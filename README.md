# Agent Hub v0.1

A single-owner, persistent web supervisor for local ACP coding agents, forked
from [CCGONEXT](https://github.com/missdeer/ccgonext). GPL-3.0-only; upstream
copyright and license files are retained. No proprietary agent binaries are
included. Historical documentation is in `README.upstream.md`.

## Run

```sh
cargo build --bin agent-hub
target/debug/agent-hub --database /path/to/state/hub.sqlite3 \
  --project-root /home/tony --agents-file agents.json \
  --public-origin https://agents.home.edyan.me --port 9123
```

The database's parent directory must exist and be private. The server binds
only to `127.0.0.1`. Put authenticated HTTPS in front of it before exposing it.
`--public-origin` authorizes an exact browser Origin and Host, not authentication.
Juno supplies Traefik basic authentication using a runtime htpasswd file. Local
loopback clients are trusted. No executable paths are accepted from the browser.

## Projects and chats

Create a project pointing to an existing directory under a configured project
root. Canonical paths reject missing directories and symlink escapes. Create as
many chats as needed, including several using the same agent in one project.
Each chat has a stable UUID, independent process, ACP session ID, turn lock,
permission policy and selected ACP configuration values.

Reconnect initializes an agent and creates or loads its session. Sending a
prompt also connects automatically. `session/load`, or advertised
`session/resume`, restores agent-owned conversation state. Failed or unsupported
resume is an error; Agent Hub never replaces a saved conversation with
`session/new`. Use a new chat when the agent cannot resume. Agent replay is not
duplicated into the already persisted UI activity log.

Stop process, idle reaping (900 seconds by default), and backend restart preserve
the chat and ACP session ID. Advertised `session/close` is attempted before
process-tree cleanup. Cancel turn sends `session/cancel` and resolves pending
browser permissions. Archive stops an idle process and keeps metadata; Restore
makes the chat usable again. Delete removes local metadata/activity only, never
project files or the agent's own session history. Remove projects after deleting
their chats. A project with chats cannot change directory because its ACP
sessions belong to the original directory.

## Configuration

Server-owned JSON definitions are generic:

```json
{
  "codex": {"command": "codex-acp"},
  "claude": {"command": "claude-agent-acp"},
  "opencode": {"command": "opencode", "args": ["acp"]},
  "antigravity": {"command": "agy_acp_server.par", "args": ["--uid="]}
}
```

Definitions also accept `env` (object) and `idle_timeout` (seconds). Nix supplies
absolute store paths. Add another ACP agent by adding an entry here; no session
manager changes are needed. Removing a definition keeps chats visible, but
reconnecting requires restoring it.

The UI renders ACP `configOptions` dynamically, including grouped selects and
advertised boolean options, and listens for `config_option_update`. Changes use
`session/set_config_option` and its authoritative replacement option list.
Selected values are saved per chat and reapplied on reconnect. If a saved option
is no longer accepted, the UI warns and shows the agent's current values.
Unknown option types remain visible but cannot be edited. Agents that advertise
no configuration options have no model controls; the hub does not invent options.

Permission policy is separate from agent configuration. New chats default
to `ask`. `read-only` allows client file reads but denies write/terminal and agent
permission requests; `deny-all` denies callbacks; `auto-approve` allows them.
Ask requests have a ten-minute deadline and explicit Approve/Deny buttons.
These policies govern ACP callbacks, not OS sandboxing: agents may have native
tools, sandbox settings, or modes that do not ask the client. This is a trusted,
powerful service with the owner's project and authentication access.

## Architecture and state

The Rust module structure is retained: `acp/` owns subprocesses, NDJSON JSON-RPC,
callbacks and process trees; `session/` owns chat-specific lifecycle and locking;
`events.rs` owns ordered replay and WebSocket publication; `web/` serves the API
and embedded lightweight HTML/JavaScript UI. `store.rs` adds SQLite metadata and
activity persistence. The legacy `ccgonext` MCP executable remains available;
its ephemeral `(agent, cwd)` convenience API is disabled in the persistent hub.

SQLite uses WAL, a busy timeout and foreign keys. Projects and chats are stored
as application records keyed by ID and project membership. Activity is durable;
the latest 10,000 events are retained in the WebSocket replay window. The
database retains older activity until its chat is deleted. Back up using
SQLite's online backup command or stop the hub and copy the database and WAL
together. Agent histories and credentials remain in their normal home-directory
locations; backing up SQLite alone does not back them up.

The browser subscribes to `/ws` and reconnects with its last event sequence.
There is no live-activity polling. Slow connections reconnect and replay; the UI
reports replay-window gaps. Pending approvals from an earlier backend process
are marked denied on startup. A turn interrupted by restart is marked complete
with `backend_restarted`; check its remote outcome after reconnecting.

## API

| Resource | Operations |
| --- | --- |
| `/api/projects` | GET, POST `{name,path}` |
| `/api/projects/:id` | PATCH `{name,path}`, DELETE (empty projects only) |
| `/api/projects/:id/chats` | GET, POST `{agent,title}` |
| `/api/chats/:id` | GET, PATCH `{title?,archived?,permission_policy?}`, DELETE |
| `/api/chats/:id/prompt` | POST `{text}`; 202 accepted, result/error on WebSocket |
| `/api/chats/:id/resume`, `/stop`, `/cancel` | POST |
| `/api/chats/:id/permission` | POST `{id,granted}` |
| `/api/chats/:id/config` | GET, PATCH `{id,value}` |
| `/api/chats/:id/remote-sessions?cursor=…` | GET; capability-gated ACP session/list |
| `/api/agents` | GET configured names |
| `/ws` | WebSocket; send `{ "type":"subscribe", "from_seq":0 }` |

## Official Antigravity on NixOS

The accompanying nix-config recipe fetches Google's versioned archive with a
fixed SHA-256 from `dl.google.com/agy-extensions/releases/linux/`, as published
in the [ACP registry](https://github.com/agentclientprotocol/registry/blob/main/antigravity-acp/agent.json).
It installs and patches `agy_acp_server.par` and `localharness_external` together.
Linux uses the registry's `--uid=` argument. The package is marked unfree,
builds locally, and disables substitutes. Do not publish its output to a public
binary cache without redistribution rights. Authentication data stays outside
the Nix store.

## Development and checks

```sh
cargo fmt --all --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-targets
nix build .#agent-hub
```

Integration tests require `python3` for a deterministic local ACP peer;
the Nix package provides it during checks. Tests exercise subprocess transport,
independent chats, SQLite restart, resume refusal, configuration, permissions,
idle cleanup, and HTTP path/agent/origin validation. See `docs/AGENT-HUB.md` in
nix-config for Juno's state and activation gates.

Quota/cost accounting, Hermes, multi-user access, orchestration and remote ACP
hosts are outside v0.1.
