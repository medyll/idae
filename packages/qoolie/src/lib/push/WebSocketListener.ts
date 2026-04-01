import type { PushListener, ServerChangeHandler, ServerChange } from './types.js';

/**
 * WebSocket listener for server push
 */
export class WebSocketListener implements PushListener {
  private url: string;
  private token?: string;
  private reconnectIntervalMs: number;
  private maxReconnects: number;
  private timeoutMs: number;
  private ws?: WebSocket;
  private changeHandler?: ServerChangeHandler;
  private reconnectCount: number = 0;
  private stopped: boolean = false;
  private heartbeatInterval?: number;

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
      this.ws = new WebSocket(urlWithToken);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connection opened');
        this.reconnectCount = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const change: ServerChange = JSON.parse(event.data);
          if (this.changeHandler) {
            this.changeHandler(change);
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Connection closed');
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
        this.ws?.close();
      };

      // Set connection timeout
      setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
      }, this.timeoutMs);
    } catch (error) {
      console.error('[WebSocket] Failed to create WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    this.stopped = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
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
    if (this.ws) {
      this.stop();
      this.start();
    }
  }

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(): void {
    if (this.stopped || this.reconnectCount >= this.maxReconnects) {
      console.log('[WebSocket] Stopped reconnecting');
      return;
    }

    this.reconnectCount++;
    console.log(`[WebSocket] Reconnecting in ${this.reconnectIntervalMs}ms (attempt ${this.reconnectCount})`);

    setTimeout(() => {
      if (!this.stopped) {
        this.start();
      }
    }, this.reconnectIntervalMs);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }
}
