import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, Input, computed, inject, signal } from '@angular/core';
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
  standalone: true,
  imports: [ChatConfigComponent, ChatComposerComponent, ChatHeaderComponent, EventStreamComponent, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSidenavModule],
  templateUrl: './chat-workspace.html',
  styleUrl: './chat-workspace.scss',
})
export class ChatWorkspaceComponent {
  private readonly chatIdState = signal('');
  @Input() set chatId(value: string) { this.chatIdState.set(value); }
  get chatId(): string { return this.chatIdState(); }
  readonly state = inject(AppStateService);
  readonly configOpen = signal(false);
  readonly compact = signal(false);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  readonly chat = computed<Chat | null>(() => this.chatIdState() ? this.state.findChat(this.chatIdState()) : null);
  readonly items = computed(() => (this.chatIdState() ? this.state.reducersByChat()[this.chatIdState()]?.items() ?? [] : []));
  readonly options = computed(() => this.chatIdState() ? this.state.configOptionsByChat()[this.chatIdState()] ?? [] : []);
  readonly connecting = computed(() => this.chatIdState() ? this.state.connectingChats().has(this.chatIdState()) : false);
  readonly connectError = computed(() => this.chatIdState() ? this.state.connectErrors()[this.chatIdState()] ?? '' : '');
  readonly configLoaded = computed(() => this.chatIdState() ? this.state.configLoadedByChat()[this.chatIdState()] === true : false);

  constructor() {
    this.breakpointObserver.observe('(max-width: 839px)').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ matches }) => this.compact.set(matches));
  }
  openConfig(drawer: MatDrawer): void { this.configOpen.set(true); void drawer.open(); }
  closeConfig(drawer: MatDrawer): void { this.configOpen.set(false); void drawer.close(); }
  retry(): void { if (this.chatId) void this.state.retryConnection(this.chatId); }
}
