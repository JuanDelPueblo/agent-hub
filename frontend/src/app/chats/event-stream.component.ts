import {
  Component,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Injector } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { DisplayItem } from '../core/api/types';
import { MessageItemComponent } from './message-item.component';

@Component({
  selector: 'hub-event-stream',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, MessageItemComponent],
  template: `
    <div #viewport class="stream" (scroll)="onScroll()" aria-live="polite">
      <div class="stream-content">
        @for (item of items(); track item.id) {
          <hub-message-item [item]="item" [chatId]="chatId()" />
        }
      </div>
    </div>
    @if (showScrollButton()) {
      <div class="scroll-control">
        <button matFab extended type="button" matTooltip="Scroll to latest message" (click)="scrollToBottom(true)">
          <mat-icon>arrow_downward</mat-icon> Latest
        </button>
      </div>
    }
  `,
  styles: `
    :host { position: relative; display: block; min-height: 0; flex: 1; }
    .stream { height: 100%; overflow: auto; overscroll-behavior: contain; padding: 28px max(var(--hub-gutter), calc((100% - var(--hub-measure)) / 2)); }
    .stream-content { max-width: var(--hub-measure); margin: 0 auto; }
    .scroll-control { position: absolute; right: 0; bottom: 20px; left: 0; display: flex; justify-content: center; pointer-events: none; z-index: 1; }
    .scroll-control button { pointer-events: auto; }
    @media (max-width: 599px) { .stream { padding: 20px 16px; } }
  `,
})
export class EventStreamComponent {
  readonly items = input<DisplayItem[]>([]);
  readonly chatId = input('');
  readonly showScrollButton = signal(false);

  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private readonly injector = inject(Injector);
  private autoScroll = true;

  constructor() {
    // The item list gets a new identity on every streamed chunk, so this reacts
    // to appended text inside an open turn as well as to a new item.
    effect(() => {
      this.items();
      if (!this.autoScroll) return;
      afterNextRender({ read: () => this.scrollToBottom() }, { injector: this.injector });
    });
  }

  onScroll(): void {
    const element = this.viewport()?.nativeElement;
    if (!element) return;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    this.autoScroll = distance <= 80;
    this.showScrollButton.set(distance > 200);
  }

  scrollToBottom(smooth = false): void {
    const element = this.viewport()?.nativeElement;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    this.autoScroll = true;
    this.showScrollButton.set(false);
  }
}
