import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import type { RichContentBlock } from '../../core/api/types';
import { RichContentComponent } from './rich-content';

describe('RichContentComponent', () => {
  let fixture: ComponentFixture<RichContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RichContentComponent] }).compileComponents();
    fixture = TestBed.createComponent(RichContentComponent);
  });

  it('renders media safely and only activates http resource links', () => {
    const blocks: RichContentBlock[] = [
      { type: 'image', data: 'iVBORw0KGgo=', mimeType: 'image/png' },
      { type: 'audio', data: 'SUQz', mimeType: 'audio/mpeg' },
      { type: 'resource_link', name: 'unsafe', uri: 'javascript:alert(1)' },
      { type: 'resource_link', name: 'safe', uri: 'https://example.test/resource' },
      { type: 'resource', resource: { uri: 'attachment://unsafe.html', mimeType: 'text/html', text: '<img src=x onerror=alert(1)>' } },
      { type: 'resource', resource: { uri: 'attachment://data.bin', blob: 'AA==' } },
    ];
    fixture.componentRef.setInput('blocks', blocks);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('img.rich-image')?.getAttribute('src')).toBe('data:image/png;base64,iVBORw0KGgo=');
    expect(root.querySelector('audio.rich-audio')?.hasAttribute('controls')).toBe(true);
    const links = root.querySelectorAll('.resource-link a');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('https://example.test/resource');
    expect(links[0].getAttribute('target')).toBe('_blank');
    expect(links[0].getAttribute('rel')).toBe('noopener noreferrer');
    expect(root.querySelector('.resource pre')?.textContent).toContain('<img src=x');
    expect(root.querySelectorAll('.resource img')).toHaveLength(0);
    expect(root.textContent).toContain('Binary resource retained as metadata');
  });
});
