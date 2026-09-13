import { Component, Inject, inject, signal } from '@angular/core';
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
      @if (errorMessage()) { <div class="error-box" role="alert">{{ errorMessage() }}</div> }
      <mat-tab-group [selectedIndex]="modeIndex()" (selectedIndexChange)="modeIndex.set($event)">
        <mat-tab label="Existing folder">
          <div class="tab-content">
            <p class="help">Choose a directory already available on the server.</p>
            <hub-folder-picker (folderBrowsed)="folderBrowsed($event)" (folderSelected)="folderSelected($event)" />
            @if (browsedPath() && browsedPath() !== selectedPath()) {
              <div class="path-note">Browsing: <code>{{ browsedPath() }}</code><br />Select the current folder to use it.</div>
            }
            @if (selectedPath()) {
              <div class="selected-path"><strong>Selected directory</strong><code>{{ selectedPath() }}</code></div>
              <mat-form-field appearance="outline">
                <mat-label>Project display name</mat-label>
                <input matInput [ngModel]="projectName()" (ngModelChange)="editProjectName($event)" autocomplete="off" />
              </mat-form-field>
            }
          </div>
        </mat-tab>
        <mat-tab label="Clone repository">
          <div class="tab-content">
            <mat-form-field appearance="outline">
              <mat-label>Git repository URL (HTTPS or SSH)</mat-label>
              <input matInput [ngModel]="repoUrl()" (ngModelChange)="repoUrl.set($event)" placeholder="https://github.com/org/repo.git" autocomplete="off" />
              <mat-hint>Plain HTTP URLs are not accepted by the server.</mat-hint>
            </mat-form-field>
            <p class="field-label">Destination parent directory</p>
            <hub-folder-picker (folderBrowsed)="cloneBrowsedPath.set($event.path)" (folderSelected)="cloneParentPath.set($event.path)" />
            @if (cloneBrowsedPath() && cloneBrowsedPath() !== cloneParentPath()) {
              <div class="path-note">Browsing: <code>{{ cloneBrowsedPath() }}</code><br />Select the current folder to use it.</div>
            }
            @if (cloneParentPath()) { <div class="selected-path"><strong>Parent path</strong><code>{{ cloneParentPath() }}</code></div> }
            <mat-form-field appearance="outline">
              <mat-label>Project / folder name (optional)</mat-label>
              <input matInput [ngModel]="cloneProjectName()" (ngModelChange)="cloneProjectName.set($event)" autocomplete="off" />
            </mat-form-field>
            @if (cloning()) { <mat-progress-bar mode="indeterminate" aria-label="Cloning repository" /> }
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="cloning()">Cancel</button>
      @if (modeIndex() === 0) {
        <button mat-flat-button type="button" (click)="createFromFolder()" [disabled]="!selectedPath() || !projectName().trim()">Create project</button>
      } @else {
        <button mat-flat-button type="button" (click)="cloneRepository()" [disabled]="!repoUrl().trim() || !cloneParentPath() || cloning()">Clone &amp; create</button>
      }
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { max-height: min(680px, 70vh); }
    .tab-content { display: flex; flex-direction: column; gap: 14px; padding: 22px 4px 8px; }
    mat-form-field { width: 100%; }
    .help { color: var(--mat-sys-on-surface-variant); }
    .field-label { color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-title-small); }
    .path-note, .selected-path { padding: 10px 12px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-surface-container); color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-small); }
    .selected-path { display: flex; flex-direction: column; gap: 4px; }
    code { overflow-wrap: anywhere; }
    .error-box { padding: 12px 16px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
  `,
})
export class ProjectDialogComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<ProjectDialogComponent>);
  private readonly router = inject(Router);

  readonly modeIndex = signal(0);
  readonly projectName = signal('');
  readonly selectedPath = signal('');
  readonly browsedPath = signal('');
  readonly repoUrl = signal('');
  readonly cloneParentPath = signal('');
  readonly cloneBrowsedPath = signal('');
  readonly cloneProjectName = signal('');
  readonly cloning = signal(false);
  readonly errorMessage = signal('');
  private projectNameEdited = false;

  constructor(@Inject(MAT_DIALOG_DATA) _data: unknown) {}

  editProjectName(value: string): void {
    this.projectNameEdited = true;
    this.projectName.set(value);
  }

  folderBrowsed(event: { path: string }): void {
    this.browsedPath.set(event.path);
  }

  folderSelected(event: { path: string; name: string }): void {
    this.selectedPath.set(event.path);
    if (!this.projectNameEdited) this.projectName.set(event.name);
  }

  async createFromFolder(): Promise<void> {
    if (!this.selectedPath() || !this.projectName().trim()) {
      this.errorMessage.set('Please select a folder and specify a project name.');
      return;
    }
    try {
      this.errorMessage.set('');
      const project = await this.state.createProject(this.projectName().trim(), this.selectedPath());
      this.dialogRef.close(project);
      await this.router.navigate(['/projects', project.id]);
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to create project');
    }
  }

  async cloneRepository(): Promise<void> {
    if (!this.repoUrl().trim() || !this.cloneParentPath()) {
      this.errorMessage.set('Please provide repository URL and destination parent directory.');
      return;
    }
    this.cloning.set(true);
    this.errorMessage.set('');
    try {
      const project = await this.state.cloneProject({
        url: this.repoUrl().trim(),
        parent_path: this.cloneParentPath(),
        name: this.cloneProjectName().trim() || undefined,
      });
      this.dialogRef.close(project);
      await this.router.navigate(['/projects', project.id]);
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to clone repository');
    } finally {
      this.cloning.set(false);
    }
  }
}
