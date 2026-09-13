import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { DeleteChatDialogComponent } from '../delete-chat-dialog/delete-chat-dialog';
import { RenameChatDialogComponent } from '../rename-chat-dialog/rename-chat-dialog';

@Component({
  selector: 'hub-chat-header',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './chat-header.html',
  styleUrl: './chat-header.scss',
})
export class ChatHeaderComponent {
  @Input() chat: Chat | null = null;
  @Output() readonly configRequested = new EventEmitter<void>();
  readonly state = inject(AppStateService);
  private readonly dialog = inject(MatDialog);
  toggleNavigation(): void { this.state.setMobileDrawerOpen(!this.state.isMobileDrawerOpen()); }
  stateLabel(processState: string | null | undefined): string { const value = processState ?? 'STOPPED'; return value.charAt(0) + value.slice(1).toLowerCase(); }
  rename(): void { if (this.chat) this.dialog.open(RenameChatDialogComponent, { width: 'min(480px, calc(100vw - 32px))', data: this.chat }); }
  async stop(): Promise<void> { if (this.chat) await this.state.stopChatProcess(this.chat.id).catch((error) => console.error('Failed to stop process', error)); }
  async reconnect(): Promise<void> { if (this.chat) await this.state.retryConnection(this.chat.id); }
  async archive(): Promise<void> { if (this.chat) await this.state.archiveChat(this.chat.id, !this.chat.archived).catch((error) => console.error('Failed to archive chat', error)); }
  remove(): void { if (this.chat) this.dialog.open(DeleteChatDialogComponent, { width: 'min(520px, calc(100vw - 32px))', data: this.chat }); }
}
