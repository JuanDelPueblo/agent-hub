/**
 * End-to-end component tests for the application shell.
 *
 * The shell builds the Edit Project dialog once and reuses it for every
 * project. These tests open that dialog by clicking the real menu item.
 */
import './helpers/dom.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  click,
  flush,
  mount,
  resetFetch,
  setFetchResponder,
  shadow,
  shadowAll,
  unmount,
} from './helpers/dom.ts';
import '../src/components/app-shell.ts';
import type { AppShell } from '../src/components/app-shell.ts';
import type { EditProjectDialog } from '../src/components/edit-project-dialog.ts';
import type { FolderPicker } from '../src/components/folder-picker.ts';
import { store } from '../src/state/app-state.ts';
import { router } from '../src/router.ts';
import type { Project } from '../src/api/types.ts';

const TREE: Record<string, string[]> = {
  '/home/tony': ['agent-hub', 'notes'],
  '/home/tony/agent-hub': ['frontend'],
  '/home/tony/agent-hub/frontend': [],
  '/home/tony/notes': [],
};

const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Agent Hub',
    path: '/home/tony/agent-hub',
    created_at: 1,
    updated_at: 2,
    chat_count: 0,
  },
  {
    id: 'proj-2',
    name: 'Notes',
    path: '/home/tony/notes',
    created_at: 1,
    updated_at: 2,
    chat_count: 0,
  },
];

function listing(path: string) {
  const segments = path.split('/').filter(Boolean);
  return {
    current: path,
    name: segments[segments.length - 1] || '/',
    parent: segments.length > 1 ? `/${segments.slice(0, -1).join('/')}` : null,
    breadcrumbs: segments.map((name, i) => ({
      name,
      path: `/${segments.slice(0, i + 1).join('/')}`,
    })),
    directories: (TREE[path] || []).map((name) => ({ name, path: `${path}/${name}` })),
  };
}

let edits: Array<{ id: string; name: string; path: string }> = [];

function installBackend() {
  edits = [];
  setFetchResponder((req) => {
    const url = new URL(req.url, 'http://localhost:8765');
    const parts = url.pathname.split('/').filter(Boolean);
    if (url.pathname === '/api/filesystem/directories') {
      return listing(url.searchParams.get('path') || '/home/tony');
    }
    if (url.pathname === '/api/projects') return PROJECTS;
    if (url.pathname === '/api/agents') return ['codex'];
    if (parts[1] === 'projects' && parts[3] === 'chats') return [];
    if (parts[1] === 'projects' && parts.length === 3 && req.method === 'PATCH') {
      const body = JSON.parse(req.body || '{}');
      edits.push({ id: parts[2], name: body.name, path: body.path });
      return { ...PROJECTS[0], ...body, id: parts[2] };
    }
    return [];
  });
}

const mounted: HTMLElement[] = [];

function pickerPath(picker: FolderPicker): string {
  const crumbs = shadowAll<HTMLElement>(picker, '.breadcrumbs .crumb-btn')
    .map((b) => b.textContent?.trim() || '')
    .filter((t) => t && t !== 'arrow_upward');
  return crumbs.length ? `/${crumbs.join('/')}` : '';
}

/** Open the project overview of a project inside the shell. */
async function openProject(shell: AppShell, projectId: string) {
  router.navigate('/');
  await flush(shell, 2);
  router.navigate(`/projects/${projectId}`);
  await flush(shell, 6);
}

/** Click the "Edit Project" item of the project overview menu. */
async function openEditDialog(shell: AppShell): Promise<EditProjectDialog> {
  const trigger = shadow<HTMLElement>(shell, '#project-overview-menu-trigger');
  if (trigger) click(trigger);
  await flush(shell, 2);

  const item = shadowAll<HTMLElement>(shell, 'md-menu-item').find((i) =>
    i.textContent?.includes('Edit Project')
  );
  assert.ok(item, 'the "Edit Project" menu item is rendered');
  click(item);
  await flush(shell, 4);

  const dialog = shadow<EditProjectDialog>(shell, 'edit-project-dialog');
  assert.ok(dialog, 'the shell holds one edit dialog');
  await flush(dialog, 4);
  return dialog;
}

