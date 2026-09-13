import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import type { TurnEntryTool } from '../core/api/types';

@Component({
  selector: 'hub-tool-call',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule],
  template: `
    <mat-expansion-panel class="tool" [disabled]="!tool.output">
      <mat-expansion-panel-header>
        <mat-panel-title><mat-icon>build</mat-icon><span class="tool-title">{{ tool.title }}</span></mat-panel-title>
        <mat-panel-description>{{ tool.status }}</mat-panel-description>
      </mat-expansion-panel-header>
      @if (tool.output) { <pre>{{ tool.output }}</pre> }
    </mat-expansion-panel>
  `,
  styles: `
    :host { display: block; }
    .tool { border: 1px solid var(--mat-sys-outline-variant); box-shadow: none; }
    mat-panel-title, mat-panel-description { display: flex; align-items: center; gap: 8px; }
    mat-panel-title { flex: 1 1 auto; min-width: 0; }
    mat-panel-title mat-icon { flex: 0 0 24px; color: var(--mat-sys-primary); }
    .tool-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    mat-panel-description { flex: 0 0 auto; justify-content: flex-end; margin-left: 16px; font: var(--mat-sys-label-medium); }
    pre { max-height: 260px; overflow: auto; margin: 0; padding: 14px; border-radius: var(--mat-sys-corner-small); background: var(--mat-sys-surface-container-lowest); white-space: pre-wrap; overflow-wrap: anywhere; font: .82rem/1.45 ui-monospace, SFMono-Regular, Consolas, monospace; }
  `,
})
export class ToolCallComponent { @Input({ required: true }) tool!: TurnEntryTool; }
