import { Component, Input, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { TurnEntryPermission } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'hub-permission-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <mat-card class="permission" [class.responded]="permission.responded">
      <mat-card-header><mat-icon mat-card-avatar>shield_person</mat-icon><mat-card-title>Permission request</mat-card-title><mat-card-subtitle>{{ permission.method }}</mat-card-subtitle></mat-card-header>
      <mat-card-content><pre>{{ permission.description || permission.method || 'Action requested' }}</pre></mat-card-content>
      @if (permission.responded) { <div class="decision"><mat-icon>check</mat-icon> Responded: {{ permission.decision || 'Handled' }}</div> }
      @else { <mat-card-actions align="end"><button mat-stroked-button type="button" (click)="respond(false)" [disabled]="responding()">Deny</button><button mat-flat-button type="button" (click)="respond(true)" [disabled]="responding()">@if (responding()) { <mat-spinner diameter="18" /> } @else { Allow }</button></mat-card-actions> }
    </mat-card>
  `,
  styles: `
    :host { display: block; margin: 12px 0; } .permission { border: 1px solid color-mix(in srgb, var(--mat-sys-error) 50%, transparent); background: var(--mat-sys-error-container); } .permission.responded { border-color: var(--mat-sys-outline-variant); background: var(--mat-sys-surface-container-low); opacity: .88; } mat-card-header { align-items: center; } [mat-card-avatar] { display: grid; place-items: center; margin-bottom: 0; color: var(--mat-sys-error); } mat-card-content { padding-top: 12px; } pre { margin: 0; padding: 12px; overflow: auto; border-radius: var(--mat-sys-corner-small); background: color-mix(in srgb, var(--mat-sys-surface-container-lowest) 80%, transparent); white-space: pre-wrap; font: inherit; } .decision { display: flex; align-items: center; gap: 6px; padding: 0 16px 14px; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-medium); }
  `,
})
export class PermissionCardComponent {
  @Input({ required: true }) permission!: TurnEntryPermission;
  @Input() chatId = '';
  readonly responding = signal(false);
  private readonly state = inject(AppStateService);
  async respond(granted: boolean): Promise<void> { if (!this.chatId || !this.permission.requestId) return; this.responding.set(true); try { await this.state.respondPermission(this.chatId, this.permission.requestId, granted); } catch (error) { console.error('Failed to respond to permission request', error); } finally { this.responding.set(false); } }
}
