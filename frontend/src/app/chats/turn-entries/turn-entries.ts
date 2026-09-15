import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import type { TurnEntry } from '../../core/api/types';
import { PermissionCardComponent } from '../../permissions/permission-card/permission-card';
import { MarkdownComponent } from '../../shared/markdown/markdown.component';
import { ElicitationCardComponent } from '../elicitation-card/elicitation-card';
import { PlanViewComponent } from '../plan-view/plan-view';
import { ToolCallComponent } from '../tool-call/tool-call';
import { RichContentComponent } from '../rich-content/rich-content';

/** Renders the ordered, streaming entries inside one agent turn. */
@Component({
  selector: 'hub-turn-entries',
  imports: [ElicitationCardComponent, MatExpansionModule, MatIconModule, MarkdownComponent, PermissionCardComponent, PlanViewComponent, RichContentComponent, ToolCallComponent],
  templateUrl: './turn-entries.html',
  styleUrl: './turn-entries.scss',
})
export class TurnEntriesComponent {
  readonly entries = input.required<TurnEntry[]>();
  readonly chatId = input('');
}
