/**
 * Component tests for the chat connection workflow.
 *
 * These tests drive the real router, the real store, and the real chat view
 * over a fake HTTP backend. They assert what the user sees.
 */
import './helpers/dom.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  click,
  flush,
  httpError,
  mount,
  resetFetch,
  setFetchResponder,
  shadow,
  shadowAll,
  shadowText,
  unmount,
} from './helpers/dom.ts';
import '../src/components/chat-view.ts';
import type { ChatView } from '../src/components/chat-view.ts';
import type { ChatComposer } from '../src/components/chat-composer.ts';
import { store } from '../src/state/app-state.ts';
import { router } from '../src/router.ts';
import type { Chat, ConfigOption, Project } from '../src/api/types.ts';

const PROJECT: Project = {
  id: 'proj-1',
  name: 'Agent Hub',
  path: '/home/tony/agent-hub',
  created_at: 1,
  updated_at: 2,
  chat_count: 1,
};

function chat(overrides: Partial<Chat> = {}): Chat {
  return {
    id: 'chat-1',
    project_id: 'proj-1',
    agent: 'antigravity',
    title: 'Initial chat',
    created_at: 1,
    updated_at: 1,
    process_state: 'STOPPED',
    turn_state: 'IDLE',
    archived: false,
    permission_policy: 'ask',
    title_overridden: false,
    ...overrides,
  };
}

/** Responses that the fake backend gives. Each test changes what it needs. */
interface Backend {
  projects: Project[];
  chats: Record<string, Chat[]>;
  /** Answer of GET /api/chats/:id/config. */
  config: () => unknown;
  /** Answer of POST /api/chats/:id/resume. */
  resume: (chatId: string) => unknown;
  configRequests: number;
}

let backend: Backend;

function installBackend() {
  backend = {
    projects: [PROJECT],
    chats: { 'proj-1': [chat()] },
    config: () => [] as ConfigOption[],
    resume: (chatId: string) => {
      const found = backend.chats['proj-1'].find((c) => c.id === chatId)!;
      const running = { ...found, process_state: 'RUNNING' as const };
      backend.chats['proj-1'] = backend.chats['proj-1'].map((c) =>
        c.id === chatId ? running : c
      );
      return running;
    },
    configRequests: 0,
  };

  setFetchResponder((req) => {
    const url = new URL(req.url, 'http://localhost:8765');
    const parts = url.pathname.split('/').filter(Boolean);

    if (url.pathname === '/api/projects') return backend.projects;
    if (url.pathname === '/api/agents') return ['antigravity', 'codex'];
    if (parts[1] === 'projects' && parts[3] === 'chats') {
      return backend.chats[parts[2]] || [];
    }
    if (parts[1] === 'chats' && parts[3] === 'resume') {
      return backend.resume(parts[2]);
    }
    if (parts[1] === 'chats' && parts[3] === 'config') {
      backend.configRequests++;
      return backend.config();
    }
    if (parts[1] === 'chats' && parts[3] === 'prompt') return { success: true };
    if (parts[1] === 'chats' && parts.length === 3 && req.method === 'PATCH') {
      const edit = JSON.parse(req.body || '{}');
      for (const projectId of Object.keys(backend.chats)) {
        const found = backend.chats[projectId].find((c) => c.id === parts[2]);
        if (found) return { ...found, ...edit };
      }
    }
    return [];
  });
}

/** Clear the store between tests. The store is a module singleton. */
function resetStore() {
  store.chatsByProject = {};
  store.configOptionsByChat = {};
  store.configLoadedByChat = {};
  store.connectErrors = {};
  store.connectingChats.clear();
  store.reducersByChat = {};
  store.activeProjectId = null;
  store.activeChatId = null;
}

const mounted: HTMLElement[] = [];

