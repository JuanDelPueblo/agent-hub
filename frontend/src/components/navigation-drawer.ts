import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { router } from '../router';
import { Project, Chat } from '../api/types';
import { sharedStyles } from '../styles/shared';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';

@customElement('navigation-drawer')
export class NavigationDrawer extends LitElement {
  @property({ type: Boolean })
  isOpen = false;

  @state()
  private showArchived = false;

  private unsubscribeStore?: () => void;

  static styles = [sharedStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      width: var(--hub-drawer-width);
      height: 100%;
      background-color: var(--md-sys-color-surface-container-low);
      border-right: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 42%, transparent);
      box-sizing: border-box;
      flex-shrink: 0;
      z-index: 100;
    }

    .drawer-header {
      padding: 20px 18px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--hub-space-3);
      cursor: pointer;
      user-select: none;
      border: 0;
      padding: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-extra-small);
      background: linear-gradient(145deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-tertiary) 120%);
      color: var(--md-sys-color-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      --hub-icon-size: 22px;
      --hub-icon-fill: 1;
      box-shadow: var(--md-sys-elevation-level1);
    }

    .brand-title {
      font-family: var(--md-sys-typescale-title-large-font-family);
      font-size: var(--md-sys-typescale-title-large-font-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      font-weight: var(--md-sys-typescale-title-large-font-weight);
      letter-spacing: -0.2px;
      color: var(--md-sys-color-on-surface);
    }

    .close-btn {
      display: none;
    }

    @media (max-width: 839px) {
      .close-btn {
        display: inline-flex;
      }
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--hub-space-3) var(--hub-space-3) var(--hub-space-6);
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-7);
    }

    .section-title {
      font-size: var(--md-sys-typescale-label-medium-font-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      font-weight: var(--md-sys-typescale-label-medium-font-weight);
      letter-spacing: var(--md-sys-typescale-label-medium-letter-spacing);
      color: var(--md-sys-color-on-surface-variant);
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .project-header {
      padding: var(--hub-space-3) var(--hub-space-4);
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-medium);
      margin-bottom: var(--hub-space-3);
    }

    .project-name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: var(--md-sys-typescale-title-medium-font-weight);
      color: var(--md-sys-color-on-surface);
      font-size: var(--md-sys-typescale-title-medium-font-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
    }

    .project-path {
      font-size: var(--md-sys-typescale-body-small-font-size);
      line-height: var(--md-sys-typescale-body-small-line-height);
      color: var(--md-sys-color-on-surface-variant);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 12px;
      min-height: 52px;
      box-sizing: border-box;
      border: 0;
      border-radius: var(--md-sys-shape-corner-medium);
      cursor: pointer;
      color: var(--md-sys-color-on-surface);
      background: transparent;
      font-size: var(--md-sys-typescale-body-medium-font-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      text-align: left;
      transition: background-color var(--hub-duration-short3) var(--hub-easing-standard),
        color var(--hub-duration-short3) var(--hub-easing-standard),
        transform var(--hub-duration-short2) var(--hub-easing-standard);
      user-select: none;
      text-decoration: none;
    }

    .nav-item:hover {
      background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 7%, transparent);
    }

    .nav-item:active {
      transform: scale(0.985);
    }

    .nav-item.active {
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      font-weight: var(--md-sys-typescale-label-large-font-weight);
      box-shadow: inset 3px 0 var(--md-sys-color-primary);
    }

    .nav-item.active:hover {
      background-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 88%, var(--md-sys-color-primary));
    }

    .nav-item.active .icon {
      --hub-icon-fill: 1;
      color: var(--md-sys-color-primary);
    }

    .nav-item-left {
      display: flex;
      align-items: center;
      gap: var(--hub-space-3);
      min-width: 0;
      flex: 1;
    }

    .nav-item-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--md-sys-shape-corner-full);
      flex-shrink: 0;
      box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 12%, transparent);
    }

    .status-dot.running {
      background-color: var(--status-running);
      color: var(--status-running);
    }

    .status-dot.stopped {
      background-color: var(--status-stopped);
      color: var(--status-stopped);
    }

    .status-dot.dead {
      background-color: var(--status-dead);
      color: var(--status-dead);
    }

    .agent-pill {
      font-size: var(--md-sys-typescale-label-small-font-size);
      line-height: var(--md-sys-typescale-label-small-line-height);
      padding: 3px 7px;
      border-radius: var(--md-sys-shape-corner-small);
      background-color: var(--md-sys-color-surface-container-high);
      color: var(--md-sys-color-on-surface-variant);
      text-transform: lowercase;
      flex-shrink: 0;
    }

    .actions-row {
      display: flex;
      gap: var(--hub-space-2);
      padding: 0 var(--hub-space-1);
    }

    .new-chat-btn {
      width: 100%;
      margin: var(--hub-space-2) 0 var(--hub-space-4);
    }

    .icon { --hub-icon-size: 20px; color: var(--md-sys-color-on-surface-variant); }

    .section-action {
      --md-icon-button-size: 32px;
      width: 32px;
      height: 32px;
    }

    .section-action-icon {
      --hub-icon-size: 18px;
    }

    .archive-toggle {
      --md-text-button-container-height: 32px;
      --md-text-button-label-text-size: var(--md-sys-typescale-label-small-font-size);
    }

    .empty-nav {
      padding: var(--hub-space-4) var(--hub-space-3);
      color: var(--md-sys-color-outline);
      font-size: var(--md-sys-typescale-body-small-font-size);
      text-align: center;
    }

    .version-label {
      white-space: nowrap;
    }

    .footer {
      padding: var(--hub-space-4) 18px;
      border-top: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 42%, transparent);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--md-sys-typescale-body-small-font-size);
      line-height: var(--md-sys-typescale-body-small-line-height);
      color: var(--md-sys-color-on-surface-variant);
    }

    .ws-indicator {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
    }

    .ws-dot {
      width: 7px;
      height: 7px;
      border-radius: var(--md-sys-shape-corner-full);
    }

    .ws-dot.connected {
      background-color: var(--status-running);
    }

    .ws-dot.connecting {
      background-color: var(--status-starting);
    }

    .ws-dot.disconnected {
      background-color: var(--status-dead);
    }
  `];

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeStore = store.subscribe(() => {
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
    super.disconnectedCallback();
  }

  private closeMobileDrawer() {
    store.setMobileDrawerOpen(false);
  }

  private handleGoHome() {
    router.navigate('/');
    this.closeMobileDrawer();
  }

  private handleSelectProject(projectId: string) {
    router.navigate(`/projects/${projectId}`);
    this.closeMobileDrawer();
  }

  private handleSelectChat(projectId: string, chatId: string) {
    router.navigate(`/projects/${projectId}/chats/${chatId}`);
    this.closeMobileDrawer();
  }

  private handleNewProject() {
    this.dispatchEvent(
      new CustomEvent('open-new-project', { bubbles: true, composed: true })
    );
    this.closeMobileDrawer();
  }

  private handleNewChat() {
    this.dispatchEvent(
      new CustomEvent('open-agent-picker', { bubbles: true, composed: true })
    );
    this.closeMobileDrawer();
  }

  render() {
    const { projects, activeProjectId, activeChatId, chatsByProject, wsStatus } =
      store;
    const activeProject = store.activeProject;
    const allChats = activeProjectId ? chatsByProject[activeProjectId] || [] : [];
    const chats = this.showArchived
      ? allChats
      : allChats.filter((c) => !c.archived);

    return html`
      <div class="drawer-header">
        <button class="brand" type="button" @click=${this.handleGoHome}>
          <div class="brand-icon">
            <span class="icon">hub</span>
          </div>
          <span class="brand-title">Agent Hub</span>
        </button>
        <md-icon-button
          class="close-btn"
          aria-label="Close navigation"
          @click=${this.closeMobileDrawer}
        >
          <span class="icon">close</span>
        </md-icon-button>
      </div>

      <div class="drawer-body">
        <!-- Projects Section -->
        <div>
          <div class="section-title">
            <span>Projects</span>
            <md-icon-button
              title="New Project"
              class="section-action"
              @click=${this.handleNewProject}
            >
              <span class="icon section-action-icon">add</span>
            </md-icon-button>
          </div>

          <ul class="nav-list">
            ${projects.map(
              (p) => html`
                <li>
                  <button
                    class="nav-item ${activeProjectId === p.id && !activeChatId
                      ? 'active'
                      : ''}"
                    type="button"
                    aria-current=${activeProjectId === p.id && !activeChatId ? 'page' : 'false'}
                    @click=${() => this.handleSelectProject(p.id)}
                  >
                    <div class="nav-item-left">
                      <span class="icon">folder</span>
                      <span class="nav-item-title">${p.name}</span>
                    </div>
                  </button>
                </li>
              `
            )}
          </ul>
        </div>

        <!-- Chats Section for Active Project -->
        ${activeProject
          ? html`
              <div>
                <div class="project-header">
                  <div class="project-name-row">
                    <span>${activeProject.name}</span>
                  </div>
                  <div class="project-path" title=${activeProject.path}>
                    ${activeProject.path}
                  </div>
                </div>

                <md-filled-button
                  class="new-chat-btn"
                  @click=${this.handleNewChat}
                >
                  <span class="icon" slot="icon">add_comment</span>
                  New Chat
                </md-filled-button>

                <div class="section-title">
                  <span>Chats (${chats.length})</span>
                  <md-text-button
                    class="archive-toggle"
                    @click=${() => (this.showArchived = !this.showArchived)}
                  >
                    ${this.showArchived ? 'Active only' : 'Archived'}
                  </md-text-button>
                </div>

                <ul class="nav-list">
                  ${chats.map((c) => {
                    const isRunning = c.process_state === 'RUNNING';
                    const isDead = c.process_state === 'DEAD';
                    return html`
                      <li>
                        <button
                          class="nav-item ${activeChatId === c.id ? 'active' : ''}"
                          type="button"
                          aria-current=${activeChatId === c.id ? 'page' : 'false'}
                          @click=${() =>
                            this.handleSelectChat(c.project_id, c.id)}
                        >
                          <div class="nav-item-left">
                            <span
                              class="status-dot ${isRunning
                                ? 'running'
                                : isDead
                                ? 'dead'
                                : 'stopped'}"
                            ></span>
                            <span class="nav-item-title" title=${c.title}>
                              ${c.title || 'Untitled chat'}
                            </span>
                          </div>
                          <span class="agent-pill">${c.agent}</span>
                        </button>
                      </li>
                    `;
                  })}
                  ${chats.length === 0
                    ? html`
                        <li class="empty-nav">
                          No chats yet
                        </li>
                      `
                    : null}
                </ul>
              </div>
            `
          : null}
      </div>

      <div class="footer">
        <div class="ws-indicator">
          <span class="ws-dot ${wsStatus}"></span>
          <span>${wsStatus}</span>
        </div>
        <span class="version-label">Agent Hub v0.2.0</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-drawer': NavigationDrawer;
  }
}
