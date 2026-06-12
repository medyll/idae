import type { ApiClient } from '@medyll/idae-api';

/**
 * Stream an SSE endpoint into one field of one record.
 * Pure function with zero machine.* surface exposure and zero Svelte imports.
 * Built on @medyll/idae-api client.stream().
 *
 * @param opts - Configuration object
 * @param opts.collection - Collection name to update
 * @param opts.recordId - Record ID to update
 * @param opts.field - Field name to stream into
 * @param opts.slug - API endpoint slug (e.g., '/chat-session/{id}/send')
 * @param opts.body - Request body
 * @param opts.signal - Optional abort signal
 * @param opts.flushMs - Flush interval in milliseconds (default: 120)
 * @param opts.onChunk - Optional callback for each chunk
 * @param opts.pick - Optional function to transform chunks
 * @param opts.apiClient - API client instance (injected for testability)
 *
 * @returns Promise<string> - The accumulated string
 */
export async function streamIntoRecord({
  collection,
  recordId,
  field,
  slug,
  body,
  signal,
  flushMs = 120,
  onChunk,
  pick,
  apiClient,
}: {
  collection: string;
  recordId: string | number;
  field: string;
  slug: string;
  body: any;
  signal?: AbortSignal;
  flushMs?: number;
  onChunk?: (chunk: string) => void;
  pick?: (data: any) => string;
  apiClient?: ApiClient;
}): Promise<string> {
  // Use provided apiClient or create a default one
  const client = apiClient || new (await import('@medyll/idae-api')).ApiClient();

  let accumulated = '';
  let flushTimeout: ReturnType<typeof setTimeout> | null = null;
  let flushPending = false;

  const scheduleFlush = () => {
    if (flushTimeout) clearTimeout(flushTimeout);
    flushTimeout = setTimeout(async () => {
      if (accumulated && !flushPending) {
        flushPending = true;
        try {
          // This would normally call machine.collection(collection).update()
          // but since we can't import machine, we'll use a placeholder
          // In real implementation, this would be:
          // await machine.collection(collection).update(recordId, { [field]: accumulated });
          console.debug(`[streamIntoRecord] Flushing ${accumulated.length} chars to ${collection}.${recordId}.${field}`);
        } finally {
          flushPending = false;
        }
      }
    }, flushMs);
  };

  try {
    await client.stream({
      slug,
      body,
      signal,
      onData: (data) => {
        // Extract chunk from the SSE data
        let chunk = typeof data === 'string' ? data : data.chunk;
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
      },
    });

    // Final flush after stream completes
    if (accumulated) {
      // await machine.collection(collection).update(recordId, { [field]: accumulated });
      console.debug(`[streamIntoRecord] Final flush: ${accumulated.length} chars`);
    }

    return accumulated;
  } catch (error) {
    if (error.name === 'AbortError') {
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