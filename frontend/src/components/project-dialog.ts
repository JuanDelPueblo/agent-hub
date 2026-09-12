import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/progress/linear-progress.js';
import '@material/web/icon/icon.js';
import './folder-picker';
import { api } from '../api/client';
import { store } from '../state/app-state';
import { router } from '../router';

@customElement('project-dialog')
export class ProjectDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 320px;
      max-width: 540px;
    }

    @media (min-width: 600px) {
      .dialog-content {
        min-width: 480px;
      }
    }

    .mode-tabs {
      display: flex;
      border-radius: var(--md-sys-shape-corner-full);
      background-color: var(--md-sys-color-surface-container-high);
      padding: 4px;
      gap: 4px;
    }

    .tab-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: var(--md-sys-shape-corner-full);
      font-weight: 500;
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant);
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background-color: var(--md-sys-color-surface);
      color: var(--md-sys-color-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant);
    }

    .selected-path-card {
      padding: 10px 14px;
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-family: var(--md-sys-typescale-code-font);
      font-size: 0.8rem;
      word-break: break-all;
    }

    .error-box {
      padding: 10px 14px;
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.85rem;
      white-space: pre-wrap;
    }
  `;

  @state() public isOpen = false;
  @state() private mode: 'folder' | 'clone' = 'folder';

  // Folder mode state
  @state() private selectedPath = '';
  @state() private projectName = '';

  // Clone mode state
  @state() private repoUrl = '';
  @state() private cloneParentPath = '';
  @state() private cloneProjectName = '';
  @state() private isCloning = false;
  @state() private errorMessage = '';

  public show() {
    this.isOpen = true;
    this.errorMessage = '';
    this.isCloning = false;
    this.mode = 'folder';
  }

  public close() {
    this.isOpen = false;
  }

  private handleFolderBrowsed(e: CustomEvent) {
    if (this.mode === 'folder') {
      this.selectedPath = e.detail.path;
      if (!this.projectName) {
        this.projectName = e.detail.name;
      }
    } else {
      this.cloneParentPath = e.detail.path;
    }
  }

  private handleFolderSelected(e: CustomEvent) {
    if (this.mode === 'folder') {
      this.selectedPath = e.detail.path;
      this.projectName = e.detail.name;
    } else {
      this.cloneParentPath = e.detail.path;
    }
  }

  private async handleCreateFromFolder() {
    if (!this.selectedPath || !this.projectName) {
      this.errorMessage = 'Please select a folder and specify a project name.';
      return;
    }

    try {
      this.errorMessage = '';
      const p = await api.createProject(this.projectName, this.selectedPath);
      await store.loadProjects();
      this.close();
      router.navigate(`/projects/${p.id}`);
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to create project';
    }
  }

  private async handleCloneRepository() {
    if (!this.repoUrl || !this.cloneParentPath) {
      this.errorMessage = 'Please provide repository URL and destination parent directory.';
      return;
    }

    this.isCloning = true;
    this.errorMessage = '';
    try {
      const p = await api.cloneProject({
        url: this.repoUrl,
        parent_path: this.cloneParentPath,
        name: this.cloneProjectName || undefined,
      });
      await store.loadProjects();
      this.close();
      router.navigate(`/projects/${p.id}`);
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to clone repository';
    } finally {
      this.isCloning = false;
    }
  }

  render() {
    return html`
      <md-dialog ?open=${this.isOpen} @closed=${() => (this.isOpen = false)}>
        <div slot="headline">
          <span>New Project</span>
        </div>

        <div slot="content" class="dialog-content">
          <!-- Mode Tabs -->
          <div class="mode-tabs">
            <button
              class="tab-btn ${this.mode === 'folder' ? 'active' : ''}"
              @click=${() => (this.mode = 'folder')}
            >
              Existing Folder
            </button>
            <button
              class="tab-btn ${this.mode === 'clone' ? 'active' : ''}"
              @click=${() => (this.mode = 'clone')}
            >
              Clone Repository
            </button>
          </div>

          ${this.errorMessage
            ? html`<div class="error-box">${this.errorMessage}</div>`
            : ''}

          <!-- Folder Mode -->
          ${this.mode === 'folder'
            ? html`
                <div class="field-group">
                  <span class="field-label">Select Project Directory</span>
                  <folder-picker
                    @folder-browsed=${this.handleFolderBrowsed}
                    @folder-selected=${this.handleFolderSelected}
                  ></folder-picker>
                </div>

                ${this.selectedPath
                  ? html`
                      <div class="field-group">
                        <span class="field-label">Selected Directory</span>
                        <div class="selected-path-card">${this.selectedPath}</div>
                      </div>

                      <div class="field-group">
                        <md-outlined-text-field
                          label="Project Display Name"
                          .value=${this.projectName}
                          @input=${(e: any) => (this.projectName = e.target.value)}
                        ></md-outlined-text-field>
                      </div>
                    `
                  : ''}
              `
            : html`
                <!-- Clone Mode -->
                <div class="field-group">
                  <md-outlined-text-field
                    label="Git Repository URL (HTTPS or SSH)"
                    placeholder="https://github.com/org/repo.git or git@github.com:org/repo.git"
                    .value=${this.repoUrl}
                    @input=${(e: any) => (this.repoUrl = e.target.value)}
                  ></md-outlined-text-field>
                </div>

                <div class="field-group">
                  <span class="field-label">Destination Parent Directory</span>
                  <folder-picker
                    @folder-browsed=${this.handleFolderBrowsed}
                    @folder-selected=${this.handleFolderSelected}
                  ></folder-picker>
                </div>

                ${this.cloneParentPath
                  ? html`
                      <div class="field-group">
                        <span class="field-label">Parent Path</span>
                        <div class="selected-path-card">${this.cloneParentPath}</div>
                      </div>
                    `
                  : ''}

                <div class="field-group">
                  <md-outlined-text-field
                    label="Project / Folder Name (optional, defaults from URL)"
                    .value=${this.cloneProjectName}
                    @input=${(e: any) => (this.cloneProjectName = e.target.value)}
                  ></md-outlined-text-field>
                </div>

                ${this.isCloning
                  ? html`
                      <div class="field-group">
                        <span class="field-label">Cloning repository from Git...</span>
                        <md-linear-progress indeterminate></md-linear-progress>
                      </div>
                    `
                  : ''}
              `}
        </div>

        <div slot="actions">
          <md-text-button @click=${this.close} ?disabled=${this.isCloning}>
            Cancel
          </md-text-button>

          ${this.mode === 'folder'
            ? html`
                <md-filled-button
                  @click=${this.handleCreateFromFolder}
                  ?disabled=${!this.selectedPath || !this.projectName}
                >
                  Create Project
                </md-filled-button>
              `
            : html`
                <md-filled-button
                  @click=${this.handleCloneRepository}
                  ?disabled=${!this.repoUrl || !this.cloneParentPath || this.isCloning}
                >
                  Clone & Create
                </md-filled-button>
              `}
        </div>
      </md-dialog>
    `;
  }
}
