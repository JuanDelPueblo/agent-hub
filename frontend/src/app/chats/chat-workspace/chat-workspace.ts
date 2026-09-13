import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { ChatConfigComponent } from '../chat-config/chat-config';
import { ChatComposerComponent } from '../chat-composer/chat-composer';
import { ChatHeaderComponent } from '../chat-header/chat-header';
import { EventStreamComponent } from '../event-stream/event-stream';

@Component({
  selector: 'hub-chat-workspace',
  imports: [ChatConfigComponent, ChatComposerComponent, ChatHeaderComponent, EventStreamComponent, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSidenavModule],
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
  readonly connecting = computed(() => this.chatId() ? this.state.connectingChats().has(this.chatId()) : false);
  readonly connectError = computed(() => this.chatId() ? this.state.connectErrors()[this.chatId()] ?? '' : '');
  readonly configLoaded = computed(() => this.chatId() ? this.state.configLoadedByChat()[this.chatId()] === true : false);

  constructor() {
    this.breakpointObserver.observe('(max-width: 839px)').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ matches }) => this.compact.set(matches));
  }
  openConfig(drawer: MatDrawer): void { this.configOpen.set(true); void drawer.open(); }
  closeConfig(drawer: MatDrawer): void { this.configOpen.set(false); void drawer.close(); }
  retry(): void { if (this.chatId()) void this.state.retryConnection(this.chatId()); }
}
