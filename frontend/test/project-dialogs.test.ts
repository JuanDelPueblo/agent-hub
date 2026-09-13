/**
 * Component tests for the folder picker and the two project dialogs.
 *
 * These tests render the real Lit components in a DOM, click the real buttons,
 * and read the rendered output. They do not call the component methods.
 */
import './helpers/dom.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  click,
  flush,
  mount,
  recordedRequests,
  requestedPaths,
  resetFetch,
  setFetchResponder,
  shadow,
  shadowAll,
  shadowText,
  type,
  unmount,
} from './helpers/dom.ts';
import '../src/components/folder-picker.ts';
import '../src/components/project-dialog.ts';
import '../src/components/edit-project-dialog.ts';
import type { FolderPicker } from '../src/components/folder-picker.ts';
import type { ProjectDialog } from '../src/components/project-dialog.ts';
import type { EditProjectDialog } from '../src/components/edit-project-dialog.ts';
import type { Project } from '../src/api/types.ts';

/** A small fake filesystem that answers the directory endpoint. */
const TREE: Record<string, string[]> = {
  '/home/tony': ['agent-hub', 'notes'],
  '/home/tony/agent-hub': ['frontend', 'src'],
  '/home/tony/agent-hub/frontend': [],
  '/home/tony/notes': [],
  '/home': ['tony'],
};

const ROOT = '/home/tony';

function listing(path: string) {
  const children = TREE[path] || [];
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = segments.map((name, i) => ({
    name,
    path: `/${segments.slice(0, i + 1).join('/')}`,
  }));
  return {
    current: path,
    name: segments[segments.length - 1] || '/',
    parent: segments.length > 1 ? `/${segments.slice(0, -1).join('/')}` : null,
    breadcrumbs,
    directories: children.map((name) => ({ name, path: `${path}/${name}` })),
  };
}

let editedProjects: Array<{ id: string; name: string; path: string }> = [];
let createdProjects: Array<{ name: string; path: string }> = [];

function installBackend() {
  editedProjects = [];
  createdProjects = [];
  setFetchResponder((req) => {
    const url = new URL(req.url, 'http://localhost:8765');
    if (url.pathname === '/api/filesystem/directories') {
      return listing(url.searchParams.get('path') || ROOT);
    }
    if (url.pathname === '/api/projects' && req.method === 'POST') {
      const body = JSON.parse(req.body || '{}');
      createdProjects.push({ name: body.name, path: body.path });
      return { id: 'proj-new', ...body, created_at: 1, updated_at: 1, chat_count: 0 };
    }
    if (url.pathname.startsWith('/api/projects/') && req.method === 'PATCH') {
      const body = JSON.parse(req.body || '{}');
      const id = url.pathname.split('/')[3];
      editedProjects.push({ id, name: body.name, path: body.path });
      return { id, ...body, created_at: 1, updated_at: 2, chat_count: 0 };
    }
    if (url.pathname === '/api/projects') return [];
    if (url.pathname === '/api/agents') return ['codex'];
    return [];
  });
}

/** The path that the picker shows now, taken from its breadcrumb trail. */
function pickerPath(picker: FolderPicker): string {
  const crumbs = shadowAll<HTMLElement>(picker, '.breadcrumbs .crumb-btn')
    .map((b) => b.textContent?.trim() || '')
    .filter((t) => t && t !== 'arrow_upward');
  return crumbs.length ? `/${crumbs.join('/')}` : '';
}

/** Click the folder row with this name. */
function openFolder(picker: FolderPicker, name: string) {
  const row = shadowAll<HTMLElement>(picker, '.folder-item').find((r) =>
    r.textContent?.includes(name)
  );
  assert.ok(row, `folder row "${name}" is rendered`);
  click(row);
}

function selectCurrentFolder(picker: FolderPicker) {
  const button = shadow<HTMLElement>(picker, 'md-filled-button');
  assert.ok(button, '"Select Current Folder" button is rendered');
  click(button);
}

