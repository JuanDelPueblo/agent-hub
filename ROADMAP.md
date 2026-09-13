# Agent Hub Roadmap

This roadmap follows the current v0.2 frontend overhaul. Each phase should be implemented by a separate agent against the completed previous phase. Avoid parallel agents modifying the same branch.

## Phase order

| Phase | Priority | Feature | Depends on |
| --- | --- | --- | --- |
| 0 | P0 | Backend architectural foundations | Current v0.2 |
| 1 | P1 | Usage quotas/status | Phase 0 |
| 2 | P1 | Hub-managed per-chat Git worktrees | Phase 0 |
| 3 | P1 | Per-turn git/file diffs | Phase 2 |
| 4 | P2 | Native authentication | Phase 0 |
| 5 | P2 | Browser/Web Push notifications | Phase 4 |
| 6 | P2 | MCP control plane | Phase 4 |
| 7 | P2 | File/inline review comments | Phase 3 |
| 8 | P3 | Remote Agent Hub federation | Phases 4–6 |
| 9 | P4 | Generalized ACP + official ACP Registry | All previous |

## Phase 0 — Backend architectural foundations

Do a small backend-only refactor before adding roadmap features. The goal is to establish stable extension points for persistence, agents, and control surfaces without rewriting the existing ACP/process layer.

Do **not** include frontend restructuring in this phase. The frontend is being evolved separately; preserve the current HTTP/WebSocket contracts where practical and keep Phase 0 focused on backend internals.

### Database migrations and persistence structure

Replace one-shot schema initialization with an explicit SQLite migration mechanism.

Requirements:

- ordered, versioned migrations;
- migrations applied atomically;
- schema version advanced only after a successful migration;
- existing v0.2 databases upgraded in place;
- migration tests starting from older schema versions;
- no destructive reset as the normal upgrade path.

Split persistence responsibilities into domain-oriented modules/repositories rather than allowing `store.rs` to grow indefinitely. A `Store`/database facade can remain, but projects, chats, events, and future entities should have clear persistence boundaries.

Do not normalize fields merely for stylistic reasons. Data that needs independent querying, indexing, expiration, relationships, or lifecycle management should use first-class tables; document-like configuration can remain JSON where appropriate.

### Agent definition model

Separate ACP process-launch configuration from broader agent metadata so later subsystems do not accumulate unrelated fields on the process supervisor.

Use a model along the lines of:

```text
AgentDefinition
  id
  display_name
  launch
    command
    args
    env
    idle_timeout
  usage_provider
  source
  metadata
```

`SessionManager` and the ACP layer should only depend on the launch/runtime information they need.

Do not infer provider behavior from names such as `codex`, `claude`, or `opencode`. Phase 1 usage support and the later registry phase should attach capabilities explicitly through the agent definition.

### Shared application service layer

Introduce a thin backend application/service layer that owns user-visible Agent Hub operations instead of placing business rules directly in HTTP handlers.

For example:

```text
HubService
  list_projects
  create_project
  edit_project

  list_chats
  create_chat
  prompt_chat
  cancel_chat
  stop_chat
  set_chat_config
```

The exact API can evolve, but HTTP handlers should become adapters around shared operations. Later MCP and federation code must be able to invoke the same operations instead of implementing parallel versions of chat/session behavior.

The service layer should coordinate the existing:

```text
SQLite store
SessionManager
EventLog
Agent definitions
```

without duplicating ACP protocol logic.

### Completion

The backend has tested schema migrations, persistence is organized for additional durable entities, agent launch configuration is separated from extensible agent metadata, and the HTTP layer delegates core Hub operations through reusable backend services. Existing ACP/session behavior remains intact and no frontend architecture rewrite is included.

---

## Phase 1 — ACP usage quotas and status

Add a generic usage/status subsystem without baking Codex/Claude/etc. assumptions into the rest of Agent Hub.

The UI should show useful status beside each configured ACP:

- quota remaining;
- reset time;
- account/login state when available;
- provider errors;
- optionally recent usage/cost when supported.

Implement a provider abstraction such as:

```text
UsageProvider
  ├── codex
  ├── claude
  ├── antigravity
  ├── API-cost provider
  └── unsupported
```

An agent definition should optionally reference a usage provider rather than Agent Hub determining behavior from agent-name strings.

Keep quota collection outside the ACP protocol layer. ACP sessions must continue functioning if usage/status collection fails.

Cache results and refresh them independently of chat sessions.

For the initial known agents, reuse existing external tooling where practical rather than reimplementing private provider APIs.

OpenCode/API-based agents should be allowed to expose cost/account information instead of pretending they have a subscription quota.

### Completion

