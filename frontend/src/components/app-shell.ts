import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { router } from '../router';
import { Project } from '../api/types';
import './navigation-drawer';
import './project-list';
import './chat-view';
import './project-dialog';
import './agent-picker';
import './edit-project-dialog';
import './delete-project-dialog';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

@customElement('app-shell')
export class AppShell extends LitElement {
  @state()
  private isProjectDialogOpen = false;

  @state()
  private isAgentPickerOpen = false;

  @state()
  private isProjectMenuOpen = false;

  @state()
  private editingProject: Project | null = null;

  @state()
  private isEditDialogOpen = false;

  @state()
  private deletingProject: Project | null = null;

  @state()
  private isDeleteDialogOpen = false;

  private unsubscribeStore?: () => void;

  static styles = css`
    :host {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: var(--md-sys-color-background);
      color: var(--md-sys-color-on-background);
      position: relative;
    }

    .main-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      min-width: 0;
      overflow: hidden;
      position: relative;
    }

    .mobile-header {
      display: none;
      height: 56px;
      background-color: var(--md-sys-color-surface-container);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      padding: 0 16px;
      align-items: center;
      gap: 12px;
      box-sizing: border-box;
    }

    .mobile-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .view-container {
      flex: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* Modal drawer styles for medium and compact */
    .drawer-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 99;
      opacity: 0;
      transition: opacity 0.25s ease;
      pointer-events: none;
    }

    .drawer-backdrop.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .drawer-wrapper {
      height: 100%;
      display: flex;
      z-index: 100;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (max-width: 839px) {
      .drawer-backdrop {
        display: block;
      }

      .drawer-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
      }

      .drawer-wrapper.open {
        transform: translateX(0);
        box-shadow: var(--md-sys-elevation-level3);
      }

      .mobile-header.show {
        display: flex;
      }
    }

    .project-overview {
      padding: 24px;
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      max-width: 860px;
      margin: 0 auto;
    }

    .project-hero {
      background-color: var(--md-sys-color-surface-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .project-title {
      margin: 0 0 6px;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .project-path {
      font-size: 0.875rem;
      color: var(--md-sys-color-outline);
      font-family: monospace;
    }

    .project-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-heading {
      font-size: 1.125rem;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .chats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .chat-card {
      background-color: var(--md-sys-color-surface-container-low);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      min-height: 48px;
      box-sizing: border-box;
      transition: border-color 0.15s ease, transform 0.15s ease;
    }

    .chat-card:hover {
      border-color: var(--md-sys-color-primary);
      transform: translateY(-1px);
    }

    .chat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .chat-agent-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 6px;
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      font-weight: 500;
    }

    .chat-state-label {
      font-size: 0.75rem;
      color: var(--md-sys-color-outline);
    }

    .chat-card-title {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chats-empty {
      grid-column: 1 / -1;
      padding: 32px;
      text-align: center;
      color: var(--md-sys-color-outline);
    }

    .danger-action {
      color: var(--md-sys-color-error);
    }

    .menu-anchor {
      position: relative;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
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

  private handleBackdropClick() {
    store.setMobileDrawerOpen(false);
  }

  private openProjectDialog = () => {
    this.isProjectDialogOpen = true;
  };

  private openAgentPicker = () => {
    this.isAgentPickerOpen = true;
  };

  private renderMainView() {
    const { activeProjectId, activeChatId, activeProject, chatsByProject } =
      store;

    if (activeChatId) {
      return html`<chat-view .chatId=${activeChatId}></chat-view>`;
    }

    if (activeProjectId && activeProject) {
      const chats = chatsByProject[activeProjectId] || [];
      return html`
        <div class="project-overview">
          <div class="project-hero">
            <div>
              <h1 class="project-title">
                ${activeProject.name}
              </h1>
              <div class="project-path">
                ${activeProject.path}
              </div>
            </div>
            <div class="project-actions">
              <md-filled-button @click=${this.openAgentPicker}>
                <span class="icon" slot="icon">add_comment</span>
                New Chat
              </md-filled-button>
              <div class="menu-anchor">
                <md-icon-button
                  id="project-overview-menu-trigger"
                  @click=${() =>
                    (this.isProjectMenuOpen = !this.isProjectMenuOpen)}
                >
                  <span class="icon">more_vert</span>
                </md-icon-button>
                <md-menu
                  anchor="project-overview-menu-trigger"
                  .open=${this.isProjectMenuOpen}
                  @closed=${() => (this.isProjectMenuOpen = false)}
                >
                  <md-menu-item
                    @click=${() => {
                      this.editingProject = activeProject;
                      this.isEditDialogOpen = true;
                      this.isProjectMenuOpen = false;
                    }}
                  >
                    <div slot="headline">Edit Project</div>
                  </md-menu-item>
                  <md-menu-item
                    @click=${() => {
                      this.deletingProject = activeProject;
                      this.isDeleteDialogOpen = true;
                      this.isProjectMenuOpen = false;
                    }}
                  >
                    <div
                      slot="headline"
                      class="danger-action"
                    >
                      Delete Project
                    </div>
                  </md-menu-item>
                </md-menu>
              </div>
            </div>
          </div>

