import { Component, computed, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import type { TurnEntryTool } from '../../core/api/types';

@Component({
  selector: 'hub-tool-call',
  imports: [MatExpansionModule, MatIconModule],
  templateUrl: './tool-call.html',
  styleUrl: './tool-call.scss',
})
export class ToolCallComponent {
  readonly tool = input.required<TurnEntryTool>();

  readonly icon = computed(() => {
    const kind = (this.tool().kind || '').toLowerCase();
    switch (kind) {
      case 'read':
        return 'description';
      case 'execute':
        return 'terminal';
      case 'think':
        return 'psychology';
      case 'edit':
        return 'edit_document';
      case 'delete':
        return 'delete';
      case 'search':
        return 'search';
      default:
        return 'build';
    }
  });

  readonly isSubagentChild = computed(() => !!this.tool().parentId);

  readonly cleanOutput = computed(() => {
    const raw = this.tool().output;
    if (!raw) return '';
    const trimmed = raw.trim();
    if (trimmed.startsWith('```') && trimmed.endsWith('```') && trimmed.length >= 6) {
      const inner = trimmed.slice(3, -3);
      const nl = inner.indexOf('\n');
      return (nl >= 0 ? inner.slice(nl + 1) : inner).trimEnd();
    }
    return raw;
  });
}
