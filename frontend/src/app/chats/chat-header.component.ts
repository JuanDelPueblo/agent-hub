import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { Chat } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';
import { DeleteChatDialogComponent } from './delete-chat-dialog.component';
import { RenameChatDialogComponent } from './rename-chat-dialog.component';

@Component({
  selector: 'hub-chat-header',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <header class="chat-header">
      @if (chat) {
        <div class="header-left">
          <button mat-icon-button class="nav-button" aria-label="Open navigation" matTooltip="Open navigation" (click)="toggleNavigation()"><mat-icon>menu</mat-icon></button>
          <div class="title-area"><div class="title-line"><button mat-button class="title-button" type="button" (click)="rename()" [attr.aria-label]="'Rename chat ' + (chat.title || 'Untitled chat')">{{ chat.title || 'Untitled chat' }}</button>@if (chat.archived) { <span class="badge stopped">Archived</span> }</div><div class="badges"><span class="badge agent">{{ chat.agent }}</span>@if (chat.turn_state === 'PROMPTING') { <span class="badge thinking">Thinking…</span> }<span class="badge" [class.running]="chat.process_state === 'RUNNING'" [class.dead]="chat.process_state === 'DEAD'"><span class="status-dot"></span>{{ chat.process_state || 'STOPPED' }}</span></div></div>
        </div>
        <div class="header-actions">
          @if (chat.process_state === 'RUNNING') { <button mat-icon-button matTooltip="Stop process" aria-label="Stop process" (click)="stop()"><mat-icon>pause_circle</mat-icon></button> } @else { <button mat-icon-button matTooltip="Reconnect process" aria-label="Reconnect process" (click)="reconnect()"><mat-icon>play_circle</mat-icon></button> }
          <button mat-icon-button matTooltip="Chat configuration" aria-label="Chat configuration" (click)="configRequested.emit()"><mat-icon>tune</mat-icon></button>
          <button mat-icon-button [matMenuTriggerFor]="actions" aria-label="Chat actions"><mat-icon>more_vert</mat-icon></button>
          <mat-menu #actions="matMenu"><button mat-menu-item type="button" (click)="rename()"><mat-icon>edit</mat-icon><span>Rename chat</span></button>@if (chat.process_state === 'RUNNING') { <button mat-menu-item type="button" (click)="stop()"><mat-icon>pause</mat-icon><span>Stop process</span></button> } @else { <button mat-menu-item type="button" (click)="reconnect()"><mat-icon>play_arrow</mat-icon><span>Reconnect ACP</span></button> }<button mat-menu-item type="button" (click)="archive()"><mat-icon>{{ chat.archived ? 'unarchive' : 'archive' }}</mat-icon><span>{{ chat.archived ? 'Unarchive chat' : 'Archive chat' }}</span></button><button mat-menu-item type="button" (click)="remove()"><mat-icon color="warn">delete</mat-icon><span>Delete chat</span></button></mat-menu>
        </div>
      } @else { <span class="no-chat">No chat selected</span> }
    </header>
  `,
  styles: `
    :host { display: block; flex: 0 0 auto; } .chat-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 72px; padding: 10px max(16px, calc((100% - 1120px) / 2)); border-bottom: 1px solid var(--mat-sys-outline-variant); background: var(--mat-sys-surface); } .header-left, .header-actions, .title-line, .badges { display: flex; align-items: center; } .header-left { min-width: 0; flex: 1; gap: 12px; } .header-actions { gap: 2px; } .title-area { min-width: 0; } .title-line { min-width: 0; gap: 8px; } .title-button { min-width: 0; overflow: hidden; max-width: min(50vw, 560px); padding-inline: 4px; color: var(--mat-sys-on-surface); font-family: inherit; font-size: 1.15rem; font-weight: 600; line-height: 1.3; text-align: left; text-overflow: ellipsis; white-space: nowrap; } .title-button:hover { text-decoration: underline; } .badges { flex-wrap: wrap; gap: 6px; margin-top: 5px; } .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 999px; background: var(--mat-sys-surface-container); color: var(--mat-sys-on-surface-variant); font-size: .72rem; } .badge.agent { background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); } .badge.running { background: var(--hub-status-running-container); color: var(--hub-status-running); } .badge.dead { background: var(--hub-status-dead-container); color: var(--hub-status-dead); } .badge.thinking { background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); } .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; } .nav-button { display: none; } .no-chat { color: var(--mat-sys-on-surface-variant); } @media (max-width: 839px) { .nav-button { display: inline-flex; } } @media (max-width: 599px) { .chat-header { padding-inline: 8px; } .header-actions > button:first-child { display: none; } .title-button { max-width: 42vw; } }
  `,
})
export class ChatHeaderComponent {
  @Input() chat: Chat | null = null;
  @Output() readonly configRequested = new EventEmitter<void>();
  readonly state = inject(AppStateService);
  private readonly dialog = inject(MatDialog);
  toggleNavigation(): void { this.state.setMobileDrawerOpen(!this.state.isMobileDrawerOpen()); }
  rename(): void { if (this.chat) this.dialog.open(RenameChatDialogComponent, { width: 'min(480px, calc(100vw - 32px))', data: this.chat }); }
  async stop(): Promise<void> { if (this.chat) await this.state.stopChatProcess(this.chat.id).catch((error) => console.error('Failed to stop process', error)); }
  async reconnect(): Promise<void> { if (this.chat) await this.state.retryConnection(this.chat.id); }
  async archive(): Promise<void> { if (this.chat) await this.state.archiveChat(this.chat.id, !this.chat.archived).catch((error) => console.error('Failed to archive chat', error)); }
  remove(): void { if (this.chat) this.dialog.open(DeleteChatDialogComponent, { width: 'min(520px, calc(100vw - 32px))', data: this.chat }); }
}
