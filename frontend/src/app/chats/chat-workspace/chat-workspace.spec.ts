import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { ChatWorkspaceComponent } from './chat-workspace';
import { EventReducer } from '../../state/event-reducer';
import type { SessionEvent } from '../../core/api/types';

const chat: Chat = {
  id: 'chat-1',
  project_id: 'project-1',
  agent: 'codex',
  title: 'Initial chat',
  created_at: '2026-09-13',
  updated_at: '2026-09-13',
  archived: false,
  permission_policy: 'ask',
  config_values: {},
  process_state: 'RUNNING',
  turn_state: 'IDLE',
};

describe('ChatWorkspaceComponent', () => {
  let fixture: ComponentFixture<ChatWorkspaceComponent>;
  let state: {
    connectingChats: ReturnType<typeof signal<Set<string>>>;
    connectErrors: ReturnType<typeof signal<Record<string, string>>>;
    rejectedConfigByChat: ReturnType<typeof signal<Record<string, string>>>;
    configLoadedByChat: ReturnType<typeof signal<Record<string, boolean>>>;
    reducersByChat: ReturnType<typeof signal<Record<string, never>>>;
    configOptionsByChat: ReturnType<typeof signal<Record<string, never>>>;
    commandsByChat: ReturnType<typeof signal<Record<string, never>>>;
    modesByChat: ReturnType<typeof signal<Record<string, null>>>;
    usageByChat: ReturnType<typeof signal<Record<string, null>>>;
    historyLoadingByChat: ReturnType<typeof signal<Set<string>>>;
    historyHasOlderByChat: ReturnType<typeof signal<Record<string, boolean>>>;
    historyErrors: ReturnType<typeof signal<Record<string, string>>>;
    blockedEnvrcByChat: ReturnType<typeof signal<Record<string, { path: string; message: string }>>>;
    authorizeChatEnvironment: ReturnType<typeof vi.fn>;
    retryConnection: ReturnType<typeof vi.fn>;
    resetRejectedConfig: ReturnType<typeof vi.fn>;
    loadOlderHistory: ReturnType<typeof vi.fn>;
    retryHistory: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    state = {
      connectingChats: signal(new Set<string>()),
      connectErrors: signal<Record<string, string>>({}),
      rejectedConfigByChat: signal<Record<string, string>>({}),
      configLoadedByChat: signal({ 'chat-1': true }),
      reducersByChat: signal<Record<string, never>>({}),
      configOptionsByChat: signal<Record<string, never>>({}),
      commandsByChat: signal<Record<string, never>>({}),
      modesByChat: signal<Record<string, null>>({}),
      usageByChat: signal<Record<string, null>>({}),
      historyLoadingByChat: signal(new Set<string>()),
      historyHasOlderByChat: signal<Record<string, boolean>>({}),
      historyErrors: signal<Record<string, string>>({}),
      blockedEnvrcByChat: signal<Record<string, { path: string; message: string }>>({}),
      authorizeChatEnvironment: vi.fn(async () => undefined),
      retryConnection: vi.fn(async () => undefined),
      resetRejectedConfig: vi.fn(async () => undefined),
      loadOlderHistory: vi.fn(async () => undefined),
      retryHistory: vi.fn(async () => undefined),
    };

    const stateValue = {
      ...state,
      findChat: (id: string) => id === chat.id ? chat : null,
      chatActivity: () => 'idle',
      chatTurnStartedAt: () => null,
      setMobileDrawerOpen: vi.fn(),
      stopChatProcess: vi.fn(async () => undefined),
      cancelActiveTurn: vi.fn(async () => undefined),
      sendPrompt: vi.fn(async () => undefined),
      respondPermission: vi.fn(async () => undefined),
      setChatPolicy: vi.fn(async () => undefined),
      setChatConfig: vi.fn(async () => undefined),
      renameChat: vi.fn(async () => undefined),
      archiveChat: vi.fn(async () => undefined),
      deleteChat: vi.fn(async () => undefined),
    } as unknown as AppStateService;

    await TestBed.configureTestingModule({
      imports: [ChatWorkspaceComponent],
      providers: [
        { provide: AppStateService, useValue: stateValue },
        { provide: BreakpointObserver, useValue: { observe: () => of({ matches: false }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWorkspaceComponent);
    fixture.componentRef.setInput('chatId', 'chat-1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders a ready Material composer once configuration is loaded', () => {
    expect(fixture.nativeElement.textContent).toContain('codex connected');
    expect((fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement).disabled).toBe(false);
  });

  it('keeps composer usable and exposes retry when the connection fails', async () => {
    state.connectErrors.set({ 'chat-1': 'Agent process exited unexpectedly' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Connection failed');
    expect(fixture.nativeElement.textContent).toContain('Agent process exited unexpectedly');
    expect((fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement).disabled).toBe(false);

    const retry = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button: unknown) => (button as Element).textContent?.includes('Retry connection')) as HTMLButtonElement;
    retry.click();
    expect(state.retryConnection).toHaveBeenCalledWith('chat-1');
  });

  it('shows blocked direnv workspace environment banner and authorizes environment', async () => {
    state.connectErrors.set({ 'chat-1': 'direnv: error .envrc is blocked' });
    state.blockedEnvrcByChat.set({
      'chat-1': { path: '/repo/.envrc', message: 'direnv: error .envrc is blocked' },
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Workspace environment blocked');
    expect(fixture.nativeElement.textContent).toContain('direnv: error .envrc is blocked');

    const authButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button: unknown) => (button as Element).textContent?.includes('Authorize environment')) as HTMLButtonElement;
    expect(authButton).toBeTruthy();
    authButton.click();
    expect(state.authorizeChatEnvironment).toHaveBeenCalledWith('chat-1');
  });

  it('keeps persisted history visible when connection fails', async () => {
    const reducer = new EventReducer();
    reducer.ingest({
      seq: 1,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: '2026-09-13T12:00:00Z',
      payload: { type: 'user_message', text: 'Important existing question' },
    });
    (state.reducersByChat as ReturnType<typeof signal<Record<string, unknown>>>).set({ 'chat-1': reducer });
    state.connectErrors.set({ 'chat-1': 'Agent process exited unexpectedly' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Important existing question');
    expect(fixture.nativeElement.textContent).toContain('Connection failed');
    expect(fixture.nativeElement.textContent).toContain('Agent process exited unexpectedly');
    expect((fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement).disabled).toBe(false);
  });
});

describe('ChatWorkspaceComponent live stream', () => {
  let fixture: ComponentFixture<ChatWorkspaceComponent>;
  let reducer: EventReducer;

  const event = (seq: number, type: string, extra: Record<string, unknown> = {}): SessionEvent =>
    ({
      seq,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: '2026-09-13T12:00:00Z',
      payload: { type, ...extra },
    }) as SessionEvent;

  beforeEach(async () => {
    reducer = new EventReducer();
    const stateValue = {
      connectingChats: signal(new Set<string>()),
      connectErrors: signal<Record<string, string>>({}),
      rejectedConfigByChat: signal<Record<string, string>>({}),
      configLoadedByChat: signal({ 'chat-1': true }),
      reducersByChat: signal<Record<string, EventReducer>>({ 'chat-1': reducer }),
      configOptionsByChat: signal<Record<string, never>>({}),
      commandsByChat: signal<Record<string, never>>({}),
      modesByChat: signal<Record<string, null>>({}),
      usageByChat: signal<Record<string, null>>({}),
      historyLoadingByChat: signal(new Set<string>()),
      historyHasOlderByChat: signal<Record<string, boolean>>({}),
      historyErrors: signal<Record<string, string>>({}),
      blockedEnvrcByChat: signal<Record<string, { path: string; message: string }>>({}),
      authorizeChatEnvironment: vi.fn(async () => undefined),
      findChat: (id: string) => (id === chat.id ? chat : null),
      chatActivity: () => 'idle',
      chatTurnStartedAt: () => null,
      retryConnection: vi.fn(async () => undefined),
      resetRejectedConfig: vi.fn(async () => undefined),
      loadOlderHistory: vi.fn(async () => undefined),
      retryHistory: vi.fn(async () => undefined),
      setMobileDrawerOpen: vi.fn(),
      stopChatProcess: vi.fn(async () => undefined),
      cancelActiveTurn: vi.fn(async () => undefined),
      sendPrompt: vi.fn(async () => undefined),
      respondPermission: vi.fn(async () => undefined),
      setChatPolicy: vi.fn(async () => undefined),
      setChatConfig: vi.fn(async () => undefined),
      renameChat: vi.fn(async () => undefined),
      archiveChat: vi.fn(async () => undefined),
      deleteChat: vi.fn(async () => undefined),
    } as unknown as AppStateService;

    await TestBed.configureTestingModule({
      imports: [ChatWorkspaceComponent],
      providers: [
        { provide: AppStateService, useValue: stateValue },
        { provide: BreakpointObserver, useValue: { observe: () => of({ matches: false }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWorkspaceComponent);
    fixture.componentRef.setInput('chatId', 'chat-1');
    await fixture.whenStable();
  });

  // The reducer list and the reducer map keep their identity across a streamed
  // chunk unless the reducer rebuilds them, so this fails whenever the display
  // list is mutated in place.
  it('renders a sent message and the streamed reply without a manual redraw', async () => {
    reducer.ingest(event(1, 'user_message', { text: 'Inspect this repository' }));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Inspect this repository');

    reducer.ingest(event(2, 'message_chunk', { text: 'Reading ' }));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Reading');

    // A second chunk appends to the open turn without adding a display item.
    reducer.ingest(event(3, 'message_chunk', { text: 'the manifest.' }));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Reading the manifest.');
  });
});
