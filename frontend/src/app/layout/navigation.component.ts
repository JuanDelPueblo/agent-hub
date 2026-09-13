import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppStateService } from '../state/app-state.service';
import { AgentPickerComponent } from '../agents/agent-picker.component';
import { ProjectDialogComponent } from '../projects/project-dialog.component';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'hub-navigation',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <header class="navigation-header">
      <button mat-button class="brand" type="button" aria-label="Go to projects" (click)="goHome()">
        <span class="brand-mark"><mat-icon>hub</mat-icon></span>
        <span class="brand-name">Agent Hub</span>
      </button>
      <button mat-icon-button matTooltip="Close navigation" aria-label="Close navigation" (click)="closeRequested.emit()">
        <mat-icon>close</mat-icon>
      </button>
    </header>

    <div class="navigation-body">
      <section aria-labelledby="projects-heading">
        <div class="section-heading">
          <span id="projects-heading">Projects</span>
          <button mat-icon-button matTooltip="New project" aria-label="New project" (click)="newProject()">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <mat-nav-list>
          @for (project of state.projects(); track project.id) {
            <a
              mat-list-item
              [routerLink]="['/projects', project.id]"
              routerLinkActive="selected"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeRequested.emit()"
              [attr.aria-label]="'Open project ' + project.name"
            >
              <mat-icon matListItemIcon>folder</mat-icon>
              <span matListItemTitle>{{ project.name }}</span>
            </a>
          } @empty {
            <div class="empty-navigation">No projects yet</div>
          }
        </mat-nav-list>
      </section>

      @if (state.activeProject(); as project) {
        <section class="active-project" aria-labelledby="active-project-heading">
          <div class="project-summary">
            <a id="active-project-heading" [routerLink]="['/projects', project.id]" (click)="closeRequested.emit()">{{ project.name }}</a>
            <span [title]="project.path">{{ project.path }}</span>
          </div>

          <button mat-flat-button color="primary" class="new-chat-button" (click)="newChat()">
            <mat-icon>add_comment</mat-icon>
            New chat
          </button>

          <div class="section-heading chats-heading">
            <span>Chats ({{ visibleChats().length }})</span>
            <button mat-button class="archive-toggle" (click)="state.setShowArchived(!state.showArchived())">
              {{ state.showArchived() ? 'Active only' : 'Archived' }}
            </button>
          </div>

          <mat-nav-list>
            @for (chat of visibleChats(); track chat.id) {
              <a
                mat-list-item
                [routerLink]="['/projects', chat.project_id, 'chats', chat.id]"
                routerLinkActive="selected"
                (click)="closeRequested.emit()"
                [attr.aria-label]="'Open chat ' + (chat.title || 'Untitled chat')"
              >
                <span matListItemIcon class="chat-status" [class.running]="chat.process_state === 'RUNNING'" [class.dead]="chat.process_state === 'DEAD'"></span>
                <span matListItemTitle>{{ chat.title || 'Untitled chat' }}</span>
                <span class="agent-label">{{ chat.agent }}</span>
              </a>
            } @empty {
              <div class="empty-navigation">No chats yet</div>
            }
          </mat-nav-list>
        </section>
      }
    </div>

    <footer class="navigation-footer">
      <span class="socket-state"><span class="socket-dot" [class]="state.wsStatus()"></span>{{ state.wsStatus() }}</span>
      <span class="footer-actions"><span>v0.2.0</span><button mat-icon-button [matTooltip]="theme.label()" [attr.aria-label]="theme.label()" (click)="theme.cycle()"><mat-icon>{{ theme.icon() }}</mat-icon></button></span>
    </footer>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; min-width: 280px; background: var(--mat-sys-surface-container-low); }
    .navigation-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 18px 16px 12px; }
    .brand { display: inline-flex; align-items: center; gap: 12px; border: 0; padding: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; }
    .brand-mark { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 16px 16px 16px 4px; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); }
    .brand-name { font-size: 1.25rem; font-weight: 600; }
    .navigation-body { flex: 1; overflow: auto; padding: 8px 12px 20px; }
    .section-heading { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; color: var(--mat-sys-on-surface-variant); font-size: .8rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
    .section-heading button { flex: 0 0 auto; }
    mat-nav-list { padding: 0; }
    mat-list-item { margin: 2px 0; border-radius: 12px; }
    mat-list-item.selected { background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); }
    .empty-navigation { padding: 12px; color: var(--mat-sys-outline); font-size: .875rem; text-align: center; }
    .active-project { margin-top: 20px; }
    .project-summary { display: flex; flex-direction: column; gap: 2px; padding: 12px; margin-bottom: 10px; border-radius: 12px; background: var(--mat-sys-surface-container); }
    .project-summary a { color: inherit; font-weight: 600; text-decoration: none; }
    .project-summary span { overflow: hidden; color: var(--mat-sys-on-surface-variant); font-size: .75rem; text-overflow: ellipsis; white-space: nowrap; }
    .new-chat-button { width: 100%; margin: 2px 0 16px; }
    .chats-heading { padding-right: 0; }
    .archive-toggle { min-width: 0; }
    .chat-status { width: 8px; height: 8px; margin: 0 16px 0 8px; border-radius: 50%; background: var(--hub-status-stopped); }
    .chat-status.running { background: var(--hub-status-running); }
    .chat-status.dead { background: var(--hub-status-dead); }
    .agent-label { margin-left: auto; color: var(--mat-sys-on-surface-variant); font-size: .72rem; text-transform: lowercase; }
    .navigation-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--mat-sys-outline-variant); color: var(--mat-sys-on-surface-variant); font-size: .75rem; }
    .socket-state { display: inline-flex; align-items: center; gap: 6px; text-transform: capitalize; }
    .socket-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--hub-status-dead); }
    .socket-dot.connected { background: var(--hub-status-running); }
    .socket-dot.connecting { background: var(--hub-status-starting); }
    @media (min-width: 840px) { :host > .navigation-header > button:last-child { visibility: hidden; } }
  `,
})
export class NavigationComponent {
  @Output() readonly closeRequested = new EventEmitter<void>();
  readonly state = inject(AppStateService);
  readonly theme = inject(ThemeService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  visibleChats() {
    const projectId = this.state.activeProjectId();
    const chats = projectId ? this.state.chatsByProject()[projectId] ?? [] : [];
    return this.state.showArchived() ? chats : chats.filter((chat) => !chat.archived);
  }

  goHome(): void {
    void this.router.navigate(['/']);
    this.closeRequested.emit();
  }

  newProject(): void {
    this.dialog.open(ProjectDialogComponent, { width: 'min(720px, calc(100vw - 32px))' });
    this.closeRequested.emit();
  }

  newChat(): void {
    const projectId = this.state.activeProjectId();
    if (!projectId) return;
    this.dialog.open(AgentPickerComponent, {
      width: 'min(560px, calc(100vw - 32px))',
      data: { projectId },
    });
    this.closeRequested.emit();
  }
}
