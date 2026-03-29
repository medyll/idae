import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SSEListener } from './SSEListener';
import { WebSocketListener } from './WebSocketListener';
import { ServerPushListener } from './ServerPushListener';

// Mock EventSource for SSE tests
class MockEventSource {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;
  readyState: number = MockEventSource.CONNECTING;
  onopen: (() => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onerror: (() => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      this.readyState = MockEventSource.OPEN;
      this.onopen?.();
    }, 10);
  }

  close() {
    this.readyState = MockEventSource.CLOSED;
  }
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
    (global as any).EventSource = MockEventSource;
    (global as any).WebSocket = MockWebSocket;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (global as any).EventSource;
    delete (global as any).WebSocket;
  });

  describe('SSEListener', () => {
    it('should create an SSE listener', () => {
      const listener = new SSEListener('https://example.com/sse');
      expect(listener).toBeInstanceOf(SSEListener);
    });

    it('should connect and become connected', async () => {
      const listener = new SSEListener('https://example.com/sse');
      listener.start();

      vi.advanceTimersByTime(20);

      expect(listener.isConnected()).toBe(true);
    });

    it('should handle server changes', async () => {
      const handler = vi.fn();
      const listener = new SSEListener('https://example.com/sse');
      listener.onChange(handler);
      listener.start();

      vi.advanceTimersByTime(20);

      // Simulate message
      const mockEventSource = (listener as any).eventSource;
      mockEventSource.onmessage?.({
        data: JSON.stringify({
          type: 'create',
          collection: 'users',
          id: 1,
          data: { name: 'Alice' },
          timestamp: Date.now(),
        }),
      });

      expect(handler).toHaveBeenCalledWith({
        type: 'create',
        collection: 'users',
        id: 1,
        data: { name: 'Alice' },
        timestamp: expect.any(Number),
      });
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

    it('should start and stop listening', () => {
      const listener = new ServerPushListener({ url: 'https://example.com/sse' });
      listener.start();
      vi.advanceTimersByTime(20);
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
  });
});
