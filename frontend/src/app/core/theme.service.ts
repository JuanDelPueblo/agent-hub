import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

export type ThemeMode = 'system' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'pueblo-hub-theme';
const LEGACY_THEME_STORAGE_KEY = 'agent-hub-theme';

@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly mode = signal<ThemeMode>(this.readMode());

  constructor() {
    effect(() => {
      const mode = this.mode();
      this.document.documentElement.dataset['theme'] = mode;
      if (typeof localStorage !== 'undefined') localStorage.setItem(THEME_STORAGE_KEY, mode);
    });
  }

  cycle(): void {
    const next: Record<ThemeMode, ThemeMode> = { system: 'light', light: 'dark', dark: 'system' };
    this.mode.set(next[this.mode()]);
  }

  icon(): string { return this.mode() === 'dark' ? 'dark_mode' : this.mode() === 'light' ? 'light_mode' : 'brightness_auto'; }
  label(): string { return this.mode() === 'dark' ? 'Dark theme' : this.mode() === 'light' ? 'Light theme' : 'Use system theme'; }

  private readMode(): ThemeMode {
    if (typeof localStorage === 'undefined') return 'system';
    const value = localStorage.getItem(THEME_STORAGE_KEY)
      ?? localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
  }
}
