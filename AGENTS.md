# Agent Hub: Developer & AI Agent Guide

This document provides architectural context, development guidelines, and operational procedures for software engineers and AI assistants working on **Agent Hub**.

---

## 1. Project Overview

Agent Hub is a single-owner, persistent web supervisor for local ACP (Agent Client Protocol) coding agents. It provides a web interface adhering to Material 3 design and adaptive-layout conventions, managing persistent projects, chats, ACP streaming, permissions, configuration, archive/delete, and process lifecycles.

### Key Tenets
1. **Single-Service Deployment**: A single Rust binary serves the REST API, WebSocket streams, and embedded production frontend assets.
2. **Reproducible Offline Builds**: Nix flakes build both the frontend (`buildNpmPackage`) and backend (`buildRustPackage`) without network calls during build phases.
3. **Protocol Fidelity**: Subprocesses communicate strictly via standard ACP (NDJSON JSON-RPC over stdio).
4. **Lightweight Modern Web**: Componentized Lit + TypeScript frontend using `@material/web` M3 components and CSS custom properties; no heavy frameworks (no React/Next.js/Redux).

---

## 2. Agent Configuration (`agents.json`)

Agent definitions reside in a JSON configuration file specified by `--agents-file`:

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
  },
  "antigravity": {
    "command": "agy_acp_server.par",
    "args": ["--uid="]
  }
}
```

Optional fields per agent:
- `args`: Array of CLI arguments.
- `env`: Key-value object of environment variables.
- `idle_timeout`: Idle timeout in seconds before reaping the process (default: 900s).

---

## 3. Directory Structure

```
agent-hub/
├── Cargo.toml                # Rust crate configuration (agent-hub)
├── flake.nix                 # Nix flake for reproducible packaging
├── src/
│   ├── main.rs               # Binary entrypoint
│   ├── lib.rs                # Library exports
│   ├── acp/                  # ACP protocol, callbacks, process supervision
│   ├── session/              # Chat sessions, turn locks, idle reaping
│   ├── store.rs              # SQLite schema, projects, chats, activity
│   ├── events.rs             # Event log and WebSocket broadcasting
│   └── web/                  # Axum router, REST handlers, static file serving
├── static/                   # Production-hashed embedded frontend assets
│   ├── index.html            # Embedded HTML shell
│   └── assets/               # JS, CSS, and font bundles
├── frontend/                 # Frontend source code
│   ├── package.json          # Pinned frontend dependencies
│   ├── vite.config.ts        # Vite bundler config
│   ├── scripts/run-tests.mjs # esbuild test bundler and test runner
│   ├── src/
│   │   ├── main.ts           # Frontend entrypoint
│   │   ├── router.ts         # History API client-side routing
│   │   ├── api/              # Typed REST and WebSocket clients
│   │   ├── state/            # Reactive store and event reducer
│   │   ├── styles/           # Material 3 tokens and responsive layout CSS
│   │   └── components/       # Componentized Lit UI components
│   └── test/                 # Frontend state and component tests
│       └── helpers/dom.ts    # jsdom environment for the component tests
└── tests/                    # Backend integration tests
```

---

## 4. Development & Testing Workflow

### Running Backend Tests
```sh
cargo test --all-targets
```

### Running Frontend Tests & Build
```sh
cd frontend
npm test
npm run build
```

`npm test` runs `scripts/run-tests.mjs`. That script bundles each `test/*.test.ts`
file with esbuild, then runs the bundles with the test runner of Node. The bundle
step is necessary because the Lit components use decorators, which the
type-stripping mode of Node cannot run.

The test suite has two layers:

- **State tests** (`test/event-reducer.test.ts`, `test/router.test.ts`,
  `test/workflows.test.ts`) call the store and the router directly.
- **Component tests** (`test/project-dialogs.test.ts`,
  `test/chat-connection.test.ts`, `test/app-shell.test.ts`) render the real Lit
  components in jsdom, click the real buttons, and read the rendered output.

Import `test/helpers/dom.ts` first in every component test. That module starts
jsdom, copies the browser globals, adds the polyfills that `@material/web` needs
(`<dialog>`, `ElementInternals`, and `Element.animate`), and replaces `fetch` and
`WebSocket` with controllable stubs.

Write a test for a user-visible defect at the component layer. A test that only
reads and writes store fields cannot catch a broken dialog binding, a stale
component property, or a missing redraw.

### Formatting & Linting
```sh
cargo fmt --all --check
cargo clippy --all-targets --all-features -- -D warnings
```

### Nix Build
```sh
nix build .#agent-hub
```

---

## 5. Coding Constraints & Commitments

- **No Quotas / Hermes**: Do not implement quota tracking (Codex/Claude/Antigravity), cost calculation, CodexBar, or Hermes integration unless explicitly requested in subsequent milestones.
- **No Heavy Frontend Frameworks**: Keep the frontend componentized with Lit and standard DOM APIs.
- **Single-service deployment**: Production assets must be embedded into Rust via `rust-embed` and served with appropriate cache headers.
- **Security**: Server-side directory browsing and git clone endpoints must strictly validate paths against configured `--project-root` boundaries, reject symlink traversal, and reject dangerous git URL schemes. Accept only HTTPS and SSH repository URLs; reject plain `http://`. Remove the complete userinfo of every URL from a Git error before you return that error, because a token can appear as the user name alone.
