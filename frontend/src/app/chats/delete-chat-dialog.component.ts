import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { Chat } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'hub-delete-chat-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Delete chat</h2>
    <mat-dialog-content>
      @if (error()) { <div class="error" role="alert">{{ error() }}</div> }
      <p>Are you sure you want to delete “{{ chat.title || 'this chat' }}”?</p>
      <p class="note">This action cannot be undone.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="deleting()">Cancel</button>
      <button mat-flat-button class="destructive" type="button" (click)="remove()" [disabled]="deleting()">
        @if (deleting()) { <mat-spinner diameter="18" /> } @else { Delete chat }
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { display: flex; min-width: min(400px, calc(100vw - 48px)); flex-direction: column; gap: 8px; }
    .note { color: var(--mat-sys-on-surface-variant); }
    .error { padding: 12px 16px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    .destructive { --mat-button-filled-container-color: var(--mat-sys-error); --mat-button-filled-label-text-color: var(--mat-sys-on-error); --mat-button-filled-state-layer-color: var(--mat-sys-on-error); }
    @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }
  `,
})
export class DeleteChatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteChatDialogComponent>);
  private readonly state = inject(AppStateService);
  readonly deleting = signal(false);
  readonly error = signal('');

  constructor(@Inject(MAT_DIALOG_DATA) readonly chat: Chat) {}

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
