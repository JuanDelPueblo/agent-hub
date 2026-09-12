import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { ProcessState, TurnState } from '../api/types';
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

  static styles = css`
    :host {
      display: block;
      background-color: var(--md-sys-color-surface-container);
      border-top: 1px solid var(--md-sys-color-outline-variant);
      padding: 12px 16px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
    }

    .composer-container {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      align-items: flex-end;
      gap: 10px;
      background-color: var(--md-sys-color-surface-container-high);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 24px;
      padding: 6px 8px 6px 16px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .composer-container:focus-within {
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 1px var(--md-sys-color-primary);
    }

    .composer-container.disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    textarea {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      resize: none;
      font-family: inherit;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: var(--md-sys-color-on-surface);
      min-height: 24px;
      max-height: 160px;
      padding: 6px 0;
      margin: 0;
      overflow-y: auto;
    }

    textarea::placeholder {
      color: var(--md-sys-color-on-surface-variant);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }

    .send-btn, .cancel-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.15s ease, transform 0.1s ease;
    }

    .send-btn {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }

    .send-btn:hover:not(:disabled) {
      background-color: var(--md-sys-color-primary);
      opacity: 0.9;
    }

    .send-btn:disabled {
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-outline);
      cursor: not-allowed;
    }

    .cancel-btn {
      background-color: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
    }

    .cancel-btn:hover {
      opacity: 0.9;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    .hint {
      font-size: 0.6875rem;
      color: var(--md-sys-color-outline);
      text-align: right;
      max-width: 860px;
      margin: 6px auto 0;
      padding-right: 12px;
    }

    @media (max-width: 599px) {
      .hint {
        display: none;
      }
    }
  `;

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
    const canSend = !isStopped && !isPrompting && this.text.trim().length > 0;

    return html`
      <div class="composer-container ${isStopped ? 'disabled' : ''}">
        <textarea
          rows="1"
          placeholder="${isStopped
            ? 'Agent process stopped'
            : isPrompting
            ? 'Agent is thinking...'
            : 'Type a message... (Ctrl+Enter to send)'}"
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
