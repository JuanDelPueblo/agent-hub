import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { router } from '../router';
import { Project } from '../api/types';
import { sharedStyles } from '../styles/shared';
import '@material/web/fab/fab.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import './edit-project-dialog';
import './delete-project-dialog';

@customElement('project-list')
export class ProjectList extends LitElement {
  private unsubscribeStore?: () => void;

  @state() private openMenuId: string | null = null;
  @state() private editingProject: Project | null = null;
  @state() private isEditDialogOpen = false;
  @state() private deletingProject: Project | null = null;
  @state() private isDeleteDialogOpen = false;

  static styles = [sharedStyles, css`
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      padding: var(--hub-space-8) var(--hub-page-gutter) var(--hub-space-9);
      box-sizing: border-box;
      background-color: var(--md-sys-color-background);
    }

    .container {
      max-width: var(--hub-content-max-width);
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--hub-space-8);
      gap: var(--hub-space-6);
    }

    .title-group h1 {
      margin: 0;
      font-family: var(--md-sys-typescale-headline-font-family);
      font-size: clamp(2rem, 5vw, var(--md-sys-typescale-headline-font-size));
      line-height: var(--md-sys-typescale-headline-line-height);
      font-weight: var(--md-sys-typescale-headline-font-weight);
      letter-spacing: var(--md-sys-typescale-headline-letter-spacing);
      color: var(--md-sys-color-on-background);
    }

    .title-group p {
      margin: var(--hub-space-2) 0 0;
      font-size: var(--md-sys-typescale-body-large-font-size);
      line-height: var(--md-sys-typescale-body-large-line-height);
      color: var(--md-sys-color-on-surface-variant);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--hub-space-5);
    }

    .project-card {
      background-color: var(--md-sys-color-surface-container-low);
      border: 1px solid transparent;
      border-radius: var(--md-sys-shape-corner-extra-large);
      padding: var(--hub-space-6);
      min-height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: transform var(--hub-duration-short3) var(--hub-easing-standard),
        box-shadow var(--hub-duration-short3) var(--hub-easing-standard),
        background-color var(--hub-duration-short3) var(--hub-easing-standard);
      position: relative;
    }

    .project-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--md-sys-elevation-level2);
      background-color: var(--md-sys-color-surface-container);
      border-color: transparent;
    }

    .project-card:active {
      transform: scale(0.99);
    }

    .project-card:focus-visible {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: 4px;
    }

    .card-top {
      display: flex;
      align-items: flex-start;
      gap: var(--hub-space-4);
      margin-bottom: var(--hub-space-5);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-extra-small);
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      --hub-icon-size: 24px;
      --hub-icon-fill: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-details {
      min-width: 0;
      flex: 1;
    }

    .card-title {
      font-family: var(--md-sys-typescale-title-large-font-family);
      font-size: var(--md-sys-typescale-title-large-font-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      font-weight: var(--md-sys-typescale-title-large-font-weight);
      color: var(--md-sys-color-on-surface);
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-path {
      font-size: var(--md-sys-typescale-code-font-size);
      line-height: var(--md-sys-typescale-code-line-height);
      color: var(--md-sys-color-on-surface-variant);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: var(--md-sys-typescale-code-font);
    }

    .menu-anchor {
      position: relative;
    }

    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--md-sys-typescale-body-small-font-size);
      color: var(--md-sys-color-on-surface-variant);
      padding-top: var(--hub-space-4);
    }

    .chat-count {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
      font-weight: var(--md-sys-typescale-label-large-font-weight);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--hub-space-9) var(--hub-space-6);
      text-align: center;
      background-color: var(--md-sys-color-surface-container-low);
      border-radius: var(--md-sys-shape-corner-extra-extra-large);
      border: 1px dashed color-mix(in srgb, var(--md-sys-color-outline) 48%, transparent);
      margin-top: var(--hub-space-8);
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-small);
      background-color: var(--md-sys-color-tertiary-container);
      color: var(--md-sys-color-on-tertiary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .empty-title {
      font-family: var(--md-sys-typescale-title-large-font-family);
      font-size: var(--md-sys-typescale-title-large-font-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      font-weight: var(--md-sys-typescale-title-large-font-weight);
      color: var(--md-sys-color-on-surface);
      margin: 0 0 8px;
    }

    .empty-desc {
      font-size: var(--md-sys-typescale-body-large-font-size);
      line-height: var(--md-sys-typescale-body-large-line-height);
      color: var(--md-sys-color-on-surface-variant);
      max-width: 440px;
      margin: 0 0 var(--hub-space-6);
    }

    .fab-container {
      position: fixed;
      bottom: var(--hub-space-6);
      right: var(--hub-space-6);
      z-index: 10;
      display: none;
    }

    @media (max-width: 600px) {
      .fab-container {
        display: block;
      }
      .header md-filled-button {
        display: none;
      }
    }

    .icon { --hub-icon-size: 24px; }

    .action-icon { --hub-icon-size: 20px; }
    .empty-state-icon { --hub-icon-size: 32px; }
    .meta-icon { --hub-icon-size: 18px; }

    .updated-label {
      color: var(--md-sys-color-outline);
      font-size: var(--md-sys-typescale-body-small-font-size);
    }

    .danger-action {
      color: var(--md-sys-color-error);
    }

    @media (max-width: 599px) {
      :host {
        padding: var(--hub-space-6) var(--hub-page-gutter-compact) var(--hub-space-9);
      }

      .header {
        align-items: flex-start;
        flex-direction: column;
        gap: var(--hub-space-5);
      }

      .header md-filled-button {
        align-self: stretch;
      }

      .grid {
        grid-template-columns: 1fr;
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

  private openNewProjectDialog() {
    this.dispatchEvent(
      new CustomEvent('open-new-project', { bubbles: true, composed: true })
    );
  }

  private handleProjectClick(project: Project) {
    router.navigate(`/projects/${project.id}`);
  }

  render() {
    const { projects, chatsByProject } = store;

    return html`
      <div class="container">
        <div class="header">
          <div class="title-group">
            <h1>Projects</h1>
            <p>Manage code repositories and active ACP agent sessions</p>
          </div>
          <md-filled-button @click=${this.openNewProjectDialog}>
            <span class="icon action-icon" slot="icon">add</span>
            New Project
          </md-filled-button>
        </div>

        ${projects.length === 0
          ? html`
              <div class="empty-state">
                <div class="empty-icon">
                  <span class="icon empty-state-icon">folder_open</span>
                </div>
                <h2 class="empty-title">No projects yet</h2>
                <p class="empty-desc">
                  Create a project by selecting an existing directory on your
                  server or cloning a Git repository.
                </p>
                <md-filled-button @click=${this.openNewProjectDialog}>
                  <span class="icon action-icon" slot="icon">add</span>
                  Create Your First Project
                </md-filled-button>
              </div>
            `
          : html`
              <div class="grid">
                ${projects.map((p) => {
                  const chats = chatsByProject[p.id] || [];
                  const count =
                    p.chat_count !== undefined ? p.chat_count : chats.length;
                  return html`
                    <article
                      class="project-card"
                      role="button"
                      tabindex="0"
                      @click=${() => this.handleProjectClick(p)}
                      @keydown=${(e: KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          this.handleProjectClick(p);
                        }
                      }}
                    >
                      <div class="card-top">
                        <div class="card-icon">
                          <span class="icon">folder</span>
                        </div>
                        <div class="card-details">
                          <h2 class="card-title">${p.name}</h2>
                          <div class="card-path" title=${p.path}>
                            ${p.path}
                          </div>
                        </div>
                        <div
                          class="menu-anchor"
                          @click=${(e: Event) => e.stopPropagation()}
                        >
                          <md-icon-button
                            id="menu-trigger-${p.id}"
                            aria-label=${`Actions for ${p.name}`}
                            @click=${() =>
                              (this.openMenuId =
                                this.openMenuId === p.id ? null : p.id)}
                          >
                            <span class="icon">more_vert</span>
                          </md-icon-button>
                          <md-menu
                            anchor="menu-trigger-${p.id}"
                            .open=${this.openMenuId === p.id}
                            @closed=${() => (this.openMenuId = null)}
                          >
                            <md-menu-item
                              @click=${() => {
                                this.editingProject = p;
                                this.isEditDialogOpen = true;
                                this.openMenuId = null;
                              }}
                            >
                              <div slot="headline">Edit Project</div>
                            </md-menu-item>
                            <md-menu-item
                              @click=${() => {
                                this.deletingProject = p;
                                this.isDeleteDialogOpen = true;
                                this.openMenuId = null;
                              }}
                            >
                              <div slot="headline" class="danger-action">
                                Delete Project
                              </div>
                            </md-menu-item>
                          </md-menu>
                        </div>
                      </div>

                      <div class="card-meta">
                        <span class="chat-count">
                        <span class="icon meta-icon">chat</span>
                          ${count} chat${count === 1 ? '' : 's'}
                        </span>
                        <span class="updated-label">
                          ${new Date(p.updated_at || p.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </article>
                  `;
                })}
              </div>
            `}
      </div>

      <div class="fab-container">
        <md-fab
          label="New Project"
          @click=${this.openNewProjectDialog}
        >
          <span class="icon action-icon" slot="icon">add</span>
        </md-fab>
      </div>

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
    'project-list': ProjectList;
  }
}
