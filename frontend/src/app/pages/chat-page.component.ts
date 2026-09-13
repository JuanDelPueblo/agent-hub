import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ChatWorkspaceComponent } from '../chats/chat-workspace.component';

@Component({ selector: 'hub-chat-page', standalone: true, imports: [ChatWorkspaceComponent], template: '<hub-chat-workspace [chatId]="chatId()" />' })
export class ChatPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly chatId = toSignal(this.route.paramMap.pipe(map((params) => params.get('chatId') ?? '')), { initialValue: this.route.snapshot.paramMap.get('chatId') ?? '' });
}
