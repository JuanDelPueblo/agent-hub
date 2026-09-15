import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import type { RichContentBlock } from '../../core/api/types';
import { MarkdownComponent } from '../../shared/markdown/markdown.component';

/** Safe renderer for stable ACP content. It never fetches links or inserts HTML. */
@Component({
  selector: 'hub-rich-content',
  imports: [MatIconModule, MarkdownComponent],
  templateUrl: './rich-content.html',
  styleUrl: './rich-content.scss',
})
export class RichContentComponent {
  readonly blocks = input.required<RichContentBlock[]>();

  mediaUrl(block: RichContentBlock): string {
    if (block.type !== 'image' && block.type !== 'audio') return '';
    return `data:${block.mimeType};base64,${block.data}`;
  }

  safeLink(uri: string): string | null {
    try {
      const url = new URL(uri);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch { return null; }
  }

  resourceText(block: RichContentBlock): string | null {
    return block.type === 'resource' && 'text' in block.resource ? block.resource.text : null;
  }

  resourceMeta(block: RichContentBlock): string {
    if (block.type !== 'resource') return '';
    const resource = block.resource;
    return `${resource.mimeType ?? 'binary resource'} · ${resource.uri}`;
  }
}
