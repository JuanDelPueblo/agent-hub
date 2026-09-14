import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let api: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('preserves the project REST contract', async () => {
    const promise = api.fetchProjects();
    const request = http.expectOne('/api/projects');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 'p1', name: 'Hub', path: '/work', created_at: 'a', updated_at: 'b' }]);
    await expect(promise).resolves.toHaveLength(1);
  });

  it('loads rich installed-agent summaries from the catalog endpoint', async () => {
    const promise = api.fetchAgents();
    const request = http.expectOne('/api/agents');
    expect(request.request.method).toBe('GET');
    request.flush([{
      id: 'custom', display_name: 'Custom ACP', source: 'file',
      availability: 'available', usage_provider: null, metadata: { package: 'custom' },
    }]);
    await expect(promise).resolves.toEqual([expect.objectContaining({ id: 'custom', source: 'file' })]);
  });

  it('serializes prompt payloads and URL-encodes chat ids', async () => {
    const promise = api.promptChat('chat/a', 'hello');
    const request = http.expectOne('/api/chats/chat%2Fa/prompt');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ text: 'hello' });
    request.flush(null);
    await expect(promise).resolves.toBeUndefined();
  });

  it('requests chat-scoped history with a sequence cursor', async () => {
    const firstPromise = api.fetchChatHistory('chat/a', undefined, 7);
    const first = http.expectOne('/api/chats/chat%2Fa/history?through_seq=7');
    expect(first.request.method).toBe('GET');
    first.flush({ events: [], next_cursor: 42, has_older: true });
    await expect(firstPromise).resolves.toMatchObject({ next_cursor: 42, has_older: true });

    const olderPromise = api.fetchChatHistory('chat/a', 42);
    const older = http.expectOne('/api/chats/chat%2Fa/history?before_seq=42');
    older.flush({ events: [], next_cursor: null, has_older: false });
    await expect(olderPromise).resolves.toMatchObject({ has_older: false });
  });

  it('fetches workspace options and sends the Phase 2 workspace selection', async () => {
    const optionsPromise = api.fetchWorkspaceOptions('git/project');
    const optionsRequest = http.expectOne('/api/projects/git%2Fproject/workspace-options');
    expect(optionsRequest.request.method).toBe('GET');
    optionsRequest.flush({ is_git: true, current_branch: 'main', head_sha: 'a'.repeat(40), dirty: false, branches: [] });
    await expect(optionsPromise).resolves.toMatchObject({ current_branch: 'main' });

    const chatPromise = api.createChat('git/project', 'codex', undefined, {
      mode: 'project_checkout', branch: 'feature/ui',
    });
    const chatRequest = http.expectOne('/api/projects/git%2Fproject/chats');
    expect(chatRequest.request.body).toEqual({
      agent: 'codex', title: undefined, workspace: { mode: 'project_checkout', branch: 'feature/ui' },
    });
    chatRequest.flush({ id: 'chat-1' });
    await expect(chatPromise).resolves.toMatchObject({ id: 'chat-1' });
  });
});
