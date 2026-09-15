import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppStateService } from '../../state/app-state.service';
import { Project } from '../../core/api/types';
import { FolderPickerComponent } from '../folder-picker/folder-picker';

@Component({
  selector: 'hub-edit-project-dialog',
  imports: [FormField, FolderPickerComponent, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-project-dialog.html',
  styleUrl: './edit-project-dialog.scss',
})
export class EditProjectDialogComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<EditProjectDialogComponent>);
  readonly project = inject<Project>(MAT_DIALOG_DATA);
  private readonly formModel = signal({ name: this.project.name });
  readonly projectForm = form(this.formModel);
  readonly name = this.projectForm.name().value;
  readonly selectedPath = signal(this.project.path);
  readonly browsedPath = signal('');
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly canSave = computed(
    () => !!this.name().trim() && !!this.selectedPath() && !this.saving(),
  );
  readonly envrcRemembered = signal(this.project.envrc_remembered ?? false);
  readonly envrcRelativePath = signal(this.project.envrc_relative_path ?? null);
  readonly forgettingEnvrc = signal(false);

  async forgetEnvrc(): Promise<void> {
    this.forgettingEnvrc.set(true);
    try {
      await this.state.forgetProjectEnvrcGrant(this.project.id);
      this.envrcRemembered.set(false);
      this.envrcRelativePath.set(null);
    } catch (error: unknown) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Failed to forget the remembered environment',
      );
    } finally {
      this.forgettingEnvrc.set(false);
    }
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
