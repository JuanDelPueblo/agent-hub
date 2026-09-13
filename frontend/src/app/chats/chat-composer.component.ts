import { Component, computed, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { ProcessState, TurnState } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'hub-chat-composer',
  standalone: true,
  imports: [ReactiveFormsModule, TextFieldModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTooltipModule],
  template: `
    <div class="composer-column">
      <form class="composer" (submit)="$event.preventDefault(); send()">
        <mat-form-field appearance="outline" class="message-field" subscriptSizing="dynamic">
          <mat-label>Message</mat-label>
          <textarea
            matInput
            [formControl]="message"
            cdkTextareaAutosize
            [cdkAutosizeMinRows]="1"
            [cdkAutosizeMaxRows]="8"
            [placeholder]="placeholder()"
            (keydown)="keyDown($event)"
            [attr.aria-label]="placeholder()"
          ></textarea>
        </mat-form-field>
        @if (prompting() || cancelling()) {
          <button matFab class="action cancel" type="button" matTooltip="Cancel active turn" aria-label="Cancel active turn" (click)="cancel()" [disabled]="cancelling()">
            @if (cancelling()) { <mat-spinner diameter="22" /> } @else { <mat-icon>stop</mat-icon> }
          </button>
        } @else {
          <button matFab class="action" type="submit" matTooltip="Send message (Ctrl+Enter)" aria-label="Send message" [disabled]="!canSend()">
            <mat-icon>arrow_upward</mat-icon>
          </button>
        }
      </form>
      <p class="hint">Press Ctrl+Enter or Cmd+Enter to send</p>
    </div>
  `,
  styles: `
    :host { display: block; flex: 0 0 auto; padding: 12px max(var(--hub-gutter), calc((100% - var(--hub-measure)) / 2)); padding-bottom: calc(12px + env(safe-area-inset-bottom)); border-top: 1px solid var(--mat-sys-outline-variant); background: var(--mat-sys-surface); }
    .composer-column { max-width: var(--hub-measure); margin: 0 auto; }
    .composer { display: flex; align-items: flex-end; gap: 12px; }
    .message-field { min-width: 0; flex: 1; }
    textarea { max-height: 190px; }
    .action { flex: 0 0 auto; }
    .cancel { --mat-fab-container-color: var(--mat-sys-error-container); --mat-fab-icon-color: var(--mat-sys-on-error-container); --mat-fab-state-layer-color: var(--mat-sys-on-error-container); }
    .hint { padding: 6px 4px 0; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-small); }
    @media (max-width: 599px) { :host { padding-inline: 16px; } .hint { display: none; } }
  `,
})
export class ChatComposerComponent {
  readonly chatId = input('');
  readonly processState = input<ProcessState>('STOPPED');
  readonly turnState = input<TurnState>('IDLE');
  readonly disabled = input(false);

  readonly message = new FormControl('', { nonNullable: true });
  private readonly state = inject(AppStateService);
  private readonly text = toSignal(this.message.valueChanges, { initialValue: this.message.value });

  readonly prompting = computed(() => this.turnState() === 'PROMPTING');
  readonly cancelling = computed(() => this.turnState() === 'CANCELLING');
  private readonly unavailable = computed(
    () => this.disabled() || this.processState() !== 'RUNNING' || this.prompting(),
  );
  readonly canSend = computed(() => !this.unavailable() && this.text().trim().length > 0);
  readonly placeholder = computed(() => {
    if (this.disabled()) return 'Waiting for the agent connection…';
    if (this.processState() !== 'RUNNING') return 'Agent process stopped';
    if (this.prompting()) return 'Agent is thinking…';
    return 'Type a message…';
  });

  constructor() {
    effect(() => {
      const locked = this.unavailable();
      if (locked && this.message.enabled) this.message.disable({ emitEvent: false });
      else if (!locked && this.message.disabled) this.message.enable({ emitEvent: false });
    });
  }

  keyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      void this.send();
    }
  }

  async send(): Promise<void> {
    const value = this.message.value.trim();
    if (!value || !this.canSend()) return;
    this.message.setValue('');
    try {
      await this.state.sendPrompt(this.chatId(), value);
    } catch (error) {
      console.error('Failed to send prompt', error);
      this.message.setValue(value);
    }
  }

  async cancel(): Promise<void> {
    if (!this.chatId()) return;
    try {
      await this.state.cancelActiveTurn(this.chatId());
    } catch (error) {
      console.error('Failed to cancel turn', error);
    }
  }
}
