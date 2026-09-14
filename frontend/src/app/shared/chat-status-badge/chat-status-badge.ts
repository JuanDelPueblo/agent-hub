import { Component, computed, inject, input } from '@angular/core';
import { chatActivityLabel, type ChatActivity } from '../../state/chat-activity';
import { ActivityClockService } from './activity-clock.service';

/** Presentational badge for the shared user-facing chat activity status. */
@Component({
  selector: 'hub-chat-status-badge',
  templateUrl: './chat-status-badge.html',
  styleUrl: './chat-status-badge.scss',
})
export class ChatStatusBadgeComponent {
  readonly status = input<ChatActivity>('idle');
  readonly turnStartedAt = input<string | null>(null);
  private readonly clock = inject(ActivityClockService);
  readonly label = computed(() =>
    chatActivityLabel(this.status(), this.turnStartedAt(), this.clock.now()),
  );
}
