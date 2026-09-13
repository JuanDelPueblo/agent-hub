import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { TurnEntryPermission } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-permission-card',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './permission-card.html',
  styleUrl: './permission-card.scss',
})
export class PermissionCardComponent {
  readonly permission = input.required<TurnEntryPermission>();
  readonly chatId = input('');
  readonly responding = signal(false);
  private readonly state = inject(AppStateService);

  async respond(granted: boolean): Promise<void> {
    if (!this.chatId() || !this.permission().requestId) return;
    this.responding.set(true);
    try {
      await this.state.respondPermission(this.chatId(), this.permission().requestId, granted);
    } catch (error) {
      console.error('Failed to respond to permission request', error);
    } finally {
      this.responding.set(false);
    }
  }
}
