import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, ApiService } from '../core/api/api.service';
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
    clearSavedConfig: ReturnType<typeof vi.fn>;
    deleteChat: ReturnType<typeof vi.fn>;
    promptChat: ReturnType<typeof vi.fn>;
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
      clearSavedConfig: vi.fn(async () => undefined),
      deleteChat: vi.fn(async () => undefined),
      promptChat: vi.fn(async () => undefined),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: api }],
    });
    store = TestBed.inject(ChatSessionStore);
  });

  it('deduplicates concurrent chat loads and runtime config initialization', async () => {
    const firstLoad = store.loadChats('project-1');
    const secondLoad = store.loadChats('project-1');
    expect(secondLoad).toBe(firstLoad);
    await firstLoad;

    const firstConfig = store.loadChatConfig('chat-1');
    const secondConfig = store.loadChatConfig('chat-1');
    expect(secondConfig).toBe(firstConfig);
    await firstConfig;

    expect(api.fetchChats).toHaveBeenCalledOnce();
    expect(api.fetchChatConfig).toHaveBeenCalledOnce();
    expect(store.configLoadedByChat()['chat-1']).toBe(true);
  });

  it('treats process state as diagnostic only and allows sending prompts while stopped', async () => {
    const stoppedChat: Chat = { ...chat, process_state: 'STOPPED', turn_state: 'IDLE' };
    store.chatsByProject.set({ 'project-1': [stoppedChat] });

    await store.sendPrompt('chat-1', 'Hello agent');

    expect(api.promptChat).toHaveBeenCalledWith('chat-1', 'Hello agent');
    expect(api.resumeChat).not.toHaveBeenCalled();
    expect(store.findChat('chat-1')?.turn_state).toBe('PROMPTING');
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

  it('maps a rejected saved model to the explicit reset path', async () => {
    store.chatsByProject.set({ 'project-1': [chat] });
    api.fetchChatConfig.mockRejectedValueOnce(
      new ApiError(409, 'Saved ACP option model could not be reapplied', 'saved_config_rejected', {
        option_id: 'model',
      }),
    );

    await expect(store.loadChatConfig('chat-1')).rejects.toThrow();
    expect(store.connectErrors()['chat-1']).toContain('could not be reapplied');
    expect(store.rejectedConfigByChat()['chat-1']).toBe('model');
  });

  it('keeps a transient config-application failure on the retry path', async () => {
    store.chatsByProject.set({ 'project-1': [chat] });
    api.fetchChatConfig.mockRejectedValueOnce(
      new ApiError(400, 'Failed to reapply saved ACP option model; retry to reconnect'),
    );

    await expect(store.loadChatConfig('chat-1')).rejects.toThrow();
    expect(store.connectErrors()['chat-1']).toContain('retry to reconnect');
    expect(store.rejectedConfigByChat()['chat-1']).toBeUndefined();
  });

  it('reset deletes only the explicitly rejected option then retries config initialization', async () => {
    store.chatsByProject.set({ 'project-1': [chat] });
    store.rejectedConfigByChat.set({ 'chat-1': 'model' });

    await store.resetRejectedConfig('chat-1');

    expect(api.clearSavedConfig).toHaveBeenCalledWith('chat-1', 'model');
    expect(store.rejectedConfigByChat()['chat-1']).toBeUndefined();
    expect(api.fetchChatConfig).toHaveBeenCalledWith('chat-1');
  });

  it('deleting a chat also deletes its stale rejected-config entry', async () => {
    store.chatsByProject.set({ 'project-1': [chat] });
    store.rejectedConfigByChat.set({ 'chat-1': 'model' });
    store.connectErrors.set({ 'chat-1': 'Saved ACP option model could not be reapplied' });

    await store.deleteChat('chat-1');

    expect(store.findChat('chat-1')).toBeNull();
    expect(store.rejectedConfigByChat()['chat-1']).toBeUndefined();
    expect(store.connectErrors()['chat-1']).toBeUndefined();
  });
});
