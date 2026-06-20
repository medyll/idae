import { describe, it, expect, vi } from 'vitest';
import type { IdaeApiClient } from '@medyll/idae-api/client';
import { streamIntoRecord } from './streamIntoRecord.js';

// Minimal mock matching IdaeApiClient.stream() — an async generator (pull model).
// Cast to IdaeApiClient at call sites; we only exercise stream().
class MockApiClient {
  async *stream({ signal }: { signal?: AbortSignal }) {
    const chunks = ['Hello', ' ', 'world', '!', ' How', ' are', ' you', '?'];
    for (const chunk of chunks) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      await new Promise((r) => setTimeout(r, 1));
      yield { chunk };
    }
  }
}

const asClient = (m: { stream: unknown }) => m as unknown as IdaeApiClient;

describe('streamIntoRecord', () => {
  it('should accumulate chunks and return final string', async () => {
    const result = await streamIntoRecord({
      slug: '/test',
      body: {},
      apiClient: asClient(new MockApiClient()),
      flushMs: 100,
    });

    expect(result).toBe('Hello world! How are you?');
  }, 2000);

  it('should call onChunk callback for each chunk', async () => {
    const onChunk = vi.fn();

    await streamIntoRecord({
      slug: '/test',
      body: {},
      apiClient: asClient(new MockApiClient()),
      onChunk,
      flushMs: 100,
    });

    expect(onChunk).toHaveBeenCalled();
    expect(onChunk.mock.calls.length).toBeGreaterThan(0);
  }, 2000);

  it('should handle abort signal', async () => {
    // Slower generator that rejects its pending delay on abort.
    class SlowMockApiClient {
      async *stream({ signal }: { signal?: AbortSignal }) {
        const chunks = ['Hello', ' ', 'world', '!', ' How'];
        for (const chunk of chunks) {
          await new Promise<void>((res, rej) => {
            const t = setTimeout(res, 50);
            signal?.addEventListener(
              'abort',
              () => {
                clearTimeout(t);
                rej(new DOMException('Aborted', 'AbortError'));
              },
              { once: true },
            );
          });
          yield { chunk };
        }
      }
    }

    const controller = new AbortController();

    const promise = streamIntoRecord({
      slug: '/test',
      body: {},
      apiClient: asClient(new SlowMockApiClient()),
      signal: controller.signal,
      flushMs: 100,
    });

    setTimeout(() => controller.abort(), 100);

    await expect(promise).rejects.toThrow('Aborted');
  }, 1000);

  it('should use pick function to extract chunk', async () => {
    class CustomMockApiClient {
      async *stream() {
        yield { data: 'test', chunk: 'raw' };
      }
    }

    const result = await streamIntoRecord({
      slug: '/test',
      body: {},
      apiClient: asClient(new CustomMockApiClient()),
      pick: (data: any) => data.data,
      flushMs: 100,
    });

    expect(result).toBe('test');
  });

  it('should handle string data directly', async () => {
    class StringMockApiClient {
      async *stream() {
        yield 'direct string';
      }
    }

    const result = await streamIntoRecord({
      slug: '/test',
      body: {},
      apiClient: asClient(new StringMockApiClient()),
      flushMs: 100,
    });

    expect(result).toBe('direct string');
  });
});
