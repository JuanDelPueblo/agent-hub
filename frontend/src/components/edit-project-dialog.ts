import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/icon/icon.js';
import './folder-picker';
import { FolderPicker } from './folder-picker';
import { Project } from '../api/types';
import { store } from '../state/app-state';
import { sharedStyles } from '../styles/shared';

@customElement('edit-project-dialog')
export class EditProjectDialog extends LitElement {
  static styles = [sharedStyles, css`
    :host {
      display: block;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-5);
      min-width: min(320px, calc(100vw - 48px));
      max-width: 560px;
    }

    @media (min-width: 600px) {
      .dialog-content {
        min-width: 480px;
      }
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-2);
    }

    .field-label {
      font-size: var(--md-sys-typescale-label-medium-font-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      font-weight: var(--md-sys-typescale-label-medium-font-weight);
      color: var(--md-sys-color-on-surface-variant);
    }

    .selected-path-card {
      padding: var(--hub-space-3) var(--hub-space-4);
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-family: var(--md-sys-typescale-code-font);
      font-size: var(--md-sys-typescale-code-font-size);
      word-break: break-all;
    }

    .browsed-path-card {
      padding: var(--hub-space-3) var(--hub-space-4);
      background-color: var(--md-sys-color-surface-container-low);
      color: var(--md-sys-color-on-surface-variant);
      border: 1px dashed var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-small);
      font-family: var(--md-sys-typescale-code-font);
      font-size: var(--md-sys-typescale-code-font-size);
      word-break: break-all;
    }

    .error-box {
      padding: var(--hub-space-3) var(--hub-space-4);
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: var(--md-sys-typescale-body-medium-font-size);
      white-space: pre-wrap;
    }
  `];

  @property({ type: Boolean }) public open = false;
  @property({ type: Object }) public project: Project | null = null;

  @state() private projectName = '';
  /** Directory that the user committed with "Select Current Folder". */
  @state() private selectedPath = '';
  /** Directory that the picker shows now. It is not a selection. */
  @state() private browsedPath = '';
  /** Directory that the picker must open when this dialog opens. */
  @state() private initialPickerPath = '';
  @state() private errorMessage = '';
  @state() private saving = false;

  @query('folder-picker') private picker?: FolderPicker;

  protected updated(changedProperties: PropertyValues) {
    // The shell sets `project` and `open` together, so handle them together.
    const opened = changedProperties.has('open') && this.open;
    const projectChanged = changedProperties.has('project') && this.open;
    if (opened || projectChanged) {
      this.resetFromProject();
    }
  }

  private resetFromProject() {
    this.projectName = this.project?.name || '';
    this.selectedPath = this.project?.path || '';
    this.initialPickerPath = this.project?.path || '';
    this.browsedPath = '';
    this.errorMessage = '';
    this.saving = false;
    // Reopening the dialog for the same project does not change initialPath,
    // so tell the picker directly to return to the project directory.
    const path = this.initialPickerPath;
    this.updateComplete.then(() => this.picker?.browseTo(path));
  }

  public close() {
    this.handleClose();
  }

  private handleClose() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('dialog-closed', { bubbles: true, composed: true })
    );
    this.dispatchEvent(
      new CustomEvent('close', { bubbles: true, composed: true })
    );
  }

  private handleFolderBrowsed(e: CustomEvent) {
    // Browsing only moves the picker. It does not change the project path.
    this.browsedPath = e.detail.path;
  }

  private handleFolderSelected(e: CustomEvent) {
    this.selectedPath = e.detail.path;
  }

  private async handleSave() {
    if (!this.project) return;
    const name = this.projectName.trim();
    const path = this.selectedPath.trim();

    if (!name || !path) {
      this.errorMessage = 'Please provide both project name and directory path.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    try {
      await store.editProject(this.project.id, name, path);
      this.handleClose();
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to update project';
    } finally {
      this.saving = false;
    }
  }

  render() {
    return html`
      <md-dialog ?open=${this.open} @closed=${this.handleClose}>
        <div slot="headline">
          <span>Edit Project</span>
        </div>

        <div slot="content" class="dialog-content">
          ${this.errorMessage
            ? html`<div class="error-box">${this.errorMessage}</div>`
            : ''}

          <div class="field-group">
            <md-outlined-text-field
              label="Project Display Name"
              .value=${this.projectName}
              @input=${(e: any) => (this.projectName = e.target.value)}
            ></md-outlined-text-field>
          </div>

          <div class="field-group">
            <span class="field-label">Project Directory</span>
            <folder-picker
              .initialPath=${this.initialPickerPath}
              @folder-browsed=${this.handleFolderBrowsed}
              @folder-selected=${this.handleFolderSelected}
            ></folder-picker>
          </div>

          ${this.browsedPath && this.browsedPath !== this.selectedPath
            ? html`
                <div class="field-group">
                  <span class="field-label">
                    Browsing (press "Select Current Folder" to use it)
                  </span>
                  <div class="browsed-path-card">${this.browsedPath}</div>
                </div>
              `
            : ''}

          ${this.selectedPath
            ? html`
                <div class="field-group">
                  <span class="field-label">Selected Directory</span>
                  <div class="selected-path-card">${this.selectedPath}</div>
                </div>
              `
            : ''}
        </div>

        <div slot="actions">
          <md-text-button @click=${this.handleClose} ?disabled=${this.saving}>
            Cancel
          </md-text-button>
          <md-filled-button
            @click=${this.handleSave}
            ?disabled=${!this.projectName || !this.selectedPath || this.saving}
          >
            Save Changes
          </md-filled-button>
        </div>
      </md-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-project-dialog': EditProjectDialog;
  }
}