/** Open a chat the way the shell does, then render the view for it. */
async function openChat(chatId = 'chat-1'): Promise<ChatView> {
  // The router ignores a navigation to the path it already shows.
  router.navigate('/');
  await flush(undefined, 1);
  router.navigate(`/projects/proj-1/chats/${chatId}`);
  await flush(undefined, 6);
  const view = await mount<ChatView>('chat-view');
  mounted.push(view);
  view.chatId = chatId;
  await flush(view, 4);
  return view;
}

function composerOf(view: ChatView): ChatComposer {
  const composer = shadow<ChatComposer>(view, 'chat-composer');
  assert.ok(composer, 'the composer is rendered');
  return composer;
}

/** True when the user cannot type a prompt. */
function composerIsLocked(view: ChatView): boolean {
  const composer = composerOf(view);
  const textarea = shadow<HTMLTextAreaElement>(composer, 'textarea');
  assert.ok(textarea, 'the composer has a text area');
  return composer.disabled === true || textarea.disabled === true;
}

function retryButton(view: ChatView): HTMLElement | undefined {
  return shadowAll<HTMLElement>(view, 'md-filled-button').find((b) =>
    b.textContent?.includes('Retry')
  );
}

describe('Chat connection and config gating', () => {
  beforeEach(() => {
    installBackend();
    resetStore();
  });

  afterEach(() => {
    while (mounted.length) unmount(mounted.pop()!);
    resetStore();
    resetFetch();
  });

  it('opens the composer when the agent advertises no options', async () => {
    backend.config = () => [];
    const view = await openChat();

    assert.equal(store.configLoadedByChat['chat-1'], true);
    assert.equal(composerIsLocked(view), false, 'the composer must be usable');
    assert.equal(retryButton(view), undefined, 'no retry is offered');
  });

  it('opens the composer when the agent advertises options', async () => {
    backend.config = () => [
      {
        id: 'mode',
        name: 'Mode',
        type: 'select',
        current_value: 'code',
        options: [{ value: 'code', label: 'Code' }],
      },
    ];
    const view = await openChat();

    assert.equal(composerIsLocked(view), false);
    assert.equal(store.configOptionsByChat['chat-1']?.length, 1);
  });

  it('locks the composer and offers Retry when the config request fails', async () => {
    backend.config = () => httpError(500, 'ACP agent did not answer the config request');
    const view = await openChat();

    // The process runs, but the config never arrived.
    assert.equal(store.findChat('chat-1')?.process_state, 'RUNNING');
    assert.notEqual(
      store.configLoadedByChat['chat-1'],
      true,
      'a failed request must not count as loaded'
    );
    assert.deepEqual(
      store.configOptionsByChat['chat-1'],
      undefined,
      'the store must not claim an empty option list'
    );

    assert.equal(
      composerIsLocked(view),
      true,
      'the composer must stay unavailable after a config failure'
    );
    assert.ok(retryButton(view), 'the view must offer Retry');
    assert.match(shadowText(view), /ACP agent did not answer the config request/);
  });

  it('opens the composer after Retry succeeds', async () => {
    backend.config = () => httpError(500, 'Agent busy');
    const view = await openChat();
    assert.equal(composerIsLocked(view), true);

    backend.config = () => [];
    click(retryButton(view)!);
    await flush(view, 6);

    assert.equal(store.configLoadedByChat['chat-1'], true);
    assert.equal(composerIsLocked(view), false, 'Retry must open the composer');
    assert.equal(retryButton(view), undefined);
  });

  it('locks the composer while the agent starts', async () => {
    let release: (() => void) | null = null;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const originalResume = backend.resume;
    backend.resume = async (chatId: string) => {
      await gate;
      return originalResume(chatId);
    };

    const view = await openChat();
    assert.equal(composerIsLocked(view), true, 'the composer waits for the agent');
    assert.match(shadowText(view), /Connecting to antigravity/);

    release!();
    await flush(view, 6);

    assert.equal(composerIsLocked(view), false);
  });

  it('loads the config of an already running chat without resuming it', async () => {
    backend.chats['proj-1'] = [chat({ process_state: 'RUNNING' })];
    // A resume request fails while a turn is active, so it must not be sent.
    backend.resume = () => httpError(400, 'Chat is busy');

    const view = await openChat();

    assert.equal(backend.configRequests, 1);
    assert.equal(composerIsLocked(view), false);
    assert.equal(store.connectErrors['chat-1'], undefined);
  });

  it('retries only the config request for an already running chat', async () => {
    backend.chats['proj-1'] = [chat({ process_state: 'RUNNING' })];
    backend.resume = () => httpError(400, 'Chat is busy');
    backend.config = () => httpError(500, 'Agent busy');

    const view = await openChat();
    assert.equal(composerIsLocked(view), true);
    assert.match(shadowText(view), /Agent busy/);

    backend.config = () => [];
    click(retryButton(view)!);
    await flush(view, 6);

    assert.equal(composerIsLocked(view), false, 'Retry must not resume the chat');
    assert.equal(backend.configRequests, 2);
  });

  it('reports a failed agent start and keeps the composer locked', async () => {
    backend.resume = () => httpError(500, 'agy_acp_server.par exited with code 1');
    const view = await openChat();

    assert.equal(composerIsLocked(view), true);
    assert.match(shadowText(view), /agy_acp_server.par exited with code 1/);
    assert.ok(retryButton(view));
  });
});

