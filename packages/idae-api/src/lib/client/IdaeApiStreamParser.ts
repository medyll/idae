// packages\idae-api\src\lib\client\IdaeApiStreamParser.ts

export type StreamFormat = "sse" | "ndjson" | "text";

/**
 * Decode a fetch ReadableStream into discrete chunks.
 * - "sse"    → parse `data: {...}\n\n` frames, JSON.parse the payload (stops on `[DONE]`)
 * - "ndjson" → one JSON object per line (e.g. raw Ollama/OpenAI streaming)
 * - "text"   → raw decoded string slices, no framing
 */
export async function* parseStream<T = unknown>(
  body: ReadableStream<Uint8Array>,
  format: StreamFormat = "sse",
  signal?: AbortSignal,
): AsyncGenerator<T> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      if (format === "text") {
        if (buffer) {
          yield buffer as unknown as T;
          buffer = "";
        }
        continue;
      }

      const separator = format === "sse" ? "\n\n" : "\n";
      let separatorIndex: number;
      while ((separatorIndex = buffer.indexOf(separator)) !== -1) {
        const frame = buffer.slice(0, separatorIndex).trim();
        buffer = buffer.slice(separatorIndex + separator.length);
        if (!frame) continue;

        const payload = format === "sse" ? frame.replace(/^data:\s*/, "") : frame;
        if (payload === "[DONE]") return;

        yield JSON.parse(payload) as T;

        if (signal?.aborted) return;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
