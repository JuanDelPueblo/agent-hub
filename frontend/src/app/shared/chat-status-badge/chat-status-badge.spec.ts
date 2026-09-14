import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ChatStatusBadgeComponent } from './chat-status-badge';
import type { ChatActivity } from '../../state/chat-activity';

describe('ChatStatusBadgeComponent', () => {
  let fixture: ComponentFixture<ChatStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatStatusBadgeComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChatStatusBadgeComponent);
  });

  for (const [status, label] of [
    ['idle', 'Idle'],
    ['working', 'Working…'],
    ['waiting', 'Waiting for you'],
    ['error', 'Error'],
  ] as Array<[ChatActivity, string]>) {
    it(`renders ${status} as "${label}"`, () => {
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();
      const badge = fixture.nativeElement.querySelector('.chat-status');
      expect(badge).toBeTruthy();
      expect(badge.textContent?.trim()).toBe(label);
      expect(badge.getAttribute('data-status')).toBe(status);
      expect(badge.getAttribute('aria-label')).toBe(label);
      expect(badge.getAttribute('role')).toBeNull();
    });
  }
});
