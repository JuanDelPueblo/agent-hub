import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AppStateService } from '../state/app-state.service';
import { DeleteProjectDialogComponent } from './delete-project-dialog.component';
import { EditProjectDialogComponent } from './edit-project-dialog.component';
import { ProjectDialogComponent } from './project-dialog.component';
import type { Project } from '../core/api/types';

@Component({
  selector: 'hub-project-list',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, RouterLink],
  template: `
    <section class="projects-page" aria-labelledby="projects-title">
      <div class="page-header">
        <div><h1 id="projects-title">Projects</h1><p>Manage code repositories and active ACP agent sessions.</p></div>
        <button mat-flat-button type="button" (click)="newProject()"><mat-icon>add</mat-icon> New project</button>
      </div>
      @if (state.loadingProjects()) {
        <div class="loading" role="status"><mat-spinner diameter="36" /><span>Loading projects…</span></div>
      } @else if (state.projectsError()) {
        <div class="error-box" role="alert">{{ state.projectsError() }}</div>
      } @else if (state.projects().length === 0) {
        <mat-card class="empty-card"><mat-icon>folder_open</mat-icon><h2>No projects yet</h2><p>Create a project from an existing server directory or clone a Git repository.</p><button mat-flat-button type="button" (click)="newProject()"><mat-icon>add</mat-icon> Create your first project</button></mat-card>
      } @else {
        <div class="project-grid">
          @for (project of state.projects(); track project.id) {
            <mat-card appearance="outlined" class="project-card">
              <a class="card-link" [routerLink]="['/projects', project.id]" [attr.aria-label]="'Open project ' + project.name">
                <div class="project-icon"><mat-icon>folder</mat-icon></div>
                <mat-card-header><mat-card-title>{{ project.name }}</mat-card-title><mat-card-subtitle [title]="project.path">{{ project.path }}</mat-card-subtitle></mat-card-header>
              </a>
              <button mat-icon-button [matMenuTriggerFor]="projectMenu" [matMenuTriggerData]="{ project }" [attr.aria-label]="'Actions for ' + project.name"><mat-icon>more_vert</mat-icon></button>
              <div class="card-meta"><span><mat-icon>chat</mat-icon>{{ chatCount(project) }} chats</span><span>Updated {{ formatDate(project.updated_at) }}</span></div>
            </mat-card>
          }
        </div>
      }
      <mat-menu #projectMenu="matMenu">
        <ng-template matMenuContent let-project="project">
          <button mat-menu-item type="button" (click)="edit(project)"><mat-icon>edit</mat-icon><span>Edit project</span></button>
          <button mat-menu-item type="button" (click)="remove(project)"><mat-icon class="destructive-icon">delete</mat-icon><span>Delete project</span></button>
        </ng-template>
      </mat-menu>
      <button mat-fab extended class="mobile-fab" type="button" (click)="newProject()"><mat-icon>add</mat-icon> New project</button>
    </section>
  `,
  styles: `
    .destructive-icon { color: var(--mat-sys-error); }
    :host { display: block; min-height: 0; flex: 1; overflow: auto; }
    .projects-page { max-width: var(--hub-page-max); margin: 0 auto; padding: 24px var(--hub-page-gutter) 72px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 32px; }
    h1 { font: var(--mat-sys-display-small); letter-spacing: var(--mat-sys-display-small-tracking); } .page-header p { margin-top: 10px; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-large); }
    .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .project-card { position: relative; min-height: 184px; padding: 20px; border-radius: var(--mat-sys-corner-large); transition: background 160ms ease, border-color 160ms ease; } .project-card:hover { background: var(--mat-sys-surface-container-high); border-color: var(--mat-sys-outline); }
    .card-link { display: block; padding-right: 34px; color: inherit; text-decoration: none; } .project-card > button { position: absolute; top: 12px; right: 12px; }
    .project-icon { display: grid; place-items: center; width: 48px; height: 48px; margin-bottom: 16px; border-radius: 16px 16px 16px 4px; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); }
    mat-card-header { padding: 0; } mat-card-title, mat-card-subtitle { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .card-meta { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-medium); } .card-meta span { display: inline-flex; align-items: center; gap: 5px; min-width: 0; } .card-meta mat-icon { width: 17px; height: 17px; font-size: 17px; }
    .empty-card { display: grid; justify-items: center; gap: 12px; padding: 64px 24px; text-align: center; } .empty-card > mat-icon { width: 48px; height: 48px; font-size: 48px; color: var(--mat-sys-primary); } .empty-card h2, .empty-card p { margin: 0; } .empty-card p { max-width: 440px; color: var(--mat-sys-on-surface-variant); }
    .loading { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 72px; color: var(--mat-sys-on-surface-variant); } .error-box { padding: 16px; border-radius: var(--mat-sys-corner-large); background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    .mobile-fab { display: none; } @media (max-width: 599px) { .projects-page { padding: 16px var(--hub-page-gutter) 96px; } .page-header { flex-direction: column; } .page-header > button { width: 100%; } .project-grid { grid-template-columns: 1fr; } .mobile-fab { display: inline-flex; position: fixed; right: 20px; bottom: 20px; z-index: 4; } }
  `,
})
export class ProjectListComponent {
  readonly state = inject(AppStateService);
  private readonly dialog = inject(MatDialog);
  newProject(): void { this.dialog.open(ProjectDialogComponent, { width: 'min(720px, calc(100vw - 32px))', panelClass: 'hub-wide-dialog' }); }
  edit(project: Project): void { this.dialog.open(EditProjectDialogComponent, { width: 'min(640px, calc(100vw - 32px))', panelClass: 'hub-wide-dialog', data: project }); }
  remove(project: Project): void { this.dialog.open(DeleteProjectDialogComponent, { width: 'min(520px, calc(100vw - 32px))', data: project }); }
  chatCount(project: Project): number { return project.chat_count ?? this.state.chatsByProject()[project.id]?.length ?? 0; }
  formatDate(value: string): string { if (!value) return ''; const date = new Date(value); return Number.isNaN(date.valueOf()) ? '' : date.toLocaleDateString([], { month: 'short', day: 'numeric' }); }
}
