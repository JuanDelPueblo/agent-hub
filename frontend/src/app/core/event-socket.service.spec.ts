import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import type { SessionEvent } from './api/types';
import { EventSocketService } from './event-socket.service';

type FakeListener = (event: { data?: string }) => void;

class FakeWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  static instances: FakeWebSocket[] = [];

  readonly sent: string[] = [];
  readonly url: string;
  readyState = FakeWebSocket.CONNECTING;
  private readonly listeners = new Map<string, Set<FakeListener>>();

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  addEventListener(type: string, listener: FakeListener): void {
    const listeners = this.listeners.get(type) ?? new Set<FakeListener>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  send(value: string): void {
    this.sent.push(value);
  }

  close(): void {
    this.readyState = FakeWebSocket.CLOSED;
    this.emit('close');
  }

  open(): void {
    this.readyState = FakeWebSocket.OPEN;
    this.emit('open');
  }

  message(data: string): void {
    this.emit('message', { data });
  }

  private emit(type: string, event: { data?: string } = {}): void {
    for (const listener of this.listeners.get(type) ?? []) listener(event);
  }
}

const sessionEvent = (seq: number): SessionEvent => ({
  seq,
  session_id: 'chat-1',
  agent: 'codex',
  timestamp: '2026-09-13T12:00:00Z',
  payload: { type: 'user_message', text: `message ${seq}` },
});

describe('EventSocketService', () => {
  const originalWebSocket = globalThis.WebSocket;

  beforeEach(() => {
    FakeWebSocket.instances.length = 0;
    (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket =
      FakeWebSocket as unknown as typeof WebSocket;
  });

  afterEach(() => {
    vi.useRealTimers();
    (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket = originalWebSocket;
  });

  it('subscribes, decodes events, and drops replay duplicates', () => {
    const service = new EventSocketService();
    const received: SessionEvent[] = [];
    service.events.subscribe((event) => received.push(event));

    service.connect();
    const socket = FakeWebSocket.instances[0];
    expect(socket.url).toContain('/ws');
    socket.open();

    expect(service.status()).toBe('connected');
    expect(socket.sent).toEqual([JSON.stringify({ type: 'subscribe', from_seq: 0 })]);

    socket.message(JSON.stringify(sessionEvent(1)));
    socket.message(JSON.stringify(sessionEvent(1)));
    socket.message(JSON.stringify(sessionEvent(2)));
    socket.message(JSON.stringify({ type: 'subscribed' }));

    expect(received.map((event) => event.seq)).toEqual([1, 2]);
    service.destroy();
  });

  it('resumes from the last event sequence after reconnecting', () => {
    vi.useFakeTimers();
    const service = new EventSocketService();
    service.connect();
    const firstSocket = FakeWebSocket.instances[0];
    firstSocket.open();
    firstSocket.message(JSON.stringify(sessionEvent(7)));
    firstSocket.close();

    vi.advanceTimersByTime(2000);
    const secondSocket = FakeWebSocket.instances[1];
    expect(secondSocket).toBeDefined();
    secondSocket.open();
    expect(secondSocket.sent).toEqual([JSON.stringify({ type: 'subscribe', from_seq: 8 })]);

    service.destroy();
    expect(FakeWebSocket.instances).toHaveLength(2);
  });
});
