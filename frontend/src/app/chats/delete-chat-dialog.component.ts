import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { Chat } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'hub-delete-chat-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
  template: `<h2 mat-dialog-title>Delete chat</h2><mat-dialog-content>@if (error) { <div class="error" role="alert">{{ error }}</div> }<p>Are you sure you want to delete “{{ chat.title || 'this chat' }}”?</p><p class="note">This action cannot be undone.</p></mat-dialog-content><mat-dialog-actions align="end"><button mat-button type="button" (click)="dialogRef.close()" [disabled]="deleting">Cancel</button><button mat-flat-button color="warn" type="button" (click)="remove()" [disabled]="deleting">@if (deleting) { <mat-spinner diameter="18" /> } @else { Delete chat }</button></mat-dialog-actions>`,
  styles: `mat-dialog-content { min-width: min(400px, calc(100vw - 48px)); } .note { color: var(--mat-sys-on-surface-variant); } .error { padding: 10px; border-radius: 10px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); } @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }`,
})
export class DeleteChatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteChatDialogComponent>);
  private readonly state = inject(AppStateService);
  deleting = false;
  error = '';
  constructor(@Inject(MAT_DIALOG_DATA) readonly chat: Chat) {}
  async remove(): Promise<void> { this.deleting = true; this.error = ''; try { await this.state.deleteChat(this.chat.id); this.dialogRef.close(true); } catch (error: unknown) { this.error = error instanceof Error ? error.message : 'Failed to delete chat'; } finally { this.deleting = false; } }
}
