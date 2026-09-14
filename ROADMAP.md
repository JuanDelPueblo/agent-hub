# Pueblo Hub Roadmap

This roadmap follows the current v0.2 frontend overhaul. Each phase should be implemented by a separate agent against the completed previous phase. Avoid parallel agents modifying the same branch.

## Phase order

| Phase | Priority | Feature | Depends on | Completed |
| --- | --- | --- | --- | --- |
| 0 | P0 | Backend architectural foundations | Current v0.2 | ✅ |
| 1 | P1 | Usage quotas/status | Phase 0 | ❌ |
| 2 | P1 | Hub-managed per-chat Git workspaces | Phase 0 | ✅ |
| 3 | P1 | Per-turn git/file diffs | Phase 2 | ❌ |
| 4 | P2 | Native authentication | Phase 0 | ❌ |
| 5 | P2 | Browser/Web Push notifications | Phase 4 | ❌ |
| 6 | P2 | File/image uploads and prompt attachments | Phases 3–4 | ❌ |
| 7 | P2 | MCP control plane | Phase 4 | ❌ |
| 8 | P2 | File/inline review comments | Phase 3 | ❌ |
| 9 | P3 | Remote Pueblo Hub federation | Phases 4–7 | ❌ |
| 10 | P4 | Generalized ACP + official ACP Registry | All previous | ❌ |

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

Introduce a thin backend application/service layer that owns user-visible Pueblo Hub operations instead of placing business rules directly in HTTP handlers.

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

Add a generic usage/status subsystem without baking Codex/Claude/etc. assumptions into the rest of Pueblo Hub.

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

An agent definition should optionally reference a usage provider rather than Pueblo Hub determining behavior from agent-name strings.

Keep quota collection outside the ACP protocol layer. ACP sessions must continue functioning if usage/status collection fails.

Cache results and refresh them independently of chat sessions.

For the initial known agents, reuse existing external tooling where practical rather than reimplementing private provider APIs.

OpenCode/API-based agents should be allowed to expose cost/account information instead of pretending they have a subscription quota.

### Completion

The project/chat UI can display agent availability and quota/reset information, with failures isolated from normal ACP operation.

---

## Phase 2 — Hub-managed per-chat Git workspaces

Support two explicit workspace modes for Git-backed projects. **Managed
worktree** is the default: an isolated Hub-managed branch and worktree per
chat. **Project checkout** is opt-in: the chat uses the existing real project
checkout and the selected local branch.

Chats created before Phase 2 have no workspace row and remain legacy
direct-checkout sessions. They use the same repository-level checkout
concurrency rules as Project checkout chats.

The Hub, not the ACP agent, owns worktree creation, validation, reuse, and cleanup. Agents should simply be launched with the chat worktree as their working directory and should not need to know how Pueblo Hub created it.

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

For a Git project using Managed worktree, creating a chat should create or
attach a dedicated branch/worktree before the ACP process starts. Users choose
the starting local branch. Use deterministic Hub-owned naming:

```text
pueblo-hub/chat/<chat-id>
```

The exact naming scheme may differ, but it must avoid collisions and remain recoverable after a daemon restart.

Store managed worktrees beneath Pueblo Hub state or another explicitly configured workspace root, not inside the user's repository checkout and never in the Nix store.

### Workspace semantics

A Managed worktree chat's ACP process always uses its worktree path as `cwd`.
Project checkout chats use the real project checkout. All file callbacks and
terminal commands therefore operate in the selected workspace.

A newly created chat should start from a well-defined Git revision, normally the selected/current project base ref at chat creation time. Persist that base so restart behavior is deterministic.

Do not silently copy uncommitted changes from the project's primary checkout into a new worktree. If the primary checkout is dirty and that matters to chat creation, report it clearly or require an explicit supported workflow rather than producing an ambiguous starting state.

Existing managed chats keep their own branch/worktree as the project advances.
Do not automatically rebase, merge, reset, fast-forward, or switch a direct
chat back to its expected branch during resume.

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

Archiving/stopping a chat must not destroy its worktree. Deleting a clean
managed chat removes only its worktree and retains its branch. Deletion refuses
dirty or untracked managed-worktree files. Direct and legacy deletion leaves
the checkout and Git state untouched. Branch deletion remains a separate,
deliberate operation.

Project deletion/path changes should account for managed chat worktrees and refuse unsafe operations.

Use ordinary Git plumbing/commands from the Hub backend. The ACP protocol layer should remain unaware of worktree management.

