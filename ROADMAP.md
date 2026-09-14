# Agent Hub Roadmap

Agent Hub is developed as a sequence of feature milestones rather than implementation phases. This file describes product direction and release boundaries; detailed requirements and implementation work belong in GitHub Issues.

- [GitHub Project](https://github.com/users/JuanDelPueblo/projects/2) tracks active work and execution state.
- GitHub milestones group issues into planned releases.
- Issues are the source of truth for feature scope, dependencies, and acceptance criteria.
- This roadmap stays intentionally high level so plans can evolve without duplicating issue specifications.

## Release roadmap

| Milestone | Theme | Outcome |
| --- | --- | --- |
| v0.3.0 | Git workspace foundation | Ship the completed backend foundations and per-chat Git workspace model. |
| v0.4.0 | Generalized ACP | Introduce a first-class installed-agent model and optional ACP Registry discovery. |
| v0.5.0 | Durable turns and workflow | Persist turns, attribute source changes to them, and allow queued follow-up messages. |
| v0.6.0 | Agent usage visibility | Collect provider-neutral usage/status data and surface quotas, account state, and cost where available. |
| v0.7.0 | Review workflow | Persist file/inline review feedback and make it usable from the turn changes UI. |
| v0.8.0 | Native authentication | Add secure browser authentication and scoped machine/service tokens. |
| v0.9.0 | Notifications | Add standards-based Web Push plus configurable completion, permission, and error notifications. |
| v0.10.0 | Prompt attachments | Add secure file/image uploads, composer UX, and capability-aware delivery to ACP agents. |
| v0.11.0 | Material 3 Expressive | Adopt `mat-exp` and migrate the product UI to a coherent Material 3 Expressive design. |
| v1.0.0 | Stable local Agent Hub | Stabilize and publish the complete local/single-Hub product. |
| v1.1.0 | Native Android | Ship a native Android remote client and evaluate on-device ACP agents. |
| v1.2.0 | Remote Hub federation | Allow one Agent Hub to securely manage other Agent Hub instances. |
| v1.3.0 | MCP control plane | Add the MCP server and expose mature Hub operations as MCP tools/resources. |

## v0.3.0 — Git workspace foundation

The next release packages the architectural work already completed after v0.2: durable schema migrations and service boundaries, plus Hub-managed per-chat Git workspaces with optional direct project-checkout mode.

Planned work:

- [Release backend foundations and Git workspaces](https://github.com/JuanDelPueblo/agent-hub/issues/1)

## v0.4.0 — Generalized ACP

Move agent configuration beyond a mostly hand-authored launch map. Agent Hub should have a stable installed-agent abstraction that keeps launch configuration, metadata, capabilities, and discovery sources explicit.

Planned work:

- [Generalize ACP agent definitions and installed-agent model](https://github.com/JuanDelPueblo/agent-hub/issues/10)
- [Integrate the official ACP Registry](https://github.com/JuanDelPueblo/agent-hub/issues/17)

The ACP Registry is an optional discovery source, not a runtime dependency for already configured local agents.

## v0.5.0 — Durable turns and workflow

Make turns first-class durable entities so other features can refer to the same logical unit of work. Build source-change attribution and message queuing on that identity.

Planned work:

- [Persist durable chat turns](https://github.com/JuanDelPueblo/agent-hub/issues/3)
- [Track turn-scoped file and Git changes](https://github.com/JuanDelPueblo/agent-hub/issues/18)
- [Queue messages while a turn is active](https://github.com/JuanDelPueblo/agent-hub/issues/19)

## v0.6.0 — Agent usage visibility

Add provider-neutral usage and account status without coupling provider failures to ACP operation or inferring provider behavior from agent names.

Planned work:

- [Add usage-provider collection subsystem](https://github.com/JuanDelPueblo/agent-hub/issues/2)
- [Show agent usage, quota, and account status](https://github.com/JuanDelPueblo/agent-hub/issues/20)

## v0.7.0 — Review workflow

Turn the change information from v0.5.0 into a persistent review surface for file-level and inline feedback.

Planned work:

- [Persist file and inline review comments](https://github.com/JuanDelPueblo/agent-hub/issues/4)
- [Add review feedback UI and resolution workflow](https://github.com/JuanDelPueblo/agent-hub/issues/21)

## v0.8.0 — Native authentication

Replace reverse-proxy Basic Auth as the primary security model while keeping Agent Hub single-owner. Browser sessions and machine clients should use separate authentication mechanisms.

Planned work:

- [Add native browser authentication](https://github.com/JuanDelPueblo/agent-hub/issues/5)
- [Add scoped service tokens](https://github.com/JuanDelPueblo/agent-hub/issues/22)

## v0.9.0 — Notifications

Add standards-based Web Push for long-running work and events that need attention. Firefox for Android remains a required browser target.

Planned work:

- [Implement Web Push subscriptions and delivery](https://github.com/JuanDelPueblo/agent-hub/issues/6)
- [Add notification events and preferences](https://github.com/JuanDelPueblo/agent-hub/issues/23)

## v0.10.0 — Prompt attachments

Allow users to upload files and images as durable prompt context without polluting project worktrees or hard-coding one ACP agent's attachment mechanism.

Planned work:

- [Add secure attachment storage and APIs](https://github.com/JuanDelPueblo/agent-hub/issues/7)
- [Add prompt attachment composer UX](https://github.com/JuanDelPueblo/agent-hub/issues/24)
- [Deliver prompt attachments to ACP agents](https://github.com/JuanDelPueblo/agent-hub/issues/25)

## v0.11.0 — Material 3 Expressive

Make Material 3 Expressive the deliberate visual system for Agent Hub using [`@ngm-dev/mat-exp`](https://github.com/Angular-Material-Dev/mat-exp) on top of Angular Material. Preserve the existing adaptive layout, accessibility requirements, and Angular Material/CDK architecture.

Planned work:

- [Integrate the mat-exp design-system foundation](https://github.com/JuanDelPueblo/agent-hub/issues/14)
- [Migrate Agent Hub UI to Material 3 Expressive](https://github.com/JuanDelPueblo/agent-hub/issues/26)

## v1.0.0 — Stable local Agent Hub

Version 1.0 is the stability boundary for the complete local/single-Hub experience. It does **not** depend on remote Hub federation, MCP, or the native Android application.

Planned work:

- [Stabilize Agent Hub for 1.0](https://github.com/JuanDelPueblo/agent-hub/issues/15)
- [Publish the 1.0 release](https://github.com/JuanDelPueblo/agent-hub/issues/27)

The 1.0 release should include the capabilities delivered through v0.11.0 and establish a stable base for the post-1.0 surfaces below.

## v1.1.0 — Native Android

Add a native Android APK for developing and supervising agents on the go. The first useful Android release should be able to operate as a remote client for an ordinary Agent Hub server without waiting for federation or MCP.

Planned work:

- [Build a native Android remote client](https://github.com/JuanDelPueblo/agent-hub/issues/16)
- [Evaluate and prototype on-device ACP agents on Android](https://github.com/JuanDelPueblo/agent-hub/issues/28)

Running ACP agents directly on Android is exploratory and must not block the remote-client APK. If practical, it can later provide a fully local mobile development mode with appropriate process, filesystem, Git, permission, and workspace isolation.

## v1.2.0 — Remote Hub federation

Allow one Agent Hub instance to securely supervise other Agent Hub servers. Federation should use Agent Hub's own application-service semantics and must not depend on MCP.

Planned work:

- [Add remote Hub federation transport and model](https://github.com/JuanDelPueblo/agent-hub/issues/9)
- [Add federated Hub UI and recovery experience](https://github.com/JuanDelPueblo/agent-hub/issues/29)

## v1.3.0 — MCP control plane

MCP is intentionally the last currently planned major feature. By this point, the local, Android, and federated product surfaces should already have stable application-service semantics for MCP to expose rather than redefine.

Planned work:

- [Add authenticated Streamable HTTP MCP server](https://github.com/JuanDelPueblo/agent-hub/issues/8)
- [Expose Agent Hub operations as MCP tools and resources](https://github.com/JuanDelPueblo/agent-hub/issues/30)

MCP controls Agent Hub; it does not replace ACP as the protocol used to communicate with coding agents.

## Project documentation

Documentation infrastructure is tracked separately from product release milestones:

- [Define the Agent Hub documentation style guide](https://github.com/JuanDelPueblo/agent-hub/issues/11)
- [Set up the Agent Hub GitHub Wiki](https://github.com/JuanDelPueblo/agent-hub/issues/12)

The style guide and Wiki structure are intentionally being designed in dedicated planning threads rather than specified in this roadmap.
