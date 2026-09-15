import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { ChatConfigComponent } from '../chat-config/chat-config';
import { ChatComposerComponent } from '../chat-composer/chat-composer';
import { ChatHeaderComponent } from '../chat-header/chat-header';
import { EventStreamComponent } from '../event-stream/event-stream';

@Component({
  selector: 'hub-chat-workspace',
  imports: [ChatConfigComponent, ChatComposerComponent, ChatHeaderComponent, EventStreamComponent, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSidenavModule, RouterLink],
  templateUrl: './chat-workspace.html',
  styleUrl: './chat-workspace.scss',
})
export class ChatWorkspaceComponent {
  readonly chatId = input('');
  readonly state = inject(AppStateService);
  readonly configOpen = signal(false);
  readonly compact = signal(false);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  readonly chat = computed<Chat | null>(() => this.chatId() ? this.state.findChat(this.chatId()) : null);
  readonly items = computed(() => (this.chatId() ? this.state.reducersByChat()[this.chatId()]?.items() ?? [] : []));
  readonly options = computed(() => this.chatId() ? this.state.configOptionsByChat()[this.chatId()] ?? [] : []);
  readonly commands = computed(() => this.chatId() ? this.state.commandsByChat()[this.chatId()] ?? [] : []);
  readonly modes = computed(() => this.chatId() ? this.state.modesByChat()[this.chatId()] ?? null : null);
  readonly usage = computed(() => this.chatId() ? this.state.usageByChat()[this.chatId()] ?? null : null);
  readonly connecting = computed(() => this.chatId() ? this.state.connectingChats().has(this.chatId()) : false);
  readonly connectError = computed(() => this.chatId() ? this.state.connectErrors()[this.chatId()] ?? '' : '');
  readonly rejectedConfig = computed(() => this.chatId() ? this.state.rejectedConfigByChat()[this.chatId()] ?? '' : '');
  readonly configLoaded = computed(() => this.chatId() ? this.state.configLoadedByChat()[this.chatId()] === true : false);
  readonly historyLoading = computed(() => this.chatId() ? this.state.historyLoadingByChat().has(this.chatId()) : false);
  readonly historyError = computed(() => this.chatId() ? this.state.historyErrors()[this.chatId()] ?? '' : '');
  readonly hasOlderHistory = computed(() => this.chatId() ? this.state.historyHasOlderByChat()[this.chatId()] === true : false);
  readonly blockedEnvrc = computed(() => this.chatId() ? this.state.blockedEnvrcByChat()[this.chatId()] ?? null : null);
  readonly authRequired = computed(() => this.chatId() ? this.state.authRequiredByChat()[this.chatId()] ?? null : null);
  readonly authorizingEnv = signal(false);

  constructor() {
    this.breakpointObserver.observe('(max-width: 839px)').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ matches }) => this.compact.set(matches));
  }
  openConfig(drawer: MatDrawer): void { this.configOpen.set(true); void drawer.open(); }
  closeConfig(drawer: MatDrawer): void { this.configOpen.set(false); void drawer.close(); }
  retry(): void { if (this.chatId()) void this.state.retryConnection(this.chatId()); }
  resetConfig(): void { if (this.chatId()) void this.state.resetRejectedConfig(this.chatId()); }
  loadOlderHistory(): void { if (this.chatId()) void this.state.loadOlderHistory(this.chatId()); }
  retryHistory(): void { if (this.chatId()) void this.state.retryHistory(this.chatId()); }
  dismissAuthRequired(): void { if (this.chatId()) this.state.clearAuthRequired(this.chatId()); }
  async authorizeEnvironment(): Promise<void> {
    const id = this.chatId();
    if (!id) return;
    this.authorizingEnv.set(true);
    try {
      await this.state.authorizeChatEnvironment(id);
    } catch (err) {
      console.error("Failed to authorize environment", err);
    } finally {
      this.authorizingEnv.set(false);
    }
  }
}
