import type { PushListener, ServerChangeHandler, ServerChange } from './types.js';

/**
 * SSE (Server-Sent Events) listener for server push.
 *
 * Uses `fetch` + `ReadableStream` instead of the native `EventSource` so that
 * an `Authorization` header can be sent (no token-in-URL). Frame parsing
 * (`data: <json>\n\n`) mirrors idae-api's `parseStream(..., 'sse')` /
 * `SseStream` framing without taking a runtime dependency on `@medyll/idae-api`
 * (that package's single export barrel also pulls in server-only deps).
 */
export class SSEListener implements PushListener {
  private url: string;
  private token?: string;
  private reconnectIntervalMs: number;
  private maxReconnects: number;
  private timeoutMs: number;
  private changeHandler?: ServerChangeHandler;
  private reconnectCount: number = 0;
  private stopped: boolean = true;
  private connected: boolean = false;
  private abortController?: AbortController;

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
    this.stopped = false;
    void this.connectStream();
  }

  /**
   * Open the SSE connection and read frames until it closes, errors, or is stopped.
   */
  private async connectStream(): Promise<void> {
    if (this.stopped) return;

    this.abortController = new AbortController();
    const { signal } = this.abortController;
    const timeoutId = setTimeout(() => this.abortController?.abort(), this.timeoutMs);

    try {
      const headers: Record<string, string> = { Accept: 'text/event-stream' };
      if (this.token) headers.Authorization = `Bearer ${this.token}`;

      const response = await fetch(this.url, { headers, signal });
      clearTimeout(timeoutId);

      if (!response.ok || !response.body) {
        throw new Error(`[SSE] Connection failed: ${response.status}`);
      }

      this.connected = true;
      this.reconnectCount = 0;

      await this.readFrames(response.body, signal);
    } catch (error) {
      clearTimeout(timeoutId);
      if (!this.stopped) {
        console.error('[SSE] Connection error:', error);
      }
    }

    this.connected = false;
    if (!this.stopped) {
      this.scheduleReconnect();
    }
  }

  /**
   * Parse `data: <json>\n\n` frames from the response body, dispatching each
   * payload to the change handler (stops on `[DONE]`).
   */
  private async readFrames(body: ReadableStream<Uint8Array>, signal: AbortSignal): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        if (signal.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let separatorIndex: number;
        while ((separatorIndex = buffer.indexOf('\n\n')) !== -1) {
          const frame = buffer.slice(0, separatorIndex).trim();
          buffer = buffer.slice(separatorIndex + 2);
          if (!frame) continue;

          const payload = frame.replace(/^data:\s*/, '');
          if (payload === '[DONE]') return;

          try {
            const change: ServerChange = JSON.parse(payload);
            this.changeHandler?.(change);
          } catch (error) {
            console.error('[SSE] Error parsing message:', error);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    this.stopped = true;
    this.connected = false;
    this.abortController?.abort();
    this.abortController = undefined;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
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
    const wasActive = !this.stopped;
    if (wasActive) {
      this.stop();
      this.start();
    }
  }

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(): void {
    if (this.stopped || this.reconnectCount >= this.maxReconnects) {
      return;
    }

    this.reconnectCount++;

    setTimeout(() => {
      if (!this.stopped) {
        this.start();
      }
    }, this.reconnectIntervalMs);
  }
}
