export type Route =
  | { name: 'home' }
  | { name: 'project'; projectId: string }
  | { name: 'chat'; projectId: string; chatId: string };

export type RouteListener = (route: Route) => void;

export class Router {
  private listeners: Set<RouteListener> = new Set();
  public currentRoute: Route = { name: 'home' };

  constructor() {
    const initialPath =
      typeof window !== 'undefined' ? window.location.pathname : '/';
    this.currentRoute = this.parseRoute(initialPath);
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this.currentRoute = this.parseRoute(window.location.pathname);
        this.notify();
      });
    }
  }

  public parseRoute(pathname: string): Route {
    const clean = pathname.replace(/\/+$/, '') || '/';
    const parts = clean.split('/').filter(Boolean);

    // /
    if (parts.length === 0) {
      return { name: 'home' };
    }

    // /projects/:projectId/chats/:chatId
    if (parts[0] === 'projects' && parts[1] && parts[2] === 'chats' && parts[3]) {
      return {
        name: 'chat',
        projectId: parts[1],
        chatId: parts[3],
      };
    }

    // /projects/:projectId
    if (parts[0] === 'projects' && parts[1]) {
      return {
        name: 'project',
        projectId: parts[1],
      };
    }

    return { name: 'home' };
  }

  public navigate(path: string, replace = false) {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === path) return;
      if (replace) {
        window.history.replaceState(null, '', path);
      } else {
        window.history.pushState(null, '', path);
      }
    }
    this.currentRoute = this.parseRoute(path);
    this.notify();
  }

  public subscribe(listener: RouteListener): () => void {
    this.listeners.add(listener);
    listener(this.currentRoute);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const l of this.listeners) {
      l(this.currentRoute);
    }
  }
}

export const router = new Router();
