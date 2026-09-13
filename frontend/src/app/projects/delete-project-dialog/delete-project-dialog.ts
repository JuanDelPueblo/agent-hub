import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Project } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-delete-project-dialog',
  imports: [MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './delete-project-dialog.html',
  styleUrl: './delete-project-dialog.scss',
})
export class DeleteProjectDialogComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<DeleteProjectDialogComponent>);
  readonly deleting = signal(false);
  readonly errorMessage = signal('');

  readonly project = inject<Project>(MAT_DIALOG_DATA);

  async delete(): Promise<void> {
    this.deleting.set(true);
    this.errorMessage.set('');
    try {
      await this.state.deleteProject(this.project.id);
      this.dialogRef.close(true);
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to delete project');
    } finally {
      this.deleting.set(false);
    }
  }
}
