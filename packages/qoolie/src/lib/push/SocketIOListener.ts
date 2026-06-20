import type { PushListener, ServerChangeHandler, ServerChange } from './types.js';
import type { EventDataClientInstance } from '@medyll/idae-socket';

/** Raw broadcast payload shape sent by `broadcastToTable` (idae-machine server). */
interface TableBroadcast {
  table: string;
  data: unknown;
  timestamp: string;
}

const EVENT_TYPE_MAP: Record<string, ServerChange['type']> = {
  'data:created':  'create',
  'data:updated':  'update',
  'data:deleted':  'delete',
  'data:restored': 'update',
};

/**
 * Socket.IO listener for server push — wraps `EventDataClientInstance` from
 * `@medyll/idae-socket` (loaded dynamically so it stays an optional peer dep).
 * Joins `room_<table>` for each entry in `options.collections` on connect.
 */
export class SocketIOListener implements PushListener {
  private url: string;
  private token?: string;
  private collections: string[];
  private client?: EventDataClientInstance;
  private changeHandler?: ServerChangeHandler;
  private connected = false;
  private stopped = false;

  constructor(
    url: string,
    options: {
      token?: string;
      collections?: string[];
    } = {}
  ) {
    this.url = url;
    this.token = options.token;
    this.collections = options.collections ?? [];
  }

  start(): void {
    this.stopped = false;
    void this.connectClient();
  }

  private async connectClient(): Promise<void> {
    const { EventDataClientInstance } = await import('@medyll/idae-socket');
    if (this.stopped) return;

    const client = new EventDataClientInstance();
    const parsed = new URL(this.url);
    client.config.host           = parsed.hostname;
    client.config.port           = Number(parsed.port) || (parsed.protocol === 'https:' ? 443 : 80);
    client.config.namespace      = parsed.pathname !== '/' ? parsed.pathname : '';
    client.config.authentication = {
      auth:     this.token ? `Bearer ${this.token}` : 'Bearer ',
      authMode: 'Bearer',
    };

    client.onConnect = () => {
      this.connected = true;
      this.collections.forEach((table) => client.socket?.emit('subscribe', table));
    };
    client.onDisconnect = () => { this.connected = false; };

    client.connect();

    Object.entries(EVENT_TYPE_MAP).forEach(([event, type]) => {
      client.socket?.on(event, (payload: TableBroadcast) => this.handleBroadcast(type, payload));
    });

    this.client = client;
  }

  private handleBroadcast(type: ServerChange['type'], payload: TableBroadcast): void {
    if (!this.changeHandler) return;

    const body = payload.data as { id?: unknown; record?: Record<string, unknown> } & Record<string, unknown>;
    const record = type === 'update' ? (body.record ?? body) : body;
    const id = type === 'delete' ? body.id : ((record as Record<string, unknown>)?.id ?? (record as Record<string, unknown>)?._id ?? body.id);

    this.changeHandler({
      type,
      collection: payload.table,
      id,
      data:      type === 'delete' ? undefined : record,
      timestamp: payload.timestamp ? Date.parse(payload.timestamp) : Date.now(),
    });
  }

  stop(): void {
    this.stopped = true;
    this.client?.socket?.disconnect?.();
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected && this.client?.socket?.connected === true;
  }

  onChange(handler: ServerChangeHandler): void {
    this.changeHandler = handler;
  }

  setToken(token: string): void {
    this.token = token;
    if (this.client) {
      this.stop();
      this.start();
    }
  }

  /** Underlying idae-socket client — reused by `machine.socket` (single connection). */
  getClient(): EventDataClientInstance | undefined {
    return this.client;
  }
}
