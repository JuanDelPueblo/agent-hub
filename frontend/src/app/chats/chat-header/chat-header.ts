import { Component, inject, input, output } from '@angular/core';
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
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './chat-header.html',
  styleUrl: './chat-header.scss',
})
export class ChatHeaderComponent {
  readonly chat = input<Chat | null>(null);
  readonly configRequested = output<void>();
  readonly state = inject(AppStateService);
  agentLabel(agent: string | null | undefined): string {
    const value = agent ?? '';
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  private readonly dialog = inject(MatDialog);
  toggleNavigation(): void { this.state.setMobileDrawerOpen(!this.state.isMobileDrawerOpen()); }
  rename(): void { const chat = this.chat(); if (chat) this.dialog.open(RenameChatDialogComponent, { width: 'min(480px, calc(100vw - 32px))', data: chat }); }
  async archive(): Promise<void> { const chat = this.chat(); if (chat) await this.state.archiveChat(chat.id, !chat.archived).catch((error) => console.error('Failed to archive chat', error)); }
  remove(): void { const chat = this.chat(); if (chat) this.dialog.open(DeleteChatDialogComponent, { width: 'min(520px, calc(100vw - 32px))', data: chat }); }
}
