import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NavigationComponent } from './navigation';
import { AppStateService } from '../../state/app-state.service';
import { ThemeService } from '../../core/theme.service';
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

describe('NavigationComponent project switching', () => {
  const projects = [
    { id: 'p1', name: 'Agent Hub', path: '/repos/agent-hub' },
    { id: 'p2', name: 'Proj Two', path: '/repos/two' },
    { id: 'p3', name: 'Empty Project', path: '/repos/empty' },
  ];

  function makeChat(id: string, updatedAt: string, overrides: Record<string, unknown> = {}) {
    return {
      id,
      project_id: 'p2',
      agent: 'codex',
      title: `Chat ${id}`,
      archived: false,
      updated_at: updatedAt,
      ...overrides,
    };
  }

  function baseState() {
    return {
      activeProjectId: signal('p1'),
      activeProject: signal(projects[0]),
      projects: signal(projects),
      agents: signal(['codex']),
      chatsByProject: signal({
        p1: [makeChat('chat-1', '2026-01-01T00:00:00Z', { project_id: 'p1' })],
        p2: [makeChat('chat-old', '2026-01-02T00:00:00Z'), makeChat('chat-new', '2026-06-01T00:00:00Z')],
      }),
      showArchived: signal(false),
      activeChatId: signal('chat-1'),
      isMobileDrawerOpen: signal(false),
      wsStatus: signal('connected'),
      loadChats: vi.fn(async () => {}),
    };
  }

  async function renderNavigation(state: Record<string, unknown>): Promise<ComponentFixture<NavigationComponent>> {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        { provide: AppStateService, useValue: state },
        { provide: ThemeService, useValue: { label: () => 'Dark', cycle: () => {}, icon: () => 'dark_mode' } },
        provideRouter([]),
        { provide: MatDialog, useValue: { open: () => {} } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(NavigationComponent);
    fixture.detectChanges();
    return fixture;
  }

  async function openProjectMenu(fixture: ComponentFixture<NavigationComponent>): Promise<HTMLElement[]> {
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.project-switcher')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return Array.from(document.querySelectorAll<HTMLElement>('.hub-project-menu .mat-mdc-menu-item'));
  }

  function itemByText(items: HTMLElement[], text: string): HTMLElement {
    const item = items.find((candidate) => candidate.textContent?.includes(text));
    if (!item) throw new Error(`Menu item not found: ${text}`);
    return item;
  }

  it('opens the latest chat of the chosen project inside the chat view', async () => {
    const state = baseState();
    const fixture = await renderNavigation(state);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const items = await openProjectMenu(fixture);
    itemByText(items, 'Proj Two').click();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/projects', 'p2', 'chats', 'chat-new']);
  });

  it('opens the project page when the chosen project has no chats', async () => {
    const state = baseState();
    const fixture = await renderNavigation(state);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const items = await openProjectMenu(fixture);
    itemByText(items, 'Empty Project').click();
    await fixture.whenStable();

    expect(state.loadChats).toHaveBeenCalledWith('p3');
    expect(navigate).toHaveBeenCalledWith(['/projects', 'p3']);
  });

  it('keeps the current chat when the current project is chosen again', async () => {
    const state = baseState();
    const fixture = await renderNavigation(state);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const items = await openProjectMenu(fixture);
    itemByText(items, 'Agent Hub').click();
    await fixture.whenStable();

    expect(navigate).not.toHaveBeenCalled();
  });
});
