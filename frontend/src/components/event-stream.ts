import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DisplayItem } from '../api/types';
import './message-turn';
import '@material/web/fab/fab.js';

@customElement('event-stream')
export class EventStream extends LitElement {
  @property({ type: Array })
  items: DisplayItem[] = [];

  @property({ type: String })
  chatId: string = '';

  @state()
  private showScrollToBottom = false;

  private isAutoScrollEnabled = true;

  static styles = css`
    :host {
      display: block;
      position: relative;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 16px 20px;
      box-sizing: border-box;
      scroll-behavior: smooth;
    }

    .stream-container {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      justify-content: flex-start;
    }

    .scroll-fab-container {
      position: sticky;
      bottom: 24px;
      display: flex;
      justify-content: center;
      pointer-events: none;
      margin-top: -56px;
      z-index: 10;
    }

    .scroll-btn {
      pointer-events: auto;
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 20px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: var(--md-sys-elevation-level2);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .scroll-btn:hover {
      background-color: var(--md-sys-color-surface-container-high);
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 18px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  disconnectedCallback() {
    this.removeEventListener('scroll', this.handleScroll);
    super.disconnectedCallback();
  }

  private handleScroll = () => {
    const threshold = 80;
    const distanceToBottom =
      this.scrollHeight - this.scrollTop - this.clientHeight;
    this.isAutoScrollEnabled = distanceToBottom <= threshold;
    this.showScrollToBottom = distanceToBottom > 200;
  };

  private scrollToBottom(smooth = false) {
    this.scrollTo({
      top: this.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('items') && this.isAutoScrollEnabled) {
      this.scrollToBottom();
    }
  }

  render() {
    return html`
      <div class="stream-container">
        ${this.items.map(
          (item) => html`
            <message-turn
              .item=${item}
              .chatId=${this.chatId}
            ></message-turn>
          `
        )}
      </div>

      ${this.showScrollToBottom
        ? html`
            <div class="scroll-fab-container">
              <button
                class="scroll-btn"
                @click=${() => this.scrollToBottom(true)}
              >
                <span class="icon">arrow_downward</span>
                <span>Scroll to bottom</span>
              </button>
            </div>
          `
        : null}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'event-stream': EventStream;
  }
}
