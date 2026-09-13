import { Component, Inject, inject, signal } from '@angular/core';
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
      @if (errorMessage()) { <div class="error-box" role="alert">{{ errorMessage() }}</div> }
      <p>Are you sure you want to remove <strong>“{{ project.name }}”</strong> from Agent Hub?</p>
      <p class="note">Project files on disk will <strong>not</strong> be deleted.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="deleting()">Cancel</button>
      <button mat-flat-button class="destructive" type="button" (click)="delete()" [disabled]="deleting()">
        @if (deleting()) { <mat-spinner diameter="18" /> } @else { Delete project }
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { display: flex; min-width: min(420px, calc(100vw - 48px)); flex-direction: column; gap: 8px; }
    .note { color: var(--mat-sys-on-surface-variant); }
    .error-box { padding: 12px 16px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    .destructive { --mat-button-filled-container-color: var(--mat-sys-error); --mat-button-filled-label-text-color: var(--mat-sys-on-error); --mat-button-filled-state-layer-color: var(--mat-sys-on-error); }
    @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }
  `,
})
export class DeleteProjectDialogComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<DeleteProjectDialogComponent>);
  readonly deleting = signal(false);
  readonly errorMessage = signal('');

  constructor(@Inject(MAT_DIALOG_DATA) readonly project: Project) {}

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
