// In-memory replacement for the SQLite store of `backend/src/store.rs`.
// The shapes match `store::Project`, `store::Chat` and `events::SessionEvent`.

import { randomUUID } from 'node:crypto';

// This is the fake equivalent of the real provider-neutral /api/agents
// catalog. Keep metadata explicit rather than deriving it from the id.
export const AGENTS = [
  { id: 'antigravity', display_name: 'Antigravity', source: 'builtin', availability: 'available', usage_provider: null, metadata: {}, mutability: 'read_only', display: {} },
  { id: 'claude', display_name: 'Claude', source: 'builtin', availability: 'available', usage_provider: null, metadata: {}, mutability: 'read_only', display: { description: 'Anthropic Claude ACP agent.', version: '5.0.0' } },
  { id: 'codex', display_name: 'Codex', source: 'builtin', availability: 'available', usage_provider: null, metadata: {}, mutability: 'read_only', display: { description: 'OpenAI Codex ACP agent.', version: '5.1.0' } },
  { id: 'opencode', display_name: 'OpenCode', source: 'builtin', availability: 'available', usage_provider: null, metadata: {}, mutability: 'read_only', display: {} },
  {
    id: 'legacy-file',
    display_name: 'Legacy File Agent',
    source: 'file',
    availability: 'available',
    usage_provider: null,
    metadata: {},
    mutability: 'read_only',
    display: { description: 'Defined by the --agents-file source.', version: '0.9.0' },
  },
  {
    id: 'nix-agent',
    display_name: 'Nix Declarative Agent',
    source: 'declarative',
    availability: 'available',
    usage_provider: null,
    metadata: {},
    mutability: 'read_only',
    display: { description: 'Supplied by the declarative deployment source.' },
  },
  {
    id: 'broken-agent',
    display_name: 'Broken Agent',
    source: 'builtin',
    availability: 'unavailable',
    unavailable_reason: 'The configured command is not installed on this host.',
    usage_provider: null,
    metadata: {},
    mutability: 'read_only',
    display: {},
  },
  {
    id: 'example-acp',
    display_name: 'Example ACP',
    source: 'registry',
    registry_id: 'example-acp',
    availability: 'available',
    usage_provider: null,
    metadata: {},
    mutability: 'registry_managed',
    display: { description: 'A representative ACP Registry entry for frontend development.', version: '1.0.0' },
  },
];

// The fake ACP Registry catalog. `unsupported_reason` mirrors a host that
// cannot install an entry; the frontend must present it honestly.
export const REGISTRY_ENTRIES = [
  {
    id: 'example-acp',
    name: 'Example ACP',
    version: '1.2.0',
    description: 'A representative ACP Registry entry for frontend development.',
    repository: 'https://example.invalid/example-acp',
    website: 'https://example.invalid',
    authors: ['Example Author'],
    license: 'MIT',
    distributions: ['npx'],
    platforms: [],
    selected_distribution: 'npx',
  },
  {
    id: 'native-agent',
    name: 'Native Agent',
    version: '2.0.0',
    description: 'A binary ACP agent for this host.',
    repository: 'https://example.invalid/native-agent',
    authors: ['Native Author'],
    license: 'Apache-2.0',
    distributions: ['binary'],
    platforms: ['linux-x86_64'],
    selected_distribution: 'binary',
  },
  {
    id: 'windows-only',
    name: 'Windows Only',
    version: '1.0.0',
    description: 'A binary ACP agent that this host cannot install.',
    distributions: ['binary'],
    platforms: ['windows-x86_64'],
    selected_distribution: null,
    unsupported_reason: 'No binary distribution covers this platform.',
  },
];

/** Provider-neutral authentication state, keyed by agent id. */
function defaultAuth(agentId) {
  return { agent_id: agentId, authenticated: false, methods: [] };
}

export const AUTH_METHODS = {
  claude: [
    { id: 'claude-oauth', name: 'Sign in with Claude', type: 'agent', description: 'Open the provider sign-in page.' },
  ],
  codex: [
    { id: 'openai-oauth', name: 'Sign in with OpenAI', type: 'agent' },
    { id: 'api-key', name: 'API key', type: 'terminal', description: 'Enter an API key in a terminal.' },
  ],
  opencode: [
    { id: 'opencode-oauth', name: 'OAuth', type: 'agent' },
    { id: 'device-code', name: 'Legacy device flow', type: 'unsupported', kind: 'device_code' },
  ],
  'example-acp': [
    { id: 'example-token', name: 'Example token', type: 'terminal' },
  ],
};

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

