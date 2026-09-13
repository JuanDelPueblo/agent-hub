import { inject, Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  private readonly sanitizer = inject(DomSanitizer);

  constructor() {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }

  /**
   * Parses markdown and returns sanitized HTML safe for innerHTML binding.
   */
  render(content: string): SafeHtml {
    if (!content || !content.trim()) {
      return '';
    }

    try {
      const rawHtml = marked.parse(content, { async: false }) as string;
      const cleanHtml = this.sanitizer.sanitize(SecurityContext.HTML, rawHtml) ?? '';
      return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
    } catch {
      const escaped = this.sanitizer.sanitize(SecurityContext.HTML, content) ?? '';
      return this.sanitizer.bypassSecurityTrustHtml(escaped);
    }
  }

  /**
   * Returns a sanitized HTML string.
   */
  renderString(content: string): string {
    if (!content || !content.trim()) {
      return '';
    }

    try {
      const rawHtml = marked.parse(content, { async: false }) as string;
      return this.sanitizer.sanitize(SecurityContext.HTML, rawHtml) ?? '';
    } catch {
      return this.sanitizer.sanitize(SecurityContext.HTML, content) ?? '';
    }
  }
}