describe('Connection state and the active project', () => {
  beforeEach(() => {
    installBackend();
    resetStore();
    backend.projects = [PROJECT, { ...PROJECT, id: 'proj-2', name: 'Notes' }];
    backend.chats['proj-2'] = [
      chat({ id: 'chat-2', project_id: 'proj-2', agent: 'codex' }),
    ];
  });

  afterEach(() => {
    while (mounted.length) unmount(mounted.pop()!);
    resetStore();
    resetFetch();
  });

  it('applies the connection result to the chat that started it', async () => {
    await store.loadProjects();
    await store.loadChats('proj-1');
    await store.loadChats('proj-2');

    // The agent takes a long time to start.
    let release: (() => void) | null = null;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const originalResume = backend.resume;
    backend.resume = async (chatId: string) => {
      await gate;
      return originalResume(chatId);
    };

    store.activeProjectId = 'proj-1';
    const connection = store.connectChat('chat-1');

    // The user navigates to another project while the agent starts.
    router.navigate('/projects/proj-2');
    await flush(undefined, 3);
    assert.equal(store.activeProjectId, 'proj-2');

    release!();
    await connection;

    assert.equal(
      store.chatsByProject['proj-1'].find((c) => c.id === 'chat-1')?.process_state,
      'RUNNING',
      'the original chat must receive its connection result'
    );
    assert.equal(store.configLoadedByChat['chat-1'], true);
  });

  it('reports a connection failure on the chat that started it', async () => {
    await store.loadProjects();
    await store.loadChats('proj-1');
    await store.loadChats('proj-2');

    let release: (() => void) | null = null;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    backend.resume = async () => {
      await gate;
      return httpError(500, 'agent start failed');
    };

    store.activeProjectId = 'proj-1';
    const connection = store.connectChat('chat-1').catch(() => {});

    router.navigate('/projects/proj-2');
    await flush(undefined, 3);

    release!();
    await connection;

    assert.equal(store.connectErrors['chat-1'], 'agent start failed');
    assert.equal(
      store.chatsByProject['proj-1'].find((c) => c.id === 'chat-1')?.process_state,
      'STOPPED'
    );
  });

  it('updates a chat by id in every loaded project', async () => {
    await store.loadProjects();
    await store.loadChats('proj-1');
    await store.loadChats('proj-2');

    store.activeProjectId = 'proj-2';
    await store.renameChat('chat-1', 'Renamed elsewhere');

    assert.equal(
      store.chatsByProject['proj-1'].find((c) => c.id === 'chat-1')?.title,
      'Renamed elsewhere'
    );
  });
});
