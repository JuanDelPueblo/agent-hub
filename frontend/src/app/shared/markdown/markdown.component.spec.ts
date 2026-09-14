import { ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { MarkdownComponent } from './markdown.component';

describe('MarkdownComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownComponent],
    }).compileComponents();
  });

  it('renders a heading followed by a bullet list', () => {
    const fixture = TestBed.createComponent(MarkdownComponent);
    fixture.componentRef.setInput(
      'content',
      '### Summary of Changes\n- First item\n- Second item\n- Third item',
    );
    fixture.detectChanges();

    const body = fixture.nativeElement.querySelector('.markdown-body') as HTMLElement;
    expect(body).not.toBeNull();
    expect(body.querySelector('h3')?.textContent?.trim()).toBe('Summary of Changes');

    const items = body.querySelectorAll('ul > li');
    expect(items).toHaveLength(3);
    expect(items[0].textContent?.trim()).toBe('First item');
    expect(items[1].textContent?.trim()).toBe('Second item');
    expect(items[2].textContent?.trim()).toBe('Third item');
  });

  it('uses normal whitespace so lists do not inherit pre-wrap', () => {
    const fixture = TestBed.createComponent(MarkdownComponent);
    fixture.componentRef.setInput('content', '### Summary of Changes\n- First item\n- Second item');
    fixture.detectChanges();

    const body = fixture.nativeElement.querySelector('.markdown-body') as HTMLElement;
    expect(getComputedStyle(body).whiteSpace).toBe('normal');
  });

  it('disables encapsulation so descendant styles apply to innerHTML elements', () => {
    expect((MarkdownComponent as unknown as { ɵcmp: { encapsulation: ViewEncapsulation } }).ɵcmp.encapsulation).toBe(
      ViewEncapsulation.None,
    );
  });
});
