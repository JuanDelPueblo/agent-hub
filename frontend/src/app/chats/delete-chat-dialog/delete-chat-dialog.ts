import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-delete-chat-dialog',
  imports: [MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './delete-chat-dialog.html',
  styleUrl: './delete-chat-dialog.scss',
})
export class DeleteChatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteChatDialogComponent>);
  private readonly state = inject(AppStateService);
  readonly deleting = signal(false);
  readonly error = signal('');

  readonly chat = inject<Chat>(MAT_DIALOG_DATA);

  async remove(): Promise<void> {
    this.deleting.set(true);
    this.error.set('');
    try {
      await this.state.deleteChat(this.chat.id);
      this.dialogRef.close(true);
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Failed to delete chat');
    } finally {
      this.deleting.set(false);
    }
  }
}
