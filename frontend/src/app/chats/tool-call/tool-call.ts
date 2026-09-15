import { Component, computed, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import type { RichContentBlock, TurnEntryTool } from '../../core/api/types';
import { RichContentComponent } from '../rich-content/rich-content';

@Component({
  selector: 'hub-tool-call',
  imports: [MatExpansionModule, MatIconModule, RichContentComponent],
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

  readonly richContent = computed(() => {
    const content = this.tool().content;
    if (!Array.isArray(content)) return [] as RichContentBlock[];
    return content.flatMap((item) => {
      if (!item || typeof item !== 'object') return [];
      const block = (item as { type?: unknown; content?: unknown }).type === 'content'
        ? (item as { content?: unknown }).content : item;
      return block && typeof block === 'object' && typeof (block as { type?: unknown }).type === 'string'
        ? [block as RichContentBlock] : [];
    });
  });
}
