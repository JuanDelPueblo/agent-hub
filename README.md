# Agent Hub v0.2

A single-owner, persistent web supervisor for local ACP coding agents (such as Codex, Claude, OpenCode, and Antigravity). GPL-3.0-only. No proprietary agent binaries are included.

## Features

- **Material 3 Adaptive UI**: Clean, modern interface built with `@material/web` components and adaptive layouts responsive to compact (<600px), medium (600–839px), and expanded (>=840px) window sizes.
- **Persistent Projects & Chats**: Multiple independent chats per project across different or identical agents. Full process lifecycle management with automatic session resumption, cancel, stop, and reconnect.
- **Server-Side Project Creation**: Create projects by browsing existing server directories with boundary enforcement or cloning remote Git repositories directly.
- **Streamlined Chat Flow**: New chat creation with simple agent selection; automatically connects ACP session and displays configuration options immediately before the first prompt.
- **Dynamic Titles**: ACP agents automatically supply chat titles after conversations start, with persistent storage and optional manual rename overrides.
- **Permission & Configuration Control**: Dynamic ACP config options (grouped selects, booleans) and strict Agent Hub permission policies (`ask`, `read-only`, `auto-approve`, `deny-all`).
- **Single-Service Architecture**: Single Rust binary embeds production-hashed frontend assets with optimized HTTP caching and WebSocket streaming.

## Run

```sh
cargo build --bin agent-hub
target/debug/agent-hub --database /path/to/state/hub.sqlite3 \
  --project-root /home/tony --agents-file agents.json \
  --public-origin https://agents.home.edyan.me --port 9123
```

The database parent directory must exist and be private. The server binds only to `127.0.0.1`. Put authenticated HTTPS in front of it before exposing it. `--public-origin` authorizes an exact browser Origin and Host.

## Projects and Chats

Create a project pointing to an existing directory under a configured project root or clone from a Git repository. Canonical paths reject missing directories and symlink escapes. Create as many chats as needed, including several using the same agent in one project. Each chat has a stable UUID, independent process, ACP session ID, turn lock, permission policy, and selected ACP configuration values.

Opening a chat automatically connects the agent process and loads ACP configuration options immediately. Sending a prompt also connects automatically if stopped. `session/load` or advertised `session/resume` restores agent-owned conversation state.

Stop process, idle reaping (900 seconds by default), and backend restart preserve the chat and ACP session ID. Cancel turn sends `session/cancel` and resolves pending browser permissions. Archive stops an idle process and keeps metadata; Restore makes the chat usable again. Delete removes local metadata/activity only, never project files or the agent's own session history.

## Configuration

Server-owned JSON definitions in `agents.json`:

```json
{
  "codex": {"command": "codex-acp"},
  "claude": {"command": "claude-agent-acp"},
  "opencode": {"command": "opencode", "args": ["acp"]},
  "antigravity": {"command": "agy_acp_server.par", "args": ["--uid="]}
}
```

Definitions accept optional `args` (array), `env` (object), and `idle_timeout` (seconds).

The UI renders ACP `configOptions` dynamically (including select optgroups and switches) and listens for `config_option_update`. Selected values are saved per chat and reapplied on reconnect.

Permission policy is separate from agent configuration. New chats default to `ask`. `read-only` allows client file reads but denies write/terminal and agent permission requests; `deny-all` denies callbacks; `auto-approve` allows them.

## API Summary

| Resource | Operations |
| --- | --- |
| `/api/filesystem/directories?path=…` | GET; server-side folder browser within roots |
| `/api/projects/clone` | POST `{url, parent_path, name?}`; Git clone into root |
| `/api/projects` | GET, POST `{name,path}` |
| `/api/projects/:id` | PATCH `{name,path}`, DELETE (empty projects only) |
| `/api/projects/:id/chats` | GET, POST `{agent, title?}` |
| `/api/chats/:id` | GET, PATCH `{title?,archived?,permission_policy?}`, DELETE |
| `/api/chats/:id/prompt` | POST `{text}`; 202 accepted, streaming events on WebSocket |
| `/api/chats/:id/resume`, `/stop`, `/cancel` | POST |
| `/api/chats/:id/permission` | POST `{id,granted}` |
| `/api/chats/:id/config` | GET, PATCH `{id,value}` |
| `/api/chats/:id/remote-sessions?cursor=…` | GET; capability-gated ACP session/list |
| `/api/agents` | GET configured names |
| `/ws` | WebSocket; send `{ "type":"subscribe", "from_seq":0 }` |

## Development and Checks

```sh
# Frontend tests and build
# `npm test` runs the state tests and the jsdom component tests.
cd frontend
npm test
npm run build
cd ..

# Rust format, lint, and tests
cargo fmt --all --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-targets

# Full reproducible Nix flake build
nix build .#agent-hub
```
