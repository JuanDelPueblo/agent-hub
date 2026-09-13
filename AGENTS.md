# Agent Hub: Developer & AI Agent Guide

This document provides architectural context, development guidelines, and operational procedures for software engineers and AI assistants working on **Agent Hub**.

---

## 1. Project Overview

Agent Hub is a single-owner, persistent web supervisor for local ACP (Agent Client Protocol) coding agents. It provides a web interface adhering to Material 3 design and adaptive-layout conventions, managing persistent projects, chats, ACP streaming, permissions, configuration, archive/delete, and process lifecycles.

### Key Tenets
1. **Single-Service Deployment**: A single Rust binary serves the REST API, WebSocket streams, and embedded production frontend assets.
2. **Reproducible Offline Builds**: Nix flakes build both the frontend (`buildNpmPackage`) and backend (`buildRustPackage`) without network calls during build phases.
3. **Protocol Fidelity**: Subprocesses communicate strictly via standard ACP (NDJSON JSON-RPC over stdio).
4. **Lightweight Modern Web**: Standalone Angular + TypeScript frontend using Angular Material/CDK primitives and signals; no additional framework or state library (no React/Next.js/Redux/NgRx).

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
│   └── media/                # JS, CSS, and font bundles
├── frontend/                 # Frontend source code
│   ├── angular.json           # Angular CLI application and test targets
│   ├── package.json          # Pinned frontend dependencies
│   ├── public/                # Static files copied into the Angular build
│   ├── src/
│   │   ├── main.ts            # Frontend entrypoint
│   │   ├── app/               # Standalone features, services, and routes
│   │   └── styles.scss        # Angular Material theme and global composition CSS
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

`npm test` runs the Angular unit-test target with Vitest. Angular compiles the
standalone components and services before Vitest executes the tests.

The test suite has two layers:

- **Transport/state tests** (`src/app/core/api/*.spec.ts`,
  `src/app/state/*.spec.ts`) exercise typed HTTP, event reduction, and signal
  store behavior.
- **Component tests** (`src/app/chats/*.spec.ts`,
  `src/app/projects/*.spec.ts`) render Agent Hub components in jsdom, interact
  with their real controls, and verify user-visible behavior.

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
- **No Heavy Frontend Frameworks**: Keep the frontend componentized with Angular standalone components and standard DOM APIs.
- **Single-service deployment**: Production assets must be embedded into Rust via `rust-embed` and served with appropriate cache headers.
- **Security**: Server-side directory browsing and git clone endpoints must strictly validate paths against configured `--project-root` boundaries, reject symlink traversal, and reject dangerous git URL schemes. Accept only HTTPS and SSH repository URLs; reject plain `http://`. Remove the complete userinfo of every URL from a Git error before you return that error, because a token can appear as the user name alone.
