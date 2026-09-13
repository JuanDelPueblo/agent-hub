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
import { ConnectionStatusComponent } from './layout/connection-status/connection-status';
import { NavigationComponent } from './layout/navigation/navigation';

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
  templateUrl: './app.html',
  styleUrl: './app.scss',
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
