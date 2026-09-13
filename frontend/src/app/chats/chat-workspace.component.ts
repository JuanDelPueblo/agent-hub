import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, Input, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chat } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';
import { ChatConfigComponent } from './chat-config.component';
import { ChatComposerComponent } from './chat-composer.component';
import { ChatHeaderComponent } from './chat-header.component';
import { EventStreamComponent } from './event-stream.component';

@Component({
  selector: 'hub-chat-workspace',
  standalone: true,
  imports: [ChatConfigComponent, ChatComposerComponent, ChatHeaderComponent, EventStreamComponent, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSidenavModule],
  template: `
    <mat-drawer-container class="chat-layout" [hasBackdrop]="compact()">
      <mat-drawer #configDrawer position="end" [mode]="compact() ? 'over' : 'side'" [opened]="configOpen()" (closed)="configOpen.set(false)" aria-label="Chat configuration">
        <div class="config-header"><h2>Chat configuration</h2><button mat-icon-button aria-label="Close chat configuration" (click)="closeConfig(configDrawer)"><mat-icon>close</mat-icon></button></div>
        <div class="config-body"><hub-chat-config [chat]="chat()" [options]="options()" /></div>
      </mat-drawer>
      <mat-drawer-content class="chat-content">
        <hub-chat-header [chat]="chat()" (configRequested)="openConfig(configDrawer)" />
        @if (!chat()) {
          <section class="status-state"><mat-icon>chat</mat-icon><h1>No chat selected</h1><p>Choose a chat from the navigation.</p></section>
        } @else if (connecting()) {
          <section class="status-state"><mat-spinner diameter="44" /><h1>Connecting to {{ chat()!.agent }}…</h1><p>Initializing the ACP session and loading agent options.</p></section>
        } @else if (connectError()) {
          <section class="status-state error-state" role="alert"><mat-icon>error_outline</mat-icon><h1>Connection failed</h1><p>{{ connectError() }}</p><button mat-flat-button color="primary" type="button" (click)="retry()">Retry connection</button></section>
        } @else if (!configLoaded() && !items().length) {
          <section class="status-state error-state" role="alert"><mat-icon>tune</mat-icon><h1>Agent options not loaded</h1><p>Agent Hub cannot read the configuration of {{ chat()!.agent }} yet.</p><button mat-flat-button color="primary" type="button" (click)="retry()">Retry connection</button></section>
        } @else if (!items().length) {
          <section class="welcome"><mat-card><mat-card-content><div class="welcome-heading"><span class="avatar">{{ chat()!.agent[0] }}</span><div><h1>{{ chat()!.agent }} connected</h1><p>Configure agent options or send your first message to begin.</p></div></div><hub-chat-config [chat]="chat()" [options]="options()" /></mat-card-content></mat-card></section>
        } @else { <hub-event-stream [items]="items()" [chatId]="chatId" /> }
        @if (chat()) { <hub-chat-composer [chatId]="chatId" [processState]="chat()!.process_state || 'STOPPED'" [turnState]="chat()!.turn_state || 'IDLE'" [disabled]="connecting() || !!connectError() || !configLoaded()" /> }
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: `
    :host { display: block; min-height: 0; flex: 1; } .chat-layout { height: 100%; min-height: calc(100vh - 1px); } .chat-content { display: flex; min-height: 0; flex-direction: column; } mat-drawer { width: 380px; max-width: 90vw; } .config-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--mat-sys-outline-variant); } .config-header h2 { margin: 0; font-size: 1.1rem; } .config-body { overflow: auto; height: calc(100% - 68px); padding: 20px; } .status-state { display: grid; justify-items: center; align-content: center; gap: 12px; min-height: 320px; padding: 40px 20px; color: var(--mat-sys-on-surface-variant); text-align: center; } .status-state mat-icon { width: 48px; height: 48px; font-size: 48px; color: var(--mat-sys-primary); } .status-state h1, .status-state p { margin: 0; } .status-state h1 { color: var(--mat-sys-on-surface); font-size: 1.35rem; } .error-state mat-icon { color: var(--mat-sys-error); } .error-state h1 { color: var(--mat-sys-error); } .welcome { display: flex; justify-content: center; overflow: auto; flex: 1; padding: 28px max(20px, calc((100% - 920px) / 2)); } .welcome mat-card { width: 100%; max-width: 920px; align-self: flex-start; } .welcome-heading { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; } .welcome-heading h1, .welcome-heading p { margin: 0; } .welcome-heading p { margin-top: 4px; color: var(--mat-sys-on-surface-variant); } .avatar { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 16px 16px 16px 4px; background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); font-weight: 700; text-transform: uppercase; }
  `,
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
  readonly items = computed(() => this.chatIdState() ? this.state.reducersByChat()[this.chatIdState()]?.items ?? [] : []);
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