Non-Git projects continue to use the existing project-directory behavior.

### Scope

This phase is workspace isolation, not branch integration automation. Do not add automatic merging, rebasing, cherry-picking, or conflict resolution into the project base branch yet.

The resulting branch is a normal Git branch, so commits created by the agent remain inspectable and can be integrated through normal Git workflows.

### Safety guarantees

This phase does not add automatic merge, rebase, reset, fast-forward, stash,
clean, cherry-pick, review, or branch deletion. It never silently copies dirty
files, switches branches during resume, destructively repairs a workspace, or
implicitly deletes a managed branch.

### Completion

Managed chats can operate concurrently on the same Git repository while each
agent sees a separate worktree and branch; direct and legacy chats are safely
serialized on the shared checkout. Pueblo Hub creates, persists, validates,
recovers, and safely deletes managed worktrees without requiring agents to
invoke `git worktree`. Phase 2 is complete.

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

Replace reliance on reverse-proxy Basic Auth with first-class Pueblo Hub authentication.

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

Pueblo Hub can safely run behind ordinary HTTPS without depending on Traefik Basic Auth, and machine-to-machine clients have a clean token mechanism.

---

## Phase 5 — Browser and Web Push notifications

Add first-class browser notifications for long-running agent work and events that need attention.

This phase must explicitly support **Firefox for Android**, not only desktop Chromium browsers.

Use standards-based Web Push:

```text
Pueblo Hub server
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

A turn can run while the Pueblo Hub page is in the background or closed, and Firefox for Android plus supported desktop browsers receive an OS-level notification when the turn completes, fails, or needs permission. Tapping the notification opens the relevant Pueblo Hub chat.

---

## Phase 6 — File/image uploads and prompt attachments

Add first-class file attachments to chats so users can upload context from desktop or mobile and send it with a prompt without manually copying files into the project.

Attachments should be durable Pueblo Hub entities rather than temporary frontend-only blobs.

Persist metadata similar to:

```text
Attachment
  id
  chat_id
  turn_id?
  original_name
  media_type
  size
  sha256
  storage_key
  created_at
  consumed_at?
```

Store canonical attachment bytes under Pueblo Hub state using Hub-generated IDs/paths. Never use the client-supplied filename as a storage path, never write uploads directly to an arbitrary user-supplied path, and never store attachment data in the Nix store.

### Upload UX

The chat composer should support:

- file picker;
- drag and drop on desktop;
- paste for images/files where the browser exposes them;
- multiple attachments per prompt;
- visible attachment chips/cards before sending;
- removal before send;
- upload progress and clear failure states;
- mobile browser file/photo selection using standard web controls.

Uploaded files should remain associated with the chat across page reloads until sent or explicitly removed, subject to orphan-retention cleanup.

For common image types, show a safe preview. For other files, show filename, type, and size rather than attempting to execute or deeply parse arbitrary content in the browser.

### Storage and security

Requirements:

- configurable per-file and per-prompt size limits;
- configurable attachment-count limits;
- stream uploads to disk rather than buffering large files fully in memory;
- sanitize display filenames while preserving the original name as metadata where safe;
- derive/verify media type server-side rather than trusting `Content-Type` alone;
- content hashes for integrity/deduplication metadata;
- no automatic execution of uploaded files;
- no automatic archive extraction;
- reject path traversal and special filesystem targets;
- authenticated/authorized download endpoints rather than direct public filesystem URLs;
- attachment deletion and retention cleanup;
- clear behavior when a chat/project is deleted.

Canonical attachment storage should stay outside the Git project/worktree so adding prompt context does not pollute Git status or Phase 3 turn diffs.

### Delivering attachments to ACP agents

Keep delivery behind an attachment-capability abstraction rather than hard-coding one ACP implementation.

Prefer native ACP prompt content/attachment blocks when the connected agent advertises a compatible capability, especially for images.

For agents that consume local files by path, expose the canonical attachment through a Hub-controlled read-only path or file callback that the specific chat can access. Extend client file-read validation to allow that chat's attachment roots read-only without granting arbitrary filesystem access.

Do not silently base64-encode arbitrary binary files into text prompts. If the selected agent cannot consume an attachment type, tell the user before the prompt is sent.

Text-like files may optionally expose a bounded text preview, but the canonical attachment should remain a file entity rather than being permanently flattened into prompt text.

Attachment delivery must not modify the user's project repository unless the user or agent explicitly chooses to copy an attachment into project source as a separate action.

### Turn/message association

Uploading and sending are separate operations:

```text
upload attachment
  ↓
