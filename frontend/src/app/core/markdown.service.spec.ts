import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { MarkdownService } from './markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownService);
  });

  it('renders bold and lists to html', () => {
    const input = '# Heading\n\n**bold text** and `code`\n\n- item 1\n- item 2';
    const output = service.renderString(input);
    expect(output).toContain('<h1>Heading</h1>');
    expect(output).toContain('<strong>bold text</strong>');
    expect(output).toContain('<code>code</code>');
    expect(output).toContain('<li>item 1</li>');
  });

  it('handles empty input gracefully', () => {
    expect(service.renderString('')).toBe('');
    expect(service.renderString('   ')).toBe('');
  });

  it('sanitizes dangerous script tags', () => {
    const dangerous = '<script>alert("xss")</script>\n\n**safe**';
    const output = service.renderString(dangerous);
    expect(output).not.toContain('<script>');
    expect(output).toContain('<strong>safe</strong>');
  });

});