The project/chat UI can display agent availability and quota/reset information, with failures isolated from normal ACP operation.

---

## Phase 2 — Hub-managed per-chat Git worktrees

Give every chat in a Git-backed project its own isolated Git worktree managed by Agent Hub.

The Hub, not the ACP agent, owns worktree creation, validation, reuse, and cleanup. Agents should simply be launched with the chat worktree as their working directory and should not need to know how Agent Hub created it.

A useful model is:

```text
ChatWorkspace
  chat_id
  project_id
  repository_root
  worktree_path
  branch
  base_ref
  created_at
```

For a Git project, creating a chat should create or attach a dedicated branch/worktree before the ACP process starts. Use deterministic Hub-owned naming, for example a branch namespace such as:

```text
agent-hub/chat/<chat-id>
```

The exact naming scheme may differ, but it must avoid collisions and remain recoverable after a daemon restart.

Store managed worktrees beneath Agent Hub state or another explicitly configured workspace root, not inside the user's repository checkout and never in the Nix store.

### Workspace semantics

A chat's ACP process must always use its managed worktree path as `cwd`. All file callbacks, terminal commands, turn snapshots, and later review operations therefore naturally operate on that chat's isolated working tree.

A newly created chat should start from a well-defined Git revision, normally the selected/current project base ref at chat creation time. Persist that base so restart behavior is deterministic.

Do not silently copy uncommitted changes from the project's primary checkout into a new worktree. If the primary checkout is dirty and that matters to chat creation, report it clearly or require an explicit supported workflow rather than producing an ambiguous starting state.

Existing chats keep their own branch/worktree as the project advances. Do not automatically rebase, merge, reset, or fast-forward a chat branch behind the user's back.

Multiple chats for the same project must be able to run concurrently without writing into one another's files.

### Lifecycle and recovery

On daemon restart, validate persisted worktree metadata against Git before starting the ACP process.

Handle at least:

- a valid existing managed worktree;
- a worktree directory removed manually;
- a branch removed or changed externally;
- stale Git worktree metadata;
- a repository moved or no longer available;
- a worktree containing uncommitted changes.

Do not silently discard work when recovering from an inconsistent state.

Archiving/stopping a chat must not destroy its worktree. Chat deletion may offer cleanup, but uncommitted changes and commits that are not safely reachable elsewhere must not be deleted implicitly. Worktree removal and branch deletion should be separate, deliberate lifecycle operations where data loss is possible.

Project deletion/path changes should account for managed chat worktrees and refuse unsafe operations.

Use ordinary Git plumbing/commands from the Hub backend. The ACP protocol layer should remain unaware of worktree management.

Non-Git projects should continue to function without worktree isolation, using the existing project-directory behavior unless a later workspace abstraction provides a better fallback.

### Scope

This phase is workspace isolation, not branch integration automation. Do not add automatic merging, rebasing, cherry-picking, or conflict resolution into the project base branch yet.

The resulting branch is a normal Git branch, so commits created by the agent remain inspectable and can be integrated through normal Git workflows.

### Completion

Two chats can operate concurrently on the same Git repository while each agent sees a separate working tree and branch. Agent Hub creates, persists, validates, and safely manages those worktrees without requiring the agents themselves to invoke `git worktree`.

---

## Phase 3 — Turn-scoped git/file diffs and commit tracking

Add source-control awareness to each chat turn. This becomes the foundation for the later review/comment system and operates against the chat workspace introduced in Phase 2.

First make a turn a durable server-side entity with a stable ID rather than relying only on frontend reconstruction from event ordering.

Persist something similar to:

```text
Turn
  id
  chat_id
  started_at
  completed_at
  status
  stop_reason
  before_head
  after_head

  changed_files[]
    path
    status
    additions
    deletions
    diff

  commits[]
    sha
    subject
```

Turn-scoped events should carry the durable turn ID where applicable so WebSocket consumers, notifications, MCP, and later review comments can refer to the same logical operation.

Before each prompt, record enough repository/workspace state to establish a baseline. After the turn finishes, determine what changed.

Do not treat commits as the sole source of truth. Agents frequently modify files without committing.

Capture:

- working-tree changes introduced during the turn;
- staged changes;
- commits created during the turn;
- renamed/deleted/new files.

A chat worktree can already be dirty from an earlier turn. A turn should show what that turn changed, not blindly show the entire current `git diff`.

Establish a before/after snapshot or blob/hash model so an already-modified file can still be attributed correctly.

The UI should expose a `Changes` section on each completed turn with a familiar diff viewer.

Support non-Git projects gracefully, at minimum with changed-file detection where feasible.

### Completion

For any completed coding turn, the exact files changed and commits created by that turn can be inspected, and those changes have a durable turn identity usable by later subsystems.

