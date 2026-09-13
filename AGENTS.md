# Agent Hub: Developer & AI Agent Guide

This document gives architectural context, development guidelines, and operational procedures for software engineers and AI assistants who work on **Agent Hub**.

---

## 1. Project Overview

Agent Hub is a single-owner, persistent web supervisor for local ACP (Agent Client Protocol) coding agents. It provides a web interface that follows Material 3 design and adaptive-layout conventions. It manages persistent projects, chats, ACP streaming, permissions, configuration, archive/delete, and process lifecycles.

The backend is Rust with `tokio` and `axum`. The frontend is a standalone Angular application in TypeScript, with Angular Material/CDK primitives and the Angular Router. Angular produces production-hashed static assets, which `rust-embed` embeds in the Rust binary.

### Key Tenets
1. **Single-Service Deployment**: One Rust binary serves the REST API, the WebSocket stream, and the embedded frontend assets.
2. **Reproducible Offline Builds**: Nix flakes build the frontend (`buildNpmPackage`) and the backend (`buildRustPackage`) without network calls during the build phases.
3. **Protocol Fidelity**: Subprocesses communicate only through standard ACP (NDJSON JSON-RPC over stdio).
4. **Lightweight Modern Web**: Standalone Angular and TypeScript with Angular Material/CDK primitives and signals. No other framework and no state library (no React/Next.js/Redux/NgRx).

---

## 2. Development Environment

The flake owns the toolchain. Do not install Rust or Node separately.

```sh
direnv allow   # loads the dev shell on every entry into the directory
nix develop    # the same shell, without direnv
```

The shell supplies `cargo`, `rustc`, `clippy`, `rustfmt`, `rust-analyzer`, `mold`, `sccache`, `cargo-nextest`, `cargo-watch`, Node 22, Python, and SQLite. It also points Cargo at the `mold` linker for the host target.

`.envrc.local` holds machine settings and stays out of git.

---

## 3. Agent Configuration (`agents.json`)

Agent definitions live in a JSON file that `--agents-file` names:

```json
{
  "codex": { "command": "codex-acp" },
  "claude": { "command": "claude-agent-acp" },
  "opencode": { "command": "opencode", "args": ["acp"] },
  "antigravity": { "command": "agy_acp_server.par", "args": ["--uid="] }
}
```

Optional fields per agent:
- `args`: Array of CLI arguments.
- `env`: Key-value object of environment variables.
- `idle_timeout`: Idle timeout in seconds before the process is reaped (default: 900).
- `display_name`: Name for the user interface (default: the map key).
- `usage_provider`: Identifier of the provider that reports quota and account
  status. Agent Hub never infers this from the agent name, so an agent named
  `codex` gets no provider until this field names one.
- `metadata`: Free-form object. Agent Hub stores it and does not read it yet.

The file rejects an unknown field, so a typo fails at startup.

---

## 4. Directory Structure

```
agent-hub/
├── Cargo.toml                # Rust crate configuration (agent-hub)
├── flake.nix                 # Nix package outputs and the dev shell
├── .envrc                    # direnv entry point for the dev shell
├── backend/
│   ├── src/                  # The Rust backend
│   │   ├── main.rs           # Binary entrypoint
│   │   ├── lib.rs            # Library exports
│   │   ├── acp/              # ACP protocol, callbacks, process supervision
│   │   ├── agents/           # Agent definitions, launch config, agents.json
│   │   ├── session/          # Chat sessions, turn locks, idle reaping
│   │   ├── store/            # SQLite migrations, projects, chats, events
│   │   ├── events.rs         # Event log and WebSocket broadcasting
│   │   └── web/              # Axum router, REST handlers, static file serving
│   └── fake/                 # In-memory backend for frontend development
│       ├── server.mjs        # REST and WebSocket routes
│       ├── state.mjs         # Seed data and the event log
│       ├── turns.mjs         # Scripted agent turns
│       ├── websocket.mjs     # Minimal RFC 6455 server
│       └── dev.mjs           # Starts the fake backend and `ng serve`
├── static/                   # Production-hashed embedded frontend assets
├── frontend/                 # Frontend source code
│   ├── angular.json          # Angular CLI build, serve, and test targets
│   ├── proxy.conf.json       # Dev-server proxy to the fake backend
│   ├── package.json          # Pinned frontend dependencies
│   ├── public/               # Static files copied into the Angular build
│   └── src/
│       ├── main.ts           # Frontend entrypoint
│       ├── app/              # Standalone features, services, and routes
│       └── styles.scss       # Material theme and global composition CSS
└── tests/                    # Backend integration tests
```

