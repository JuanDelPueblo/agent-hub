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
import { AppStateService } from '../../state/app-state.service';
import { FolderPickerComponent } from '../folder-picker/folder-picker';

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
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.scss',
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
