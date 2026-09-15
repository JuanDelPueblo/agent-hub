import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { FolderPickerComponent } from './folder-picker';
import { ApiService } from '../../core/api/api.service';

@Component({ imports: [FolderPickerComponent], template: '<hub-folder-picker [initialPath]="initialPath()" (folderSelected)="selected = $event.path" />' })
class HostComponent { readonly initialPath = signal(''); selected = ''; }

describe('FolderPickerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  const requestedPaths: Array<string | undefined> = [];
  const api = {
    fetchDirectories: async (path?: string) => {
      requestedPaths.push(path);
      return {
        current: path || '/home/tony', name: path ? 'batey' : 'tony', parent: '/home', roots: ['/home'], breadcrumbs: [{ name: 'home', path: '/home' }, { name: path ? 'batey' : 'tony', path: path || '/home/tony' }],
        directories: path ? [] : [{ name: 'batey', path: '/home/tony/batey' }],
      };
    },
  } as unknown as ApiService;

  beforeEach(async () => {
    requestedPaths.length = 0;
    await TestBed.configureTestingModule({ imports: [HostComponent], providers: [{ provide: ApiService, useValue: api }] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('separates browsing from selecting the current directory', async () => {
    const row = fixture.nativeElement.querySelector('button[mat-list-item]') as HTMLButtonElement;
    expect(row.textContent).toContain('batey');
    row.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.selected).toBe('');
    const select = Array.from(fixture.nativeElement.querySelectorAll('button')).find((button: unknown) => (button as Element).textContent?.includes('Select current folder')) as HTMLButtonElement;
    select.click();
    expect(host.selected).toBe('/home/tony/batey');
  });

  it('browses when the signal input changes', async () => {
    host.initialPath.set('/home/tony/batey');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(requestedPaths).toEqual([undefined, '/home/tony/batey']);
  });
});
