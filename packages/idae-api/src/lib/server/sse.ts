// packages\idae-api\src\lib\server\sse.ts
import type { Response } from "express";

/**
 * Thin wrapper around an Express response for emitting Server-Sent Events.
 * Sets the SSE headers on construction and frames every payload as
 * `data: <json>\n\n`, matching what `parseStream(..., "sse")` expects client-side.
 */
export class SseStream {
  constructor(private res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();
  }

  send(data: unknown): void {
    this.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  done(extra?: object): void {
    this.send({ done: true, ...extra });
    this.res.end();
  }

  error(message: string): void {
    this.send({ error: message });
    this.res.end();
  }
}