receive attachment ID
  ↓
compose prompt referencing attachment IDs
  ↓
server validates ownership/chat association
  ↓
create durable turn + attach files atomically
  ↓
deliver prompt to ACP
```

Once a prompt is accepted, associate its attachments with the durable Phase 3 turn so history can show exactly which files were supplied as context.

Orphaned uploads that were never sent should expire after a configurable retention period rather than accumulating forever.

Later MCP and federation phases should reuse this same attachment model instead of inventing separate upload mechanisms. Remote federation should leave attachment bytes authoritative on the Hub that owns the chat.

### Completion

From desktop or mobile, a user can attach one or more supported files/images to a prompt, reload before sending without losing the staged upload, send the prompt, and later see which attachments belonged to that turn. The selected ACP receives the attachments through a supported delivery mechanism, while uploaded files remain isolated from the project Git worktree and normal diff tracking.

---

## Phase 7 — MCP control plane

Restore MCP, but attach it to the persistent Pueblo Hub daemon rather than resurrecting the old ephemeral MCP architecture.

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

Consider exposing turn diffs from Phase 3 and attachment metadata from Phase 6 as read-only MCP data. If MCP later gains file-upload support, it should create the same Attachment entities and use the same validation/storage pipeline as the browser.

Do not let MCP create an independent process/session/worktree universe. MCP endpoints should be adapters over the shared Hub service layer introduced in Phase 0.

Authentication should use Phase 4 service tokens.

Hermes can then be configured to use Pueblo Hub as its preferred coding-agent control surface rather than launching CLI agents independently.

### Completion

Hermes or another MCP client can start and continue an Pueblo Hub chat while the exact same chat, ACP process, and Hub-managed workspace remain visible and manageable in the browser.

---

## Phase 8 — Review comments and feedback

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

## Phase 9 — Remote Pueblo Hub federation

Allow one Pueblo Hub UI to manage other Pueblo Hub servers.

Do not synchronize their databases, worktrees, or attachment stores.

Each remote Hub remains authoritative for:

- its projects;
- chats;
- chat worktrees;
- attachments;
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
Primary Pueblo Hub
   ↓
Remote Pueblo Hub
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

Attachment uploads for remote chats should be proxied or streamed to the owning remote Hub using the Phase 6 attachment API; the primary Hub should not become a second canonical attachment store.

Do not add distributed orchestration, cross-Hub worktrees, attachment replication, or workload migration yet.

### Completion

From one Pueblo Hub page, remote Pueblo Hub instances can be connected and their projects/chats managed almost exactly like local ones while each Hub remains authoritative for its own workspace, attachments, and runtime state.

---

## Phase 10 — Generalized ACP support + official ACP Registry

Replace the current mostly hand-authored `agents.json` model with a first-class installed-agent abstraction building on the agent definition boundary from Phase 0.

Do not create a proprietary Pueblo Hub marketplace. Use the official ACP Registry as the discovery source.

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

Because Pueblo Hub runs on NixOS, do not assume every upstream binary or npm/Python package will execute correctly merely because the registry lists it.

Treat installation as its own backend abstraction supporting registry distribution types individually.

A sensible progression within this phase is:

```text
1. Registry browsing
2. Detect already-installed agents
3. One-click activation for compatible distributions
4. Managed installation/update
5. Remove/update managed agents
```

Managed registry agents should live under Pueblo Hub state, never `/nix/store`.

Keep proprietary binaries and licensing restrictions respected.

The official ACP Registry should remain the source of truth rather than copying its catalog into the repository.

### Completion

A new ACP-compatible agent normally requires no Pueblo Hub source-code changes: it can be discovered through the ACP Registry or added as a custom command and then behaves like every other agent.

---

## Target architecture

At the end of these phases, Pueblo Hub should function as a general ACP operations interface rather than a web wrapper around a fixed set of agents:

```text
              ┌───────────────┐
              │   Web / PWA   │
              │  + Web Push   │
              │  + Uploads    │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
Hermes/MCP ──►│   Pueblo Hub   │◄── Remote Pueblo Hubs
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
              attachments
              review comments
              usage / quotas
              notifications
```

Phase 10 should be treated as the last major pre-1.0 architectural feature. Once arbitrary registry agents and remote Hubs work without agent-specific UI/backend logic, further features should mostly be additive.
