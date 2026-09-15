import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppStateService } from '../../state/app-state.service';
import { ProjectPageComponent } from './project-page';

describe('ProjectPageComponent chat status', () => {
  let fixture: ComponentFixture<ProjectPageComponent>;

  beforeEach(async () => {
    const mockState = {
      projects: signal([{ id: 'proj-1', name: 'Batey', path: '/work' }]),
      agents: signal(['claude', 'codex', 'opencode']),
      chatsByProject: signal({
        'proj-1': [
          { id: 'chat-1', project_id: 'proj-1', agent: 'claude', title: 'First chat', updated_at: '2026-09-13T12:03:00Z', archived: false, turn_state: 'IDLE' },
          { id: 'chat-2', project_id: 'proj-1', agent: 'codex', title: 'Second chat', updated_at: '2026-09-13T12:02:00Z', archived: false, turn_state: 'PROMPTING' },
          { id: 'chat-3', project_id: 'proj-1', agent: 'opencode', title: 'Third chat', updated_at: '2026-09-13T12:01:00Z', archived: false, turn_state: 'IDLE' },
        ],
      }),
      showArchived: signal(false),
      setShowArchived: vi.fn(),
      loadChats: vi.fn(async () => undefined),
      chatActivity: (chatId: string) =>
        chatId === 'chat-1' ? 'idle' : chatId === 'chat-2' ? 'waiting' : 'error',
      chatTurnStartedAt: () => null,
    };

    const route = {
      paramMap: of(convertToParamMap({ projectId: 'proj-1' })),
      snapshot: { paramMap: convertToParamMap({ projectId: 'proj-1' }) },
    };

    await TestBed.configureTestingModule({
      imports: [ProjectPageComponent],
      providers: [
        provideRouter([]),
        { provide: AppStateService, useValue: mockState },
        { provide: ActivatedRoute, useValue: route },
        { provide: BreakpointObserver, useValue: { observe: () => of({ matches: false }) } },
        { provide: MatDialog, useValue: { open: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('shows the shared activity badge on every chat card', () => {
    const badges = Array.from(
      fixture.nativeElement.querySelectorAll('hub-chat-status-badge .chat-status'),
    ).map((badge: unknown) => (badge as Element).textContent?.trim());
    expect(badges).toEqual(['Idle', 'Waiting for you', 'Error']);
  });

  it('includes the activity in the card accessible labels without process state', () => {
    const labels = Array.from(fixture.nativeElement.querySelectorAll('.chat-card a'))
      .map((link: unknown) => (link as Element).getAttribute('aria-label') ?? '');
    expect(labels).toEqual([
      'Open chat First chat, Idle',
      'Open chat Second chat, Waiting for you',
      'Open chat Third chat, Error',
    ]);
    const text = fixture.nativeElement.textContent as string;
    for (const process of ['STARTING', 'RUNNING', 'STOPPED', 'DEAD', 'Starting', 'Running', 'Stopped', 'Dead']) {
      expect(text).not.toContain(process);
    }
  });
});
