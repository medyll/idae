import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SSEListener } from './SSEListener';
import { WebSocketListener } from './WebSocketListener';
import { ServerPushListener } from './ServerPushListener';
import { SocketIOListener } from './SocketIOListener';

// Mock @medyll/idae-socket (optional peer dep, loaded via dynamic import)
class FakeSocket {
  connected = false;
  handlers: Record<string, Array<(...args: any[]) => void>> = {};
  emitted: Array<[string, any[]]> = [];

  on(event: string, cb: (...args: any[]) => void) {
    (this.handlers[event] ??= []).push(cb);
  }

  emit(event: string, ...args: any[]) {
    this.emitted.push([event, args]);
  }

  disconnect() {
    this.connected = false;
    this.trigger('disconnect');
  }

  trigger(event: string, ...args: any[]) {
    (this.handlers[event] ?? []).forEach((cb) => cb(...args));
  }
}

class FakeEventDataClientInstance {
  config: any = {};
  socket?: FakeSocket;
  onConnect?: (info: { socketId: string; socketConnected: boolean }) => void;
  onDisconnect?: (info: { socketId: string; socketConnected: boolean }) => void;
  onConnectError?: (info: { socketId: string; socketConnected: boolean }) => void;

  connect() {
    const socket = new FakeSocket();
    this.socket = socket;
    socket.on('connect', () => {
      socket.connected = true;
      this.onConnect?.({ socketId: 'fake-id', socketConnected: true });
    });
    socket.on('disconnect', () => {
      this.onDisconnect?.({ socketId: 'fake-id', socketConnected: false });
    });
  }
}

vi.mock('@medyll/idae-socket', () => ({
  EventDataClientInstance: FakeEventDataClientInstance,
}));

// Mock `fetch` for SSEListener tests — returns a controllable ReadableStream
// body, simulating idae-api's `SseStream` framing (`data: <json>\n\n`).
function mockSSEFetch() {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
  });

  (global as any).fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      body: stream,
    })
  );

  return {
    push: (data: unknown) => controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)),
    close: () => controller.close(),
  };
}

// Mock WebSocket for tests
class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  readyState: number = MockWebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.();
    }, 10);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }

  send(data: string) {
    // Mock send
  }
}