export function defaultCommands() {
  return [
    { name: 'plan', description: 'Create an implementation plan', input: { hint: 'goal for the plan' } },
    { name: 'review', description: 'Review the current changes', input: null },
  ];
}

export function defaultModes() {
  return {
    current_mode_id: 'ask',
    available_modes: [
      { id: 'ask', name: 'Ask', description: 'Ask before acting' },
      { id: 'act', name: 'Act', description: 'Act without asking' },
    ],
  };
}

export function defaultUsage() {
  return { used: 1200, size: 200000, cost_amount: 0.012, cost_currency: 'USD' };
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
    this.commandsByChat = new Map();
    this.modesByChat = new Map();
    this.usageByChat = new Map();
    this.elicitationsByChat = new Map();
    this.remoteSessionsByChat = new Map();
    this.workspaceOptionsByProject = new Map();
    // Live process state, which the real backend holds in the session manager.
    this.runtime = new Map();
    this.tasksByChat = new Map();
    this.blockedChats = new Set();

    this.events = [];
    this.nextSeq = 1;
    this.listeners = new Set();

    // Authentication state and opaque terminal flows (T111 contract).
    this.authByAgent = new Map();
    this.flows = new Map();
    // Editable Pueblo-managed definitions, including their launch environment.
    this.customDetails = new Map();

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
    this.tasksByChat.delete(chatId);
    this.blockedChats.delete(chatId);
    this.commandsByChat.delete(chatId);
    this.modesByChat.delete(chatId);
    this.usageByChat.delete(chatId);
    this.elicitationsByChat.delete(chatId);
    this.remoteSessionsByChat.delete(chatId);
    this.configByChat.delete(chatId);
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
        branch: workspace.mode === 'managed_worktree' ? `pueblo-hub/chat/${chat.id}` : workspace.branch,
        base_commit: workspace.base_commit ?? this.workspaceOptionsByProject.get(projectId)?.branches
          ?.find((branch) => branch.name === workspace.branch)?.sha ?? null,
      } : null,
    };
    this.chats.set(chat.id, chat);
    this.configByChat.set(chat.id, defaultConfigOptions(agent));
    this.commandsByChat.set(chat.id, defaultCommands());
    this.modesByChat.set(chat.id, defaultModes());
    this.usageByChat.set(chat.id, defaultUsage());
    this.elicitationsByChat.set(chat.id, []);
    this.remoteSessionsByChat.set(chat.id, [
      { sessionId: `acp-${chat.id.slice(0, 8)}`, title: finalTitle },
      { sessionId: 'acp-older-session', title: 'Earlier conversation' },
    ]);
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
    const tasks = this.tasksByChat.get(chat.id) ?? [];
    const activeTasks = tasks.filter((task) => task.state === 'running').length;
    return {
      ...chat,
      turn_started_at: this.activeTurnStartedAt(chat.id),
      process_state: runtime.process,
      turn_state: runtime.turn,
      active_tasks: activeTasks,
    };
  }

  isEnvironmentBlocked(chatId) {
    return this.blockedChats.has(chatId);
  }

  blockEnvironment(chatId) {
    this.blockedChats.add(chatId);
  }

  authorizeEnvironment(chatId) {
    this.blockedChats.delete(chatId);
  }

  listTasks(chatId) {
    const tasks = this.tasksByChat.get(chatId) ?? [];
    return tasks.map(({ output, truncated, ...summary }) => ({ ...summary }));
  }

  getTask(chatId, taskId) {
    const tasks = this.tasksByChat.get(chatId) ?? [];
    const task = tasks.find((t) => t.id === taskId);
    return task ? { ...task } : null;
  }

  stopTask(chatId, taskId) {
    const tasks = this.tasksByChat.get(chatId) ?? [];
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;
    if (task.state === 'running') {
      task.state = 'stopped';
      task.completed_at = now();
      this.metadataChanged();
    }
    return true;
  }

  createTask(chatId, command, cwd, initialOutput = '') {
    if (!this.tasksByChat.has(chatId)) {
      this.tasksByChat.set(chatId, []);
    }
    const tasks = this.tasksByChat.get(chatId);
    const task = {
      id: randomUUID(),
      chat_id: chatId,
      command,
      cwd: cwd ?? `${PROJECT_ROOT}/agent-hub`,
      state: 'running',
      exit_code: null,
      started_at: now(),
      completed_at: null,
      output: initialOutput,
      truncated: false,
    };
    tasks.push(task);
    this.metadataChanged();
    return task;
  }

  completeTask(chatId, taskId, exitCode, outputAppend = '') {
    const task = (this.tasksByChat.get(chatId) ?? []).find((t) => t.id === taskId);
    if (!task) return;
    if (outputAppend) task.output += outputAppend;
    task.exit_code = exitCode;
    task.state = exitCode === 0 ? 'completed' : 'failed';
    task.completed_at = now();
    this.metadataChanged();
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

  agent(id) { return AGENTS.find((agent) => agent.id === id); }

  createCustomAgent(input) {
    if (this.agent(input.id)) throw Object.assign(new Error('An agent already uses that id'), { status: 409 });
    const agent = customSummary(input);
    AGENTS.push(agent);
    this.customDetails.set(agent.id, customDetail(input));
    this.metadataChanged();
    return agent;
  }

  editCustomAgent(id, input) {
    const agent = this.agent(id);
    if (!agent) throw Object.assign(new Error('Agent not found'), { status: 404 });
    if (agent.source !== 'pueblo_managed') throw Object.assign(new Error('This agent is not Pueblo-managed'), { status: 409 });
    if (input.id !== id) throw Object.assign(new Error('An agent id cannot change'), { status: 400 });
    Object.assign(agent, customSummary(input));
    this.customDetails.set(id, customDetail(input));
    this.metadataChanged();
    return agent;
  }

  agentDetail(id) {
    const agent = this.agent(id);
    if (!agent) throw Object.assign(new Error('Agent not found'), { status: 404 });
    if (agent.source !== 'pueblo_managed') {
      throw Object.assign(new Error('This agent is not an editable Pueblo-managed definition'), { status: 409 });
    }
    return { ...this.customDetails.get(id), id };
  }

  removeAgent(id) {
    const index = AGENTS.findIndex((agent) => agent.id === id);
    if (index < 0) throw Object.assign(new Error('Agent not found'), { status: 404 });
    const agent = AGENTS[index];
    if (agent.mutability === 'read_only') throw Object.assign(new Error('This agent is read-only'), { status: 409 });
    AGENTS.splice(index, 1);
    this.customDetails.delete(id);
    this.authByAgent.delete(id);
    this.metadataChanged();
    return { id, deleted: true, retained_chats: 0 };
  }

  // -------------------------------------------------------- ACP Registry

  /** The browse view. Installed state is derived from the one catalog. */
  registryView(query) {
    const filter = (query ?? '').trim().toLowerCase();
    const installedByRegistry = new Map(
      AGENTS.filter((agent) => agent.registry_id).map((agent) => [agent.registry_id, agent]),
    );
    const agents = REGISTRY_ENTRIES
      .filter((entry) => !filter || `${entry.id} ${entry.name} ${entry.description}`.toLowerCase().includes(filter))
      .map((entry) => {
        const installed = installedByRegistry.get(entry.id);
        const installedVersion = installed?.display?.version ?? null;
        return {
          ...entry,
          ...(installed ? { installed_as: installed.id, installed_version: installedVersion } : {}),
          update_available: installedVersion !== null && installedVersion !== entry.version,
        };
      });
    return {
      status: 'cached',
      source_url: 'https://registry.example.invalid/registry.json',
      registry_version: '1.0.0',
      fetched_at: '2026-01-01T00:00:00Z',
      host_platform: 'linux-x86_64',
      host: 'linux-x86_64 (fake)',
      rejected: [],
      agents,
    };
  }

  installRegistryAgent(body) {
    const entry = REGISTRY_ENTRIES.find((candidate) => candidate.id === body.registry_id);
    if (!entry) throw Object.assign(new Error('Registry agent not found'), { status: 404 });
    if (entry.unsupported_reason) {
      throw Object.assign(new Error(entry.unsupported_reason), { status: 422 });
    }
    const id = (body.agent_id ?? '').trim() || entry.id;
    if (this.agent(id)) throw Object.assign(new Error('An agent already uses that id'), { status: 409 });
    const agent = {
      id,
      display_name: body.display_name?.trim() || entry.name,
      source: 'registry',
      registry_id: entry.id,
      availability: 'available',
      usage_provider: body.usage_provider ?? null,
      metadata: body.metadata ?? null,
      mutability: 'registry_managed',
      display: { description: entry.description, version: entry.version },
    };
    AGENTS.push(agent);
    this.metadataChanged();
    return agent;
  }

  updateRegistryAgent(id) {
    const agent = this.agent(id);
    if (!agent) throw Object.assign(new Error('Agent not found'), { status: 404 });
    if (agent.source !== 'registry') throw Object.assign(new Error('Only registry agents can update'), { status: 409 });
    const entry = REGISTRY_ENTRIES.find((candidate) => candidate.id === agent.registry_id);
    if (!entry) throw Object.assign(new Error('The registry entry is gone'), { status: 404 });
    const from = agent.display.version ?? '0.0.0';
    if (from === entry.version) {
      return { updated: false, from_version: from, to_version: entry.version, agent };
    }
    agent.display = { ...agent.display, version: entry.version };
    this.metadataChanged();
    return { updated: true, from_version: from, to_version: entry.version, agent };
  }

  // ------------------------------------------------------- authentication

  agentAuth(id) {
    if (!this.agent(id)) throw Object.assign(new Error('Agent not found'), { status: 404 });
    const stored = this.authByAgent.get(id);
    if (stored) return stored;
    return { agent_id: id, authenticated: false, methods: AUTH_METHODS[id] ?? [] };
  }

  setAgentAuth(id, state) {
    this.authByAgent.set(id, state);
    return state;
  }

  authenticateAgent(id, methodId) {
    const auth = this.agentAuth(id);
    const method = (AUTH_METHODS[id] ?? auth.methods).find((candidate) => candidate.id === methodId);
    if (!method) throw Object.assign(new Error(`Unknown authentication method '${methodId}'`), { status: 404 });
    if (method.type === 'terminal') {
      throw Object.assign(new Error('Terminal methods run in a terminal, not through authenticate'), { status: 400 });
    }
    if (method.type !== 'agent') {
      throw Object.assign(new Error(`Unsupported authentication method '${method.kind ?? method.type}'`), { status: 400 });
    }
    return this.setAgentAuth(id, {
      agent_id: id,
      authenticated: true,
      account: `${id} account`,
      methods: AUTH_METHODS[id] ?? auth.methods,
    });
  }

  logoutAgent(id) {
    const auth = this.agentAuth(id);
    return this.setAgentAuth(id, {
      agent_id: id,
      authenticated: false,
      account: null,
      methods: AUTH_METHODS[id] ?? auth.methods,
    });
  }

  startTerminalFlow(id, methodId) {
    const auth = this.agentAuth(id);
    const method = (AUTH_METHODS[id] ?? auth.methods).find((candidate) => candidate.id === methodId);
    if (!method) throw Object.assign(new Error(`Unknown authentication method '${methodId}'`), { status: 404 });
    if (method.type !== 'terminal') {
      throw Object.assign(new Error('Only terminal methods start a PTY flow'), { status: 400 });
    }
    const flow = {
      flow_id: randomUUID(),
      agent_id: id,
      method_id: methodId,
      method_name: method.name,
      state: 'running',
      exit_code: null,
      error: null,
      output: `Sign in to ${id}.\nType a token and press Enter. Type "fail" to simulate a failure.\n`,
      cols: 80,
      rows: 24,
      socket: null,
    };
    this.flows.set(flow.flow_id, flow);
    return flow;
  }

  flowView(flowId) {
    const flow = this.flows.get(flowId);
    if (!flow) return null;
    const { socket, output, cols, rows, ...view } = flow;
    return view;
  }

  attachFlowSocket(flowId, socket) {
    const flow = this.flows.get(flowId);
    if (!flow) {
      socket.close();
      return;
    }
    flow.socket = socket;
    socket.send(JSON.stringify({ type: 'state', state: flow.state, exit_code: flow.exit_code, error: flow.error }));
    socket.send(JSON.stringify({ type: 'output', data: flow.output }));
    socket.onMessage = (text) => {
      let message;
      try {
        message = JSON.parse(text);
      } catch {
        return;
      }
      if (message.type === 'input') this.flowInput(flowId, String(message.data ?? ''));
      else if (message.type === 'resize') this.flowResize(flowId, message.cols, message.rows);
    };
    socket.onClose = () => {
      if (flow.socket === socket) flow.socket = null;
    };
  }

  flowInput(flowId, data) {
    const flow = this.flows.get(flowId);
    if (!flow || flow.state !== 'running') return;
    flow.output += data;
    this.sendFlow(flow, { type: 'output', data });
    if (data.includes('\r')) {
      const line = flow.output.split('\n').pop().replace(/\r/g, '').trim().toLowerCase();
      if (line.includes('fail')) this.finishFlow(flowId, 'failed', 1, 'Authentication was rejected.');
      else if (line.includes('cancel')) this.finishFlow(flowId, 'cancelled', null, null);
      else this.finishFlow(flowId, 'succeeded', 0, null);
    }
  }

  flowResize(flowId, cols, rows) {
    const flow = this.flows.get(flowId);
    if (!flow) return;
    flow.cols = Number(cols) || flow.cols;
    flow.rows = Number(rows) || flow.rows;
  }

  cancelFlow(flowId) {
    const flow = this.flows.get(flowId);
    if (!flow) throw Object.assign(new Error('Authentication flow not found'), { status: 404 });
    if (flow.state === 'running') this.finishFlow(flowId, 'cancelled', null, null);
    return this.flowView(flowId);
  }

  finishFlow(flowId, flowState, exitCode, error) {
    const flow = this.flows.get(flowId);
    if (!flow || flow.state !== 'running') return;
    flow.state = flowState;
    flow.exit_code = exitCode;
    flow.error = error;
    this.sendFlow(flow, { type: 'state', state: flowState, exit_code: exitCode, error });
    if (flowState === 'succeeded') {
      const auth = this.authByAgent.get(flow.agent_id) ?? defaultAuth(flow.agent_id);
      this.setAgentAuth(flow.agent_id, {
        agent_id: flow.agent_id,
        authenticated: true,
        account: `${flow.agent_id} account`,
        methods: auth.methods,
      });
    }
  }

  sendFlow(flow, message) {
    if (flow.socket?.open) flow.socket.send(JSON.stringify(message));
  }

  // ------------------------------------------------------------------ seed

  /** Seeds the editable definition and the representative auth states. */
  seedAgents() {
    const custom = {
      id: 'my-custom',
      display_name: 'My Custom Agent',
      command: 'my-agent',
      args: ['--acp'],
      env: { MY_AGENT_TOKEN: 'fake-token' },
      idle_timeout: 900,
      usage_provider: null,
      metadata: null,
      default_permission_policy: 'ask',
      description: 'A Pueblo-managed custom agent.',
    };
    if (!this.agent(custom.id)) AGENTS.push(customSummary(custom));
    this.customDetails.set(custom.id, customDetail(custom));
    this.authByAgent.set('claude', {
      agent_id: 'claude',
      authenticated: true,
      account: 'dev@example.com',
      methods: AUTH_METHODS.claude,
    });
  }

  seed() {
    this.seedAgents();
    const hub = this.createProject('pueblo-hub', `${PROJECT_ROOT}/pueblo-hub`, {
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
      branch: `pueblo-hub/chat/${review.id}`,
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

function customSummary(input) {
  validateCustomInput(input);
  return {
    id: input.id.trim(), display_name: input.display_name?.trim() || input.id.trim(),
    source: 'pueblo_managed', availability: 'available', usage_provider: input.usage_provider ?? null,
    metadata: input.metadata ?? null, mutability: 'editable',
    display: {
      ...(input.description?.trim() ? { description: input.description.trim() } : {}),
      ...(input.display?.version ? { version: input.display.version } : {}),
    },
  };
}

/** The authenticated per-agent management detail, including launch env. */
function customDetail(input) {
  return {
    id: input.id.trim(),
    display_name: input.display_name?.trim() || input.id.trim(),
    command: input.command ?? '',
    args: Array.isArray(input.args) ? [...input.args] : [],
    env: { ...(input.env ?? {}) },
    idle_timeout: input.idle_timeout ?? 900,
    usage_provider: input.usage_provider ?? null,
    metadata: input.metadata ?? null,
    default_permission_policy: input.default_permission_policy ?? 'ask',
    description: input.description?.trim() || null,
  };
}

export function validateCustomInput(input) {
  const issues = [];
  if (!input || typeof input.id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(input.id.trim())) issues.push({ field: 'id', message: "An agent id holds letters, digits, '-', and '_' only." });
  if (!input || typeof input.command !== 'string' || !input.command.trim()) issues.push({ field: 'command', message: 'An agent needs a command.' });
  return { valid: issues.length === 0, issues };
}
