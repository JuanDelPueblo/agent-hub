import { Component, computed, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import type { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { NewChatButtonComponent } from '../../chats/new-chat-button/new-chat-button';
import { ProjectDialogComponent } from '../../projects/project-dialog/project-dialog';
import { ConnectionStatusComponent } from '../connection-status/connection-status';
import { ThemeService } from '../../core/theme.service';

/**
 * The navigation drawer for a selected project. It holds the project switcher
 * and the chats of the active project. The shell hides it when no project is
 * selected.
 */
@Component({
  selector: 'hub-navigation',
  imports: [
    ConnectionStatusComponent,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    NewChatButtonComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class NavigationComponent {
  readonly closeRequested = output<void>();
  readonly state = inject(AppStateService);
  readonly theme = inject(ThemeService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  /** The project overview page carries its own button, so the drawer hides one. */
  readonly showNewChat = computed(() => this.state.activeChatId() !== null);

  readonly visibleChats = computed(() => {
    const projectId = this.state.activeProjectId();
    const chats = projectId ? this.state.chatsByProject()[projectId] ?? [] : [];
    return this.state.showArchived() ? chats : chats.filter((chat) => !chat.archived);
  });

  processStateLabel(chat: Chat): string {
    return (chat.process_state ?? 'STOPPED').toLowerCase();
  }

  /**
   * Opens the chosen project. Inside a chat view the project switches in
   * place: the workspace shows the latest chat of the new project. A project
   * without chats opens its project page instead.
   */
  async openProject(projectId: string): Promise<void> {
    if (projectId === this.state.activeProjectId()) {
      this.closeRequested.emit();
      return;
    }
    const chat = this.state.activeChatId() ? await this.latestVisibleChat(projectId) : null;
    void this.router.navigate(
      chat ? ['/projects', projectId, 'chats', chat.id] : ['/projects', projectId],
    );
    this.closeRequested.emit();
  }

  /** Returns the latest visible chat of the project, and loads the list on demand. */
  private async latestVisibleChat(projectId: string): Promise<Chat | null> {
    let chats = this.state.chatsByProject()[projectId];
    if (!chats) {
      await this.state.loadChats(projectId);
      chats = this.state.chatsByProject()[projectId];
    }
    if (!chats) return null;
    const visible = this.state.showArchived()
      ? chats
      : chats.filter((candidate) => !candidate.archived);
    return visible.reduce<Chat | null>(
      (latest, chat) => (!latest || chat.updated_at > latest.updated_at ? chat : latest),
      null,
    );
  }

  goHome(): void {
    void this.router.navigate(['/']);
    this.closeRequested.emit();
  }

  newProject(): void {
    this.dialog.open(ProjectDialogComponent, { width: 'min(720px, calc(100vw - 32px))', panelClass: 'hub-wide-dialog' });
    this.closeRequested.emit();
  }
}
