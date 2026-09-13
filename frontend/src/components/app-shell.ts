import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { router } from '../router';
import { Project } from '../api/types';
import { sharedStyles } from '../styles/shared';
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

  static styles = [sharedStyles, css`
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
      height: 64px;
      background-color: var(--md-sys-color-surface);
      border-bottom: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 42%, transparent);
      padding: 0 var(--hub-page-gutter-compact);
      align-items: center;
      gap: var(--hub-space-3);
      box-sizing: border-box;
    }

    .mobile-title {
      font-family: var(--md-sys-typescale-title-large-font-family);
      font-size: var(--md-sys-typescale-title-large-font-size);
      font-weight: var(--md-sys-typescale-title-large-font-weight);
      line-height: var(--md-sys-typescale-title-large-line-height);
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
      background-color: color-mix(in srgb, var(--md-sys-color-scrim) 38%, transparent);
      z-index: 99;
      opacity: 0;
      transition: opacity var(--hub-duration-medium2) var(--hub-easing-standard);
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
      transition: transform var(--hub-duration-medium3) var(--hub-easing-emphasized-decelerate);
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
        box-shadow: var(--md-sys-elevation-level4);
      }

      .mobile-header.show {
        display: flex;
      }
    }

    .project-overview {
      padding: var(--hub-space-8) var(--hub-page-gutter) var(--hub-space-9);
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      max-width: var(--hub-content-max-width);
      margin: 0 auto;
    }

    .project-hero {
      background: linear-gradient(120deg, var(--md-sys-color-surface-container-low) 0%, var(--md-sys-color-primary-container) 150%);
      border-radius: var(--md-sys-shape-corner-extra-extra-large);
      padding: var(--hub-space-8);
      margin-bottom: var(--hub-space-8);
      min-height: 168px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--hub-space-6);
      box-shadow: var(--md-sys-elevation-level1);
    }

    .project-title {
      margin: 0 0 6px;
      font-family: var(--md-sys-typescale-headline-font-family);
      font-size: clamp(1.75rem, 4vw, var(--md-sys-typescale-headline-font-size));
      font-weight: var(--md-sys-typescale-headline-font-weight);
      line-height: var(--md-sys-typescale-headline-line-height);
      letter-spacing: var(--md-sys-typescale-headline-letter-spacing);
    }

    .project-path {
      font-family: var(--md-sys-typescale-code-font);
      font-size: var(--md-sys-typescale-code-font-size);
      line-height: var(--md-sys-typescale-code-line-height);
      color: var(--md-sys-color-on-surface-variant);
      overflow-wrap: anywhere;
    }

    .project-actions {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
    }

    .section-heading {
      font-family: var(--md-sys-typescale-title-large-font-family);
      font-size: var(--md-sys-typescale-title-large-font-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      margin-bottom: var(--hub-space-4);
      font-weight: var(--md-sys-typescale-title-large-font-weight);
    }

    .chats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--hub-space-4);
    }

    .chat-card {
      background-color: var(--md-sys-color-surface-container-low);
      border: 1px solid transparent;
      border-radius: var(--md-sys-shape-corner-large);
      padding: var(--hub-space-5);
      cursor: pointer;
      min-height: 104px;
      box-sizing: border-box;
      transition: background-color var(--hub-duration-short3) var(--hub-easing-standard),
        box-shadow var(--hub-duration-short3) var(--hub-easing-standard),
        transform var(--hub-duration-short3) var(--hub-easing-standard);
    }

    .chat-card:hover {
      background-color: var(--md-sys-color-surface-container);
      box-shadow: var(--md-sys-elevation-level2);
      transform: translateY(-2px);
    }

    .chat-card:focus-visible {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: 3px;
    }

    .chat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--hub-space-4);
    }

    .chat-agent-badge {
      font-size: var(--md-sys-typescale-label-medium-font-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      padding: 4px 10px;
      border-radius: var(--md-sys-shape-corner-full);
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      font-weight: var(--md-sys-typescale-label-medium-font-weight);
    }

    .chat-state-label {
      font-size: var(--md-sys-typescale-body-small-font-size);
      color: var(--md-sys-color-on-surface-variant);
    }

    .chat-state-label.running { color: var(--status-running); }
    .chat-state-label.dead { color: var(--status-dead); }

    .chat-card-title {
      font-weight: var(--md-sys-typescale-title-medium-font-weight);
      font-size: var(--md-sys-typescale-title-medium-font-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chats-empty {
      grid-column: 1 / -1;
      padding: var(--hub-space-8);
      text-align: center;
      color: var(--md-sys-color-outline);
    }

    .danger-action {
      color: var(--md-sys-color-error);
    }

    .menu-anchor {
      position: relative;
    }

    .icon { --hub-icon-size: 24px; }

    @media (max-width: 599px) {
      .project-overview {
        padding: var(--hub-space-6) var(--hub-page-gutter-compact) var(--hub-space-8);
      }

      .project-hero {
        align-items: flex-start;
        flex-direction: column;
        padding: var(--hub-space-6);
        min-height: 0;
      }

      .project-actions {
        width: 100%;
      }

      .project-actions md-filled-button {
        flex: 1;
      }
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
                  aria-label="Project actions"
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
                  role="button"
                  tabindex="0"
                  @click=${() =>
                    router.navigate(`/projects/${c.project_id}/chats/${c.id}`)}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.navigate(`/projects/${c.project_id}/chats/${c.id}`);
                    }
                  }}
                >
                  <div class="chat-card-header">
                    <span class="chat-agent-badge">
                      ${c.agent}
                    </span>
                    <span
                      class="chat-state-label ${c.process_state === 'RUNNING'
                        ? 'running'
                        : c.process_state === 'DEAD'
                        ? 'dead'
                        : 'stopped'}"
                    >
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
          <md-icon-button
            aria-label="Open navigation"
            @click=${() => store.setMobileDrawerOpen(true)}
          >
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
