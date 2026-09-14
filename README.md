# Pueblo Hub v0.2

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

Build the server:

```sh
cargo build --bin pueblo-hub
```

Then run it with a database, project directory, and agent configuration:

```sh
target/debug/pueblo-hub \
  --database /path/to/state/hub.sqlite3 \
  --project-root /path/to/projects \
  --agents-file agents.json \
  --public-origin https://example.com \
  --port 9123
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

The complete Nix package can be checked with:

```sh
nix build .#pueblo-hub
```

## License

GPL-3.0-only.

Backend forked from github.com/missdeer/ccgonext.

Pueblo Hub does not include proprietary agent binaries.
