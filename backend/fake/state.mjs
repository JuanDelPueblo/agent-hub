// In-memory replacement for the SQLite store of `backend/src/store.rs`.
// The shapes match `store::Project`, `store::Chat` and `events::SessionEvent`.

import { randomUUID } from 'node:crypto';

export const AGENTS = ['antigravity', 'claude', 'codex', 'opencode'];

export const PERMISSION_POLICIES = ['ask', 'read-only', 'auto-approve', 'deny-all'];

/** Root of the synthetic directory tree that the folder picker browses. */
export const PROJECT_ROOT = '/home/dev/projects';

function now() {
  return new Date().toISOString();
}

/** Config options in the shape the ACP agents advertise. */
export function defaultConfigOptions(agent) {
  return [
    {
      id: 'model',
      name: 'Model',
      type: 'select',
      currentValue: agent === 'codex' ? 'gpt-5-codex' : 'claude-opus-5',
      description: 'Model that answers in this chat.',
      options: [
        {
          group: 'Anthropic',
          options: [
            { value: 'claude-opus-5', name: 'Claude Opus 5' },
            { value: 'claude-sonnet-5', name: 'Claude Sonnet 5' },
            { value: 'claude-haiku-4-5', name: 'Claude Haiku 4.5' },
          ],
        },
        {
          group: 'OpenAI',
          options: [
            { value: 'gpt-5-codex', name: 'GPT-5 Codex' },
            { value: 'gpt-5', name: 'GPT-5' },
          ],
        },
        {
          group: 'Local',
          options: [{ value: 'qwen-coder', name: 'Qwen Coder 32B' }],
        },
      ],
    },
    {
      id: 'reasoning_effort',
      name: 'Reasoning effort',
      type: 'select',
      currentValue: 'medium',
      description: 'Time the agent spends before it answers.',
      options: [
        { value: 'low', name: 'Low' },
        { value: 'medium', name: 'Medium' },
        { value: 'high', name: 'High' },
      ],
    },
    {
      id: 'web_search',
      name: 'Web search',
      type: 'boolean',
      currentValue: false,
      description: 'Let the agent read pages from the web.',
    },
    {
      id: 'auto_commit',
      name: 'Commit after every turn',
      type: 'boolean',
      currentValue: true,
      description: 'Write a git commit when a turn ends.',
    },
  ];
}

export class FakeState {
  constructor() {
    this.projects = new Map();
    this.chats = new Map();
    // The real backend stores this sequence in SQLite. The fake keeps the
    // server-owned sequence for its process lifetime so deleted chats never
    // make a default title available for reuse.
    this.nextChatNumber = 1;
    this.configByChat = new Map();
    this.workspaceOptionsByProject = new Map();
    // Live process state, which the real backend holds in the session manager.
    this.runtime = new Map();

    this.events = [];
    this.nextSeq = 1;
    this.listeners = new Set();

    this.seed();
  }

  // ---------------------------------------------------------------- events

  /** Appends an event and publishes it, exactly like `EventLog::append`. */
  emit(sessionId, agent, payload) {
    const event = {
      seq: this.nextSeq,
      timestamp: now(),
      session_id: sessionId,
      agent,
      payload,
    };
    this.nextSeq += 1;
    this.events.push(event);
    for (const listener of this.listeners) listener(event);
    return event;
  }

  /** Tells the browser that projects or chats changed. */
  metadataChanged() {
    this.emit('', '', { type: 'metadata_changed' });
  }

  replayFrom(fromSeq) {
    return this.events.filter((event) => event.seq >= fromSeq);
  }

