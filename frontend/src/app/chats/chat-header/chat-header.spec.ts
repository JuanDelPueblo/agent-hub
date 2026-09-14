import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, expect, it, beforeEach } from 'vitest';
import { ChatHeaderComponent } from './chat-header';
import { AppStateService } from '../../state/app-state.service';
import type { Chat } from '../../core/api/types';

describe('ChatHeaderComponent', () => {
  let fixture: ComponentFixture<ChatHeaderComponent>;

  const mockChat: Chat = {
    id: 'chat-1',
    project_id: 'proj-1',
    agent: 'claude',
    title: 'Review the WebSocket replay path',
    acp_session_id: 'acp-1',
    created_at: '2026-09-13T12:00:00Z',
    updated_at: '2026-09-13T12:00:00Z',
    archived: false,
    permission_policy: 'ask',
    config_values: {},
    process_state: 'RUNNING',
    turn_state: 'IDLE',
  };

  const activitySignal = signal('idle');

  beforeEach(async () => {
    activitySignal.set('idle');
    await TestBed.configureTestingModule({
      imports: [ChatHeaderComponent],
      providers: [
        {
          provide: AppStateService,
          useValue: {
            isMobileDrawerOpen: () => false,
            setMobileDrawerOpen: () => undefined,
            stopChatProcess: async () => undefined,
            retryConnection: async () => undefined,
            archiveChat: async () => undefined,
            chatActivity: () => activitySignal(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatHeaderComponent);
    fixture.componentRef.setInput('chat', mockChat);
    fixture.detectChanges();
  });

  it('renders the agent badge without icon', () => {
    const badge = fixture.nativeElement.querySelector('.badge.agent');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('Claude');
    expect(badge.querySelector('mat-icon')).toBeNull();
  });

  it('renders the title button with title text', () => {
    const titleBtn = fixture.nativeElement.querySelector('.title-button');
    expect(titleBtn).toBeTruthy();
    expect(titleBtn.textContent).toContain('Review the WebSocket replay path');
  });

  it('does not render process controls or status labels', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('Running');
    expect(text).not.toContain('Stopped');
    expect(text).not.toContain('Dead');
    expect(fixture.nativeElement.querySelector('button[aria-label="Stop process"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('button[aria-label="Reconnect process"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('button[aria-label="Reconnect ACP"]')).toBeNull();
  });

  it('shows the shared activity badge instead of a hard-coded Thinking label', () => {
    const badge = fixture.nativeElement.querySelector('hub-chat-status-badge .chat-status');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('Idle');
    expect(fixture.nativeElement.textContent).not.toContain('Thinking…');
  });

  it('reflects the store activity for working, waiting, and error', () => {
    for (const [activity, label] of [['working', 'Working…'], ['waiting', 'Waiting for you'], ['error', 'Error']] as const) {
      activitySignal.set(activity);
      fixture.detectChanges();
      const badge = fixture.nativeElement.querySelector('hub-chat-status-badge .chat-status');
      expect(badge.textContent.trim()).toBe(label);
    }
    const text = fixture.nativeElement.textContent as string;
    for (const process of ['STARTING', 'RUNNING', 'STOPPED', 'DEAD', 'Starting', 'Running', 'Stopped', 'Dead']) {
      expect(text).not.toContain(process);
    }
  });
});
