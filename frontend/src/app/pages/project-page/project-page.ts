import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import type { Chat, Project } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { chatActivityLabel, type ChatActivity } from '../../state/chat-activity';
import { compareChatsByRecency } from '../../state/chat-session.store';
import { ChatStatusBadgeComponent } from '../../shared/chat-status-badge/chat-status-badge';
import { NewChatButtonComponent } from '../../chats/new-chat-button/new-chat-button';
import { DeleteProjectDialogComponent } from '../../projects/delete-project-dialog/delete-project-dialog';
import { EditProjectDialogComponent } from '../../projects/edit-project-dialog/edit-project-dialog';

@Component({
  selector: 'hub-project-page',
  imports: [
    ChatStatusBadgeComponent,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NewChatButtonComponent,
    RouterLink,
  ],
  templateUrl: './project-page.html',
  styleUrl: './project-page.scss',
})
export class ProjectPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly state = inject(AppStateService);
  readonly compact = signal(false);
  private readonly dialog = inject(MatDialog);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  readonly projectId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('projectId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('projectId') ?? '' },
  );
  readonly project = computed(
    () => this.state.projects().find((item) => item.id === this.projectId()) ?? null,
  );
  readonly chats = computed(() => this.state.chatsByProject()[this.projectId()] ?? []);
  readonly visibleChats = computed(() =>
    [...(this.state.showArchived() ? this.chats() : this.chats().filter((chat) => !chat.archived))]
      .sort(compareChatsByRecency),
  );

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) void this.state.loadChats(id);
    });
    this.breakpointObserver
      .observe('(max-width: 839px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => this.compact.set(matches));
  }

  agentLabel(agent: string | null | undefined): string {
    const value = agent ?? '';
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  activityFor(chat: Chat): ChatActivity {
    return this.state.chatActivity(chat.id);
  }

  chatAriaLabel(chat: Chat): string {
    return `Open chat ${chat.title || 'Untitled chat'}, ${chatActivityLabel(
      this.activityFor(chat),
      this.state.chatTurnStartedAt(chat.id),
    )}`;
  }

  edit(project: Project): void {
    this.dialog.open(EditProjectDialogComponent, { width: 'min(640px, calc(100vw - 32px))', panelClass: 'hub-wide-dialog', data: project });
  }

  remove(project: Project): void {
    this.dialog.open(DeleteProjectDialogComponent, { width: 'min(520px, calc(100vw - 32px))', data: project });
  }
}