---

## Phase 4 — Native authentication

Replace reliance on reverse-proxy Basic Auth with first-class Agent Hub authentication.

Keep it appropriate for the current single-owner design rather than building a full account-management system.

Support:

- login page;
- secure password hashing;
- session cookies;
- logout;
- configurable session lifetime;
- `Remember me`;
- CSRF protection for cookie-authenticated mutations;
- secure/HTTP-only/SameSite cookies;
- rate limiting or backoff for repeated login failures.

Credentials must not be stored in the Nix store.

Allow the administrator to supply the initial credential/password hash through a runtime secret or state initialization mechanism.

Also introduce API/service tokens here. Browser sessions and machine clients should not share the same authentication mechanism.

Possible scopes:

```text
browser session
service:read
service:control
hub:federation
```

Do not build multi-user permissions yet.

### Completion

Agent Hub can safely run behind ordinary HTTPS without depending on Traefik Basic Auth, and machine-to-machine clients have a clean token mechanism.

---

## Phase 5 — Browser and Web Push notifications

Add first-class browser notifications for long-running agent work and events that need attention.

This phase must explicitly support **Firefox for Android**, not only desktop Chromium browsers.

Use standards-based Web Push:

```text
Agent Hub server
  ↓ Web Push
browser push service
  ↓
Service Worker
  ↓
OS notification
```

Do not rely on `new Notification()` as the primary implementation. Mobile browsers should receive persistent notifications through a registered Service Worker and `ServiceWorkerRegistration.showNotification()`.

Requirements:

- HTTPS/secure-context operation;
- Service Worker registration;
- Push API subscription created only from an explicit user action;
- server-side storage of PushSubscription endpoint/key material;
- standards-based encrypted Web Push delivery using application-server/VAPID keys;
- notification click handling that opens/focuses the relevant project/chat;
- unsubscribe and re-subscribe support;
- expired/invalid subscriptions cleaned up automatically;
- multiple subscribed browsers/devices for the same owner;
- never put secrets, full prompts, or sensitive tool output in push payloads by default.

Support Firefox for Android as a required test target. Avoid assumptions about a specific browser vendor's push endpoint: persist and send to the endpoint supplied by each browser subscription.

Initial notification events should be configurable and include:

```text
turn completed
permission requested
agent failed / disconnected
long-running task failed
```

Consider optional notifications later for:

```text
quota nearly exhausted
quota reset
review requested
remote Hub unavailable
```

Add per-device and global notification preferences. At minimum allow users to independently enable/disable completion, permission, and error notifications.

Avoid noisy behavior:

- do not notify for every streamed message/tool call;
- avoid duplicate notifications when several backend events represent the same logical condition;
- use durable turn IDs to deduplicate completion notifications;
- where practical, suppress or de-emphasize completion notifications while that exact chat is actively visible;
- use stable notification tags so repeated state changes can replace an existing notification instead of spamming the notification tray.

The subscription should be associated with the authenticated browser session/device introduced in Phase 4, but should survive normal page closes and browser restarts according to browser behavior.

### Completion

A turn can run while the Agent Hub page is in the background or closed, and Firefox for Android plus supported desktop browsers receive an OS-level notification when the turn completes, fails, or needs permission. Tapping the notification opens the relevant Agent Hub chat.

---

## Phase 6 — MCP control plane

Restore MCP, but attach it to the persistent Agent Hub daemon rather than resurrecting the old ephemeral MCP architecture.

Implement Streamable HTTP MCP, for example:

```text
/mcp
```

It must use the same backend application services and the same:

- SQLite store;
- SessionManager;
- projects;
- chats;
- chat worktrees;
- ACP processes;
- event history

as the browser UI.

That ensures a chat created by Hermes appears immediately in the web interface and can be supervised there.

Initial tools should stay deliberately small:

```text
list_projects
list_agents
list_chats

create_chat
prompt_chat
get_chat

stop_chat
cancel_chat

get_usage
```

Consider exposing turn diffs from Phase 3 as read-only MCP data.

Do not let MCP create an independent process/session/worktree universe. MCP endpoints should be adapters over the shared Hub service layer introduced in Phase 0.

Authentication should use Phase 4 service tokens.

Hermes can then be configured to use Agent Hub as its preferred coding-agent control surface rather than launching CLI agents independently.

### Completion

Hermes or another MCP client can start and continue an Agent Hub chat while the exact same chat, ACP process, and Hub-managed workspace remain visible and manageable in the browser.

---

## Phase 7 — Review comments and feedback

Build this directly on the Phase 3 diff viewer.

Allow comments at two levels:

