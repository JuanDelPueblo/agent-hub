# Pueblo Hub

An uncomplicated hub to connect and manage all your ACP agents together.

No more shuffling around various tmux sessions or relying on each agent's proprietary remote control interface. Pueblo Hub allows you to drive agents such as Codex, Claude Code, and OpenCode across multiple projects at the same time through a beautiful Material 3 web page that you self-host. Agents can run in parallel using separate worktrees to prevent conflicts and maximize your usage quota across each LLM provider.

## Features

- **One interface for your agents** - Connect ACP-compatible agents and manage them from the same place instead of jumping between terminals and separate remote interfaces. Pueblo Hub currently works with agents such as Codex, Claude Code, and OpenCode.

- **Persistent projects and chats** - Organize chats under projects and come back to them later without having to recreate your setup. Pueblo Hub keeps the agent process and session management behind the scenes so you can focus on the conversation.

- **Parallel worktrees** - Run multiple agents against the same Git project without making them fight over a working directory. Isolated chats get their own worktree and branch by default, allowing agents to work independently while keeping your main checkout alone.

- **Project checkout mode** - Not everything needs a worktree. Chats can work directly inside the project's existing checkout when you want an agent operating on the branch and files already there.

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
cargo build --bin agent-hub
```

Then run it with a database, project directory, and agent configuration:

```sh
target/debug/agent-hub \
  --database /path/to/state/hub.sqlite3 \
  --project-root /path/to/projects \
  --agents-file agents.json \
  --public-origin https://example.com \
  --port 9123
```

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

The server binds to `127.0.0.1`. Put authenticated HTTPS in front of it before exposing Pueblo Hub remotely.

### Developing Pueblo Hub

Clone the repository and enter its Nix environment:

```sh
git clone https://github.com/JuanDelPueblo/agent-hub.git
cd agent-hub
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
nix build .#agent-hub
```

## License

GPL-3.0-only.

Pueblo Hub does not include proprietary agent binaries.
