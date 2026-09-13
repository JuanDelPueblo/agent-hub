import { Component, computed, inject, input } from '@angular/core';
import { MarkdownService } from '../../core/markdown.service';

@Component({
  selector: 'hub-markdown',
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.scss',
})
export class MarkdownComponent {
  readonly content = input<string>('');
  private readonly markdown = inject(MarkdownService);

  readonly rendered = computed(() => this.markdown.render(this.content()));
}