```text
file comment
inline/range comment
```

Persist each comment with enough context to survive subsequent edits:

```text
project
chat
turn
path
base blob / revision
line or range
diff side
comment
status
```

Comments should be visibly marked outdated if later modifications invalidate their original line anchor.

Support selecting several comments and sending them to the agent as one review turn.

Generated agent context should clearly identify each item, for example:

```text
src/foo.rs:42-48
<comment>

src/bar.ts
<file-level comment>
```

Do not directly mutate the user's normal prompt text invisibly. Review feedback should be an explicit action such as `Send 4 review comments`.

After the agent responds and changes files, preserve the original comments/history so earlier reviews remain inspectable.

Later this model can support automated reviewer agents.

### Completion

A turn's diff can be reviewed on phone or desktop, GitHub-style line/file comments can be added, and that feedback can be sent back into the same ACP chat.

---

## Phase 8 — Remote Agent Hub federation

Allow one Agent Hub UI to manage other Agent Hub servers.

Do not synchronize their databases or worktrees.

Each remote Hub remains authoritative for:

- its projects;
- chats;
- chat worktrees;
- ACP processes;
- events;
- usage data.

The local Hub should store connection metadata:

```text
name
base_url
service credential
last_seen
version
capabilities
```

Prefer server-to-server federation:

```text
Browser
   ↓
Primary Agent Hub
   ↓
Remote Agent Hub
```

rather than making the browser connect directly to every remote server.

Benefits include:

- no cross-origin complexity;
- remote tokens never enter browser storage;
- one authentication/session;
- centralized connection/error handling.

Add a small version/capability handshake before relying on remote features.

The UI should gain a hub selector:

```text
Juno
Ed-PC
Ed-PCL
...
```

Projects and chats should otherwise use the same components.

WebSocket/event streaming needs hub identity included in frontend state so identical UUIDs on different servers cannot collide.

Notification events from remote Hubs should be forwarded through the primary Hub's Phase 5 notification subsystem rather than requiring a separate browser push subscription to every remote Hub.

Do not add distributed orchestration, cross-Hub worktrees, or workload migration yet.

### Completion

From one Agent Hub page, remote Agent Hub instances can be connected and their projects/chats managed almost exactly like local ones while each Hub remains authoritative for its own workspace and runtime state.

---

## Phase 9 — Generalized ACP support + official ACP Registry

Replace the current mostly hand-authored `agents.json` model with a first-class installed-agent abstraction building on the agent definition boundary from Phase 0.

Do not create a proprietary Agent Hub marketplace. Use the official ACP Registry as the discovery source.

The UI can expose:

```text
Agents
  Installed
  Registry
```

Registry entries should show:

- name/icon/description;
- documentation;
- source repository;
- available version;
- distribution mechanism;
- supported platforms;
- authentication requirements;
- installed/update status.

Internally distinguish:

```text
InstalledAgent
  id
  source
    declarative
    registry
    custom
  command
  args
  env
  version
  registry_metadata
  usage_provider
```

Keep support for declaratively configured Nix agents. Registry support should add to, not replace, the current Nix-managed configuration.

Because Agent Hub runs on NixOS, do not assume every upstream binary or npm/Python package will execute correctly merely because the registry lists it.

Treat installation as its own backend abstraction supporting registry distribution types individually.

A sensible progression within this phase is:

```text
1. Registry browsing
2. Detect already-installed agents
3. One-click activation for compatible distributions
4. Managed installation/update
5. Remove/update managed agents
```

Managed registry agents should live under Agent Hub state, never `/nix/store`.

Keep proprietary binaries and licensing restrictions respected.

The official ACP Registry should remain the source of truth rather than copying its catalog into the repository.

### Completion

A new ACP-compatible agent normally requires no Agent Hub source-code changes: it can be discovered through the ACP Registry or added as a custom command and then behaves like every other agent.

---

## Target architecture

At the end of these phases, Agent Hub should function as a general ACP operations interface rather than a web wrapper around a fixed set of agents:

```text
              ┌───────────────┐
              │   Web / PWA   │
              │  + Web Push   │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
Hermes/MCP ──►│   Agent Hub   │◄── Remote Agent Hubs
              └───────┬───────┘
                      │ ACP
          ┌───────────┼─────────────┐
          ▼           ▼             ▼
        Codex       Claude       Any ACP
          │           │             │
          └───────────┼─────────────┘
                      │
              projects / git
              per-chat worktrees
              turns / diffs
              review comments
              usage / quotas
              notifications
```

Phase 9 should be treated as the last major pre-1.0 architectural feature. Once arbitrary registry agents and remote Hubs work without agent-specific UI/backend logic, further features should mostly be additive.