  historyPage(chatId, beforeSeq, limit = 100, throughSeq) {
    const history = this.events
      .filter((event) => event.session_id === chatId
        && (beforeSeq == null || event.seq < beforeSeq)
        && (throughSeq == null || event.seq <= throughSeq))
      .sort((a, b) => b.seq - a.seq);
    const page = history.slice(0, limit);
    const hasOlder = history.length > limit;
    page.reverse();
    return {
      events: page,
      next_cursor: hasOlder ? page[0]?.seq ?? null : null,
      has_older: hasOlder,
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  forgetChat(chatId) {
    this.events = this.events.filter((event) => event.session_id !== chatId);
  }

  // -------------------------------------------------------------- projects

  createProject(name, path, workspaceOptions = null) {
    const project = {
      id: randomUUID(),
      name,
      path,
      created_at: now(),
      updated_at: now(),
      chat_count: 0,
    };
    this.projects.set(project.id, project);
    this.workspaceOptionsByProject.set(project.id, workspaceOptions ?? {
      is_git: false, current_branch: null, head_sha: null, dirty: false, branches: [],
    });
    return project;
  }

  workspaceOptions(projectId) {
    const options = this.workspaceOptionsByProject.get(projectId);
    if (!options) return null;
    return { ...options, branches: options.branches.map((branch) => ({ ...branch })) };
  }

  projectView(project) {
    const chatCount = [...this.chats.values()].filter(
      (chat) => chat.project_id === project.id,
    ).length;
    return { ...project, chat_count: chatCount };
  }

  listProjects() {
    return [...this.projects.values()].map((project) => this.projectView(project));
  }

  // ----------------------------------------------------------------- chats

  createChat(projectId, agent, title, workspace) {
    const hasExplicitTitle = typeof title === 'string' && title.trim().length > 0;
    const finalTitle = hasExplicitTitle ? title.trim() : `New chat ${this.nextChatNumber++}`;
    const chat = {
      id: randomUUID(),
      project_id: projectId,
      agent,
      title: finalTitle,
      acp_session_id: null,
      created_at: now(),
      updated_at: now(),
      archived: false,
      permission_policy: 'ask',
      config_values: {},
      title_overridden: hasExplicitTitle,
      workspace: workspace ? {
        mode: workspace.mode,
        branch: workspace.mode === 'managed_worktree' ? `agent-hub/chat/${chat.id}` : workspace.branch,
        base_commit: workspace.base_commit ?? this.workspaceOptionsByProject.get(projectId)?.branches
          ?.find((branch) => branch.name === workspace.branch)?.sha ?? null,
      } : null,
    };
    this.chats.set(chat.id, chat);
    this.configByChat.set(chat.id, defaultConfigOptions(agent));
    this.runtime.set(chat.id, { process: 'STOPPED', turn: 'IDLE' });
    return chat;
  }

  /** Applies an ACP-generated title unless a manual rename already won. */
  updateGeneratedTitle(chat, title) {
    if (chat.title_overridden || chat.title === title) return false;
    chat.title = title;
    chat.updated_at = now();
    this.metadataChanged();
    return true;
  }

  /** Adds the live process fields, like `hub::chat_view`. */
  chatView(chat) {
    const runtime = this.runtime.get(chat.id) ?? { process: 'STOPPED', turn: 'IDLE' };
    return {
      ...chat,
      turn_started_at: this.activeTurnStartedAt(chat.id),
      process_state: runtime.process,
      turn_state: runtime.turn,
    };
  }

  activeTurnStartedAt(chatId) {
    let startedAt = null;
    for (const event of this.events
      .filter((candidate) => candidate.session_id === chatId)
      .sort((left, right) => left.seq - right.seq)) {
      if (event.payload.type === 'user_message') startedAt = event.timestamp;
      else if (event.payload.type === 'state_change'
        && event.payload.turn === 'PROMPTING' && startedAt == null) startedAt = event.timestamp;
      else if (event.payload.type === 'turn_complete') startedAt = null;
    }
    return startedAt;
  }

  listChats(projectId) {
    return [...this.chats.values()]
      .filter((chat) => chat.project_id === projectId)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at) || b.id.localeCompare(a.id))
      .map((chat) => this.chatView(chat));
  }

  touchChatActivity(chatId, updatedAt = now()) {
    const chat = this.chats.get(chatId);
    if (!chat) return null;
    chat.updated_at = updatedAt;
    return chat;
  }

  setRuntime(chatId, process, turn) {
    const chat = this.chats.get(chatId);
    if (!chat) return;
    const runtime = this.runtime.get(chatId) ?? { process: 'STOPPED', turn: 'IDLE' };
    const next = { process: process ?? runtime.process, turn: turn ?? runtime.turn };
    this.runtime.set(chatId, next);
    this.emit(chatId, chat.agent, {
      type: 'state_change',
      process: next.process,
      turn: next.turn,
    });
  }

  // ------------------------------------------------------------------ seed

