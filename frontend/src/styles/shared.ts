import { css } from 'lit';

/** Small shared layer for every Lit shadow root in Agent Hub. */
export const sharedStyles = css`
  :host {
    font-family: var(--md-sys-typescale-body-font);
    font-size: var(--md-sys-typescale-body-medium-font-size);
    font-weight: var(--md-sys-typescale-body-medium-font-weight);
    line-height: var(--md-sys-typescale-body-medium-line-height);
    letter-spacing: var(--md-sys-typescale-body-medium-letter-spacing);
    color: var(--md-sys-color-on-surface);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button,
  [role='button'] {
    -webkit-tap-highlight-color: transparent;
  }

  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible,
  [role='button']:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 3px;
  }

  .icon,
  .material-symbols-outlined {
    font-family: var(--md-sys-typescale-icon-font);
    font-size: var(--hub-icon-size, 24px);
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    font-variation-settings: 'FILL' var(--hub-icon-fill, 0),
      'wght' var(--hub-icon-weight, 400), 'GRAD' 0, 'opsz' var(--hub-icon-opsz, 24);
    vertical-align: middle;
  }

  md-filled-button,
  md-outlined-button,
  md-text-button,
  md-fab {
    --md-filled-button-label-text-font: var(--md-sys-typescale-label-large-font-family);
    --md-filled-button-label-text-size: var(--md-sys-typescale-label-large-font-size);
    --md-filled-button-label-text-weight: var(--md-sys-typescale-label-large-font-weight);
    --md-outlined-button-label-text-font: var(--md-sys-typescale-label-large-font-family);
    --md-outlined-button-label-text-size: var(--md-sys-typescale-label-large-font-size);
    --md-outlined-button-label-text-weight: var(--md-sys-typescale-label-large-font-weight);
    --md-text-button-label-text-font: var(--md-sys-typescale-label-large-font-family);
    --md-text-button-label-text-size: var(--md-sys-typescale-label-large-font-size);
    --md-text-button-label-text-weight: var(--md-sys-typescale-label-large-font-weight);
  }

  md-filled-button {
    --md-filled-button-container-height: 40px;
    --md-filled-button-container-shape: var(--md-sys-shape-corner-full);
    --md-filled-button-container-color: var(--md-sys-color-primary);
    --md-filled-button-label-text-color: var(--md-sys-color-on-primary);
  }

  md-outlined-button {
    --md-outlined-button-container-height: 40px;
    --md-outlined-button-container-shape: var(--md-sys-shape-corner-full);
    --md-outlined-button-outline-color: var(--md-sys-color-outline);
  }

  md-text-button {
    --md-text-button-container-height: 40px;
    --md-text-button-container-shape: var(--md-sys-shape-corner-full);
    --md-text-button-label-text-color: var(--md-sys-color-primary);
  }

  md-icon-button {
    --md-icon-button-icon-size: 24px;
    --md-icon-button-state-layer-size: 48px;
  }

  md-fab {
    --md-fab-container-shape: var(--md-sys-shape-corner-large);
    --md-fab-container-color: var(--md-sys-color-primary-container);
    --md-fab-label-text-color: var(--md-sys-color-on-primary-container);
  }

  md-dialog {
    --md-dialog-container-shape: var(--md-sys-shape-corner-extra-large);
    --md-dialog-container-color: var(--md-sys-color-surface-container-low);
    --md-dialog-headline-color: var(--md-sys-color-on-surface);
    --md-dialog-supporting-text-color: var(--md-sys-color-on-surface-variant);
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.001ms !important;
    }
  }
`;
