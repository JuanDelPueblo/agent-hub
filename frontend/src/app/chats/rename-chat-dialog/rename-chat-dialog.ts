import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-rename-chat-dialog',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './rename-chat-dialog.html',
  styleUrl: './rename-chat-dialog.scss',
})
export class RenameChatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RenameChatDialogComponent>);
  private readonly state = inject(AppStateService);
  readonly title = signal('');
  readonly saving = signal(false);
  readonly error = signal('');

  constructor(@Inject(MAT_DIALOG_DATA) readonly chat: Chat) {
    this.title.set(chat.title || '');
  }

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
