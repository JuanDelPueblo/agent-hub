import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
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
    <form class="composer" (submit)="$event.preventDefault(); send()">
      <mat-form-field appearance="outline" class="message-field">
        <mat-label>Message</mat-label>
        <textarea matInput [formControl]="message" cdkTextareaAutosize [cdkAutosizeMinRows]="1" [cdkAutosizeMaxRows]="8" [placeholder]="placeholder" (keydown)="keyDown($event)" [attr.aria-label]="placeholder"></textarea>
      </mat-form-field>
      @if (prompting || cancelling) {
        <button mat-fab color="warn" type="button" matTooltip="Cancel active turn" aria-label="Cancel active turn" (click)="cancel()" [disabled]="cancelling">
          @if (cancelling) { <mat-spinner diameter="22" /> } @else { <mat-icon>stop</mat-icon> }
        </button>
      } @else {
        <button mat-fab color="primary" type="submit" matTooltip="Send message (Ctrl+Enter)" aria-label="Send message" [disabled]="!canSend">
          <mat-icon>arrow_upward</mat-icon>
        </button>
      }
    </form>
    <p class="hint">Press Ctrl+Enter or Cmd+Enter to send</p>
  `,
  styles: `
    :host { display: block; padding: 12px max(20px, calc((100% - 920px) / 2)); padding-bottom: calc(12px + env(safe-area-inset-bottom)); border-top: 1px solid var(--mat-sys-outline-variant); background: var(--mat-sys-surface); } .composer { display: flex; align-items: flex-end; gap: 10px; max-width: 920px; margin: 0 auto; } .message-field { flex: 1; } textarea { max-height: 190px; } .hint { max-width: 920px; margin: 0 auto; padding: 0 8px; color: var(--mat-sys-outline); font-size: .72rem; text-align: right; } button { flex: 0 0 auto; margin-bottom: 4px; } @media (max-width: 599px) { :host { padding-inline: 12px; } .hint { display: none; } }
  `,
})
export class ChatComposerComponent implements OnChanges {
  @Input() chatId = '';
  @Input() processState: ProcessState = 'STOPPED';
  @Input() turnState: TurnState = 'IDLE';
  @Input() disabled = false;
  readonly message = new FormControl('', { nonNullable: true });
  private readonly state = inject(AppStateService);
  get prompting(): boolean { return this.turnState === 'PROMPTING'; }
  get cancelling(): boolean { return this.turnState === 'CANCELLING'; }
  get canSend(): boolean { return !this.disabled && this.processState === 'RUNNING' && !this.prompting && this.message.value.trim().length > 0; }
  get placeholder(): string { if (this.disabled) return 'Waiting for the agent connection…'; if (this.processState !== 'RUNNING') return 'Agent process stopped'; if (this.prompting) return 'Agent is thinking…'; return 'Type a message…'; }
  ngOnChanges(_changes: SimpleChanges): void { const unavailable = this.disabled || this.processState !== 'RUNNING' || this.prompting; if (unavailable && this.message.enabled) this.message.disable({ emitEvent: false }); else if (!unavailable && this.message.disabled) this.message.enable({ emitEvent: false }); }
  keyDown(event: KeyboardEvent): void { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); void this.send(); } }
  async send(): Promise<void> { const value = this.message.value.trim(); if (!value || !this.canSend) return; this.message.setValue(''); try { await this.state.sendPrompt(this.chatId, value); } catch (error) { console.error('Failed to send prompt', error); this.message.setValue(value); } }
  async cancel(): Promise<void> { if (!this.chatId) return; try { await this.state.cancelActiveTurn(this.chatId); } catch (error) { console.error('Failed to cancel turn', error); } }
}
