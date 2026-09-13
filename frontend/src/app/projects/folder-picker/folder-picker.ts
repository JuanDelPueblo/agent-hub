import { Component, effect, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../core/api/api.service';
import { DirectoryListing } from '../../core/api/types';

@Component({
  selector: 'hub-folder-picker',
  imports: [MatButtonModule, MatIconModule, MatListModule, MatProgressBarModule],
  templateUrl: './folder-picker.html',
  styleUrl: './folder-picker.scss',
})
export class FolderPickerComponent {
  readonly initialPath = input('');
  readonly folderBrowsed = output<{ path: string; name: string }>();
  readonly folderSelected = output<{ path: string; name: string }>();

  readonly listing = signal<DirectoryListing | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  private readonly api = inject(ApiService);
  private loadedPath = '';
  private loadSequence = 0;
  private initialized = false;

  constructor() {
    effect(() => {
      const path = this.initialPath();
      if (!this.initialized) {
        this.initialized = true;
        void this.loadDirectory(path || undefined);
      } else if (path) {
        this.browseTo(path);
      }
    });
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
