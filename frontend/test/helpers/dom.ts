/**
 * Browser environment for the component tests.
 *
 * Import this module before any module that touches the DOM. It starts jsdom,
 * copies the browser globals onto `globalThis`, and replaces the network
 * transports with inert stubs.
 */
import { JSDOM, VirtualConsole } from 'jsdom';

// jsdom cannot parse every Material 3 stylesheet. Drop its CSS parse errors.
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', () => {});
virtualConsole.on('error', () => {});

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost:8765/',
  pretendToBeVisual: true,
  virtualConsole,
});

const win = dom.window as unknown as Record<string, unknown>;

// jsdom does not implement these observers. Material components need them.
class StubObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (!win.ResizeObserver) win.ResizeObserver = StubObserver;
if (!win.IntersectionObserver) win.IntersectionObserver = StubObserver;

// Node defines these already, but the DOM versions must win. jsdom rejects an
// event that a different realm created, so the event classes belong here too.
const FORCED = new Set([
  'window',
  'document',
  'navigator',
  'location',
  'customElements',
  'getComputedStyle',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'Event',
  'EventTarget',
  'CustomEvent',
  'MessageEvent',
  'DOMException',
]);
// Keep the Node versions of these. The test runner depends on them.
const KEPT = new Set([
  'fetch',
  'performance',
  'process',
  'global',
  'globalThis',
  'undefined',
  'AbortController',
  'AbortSignal',
  'Response',
  'Request',
  'Headers',
]);

for (const key of Object.getOwnPropertyNames(win)) {
  if (KEPT.has(key)) continue;
  if (!FORCED.has(key) && key in globalThis) continue;
  const descriptor = Object.getOwnPropertyDescriptor(win, key);
  if (!descriptor) continue;
  try {
    Object.defineProperty(globalThis, key, descriptor);
  } catch {
    // The property is not configurable. Keep the existing value.
  }
}

// jsdom does not implement the modal methods of <dialog>. md-dialog needs them.
const dialogProto = (win.HTMLDialogElement as { prototype: Record<string, unknown> })
  ?.prototype;
if (dialogProto) {
  if (typeof dialogProto.showModal !== 'function') {
    dialogProto.showModal = function showModal(this: Element) {
      this.setAttribute('open', '');
    };
  }
  if (typeof dialogProto.show !== 'function') {
    dialogProto.show = function show(this: Element) {
      this.setAttribute('open', '');
    };
  }
  if (typeof dialogProto.close !== 'function') {
    dialogProto.close = function close(this: Element) {
      this.removeAttribute('open');
      this.dispatchEvent(new (win.Event as typeof Event)('close'));
    };
  }
}

// jsdom implements attachInternals, but not the form-association methods that
// the Material text field calls.
const internalsProto = (win.ElementInternals as { prototype: Record<string, unknown> })
  ?.prototype;
if (internalsProto) {
  const noop = () => {};
  for (const method of ['setFormValue', 'setValidity', 'reportValidity']) {
    if (typeof internalsProto[method] !== 'function') internalsProto[method] = noop;
  }
  if (typeof internalsProto.checkValidity !== 'function') {
    internalsProto.checkValidity = () => true;
  }
  if (!('states' in internalsProto)) {
    internalsProto.states = new Set();
  }
  if (!('labels' in internalsProto)) {
    internalsProto.labels = [];
  }
  if (!('form' in internalsProto)) {
    internalsProto.form = null;
  }
  if (!('validity' in internalsProto)) {
    internalsProto.validity = { valid: true };
  }
  if (!('validationMessage' in internalsProto)) {
    internalsProto.validationMessage = '';
  }
}

// jsdom has no Web Animations API. md-dialog animates when it opens.
const elementProto = (win.Element as { prototype: Record<string, unknown> })?.prototype;
if (elementProto && typeof elementProto.animate !== 'function') {
  elementProto.animate = function animate() {
    const finished = Promise.resolve();
    return {
      finished,
      ready: finished,
      playState: 'finished',
      currentTime: 0,
      cancel() {},
      finish() {},
      pause() {},
      play() {},
      reverse() {},
      addEventListener() {},
      removeEventListener() {},
    };
  };
}
if (elementProto && typeof elementProto.getAnimations !== 'function') {
  elementProto.getAnimations = () => [];
}

