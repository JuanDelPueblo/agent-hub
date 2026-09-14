# Agent Hub v0.2

A single-owner, persistent web supervisor for local ACP coding agents (such as Codex, Claude, OpenCode, and Antigravity). GPL-3.0-only. No proprietary agent binaries are included.

## Features

- **Angular Material Adaptive UI**: A standalone Angular application using Angular Material/CDK primitives and adaptive layouts responsive to compact, medium, and expanded window sizes.
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

Prompts have no silence timeout by default, so a quiet long-running tool call is
not killed. Set `--prompt-timeout <seconds>` (or
`AGENT_HUB_PROMPT_TIMEOUT`) only when an inactivity watchdog is required.

## Development environment

The repository ships a Nix flake with a dev shell. The shell supplies Rust, Node, the linker, and the test tools at pinned versions.

With direnv:

```sh
direnv allow
```

direnv then loads the shell every time you enter the directory. Install `nix-direnv` first, because it caches the shell. On NixOS set `programs.direnv.enable = true`.

Without direnv:

```sh
nix develop
```

Put machine-specific settings in `.envrc.local`. Git ignores that file.

## Fake backend

The fake backend serves the REST and WebSocket surface of `backend/src/web/` from memory. Use it to work on the frontend without a Rust build and without an agent binary. It starts in under a second, so the edit-reload loop stays short.

Start the frontend and the fake backend together:

```sh
cd frontend
npm ci        # one time
npm run dev
```

Open `http://localhost:4200`. The Angular dev server proxies `/api` and `/ws` to the fake backend on port 8765, which is the port the real binary uses.

To run the two parts separately:

```sh
npm run fake-backend    # port 8765
npm start               # Angular dev server on port 4200
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

Opening a chat automatically connects the agent process and loads ACP configuration options immediately. Sending a prompt also connects automatically if stopped. `session/load` or advertised `session/resume` restores agent-owned conversation state.

Stop process and idle reaping preserve the chat and ACP session ID. Agent Hub
only reaps an idle process when its ACP agent advertises `session/load` or
`session/resume`; otherwise it keeps the process alive so the chat remains
usable. The default eligible idle timeout is 900 seconds. Cancel turn sends
`session/cancel` and resolves pending browser permissions. Archive stops an idle
process and keeps metadata; Restore makes the chat usable again. Delete removes
local metadata/activity only, never project files or the agent's own session
history.

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

Definitions accept optional `args` (array), `env` (object), `idle_timeout`
(seconds), `display_name` (string), `usage_provider` (string), and `metadata`
(object). Agent Hub never derives a usage provider from the agent name.

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
| `/api/chats/:id/config/:option_id` | DELETE a rejected saved value before retrying |
| `/api/chats/:id/remote-sessions?cursor=…` | GET; capability-gated ACP session/list |
| `/api/agents` | GET configured names |
| `/ws` | WebSocket; send `{ "type":"subscribe", "from_seq":0 }` |

The fake backend serves this same table, which keeps the frontend contract in one place.

## Development and Checks

```sh
# Frontend tests and build
# `npm test` runs Angular service, state, and component tests through Vitest.
cd frontend
npm test
npm run build
cd ..

# Rust format, lint, and tests
cargo fmt --all --check
cargo clippy --all-targets --all-features -- -D warnings
cargo nextest run

# Full reproducible Nix flake build
nix build .#agent-hub
```
