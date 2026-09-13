# Agent Hub Roadmap

This roadmap follows the current v0.2 frontend overhaul. Each phase should be implemented by a separate agent against the completed previous phase. Avoid parallel agents modifying the same branch.

## Phase order

| Phase | Priority | Feature | Depends on |
| --- | --- | --- | --- |
| 1 | P1 | Usage quotas/status | Current v0.2 |
| 2 | P1 | Per-turn git/file diffs | Current v0.2 |
| 3 | P2 | Native authentication | Current v0.2 |
| 4 | P2 | MCP control plane | Phase 3 |
| 5 | P2 | File/inline review comments | Phase 2 |
| 6 | P3 | Remote Agent Hub federation | Phases 3–4 |
| 7 | P4 | Generalized ACP + Registry marketplace | All previous |

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

An ACP definition should optionally reference a usage provider rather than Agent Hub determining behavior from agent-name strings.

Keep quota collection outside the ACP protocol layer. ACP sessions must continue functioning if usage/status collection fails.

Cache results and refresh them independently of chat sessions.

For the initial known agents, reuse existing external tooling where practical rather than reimplementing private provider APIs.

OpenCode/API-based agents should be allowed to expose cost/account information instead of pretending they have a subscription quota.

### Completion

The project/chat UI can display agent availability and quota/reset information, with failures isolated from normal ACP operation.

---

## Phase 2 — Turn-scoped git/file diffs and commit tracking

Add source-control awareness to each chat turn. This becomes the foundation for the later review/comment system.

Before each prompt, record enough repository state to establish a baseline. After the turn finishes, determine what changed.

Persist something similar to:

```text
Turn
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

Do not treat commits as the sole source of truth. Agents frequently modify files without committing.

Capture:

- working-tree changes introduced during the turn;
- staged changes;
- commits created during the turn;
- renamed/deleted/new files.

Be careful about pre-existing dirty files. A turn should show what the turn changed, not blindly show the entire current `git diff`.

Ideally establish a before/after snapshot or blob/hash model so an already-modified file can still be attributed correctly.

The UI should expose a `Changes` section on each completed turn with a familiar diff viewer.

Support non-Git projects gracefully, at minimum with changed-file detection where feasible.

### Completion

For any completed coding turn, the exact files changed and commits created by that turn can be inspected.

---

## Phase 3 — Native authentication

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

## Phase 4 — MCP control plane

Restore MCP, but attach it to the persistent Agent Hub daemon rather than resurrecting the old ephemeral MCP architecture.

Implement Streamable HTTP MCP, for example:

```text
/mcp
```

It must use the same:

- SQLite store;
- SessionManager;
- projects;
- chats;
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

Consider exposing turn diffs from Phase 2 as read-only MCP data.

Do not let MCP create an independent process/session universe.

Authentication should use Phase 3 service tokens.

Hermes can then be configured to use Agent Hub as its preferred coding-agent control surface rather than launching CLI agents independently.

### Completion

Hermes or another MCP client can start and continue an Agent Hub chat while the exact same chat remains visible and manageable in the browser.

---

## Phase 5 — Review comments and feedback

Build this directly on the Phase 2 diff viewer.

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

## Phase 6 — Remote Agent Hub federation

Allow one Agent Hub UI to manage other Agent Hub servers.

Do not synchronize their databases.

Each remote Hub remains authoritative for:

- its projects;
- chats;
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

Do not add distributed orchestration or workload migration yet.

### Completion

From one Agent Hub page, remote Agent Hub instances can be connected and their projects/chats managed almost exactly like local ones.

---

## Phase 7 — Generalized ACP support + official ACP Registry

Replace the current mostly hand-authored `agents.json` model with a first-class installed-agent abstraction.

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
              turns / diffs
              review comments
              usage / quotas
```

Phase 7 should be treated as the last major pre-1.0 architectural feature. Once arbitrary registry agents and remote Hubs work without agent-specific UI/backend logic, further features should mostly be additive.
