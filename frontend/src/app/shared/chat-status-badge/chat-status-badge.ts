import { Component, computed, input } from '@angular/core';
import { chatActivityLabel, type ChatActivity } from '../../state/chat-activity';

/** Presentational badge for the shared user-facing chat activity status. */
@Component({
  selector: 'hub-chat-status-badge',
  templateUrl: './chat-status-badge.html',
  styleUrl: './chat-status-badge.scss',
})
export class ChatStatusBadgeComponent {
  readonly status = input<ChatActivity>('idle');
  readonly label = computed(() => chatActivityLabel(this.status()));
}
