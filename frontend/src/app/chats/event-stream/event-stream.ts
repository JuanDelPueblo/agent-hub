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
import type { DisplayItem } from '../../core/api/types';
import { MessageItemComponent } from '../message-item/message-item';

@Component({
  selector: 'hub-event-stream',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, MessageItemComponent],
  templateUrl: './event-stream.html',
  styleUrl: './event-stream.scss',
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
