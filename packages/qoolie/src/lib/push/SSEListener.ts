import type { PushListener, ServerChangeHandler, ServerChange } from './types.js';

/**
 * SSE (Server-Sent Events) listener for server push
 */
export class SSEListener implements PushListener {
  private url: string;
  private token?: string;
  private reconnectIntervalMs: number;
  private maxReconnects: number;
  private timeoutMs: number;
  private eventSource?: EventSource;
  private changeHandler?: ServerChangeHandler;
  private reconnectCount: number = 0;
  private stopped: boolean = false;

  constructor(
    url: string,
    options: {
      token?: string;
      reconnectIntervalMs?: number;
      maxReconnects?: number;
      timeoutMs?: number;
    } = {}
  ) {
    this.url = url;
    this.token = options.token;
    this.reconnectIntervalMs = options.reconnectIntervalMs ?? 3000;
    this.maxReconnects = options.maxReconnects ?? Infinity;
    this.timeoutMs = options.timeoutMs ?? 30000;
  }

  /**
   * Start listening for server changes
   */
  start(): void {
    if (this.stopped) {
      this.reconnectCount = 0;
      this.stopped = false;
    }

    try {
      const urlWithToken = this.token ? `${this.url}?token=${encodeURIComponent(this.token)}` : this.url;
      this.eventSource = new EventSource(urlWithToken);

      this.eventSource.onopen = () => {
        console.log('[SSE] Connection opened');
        this.reconnectCount = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const change: ServerChange = JSON.parse(event.data);
          if (this.changeHandler) {
            this.changeHandler(change);
          }
        } catch (error) {
          console.error('[SSE] Error parsing message:', error);
        }
      };

      this.eventSource.onerror = () => {
        console.log('[SSE] Connection error, reconnecting...');
        this.eventSource?.close();
        this.scheduleReconnect();
      };

      // Set connection timeout
      setTimeout(() => {
        if (this.eventSource && this.eventSource.readyState === EventSource.CONNECTING) {
          this.eventSource.close();
          this.scheduleReconnect();
        }
      }, this.timeoutMs);
    } catch (error) {
      console.error('[SSE] Failed to create EventSource:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    this.stopped = true;
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  /**
   * Set change handler
   */
  onChange(handler: ServerChangeHandler): void {
    this.changeHandler = handler;
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    // Restart connection with new token
    if (this.eventSource) {
      this.stop();
      this.start();
    }
  }

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(): void {
    if (this.stopped || this.reconnectCount >= this.maxReconnects) {
      console.log('[SSE] Stopped reconnecting');
      return;
    }

    this.reconnectCount++;
    console.log(`[SSE] Reconnecting in ${this.reconnectIntervalMs}ms (attempt ${this.reconnectCount})`);

    setTimeout(() => {
      if (!this.stopped) {
        this.start();
      }
    }, this.reconnectIntervalMs);
  }
}
