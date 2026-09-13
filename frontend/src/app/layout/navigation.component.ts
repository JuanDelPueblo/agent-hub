import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import type { Chat } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';
import { NewChatButtonComponent } from '../chats/new-chat-button.component';
import { ProjectDialogComponent } from '../projects/project-dialog.component';
import { ConnectionStatusComponent } from './connection-status.component';
import { ThemeService } from '../core/theme.service';

/**
 * The navigation drawer for a selected project. It holds the project switcher
 * and the chats of the active project. The shell hides it when no project is
 * selected.
 */
@Component({
  selector: 'hub-navigation',
  standalone: true,
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
  template: `
    <header class="drawer-header">
      <a class="brand" routerLink="/" aria-label="Agent Hub home" (click)="closeRequested.emit()">
        <span class="brand-mark"><mat-icon>hub</mat-icon></span>
        <span class="brand-name">Agent Hub</span>
      </a>
      <span class="header-spacer"></span>
      <button
        mat-icon-button
        class="drawer-close"
        matTooltip="Close navigation"
        aria-label="Close navigation"
        (click)="closeRequested.emit()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </header>

    <div class="drawer-body">
      @if (state.activeProject(); as project) {
        <button
          mat-button
          type="button"
          class="project-switcher"
          [matMenuTriggerFor]="projectMenu"
          aria-label="Switch project"
        >
          <span class="switcher-icon"><mat-icon>folder</mat-icon></span>
          <span class="switcher-text">
            <span class="switcher-name">{{ project.name }}</span>
            <span class="switcher-path" [title]="project.path">{{ project.path }}</span>
          </span>
          <mat-icon iconPositionEnd class="switcher-caret">unfold_more</mat-icon>
        </button>

        <mat-menu #projectMenu="matMenu" class="hub-project-menu" [overlapTrigger]="false">
          <div class="menu-heading" role="presentation">Projects</div>
          @for (item of state.projects(); track item.id) {
            <button
              mat-menu-item
              type="button"
              [class.current]="item.id === project.id"
              (click)="openProject(item.id)"
            >
              <mat-icon>{{ item.id === project.id ? 'folder_open' : 'folder' }}</mat-icon>
              <span>{{ item.name }}</span>
            </button>
          }
          <mat-divider />
          <button mat-menu-item type="button" (click)="goHome()">
            <mat-icon>grid_view</mat-icon><span>All projects</span>
          </button>
          <button mat-menu-item type="button" (click)="newProject()">
            <mat-icon>create_new_folder</mat-icon><span>New project</span>
          </button>
        </mat-menu>

        @if (showNewChat()) {
          <hub-new-chat-button class="drawer-new-chat" [projectId]="project.id" />
        }

        <div class="list-subheader">
          <span id="chats-heading">Chats</span>
          <span class="count">{{ visibleChats().length }}</span>
          <span class="subheader-spacer"></span>
          <button
            mat-icon-button
            class="archive-toggle"
            [class.on]="state.showArchived()"
            [matTooltip]="state.showArchived() ? 'Hide archived chats' : 'Show archived chats'"
            [attr.aria-pressed]="state.showArchived()"
            aria-label="Show archived chats"
            (click)="state.setShowArchived(!state.showArchived())"
          >
            <mat-icon>inventory_2</mat-icon>
          </button>
        </div>

        <mat-nav-list aria-labelledby="chats-heading">
          @for (chat of visibleChats(); track chat.id) {
            <a
              mat-list-item
              lines="2"
              [routerLink]="['/projects', chat.project_id, 'chats', chat.id]"
              routerLinkActive="selected"
              (click)="closeRequested.emit()"
              [attr.aria-label]="'Open chat ' + (chat.title || 'Untitled chat')"
            >
              <span matListItemIcon class="status-slot">
                <span
                  class="status-dot"
                  [class.running]="chat.process_state === 'RUNNING'"
                  [class.dead]="chat.process_state === 'DEAD'"
                ></span>
              </span>
              <span matListItemTitle>{{ chat.title || 'Untitled chat' }}</span>
              <span matListItemLine>
                <span class="chat-meta">
                  <span class="agent-badge">{{ chat.agent }}</span>
                  @if (chat.archived) { <span class="archived-tag">Archived</span> }
                </span>
              </span>
            </a>
          } @empty {
            <p class="drawer-empty">
              {{ state.showArchived() ? 'No archived chats.' : 'No chats yet.' }}
            </p>
          }
        </mat-nav-list>
      }
    </div>

    <footer class="drawer-footer">
      <hub-connection-status />
      <span class="footer-spacer"></span>
      <span class="version">v0.2.0</span>
      <button
        mat-icon-button
        [matTooltip]="theme.label()"
        [attr.aria-label]="theme.label()"
        (click)="theme.cycle()"
      >
        <mat-icon>{{ theme.icon() }}</mat-icon>
      </button>
    </footer>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; background: var(--mat-sys-surface-container-low); }

    .drawer-header { display: flex; align-items: center; gap: 4px; height: 64px; padding: 0 8px 0 16px; }
    .brand { display: inline-flex; align-items: center; gap: 12px; min-width: 0; height: 48px; padding: 0 18px 0 10px; margin-left: -10px; border-radius: var(--mat-sys-corner-full); color: var(--mat-sys-on-surface); text-decoration: none; transition: background 120ms ease; }
    .brand:hover { background: var(--mat-sys-surface-container-high); }
    .brand:focus-visible { outline: 3px solid var(--mat-sys-secondary); outline-offset: 1px; }
    .header-spacer { flex: 1; }
    .brand-mark { display: grid; place-items: center; flex: 0 0 auto; width: 36px; height: 36px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); }
    .brand-mark mat-icon { width: 20px; height: 20px; font-size: 20px; }
    .brand-name { overflow: hidden; font: var(--mat-sys-title-medium); letter-spacing: var(--mat-sys-title-medium-tracking); text-overflow: ellipsis; white-space: nowrap; }
    .drawer-close { flex: 0 0 auto; }

    .drawer-body { flex: 1; min-height: 0; overflow: auto; padding: 0 12px 16px; }

    .project-switcher { --mat-button-text-label-text-color: var(--mat-sys-on-surface); --mat-button-text-icon-color: var(--mat-sys-on-surface-variant); display: flex; width: 100%; height: 56px; padding: 0 8px 0 12px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-surface-container); text-align: left; }
    .project-switcher ::ng-deep .mdc-button__label { display: flex; align-items: center; gap: 12px; width: 100%; min-width: 0; }
    .switcher-icon { display: grid; place-items: center; flex: 0 0 auto; width: 32px; height: 32px; border-radius: var(--mat-sys-corner-small); background: var(--mat-sys-surface-container-highest); color: var(--mat-sys-on-surface-variant); }
    .switcher-icon mat-icon { width: 18px; height: 18px; font-size: 18px; }
    .switcher-text { display: flex; flex-direction: column; min-width: 0; flex: 1; gap: 1px; }
    .switcher-name { overflow: hidden; font: var(--mat-sys-title-small); letter-spacing: var(--mat-sys-title-small-tracking); text-overflow: ellipsis; white-space: nowrap; }
    .switcher-path { overflow: hidden; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-small); text-align: left; text-overflow: ellipsis; white-space: nowrap; }
    .switcher-caret { flex: 0 0 auto; width: 20px; height: 20px; font-size: 20px; color: var(--mat-sys-on-surface-variant); }

    .drawer-new-chat { display: flex; margin: 16px 0 8px; }

    .list-subheader { display: flex; align-items: center; gap: 8px; height: 40px; padding-left: 16px; margin-top: 8px; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-title-small); letter-spacing: var(--mat-sys-title-small-tracking); }
    .list-subheader .count { padding: 1px 8px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-surface-container-high); font: var(--mat-sys-label-small); }
    .subheader-spacer { flex: 1; }
    .archive-toggle { --mat-icon-button-icon-color: var(--mat-sys-on-surface-variant); }
    .archive-toggle mat-icon { width: 20px; height: 20px; font-size: 20px; }
    .archive-toggle.on { --mat-icon-button-icon-color: var(--mat-sys-on-secondary-container); background: var(--mat-sys-secondary-container); }

    mat-nav-list { padding: 0; }
    mat-list-item { --mat-list-list-item-leading-icon-start-space: 16px; --mat-list-list-item-leading-icon-end-space: 16px; margin-bottom: 2px; border-radius: var(--mat-sys-corner-full); }
    mat-list-item.selected { background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); }
    mat-list-item.selected .chat-meta { color: inherit; opacity: .8; }
    .status-slot { display: grid !important; place-items: center; align-self: center !important; margin-top: 0 !important; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--hub-status-stopped); }
    .status-dot.running { background: var(--hub-status-running); }
    .status-dot.dead { background: var(--hub-status-dead); }
    .chat-meta { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; }
    .mat-mdc-list-item-line::before { display: none !important; }
    .agent-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); font: var(--mat-sys-label-small); text-transform: lowercase; }
    .archived-tag { padding: 2px 6px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-surface-container-highest); color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-small); text-transform: none; }
    mat-list-item.selected .agent-badge { background: var(--mat-sys-surface-container-highest); color: var(--mat-sys-on-surface); }
    mat-list-item.selected .archived-tag { background: var(--mat-sys-surface-container-high); color: var(--mat-sys-on-surface); }
    .drawer-empty { padding: 20px 16px; color: var(--mat-sys-on-surface-variant); text-align: center; }

    .drawer-footer { display: flex; align-items: center; gap: 8px; height: 56px; flex: 0 0 auto; padding: 0 8px 0 16px; border-top: 1px solid var(--mat-sys-outline-variant); }
    .footer-spacer { flex: 1; }
    .version { color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-medium); letter-spacing: var(--mat-sys-label-medium-tracking); }

    @media (min-width: 840px) { .drawer-close { display: none; } }
  `,
})
export class NavigationComponent {
  @Output() readonly closeRequested = new EventEmitter<void>();
  readonly state = inject(AppStateService);
  readonly theme = inject(ThemeService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  /** The project overview page carries its own button, so the drawer hides one. */
  readonly showNewChat = computed(() => this.state.activeChatId() !== null);

  visibleChats() {
    const projectId = this.state.activeProjectId();
    const chats = projectId ? this.state.chatsByProject()[projectId] ?? [] : [];
    return this.state.showArchived() ? chats : chats.filter((chat) => !chat.archived);
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
