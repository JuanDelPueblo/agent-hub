import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppStateService } from '../../state/app-state.service';

/**
 * The single entry point for a new chat. The button opens a menu of the
 * configured ACP agents, then creates the chat with the agent that the user
 * selects.
 */
@Component({
  selector: 'hub-new-chat-button',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule],
  templateUrl: './new-chat-button.html',
  styleUrl: './new-chat-button.scss',
})
export class NewChatButtonComponent {
  /** The project that receives the new chat. */
  readonly projectId = input.required<string>();

  readonly state = inject(AppStateService);
  readonly creating = signal(false);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  async create(agent: string): Promise<void> {
    if (!this.projectId() || this.creating()) return;
    this.creating.set(true);
    try {
      const chat = await this.state.createChat(this.projectId(), agent);
      await this.router.navigate(['/projects', this.projectId(), 'chats', chat.id]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create the chat.';
      this.snackBar.open(message, 'Dismiss', { duration: 6000 });
    } finally {
      this.creating.set(false);
    }
  }
}
