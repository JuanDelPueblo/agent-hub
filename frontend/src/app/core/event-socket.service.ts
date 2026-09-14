import { OnDestroy, Service, signal } from '@angular/core';
import { Subject } from 'rxjs';
import type { SessionEvent } from './api/types';

export type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

/** Owns only the browser transport; application meaning is handled by state. */
@Service()
export class EventSocketService implements OnDestroy {
  readonly status = signal<SocketStatus>('connecting');
  readonly events = new Subject<SessionEvent>();
  readonly replayGaps = new Subject<void>();
  readonly errorMessage = signal('');

  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;
  private fatal = false;
  private lastSequence = 0;
  private baselineEstablished = false;

  connect(): void {
    if (this.destroyed || typeof window === 'undefined' || this.socket) return;
    this.status.set('connecting');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    try {
      this.socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    } catch {
      this.socket = null;
      this.scheduleReconnect();
      return;
    }

    this.socket.addEventListener('open', () => {
      this.status.set('connected');
      this.send({
        type: 'subscribe',
        from_seq: this.baselineEstablished ? this.lastSequence + 1 : 0,
      });
    });

    this.socket.addEventListener('message', (message) => {
      try {
        const data = JSON.parse(String(message.data)) as Partial<SessionEvent> & {
          type?: string;
          error?: string;
          through_seq?: number;
        };
        if (data.type === 'stream_error' || data.type === 'replay_gap') {
          if (data.type === 'replay_gap') this.replayGaps.next();
          this.fatal = true;
          this.errorMessage.set(data.error ?? 'Durable event history could not be replayed');
          this.status.set('error');
          this.socket?.close();
          return;
        }
        if (data.type === 'subscribed') {
          if (typeof data.through_seq === 'number') {
            this.lastSequence = Math.max(this.lastSequence, data.through_seq);
            this.baselineEstablished = true;
          }
          return;
        }
        if (typeof data.seq !== 'number' || data.seq <= this.lastSequence) return;
        this.lastSequence = data.seq;
        this.events.next(data as SessionEvent);
      } catch {
        // Control frames and malformed messages cannot update application state.
      }
    });

    this.socket.addEventListener('close', () => {
      this.socket = null;
      if (!this.fatal) {
        this.status.set('disconnected');
        this.scheduleReconnect();
      }
    });

    this.socket.addEventListener('error', () => {
      this.socket?.close();
    });
  }

  send(message: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  destroy(): void {
    this.destroyed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.socket?.close();
    this.socket = null;
    this.events.complete();
    this.replayGaps.complete();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private scheduleReconnect(): void {
    if (this.destroyed || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 2000);
  }
}
