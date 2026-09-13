import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { Chat } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'hub-rename-chat-dialog',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Rename chat</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline">
        <mat-label>Chat title</mat-label>
        <input matInput [ngModel]="title()" (ngModelChange)="title.set($event)" (keyup.enter)="save()" autocomplete="off" />
      </mat-form-field>
      @if (error()) { <div class="error" role="alert">{{ error() }}</div> }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="saving()">Cancel</button>
      <button mat-flat-button type="button" (click)="save()" [disabled]="!title().trim() || saving()">Save</button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { min-width: min(360px, calc(100vw - 48px)); }
    mat-form-field { width: 100%; }
    .error { padding: 12px 16px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }
  `,
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
