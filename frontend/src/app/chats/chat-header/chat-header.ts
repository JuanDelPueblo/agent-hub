import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { Chat, UsageInfo } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import type { ChatActivity } from '../../state/chat-activity';
import { ChatStatusBadgeComponent } from '../../shared/chat-status-badge/chat-status-badge';
import { DeleteChatDialogComponent } from '../delete-chat-dialog/delete-chat-dialog';
import { RenameChatDialogComponent } from '../rename-chat-dialog/rename-chat-dialog';
import { TerminalTaskDialogComponent } from '../terminal-task-dialog/terminal-task-dialog';
import { formatLocalDateTime } from '../../state/chat-activity';

@Component({
  selector: 'hub-chat-header',
  imports: [ChatStatusBadgeComponent, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './chat-header.html',
  styleUrl: './chat-header.scss',
})
export class ChatHeaderComponent {
  readonly chat = input<Chat | null>(null);
  readonly usage = input<UsageInfo | null>(null);
  readonly configRequested = output<void>();
  readonly state = inject(AppStateService);
  readonly activity = computed<ChatActivity>(() => {
    const chat = this.chat();
    if (!chat) return 'idle';
    return this.state.chatActivity(chat.id);
  });
  readonly turnStartedAt = computed(() => {
    const chat = this.chat();
    return chat ? this.state.chatTurnStartedAt(chat.id) : null;
  });
  agentLabel(agent: string | null | undefined): string {
    const value = agent ?? '';
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  contextLabel(): string | null {
    const usage = this.usage();
    if (!usage || !usage.size) return null;
    const pct = Math.round((usage.used / usage.size) * 100);
    return `Context ${pct}%`;
  }
  contextTooltip(): string | null {
    const usage = this.usage();
    if (!usage || !usage.size) return null;
    return `${usage.used.toLocaleString()} / ${usage.size.toLocaleString()} tokens`;
  }
  costLabel(): string | null {
    const usage = this.usage();
    if (!usage || usage.cost_amount == null) return null;
    const amount = usage.cost_amount;
    const currency = (usage.cost_currency ?? '').trim();
    if (!currency || currency.toUpperCase() === 'USD') return `$${amount.toFixed(3)}`;
    return `${amount.toFixed(3)} ${currency}`;
  }
  workspaceTooltip(workspace: NonNullable<Chat['workspace']>): string {
    return `${workspace.branch ?? ''} — ${workspace.mode === 'managed_worktree' ? 'Isolated worktree' : 'Project checkout'}`;
  }
  async copyBranch(branch: string | null | undefined): Promise<void> {
    if (!branch) return;
    try {
      await navigator.clipboard?.writeText(branch);
    } catch (error) {
      console.error('Failed to copy branch name', error);
    }
  }
  formatDateTime(value: string): string { return formatLocalDateTime(value); }
  private readonly dialog = inject(MatDialog);
  toggleNavigation(): void { this.state.setMobileDrawerOpen(!this.state.isMobileDrawerOpen()); }
  rename(): void { const chat = this.chat(); if (chat) this.dialog.open(RenameChatDialogComponent, { width: 'min(480px, calc(100vw - 32px))', data: chat }); }
  async archive(): Promise<void> { const chat = this.chat(); if (chat) await this.state.archiveChat(chat.id, !chat.archived).catch((error) => console.error('Failed to archive chat', error)); }
  remove(): void { const chat = this.chat(); if (chat) this.dialog.open(DeleteChatDialogComponent, { width: 'min(520px, calc(100vw - 32px))', data: chat }); }
  openTasks(): void { const chat = this.chat(); if (chat) this.dialog.open(TerminalTaskDialogComponent, { width: 'min(840px, calc(100vw - 32px))', data: chat }); }
}
