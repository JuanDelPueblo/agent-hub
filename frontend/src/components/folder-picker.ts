import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/progress/circular-progress.js';
import { api } from '../api/client';
import { DirectoryListing } from '../api/types';
import { sharedStyles } from '../styles/shared';

@customElement('folder-picker')
export class FolderPicker extends LitElement {
  static styles = [sharedStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-3);
      max-height: 400px;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--hub-space-1);
      padding: var(--hub-space-3) var(--hub-space-4);
      background-color: var(--md-sys-color-surface-container-low);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: var(--md-sys-typescale-body-small-font-size);
    }

    .crumb-btn {
      background: none;
      border: none;
      color: var(--md-sys-color-primary);
      cursor: pointer;
      font-size: var(--md-sys-typescale-body-small-font-size);
      padding: var(--hub-space-1) var(--hub-space-2);
      border-radius: var(--md-sys-shape-corner-small);
    }

    .crumb-btn:hover {
      background-color: var(--md-sys-color-surface-container-highest);
      text-decoration: underline;
    }

    .crumb-separator {
      color: var(--md-sys-color-outline);
    }

    .folder-list {
      flex: 1;
      overflow-y: auto;
      border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 55%, transparent);
      border-radius: var(--md-sys-shape-corner-medium);
      min-height: 180px;
      max-height: 250px;
      background-color: var(--md-sys-color-surface);
    }

    .folder-item {
      display: flex;
      align-items: center;
      gap: var(--hub-space-3);
      padding: var(--hub-space-3) var(--hub-space-4);
      cursor: pointer;
      border-bottom: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 36%, transparent);
      transition: background-color var(--hub-duration-short3) var(--hub-easing-standard);
      font-size: var(--md-sys-typescale-body-medium-font-size);
      color: var(--md-sys-color-on-surface);
      width: 100%;
      background: transparent;
      border-left: 0;
      border-right: 0;
      border-top: 0;
      text-align: left;
      font: inherit;
    }

    .folder-item:hover {
      background-color: var(--md-sys-color-surface-container);
    }

    .folder-item md-icon {
      color: var(--md-sys-color-primary);
      --hub-icon-size: 22px;
    }

    .empty-state {
      padding: var(--hub-space-8);
      text-align: center;
      color: var(--md-sys-color-outline);
      font-size: var(--md-sys-typescale-body-small-font-size);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 180px;
    }

    .error-container {
      padding: var(--hub-space-4);
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-medium);
      font-size: var(--md-sys-typescale-body-small-font-size);
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--hub-space-2);
      margin-top: var(--hub-space-2);
    }
  `];

  @property({ type: String }) initialPath?: string;
  @state() private currentListing: DirectoryListing | null = null;
  @state() private loading = false;
  @state() private errorMessage = '';

  /** Path of the directory that this picker loaded last. */
  private loadedPath?: string;
  /** Sequence number of the most recent load. It discards stale responses. */
  private loadSequence = 0;

  connectedCallback() {
    super.connectedCallback();
    this.loadDirectory(this.initialPath);
  }

  protected updated(changedProperties: PropertyValues) {
    if (!changedProperties.has('initialPath')) return;
    // A dialog sets initialPath after this picker connects. Browse to the new
    // directory. Keep the current listing if the caller clears the path.
    if (!this.initialPath) return;
    this.browseTo(this.initialPath);
  }

  /** Browse to `path` if this picker does not already show that directory. */
  public browseTo(path?: string) {
    if (!path) return;
    if (path === this.loadedPath) return;
    return this.loadDirectory(path);
  }

  public async loadDirectory(path?: string) {
    const sequence = ++this.loadSequence;
    this.loadedPath = path;
    this.loading = true;
    this.errorMessage = '';
    try {
      const listing = await api.fetchDirectories(path);
      if (sequence !== this.loadSequence) return;
      this.currentListing = listing;
      this.loadedPath = listing.current;
      this.dispatchEvent(
        new CustomEvent('folder-browsed', {
          detail: {
            path: listing.current,
            name: listing.name,
          },
          bubbles: true,
          composed: true,
        })
      );
    } catch (e: any) {
      if (sequence !== this.loadSequence) return;
      // Forget the path so that a later call can try the same directory again.
      this.loadedPath = this.currentListing?.current;
      this.errorMessage = e?.message || 'Failed to load directories';
    } finally {
      if (sequence === this.loadSequence) {
        this.loading = false;
      }
    }
  }

  private handleSelect() {
    if (!this.currentListing) return;
    this.dispatchEvent(
      new CustomEvent('folder-selected', {
        detail: {
          path: this.currentListing.current,
          name: this.currentListing.name,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      ${this.errorMessage
        ? html`<div class="error-container">${this.errorMessage}</div>`
        : ''}

      <!-- Breadcrumbs -->
      ${this.currentListing
        ? html`
            <div class="breadcrumbs">
              ${this.currentListing.parent
                ? html`
                      <button
                        class="crumb-btn"
                        type="button"
                      @click=${() => this.loadDirectory(this.currentListing!.parent!)}
                      title="Go up one level"
                    >
                      <md-icon class="material-symbols-outlined">arrow_upward</md-icon>
                    </button>
                    <span class="crumb-separator">|</span>
                  `
                : ''}
              ${this.currentListing.breadcrumbs.map(
                (b, idx) => html`
                  <button
                    class="crumb-btn"
                    type="button"
                    @click=${() => this.loadDirectory(b.path)}
                  >
                    ${b.name}
                  </button>
                  ${idx < this.currentListing!.breadcrumbs.length - 1
                    ? html`<span class="crumb-separator">/</span>`
                    : ''}
                `
              )}
            </div>
          `
        : ''}

      <!-- Folder list -->
      <div class="folder-list">
        ${this.loading
          ? html`
              <div class="loading-container">
                <md-circular-progress indeterminate></md-circular-progress>
              </div>
            `
          : this.currentListing?.directories.length === 0
          ? html`<div class="empty-state">No subdirectories found</div>`
          : this.currentListing?.directories.map(
              (d) => html`
                <button
                  class="folder-item"
                  type="button"
                  @click=${() => this.loadDirectory(d.path)}
                >
                  <md-icon class="material-symbols-outlined">folder</md-icon>
                  <span>${d.name}</span>
                </button>
              `
            )}
      </div>

      <!-- Action -->
      <div class="actions">
        <md-filled-button
          @click=${this.handleSelect}
          ?disabled=${this.loading || !this.currentListing}
        >
          <md-icon slot="icon" class="material-symbols-outlined">check</md-icon>
          Select Current Folder
        </md-filled-button>
      </div>
    `;
  }
}