function pickerOf(dialog: EditProjectDialog): FolderPicker {
  const picker = shadow<FolderPicker>(dialog, 'folder-picker');
  assert.ok(picker, 'the edit dialog renders a folder picker');
  return picker;
}

describe('App shell: Edit Project', () => {
  beforeEach(() => {
    installBackend();
    store.chatsByProject = {};
    store.activeProjectId = null;
    store.activeChatId = null;
    store.isMobileDrawerOpen = false;
  });

  afterEach(() => {
    while (mounted.length) unmount(mounted.pop()!);
    resetFetch();
  });

  it('opens the picker at the directory of the project that Edit selected', async () => {
    const shell = await mount<AppShell>('app-shell');
    mounted.push(shell);
    await store.loadProjects();
    await openProject(shell, 'proj-1');

    const dialog = await openEditDialog(shell);
    const picker = pickerOf(dialog);

    assert.equal(
      pickerPath(picker),
      '/home/tony/agent-hub',
      'the picker must not stay at the directory it connected to'
    );
  });

  it('follows the next project that Edit selects', async () => {
    const shell = await mount<AppShell>('app-shell');
    mounted.push(shell);
    await store.loadProjects();

    await openProject(shell, 'proj-1');
    let dialog = await openEditDialog(shell);
    assert.equal(pickerPath(pickerOf(dialog)), '/home/tony/agent-hub');
    dialog.open = false;
    await flush(dialog, 2);

    await openProject(shell, 'proj-2');
    dialog = await openEditDialog(shell);
    assert.equal(pickerPath(pickerOf(dialog)), '/home/tony/notes');
  });

  it('saves the project path that the user selected, not the one browsed', async () => {
    const shell = await mount<AppShell>('app-shell');
    mounted.push(shell);
    await store.loadProjects();
    await openProject(shell, 'proj-1');

    const dialog = await openEditDialog(shell);
    const picker = pickerOf(dialog);

    const row = shadowAll<HTMLElement>(picker, '.folder-item').find((r) =>
      r.textContent?.includes('frontend')
    );
    assert.ok(row, 'the picker lists the subdirectory');
    click(row);
    await flush(picker, 4);
    await flush(dialog, 2);

    const save = shadowAll<HTMLElement>(dialog, 'md-filled-button').find((b) =>
      b.textContent?.includes('Save Changes')
    );
    click(save!);
    await flush(dialog, 4);

    assert.deepEqual(edits, [
      { id: 'proj-1', name: 'Agent Hub', path: '/home/tony/agent-hub' },
    ]);
  });
});

describe('App shell: mobile drawer', () => {
  beforeEach(() => {
    installBackend();
    store.isMobileDrawerOpen = false;
  });

  afterEach(() => {
    while (mounted.length) unmount(mounted.pop()!);
    resetFetch();
  });

  it('opens on the menu button and closes on the backdrop', async () => {
    const shell = await mount<AppShell>('app-shell');
    mounted.push(shell);
    router.navigate('/');
    await flush(shell, 4);

    const wrapper = () => shadow<HTMLElement>(shell, '.drawer-wrapper')!;
    const backdrop = () => shadow<HTMLElement>(shell, '.drawer-backdrop')!;

    assert.equal(wrapper().classList.contains('open'), false);
    assert.equal(backdrop().classList.contains('visible'), false);

    const menuButton = shadow<HTMLElement>(shell, '.mobile-header md-icon-button');
    assert.ok(menuButton, 'the mobile header renders a menu button');
    click(menuButton);
    await flush(shell, 3);

    assert.equal(wrapper().classList.contains('open'), true, 'the drawer opens');
    assert.equal(backdrop().classList.contains('visible'), true);

    click(backdrop());
    await flush(shell, 3);

    assert.equal(wrapper().classList.contains('open'), false, 'the backdrop closes it');
    assert.equal(backdrop().classList.contains('visible'), false);
  });
});