function pickerOf(dialog: HTMLElement): FolderPicker {
  const pickers = shadowAll<FolderPicker>(dialog, 'folder-picker');
  assert.equal(pickers.length, 1, 'exactly one folder picker is rendered');
  return pickers[0];
}

const mounted: HTMLElement[] = [];

async function render<T extends HTMLElement>(tag: string): Promise<T> {
  const el = await mount<T>(tag);
  mounted.push(el);
  return el;
}

describe('FolderPicker', () => {
  beforeEach(installBackend);
  afterEach(() => {
    while (mounted.length) unmount(mounted.pop()!);
    resetFetch();
  });

  it('loads the root directory when it connects without a path', async () => {
    const picker = await render<FolderPicker>('folder-picker');
    assert.equal(pickerPath(picker), ROOT);
    assert.match(shadowText(picker), /agent-hub/);
  });

  it('reloads when initialPath changes after it connects', async () => {
    const picker = await render<FolderPicker>('folder-picker');
    assert.equal(pickerPath(picker), ROOT);

    // This is what the edit dialog does: it sets the path after the connect.
    picker.initialPath = '/home/tony/agent-hub';
    await flush(picker);

    assert.equal(
      pickerPath(picker),
      '/home/tony/agent-hub',
      'the picker must browse to the new initialPath'
    );
    assert.match(shadowText(picker), /frontend/);
  });

  it('does not reload when initialPath repeats the directory on screen', async () => {
    const picker = await render<FolderPicker>('folder-picker');
    const before = recordedRequests.length;

    picker.initialPath = ROOT;
    await flush(picker);

    assert.equal(recordedRequests.length, before, 'no extra request is sent');
    assert.equal(pickerPath(picker), ROOT);
  });

  it('shows the error and can browse to the same path again after a failure', async () => {
    const picker = await render<FolderPicker>('folder-picker');

    setFetchResponder(() => {
      throw new Error('Path is outside the project root');
    });
    picker.initialPath = '/home/tony/agent-hub';
    await flush(picker);
    assert.match(shadowText(picker), /Path is outside the project root/);

    installBackend();
    picker.browseTo('/home/tony/agent-hub');
    await flush(picker);

    assert.equal(pickerPath(picker), '/home/tony/agent-hub');
    assert.doesNotMatch(shadowText(picker), /Path is outside the project root/);
  });

  it('emits folder-browsed on navigation and folder-selected only on the button', async () => {
    const picker = await render<FolderPicker>('folder-picker');
    const browsed: string[] = [];
    const selected: string[] = [];
    picker.addEventListener('folder-browsed', (e) =>
      browsed.push((e as CustomEvent).detail.path)
    );
    picker.addEventListener('folder-selected', (e) =>
      selected.push((e as CustomEvent).detail.path)
    );

    openFolder(picker, 'agent-hub');
    await flush(picker);

    assert.deepEqual(browsed, ['/home/tony/agent-hub']);
    assert.deepEqual(selected, [], 'browsing must not select a folder');

    selectCurrentFolder(picker);
    await flush(picker);

    assert.deepEqual(selected, ['/home/tony/agent-hub']);
  });
});

