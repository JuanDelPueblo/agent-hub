import { Service, signal } from '@angular/core';

/** Owns route selection and transient navigation presentation state. */
@Service()
export class UiStateStore {
  readonly activeProjectId = signal<string | null>(null);
  readonly activeChatId = signal<string | null>(null);
  readonly isMobileDrawerOpen = signal(false);
  readonly showArchived = signal(false);

  setRoute(projectId: string | null, chatId: string | null): void {
    this.activeProjectId.set(projectId);
    this.activeChatId.set(chatId);
  }

  setMobileDrawerOpen(open: boolean): void {
    this.isMobileDrawerOpen.set(open);
  }

  setShowArchived(show: boolean): void {
    this.showArchived.set(show);
  }
}
