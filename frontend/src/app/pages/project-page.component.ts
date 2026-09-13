import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import type { Project } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';
import { AgentPickerComponent } from '../agents/agent-picker.component';
import { DeleteProjectDialogComponent } from '../projects/delete-project-dialog.component';
import { EditProjectDialogComponent } from '../projects/edit-project-dialog.component';

@Component({
  selector: 'hub-project-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatMenuModule, RouterLink],
  template: `
    @if (project(); as current) {
      <section class="project-page">
        <div class="hero"><div><p class="eyebrow">Project</p><h1>{{ current.name }}</h1><code>{{ current.path }}</code></div><div class="hero-actions"><button mat-flat-button type="button" (click)="newChat(current.id)"><mat-icon>add_comment</mat-icon> New chat</button><button mat-icon-button [matMenuTriggerFor]="projectActions" aria-label="Project actions"><mat-icon>more_vert</mat-icon></button><mat-menu #projectActions="matMenu"><button mat-menu-item type="button" (click)="edit(current)"><mat-icon>edit</mat-icon><span>Edit project</span></button><button mat-menu-item type="button" (click)="remove(current)"><mat-icon class="destructive-icon">delete</mat-icon><span>Delete project</span></button></mat-menu></div></div>
        <div class="section-title"><h2>Chats in this project</h2><span>{{ chats().length }} chats</span></div>
        @if (chats().length) {
          <div class="chat-grid">@for (chat of chats(); track chat.id) {<mat-card class="chat-card"><a [routerLink]="['/projects', current.id, 'chats', chat.id]" [attr.aria-label]="'Open chat ' + (chat.title || 'Untitled chat')"><div class="chat-top"><span class="agent-badge">{{ chat.agent }}</span><span class="process-state" [class.running]="chat.process_state === 'RUNNING'" [class.dead]="chat.process_state === 'DEAD'">{{ chat.process_state || 'STOPPED' }}</span></div><mat-card-title>{{ chat.title || 'Untitled chat' }}</mat-card-title></a></mat-card>}</div>
        } @else { <mat-card class="empty-chat"><mat-icon>forum</mat-icon><h2>No chats in this project yet</h2><p>Start a new chat with an ACP agent.</p><button mat-flat-button type="button" (click)="newChat(current.id)"><mat-icon>add_comment</mat-icon> New chat</button></mat-card> }
      </section>
    } @else { <section class="missing"><mat-icon>folder_off</mat-icon><h1>Project not found</h1><p>This project may have been deleted or the URL is malformed.</p><a mat-flat-button routerLink="/">Back to projects</a></section> }
  `,
  styles: `
    .destructive-icon { color: var(--mat-sys-error); }
    :host { display: block; min-height: 0; flex: 1; overflow: auto; } .project-page { max-width: 1120px; margin: 0 auto; padding: 40px 32px 72px; }
    .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 32px; margin-bottom: 36px; border-radius: var(--mat-sys-corner-extra-large); background: linear-gradient(120deg, var(--mat-sys-surface-container-low), var(--mat-sys-primary-container)); } .eyebrow { margin-bottom: 6px; color: var(--mat-sys-primary); font: var(--mat-sys-label-large); letter-spacing: .08em; text-transform: uppercase; } h1 { margin-bottom: 8px; font: var(--mat-sys-display-small); letter-spacing: var(--mat-sys-display-small-tracking); } code { overflow-wrap: anywhere; color: var(--mat-sys-on-surface-variant); }
    .hero-actions { display: flex; align-items: center; gap: 8px; } .section-title { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 16px; } .section-title h2 { font: var(--mat-sys-headline-small); letter-spacing: var(--mat-sys-headline-small-tracking); } .section-title span { color: var(--mat-sys-on-surface-variant); }
    .chat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; } .chat-card { transition: transform 160ms ease, box-shadow 160ms ease; } .chat-card:hover { transform: translateY(-2px); box-shadow: var(--mat-sys-level2); } .chat-card a { display: block; padding: 20px; color: inherit; text-decoration: none; } .chat-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 26px; } .agent-badge { padding: 5px 10px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); font: var(--mat-sys-label-medium); } .process-state { color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-small); } .process-state.running { color: var(--hub-status-running); } .process-state.dead { color: var(--hub-status-dead); }
    .empty-chat, .missing { display: grid; justify-items: center; gap: 12px; padding: 56px 24px; text-align: center; } .empty-chat mat-icon, .missing mat-icon { width: 48px; height: 48px; font-size: 48px; color: var(--mat-sys-primary); } .empty-chat h2, .empty-chat p, .missing h1, .missing p { margin: 0; } .empty-chat p, .missing p { color: var(--mat-sys-on-surface-variant); }
    @media (max-width: 599px) { .project-page { padding: 24px 16px 56px; } .hero { align-items: stretch; flex-direction: column; padding: 24px; } .hero-actions button:first-child { flex: 1; } .section-title { align-items: flex-start; flex-direction: column; gap: 4px; } .chat-grid { grid-template-columns: 1fr; } }
  `,
})
export class ProjectPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly state = inject(AppStateService);
  private readonly dialog = inject(MatDialog);
  readonly projectId = toSignal(this.route.paramMap.pipe(map((params) => params.get('projectId') ?? '')), { initialValue: this.route.snapshot.paramMap.get('projectId') ?? '' });
  readonly project = computed(() => this.state.projects().find((item) => item.id === this.projectId()) ?? null);
  readonly chats = computed(() => this.state.chatsByProject()[this.projectId()] ?? []);
  constructor() { effect(() => { const id = this.projectId(); if (id) void this.state.loadChats(id); }); }
  newChat(projectId: string): void { this.dialog.open(AgentPickerComponent, { width: 'min(560px, calc(100vw - 32px))', data: { projectId } }); }
  edit(project: Project): void { this.dialog.open(EditProjectDialogComponent, { width: 'min(640px, calc(100vw - 32px))', data: project }); }
  remove(project: Project): void { this.dialog.open(DeleteProjectDialogComponent, { width: 'min(520px, calc(100vw - 32px))', data: project }); }
}
