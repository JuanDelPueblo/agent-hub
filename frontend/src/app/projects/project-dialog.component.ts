import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AppStateService } from '../state/app-state.service';
import { FolderPickerComponent } from './folder-picker.component';

@Component({
  selector: 'hub-project-dialog',
  standalone: true,
  imports: [
    FormsModule,
    FolderPickerComponent,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatTabsModule,
  ],
  template: `
    <h2 mat-dialog-title>New project</h2>
    <mat-dialog-content>
      @if (errorMessage) { <div class="error-box" role="alert">{{ errorMessage }}</div> }
      <mat-tab-group [(selectedIndex)]="modeIndex">
        <mat-tab label="Existing folder">
          <div class="tab-content">
            <p class="help">Choose a directory already available on the server.</p>
            <hub-folder-picker (folderBrowsed)="folderBrowsed($event)" (folderSelected)="folderSelected($event)" />
            @if (browsedPath && browsedPath !== selectedPath) {
              <div class="path-note">Browsing: <code>{{ browsedPath }}</code><br />Select the current folder to use it.</div>
            }
            @if (selectedPath) {
              <div class="selected-path"><strong>Selected directory</strong><code>{{ selectedPath }}</code></div>
              <mat-form-field appearance="outline">
                <mat-label>Project display name</mat-label>
                <input matInput [(ngModel)]="projectName" (ngModelChange)="projectNameEdited = true" autocomplete="off" />
              </mat-form-field>
            }
          </div>
        </mat-tab>
        <mat-tab label="Clone repository">
          <div class="tab-content">
            <mat-form-field appearance="outline">
              <mat-label>Git repository URL (HTTPS or SSH)</mat-label>
              <input matInput [(ngModel)]="repoUrl" placeholder="https://github.com/org/repo.git" autocomplete="off" />
              <mat-hint>Plain HTTP URLs are not accepted by the server.</mat-hint>
            </mat-form-field>
            <p class="field-label">Destination parent directory</p>
            <hub-folder-picker (folderBrowsed)="cloneFolderBrowsed($event)" (folderSelected)="cloneFolderSelected($event)" />
            @if (cloneBrowsedPath && cloneBrowsedPath !== cloneParentPath) {
              <div class="path-note">Browsing: <code>{{ cloneBrowsedPath }}</code><br />Select the current folder to use it.</div>
            }
            @if (cloneParentPath) { <div class="selected-path"><strong>Parent path</strong><code>{{ cloneParentPath }}</code></div> }
            <mat-form-field appearance="outline">
              <mat-label>Project / folder name (optional)</mat-label>
              <input matInput [(ngModel)]="cloneProjectName" autocomplete="off" />
            </mat-form-field>
            @if (cloning) { <mat-progress-bar mode="indeterminate" aria-label="Cloning repository" /> }
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="cloning">Cancel</button>
      @if (modeIndex === 0) {
        <button mat-flat-button color="primary" type="button" (click)="createFromFolder()" [disabled]="!selectedPath || !projectName.trim()">Create project</button>
      } @else {
        <button mat-flat-button color="primary" type="button" (click)="cloneRepository()" [disabled]="!repoUrl.trim() || !cloneParentPath || cloning">Clone & create</button>
      }
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { min-width: min(600px, calc(100vw - 48px)); max-height: min(680px, 70vh); }
    .tab-content { display: flex; flex-direction: column; gap: 14px; padding: 22px 4px 8px; }
    mat-form-field { width: 100%; }
    .help, .field-label { margin: 0; color: var(--mat-sys-on-surface-variant); font-size: .9rem; }
    .field-label { font-weight: 600; }
    .path-note, .selected-path { padding: 10px 12px; border-radius: 10px; background: var(--mat-sys-surface-container); color: var(--mat-sys-on-surface-variant); font-size: .82rem; }
    .selected-path { display: flex; flex-direction: column; gap: 4px; }
    code { overflow-wrap: anywhere; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
    .error-box { padding: 12px 16px; border-radius: 12px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }
  `,
})
export class ProjectDialogComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<ProjectDialogComponent>);
  private readonly router = inject(Router);
  modeIndex = 0;
  projectName = '';
  projectNameEdited = false;
  selectedPath = '';
  browsedPath = '';
  repoUrl = '';
  cloneParentPath = '';
  cloneBrowsedPath = '';
  cloneProjectName = '';
  cloning = false;
  errorMessage = '';

  constructor(@Inject(MAT_DIALOG_DATA) _data: unknown) {}

  folderBrowsed(event: { path: string }): void { this.browsedPath = event.path; }
  folderSelected(event: { path: string; name: string }): void {
    this.selectedPath = event.path;
    if (!this.projectNameEdited) this.projectName = event.name;
  }
  cloneFolderBrowsed(event: { path: string }): void { this.cloneBrowsedPath = event.path; }
  cloneFolderSelected(event: { path: string }): void { this.cloneParentPath = event.path; }

  async createFromFolder(): Promise<void> {
    if (!this.selectedPath || !this.projectName.trim()) {
      this.errorMessage = 'Please select a folder and specify a project name.';
      return;
    }
    try {
      this.errorMessage = '';
      const project = await this.state.createProject(this.projectName.trim(), this.selectedPath);
      this.dialogRef.close(project);
      await this.router.navigate(['/projects', project.id]);
    } catch (error: unknown) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to create project';
    }
  }

  async cloneRepository(): Promise<void> {
    if (!this.repoUrl.trim() || !this.cloneParentPath) {
      this.errorMessage = 'Please provide repository URL and destination parent directory.';
      return;
    }
    this.cloning = true;
    this.errorMessage = '';
    try {
      const project = await this.state.cloneProject({ url: this.repoUrl.trim(), parent_path: this.cloneParentPath, name: this.cloneProjectName.trim() || undefined });
      this.dialogRef.close(project);
      await this.router.navigate(['/projects', project.id]);
    } catch (error: unknown) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to clone repository';
    } finally {
      this.cloning = false;
    }
  }
}
