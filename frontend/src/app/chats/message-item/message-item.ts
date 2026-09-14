import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { DisplayError, DisplayItem, DisplayTurn, DisplayUserMessage } from '../../core/api/types';
import { TurnEntriesComponent } from '../turn-entries/turn-entries';
import { formatLocalDateTime } from '../../state/chat-activity';

@Component({
  selector: 'hub-message-item',
  imports: [MatIconModule, MatProgressSpinnerModule, TurnEntriesComponent],
  templateUrl: './message-item.html',
  styleUrl: './message-item.scss',
})
export class MessageItemComponent {
  readonly item = input.required<DisplayItem>();
  readonly chatId = input('');
  user(item: DisplayItem): DisplayUserMessage { return item as DisplayUserMessage; }
  turn(item: DisplayItem): DisplayTurn { return item as DisplayTurn; }
  error(item: DisplayItem): DisplayError { return item as DisplayError; }
  formatTime(value: string): string { return formatLocalDateTime(value); }
}
