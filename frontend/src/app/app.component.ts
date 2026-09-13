import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppStateService } from './state/app-state.service';
import { ThemeService } from './core/theme.service';
import { ConnectionStatusComponent } from './layout/connection-status.component';
import { NavigationComponent } from './layout/navigation.component';

/**
 * The application shell. The navigation drawer appears only inside an active chat.
 * The project list and the project page stand on their own with a top app bar.
 */
@Component({
  selector: 'hub-root',
  standalone: true,
  imports: [
    ConnectionStatusComponent,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    NavigationComponent,
    RouterLink,
    RouterOutlet,
  ],
  template: `
    <mat-sidenav-container class="hub-shell" [class.no-drawer]="!showDrawer()">
      @if (showDrawer()) {
        <mat-sidenav
          [mode]="compact() ? 'over' : 'side'"
          [opened]="!compact() || state.isMobileDrawerOpen()"
          aria-label="Project and chat navigation"
          (openedChange)="onDrawerChange($event)"
        >
          <hub-navigation (closeRequested)="closeDrawer()" />
        </mat-sidenav>
      }

      <mat-sidenav-content>
        @if (!showDrawer()) {
          <mat-toolbar class="top-bar">
            <div class="top-bar-inner">
            <a class="brand" routerLink="/" aria-label="Agent Hub home">
              <span class="brand-mark"><mat-icon>hub</mat-icon></span>
              <span class="brand-name">Agent Hub</span>
            </a>
            <span class="toolbar-spacer"></span>
            <hub-connection-status />
            <button
              mat-icon-button
              [matTooltip]="theme.label()"
              [attr.aria-label]="theme.label()"
              (click)="theme.cycle()"
            >
              <mat-icon>{{ theme.icon() }}</mat-icon>
            </button>
            </div>
          </mat-toolbar>
        }

        <main class="page-content"><router-outlet /></main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    :host { display: block; height: 100dvh; }
    .hub-shell { height: 100%; background: var(--mat-sys-surface); }

    mat-sidenav { width: 304px; max-width: 86vw; }
    mat-sidenav.mat-drawer-side { --mat-sidenav-container-shape: 0; border-right: 1px solid var(--mat-sys-outline-variant); }
    mat-sidenav.mat-drawer-over { --mat-sidenav-container-shape: 0 16px 16px 0; border-right: 0; }

    mat-sidenav-content { display: flex; height: 100%; min-height: 0; flex-direction: column; }

    .top-bar { flex: 0 0 auto; height: 72px; padding: 0; background: var(--mat-sys-surface); }
    .top-bar-inner { display: flex; align-items: center; gap: 8px; width: 100%; max-width: var(--hub-page-max); margin: 0 auto; padding-inline: var(--hub-page-gutter); }
    .brand { display: inline-flex; align-items: center; gap: 12px; min-width: 0; height: 48px; padding: 0 18px 0 10px; margin-left: -10px; border-radius: var(--mat-sys-corner-full); color: var(--mat-sys-on-surface); text-decoration: none; transition: background 120ms ease; }
    .brand:hover { background: var(--mat-sys-surface-container-high); }
    .brand:focus-visible { outline: 3px solid var(--mat-sys-secondary); outline-offset: 1px; }
    .brand-mark { display: grid; place-items: center; flex: 0 0 auto; width: 36px; height: 36px; border-radius: var(--mat-sys-corner-medium); background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); }
    .brand-mark mat-icon { width: 20px; height: 20px; font-size: 20px; }
    .brand-name { overflow: hidden; font: var(--mat-sys-title-medium); letter-spacing: var(--mat-sys-title-medium-tracking); text-overflow: ellipsis; white-space: nowrap; }
    .toolbar-spacer { flex: 1; }

    .page-content { display: flex; min-height: 0; flex: 1; flex-direction: column; }
  `,
})
export class AppComponent {
  readonly state = inject(AppStateService);
  readonly theme = inject(ThemeService);
  readonly compact = signal(false);
  readonly showDrawer = computed(() => this.state.activeChatId() !== null);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 839px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => {
        this.compact.set(matches);
        if (!matches) this.state.setMobileDrawerOpen(false);
      });
  }

  closeDrawer(): void {
    this.state.setMobileDrawerOpen(false);
  }

  onDrawerChange(open: boolean): void {
    if (this.compact()) this.state.setMobileDrawerOpen(open);
  }
}
