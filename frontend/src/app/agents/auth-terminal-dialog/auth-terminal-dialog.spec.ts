import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../../core/api/api.service';
import { AppStateService } from '../../state/app-state.service';
import { AuthTerminalDialogComponent, type AuthTerminalDialogData } from './auth-terminal-dialog';

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

const dialogData: AuthTerminalDialogData = {
  flow: {
    flow_id: 'flow-1',
    agent_id: 'codex',
    method_id: 'api-key',
    state: 'running',
  },
  method: {
    id: 'api-key',
    name: 'API key',
    type: 'terminal',
    supported: true,
  },
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
  let origMatchMedia: unknown;
  let origRaf: unknown;
  let origCaf: unknown;

  beforeEach(async () => {
    originalWebSocket = (globalThis as unknown as { WebSocket: unknown }).WebSocket;
    FakeWebSocket.instances = [];
    (globalThis as unknown as { WebSocket: unknown }).WebSocket = FakeWebSocket;

    origMatchMedia = (window as unknown as { matchMedia?: unknown }).matchMedia;
    origRaf = (window as unknown as { requestAnimationFrame?: unknown }).requestAnimationFrame;
    origCaf = (window as unknown as { cancelAnimationFrame?: unknown }).cancelAnimationFrame;

    window.matchMedia = window.matchMedia || ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.requestAnimationFrame = window.requestAnimationFrame || ((cb: FrameRequestCallback) => setTimeout(cb, 0));
    window.cancelAnimationFrame = window.cancelAnimationFrame || ((id: number) => clearTimeout(id));

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get() {
        if (this.classList?.contains('xterm-char-measure-element')) return 32 * 8;
        return 640;
      },
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get() {
        if (this.classList?.contains('xterm-char-measure-element')) return 16;
        return 384;
      },
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      get() {
        return this.offsetWidth;
      },
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      get() {
        return this.offsetHeight;
      },
      configurable: true,
    });

    api = {
      agentAuthSocketUrl: vi.fn(() => 'ws://localhost/api/agent-auth/flow-1/ws'),
      cancelAgentAuthFlow: vi.fn(async () => undefined),
    };
    state = { loadAgentAuth: vi.fn(async () => ({})) };
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AuthTerminalDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
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

    if (origMatchMedia) (window as unknown as { matchMedia?: unknown }).matchMedia = origMatchMedia;
    else delete (window as unknown as { matchMedia?: unknown }).matchMedia;

    if (origRaf) (window as unknown as { requestAnimationFrame?: unknown }).requestAnimationFrame = origRaf;
    else delete (window as unknown as { requestAnimationFrame?: unknown }).requestAnimationFrame;

    if (origCaf) (window as unknown as { cancelAnimationFrame?: unknown }).cancelAnimationFrame = origCaf;
    else delete (window as unknown as { cancelAnimationFrame?: unknown }).cancelAnimationFrame;

    delete (HTMLElement.prototype as unknown as { offsetWidth?: unknown }).offsetWidth;
    delete (HTMLElement.prototype as unknown as { offsetHeight?: unknown }).offsetHeight;
    delete (HTMLElement.prototype as unknown as { clientWidth?: unknown }).clientWidth;
    delete (HTMLElement.prototype as unknown as { clientHeight?: unknown }).clientHeight;
  });

  function socket(): FakeWebSocket {
    return FakeWebSocket.instances[0];
  }

  it('opens the opaque flow socket, renders method name, and initializes terminal with usable dimensions', () => {
    expect(api.agentAuthSocketUrl).toHaveBeenCalledWith('flow-1');
    expect(fixture.nativeElement.textContent).toContain('API key');

    const term = fixture.componentInstance.term;
    expect(term).toBeDefined();
    expect(term!.cols).toBeGreaterThanOrEqual(20);
    expect(term!.rows).toBeGreaterThanOrEqual(6);

    const terminalEl = fixture.nativeElement.querySelector('.terminal') as HTMLElement;
    expect(terminalEl).toBeTruthy();
    const screen = terminalEl.querySelector('.xterm-screen') as HTMLElement;
    const viewport = terminalEl.querySelector('.xterm-viewport') as HTMLElement;
    expect(screen).toBeTruthy();
    expect(viewport).toBeTruthy();

    const screenWidth = parseInt(screen.style.width, 10) || screen.clientWidth;
    const screenHeight = parseInt(screen.style.height, 10) || screen.clientHeight;
    expect(screenWidth).toBeGreaterThan(0);
    expect(screenHeight).toBeGreaterThan(0);
    expect(viewport.clientWidth).toBeGreaterThan(0);
    expect(viewport.clientHeight).toBeGreaterThan(0);

    socket().open();
    const sent = socket().sent.map((frame) => JSON.parse(frame));
    expect(sent.some((frame) => frame.type === 'resize' && frame.cols > 0 && frame.rows > 0)).toBe(true);

    const writeSpy = vi.spyOn(term!, 'write');
    socket().emit({ type: 'output', data: 'Sign in.\n' });
    expect(writeSpy).toHaveBeenCalledWith('Sign in.\n');
  });

  it('sends input and resize frames', () => {
    socket().open();
    fixture.componentInstance.send({ type: 'input', data: 'a' });
    fixture.componentInstance.send({ type: 'input', data: '\r' });
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

  it('presents failure, timeout, and cancellation states with reasons', () => {
    socket().open();
    socket().emit({ type: 'state', state: 'failed', exit_code: 1, reason: 'rejected' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Authentication failed');
    expect(fixture.nativeElement.textContent).toContain('rejected');

    socket().emit({ type: 'state', state: 'timed_out', reason: 'flow timed out' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Authentication timed out');
    expect(fixture.nativeElement.textContent).toContain('flow timed out');

    socket().emit({ type: 'state', state: 'cancelled', reason: 'cancelled by user' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Authentication was cancelled');
    expect(fixture.nativeElement.textContent).toContain('cancelled by user');
  });

  it('cancels the flow explicitly before closing the dialog', async () => {
    socket().open();
    await fixture.componentInstance.cancel();
    expect(api.cancelAgentAuthFlow).toHaveBeenCalledWith('flow-1');
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('does not send client-chosen executable, args, cwd, or environment', () => {
    socket().open();
    fixture.componentInstance.send({ type: 'input', data: 'x' });
    const frames = socket().sent.map((frame) => JSON.parse(frame));
    for (const frame of frames) {
      expect(Object.keys(frame)).not.toContain('command');
      expect(Object.keys(frame)).not.toContain('args');
      expect(Object.keys(frame)).not.toContain('cwd');
      expect(Object.keys(frame)).not.toContain('env');
    }
  });
});
