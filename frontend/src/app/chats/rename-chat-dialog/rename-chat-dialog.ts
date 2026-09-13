import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-rename-chat-dialog',
  imports: [FormField, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './rename-chat-dialog.html',
  styleUrl: './rename-chat-dialog.scss',
})
export class RenameChatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RenameChatDialogComponent>);
  readonly chat = inject<Chat>(MAT_DIALOG_DATA);
  private readonly state = inject(AppStateService);
  private readonly formModel = signal({ title: this.chat.title || '' });
  readonly renameForm = form(this.formModel);
  readonly title = this.renameForm.title().value;
  readonly saving = signal(false);
  readonly error = signal('');

  async save(): Promise<void> {
    const value = this.title().trim();
    if (!value) return;
    this.saving.set(true);
    this.error.set('');
    try {
      await this.state.renameChat(this.chat.id, value);
      this.dialogRef.close(true);
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Failed to rename chat');
    } finally {
      this.saving.set(false);
    }
  }
}
