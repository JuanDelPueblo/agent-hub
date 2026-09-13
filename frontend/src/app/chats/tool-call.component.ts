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
        <mat-panel-title><mat-icon>build</mat-icon>{{ tool.title }}</mat-panel-title>
        <mat-panel-description>{{ tool.status }}</mat-panel-description>
      </mat-expansion-panel-header>
      @if (tool.output) { <pre>{{ tool.output }}</pre> }
    </mat-expansion-panel>
  `,
  styles: `
    :host { display: block; margin: 8px 0; } .tool { border: 1px solid var(--mat-sys-outline-variant); box-shadow: none; } mat-panel-title, mat-panel-description { display: flex; align-items: center; gap: 8px; } mat-panel-title mat-icon { color: var(--mat-sys-primary); } mat-panel-description { justify-content: flex-end; font-size: .78rem; } pre { max-height: 260px; overflow: auto; margin: 0; padding: 14px; border-radius: 10px; background: var(--mat-sys-surface-container-lowest); white-space: pre-wrap; overflow-wrap: anywhere; font: .82rem/1.45 ui-monospace, SFMono-Regular, Consolas, monospace; }
  `,
})
export class ToolCallComponent { @Input({ required: true }) tool!: TurnEntryTool; }
