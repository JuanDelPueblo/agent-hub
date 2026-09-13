import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { NavigationComponent } from './navigation.component';
import { AppStateService } from '../state/app-state.service';
import { ThemeService } from '../core/theme.service';
import { Router, provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';

describe('NavigationComponent DOM check', () => {
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    const mockState = {
      activeProjectId: signal('proj-1'),
      activeProject: signal({ id: 'proj-1', name: 'agent-hub', path: '/home/dev/projects/agent-hub' }),
      projects: signal([]),
      agents: signal(['claude', 'codex', 'opencode']),
      chatsByProject: signal({
        'proj-1': [
          {
            id: 'chat-1',
            project_id: 'proj-1',
            agent: 'claude',
            title: 'Review the WebSocket replay path',
            process_state: 'RUNNING',
            turn_state: 'IDLE',
            archived: false,
          },
        ],
      }),
      showArchived: signal(false),
      activeChatId: signal('chat-1'),
      isMobileDrawerOpen: signal(false),
      wsStatus: signal('connected'),
    };

    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        { provide: AppStateService, useValue: mockState },
        { provide: ThemeService, useValue: { label: () => 'Dark', cycle: () => {}, icon: () => 'dark_mode' } },
        provideRouter([]),
        { provide: MatDialog, useValue: { open: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    fixture.detectChanges();
  });

  it('renders chat items with title and agent badge without icon', () => {
    const title = fixture.nativeElement.querySelector('[matListItemTitle]');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Review the WebSocket replay path');

    const badge = fixture.nativeElement.querySelector('.agent-badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('claude');
    expect(badge.querySelector('mat-icon')).toBeNull();
  });
});