  seed() {
    const hub = this.createProject('agent-hub', `${PROJECT_ROOT}/agent-hub`, {
      is_git: true,
      current_branch: 'master',
      head_sha: '1111111111111111111111111111111111111111',
      dirty: true,
      branches: [
        { name: 'master', sha: '1111111111111111111111111111111111111111', current: true },
        { name: 'feature/ui', sha: '2222222222222222222222222222222222222222', current: false },
        { name: 'release', sha: '3333333333333333333333333333333333333333', current: false },
      ],
    });
    const firmware = this.createProject('corolla-firmware', `${PROJECT_ROOT}/corolla-firmware`);
    this.createProject('scratch', `${PROJECT_ROOT}/scratch`);

    const review = this.createChat(hub.id, 'claude', 'Review the WebSocket replay path');
    review.workspace = {
      mode: 'managed_worktree',
      branch: `agent-hub/chat/${review.id}`,
      base_commit: '1111111111111111111111111111111111111111',
    };
    review.acp_session_id = 'acp-session-1';
    this.runtime.set(review.id, { process: 'RUNNING', turn: 'IDLE' });

    const migrate = this.createChat(hub.id, 'codex', 'Port the store to migrations');
    migrate.archived = true;

    const theme = this.createChat(hub.id, 'opencode', 'Frontend theme cleanup');
    theme.workspace = {
      mode: 'project_checkout',
      branch: 'feature/ui',
      base_commit: '2222222222222222222222222222222222222222',
    };

    const flash = this.createChat(firmware.id, 'claude', 'Unscramble the calibration block');
    flash.permission_policy = 'read-only';

    this.seedTranscript(review);
    this.seedConversation(migrate, {
      user: 'How do we port the store to versioned migrations?',
      thought: 'The store opens SQLite directly. I must list the tables before I draft the migration steps.',
      answer: 'I drafted the migration plan. Each migration runs once and records its version, so a restart never replays it.',
    });
    this.seedConversation(theme, {
      user: 'What is left in the frontend theme cleanup?',
      thought: 'The theme tokens live in styles.scss. I must check which components still use the old values.',
      answer: 'I removed the old theme overrides. The app now uses the Material 3 tokens, so dark mode follows the system setting.',
    });
    this.seedConversation(flash, {
      user: 'How do we unscramble the calibration block?',
      thought: 'The dump is XOR-scrambled. I must read the flash tool before I touch the bytes.',
      answer: 'I unscrambled the block with the vendor XOR key. The checksum now matches, so the flash tool accepts the image.',
    });
  }

  /**
   * Writes one finished user/answer turn from a small script, so each seeded
   * chat shows history without duplicating `emit()` blocks.
   */
  seedConversation(chat, script) {
    const userEvent = this.emit(chat.id, chat.agent, {
      type: 'user_message',
      text: script.user,
    });
    this.touchChatActivity(chat.id, userEvent.timestamp);
    if (script.thought) {
      this.emit(chat.id, chat.agent, {
        type: 'thought_chunk',
        text: script.thought,
      });
    }
    this.emit(chat.id, chat.agent, {
      type: 'message_chunk',
      text: script.answer,
    });
    this.emit(chat.id, chat.agent, { type: 'turn_complete', stop_reason: 'end_turn' });
  }

  /** Writes a finished turn, so a freshly opened UI already shows content. */
  seedTranscript(chat) {
    const agent = chat.agent;
    const userEvent = this.emit(chat.id, agent, {
      type: 'user_message',
      text: 'Why does the WebSocket drop events after a reconnect?',
    });
    this.touchChatActivity(chat.id, userEvent.timestamp);
    this.emit(chat.id, agent, {
      type: 'thought_chunk',
      text: 'The client sends from_seq. I must check how the log replays it.',
    });
    this.emit(chat.id, agent, {
      type: 'tool_call',
      id: 'seed-tool-1',
      title: 'Read backend/src/events.rs',
      status: 'in_progress',
    });
    this.emit(chat.id, agent, {
      type: 'tool_call_update',
      id: 'seed-tool-1',
      status: 'completed',
      output: 'replay_from() filters on seq >= from_seq.',
    });
    this.emit(chat.id, agent, {
      type: 'message_chunk',
      text: 'The replay is correct. ',
    });
    this.emit(chat.id, agent, {
      type: 'message_chunk',
      text: 'The gap comes from the broadcast channel, which drops a slow reader.',
    });
    this.emit(chat.id, agent, { type: 'turn_complete', stop_reason: 'end_turn' });
  }
}