/** An inert WebSocket. The real one opens a reconnect timer that never ends. */
class InertWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  public readyState = InertWebSocket.CONNECTING;
  public onopen: (() => void) | null = null;
  public onclose: (() => void) | null = null;
  public onerror: (() => void) | null = null;
  public onmessage: ((e: { data: string }) => void) | null = null;
  public url: string;
  constructor(url: string) {
    this.url = url;
  }
  send() {}
  close() {
    this.readyState = InertWebSocket.CLOSED;
  }
}
(globalThis as Record<string, unknown>).WebSocket = InertWebSocket;

/** Requests that the components made, in order. */
export interface RecordedRequest {
  url: string;
  method: string;
  body?: string;
}

export const recordedRequests: RecordedRequest[] = [];

type Responder = (req: RecordedRequest) => unknown;

let responder: Responder = () => [];

/** Replace the fetch responder. Return a value, or throw to fail the request. */
export function setFetchResponder(next: Responder) {
  responder = next;
}

export function resetFetch() {
  recordedRequests.length = 0;
  responder = () => [];
}

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const request: RecordedRequest = {
    url: String(input),
    method: init?.method || 'GET',
    body: typeof init?.body === 'string' ? init.body : undefined,
  };
  recordedRequests.push(request);
  const result = await responder(request);
  // A responder can return a Response to simulate a failure status.
  if (result instanceof Response) return result;
  return new Response(JSON.stringify(result ?? null), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}) as typeof fetch;

/** Build a failing HTTP response, the way the backend reports an error. */
export function httpError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** Paths of the requests that the components made, in order. */
export function requestedPaths(): string[] {
  return recordedRequests.map((r) => r.url);
}

/** Create an element, attach it to the document, and wait for the first render. */
export async function mount<T extends HTMLElement>(tag: string): Promise<T> {
  const el = document.createElement(tag) as T;
  document.body.appendChild(el);
  await flush(el);
  return el;
}

export function unmount(el: HTMLElement) {
  el.remove();
}

/** Wait for pending promises and for the Lit update of `el` to finish. */
export async function flush(el?: HTMLElement, rounds = 4) {
  for (let i = 0; i < rounds; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const updateComplete = (el as { updateComplete?: Promise<unknown> } | undefined)
      ?.updateComplete;
    if (updateComplete) await updateComplete;
  }
}

/** Query one element inside the shadow root of `el`. */
export function shadow<T extends Element>(el: HTMLElement, selector: string): T | null {
  return (el.shadowRoot?.querySelector(selector) as T | null) ?? null;
}

/** Query every matching element inside the shadow root of `el`. */
export function shadowAll<T extends Element>(el: HTMLElement, selector: string): T[] {
  return Array.from(el.shadowRoot?.querySelectorAll(selector) || []) as T[];
}

/**
 * All visible text inside the shadow root of `el`.
 *
 * jsdom has no constructable stylesheets, so Lit puts its styles in a `<style>`
 * element. This function drops that CSS text.
 */
export function shadowText(el: HTMLElement): string {
  const root = el.shadowRoot;
  if (!root) return '';
  let text = '';
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        text += ` ${child.textContent || ''}`;
        continue;
      }
      if (child.nodeType !== 1) continue;
      const element = child as Element;
      if (element.tagName === 'STYLE' || element.tagName === 'SCRIPT') continue;
      if (element.shadowRoot) walk(element.shadowRoot);
      walk(element);
    }
  };
  walk(root);
  return text.replace(/\s+/g, ' ').trim();
}

/** Send a real click event to an element. */
export function click(el: Element | null) {
  if (!el) throw new Error('Cannot click a missing element');
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
}

/** Type text into a text field or a textarea and fire the input event. */
export function type(el: Element | null, value: string) {
  if (!el) throw new Error('Cannot type into a missing element');
  (el as HTMLInputElement).value = value;
  el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

export { dom };
