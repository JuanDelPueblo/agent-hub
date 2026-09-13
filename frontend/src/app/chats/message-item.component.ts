import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { DisplayError, DisplayItem, DisplayStateChange, DisplayTurn, DisplayUserMessage } from '../core/api/types';
import { PermissionCardComponent } from '../permissions/permission-card.component';
import { PlanViewComponent } from './plan-view.component';
import { ToolCallComponent } from './tool-call.component';

@Component({
  selector: 'hub-message-item',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatProgressSpinnerModule, PermissionCardComponent, PlanViewComponent, ToolCallComponent],
  template: `
    @switch (item.type) {
      @case ('user_message') { <div class="user-message"><div class="user-bubble">{{ user(item).text }}</div><time>{{ formatTime(user(item).timestamp) }}</time></div> }
      @case ('turn') { <article class="turn"><header><span class="avatar">{{ turn(item).agent[0] || 'A' }}</span><strong>{{ turn(item).agent }}</strong><time>{{ formatTime(turn(item).timestamp) }}</time>@if (turn(item).status === 'in_progress') { <span class="thinking"><mat-spinner diameter="14" /> Thinking…</span> }</header><div class="turn-body">@for (entry of turn(item).entries; track entry.id) { @switch (entry.type) { @case ('message_chunk') { <div class="message-text">{{ entry.text }}</div> } @case ('thought_chunk') { <mat-expansion-panel class="thought"><mat-expansion-panel-header><mat-panel-title><mat-icon>psychology</mat-icon><span>Thought process</span></mat-panel-title></mat-expansion-panel-header><div class="thought-text">{{ entry.text }}</div></mat-expansion-panel> } @case ('tool_call') { <hub-tool-call [tool]="entry" /> } @case ('plan') { <hub-plan-view [entries]="entry.entries" /> } @case ('permission_request') { <hub-permission-card [permission]="entry" [chatId]="chatId" /> } } }</div></article> }
      @case ('error') { <div class="error-message" role="alert"><mat-icon>error</mat-icon><span>{{ error(item).message }}</span></div> }
      @case ('state_change') { <div class="state-change"><span>Process: {{ state(item).process }} · Turn: {{ state(item).turn }}</span></div> }
    }
  `,
  styles: `
    :host { display: block; margin-bottom: 26px; }
    .user-message { display: flex; flex-direction: column; align-items: flex-end; }
    .user-bubble { max-width: min(100%, 640px); padding: 12px 16px; border-radius: 18px 18px 4px 18px; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); white-space: pre-wrap; overflow-wrap: anywhere; font: var(--mat-sys-body-large); box-shadow: var(--mat-sys-level1); }
    time { color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-small); }
    .user-message time { margin-top: 5px; padding-right: 4px; }
    .turn > header { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-large); }
    .avatar { display: grid; place-items: center; width: 32px; height: 32px; flex: 0 0 auto; border-radius: 12px 12px 12px 3px; background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); font-weight: 700; text-transform: uppercase; }
    .turn strong { color: var(--mat-sys-on-surface); }
    .thinking { display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-tertiary-container); color: var(--mat-sys-on-tertiary-container); }
    .turn-body { display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: 4px 20px 20px 20px; background: var(--mat-sys-surface-container-low); }
    .message-text { white-space: pre-wrap; overflow-wrap: anywhere; font: var(--mat-sys-body-large); }
    .thought { border: 1px solid var(--mat-sys-outline-variant); box-shadow: none; color: var(--mat-sys-on-surface-variant); }
    .thought mat-panel-title { display: flex; align-items: center; gap: 8px; }
    .thought mat-panel-title mat-icon { flex: 0 0 24px; color: var(--mat-sys-primary); }
    .thought-text { white-space: pre-wrap; overflow-wrap: anywhere; font: var(--mat-sys-body-medium); }
    .error-message { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); }
    .state-change { display: flex; justify-content: center; margin: 10px 0; }
    .state-change span { padding: 5px 10px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-surface-container-high); color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-small); }
    @media (max-width: 599px) { .turn-body { padding: 12px; } }
  `,
})
export class MessageItemComponent {
  @Input({ required: true }) item!: DisplayItem;
  @Input() chatId = '';
  user(item: DisplayItem): DisplayUserMessage { return item as DisplayUserMessage; }
  turn(item: DisplayItem): DisplayTurn { return item as DisplayTurn; }
  error(item: DisplayItem): DisplayError { return item as DisplayError; }
  state(item: DisplayItem): DisplayStateChange { return item as DisplayStateChange; }
  formatTime(value: string): string { if (!value) return ''; const date = new Date(value); return Number.isNaN(date.valueOf()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
}
