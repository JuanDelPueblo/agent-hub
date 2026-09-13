import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DisplayItem } from '../api/types';
import { sharedStyles } from '../styles/shared';
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

  static styles = [sharedStyles, css`
    :host {
      display: block;
      position: relative;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--hub-space-7) var(--hub-page-gutter);
      box-sizing: border-box;
      scroll-behavior: smooth;
    }

    .stream-container {
      max-width: var(--hub-chat-max-width);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      justify-content: flex-start;
    }

    .scroll-fab-container {
      position: sticky;
      bottom: var(--hub-space-6);
      display: flex;
      justify-content: center;
      pointer-events: none;
      margin-top: -64px;
      z-index: 10;
    }

    .scroll-btn {
      pointer-events: auto;
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      border: 1px solid transparent;
      border-radius: var(--md-sys-shape-corner-full);
      padding: 10px var(--hub-space-5);
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
      font-size: var(--md-sys-typescale-label-medium-font-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      font-weight: var(--md-sys-typescale-label-medium-font-weight);
      cursor: pointer;
      box-shadow: var(--md-sys-elevation-level2);
      transition: opacity var(--hub-duration-short4) var(--hub-easing-standard),
        transform var(--hub-duration-short4) var(--hub-easing-standard),
        background-color var(--hub-duration-short4) var(--hub-easing-standard);
    }

    .scroll-btn:hover {
      background-color: var(--md-sys-color-surface-container-high);
      transform: translateY(-2px);
    }

    .icon { --hub-icon-size: 20px; }

    @media (max-width: 599px) {
      :host {
        padding: var(--hub-space-5) var(--hub-page-gutter-compact);
      }
    }
  `];

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
