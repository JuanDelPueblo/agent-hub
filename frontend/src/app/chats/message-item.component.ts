import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { DisplayError, DisplayItem, DisplayStateChange, DisplayTurn, DisplayUserMessage } from '../core/api/types';
import { PermissionCardComponent } from '../permissions/permission-card.component';
import { PlanViewComponent } from './plan-view.component';
import { ToolCallComponent } from './tool-call.component';

@Component({
  selector: 'hub-message-item',
  standalone: true,
  imports: [MatIconModule, MatProgressSpinnerModule, PermissionCardComponent, PlanViewComponent, ToolCallComponent],
  template: `
    @switch (item.type) {
      @case ('user_message') { <div class="user-message"><div class="user-bubble">{{ user(item).text }}</div><time>{{ formatTime(user(item).timestamp) }}</time></div> }
      @case ('turn') { <article class="turn"><header><span class="avatar">{{ turn(item).agent[0] || 'A' }}</span><strong>{{ turn(item).agent }}</strong><time>{{ formatTime(turn(item).timestamp) }}</time>@if (turn(item).status === 'in_progress') { <span class="thinking"><mat-spinner diameter="14" /> Thinking…</span> }</header><div class="turn-body">@for (entry of turn(item).entries; track entry.id) { @switch (entry.type) { @case ('message_chunk') { <div class="message-text">{{ entry.text }}</div> } @case ('thought_chunk') { <details class="thought"><summary><mat-icon>psychology</mat-icon> Thought process</summary><div>{{ entry.text }}</div></details> } @case ('tool_call') { <hub-tool-call [tool]="entry" /> } @case ('plan') { <hub-plan-view [entries]="entry.entries" /> } @case ('permission_request') { <hub-permission-card [permission]="entry" [chatId]="chatId" /> } } }</div></article> }
      @case ('error') { <div class="error-message" role="alert"><mat-icon>error</mat-icon><span>{{ error(item).message }}</span></div> }
      @case ('state_change') { <div class="state-change"><span>Process: {{ state(item).process }} · Turn: {{ state(item).turn }}</span></div> }
    }
  `,
  styles: `
    :host { display: block; margin-bottom: 26px; } .user-message { display: flex; flex-direction: column; align-items: flex-end; margin-left: 18%; } .user-bubble { max-width: 100%; padding: 12px 16px; border-radius: 18px 18px 4px 18px; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.5; box-shadow: var(--mat-sys-level1); } time { color: var(--mat-sys-outline); font-size: .72rem; } .user-message time { margin-top: 5px; padding-right: 4px; }
    .turn { margin-right: 3%; } .turn > header { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; color: var(--mat-sys-on-surface-variant); font-size: .82rem; } .avatar { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 12px 12px 12px 3px; background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); font-weight: 700; text-transform: uppercase; } .turn strong { color: var(--mat-sys-on-surface); } .thinking { display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: 999px; background: var(--mat-sys-tertiary-container); color: var(--mat-sys-on-tertiary-container); } .turn-body { display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: 4px 20px 20px 20px; background: var(--mat-sys-surface-container-low); } .message-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 1rem; line-height: 1.65; } .thought { padding: 10px 12px; border: 1px dashed var(--mat-sys-outline-variant); border-radius: 12px; color: var(--mat-sys-on-surface-variant); } .thought summary { display: flex; align-items: center; gap: 7px; cursor: pointer; font-weight: 600; } .thought summary mat-icon { width: 19px; height: 19px; font-size: 19px; } .thought > div { margin-top: 9px; padding-top: 9px; border-top: 1px solid var(--mat-sys-outline-variant); white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.5; } .error-message { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 14px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); } .state-change { display: flex; justify-content: center; margin: 10px 0; } .state-change span { padding: 5px 10px; border-radius: 999px; background: var(--mat-sys-surface-variant); color: var(--mat-sys-on-surface-variant); font-size: .75rem; }
    @media (max-width: 599px) { .user-message { margin-left: 8%; } .turn { margin-right: 0; } .turn-body { padding: 12px; } }
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
