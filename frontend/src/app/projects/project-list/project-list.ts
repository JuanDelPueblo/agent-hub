import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AppStateService } from '../../state/app-state.service';
import { DeleteProjectDialogComponent } from '../delete-project-dialog/delete-project-dialog';
import { EditProjectDialogComponent } from '../edit-project-dialog/edit-project-dialog';
import { ProjectDialogComponent } from '../project-dialog/project-dialog';
import type { Project } from '../../core/api/types';

@Component({
  selector: 'hub-project-list',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
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
