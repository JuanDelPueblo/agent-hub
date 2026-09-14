import { Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppStateService } from '../../state/app-state.service';

/**
 * The one place that reports the event socket state. The navigation drawer
 * shows it while the drawer is on screen. The home top app bar shows it when
 * no drawer exists.
 */
@Component({
  selector: 'hub-connection-status',
  imports: [MatTooltipModule],
  templateUrl: './connection-status.html',
  styleUrl: './connection-status.scss',
})
export class ConnectionStatusComponent {
  readonly state = inject(AppStateService);

  tooltip(): string {
    const status = this.state.wsStatus();
    if (status === 'connected') return 'The event stream is live.';
    if (status === 'connecting') return 'The event stream is reconnecting.';
    if (status === 'error') {
      return this.state.wsError() || 'Durable event history could not be replayed.';
    }
    return 'The event stream is offline. Agent updates stop until it returns.';
  }

  ariaLabel(): string {
    const detail = this.state.wsStatus() === 'error' ? `: ${this.tooltip()}` : '';
    return `Event stream ${this.state.wsStatus()}${detail}`;
  }
}