---

## 5. Architecture

### 5.1. Subprocess ACP Layer (`backend/src/acp/`)
- **Transport**: NDJSON JSON-RPC over standard I/O with local ACP agents.
- **Client Protocol**: Handles the ACP handshake, session initialization (`session/new`, `session/load`, `session/resume`), tool execution, plan updates, and terminal and filesystem callbacks.
- **Title Synchronization**: Watches `session_info_update` and saves the agent-generated chat title to SQLite, unless the user overrode the title.
- **Permission Callbacks**: Applies the permission policy (`ask`, `read-only`, `auto-approve`, `deny-all`) to file edits and terminal commands that the agent requests.

### 5.2. Session Lifecycle (`backend/src/session/`)
- **Process Supervision**: Spawns and supervises the ACP subprocesses on demand.
- **Turn Locking**: Allows one turn at a time per chat.
- **Process Management**: Reaps idle processes (900 seconds by default), stops them through `session/close`, and terminates the process tree when necessary.

### 5.3. Persistence (`backend/src/store/`)
- **Engine**: SQLite in WAL mode, with foreign keys and a busy timeout.
- **Migrations (`store/migrations.rs`)**: An ordered table of versioned
  migrations. Each one runs in its own transaction and advances
  `PRAGMA user_version` inside that transaction, so the version advances only
  after the migration succeeds. A database from a newer build is reported, never
  reset. Add a migration to the end of the table; never edit one that shipped.
- **Modules**: `Store` owns the connection. `projects.rs`, `chats.rs`, and
  `events.rs` hold the SQL for one entity each and take a `&Connection`, so the
  facade controls the lock and any shared transaction.
- **Tables**:
  - `projects`: Managed repositories, with a name and a canonical path.
  - `chats`: Chats bound to a project, an agent, a title, an ACP session ID, a permission policy, and configuration values.
  - `events`: Session events in strict sequence order, with an indexed
    `session_id` column so chat deletion does not scan the table.

### 5.4. Event Dispatch and WebSockets (`backend/src/events.rs`)
- **Event Log**: A thread-safe in-memory ring buffer that holds the latest 10,000 events for reconnect and replay.
- **WebSocket Streaming**: A client subscribes with `from_seq` and resumes the stream without a gap.

### 5.5. Web API and Static Serving (`backend/src/web/`)
- **REST Endpoints**: Projects, directory browsing, git clone, chats, ACP prompts, configuration, and permissions.
- **Static Assets (`backend/src/web/static_files.rs`)**: Serves the embedded Angular assets. Hashed assets get `Cache-Control: public, max-age=31536000, immutable`. `index.html` gets revalidation headers and the History API fallback.

### 5.6. Frontend (`frontend/`)
- **Framework**: Angular standalone components with signals, `HttpClient`, the Angular Router, and RxJS for the WebSocket stream.
- **UI System**: Angular Material and CDK components, one Material 3 theme in `src/styles.scss`, and a small set of Agent Hub status tokens.
- **Window Classes**: Compact (<600px) uses a modal drawer, full-width inputs, touch targets of 48px or more, and `env(safe-area-inset-bottom)`. Medium (600–839px) uses a modal drawer and flexible margins. Expanded (>=840px) uses a permanent drawer, a dual-pane layout, and a side sheet for configuration.
- **Routing**: `/`, `/projects/:projectId`, and `/projects/:projectId/chats/:chatId`, with the Rust SPA fallback for deep links.
- **State**: A signal store (`src/app/state/app-state.service.ts`) and a pure event reducer (`src/app/state/event-reducer.ts`) that aggregates turns, thoughts, tools, plans, and permissions.

---

## 6. Frontend Development Against the Fake Backend

`backend/fake/` serves the REST and WebSocket surface of `backend/src/web/` from memory. Use it for frontend work. It needs no Rust build, no agent binary, and no npm dependency.

```sh
cd frontend
npm run dev      # fake backend on 8765, Angular dev server on 4200
```

A keyword in the prompt selects the turn that the fake agent streams: `plan`, `tool`, `permission`, `error`, `long`, or `quiet`. Any other prompt streams a full turn. The README holds the complete table.

**Keep the fake backend faithful.** When you change a route, a payload, or an event in `backend/src/web/` or `backend/src/events.rs`, change `backend/fake/` in the same commit. A fake backend that drifts from the Rust backend is worse than none, because it hides a broken contract.

