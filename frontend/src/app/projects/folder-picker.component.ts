import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../core/api/api.service';
import { Breadcrumb, DirectoryListing } from '../core/api/types';

@Component({
  selector: 'hub-folder-picker',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatListModule, MatProgressBarModule],
  template: `
    <div class="picker">
      @if (error()) {
        <div class="error-box" role="alert">{{ error() }}</div>
      }

      @if (listing(); as current) {
        <nav class="breadcrumbs" aria-label="Directory path">
          @if (current.parent) {
            <button mat-button type="button" (click)="browseTo(current.parent!)" aria-label="Go to parent directory">
              <mat-icon>arrow_upward</mat-icon>
            </button>
          }
          @for (crumb of current.breadcrumbs; track crumb.path; let last = $last) {
            <button mat-button type="button" class="crumb" (click)="browseTo(crumb.path)">{{ crumb.name }}</button>
            @if (!last) { <span aria-hidden="true">/</span> }
          }
        </nav>

        <div class="directory-list" aria-label="Subdirectories">
          @if (loading()) {
            <mat-progress-bar mode="indeterminate" aria-label="Loading directories" />
          }
          @for (directory of current.directories; track directory.path) {
            <button mat-list-item type="button" (click)="browseTo(directory.path)">
              <mat-icon matListItemIcon>folder</mat-icon>
              <span matListItemTitle>{{ directory.name }}</span>
              <mat-icon matListItemMeta>chevron_right</mat-icon>
            </button>
          } @empty {
            @if (!loading()) { <p class="empty">No subdirectories found</p> }
          }
        </div>

        <div class="picker-actions">
          <span class="current-path" [title]="current.current">{{ current.current }}</span>
          <button mat-flat-button color="primary" type="button" (click)="selectCurrent()">
            <mat-icon>check</mat-icon>
            Select current folder
          </button>
        </div>
      } @else if (loading()) {
        <div class="loading"><mat-progress-bar mode="indeterminate" aria-label="Loading directories" /></div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .picker { display: flex; flex-direction: column; gap: 12px; }
    .breadcrumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; padding: 4px; border-radius: 12px; background: var(--mat-sys-surface-container-low); color: var(--mat-sys-on-surface-variant); }
    .breadcrumbs .crumb { min-width: 0; padding-inline: 7px; }
    .directory-list { min-height: 170px; max-height: 250px; overflow: auto; border: 1px solid var(--mat-sys-outline-variant); border-radius: 12px; }
    .directory-list mat-progress-bar { position: sticky; top: 0; z-index: 1; }
    .directory-list button { width: 100%; text-align: left; }
    .empty { padding: 32px 16px; margin: 0; color: var(--mat-sys-outline); text-align: center; }
    .loading { min-height: 170px; display: grid; align-content: center; }
    .picker-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .current-path { min-width: 0; overflow: hidden; color: var(--mat-sys-on-surface-variant); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .78rem; text-overflow: ellipsis; white-space: nowrap; }
    .error-box { padding: 12px 16px; border-radius: 12px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    @media (max-width: 599px) { .picker-actions { align-items: stretch; flex-direction: column; } .current-path { white-space: normal; overflow-wrap: anywhere; } }
  `,
})
export class FolderPickerComponent implements OnInit, OnChanges {
  @Input() initialPath = '';
  @Output() readonly folderBrowsed = new EventEmitter<{ path: string; name: string }>();
  @Output() readonly folderSelected = new EventEmitter<{ path: string; name: string }>();

  readonly listing = signal<DirectoryListing | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  private readonly api = inject(ApiService);
  private loadedPath = '';
  private loadSequence = 0;

  ngOnInit(): void {
    void this.loadDirectory(this.initialPath || undefined);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialPath'] && !changes['initialPath'].firstChange && this.initialPath) {
      this.browseTo(this.initialPath);
    }
  }

  browseTo(path: string): void {
    if (!path || path === this.loadedPath) return;
    void this.loadDirectory(path);
  }

  async loadDirectory(path?: string): Promise<void> {
    const sequence = ++this.loadSequence;
    this.loadedPath = path || '';
    this.loading.set(true);
    this.error.set('');
    try {
      const result = await this.api.fetchDirectories(path);
      if (sequence !== this.loadSequence) return;
      this.listing.set(result);
      this.loadedPath = result.current;
      this.folderBrowsed.emit({ path: result.current, name: result.name });
    } catch (error: unknown) {
      if (sequence !== this.loadSequence) return;
      this.loadedPath = this.listing()?.current ?? '';
      this.error.set(error instanceof Error ? error.message : 'Failed to load directories');
    } finally {
      if (sequence === this.loadSequence) this.loading.set(false);
    }
  }

  selectCurrent(): void {
    const current = this.listing();
    if (current) this.folderSelected.emit({ path: current.current, name: current.name });
  }
}
