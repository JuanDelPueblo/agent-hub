import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { AppStateService } from './state/app-state.service';
import { NavigationComponent } from './layout/navigation.component';

@Component({
  selector: 'hub-root',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    NavigationComponent,
    RouterOutlet,
  ],
  template: `
    <mat-sidenav-container class="hub-shell">
      <mat-sidenav
        #drawer
        [mode]="compact() ? 'over' : 'side'"
        [opened]="!compact() || state.isMobileDrawerOpen()"
        aria-label="Project and chat navigation"
        (openedChange)="onDrawerChange($event)"
      >
        <hub-navigation (closeRequested)="closeDrawer(drawer)" />
      </mat-sidenav>

      <mat-sidenav-content>
        @if (!state.activeChatId()) {
          <mat-toolbar class="top-bar">
            @if (compact()) {
              <button mat-icon-button aria-label="Open navigation" (click)="openDrawer(drawer)">
                <mat-icon>menu</mat-icon>
              </button>
            }
            <span class="top-title">{{ state.activeProject()?.name || 'Agent Hub' }}</span>
            <span class="toolbar-spacer"></span>
            <span class="socket-summary" [attr.aria-label]="'WebSocket ' + state.wsStatus()">
              <span class="socket-dot" [class]="state.wsStatus()"></span>
              <span>{{ state.wsStatus() }}</span>
            </span>
          </mat-toolbar>
        }

        <main class="page-content"><router-outlet /></main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    :host { display: block; min-height: 100vh; }
    .hub-shell { min-height: 100vh; }
    mat-sidenav { width: 304px; max-width: 86vw; }
    mat-sidenav-content { display: flex; min-height: 100vh; flex-direction: column; }
    .top-bar { position: sticky; top: 0; z-index: 2; flex: 0 0 auto; border-bottom: 1px solid var(--mat-sys-outline-variant); }
    .top-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .toolbar-spacer { flex: 1; }
    .socket-summary { display: inline-flex; align-items: center; gap: 7px; color: var(--mat-sys-on-surface-variant); font-size: .78rem; text-transform: capitalize; }
    .socket-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--hub-status-dead); }
    .socket-dot.connected { background: var(--hub-status-running); }
    .socket-dot.connecting { background: var(--hub-status-starting); }
    .page-content { display: flex; min-height: 0; flex: 1; flex-direction: column; }
  `,
})
export class AppComponent {
  readonly state = inject(AppStateService);
  readonly compact = signal(false);
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

  openDrawer(drawer: MatSidenav): void {
    this.state.setMobileDrawerOpen(true);
    void drawer.open();
  }

  closeDrawer(drawer: MatSidenav): void {
    this.state.setMobileDrawerOpen(false);
    if (this.compact()) void drawer.close();
  }

  onDrawerChange(open: boolean): void {
    if (this.compact()) this.state.setMobileDrawerOpen(open);
  }
}
