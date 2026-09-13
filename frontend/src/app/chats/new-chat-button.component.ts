import { Component, Input, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppStateService } from '../state/app-state.service';

/**
 * The single entry point for a new chat. The button opens a menu of the
 * configured ACP agents, then creates the chat with the agent that the user
 * selects.
 */
@Component({
  selector: 'hub-new-chat-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule],
  template: `
    <button
      mat-flat-button
      type="button"
      class="new-chat-trigger"
      [matMenuTriggerFor]="agentMenu"
      [disabled]="creating()"
      aria-label="New chat: choose an agent"
    >
      @if (creating()) {
        <mat-spinner diameter="18" />
      } @else {
        <mat-icon>add</mat-icon>
      }
      <span class="new-chat-text">New chat</span>
      <mat-icon iconPositionEnd class="new-chat-caret">arrow_drop_down</mat-icon>
    </button>

    <mat-menu #agentMenu="matMenu" class="hub-agent-menu" [overlapTrigger]="false">
      <div class="agent-menu-heading" role="presentation">Start a chat with</div>
      @for (agent of state.agents(); track agent) {
        <button mat-menu-item type="button" (click)="create(agent)">
          <span class="agent-menu-name">{{ agent }}</span>
        </button>
      } @empty {
        <div class="agent-menu-empty" role="presentation">No agents are configured.</div>
      }
    </mat-menu>
  `,
  styles: `
    :host { display: inline-flex; min-width: 0; }
    .new-chat-trigger { min-width: 0; width: 100%; padding-inline: 16px 8px; }
    .new-chat-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .new-chat-caret { margin-left: 0; opacity: .85; }
    .new-chat-trigger mat-spinner { --mdc-circular-progress-active-indicator-color: currentColor; }
  `,
})
export class NewChatButtonComponent {
  /** The project that receives the new chat. */
  @Input({ required: true }) projectId = '';

  readonly state = inject(AppStateService);
  readonly creating = signal(false);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  async create(agent: string): Promise<void> {
    if (!this.projectId || this.creating()) return;
    this.creating.set(true);
    try {
      const chat = await this.state.createChat(this.projectId, agent);
      await this.router.navigate(['/projects', this.projectId, 'chats', chat.id]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create the chat.';
      this.snackBar.open(message, 'Dismiss', { duration: 6000 });
    } finally {
      this.creating.set(false);
    }
  }
}
