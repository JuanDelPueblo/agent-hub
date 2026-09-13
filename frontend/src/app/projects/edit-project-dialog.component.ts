import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppStateService } from '../state/app-state.service';
import { Project } from '../core/api/types';
import { FolderPickerComponent } from './folder-picker.component';

@Component({
  selector: 'hub-edit-project-dialog',
  standalone: true,
  imports: [FormsModule, FolderPickerComponent, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Edit project</h2>
    <mat-dialog-content>
      @if (errorMessage) { <div class="error-box" role="alert">{{ errorMessage }}</div> }
      <mat-form-field appearance="outline"><mat-label>Project display name</mat-label><input matInput [(ngModel)]="name" autocomplete="off" /></mat-form-field>
      <p class="field-label">Project directory</p>
      <hub-folder-picker [initialPath]="project.path" (folderBrowsed)="browsedPath = $event.path" (folderSelected)="selectedPath = $event.path" />
      @if (browsedPath && browsedPath !== selectedPath) { <div class="path-note">Browsing: <code>{{ browsedPath }}</code><br />Select the current folder to use it.</div> }
      @if (selectedPath) { <div class="selected-path"><strong>Selected directory</strong><code>{{ selectedPath }}</code></div> }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="saving">Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="save()" [disabled]="!name.trim() || !selectedPath || saving">Save changes</button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { min-width: min(520px, calc(100vw - 48px)); display: flex; flex-direction: column; gap: 12px; }
    mat-form-field { width: 100%; }
    .field-label { margin: 4px 0 -4px; color: var(--mat-sys-on-surface-variant); font-weight: 600; }
    .path-note, .selected-path, .error-box { padding: 12px 16px; border-radius: 12px; }
    .path-note, .selected-path { background: var(--mat-sys-surface-container); color: var(--mat-sys-on-surface-variant); font-size: .82rem; }
    .selected-path { display: flex; flex-direction: column; gap: 4px; }
    code { overflow-wrap: anywhere; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
    .error-box { background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }
  `,
})
export class EditProjectDialogComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<EditProjectDialogComponent>);
  name: string;
  selectedPath: string;
  browsedPath = '';
  saving = false;
  errorMessage = '';

  constructor(@Inject(MAT_DIALOG_DATA) readonly project: Project) {
    this.name = project.name;
    this.selectedPath = project.path;
  }

  async save(): Promise<void> {
    if (!this.name.trim() || !this.selectedPath) {
      this.errorMessage = 'Please provide both project name and directory path.';
      return;
    }
    this.saving = true;
    this.errorMessage = '';
    try {
      await this.state.editProject(this.project.id, this.name.trim(), this.selectedPath.trim());
      this.dialogRef.close();
    } catch (error: unknown) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to update project';
    } finally {
      this.saving = false;
    }
  }
}
