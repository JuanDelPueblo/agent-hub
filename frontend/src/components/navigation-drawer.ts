import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { router } from '../router';
import { Project, Chat } from '../api/types';
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

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 280px;
      height: 100%;
      background-color: var(--md-sys-color-surface-container-low);
      border-right: 1px solid var(--md-sys-color-outline-variant);
      box-sizing: border-box;
      flex-shrink: 0;
      z-index: 100;
    }

    .drawer-header {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .brand-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .brand-title {
      font-size: 1.125rem;
      font-weight: 700;
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
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--md-sys-color-on-surface-variant);
      padding: 4px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .project-header {
      padding: 8px 12px;
      background-color: var(--md-sys-color-surface-container);
      border-radius: 12px;
      margin-bottom: 8px;
    }

    .project-name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      font-size: 0.9375rem;
    }

    .project-path {
      font-size: 0.75rem;
      color: var(--md-sys-color-outline);
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
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--md-sys-color-on-surface);
      font-size: 0.875rem;
      transition: background-color 0.15s ease;
      user-select: none;
      text-decoration: none;
    }

    .nav-item:hover {
      background-color: var(--md-sys-color-surface-container);
    }

    .nav-item.active {
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      font-weight: 600;
    }

    .nav-item-left {
      display: flex;
      align-items: center;
      gap: 10px;
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
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-dot.running {
      background-color: var(--hub-status-running, #34a853);
    }

    .status-dot.stopped {
      background-color: var(--hub-status-stopped, #9aa0a6);
    }

    .status-dot.dead {
      background-color: var(--hub-status-dead, #ea4335);
    }

    .agent-pill {
      font-size: 0.6875rem;
      padding: 1px 6px;
      border-radius: 4px;
      background-color: var(--md-sys-color-surface-container-high);
      color: var(--md-sys-color-on-surface-variant);
      text-transform: lowercase;
      flex-shrink: 0;
    }

    .actions-row {
      display: flex;
      gap: 8px;
      padding: 0 4px;
    }

    .new-chat-btn {
      width: 100%;
      margin: 4px 0 12px 0;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 18px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    .footer {
      padding: 12px 16px;
      border-top: 1px solid var(--md-sys-color-outline-variant);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .ws-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ws-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .ws-dot.connected {
      background-color: #34a853;
    }

    .ws-dot.connecting {
      background-color: #fbbc04;
    }

    .ws-dot.disconnected {
      background-color: #ea4335;
    }
  `;

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
    store.isMobileDrawerOpen = false;
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
        <div class="brand" @click=${this.handleGoHome}>
          <div class="brand-icon">
            <span class="icon">hub</span>
          </div>
          <span class="brand-title">Agent Hub</span>
        </div>
        <md-icon-button class="close-btn" @click=${this.closeMobileDrawer}>
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
              style="--md-icon-button-size: 28px; width: 28px; height: 28px;"
              @click=${this.handleNewProject}
            >
              <span class="icon" style="font-size: 16px;">add</span>
            </md-icon-button>
          </div>

          <ul class="nav-list">
            ${projects.map(
              (p) => html`
                <li
                  class="nav-item ${activeProjectId === p.id && !activeChatId
                    ? 'active'
                    : ''}"
                  @click=${() => this.handleSelectProject(p.id)}
                >
                  <div class="nav-item-left">
                    <span class="icon" style="color: var(--md-sys-color-outline);">
                      folder
                    </span>
                    <span class="nav-item-title">${p.name}</span>
                  </div>
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
                    style="--md-text-button-container-height: 24px; font-size: 0.6875rem;"
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
                      <li
                        class="nav-item ${activeChatId === c.id ? 'active' : ''}"
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
                      </li>
                    `;
                  })}
                  ${chats.length === 0
                    ? html`
                        <li
                          style="padding: 12px; font-size: 0.8125rem; color: var(--md-sys-color-outline); text-align: center;"
                        >
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
          <span style="text-transform: capitalize;">${wsStatus}</span>
        </div>
        <span>Agent Hub v0.2.0</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-drawer': NavigationDrawer;
  }
}
