import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ChatWorkspaceComponent } from '../../chats/chat-workspace/chat-workspace';

@Component({
  selector: 'hub-chat-page',
  imports: [ChatWorkspaceComponent],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.scss',
})
export class ChatPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly chatId = toSignal(this.route.paramMap.pipe(map((params) => params.get('chatId') ?? '')), { initialValue: this.route.snapshot.paramMap.get('chatId') ?? '' });
}
