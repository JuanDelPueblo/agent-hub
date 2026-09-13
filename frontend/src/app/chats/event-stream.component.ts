import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
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
        @for (item of items; track item.id) { <hub-message-item [item]="item" [chatId]="chatId" /> }
      </div>
      @if (showScrollButton) { <div class="scroll-control"><button mat-fab extended color="primary" type="button" matTooltip="Scroll to latest message" (click)="scrollToBottom(true)"><mat-icon>arrow_downward</mat-icon> Latest</button></div> }
    </div>
  `,
  styles: `
    :host { display: block; min-height: 0; flex: 1; } .stream { position: relative; height: 100%; overflow: auto; padding: 28px max(20px, calc((100% - 920px) / 2)); scroll-behavior: smooth; } .stream-content { min-height: 100%; } .scroll-control { position: sticky; bottom: 20px; display: flex; justify-content: center; height: 0; overflow: visible; z-index: 1; } @media (max-width: 599px) { .stream { padding: 20px 12px; } }
  `,
})
export class EventStreamComponent implements AfterViewChecked {
  @Input() items: DisplayItem[] = [];
  @Input() chatId = '';
  @ViewChild('viewport') private viewport?: ElementRef<HTMLElement>;
  showScrollButton = false;
  private autoScroll = true;
  private lastLength = 0;

  ngAfterViewChecked(): void {
    if (this.items.length !== this.lastLength) { this.lastLength = this.items.length; if (this.autoScroll) this.scrollToBottom(); }
  }
  onScroll(): void { const element = this.viewport?.nativeElement; if (!element) return; const distance = element.scrollHeight - element.scrollTop - element.clientHeight; this.autoScroll = distance <= 80; this.showScrollButton = distance > 200; }
  scrollToBottom(smooth = false): void { const element = this.viewport?.nativeElement; if (!element) return; element.scrollTo({ top: element.scrollHeight, behavior: smooth ? 'smooth' : 'auto' }); }
}
