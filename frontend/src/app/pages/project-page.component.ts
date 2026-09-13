import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import type { Project } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';
import { NewChatButtonComponent } from '../chats/new-chat-button.component';
import { DeleteProjectDialogComponent } from '../projects/delete-project-dialog.component';
import { EditProjectDialogComponent } from '../projects/edit-project-dialog.component';

@Component({
  selector: 'hub-project-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NewChatButtonComponent,
    RouterLink,
  ],
  template: `
    @if (project(); as current) {
      <section class="project-page">
        <header class="page-header">
          <div class="header-title">
            <div class="title-text">
              <h1>{{ current.name }}</h1>
              <code [title]="current.path">{{ current.path }}</code>
            </div>
          </div>
          <div class="header-actions">
            <hub-new-chat-button [projectId]="current.id" />
            <button
              mat-icon-button
              [matMenuTriggerFor]="projectActions"
              aria-label="Project actions"
            >
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #projectActions="matMenu">
              <button mat-menu-item type="button" (click)="edit(current)">
                <mat-icon>edit</mat-icon>
                <span>Edit project</span>
              </button>
              <button mat-menu-item type="button" (click)="remove(current)">
                <mat-icon class="destructive-icon">delete</mat-icon>
                <span>Delete project</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <div class="section-bar">
          <h2>Chats</h2>
          <span class="count">{{ visibleChats().length }}</span>
          <span class="section-spacer"></span>
          <button
            mat-button
            class="archive-filter"
            [class.on]="state.showArchived()"
            (click)="state.setShowArchived(!state.showArchived())"
            [attr.aria-pressed]="state.showArchived()"
          >
            <mat-icon>{{ state.showArchived() ? 'inventory_2' : 'archive' }}</mat-icon>
            <span>{{ state.showArchived() ? 'Showing archived' : 'Show archived' }}</span>
          </button>
        </div>

        @if (visibleChats().length) {
          <div class="chat-grid">
            @for (chat of visibleChats(); track chat.id) {
              <mat-card appearance="outlined" class="chat-card">
                <a
                  [routerLink]="['/projects', current.id, 'chats', chat.id]"
                  [attr.aria-label]="'Open chat ' + (chat.title || 'Untitled chat')"
                >
                  <div class="chat-top">
                    <span class="agent-badge">{{ chat.agent }}</span>
                    @if (chat.archived) { <span class="archived-tag">Archived</span> }
                  </div>
                  <h3 class="chat-title">{{ chat.title || 'Untitled chat' }}</h3>
                  <div
                    class="chat-state"
                    [class.running]="chat.process_state === 'RUNNING'"
                    [class.dead]="chat.process_state === 'DEAD'"
                  >
                    <span class="state-dot"></span>{{ stateLabel(chat.process_state) }}
                  </div>
                </a>
              </mat-card>
            }
          </div>
        } @else {
          <div class="empty-chat">
            <mat-icon>forum</mat-icon>
            <h3>{{ state.showArchived() ? 'No archived chats' : 'No chats in this project yet' }}</h3>
            <p>Start a chat and pick the ACP agent that runs it.</p>
            @if (!state.showArchived()) { <hub-new-chat-button [projectId]="current.id" /> }
          </div>
        }
      </section>
    } @else {
      <section class="missing">
        <mat-icon>folder_off</mat-icon>
        <h1>Project not found</h1>
        <p>This project was deleted, or the address is not correct.</p>
        <a mat-flat-button routerLink="/">Back to projects</a>
      </section>
    }
  `,
  styles: `
    :host { display: block; min-height: 0; flex: 1; overflow: auto; }
    .destructive-icon { color: var(--mat-sys-error); }
    .project-page { max-width: var(--hub-page-max); margin: 0 auto; padding: 32px var(--hub-page-gutter) 72px; }

    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 40px; }
    .header-title { display: flex; align-items: flex-start; gap: 8px; min-width: 0; }
    .title-text { min-width: 0; }
    h1 { font: var(--mat-sys-display-small); letter-spacing: var(--mat-sys-display-small-tracking); overflow-wrap: anywhere; }
    .title-text code { display: block; margin-top: 8px; overflow: hidden; color: var(--mat-sys-on-surface-variant); font-size: .8125rem; text-overflow: ellipsis; white-space: nowrap; }
    .header-actions { display: flex; align-items: center; gap: 4px; flex: 0 0 auto; padding-top: 4px; }

    .section-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .section-bar h2 { font: var(--mat-sys-title-large); letter-spacing: var(--mat-sys-title-large-tracking); }
    .section-bar .count { padding: 2px 10px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-surface-container-high); color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-medium); }
    .section-spacer { flex: 1; }
    .archive-filter { --mat-button-text-label-text-color: var(--mat-sys-on-surface-variant); --mat-button-text-icon-color: var(--mat-sys-on-surface-variant); }
    .archive-filter.on { --mat-button-text-label-text-color: var(--mat-sys-on-secondary-container); --mat-button-text-icon-color: var(--mat-sys-on-secondary-container); background: var(--mat-sys-secondary-container); }

    .chat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(268px, 1fr)); gap: 16px; }
    .chat-card { border-radius: var(--mat-sys-corner-large); transition: background 160ms ease, border-color 160ms ease; }
    .chat-card:hover { background: var(--mat-sys-surface-container-high); border-color: var(--mat-sys-outline); }
    .chat-card a { display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 20px; color: inherit; text-decoration: none; }
    .chat-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .agent-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); font: var(--mat-sys-label-medium); }
    .archived-tag { padding: 3px 10px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-surface-container-highest); color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-small); }
    .chat-title { display: -webkit-box; overflow: hidden; font: var(--mat-sys-title-medium); letter-spacing: var(--mat-sys-title-medium-tracking); -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
    .chat-state { display: inline-flex; align-items: center; gap: 7px; margin-top: auto; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-medium); }
    .chat-state .state-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .chat-state.running { color: var(--hub-status-running); }
    .chat-state.dead { color: var(--hub-status-dead); }

    .empty-chat, .missing { display: grid; justify-items: center; gap: 12px; padding: 56px 24px; border-radius: var(--mat-sys-corner-large); background: var(--mat-sys-surface-container-low); text-align: center; }
    .empty-chat mat-icon, .missing mat-icon { width: 40px; height: 40px; font-size: 40px; color: var(--mat-sys-on-surface-variant); }
    .empty-chat p, .missing p { color: var(--mat-sys-on-surface-variant); }
    .empty-chat hub-new-chat-button, .missing a { margin-top: 12px; }
    .missing { max-width: 520px; margin: 64px auto; }

    @media (max-width: 599px) {
      .project-page { padding: 16px var(--hub-page-gutter) 56px; }
      .page-header { align-items: stretch; flex-direction: column; gap: 16px; margin-bottom: 28px; }
      h1 { font: var(--mat-sys-headline-medium); }
      .header-actions { padding-top: 0; }
      .header-actions hub-new-chat-button { flex: 1; }
      .chat-grid { grid-template-columns: 1fr; }
    }
  `,
})
export class ProjectPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly state = inject(AppStateService);
  readonly compact = signal(false);
  private readonly dialog = inject(MatDialog);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  readonly projectId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('projectId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('projectId') ?? '' },
  );
  readonly project = computed(
    () => this.state.projects().find((item) => item.id === this.projectId()) ?? null,
  );
  readonly chats = computed(() => this.state.chatsByProject()[this.projectId()] ?? []);
  readonly visibleChats = computed(() =>
    this.state.showArchived() ? this.chats() : this.chats().filter((chat) => !chat.archived),
  );

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) void this.state.loadChats(id);
    });
    this.breakpointObserver
      .observe('(max-width: 839px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => this.compact.set(matches));
  }

  stateLabel(processState: string | null | undefined): string {
    const value = processState ?? 'STOPPED';
    return value.charAt(0) + value.slice(1).toLowerCase();
  }

  edit(project: Project): void {
    this.dialog.open(EditProjectDialogComponent, { width: 'min(640px, calc(100vw - 32px))', panelClass: 'hub-wide-dialog', data: project });
  }

  remove(project: Project): void {
    this.dialog.open(DeleteProjectDialogComponent, { width: 'min(520px, calc(100vw - 32px))', data: project });
  }
}
