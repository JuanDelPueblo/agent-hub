import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import type { PlanEntry } from '../core/api/types';

@Component({
  selector: 'hub-plan-view',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    @if (entries.length) {
      <mat-card class="plan"><mat-card-header><mat-icon mat-card-avatar>format_list_bulleted</mat-icon><mat-card-title>Execution plan</mat-card-title></mat-card-header><mat-card-content><ul>@for (entry of entries; track $index) {<li [class.completed]="entry.status === 'completed'"><mat-icon>{{ statusIcon(entry.status) }}</mat-icon><span>{{ entry.content }}</span></li>}</ul></mat-card-content></mat-card>
    }
  `,
  styles: `
    :host { display: block; margin: 10px 0; } .plan { background: var(--mat-sys-tertiary-container); color: var(--mat-sys-on-tertiary-container); } mat-card-header { align-items: center; } [mat-card-avatar] { display: grid; place-items: center; margin-bottom: 0; color: var(--mat-sys-on-tertiary-container); } mat-card-content { padding-top: 6px; } ul { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; } li { display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; } li mat-icon { width: 20px; height: 20px; font-size: 20px; flex: 0 0 auto; } li.completed span { color: var(--mat-sys-on-surface-variant); text-decoration: line-through; }
  `,
})
export class PlanViewComponent {
  @Input() entries: PlanEntry[] = [];
  statusIcon(status: string): string { if (status === 'completed') return 'check_circle'; if (status === 'in_progress') return 'progress_activity'; return 'radio_button_unchecked'; }
}
