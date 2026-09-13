import { Component, Inject, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppStateService } from '../../state/app-state.service';
import { Project } from '../../core/api/types';
import { FolderPickerComponent } from '../folder-picker/folder-picker';

@Component({
  selector: 'hub-edit-project-dialog',
  standalone: true,
  imports: [FormsModule, FolderPickerComponent, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-project-dialog.html',
  styleUrl: './edit-project-dialog.scss',
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
