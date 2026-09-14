# Agent Hub Agent Guide

This file contains implementation rules for coding agents. It is intentionally compact: product scope belongs in GitHub Issues and release grouping in milestones.

## Start here

For each task:

1. Read the assigned issue/task first.
2. Inspect only the relevant source and tests; follow imports/callers outward as needed.
3. Search for existing patterns before introducing new abstractions.
4. Read `README.md` or other docs only when the task needs that context.
5. Make the smallest correct change. Avoid unrelated refactors, dependency upgrades, cleanup, or future work.

Do not inventory the whole repository by default. Source and tests are the authority for current implementation details.

`docs/STYLE_GUIDE.md` is normative for documentation changes.

## Stack and map

Agent Hub is a single-owner persistent supervisor for local ACP coding agents.

- Backend: Rust, `tokio`, `axum`, SQLite.
- Agent protocol: ACP over NDJSON JSON-RPC on stdio.
- Frontend: standalone Angular, TypeScript, signals, Angular Material/CDK.
- Packaging: one Rust binary embeds the production frontend with `rust-embed`.
- Builds/toolchain: Nix owns the reproducible development and release environment.

Important paths:

- `backend/src/acp/` — ACP transport, callbacks, process protocol.
- `backend/src/session/` — process/session lifecycle and turn coordination.
- `backend/src/store/` — SQLite migrations and persistence domains.
- `backend/src/service/` — `HubService`, the shared user-visible application operations.
- `backend/src/web/` — HTTP/WebSocket adapters and static serving.
- `backend/src/events.rs` — event log and live/replay stream.
- `backend/fake/` — in-memory backend for frontend development.
- `frontend/src/app/` — Angular features, API clients, state, routes, components.
- `tests/` — backend integration tests; `tests/fake_acp.py` provides a fake ACP process.

## Architecture invariants

### Application boundaries

- Put user-visible Hub behavior in `HubService`, not transport handlers.
- HTTP, future MCP, federation, and other surfaces should adapt the same service operations rather than duplicate business rules.
- Keep ACP protocol/process concerns inside the ACP/session layers. `HubService` does not speak ACP directly.
- Keep provider/capability behavior explicit in agent metadata. Do not infer behavior from names such as `codex` or `claude`.

### Persistence

- `Store` owns the SQLite connection/lock; domain persistence modules operate through the established store pattern.
- Add migrations to the end of the ordered migration table. Never edit a migration that may have shipped.
- Migrations must be atomic, advance `PRAGMA user_version` only on success, and be safe when schema state is already partially/newly present.
- Never solve migration uncertainty by resetting user data.

### Events and recovery

- Preserve ordered event replay and reconnect semantics when changing event persistence or WebSocket behavior.
- Durable user work must survive process restart/reconnect unless the feature explicitly defines otherwise.

### Git workspaces

- Agent Hub owns managed worktree creation, validation, recovery, and cleanup; ACP agents should only receive the resulting working directory.
- Never silently discard Git work. Do not implicitly reset, clean, stash, rebase, merge, fast-forward, cherry-pick, switch branches, or delete branches/worktrees containing user changes.
- Direct/project-checkout chats share the real checkout and must preserve its external state.

### Web/security

- Validate filesystem operations against configured project-root boundaries and reject symlink/path traversal.
- Git clone inputs accept only supported secure URL forms; do not introduce plain HTTP cloning.
- Redact complete URL userinfo from Git errors before returning them.
- Treat authentication, secrets, uploaded files, process execution, and remote-control surfaces as security-sensitive boundaries.

### Fake backend fidelity

When a Rust route, payload, or event contract used by the frontend changes, update `backend/fake/` in the same change. The fake backend is a frontend development surface, not proof that Rust behavior works.

## Frontend rules

- Keep strict TypeScript/template checking and zoneless compatibility.
- Use signals for reactive state and `computed()` for derived state.
- Use `inject()`, `input()`/`input.required()`, `output()`, and `model()` where appropriate.
- Use native `@if`, `@for`, and `@switch`.
- Components are standalone. Do not add NgModules or import `CommonModule` wholesale.
- Prefer focused components and stable `track` expressions for streamed collections.
- Use Angular Material/CDK instead of recreating controls.
- Avoid `::ng-deep` and Angular Material implementation selectors; use supported APIs/tokens and owned wrappers.
- Preserve compact/medium/expanded adaptive behavior and mobile-safe interaction.
- Maintain WCAG AA behavior: keyboard access, focus, contrast, accessible names, reduced-motion compatibility, and non-color status cues.
- For user-visible defects, prefer a component-level regression test that exercises the real UI behavior.

Do not introduce another frontend framework or state-management library unless an explicit tracked decision changes the architecture.

## Development and verification

Use the Nix environment rather than installing project toolchains manually:

```sh
direnv allow
# or
nix develop
```

Frontend development with the fake backend:

```sh
cd frontend
npm run dev
```

Run the narrowest relevant checks while iterating, then the appropriate full checks before committing.

Backend:

```sh
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo nextest run
```

Targeted `cargo test ...` is fine during iteration. Use broader backend/integration coverage for cross-cutting persistence, session, ACP, or web changes.

Frontend:

```sh
cd frontend
npm test
npm run build
```

Packaging/release/deployment changes:

```sh
nix build .#agent-hub
```

Do not run expensive unrelated verification solely for a docs-only or narrowly isolated change.

## Change discipline

- Add dependencies only when the task genuinely needs them; prefer existing dependencies and platform facilities.
- Preserve public/API compatibility unless the issue explicitly changes it.
- Update tests with behavior changes; do not weaken tests to make an implementation pass.
- Put implementation requirements in Issues rather than duplicating them in repository prose.
- Unless the task is explicitly an integration task on `master`, work only on the current task branch/workspace; do not switch branches, merge/rebase `master`, or push directly to `master`.
- Commit and push the current task branch after verification passes.
