import { Component, Inject, computed, inject, signal } from '@angular/core';
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
      @if (errorMessage()) { <div class="error-box" role="alert">{{ errorMessage() }}</div> }
      <mat-form-field appearance="outline">
        <mat-label>Project display name</mat-label>
        <input matInput [ngModel]="name()" (ngModelChange)="name.set($event)" autocomplete="off" />
      </mat-form-field>
      <p class="field-label">Project directory</p>
      <hub-folder-picker [initialPath]="project.path" (folderBrowsed)="browsedPath.set($event.path)" (folderSelected)="selectedPath.set($event.path)" />
      @if (browsedPath() && browsedPath() !== selectedPath()) {
        <div class="path-note">Browsing: <code>{{ browsedPath() }}</code><br />Select the current folder to use it.</div>
      }
      @if (selectedPath()) { <div class="selected-path"><strong>Selected directory</strong><code>{{ selectedPath() }}</code></div> }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="saving()">Cancel</button>
      <button mat-flat-button type="button" (click)="save()" [disabled]="!canSave()">Save changes</button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { display: flex; min-width: min(520px, calc(100vw - 48px)); flex-direction: column; gap: 12px; }
    mat-form-field { width: 100%; }
    .field-label { margin: 4px 0 -4px; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-title-small); }
    .path-note, .selected-path, .error-box { padding: 12px 16px; border-radius: var(--mat-sys-corner-medium); }
    .path-note, .selected-path { background: var(--mat-sys-surface-container); color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-small); }
    .selected-path { display: flex; flex-direction: column; gap: 4px; }
    code { overflow-wrap: anywhere; }
    .error-box { background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }
  `,
})
export class EditProjectDialogComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<EditProjectDialogComponent>);
  readonly name = signal('');
  readonly selectedPath = signal('');
  readonly browsedPath = signal('');
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly canSave = computed(
    () => !!this.name().trim() && !!this.selectedPath() && !this.saving(),
  );

  constructor(@Inject(MAT_DIALOG_DATA) readonly project: Project) {
    this.name.set(project.name);
    this.selectedPath.set(project.path);
  }

  async save(): Promise<void> {
    if (!this.name().trim() || !this.selectedPath()) {
      this.errorMessage.set('Please provide both project name and directory path.');
      return;
    }
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      await this.state.editProject(this.project.id, this.name().trim(), this.selectedPath().trim());
      this.dialogRef.close();
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to update project');
    } finally {
      this.saving.set(false);
    }
  }
}