describe('New Project dialog', () => {
  beforeEach(installBackend);
  afterEach(() => {
    while (mounted.length) unmount(mounted.pop()!);
    resetFetch();
  });

  async function openDialog(): Promise<ProjectDialog> {
    const dialog = await render<ProjectDialog>('project-dialog');
    dialog.open = true;
    await flush(dialog);
    await flush(pickerOf(dialog));
    await flush(dialog);
    return dialog;
  }

  function createButton(dialog: ProjectDialog): HTMLElement {
    const button = shadowAll<HTMLElement>(dialog, 'md-filled-button').find((b) =>
      b.textContent?.includes('Create Project')
    );
    assert.ok(button, '"Create Project" button is rendered');
    return button;
  }

  it('keeps Create disabled while the user only browses', async () => {
    const dialog = await openDialog();
    const picker = pickerOf(dialog);

    assert.equal(
      (createButton(dialog) as HTMLElement & { disabled: boolean }).disabled,
      true,
      'Create must stay disabled before a selection'
    );
    assert.doesNotMatch(shadowText(dialog), /Selected Directory/);

    openFolder(picker, 'agent-hub');
    await flush(picker);
    await flush(dialog);

    assert.equal(
      (createButton(dialog) as HTMLElement & { disabled: boolean }).disabled,
      true,
      'browsing into a folder must not enable Create'
    );
    assert.doesNotMatch(shadowText(dialog), /Selected Directory/);
  });

  it('commits the path and the default name only on Select Current Folder', async () => {
    const dialog = await openDialog();
    const picker = pickerOf(dialog);

    openFolder(picker, 'agent-hub');
    await flush(picker);
    selectCurrentFolder(picker);
    await flush(picker);
    await flush(dialog);

    assert.equal(
      (createButton(dialog) as HTMLElement & { disabled: boolean }).disabled,
      false
    );
    const text = shadowText(dialog);
    assert.match(text, /Selected Directory/);
    assert.match(text, /\/home\/tony\/agent-hub/);

    click(createButton(dialog));
    await flush(dialog);

    assert.deepEqual(createdProjects, [
      { name: 'agent-hub', path: '/home/tony/agent-hub' },
    ]);
  });

  it('never defaults the project name to the directory it opened at', async () => {
    const dialog = await openDialog();
    const picker = pickerOf(dialog);

    openFolder(picker, 'agent-hub');
    await flush(picker);
    openFolder(picker, 'frontend');
    await flush(picker);
    selectCurrentFolder(picker);
    await flush(picker);
    await flush(dialog);

    click(createButton(dialog));
    await flush(dialog);

    assert.deepEqual(createdProjects, [
      { name: 'frontend', path: '/home/tony/agent-hub/frontend' },
    ]);
  });

  it('keeps a name that the user typed', async () => {
    const dialog = await openDialog();
    const picker = pickerOf(dialog);

    openFolder(picker, 'agent-hub');
    await flush(picker);
    selectCurrentFolder(picker);
    await flush(picker);
    await flush(dialog);

    type(shadow(dialog, 'md-outlined-text-field'), 'My Hub');
    await flush(dialog);

    // A second selection must not overwrite the name that the user typed.
    selectCurrentFolder(picker);
    await flush(picker);
    await flush(dialog);

    click(createButton(dialog));
    await flush(dialog);

    assert.deepEqual(createdProjects, [
      { name: 'My Hub', path: '/home/tony/agent-hub' },
    ]);
  });

  it('keeps Clone disabled until the user selects a parent directory', async () => {
    const dialog = await openDialog();

    const cloneTab = shadowAll<HTMLElement>(dialog, '.tab-btn').find((b) =>
      b.textContent?.includes('Clone Repository')
    );
    click(cloneTab!);
    await flush(dialog);
    const picker = pickerOf(dialog);
    await flush(picker);
    await flush(dialog);

    const cloneButton = () =>
      shadowAll<HTMLElement & { disabled: boolean }>(dialog, 'md-filled-button').find(
        (b) => b.textContent?.includes('Clone & Create')
      )!;

    type(shadow(dialog, 'md-outlined-text-field'), 'https://example.com/a/b.git');
    await flush(dialog);
    assert.equal(cloneButton().disabled, true, 'no parent directory is selected yet');

    openFolder(picker, 'notes');
    await flush(picker);
    await flush(dialog);
    assert.equal(cloneButton().disabled, true, 'browsing is not a selection');

    selectCurrentFolder(picker);
    await flush(picker);
    await flush(dialog);
    assert.equal(cloneButton().disabled, false);
  });
});

