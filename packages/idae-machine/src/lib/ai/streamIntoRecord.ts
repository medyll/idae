import type { IdaeApiClient } from '@medyll/idae-api/client';

/**
 * Stream an SSE endpoint, accumulating chunks into a single string.
 * Pure function with zero machine.* surface exposure and zero Svelte imports.
 * Built on @medyll/idae-api client.stream().
 *
 * Persistence (e.g. machine.collection(...).update()) is the caller's
 * responsibility via `onFlush` — keeps this helper testable without a booted machine.
 *
 * @param opts - Configuration object
 * @param opts.slug - API endpoint slug (e.g., '/chat-session/{id}/send')
 * @param opts.body - Request body
 * @param opts.signal - Optional abort signal
 * @param opts.flushMs - Flush interval in milliseconds (default: 120)
 * @param opts.onChunk - Optional callback for each chunk
 * @param opts.onFlush - Optional callback invoked with the accumulated string, throttled by flushMs and once on completion
 * @param opts.pick - Optional function to transform chunks
 * @param opts.apiClient - API client instance (injected for testability)
 *
 * @returns Promise<string> - The accumulated string
 */
export async function streamIntoRecord({
  slug,
  body,
  signal,
  flushMs = 120,
  onChunk,
  onFlush,
  pick,
  apiClient,
}: {
  slug: string;
  body: any;
  signal?: AbortSignal;
  flushMs?: number;
  onChunk?: (chunk: string) => void;
  onFlush?: (accumulated: string) => void | Promise<void>;
  pick?: (data: any) => string;
  apiClient?: IdaeApiClient;
}): Promise<string> {
  // Use provided apiClient or create a default one (browser-safe client entry)
  const client = apiClient || new (await import('@medyll/idae-api/client')).IdaeApiClient();

  let accumulated = '';
  let flushTimeout: ReturnType<typeof setTimeout> | null = null;
  let flushPending = false;

  const scheduleFlush = () => {
    if (flushTimeout) clearTimeout(flushTimeout);
    flushTimeout = setTimeout(async () => {
      if (accumulated && !flushPending) {
        flushPending = true;
        try {
          await onFlush?.(accumulated);
        } finally {
          flushPending = false;
        }
      }
    }, flushMs);
  };

  try {
    for await (const data of client.stream({ slug, body, signal, method: 'POST' })) {
      // Extract chunk from the SSE data
      let chunk = typeof data === 'string' ? data : (data as any).chunk;
      if (pick) {
        chunk = pick(data);
      }

      if (chunk) {
        accumulated += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
        scheduleFlush();
      }
    }

    // Final flush after stream completes
    if (flushTimeout) clearTimeout(flushTimeout);
    if (accumulated) {
      await onFlush?.(accumulated);
    }

    return accumulated;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.debug('[streamIntoRecord] Stream aborted');
    } else {
      console.error('[streamIntoRecord] Stream error:', error);
    }
    throw error;
  } finally {
    if (flushTimeout) {
      clearTimeout(flushTimeout);
    }
  }
}