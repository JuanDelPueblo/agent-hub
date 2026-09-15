import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AgentAuthFlow } from '../../core/api/types';
import { ApiService } from '../../core/api/api.service';
import { AppStateService } from '../../state/app-state.service';
import { AuthTerminalDialogComponent } from './auth-terminal-dialog';

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  static OPEN = 1;
  readyState = 0;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  send(data: string): void {
    this.sent.push(data);
  }

  close(): void {
    this.readyState = 3;
    this.onclose?.();
  }

  open(): void {
    this.readyState = FakeWebSocket.OPEN;
    this.onopen?.();
  }

  emit(message: unknown): void {
    this.onmessage?.({ data: JSON.stringify(message) });
  }
}

const flow: AgentAuthFlow = {
  flow_id: 'flow-1',
  agent_id: 'codex',
  method_id: 'api-key',
  method_name: 'API key',
  state: 'running',
};

describe('AuthTerminalDialogComponent', () => {
  let fixture: ComponentFixture<AuthTerminalDialogComponent>;
  let api: {
    agentAuthSocketUrl: ReturnType<typeof vi.fn>;
    cancelAgentAuthFlow: ReturnType<typeof vi.fn>;
  };
  let state: { loadAgentAuth: ReturnType<typeof vi.fn> };
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let originalWebSocket: unknown;

  beforeEach(async () => {
    originalWebSocket = (globalThis as unknown as { WebSocket: unknown }).WebSocket;
    FakeWebSocket.instances = [];
    (globalThis as unknown as { WebSocket: unknown }).WebSocket = FakeWebSocket;

    api = {
      agentAuthSocketUrl: vi.fn(() => 'ws://localhost/api/agent-auth/flow-1/ws'),
      cancelAgentAuthFlow: vi.fn(async () => undefined),
    };
    state = { loadAgentAuth: vi.fn(async () => ({})) };
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AuthTerminalDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: flow },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: ApiService, useValue: api },
        { provide: AppStateService, useValue: state },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthTerminalDialogComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    (globalThis as unknown as { WebSocket: unknown }).WebSocket = originalWebSocket;
  });

  function socket(): FakeWebSocket {
    return FakeWebSocket.instances[0];
  }

  it('opens the opaque flow socket and renders streamed output', () => {
    expect(api.agentAuthSocketUrl).toHaveBeenCalledWith('flow-1');
    socket().open();
    const sent = socket().sent.map((frame) => JSON.parse(frame));
    expect(sent.some((frame) => frame.type === 'resize')).toBe(true);

    socket().emit({ type: 'output', data: 'Sign in.\n' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.terminal').textContent).toContain('Sign in.');
  });

  it('sends keyboard input and resize frames', () => {
    socket().open();
    fixture.componentInstance.onKeydown(new KeyboardEvent('keydown', { key: 'a' }));
    fixture.componentInstance.onKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    const sent = socket().sent.map((frame) => JSON.parse(frame));
    expect(sent).toEqual(expect.arrayContaining([
      { type: 'input', data: 'a' },
      { type: 'input', data: '\r' },
      { type: 'resize', cols: expect.any(Number), rows: expect.any(Number) },
    ]));
  });

  it('refreshes auth status on success instead of authenticating again', () => {
    socket().open();
    socket().emit({ type: 'state', state: 'succeeded', exit_code: 0 });
    fixture.detectChanges();
    expect(state.loadAgentAuth).toHaveBeenCalledWith('codex');
    expect(fixture.nativeElement.textContent).toContain('Authentication completed');
  });

  it('presents failure and cancellation states', () => {
    socket().open();
    socket().emit({ type: 'state', state: 'failed', exit_code: 1, error: 'rejected' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Authentication failed');
    expect(fixture.nativeElement.textContent).toContain('rejected');
  });

  it('cancels the flow explicitly before closing the dialog', async () => {
    socket().open();
    await fixture.componentInstance.cancel();
    expect(api.cancelAgentAuthFlow).toHaveBeenCalledWith('flow-1');
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('does not send client-chosen executable, args, cwd, or environment', () => {
    socket().open();
    fixture.componentInstance.onKeydown(new KeyboardEvent('keydown', { key: 'x' }));
    const frames = socket().sent.map((frame) => JSON.parse(frame));
    for (const frame of frames) {
      expect(Object.keys(frame)).not.toContain('command');
      expect(Object.keys(frame)).not.toContain('args');
      expect(Object.keys(frame)).not.toContain('cwd');
      expect(Object.keys(frame)).not.toContain('env');
    }
  });
});