describe('Edit Project dialog', () => {
  const project: Project = {
    id: 'proj-1',
    name: 'Agent Hub',
    path: '/home/tony/agent-hub',
    created_at: 1,
    updated_at: 2,
    chat_count: 0,
  };

  beforeEach(installBackend);
  afterEach(() => {
    while (mounted.length) unmount(mounted.pop()!);
    resetFetch();
  });

  /** Build the dialog the way the shell does: it exists before a selection. */
  async function openDialogForProject(p: Project): Promise<EditProjectDialog> {
    const dialog = await render<EditProjectDialog>('edit-project-dialog');
    await flush(pickerOf(dialog));
    // The picker connected without a path, so it now shows the root.
    assert.equal(pickerPath(pickerOf(dialog)), ROOT);

    dialog.project = p;
    dialog.open = true;
    await flush(dialog);
    await flush(pickerOf(dialog));
    await flush(dialog);
    return dialog;
  }

  function saveButton(dialog: EditProjectDialog): HTMLElement {
    const button = shadowAll<HTMLElement>(dialog, 'md-filled-button').find((b) =>
      b.textContent?.includes('Save Changes')
    );
    assert.ok(button, '"Save Changes" button is rendered');
    return button;
  }

  it('opens the picker at the project directory, not at the root', async () => {
    const dialog = await openDialogForProject(project);

    assert.equal(
      pickerPath(pickerOf(dialog)),
      project.path,
      'the picker must follow the project that Edit selected'
    );
    assert.ok(
      requestedPaths().some((u) => u.includes(encodeURIComponent(project.path))),
      'the picker must request the project directory'
    );
    assert.match(shadowText(dialog), /Selected Directory/);
    assert.match(shadowText(dialog), /\/home\/tony\/agent-hub/);
  });

  it('keeps the saved path while the user only browses', async () => {
    const dialog = await openDialogForProject(project);
    const picker = pickerOf(dialog);

    openFolder(picker, 'frontend');
    await flush(picker);
    await flush(dialog);

    // The dialog shows the browsing state, but the selection does not move.
    assert.match(shadowText(dialog), /Browsing/);

    click(saveButton(dialog));
    await flush(dialog);

    assert.deepEqual(editedProjects, [
      { id: 'proj-1', name: 'Agent Hub', path: '/home/tony/agent-hub' },
    ]);
  });

  it('changes the saved path on Select Current Folder', async () => {
    const dialog = await openDialogForProject(project);
    const picker = pickerOf(dialog);

    openFolder(picker, 'frontend');
    await flush(picker);
    selectCurrentFolder(picker);
    await flush(picker);
    await flush(dialog);

    click(saveButton(dialog));
    await flush(dialog);

    assert.deepEqual(editedProjects, [
      {
        id: 'proj-1',
        name: 'Agent Hub',
        path: '/home/tony/agent-hub/frontend',
      },
    ]);
  });

  it('returns to the project directory when it reopens after browsing', async () => {
    const dialog = await openDialogForProject(project);
    const picker = pickerOf(dialog);

    openFolder(picker, 'frontend');
    await flush(picker);
    await flush(dialog);
    assert.equal(pickerPath(picker), '/home/tony/agent-hub/frontend');

    dialog.open = false;
    await flush(dialog);
    dialog.open = true;
    await flush(dialog);
    await flush(pickerOf(dialog));
    await flush(dialog);

    assert.equal(pickerPath(pickerOf(dialog)), project.path);
  });

  it('follows a different project on the next open', async () => {
    const dialog = await openDialogForProject(project);

    dialog.open = false;
    await flush(dialog);
    dialog.project = { ...project, id: 'proj-2', name: 'Notes', path: '/home/tony/notes' };
    dialog.open = true;
    await flush(dialog);
    await flush(pickerOf(dialog));
    await flush(dialog);

    assert.equal(pickerPath(pickerOf(dialog)), '/home/tony/notes');
    assert.match(shadowText(dialog), /\/home\/tony\/notes/);
  });
});
