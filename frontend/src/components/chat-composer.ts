import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { ProcessState, TurnState } from '../api/types';
import { sharedStyles } from '../styles/shared';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';

@customElement('chat-composer')
export class ChatComposer extends LitElement {
  @property({ type: String })
  chatId: string = '';

  @property({ type: String })
  processState: ProcessState = 'STOPPED';

  @property({ type: String })
  turnState: TurnState = 'IDLE';

  @property({ type: Boolean })
  disabled: boolean = false;

  @state()
  private text: string = '';

  static styles = [sharedStyles, css`
    :host {
      display: block;
      background-color: var(--md-sys-color-surface);
      padding: var(--hub-space-4) var(--hub-space-5);
      padding-bottom: calc(var(--hub-space-4) + env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
    }

    .composer-container {
      max-width: var(--hub-chat-max-width);
      margin: 0 auto;
      display: flex;
      align-items: flex-end;
      gap: var(--hub-space-3);
      background-color: var(--md-sys-color-surface-container-high);
      border: 1px solid transparent;
      border-radius: var(--md-sys-shape-corner-extra-large);
      padding: var(--hub-space-2) var(--hub-space-2) var(--hub-space-2) var(--hub-space-5);
      box-shadow: var(--md-sys-elevation-level1);
      transition: border-color var(--hub-duration-short3) var(--hub-easing-standard),
        box-shadow var(--hub-duration-short3) var(--hub-easing-standard),
        background-color var(--hub-duration-short3) var(--hub-easing-standard);
    }

    .composer-container:focus-within {
      border-color: var(--md-sys-color-primary);
      box-shadow: var(--hub-focus-ring), var(--md-sys-elevation-level2);
      background-color: var(--md-sys-color-surface-container-highest);
    }

    .composer-container.disabled {
      opacity: var(--hub-disabled-content-opacity);
    }

    textarea {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      resize: none;
      font-family: var(--md-sys-typescale-body-large-font-family);
      font-size: var(--md-sys-typescale-body-large-font-size);
      line-height: var(--md-sys-typescale-body-large-line-height);
      letter-spacing: var(--md-sys-typescale-body-large-letter-spacing);
      color: var(--md-sys-color-on-surface);
      min-height: 32px;
      max-height: 160px;
      padding: var(--hub-space-2) 0;
      margin: 0;
      overflow-y: auto;
    }

    textarea::placeholder {
      color: var(--md-sys-color-on-surface-variant);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
      margin-bottom: var(--hub-space-1);
    }

    .send-btn, .cancel-btn {
      width: 48px;
      height: 48px;
      border-radius: var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-small);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color var(--hub-duration-short3) var(--hub-easing-standard),
        transform var(--hub-duration-short2) var(--hub-easing-standard),
        box-shadow var(--hub-duration-short3) var(--hub-easing-standard);
    }

    .send-btn {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }

    .send-btn:hover:not(:disabled) {
      background-color: color-mix(in srgb, var(--md-sys-color-primary) 88%, black);
      box-shadow: var(--md-sys-elevation-level2);
      transform: translateY(-1px);
    }

    .send-btn:active:not(:disabled),
    .cancel-btn:active:not(:disabled) {
      transform: scale(0.94);
    }

    .send-btn:disabled {
      background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
      color: var(--md-sys-color-outline);
      cursor: not-allowed;
    }

    .cancel-btn {
      background-color: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
    }

    .cancel-btn:hover {
      background-color: color-mix(in srgb, var(--md-sys-color-error) 88%, black);
    }

    .icon { --hub-icon-size: 22px; --hub-icon-fill: 1; }

    .hint {
      font-size: var(--md-sys-typescale-label-small-font-size);
      line-height: var(--md-sys-typescale-label-small-line-height);
      color: var(--md-sys-color-outline);
      text-align: right;
      max-width: 860px;
      margin: var(--hub-space-2) auto 0;
      padding-right: var(--hub-space-3);
    }

    @media (max-width: 599px) {
      :host {
        padding-inline: var(--hub-page-gutter-compact);
      }

      .composer-container {
        padding-left: var(--hub-space-4);
      }

      .hint {
        display: none;
      }
    }
  `];

  private handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.text = target.value;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      this.send();
    }
  }

  private async send() {
    const trimmed = this.text.trim();
    if (!trimmed || this.disabled || this.processState !== 'RUNNING' || this.turnState === 'PROMPTING') {
      return;
    }

    const currentText = trimmed;
    this.text = '';
    const textarea = this.shadowRoot?.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.style.height = 'auto';
    }

    try {
      await store.sendPrompt(this.chatId, currentText);
    } catch (e) {
      console.error('Failed to send prompt', e);
    }
  }

  private async cancel() {
    if (!this.chatId) return;
    try {
      await store.cancelActiveTurn(this.chatId);
    } catch (e) {
      console.error('Failed to cancel turn', e);
    }
  }

  render() {
    const isPrompting = this.turnState === 'PROMPTING';
    const isCancelling = this.turnState === 'CANCELLING';
    const isStopped = this.processState !== 'RUNNING';
    const canSend =
      !this.disabled && !isStopped && !isPrompting && this.text.trim().length > 0;

    return html`
      <div class="composer-container ${isStopped || this.disabled ? 'disabled' : ''}">
        <textarea
          rows="1"
          placeholder="${this.disabled
            ? 'Waiting for the agent connection...'
            : isStopped
            ? 'Agent process stopped'
            : isPrompting
            ? 'Agent is thinking...'
            : 'Type a message...'}"
          .value=${this.text}
          ?disabled=${this.disabled || isStopped || isPrompting}
          @input=${this.handleInput}
          @keydown=${this.handleKeyDown}
        ></textarea>

        <div class="actions">
          ${isPrompting || isCancelling
            ? html`
                <button
                  class="cancel-btn"
                  title="Cancel active turn"
                  ?disabled=${isCancelling}
                  @click=${this.cancel}
                >
                  <span class="icon">stop</span>
                </button>
              `
            : html`
                <button
                  class="send-btn"
                  title="Send message (Ctrl+Enter)"
                  ?disabled=${!canSend}
                  @click=${this.send}
                >
                  <span class="icon">arrow_upward</span>
                </button>
              `}
        </div>
      </div>
      <div class="hint">Press Ctrl+Enter or Cmd+Enter to send</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-composer': ChatComposer;
  }
}