describe('Server Push', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (global as any).WebSocket = MockWebSocket;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (global as any).WebSocket;
  });

  describe('SSEListener', () => {
    beforeEach(() => {
      // Default: fetch hangs forever — tests that need a live stream call mockSSEFetch()
      (global as any).fetch = vi.fn(() => new Promise(() => {}));
    });

    afterEach(() => {
      delete (global as any).fetch;
    });

    it('should create an SSE listener', () => {
      const listener = new SSEListener('https://example.com/sse');
      expect(listener).toBeInstanceOf(SSEListener);
    });

    it('should connect and become connected', async () => {
      mockSSEFetch();
      const listener = new SSEListener('https://example.com/sse');
      listener.start();

      await vi.advanceTimersByTimeAsync(0);

      expect(listener.isConnected()).toBe(true);
      listener.stop();
    });

    it('should handle server changes', async () => {
      const { push } = mockSSEFetch();
      const handler = vi.fn();
      const listener = new SSEListener('https://example.com/sse');
      listener.onChange(handler);
      listener.start();

      await vi.advanceTimersByTimeAsync(0);

      push({
        type: 'create',
        collection: 'users',
        id: 1,
        data: { name: 'Alice' },
        timestamp: Date.now(),
      });

      await vi.advanceTimersByTimeAsync(0);

      expect(handler).toHaveBeenCalledWith({
        type: 'create',
        collection: 'users',
        id: 1,
        data: { name: 'Alice' },
        timestamp: expect.any(Number),
      });

      listener.stop();
    });

    it('should stop listening', () => {
      const listener = new SSEListener('https://example.com/sse');
      listener.start();
      listener.stop();

      expect(listener.isConnected()).toBe(false);
    });

    it('should update token and restart connection', () => {
      const listener = new SSEListener('https://example.com/sse', { token: 'old-token' });
      listener.start();
      listener.setToken('new-token');

      expect((listener as any).token).toBe('new-token');
      listener.stop();
    });
  });

  describe('WebSocketListener', () => {
    it('should create a WebSocket listener', () => {
      const listener = new WebSocketListener('wss://example.com/ws');
      expect(listener).toBeInstanceOf(WebSocketListener);
    });

    it('should connect and become connected', async () => {
      const listener = new WebSocketListener('wss://example.com/ws');
      listener.start();

      vi.advanceTimersByTime(20);

      expect(listener.isConnected()).toBe(true);
    });

    it('should handle server changes', async () => {
      const handler = vi.fn();
      const listener = new WebSocketListener('wss://example.com/ws');
      listener.onChange(handler);
      listener.start();

      vi.advanceTimersByTime(20);

      // Simulate message
      const mockWs = (listener as any).ws;
      mockWs.onmessage?.({
        data: JSON.stringify({
          type: 'update',
          collection: 'posts',
          id: 42,
          data: { title: 'Updated' },
          timestamp: Date.now(),
        }),
      });

      expect(handler).toHaveBeenCalledWith({
        type: 'update',
        collection: 'posts',
        id: 42,
        data: { title: 'Updated' },
        timestamp: expect.any(Number),
      });
    });

    it('should stop listening', () => {
      const listener = new WebSocketListener('wss://example.com/ws');
      listener.start();
      listener.stop();

      expect(listener.isConnected()).toBe(false);
    });
  });

  describe('ServerPushListener', () => {
    afterEach(() => {
      delete (global as any).fetch;
    });

    it('should create SSE listener by default', () => {
      const listener = new ServerPushListener({ url: 'https://example.com/sse' });
      expect(listener).toBeInstanceOf(ServerPushListener);
    });

    it('should create WebSocket listener when protocol is websocket', () => {
      const listener = new ServerPushListener({
        url: 'wss://example.com/ws',
        protocol: 'websocket',
      });
      expect(listener).toBeInstanceOf(ServerPushListener);
    });

    it('should start and stop listening', async () => {
      mockSSEFetch();
      const listener = new ServerPushListener({ url: 'https://example.com/sse' });
      listener.start();
      await vi.advanceTimersByTimeAsync(0);
      expect(listener.isConnected()).toBe(true);

      listener.stop();
      expect(listener.isConnected()).toBe(false);
    });

    it('should get status', () => {
      const listener = new ServerPushListener({ url: 'https://example.com/sse' });
      const status = listener.getStatus();

      expect(status).toEqual({
        connected: false,
        protocol: 'sse',
      });
    });

    it('should create SocketIOListener when protocol is socketio', () => {
      const listener = new ServerPushListener({
        url: 'http://localhost:3000',
        protocol: 'socketio',
        collections: ['users'],
      });

      expect(listener.getListener()).toBeInstanceOf(SocketIOListener);
    });
  });

  describe('SocketIOListener', () => {
    it('should connect and subscribe to configured collections', async () => {
      const listener = new SocketIOListener('http://localhost:3000', {
        token: 'tok',
        collections: ['users', 'posts'],
      });

      await (listener as any).connectClient();

      const client = (listener as any).client as FakeEventDataClientInstance;
      expect(client).toBeDefined();
      expect(client.config.host).toBe('localhost');
      expect(client.config.port).toBe(3000);
      expect(client.config.authentication).toEqual({ auth: 'Bearer tok', authMode: 'Bearer' });

      // Simulate socket.io 'connect' event
      client.socket!.trigger('connect');

      expect(listener.isConnected()).toBe(true);
      expect(client.socket!.emitted).toEqual(
        expect.arrayContaining([
          ['subscribe', ['users']],
          ['subscribe', ['posts']],
        ])
      );
    });

    it('should map data:created broadcast to a create ServerChange', async () => {
      const handler = vi.fn();
      const listener = new SocketIOListener('http://localhost:3000');
      listener.onChange(handler);

      await (listener as any).connectClient();
      const client = (listener as any).client as FakeEventDataClientInstance;

      const timestamp = '2026-06-11T00:00:00.000Z';
      client.socket!.trigger('data:created', {
        table: 'users',
        data: { id: 1, name: 'Alice' },
        timestamp,
      });

      expect(handler).toHaveBeenCalledWith({
        type: 'create',
        collection: 'users',
        id: 1,
        data: { id: 1, name: 'Alice' },
        timestamp: Date.parse(timestamp),
      });
    });

    it('should map data:updated broadcast to an update ServerChange', async () => {
      const handler = vi.fn();
      const listener = new SocketIOListener('http://localhost:3000');
      listener.onChange(handler);

      await (listener as any).connectClient();
      const client = (listener as any).client as FakeEventDataClientInstance;

      const timestamp = '2026-06-11T00:00:00.000Z';
      client.socket!.trigger('data:updated', {
        table: 'posts',
        data: { id: 42, record: { title: 'Updated' } },
        timestamp,
      });

      expect(handler).toHaveBeenCalledWith({
        type: 'update',
        collection: 'posts',
        id: 42,
        data: { title: 'Updated' },
        timestamp: Date.parse(timestamp),
      });
    });

    it('should map data:deleted broadcast to a delete ServerChange', async () => {
      const handler = vi.fn();
      const listener = new SocketIOListener('http://localhost:3000');
      listener.onChange(handler);

      await (listener as any).connectClient();
      const client = (listener as any).client as FakeEventDataClientInstance;

      const timestamp = '2026-06-11T00:00:00.000Z';
      client.socket!.trigger('data:deleted', {
        table: 'users',
        data: { id: 5 },
        timestamp,
      });

      expect(handler).toHaveBeenCalledWith({
        type: 'delete',
        collection: 'users',
        id: 5,
        data: undefined,
        timestamp: Date.parse(timestamp),
      });
    });

    it('should map data:restored broadcast to an update ServerChange', async () => {
      const handler = vi.fn();
      const listener = new SocketIOListener('http://localhost:3000');
      listener.onChange(handler);

      await (listener as any).connectClient();
      const client = (listener as any).client as FakeEventDataClientInstance;

      const timestamp = '2026-06-11T00:00:00.000Z';
      client.socket!.trigger('data:restored', {
        table: 'users',
        data: { id: 7, name: 'Restored' },
        timestamp,
      });

      expect(handler).toHaveBeenCalledWith({
        type: 'update',
        collection: 'users',
        id: 7,
        data: { id: 7, name: 'Restored' },
        timestamp: Date.parse(timestamp),
      });
    });

    it('should expose the underlying client via getClient()', async () => {
      const listener = new SocketIOListener('http://localhost:3000');
      await (listener as any).connectClient();

      expect(listener.getClient()).toBe((listener as any).client);
    });

    it('should disconnect on stop()', async () => {
      const listener = new SocketIOListener('http://localhost:3000');
      await (listener as any).connectClient();
      const client = (listener as any).client as FakeEventDataClientInstance;
      client.socket!.trigger('connect');

      listener.stop();

      expect(client.socket!.connected).toBe(false);
      expect(listener.isConnected()).toBe(false);
    });
  });
});
