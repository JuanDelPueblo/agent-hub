import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/api/api.service';
import type {
  AgentAuthFlow,
  AgentAuthFlowState,
  AgentAuthSocketIncoming,
  AgentAuthSocketOutgoing,
} from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

const MAX_OUTPUT = 200_000;

@Component({
  selector: 'hub-auth-terminal-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './auth-terminal-dialog.html',
  styleUrl: './auth-terminal-dialog.scss',
})
export class AuthTerminalDialogComponent implements AfterViewInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<AuthTerminalDialogComponent>);
  readonly flow = inject<AgentAuthFlow>(MAT_DIALOG_DATA);
  private readonly api = inject(ApiService);
  private readonly state = inject(AppStateService);

  readonly output = signal('');
  readonly flowState = signal<AgentAuthFlowState>(this.flow.state);
  readonly exitCode = signal<number | null>(this.flow.exit_code ?? null);
  readonly error = signal(this.flow.error ?? '');
  readonly connected = signal(false);

  private readonly terminal = viewChild<ElementRef<HTMLElement>>('terminal');
  private socket: WebSocket | null = null;
  private observer: ResizeObserver | null = null;
  private cancelled = false;

  ngAfterViewInit(): void {
    this.openSocket();
    const element = this.terminal()?.nativeElement;
    if (element && typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.sendResize());
      this.observer.observe(element);
    }
    this.sendResize();
    this.focusTerminal();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.socket?.close();
  }

  get running(): boolean {
    return this.flowState() === 'starting' || this.flowState() === 'running';
  }

  focusTerminal(): void {
    this.terminal()?.nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.running) return;
    const data = this.keyData(event);
    if (data === null) return;
    event.preventDefault();
    this.send({ type: 'input', data });
  }

  onPaste(event: ClipboardEvent): void {
    if (!this.running) return;
    const text = event.clipboardData?.getData('text');
    if (!text) return;
    event.preventDefault();
    this.send({ type: 'input', data: text });
  }

  async cancel(): Promise<void> {
    if (!this.running || this.cancelled) {
      this.dialogRef.close();
      return;
    }
    this.cancelled = true;
    try {
      await this.api.cancelAgentAuthFlow(this.flow.flow_id);
    } catch {
      // The dialog still closes; the flow ends with the socket.
    }
    this.send({ type: 'input', data: '\u0003' });
    this.dialogRef.close();
  }

  private openSocket(): void {
    try {
      this.socket = new WebSocket(this.api.agentAuthSocketUrl(this.flow.flow_id));
    } catch {
      this.error.set('Could not open the authentication terminal.');
      this.flowState.set('failed');
      return;
    }
    this.socket.onopen = () => {
      this.connected.set(true);
      this.sendResize();
    };
    this.socket.onmessage = (event) => this.handleMessage(event.data);
    this.socket.onerror = () => {
      this.connected.set(false);
      if (this.running) {
        this.error.set('The authentication terminal connection failed.');
      }
    };
    this.socket.onclose = () => this.connected.set(false);
  }

  private handleMessage(raw: unknown): void {
    let message: AgentAuthSocketIncoming;
    try {
      message = JSON.parse(String(raw)) as AgentAuthSocketIncoming;
    } catch {
      return;
    }
    if (message.type === 'output') {
      const next = this.output() + message.data;
      this.output.set(next.length > MAX_OUTPUT ? next.slice(next.length - MAX_OUTPUT) : next);
      this.scrollToBottom();
      return;
    }
    if (message.type === 'state') {
      this.flowState.set(message.state);
      this.exitCode.set(message.exit_code ?? null);
      if (message.error) this.error.set(message.error);
      if (message.state === 'succeeded') {
        // Refresh status; never call authenticate again for a terminal method.
        void this.state.loadAgentAuth(this.flow.agent_id).catch(() => undefined);
      }
    }
  }

  private sendResize(): void {
    const element = this.terminal()?.nativeElement;
    if (!element) return;
    const cols = Math.max(20, Math.floor(element.clientWidth / 8));
    const rows = Math.max(6, Math.floor(element.clientHeight / 17));
    this.send({ type: 'resize', cols, rows });
  }

  private send(message: AgentAuthSocketOutgoing): void {
    if (this.socket?.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify(message));
  }

  private keyData(event: KeyboardEvent): string | null {
    if (event.ctrlKey && !event.altKey && !event.metaKey && event.key.length === 1) {
      const code = event.key.toLowerCase().charCodeAt(0);
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 96);
    }
    switch (event.key) {
      case 'Enter':
        return '\r';
      case 'Backspace':
        return '\u007f';
      case 'Tab':
        return '\t';
      case 'Escape':
        return '\u001b';
      case 'ArrowUp':
        return '\u001b[A';
      case 'ArrowDown':
        return '\u001b[B';
      case 'ArrowRight':
        return '\u001b[C';
      case 'ArrowLeft':
        return '\u001b[D';
      default:
        return event.key.length === 1 ? event.key : null;
    }
  }

  private scrollToBottom(): void {
    queueMicrotask(() => {
      const element = this.terminal()?.nativeElement;
      if (element) element.scrollTop = element.scrollHeight;
    });
  }
}
