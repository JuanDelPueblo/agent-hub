import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../core/api/api.service';
import { Breadcrumb, DirectoryListing } from '../../core/api/types';

@Component({
  selector: 'hub-folder-picker',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatListModule, MatProgressBarModule],
  templateUrl: './folder-picker.html',
  styleUrl: './folder-picker.scss',
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