The fake backend proves nothing about the Rust backend. Test protocol behavior with the integration tests in `tests/`.

---

## 7. Testing

### Backend
```sh
cargo nextest run          # fast parallel runner from the dev shell
cargo test --all-targets   # the same tests through cargo
```

Unit tests live in `backend/src/` next to the code they cover. Integration tests live in `tests/` and drive the axum router through `tower`'s `oneshot`, so they need no running server. `tests/fake_acp.py` stands in for an agent process.

### Frontend
```sh
cd frontend
npm test
```

`npm test` runs the Angular unit-test target through Vitest. The suite has two layers:

- **Transport and state tests** (`src/app/core/api/*.spec.ts`, `src/app/state/*.spec.ts`) cover typed HTTP, event reduction, and signal store behavior.
- **Component tests** (`src/app/chats/*.spec.ts`, `src/app/projects/*.spec.ts`) render components in jsdom, operate their real controls, and check user-visible behavior.

Write the test for a user-visible defect at the component layer. A test that only reads and writes store fields cannot catch a broken dialog binding, a stale component property, or a missing redraw.

### Formatting and Linting
```sh
cargo fmt --all --check
cargo clippy --all-targets --all-features -- -D warnings
```

### Nix Build
```sh
nix build .#agent-hub
```

---

## 8. Build Speed

The dev shell and `Cargo.toml` already apply these measures:

1. **mold linker**: The shell sets a target-scoped rustflags variable, so the setting never reaches `nix build` and never overrides the flags of `Cargo.toml`.
2. **Narrow feature sets**: `tokio` lists the drivers the crate uses, instead of `full`.
3. **No unused dependencies**: A crate that no source file imports must not appear in `Cargo.toml`.
4. **Line tables instead of full debug info**: `[profile.dev]` uses `debug = "line-tables-only"` and `split-debuginfo = "unpacked"`. Dependency code gets no debug info at all. Backtraces and panic locations stay exact.

More measures when you need them:

- `cargo check` and `cargo clippy` type-check without code generation. Use them in the edit loop and keep `cargo build` for the moment you run the binary.
- `cargo watch -x check` reruns the check on every save.
- `cargo nextest run` starts tests in parallel processes and reports the slow ones.
- `export RUSTC_WRAPPER=sccache` caches the compilation of dependencies between checkouts and branches. It turns off incremental compilation, so it helps a clean build and hurts a small edit. Leave it off for daily work.

Before you add a dependency, check the cost. `cargo tree --duplicates` finds a crate that the graph holds at two versions.

---

## 9. Angular Frontend Standards

- Keep TypeScript and template checking strict and preserve zoneless compatibility.
- Use signals for local/reactive state, `computed()` for derived state, and pure predictable transformations.
- Declare component APIs with `input()` / `input.required()`, `output()`, and `model()` for true two-way APIs.
- Use `inject()` for dependency injection. Constructors should contain initialization logic, not dependency parameters.
- Use native `@if`, `@for`, and `@switch`; do not add legacy structural directives.
- Components are standalone by default: do not set `standalone: true` or introduce NgModules.
- Do not import `CommonModule`; import only a specific standalone pipe or directive when needed.
- Lazy-load page and feature routes with `loadComponent` or `loadChildren`.
- Prefer Signal Forms for new signal-based forms and Reactive Forms when integration or test reliability is clearer; do not add template-driven forms.
- Avoid `::ng-deep` and Angular Material implementation selectors. Style owned wrappers or use supported tokens and APIs.
- Keep templates simple, use focused components, and preserve stable `track` expressions for streamed collections.
- Use Angular Material/CDK primitives instead of recreating existing controls.
- Maintain WCAG AA behavior, including keyboard access, focus, contrast, accessible names, and non-color status cues.

---

## 10. Coding Constraints & Commitments

- **No Quotas / Hermes**: Do not implement quota tracking (Codex/Claude/Antigravity), cost calculation, CodexBar, or Hermes integration unless a later milestone asks for it.
- **No Heavy Frontend Frameworks**: Keep the frontend on Angular standalone components and standard DOM APIs.
- **Single-service deployment**: `rust-embed` must embed the production assets, and the server must send the correct cache headers.
- **Security**: The directory browser and the git clone endpoint must validate every path against the configured `--project-root` boundaries, reject symlink traversal, and reject dangerous git URL schemes. Accept only HTTPS and SSH repository URLs. Reject plain `http://`. Remove the complete userinfo of every URL from a Git error before you return that error, because a token can appear as the user name alone.
