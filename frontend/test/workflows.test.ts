import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock global fetch for Node test runner before importing application code
globalThis.fetch = async (input: RequestInfo | URL, _init?: RequestInit) => {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

import { AppStore } from '../src/state/app-state.ts';
import { api } from '../src/api/client.ts';
import { router } from '../src/router.ts';
import type { Project, Chat, SessionEvent, ConfigOption } from '../src/api/types.ts';

describe('Hub Frontend Workflows', () => {
  let mockProjects: Project[];
  let mockChats: Record<string, Chat[]>;
  let resumeCallCount: number;
  let respondedPermissions: Array<{ chatId: string; requestId: string; granted: boolean }>;

  beforeEach(() => {
    resumeCallCount = 0;
    respondedPermissions = [];

    mockProjects = [
      {
        id: 'proj-1',
        name: 'Agent Hub',
        path: '/workspace/agent-hub',
        created_at: 1000,
        updated_at: 2000,
        chat_count: 1,
      },
    ];

    mockChats = {
      'proj-1': [
        {
          id: 'chat-1',
          project_id: 'proj-1',
          agent: 'codex',
          title: 'Initial chat',
          created_at: 1000,
          updated_at: 1000,
          process_state: 'STOPPED',
          turn_state: 'IDLE',
          archived: false,
          permission_policy: 'ask',
          title_overridden: false,
        },
      ],
    };

    // Stub API methods
    api.fetchProjects = async () => [...mockProjects];
    api.fetchAgents = async () => ['codex', 'claude', 'opencode', 'antigravity'];
    api.fetchChats = async (projectId: string) => [...(mockChats[projectId] || [])];
    api.createProject = async (name: string, path: string) => {
      const p: Project = {
        id: `proj-${Date.now()}`,
        name,
        path,
        created_at: Date.now(),
        updated_at: Date.now(),
        chat_count: 0,
      };
      mockProjects.push(p);
      return p;
    };
    api.editProject = async (id: string, name: string, path: string) => {
      const p = mockProjects.find((x) => x.id === id);
      if (!p) throw new Error('Not found');
      if (name) p.name = name;
      if (path) p.path = path;
      return { ...p };
    };
    api.deleteProject = async (id: string) => {
      mockProjects = mockProjects.filter((x) => x.id !== id);
      delete mockChats[id];
    };
    api.createChat = async (projectId: string, agent: string) => {
      const c: Chat = {
        id: `chat-${Date.now()}`,
        project_id: projectId,
        agent,
        title: 'New chat',
        created_at: Date.now(),
        updated_at: Date.now(),
        process_state: 'STOPPED',
        turn_state: 'IDLE',
        archived: false,
        permission_policy: 'ask',
        title_overridden: false,
      };
      if (!mockChats[projectId]) mockChats[projectId] = [];
      mockChats[projectId].push(c);
      return c;
    };
    api.resumeChat = async (chatId: string) => {
      resumeCallCount++;
      for (const chats of Object.values(mockChats)) {
        const c = chats.find((x) => x.id === chatId);
        if (c) {
          c.process_state = 'RUNNING';
          return c;
        }
      }
      throw new Error('Chat not found');
    };
    api.fetchConfig = async (_chatId: string) => [];
    api.respondPermission = async (chatId: string, requestId: string, granted: boolean) => {
      respondedPermissions.push({ chatId, requestId, granted });
    };
  });

  it('handles project creation, editing, and deletion lifecycle', async () => {
    const store = new AppStore();
    await store.loadProjects();
    assert.equal(store.projects.length, 1);
    assert.equal(store.projects[0].chat_count, 1);

    // Create project
    const newProj = await store.createProject('New Subproject', '/workspace/sub');
    assert.equal(newProj.name, 'New Subproject');
    assert.equal(store.projects.length, 2);
    assert.equal(newProj.chat_count, 0);

    // Navigate to project
    router.navigate(`/projects/${newProj.id}`);
    assert.equal(store.activeProjectId, newProj.id);
    assert.equal(store.activeProject?.name, 'New Subproject');

    // Edit project
    const edited = await store.editProject(newProj.id, 'Renamed Subproject', '/workspace/sub');
    assert.equal(edited.name, 'Renamed Subproject');
    assert.equal(store.activeProject?.name, 'Renamed Subproject');

    // Delete project
    await store.deleteProject(newProj.id);
    assert.equal(store.projects.length, 1);
    assert.equal(store.activeProjectId, null);
    assert.equal(router.currentRoute.name, 'home');
  });

  it('creates new chat without requiring title input and navigates to it', async () => {
    const store = new AppStore();
    await store.loadProjects();

    // Chat created with agent name only, title defaulted to "New chat"
    const newChat = await store.createChat('proj-1', 'claude');
    assert.ok(newChat.id);
    assert.equal(newChat.agent, 'claude');
    assert.equal(newChat.title, 'New chat');

    // Verify chat was stored under project and project chat count incremented
    assert.ok(store.chatsByProject['proj-1'].some((c) => c.id === newChat.id));
    assert.equal(store.projects.find((p) => p.id === 'proj-1')?.chat_count, 2);

    // Navigating to chat sets activeProjectId and activeChatId
    router.navigate(`/projects/proj-1/chats/${newChat.id}`);
    assert.equal(store.activeProjectId, 'proj-1');
    assert.equal(store.activeChatId, newChat.id);
    assert.equal(store.activeChat?.id, newChat.id);
  });

  it('deduplicates simultaneous auto-connect requests on ACP startup', async () => {
    const store = new AppStore();
    await store.loadProjects();
    await store.loadChats('proj-1');

    // Initial state: STOPPED
    const chat = store.chatsByProject['proj-1'][0];
    assert.equal(chat.process_state, 'STOPPED');

    // Simultaneous calls to connectChat
    const p1 = store.connectChat('chat-1');
    const p2 = store.connectChat('chat-1');
    assert.strictEqual(p1, p2, 'Simultaneous connections should return identical in-flight promise');

    await Promise.all([p1, p2]);
    assert.equal(resumeCallCount, 1, 'api.resumeChat should only be invoked once');
  });

  it('updates config options and enables composer when ACP starts', async () => {
    const store = new AppStore();
    await store.loadProjects();
    await store.loadChats('proj-1');
    router.navigate('/projects/proj-1/chats/chat-1');

    // Dispatch config_options event
    const configEvent: SessionEvent = {
      seq: 1,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: new Date().toISOString(),
      payload: {
        type: 'config_options',
        options: [
          {
            id: 'mode',
            name: 'Mode',
            type: 'select',
            current_value: 'code',
            options: [{ value: 'code', label: 'Code' }, { value: 'architect', label: 'Architect' }],
          },
        ],
      },
    };

    (store as any).handleIncomingEvent(configEvent);
    assert.equal(store.configOptionsByChat['chat-1']?.length, 1);
    assert.equal(store.configOptionsByChat['chat-1'][0].id, 'mode');

    // Dispatch state_change event (RUNNING, IDLE)
    const stateEvent: SessionEvent = {
      seq: 2,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: new Date().toISOString(),
      payload: {
        type: 'state_change',
        process: 'RUNNING',
        turn: 'IDLE',
      },
    };

    (store as any).handleIncomingEvent(stateEvent);
    assert.equal(store.activeChat?.process_state, 'RUNNING');
    assert.equal(store.activeChat?.turn_state, 'IDLE');
  });

  it('handles permission requests with Allow/Deny and non-optimistic reducer resolution', async () => {
    const store = new AppStore();
    await store.loadProjects();
    await store.loadChats('proj-1');
    router.navigate('/projects/proj-1/chats/chat-1');

    // Agent requests permission
    const reqEvent: SessionEvent = {
      seq: 1,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: new Date().toISOString(),
      payload: {
        type: 'permission_request',
        id: 'perm-99',
        method: 'execute_command',
        description: 'Run cargo test',
      },
    };
    (store as any).handleIncomingEvent(reqEvent);

    const reducer = store.activeReducer;
    assert.equal(reducer.items.length, 1);
    const turn = reducer.items[0];
    assert.equal(turn.type, 'turn');
    if (turn.type === 'turn') {
      assert.equal(turn.entries.length, 1);
      const permEntry = turn.entries[0];
      assert.equal(permEntry.type, 'permission_request');
      if (permEntry.type === 'permission_request') {
        assert.equal(permEntry.requestId, 'perm-99');
        assert.equal(permEntry.method, 'execute_command');
        assert.equal(permEntry.responded, false);
      }
    }

    // User clicks Allow -> calls respondPermission with { id: 'perm-99', granted: true }
    await store.respondPermission('chat-1', 'perm-99', true);
    assert.equal(respondedPermissions.length, 1);
    assert.deepEqual(respondedPermissions[0], {
      chatId: 'chat-1',
      requestId: 'perm-99',
      granted: true,
    });

    // Verification of non-optimistic update: permission entry must NOT be marked responded yet
    if (turn.type === 'turn' && turn.entries[0].type === 'permission_request') {
      assert.equal(turn.entries[0].responded, false, 'Should not be optimistically responded before server confirmation');
    }

    // Server sends permission_response event with { id: 'perm-99', granted: true }
    const resEvent: SessionEvent = {
      seq: 2,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: new Date().toISOString(),
      payload: {
        type: 'permission_response',
        id: 'perm-99',
        granted: true,
      },
    };
    (store as any).handleIncomingEvent(resEvent);

    // Now verified as responded
    if (turn.type === 'turn' && turn.entries[0].type === 'permission_request') {
      assert.equal(turn.entries[0].responded, true);
      assert.equal(turn.entries[0].decision, 'Allowed');
    }
  });

  it('updates chat title dynamically across views when metadata_changed arrives', async () => {
    const store = new AppStore();
    await store.loadProjects();
    await store.loadChats('proj-1');
    router.navigate('/projects/proj-1/chats/chat-1');

    assert.equal(store.activeChat?.title, 'Initial chat');

    // Simulate backend updating chat title in database
    mockChats['proj-1'][0].title = 'Generated Smart Title from ACP';

    // Incoming metadata_changed event
    const metaEvent: SessionEvent = {
      seq: 3,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: new Date().toISOString(),
      payload: {
        type: 'metadata_changed',
      },
    };

    (store as any).handleIncomingEvent(metaEvent);

    // Give microtasks a tick to complete
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(store.activeChat?.title, 'Generated Smart Title from ACP');
    assert.equal(store.chatsByProject['proj-1'][0].title, 'Generated Smart Title from ACP');
  });

  it('manages mobile drawer state and backdrop interactions', () => {
    const store = new AppStore();
    assert.equal(store.isMobileDrawerOpen, false);

    store.isMobileDrawerOpen = true;
    assert.equal(store.isMobileDrawerOpen, true);

    // Simulate backdrop click
    store.isMobileDrawerOpen = false;
    assert.equal(store.isMobileDrawerOpen, false);
  });
});
