import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AppStateService } from '../../state/app-state.service';
import { NewChatDialogComponent } from '../new-chat-dialog/new-chat-dialog';

/**
 * The single entry point for a new chat. The button opens the focused creation
 * dialog, which loads any Git workspace choices before creating the chat.
 */
@Component({
  selector: 'hub-new-chat-button',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './new-chat-button.html',
  styleUrl: './new-chat-button.scss',
})
export class NewChatButtonComponent {
  /** The project that receives the new chat. */
  readonly projectId = input.required<string>();

  readonly creating = signal(false);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  open(): void {
    if (!this.projectId() || this.creating()) return;
    const ref = this.dialog.open(NewChatDialogComponent, {
      width: 'min(480px, calc(100vw - 32px))',
      data: { projectId: this.projectId() },
    });
    ref.afterClosed().subscribe((chat) => {
      if (chat) void this.router.navigate(['/projects', this.projectId(), 'chats', chat.id]);
    });
  }
}
