# Angular Material migration checklist

This checklist records the v0.2 frontend contract and the completed Angular
cutover in `frontend/`. The Rust API, static fallback, and WebSocket protocol
remain unchanged.

## Feasibility spike

- [x] Angular standalone production build emits hashed static assets.
- [x] Nix `buildNpmPackage` packages Angular assets with a locked dependency hash.
- [x] Rust embeds the Angular output through the existing `rust-embed` handler.
- [x] Axum serves `/`, deep-link paths, `/api/status`, and `/ws` unchanged.
- [x] Chromium and Firefox desktop smoke checks pass.
- [x] Chromium and Firefox compact-layout smoke checks pass.

## Frozen transport and state contract

| Lit source | Angular destination | Contract to preserve |
| --- | --- | --- |
| `src/api/client.ts` | `app/core/api/api.service.ts` | REST paths, verbs, JSON payloads, API errors |
| `src/api/types.ts` | `app/core/api/types.ts` | Project, chat, config, event, and display-item shapes |
| `src/api/websocket.ts` | `app/core/event-socket.service.ts` | `/ws`, subscribe replay cursor, reconnect, sequence deduplication |
| `src/state/event-reducer.ts` | `app/state/event-reducer.ts` | Turn/chunk/tool/plan/permission aggregation |
| `src/state/app-state.ts` | `app/state/app-state.service.ts` | project/chat lifecycle, config gating, process state, metadata refresh |
| `src/router.ts` | Angular Router | `/`, `/projects/:projectId`, `/projects/:projectId/chats/:chatId` |

## Component destination map

| Lit component | Angular destination | Material/CDK owner |
| --- | --- | --- |
| `app-shell` | `app.component.ts` | `MatSidenavContainer`, `MatSidenav`, `MatToolbar`, Router |
| `navigation-drawer` | `layout/navigation.component.ts` | `MatNavList`, router links, CDK/Material drawer |
| `project-list` | `projects/project-list.component.ts` | `MatCard`, buttons, `MatMenu`, `MatDialog`, `MatFab` |
| `project-dialog` | `projects/project-dialog.component.ts` | `MatDialog`, `MatTabs`, form fields, progress |
| `edit-project-dialog` | `projects/edit-project-dialog.component.ts` | `MatDialog`, form fields |
| `delete-project-dialog` | `projects/delete-project-dialog.component.ts` | `MatDialog`, buttons |
| `folder-picker` | `projects/folder-picker.component.ts` | Material list/buttons; server remains path authority |
| `agent-picker` | `agents/agent-picker.component.ts` | `MatDialog`, Material selection cards/buttons |
| `chat-view` | `chats/chat-workspace.component.ts` | Material layout and progress; domain composition |
| `chat-header` | `chats/chat-header.component.ts` | buttons, tooltips, `MatMenu`, `MatDialog` |
| `chat-config` | `chats/chat-config.component.ts` | `MatFormField`, `MatSelect`, `MatSlideToggle`, divider |
| `chat-composer` | `chats/chat-composer.component.ts` | `MatFormField`, CDK textarea autosize, icon buttons |
| `event-stream` | `chats/event-stream.component.ts` | Material FAB/button; domain viewport scroll behavior |
| `message-turn` | `chats/message-item.component.ts` | domain message presentation |
| `tool-call-view` | `chats/tool-call.component.ts` | `MatExpansionPanel` |
| `plan-view` | `chats/plan-view.component.ts` | Material surface/icon primitives |
| `permission-card` | `permissions/permission-card.component.ts` | `MatCard`, buttons, icons |

## Workflow acceptance matrix

- [ ] project list, create, edit, delete, and folder selection
- [ ] clone repository workflow and server-side validation errors
- [ ] project and chat route selection, browser back/forward, refresh, malformed/deleted IDs
- [ ] chat creation and automatic ACP connection/config loading
- [ ] stopped/running/dead process controls and reconnect failure/retry states
- [ ] WebSocket replay/reconnect and metadata/config/state events
- [ ] streamed user/agent/thought/tool/plan/permission/error presentation
- [ ] allow/deny permission response and server-confirmed resolution
- [ ] archive/restore, rename, delete, and configuration updates
- [ ] composer send, cancel, disabled/running/thinking states, and Ctrl/Cmd+Enter
- [ ] light/dark/system theme, desktop/compact layout, and keyboard accessibility

The production frontend has now been cut over to Angular. Unchecked workflow
items remain the acceptance-test inventory for follow-up coverage; they do not
represent a second frontend implementation in the repository.
