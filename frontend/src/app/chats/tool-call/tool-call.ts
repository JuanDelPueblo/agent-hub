import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import type { TurnEntryTool } from '../../core/api/types';

@Component({
  selector: 'hub-tool-call',
  imports: [MatExpansionModule, MatIconModule],
  templateUrl: './tool-call.html',
  styleUrl: './tool-call.scss',
})
export class ToolCallComponent { readonly tool = input.required<TurnEntryTool>(); }
