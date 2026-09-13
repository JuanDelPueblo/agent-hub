import type { SessionEvent } from './types.ts';

export type EventCallback = (event: SessionEvent) => void;
export type StatusCallback = (status: 'connected' | 'connecting' | 'disconnected') => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private lastSeq = 0;
  private reconnectTimer: any = null;
  private eventCallbacks: Set<EventCallback> = new Set();
  private statusCallbacks: Set<StatusCallback> = new Set();
  private isDestroyed = false;

  constructor() {
    this.connect();
  }

  public onEvent(cb: EventCallback): () => void {
    this.eventCallbacks.add(cb);
    return () => this.eventCallbacks.delete(cb);
  }

  public onStatus(cb: StatusCallback): () => void {
    this.statusCallbacks.add(cb);
    return () => this.statusCallbacks.delete(cb);
  }

  private notifyStatus(status: 'connected' | 'connecting' | 'disconnected') {
    for (const cb of this.statusCallbacks) {
      cb(status);
    }
  }

  private connect() {
    if (this.isDestroyed || typeof window === 'undefined') return;
    this.notifyStatus('connecting');

    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const url = `${proto}//${host}/ws`;

    try {
      this.ws = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.notifyStatus('connected');
      const from_seq = this.lastSeq > 0 ? this.lastSeq + 1 : 0;
      this.send({ type: 'subscribe', from_seq });
    };

    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.seq) {
          if (data.seq <= this.lastSeq) return;
          this.lastSeq = data.seq;
          for (const cb of this.eventCallbacks) {
            cb(data as SessionEvent);
          }
        }
      } catch {
        // ignore parse error
      }
    };

    this.ws.onclose = () => {
      this.notifyStatus('disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      if (this.ws) {
        this.ws.close();
      }
    };
  }

  private scheduleReconnect() {
    if (this.isDestroyed || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 2000);
  }

  public send(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.eventCallbacks.clear();
    this.statusCallbacks.clear();
  }
}
