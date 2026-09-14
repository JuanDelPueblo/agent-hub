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

  it('serializes prompt payloads and URL-encodes chat ids', async () => {
    const promise = api.promptChat('chat/a', 'hello');
    const request = http.expectOne('/api/chats/chat%2Fa/prompt');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ text: 'hello' });
    request.flush(null);
    await expect(promise).resolves.toBeUndefined();
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
