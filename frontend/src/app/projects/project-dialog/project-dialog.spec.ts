import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ApiService } from '../../core/api/api.service';
import type { Project } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { ProjectDialogComponent } from './project-dialog';

const createdProject: Project = {
  id: 'project-new',
  name: 'batey',
  path: '/home/tony/batey',
  created_at: '2026-09-13',
  updated_at: '2026-09-13',
  chat_count: 0,
};

describe('ProjectDialogComponent', () => {
  let fixture: ComponentFixture<ProjectDialogComponent>;
  let component: ProjectDialogComponent;
  let state: {
    createProject: ReturnType<typeof vi.fn>;
    cloneProject: ReturnType<typeof vi.fn>;
  };
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    state = {
      createProject: vi.fn(async (name: string, path: string) => ({ ...createdProject, name, path })),
      cloneProject: vi.fn(async () => ({ ...createdProject, id: 'cloned-project' })),
    };
    dialogRef = { close: vi.fn() };
    router = { navigate: vi.fn(async () => true) };

    await TestBed.configureTestingModule({
      imports: [ProjectDialogComponent],
      providers: [
        { provide: ApiService, useValue: {
          fetchDirectories: async (path?: string) => ({
            current: path || '/home/tony',
            name: path ? path.split('/').filter(Boolean).at(-1) || '/' : 'tony',
            parent: '/home',
            roots: ['/home'],
            breadcrumbs: [{ name: 'home', path: '/home' }, { name: 'tony', path: '/home/tony' }],
            directories: path ? [] : [{ name: 'batey', path: '/home/tony/batey' }],
          }),
        } as unknown as ApiService },
        { provide: AppStateService, useValue: state as unknown as AppStateService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('keeps browsing separate from the selected folder and creates a project through state', async () => {
    const row = fixture.nativeElement.querySelector('hub-folder-picker button[mat-list-item]') as HTMLButtonElement;
    expect(row.textContent).toContain('batey');
    row.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.selectedPath()).toBe('');
    const select = Array.from(fixture.nativeElement.querySelectorAll('hub-folder-picker button'))
      .find((button: unknown) => (button as Element).textContent?.includes('Select current folder')) as HTMLButtonElement;
    select.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const create = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button: unknown) => (button as Element).textContent?.toLowerCase().includes('create project')) as HTMLButtonElement;
    expect(create.disabled).toBe(false);
    create.click();
    await fixture.whenStable();

    expect(state.createProject).toHaveBeenCalledWith('batey', '/home/tony/batey');
    expect(dialogRef.close).toHaveBeenCalledWith(createdProject);
    expect(router.navigate).toHaveBeenCalledWith(['/projects', 'project-new']);
  });

  it('passes the clone workflow to the same application state boundary', async () => {
    component.repoUrl.set('https://example.com/repository.git');
    component.cloneParentPath.set('/home/tony');
    component.cloneProjectName.set('repository');

    await component.cloneRepository();

    expect(state.cloneProject).toHaveBeenCalledWith({
      url: 'https://example.com/repository.git',
      parent_path: '/home/tony',
      name: 'repository',
    });
    expect(dialogRef.close).toHaveBeenCalledWith({ ...createdProject, id: 'cloned-project' });
  });
});
