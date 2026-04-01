import type { PushListener, PushConfig, ServerChangeHandler } from './types.js';
import { SSEListener } from './SSEListener.js';
import { WebSocketListener } from './WebSocketListener.js';

/**
 * ServerPushListener - Facade for server push support
 * Automatically selects SSE or WebSocket based on configuration
 */
export class ServerPushListener implements PushListener {
  private config: Required<PushConfig>;
  private listener?: PushListener;

  constructor(config: PushConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      protocol: config.protocol ?? 'sse',
      url: config.url ?? '',
      token: config.token ?? '',
      reconnectIntervalMs: config.reconnectIntervalMs ?? 3000,
      maxReconnects: config.maxReconnects ?? Infinity,
      timeoutMs: config.timeoutMs ?? 30000,
    };

    this.createListener();
  }

  /**
   * Create the appropriate listener based on protocol
   */
  private createListener(): void {
    if (!this.config.url) {
      console.warn('[ServerPush] No URL provided, push disabled');
      return;
    }

    const options = {
      token: this.config.token,
      reconnectIntervalMs: this.config.reconnectIntervalMs,
      maxReconnects: this.config.maxReconnects,
      timeoutMs: this.config.timeoutMs,
    };

    switch (this.config.protocol) {
      case 'websocket':
        this.listener = new WebSocketListener(this.config.url, options);
        break;
      case 'sse':
      default:
        this.listener = new SSEListener(this.config.url, options);
        break;
    }
  }

  /**
   * Start listening for server changes
   */
  start(): void {
    if (this.listener) {
      this.listener.start();
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    if (this.listener) {
      this.listener.stop();
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.listener?.isConnected() ?? false;
  }

  /**
   * Set change handler
   */
  onChange(handler: ServerChangeHandler): void {
    if (this.listener) {
      this.listener.onChange(handler);
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    if (this.listener) {
      this.listener.setToken(token);
    }
  }

  /**
   * Get connection status
   */
  getStatus(): { connected: boolean; protocol: string } {
    return {
      connected: this.isConnected(),
      protocol: this.config.protocol,
    };
  }
}
