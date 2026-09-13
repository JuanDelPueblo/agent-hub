import { Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppStateService } from '../state/app-state.service';

/**
 * The one place that reports the event socket state. The navigation drawer
 * shows it while the drawer is on screen. The home top app bar shows it when
 * no drawer exists.
 */
@Component({
  selector: 'hub-connection-status',
  standalone: true,
  imports: [MatTooltipModule],
  template: `
    <span
      class="status-chip"
      [class]="state.wsStatus()"
      role="status"
      [matTooltip]="tooltip()"
      [attr.aria-label]="'Event stream ' + state.wsStatus()"
    >
      <span class="status-dot"></span>
      <span class="status-label">{{ state.wsStatus() }}</span>
    </span>
  `,
  styles: `
    :host { display: inline-flex; min-width: 0; }
    .status-chip { display: inline-flex; align-items: center; gap: 7px; height: 28px; padding-inline: 10px; border-radius: var(--mat-sys-corner-full); background: var(--mat-sys-surface-container-high); color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-medium); letter-spacing: var(--mat-sys-label-medium-tracking); text-transform: capitalize; }
    .status-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .status-dot { flex: 0 0 auto; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .status-chip.connected { color: var(--hub-status-running); background: var(--hub-status-running-container); }
    .status-chip.connecting { color: var(--hub-status-starting); }
    .status-chip.disconnected { color: var(--hub-status-dead); background: var(--hub-status-dead-container); }
  `,
})
export class ConnectionStatusComponent {
  readonly state = inject(AppStateService);

  tooltip(): string {
    const status = this.state.wsStatus();
    if (status === 'connected') return 'The event stream is live.';
    if (status === 'connecting') return 'The event stream is reconnecting.';
    return 'The event stream is offline. Agent updates stop until it returns.';
  }
}
