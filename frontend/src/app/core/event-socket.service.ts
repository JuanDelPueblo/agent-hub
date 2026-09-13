import { Injectable, OnDestroy, signal } from '@angular/core';
import { Subject } from 'rxjs';
import type { SessionEvent } from './api/types';

export type SocketStatus = 'connecting' | 'connected' | 'disconnected';

/** Owns only the browser transport; application meaning is handled by state. */
@Injectable({ providedIn: 'root' })
export class EventSocketService implements OnDestroy {
  readonly status = signal<SocketStatus>('connecting');
  readonly events = new Subject<SessionEvent>();

  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;
  private lastSequence = 0;

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
        from_seq: this.lastSequence > 0 ? this.lastSequence + 1 : 0,
      });
    });

    this.socket.addEventListener('message', (message) => {
      try {
        const data = JSON.parse(String(message.data)) as Partial<SessionEvent>;
        if (typeof data.seq !== 'number' || data.seq <= this.lastSequence) return;
        this.lastSequence = data.seq;
        this.events.next(data as SessionEvent);
      } catch {
        // Control frames and malformed messages cannot update application state.
      }
    });

    this.socket.addEventListener('close', () => {
      this.socket = null;
      this.status.set('disconnected');
      this.scheduleReconnect();
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