          <h2 class="section-heading">
            Chats in this project (${chats.length})
          </h2>

          <div class="chats-grid">
            ${chats.map(
              (c) => html`
                <div
                  class="chat-card"
                  @click=${() =>
                    router.navigate(`/projects/${c.project_id}/chats/${c.id}`)}
                >
                  <div class="chat-card-header">
                    <span class="chat-agent-badge">
                      ${c.agent}
                    </span>
                    <span class="chat-state-label">
                      ${c.process_state || 'STOPPED'}
                    </span>
                  </div>
                  <div class="chat-card-title">
                    ${c.title || 'Untitled chat'}
                  </div>
                </div>
              `
            )}
            ${chats.length === 0
              ? html`
                  <div class="chats-empty">
                    No chats in this project yet. Start a new chat with an
                    agent!
                  </div>
                `
              : null}
          </div>
        </div>
      `;
    }

    return html`<project-list
      @open-new-project=${this.openProjectDialog}
    ></project-list>`;
  }

  render() {
    const isMobileOpen = store.isMobileDrawerOpen;
    const showMobileHeader = !store.activeChatId;

    return html`
      <!-- Drawer Backdrop for mobile/tablet -->
      <div
        class="drawer-backdrop ${isMobileOpen ? 'visible' : ''}"
        @click=${this.handleBackdropClick}
      ></div>

      <!-- Navigation Drawer -->
      <div class="drawer-wrapper ${isMobileOpen ? 'open' : ''}">
        <navigation-drawer
          @open-new-project=${this.openProjectDialog}
          @open-agent-picker=${this.openAgentPicker}
        ></navigation-drawer>
      </div>

      <!-- Main Content Area -->
      <div class="main-wrapper">
        <!-- Mobile Header (hidden on desktop or inside active chat) -->
        <header class="mobile-header ${showMobileHeader ? 'show' : ''}">
          <md-icon-button @click=${() => store.setMobileDrawerOpen(true)}>
            <span class="icon">menu</span>
          </md-icon-button>
          <span class="mobile-title">
            ${store.activeProject ? store.activeProject.name : 'Agent Hub'}
          </span>
        </header>

        <div class="view-container">${this.renderMainView()}</div>
      </div>

      <!-- New Project Dialog -->
      <project-dialog
        .open=${this.isProjectDialogOpen}
        @dialog-closed=${() => (this.isProjectDialogOpen = false)}
        @close=${() => (this.isProjectDialogOpen = false)}
      ></project-dialog>

      <!-- New Chat Agent Picker Dialog -->
      <agent-picker
        .open=${this.isAgentPickerOpen}
        .projectId=${store.activeProjectId || ''}
        @dialog-closed=${() => (this.isAgentPickerOpen = false)}
        @close=${() => (this.isAgentPickerOpen = false)}
      ></agent-picker>

      <!-- Edit Project Dialog -->
      <edit-project-dialog
        .open=${this.isEditDialogOpen}
        .project=${this.editingProject}
        @dialog-closed=${() => (this.isEditDialogOpen = false)}
        @close=${() => (this.isEditDialogOpen = false)}
      ></edit-project-dialog>

      <!-- Delete Project Dialog -->
      <delete-project-dialog
        .open=${this.isDeleteDialogOpen}
        .project=${this.deletingProject}
        @dialog-closed=${() => (this.isDeleteDialogOpen = false)}
        @close=${() => (this.isDeleteDialogOpen = false)}
      ></delete-project-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-shell': AppShell;
  }
}
