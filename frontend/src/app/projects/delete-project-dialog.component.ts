import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Project } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'hub-delete-project-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Delete project</h2>
    <mat-dialog-content>
      @if (errorMessage) { <div class="error-box" role="alert">{{ errorMessage }}</div> }
      <p>Are you sure you want to remove <strong>“{{ project.name }}”</strong> from Agent Hub?</p>
      <p class="note">Project files on disk will <strong>not</strong> be deleted.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="deleting">Cancel</button>
      <button mat-flat-button color="warn" type="button" (click)="delete()" [disabled]="deleting">
        @if (deleting) { <mat-spinner diameter="18" /> } @else { Delete project }
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { min-width: min(420px, calc(100vw - 48px)); }
    .note { color: var(--mat-sys-on-surface-variant); }
    .error-box { padding: 12px 16px; border-radius: 12px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }
  `,
})
export class DeleteProjectDialogComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<DeleteProjectDialogComponent>);
  deleting = false;
  errorMessage = '';

  constructor(@Inject(MAT_DIALOG_DATA) readonly project: Project) {}

  async delete(): Promise<void> {
    this.deleting = true;
    this.errorMessage = '';
    try {
      await this.state.deleteProject(this.project.id);
      this.dialogRef.close(true);
    } catch (error: unknown) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
    } finally {
      this.deleting = false;
    }
  }
}
