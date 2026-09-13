import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { FolderPickerComponent } from './folder-picker.component';
import { ApiService } from '../core/api/api.service';

@Component({ standalone: true, imports: [FolderPickerComponent], template: '<hub-folder-picker (folderSelected)="selected = $event.path" />' })
class HostComponent { selected = ''; }

describe('FolderPickerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  const api = {
    fetchDirectories: async (path?: string) => ({
      current: path || '/home/tony', name: path ? 'agent-hub' : 'tony', parent: '/home', roots: ['/home'], breadcrumbs: [{ name: 'home', path: '/home' }, { name: path ? 'agent-hub' : 'tony', path: path || '/home/tony' }],
      directories: path ? [] : [{ name: 'agent-hub', path: '/home/tony/agent-hub' }],
    }),
  } as unknown as ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent], providers: [{ provide: ApiService, useValue: api }] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('separates browsing from selecting the current directory', async () => {
    const row = fixture.nativeElement.querySelector('button[mat-list-item]') as HTMLButtonElement;
    expect(row.textContent).toContain('agent-hub');
    row.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.selected).toBe('');
    const select = Array.from(fixture.nativeElement.querySelectorAll('button')).find((button: unknown) => (button as Element).textContent?.includes('Select current folder')) as HTMLButtonElement;
    select.click();
    expect(host.selected).toBe('/home/tony/agent-hub');
  });
});
