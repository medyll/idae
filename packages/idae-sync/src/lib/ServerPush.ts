export type ServerPushEvent = {
  collection: string;
  op: 'add' | 'put' | 'update' | 'delete';
  key?: unknown;
  data?: unknown;
};

export type ServerPushHandler = (event: ServerPushEvent) => void | Promise<void>;

export interface IServerPushListener {
  onPush(handler: ServerPushHandler): () => void;
  connect(): void;
  disconnect(): void;
}

/**
 * EventSource (SSE) based server push adapter.
 * The server must send JSON-serialized ServerPushEvent objects as SSE data.
 *
 * Usage:
 *   const push = new EventSourcePushListener('https://api.example.com/sync/stream');
 *   push.onPush(event => adapter.applyEvent({ ...event, source: 'remote' }));
 *   push.connect();
 */
export class EventSourcePushListener implements IServerPushListener {
  private es: EventSource | null = null;
  private handlers: ServerPushHandler[] = [];

  constructor(
    private url: string,
    private opts?: { withCredentials?: boolean; eventName?: string }
  ) {}

  onPush(handler: ServerPushHandler): () => void {
    this.handlers.push(handler);
    return () => { this.handlers = this.handlers.filter(h => h !== handler); };
  }

  connect(): void {
    if (typeof EventSource === 'undefined') return; // SSR guard
    if (this.es) return;
    this.es = new EventSource(this.url, { withCredentials: this.opts?.withCredentials ?? false });
    const eventName = this.opts?.eventName ?? 'message';
    this.es.addEventListener(eventName, (e: MessageEvent) => {
      try {
        const event = JSON.parse(e.data) as ServerPushEvent;
        for (const h of this.handlers) {
          try { h(event); } catch { /* ignore handler error */ }
        }
      } catch { /* invalid JSON */ }
    });
  }

  disconnect(): void {
    this.es?.close();
    this.es = null;
  }
}

/**
 * WebSocket based server push adapter.
 * Server sends JSON-serialized ServerPushEvent objects as WS text messages.
 */
export class WebSocketPushListener implements IServerPushListener {
  private ws: WebSocket | null = null;
  private handlers: ServerPushHandler[] = [];

  constructor(private url: string) {}

  onPush(handler: ServerPushHandler): () => void {
    this.handlers.push(handler);
    return () => { this.handlers = this.handlers.filter(h => h !== handler); };
  }

  connect(): void {
    if (typeof WebSocket === 'undefined') return;
    if (this.ws) return;
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data as string) as ServerPushEvent;
        for (const h of this.handlers) {
          try { h(event); } catch { /* ignore */ }
        }
      } catch { /* invalid JSON */ }
    };
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }
}
