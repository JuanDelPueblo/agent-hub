import { Component, Inject, inject } from '@angular/core';
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
  template: `<h2 mat-dialog-title>Rename chat</h2><mat-dialog-content><mat-form-field appearance="outline"><mat-label>Chat title</mat-label><input matInput [(ngModel)]="title" (keyup.enter)="save()" autocomplete="off" /></mat-form-field>@if (error) { <div class="error" role="alert">{{ error }}</div> }</mat-dialog-content><mat-dialog-actions align="end"><button mat-button type="button" (click)="dialogRef.close()" [disabled]="saving">Cancel</button><button mat-flat-button color="primary" type="button" (click)="save()" [disabled]="!title.trim() || saving">Save</button></mat-dialog-actions>`,
  styles: `mat-dialog-content { min-width: min(360px, calc(100vw - 48px)); } mat-form-field { width: 100%; } .error { padding: 10px; border-radius: 10px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); } @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }`,
})
export class RenameChatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RenameChatDialogComponent>);
  private readonly state = inject(AppStateService);
  title: string;
  saving = false;
  error = '';
  constructor(@Inject(MAT_DIALOG_DATA) readonly chat: Chat) { this.title = chat.title || ''; }
  async save(): Promise<void> { if (!this.title.trim()) return; this.saving = true; this.error = ''; try { await this.state.renameChat(this.chat.id, this.title.trim()); this.dialogRef.close(true); } catch (error: unknown) { this.error = error instanceof Error ? error.message : 'Failed to rename chat'; } finally { this.saving = false; } }
}
