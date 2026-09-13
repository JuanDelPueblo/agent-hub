import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../core/api/api.service';
import type { Chat, SessionEvent } from '../core/api/types';
import { ChatSessionStore } from './chat-session.store';

describe('ChatSessionStore', () => {
  const chat: Chat = {
    id: 'chat-1',
    project_id: 'project-1',
    agent: 'codex',
    title: 'Test chat',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    archived: false,
    permission_policy: 'ask',
    config_values: {},
    process_state: 'STOPPED',
    turn_state: 'IDLE',
  };

  let store: ChatSessionStore;
  let api: {
    fetchChats: ReturnType<typeof vi.fn>;
    resumeChat: ReturnType<typeof vi.fn>;
    fetchChatConfig: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    api = {
      fetchChats: vi.fn(async () => [chat]),
      resumeChat: vi.fn(async () => ({ ...chat, process_state: 'RUNNING' })),
      fetchChatConfig: vi.fn(async () => [
        {
          id: 'model',
          name: 'Model',
          type: 'select',
          currentValue: 'gpt-5',
          options: [{ value: 'gpt-5', name: 'GPT-5' }],
        },
      ]),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: api }],
    });
    store = TestBed.inject(ChatSessionStore);
  });

  it('deduplicates concurrent chat loads and connections', async () => {
    const firstLoad = store.loadChats('project-1');
    const secondLoad = store.loadChats('project-1');
    expect(secondLoad).toBe(firstLoad);
    await firstLoad;

    const firstConnection = store.connectChat('chat-1');
    const secondConnection = store.connectChat('chat-1');
    expect(secondConnection).toBe(firstConnection);
    await firstConnection;

    expect(api.fetchChats).toHaveBeenCalledOnce();
    expect(api.resumeChat).toHaveBeenCalledOnce();
    expect(api.fetchChatConfig).toHaveBeenCalledOnce();
    expect(store.findChat('chat-1')?.process_state).toBe('RUNNING');
    expect(store.configLoadedByChat()['chat-1']).toBe(true);
  });

  it('reduces streamed entries and process changes into chat-owned state', () => {
    store.chatsByProject.set({ 'project-1': [chat] });
    const event = (seq: number, payload: SessionEvent['payload']): SessionEvent => ({
      seq,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: `2026-01-01T00:00:0${seq}Z`,
      payload,
    });

    store.handleIncomingEvent(event(1, {
      type: 'permission_request',
      id: 'permission-1',
      method: 'terminal/run_command',
      description: 'Run tests',
    }));
    store.handleIncomingEvent(event(2, {
      type: 'state_change',
      process: 'RUNNING',
      turn: 'PROMPTING',
    }));

    expect(store.reducersByChat()['chat-1'].items()[0]).toMatchObject({ type: 'turn' });
    expect(store.findChat('chat-1')).toMatchObject({
      process_state: 'RUNNING',
      turn_state: 'PROMPTING',
    });
  });
});
