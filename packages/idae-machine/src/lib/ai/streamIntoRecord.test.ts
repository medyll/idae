import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { streamIntoRecord } from './streamIntoRecord';

// Mock ApiClient
class MockApiClient {
  async stream({ onData, signal }) {
    // Simulate streaming chunks
    const chunks = ['Hello', ' ', 'world', '!', ' How', ' are', ' you', '?'];
    
    // Use promise to handle async completion
    return new Promise((resolve, reject) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < chunks.length) {
          onData({ chunk: chunks[i++] });
        } else {
          clearInterval(interval);
          resolve({ ok: true });
        }
      }, 1);
      
      // Handle abort
      if (signal) {
        signal.addEventListener('abort', () => {
          clearInterval(interval);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });
  }
}

describe('streamIntoRecord', () => {
  // Note: Not using fake timers because setInterval doesn't work well with them
  // for streaming simulations. Using real timers with appropriate timeouts.

  it('should accumulate chunks and return final string', async () => {
    const result = await streamIntoRecord({
      collection: 'ai_message',
      recordId: '123',
      field: 'content',
      slug: '/test',
      body: {},
      apiClient: new MockApiClient(),
      flushMs: 100,
    });

    expect(result).toBe('Hello world! How are you?');
  }, 2000); // 2s timeout for 8 chunks at 1ms interval

  it('should call onChunk callback for each chunk', async () => {
    const onChunk = vi.fn();
    
    await streamIntoRecord({
      collection: 'ai_message',
      recordId: '123',
      field: 'content',
      slug: '/test',
      body: {},
      apiClient: new MockApiClient(),
      onChunk,
      flushMs: 100,
    });

    expect(onChunk).toHaveBeenCalled();
    expect(onChunk.mock.calls.length).toBeGreaterThan(0);
  }, 2000);

  it('should handle abort signal', async () => {
    // Use a slower mock for abort testing
    class SlowMockApiClient {
      async stream({ onData, signal }) {
        return new Promise((resolve, reject) => {
          const chunks = ['Hello', ' ', 'world', '!', ' How'];
          let i = 0;
          const interval = setInterval(() => {
            if (i < chunks.length) {
              onData({ chunk: chunks[i++] });
            } else {
              clearInterval(interval);
              resolve({ ok: true });
            }
          }, 50); // Slower interval
          
          if (signal) {
            signal.addEventListener('abort', () => {
              clearInterval(interval);
              reject(new DOMException('Aborted', 'AbortError'));
            });
          }
        });
      }
    }
    
    const controller = new AbortController();
    
    const promise = streamIntoRecord({
      collection: 'ai_message',
      recordId: '123',
      field: 'content',
      slug: '/test',
      body: {},
      apiClient: new SlowMockApiClient(),
      signal: controller.signal,
      flushMs: 100,
    });
    
    // Abort quickly before stream completes
    setTimeout(() => controller.abort(), 100);
    
    await expect(promise).rejects.toThrow('Aborted');
  }, 1000);

  it('should use pick function to extract chunk', async () => {
    class CustomMockApiClient {
      async stream({ onData }) {
        onData({ data: 'test', chunk: 'raw' });
        return { ok: true };
      }
    }
    
    const result = await streamIntoRecord({
      collection: 'ai_message',
      recordId: '123',
      field: 'content',
      slug: '/test',
      body: {},
      apiClient: new CustomMockApiClient(),
      pick: (data) => data.data,
      flushMs: 100,
    });

    expect(result).toBe('test');
  });

  it('should handle string data directly', async () => {
    class StringMockApiClient {
      async stream({ onData }) {
        onData('direct string');
        return { ok: true };
      }
    }
    
    const result = await streamIntoRecord({
      collection: 'ai_message',
      recordId: '123',
      field: 'content',
      slug: '/test',
      body: {},
      apiClient: new StringMockApiClient(),
      flushMs: 100,
    });

    expect(result).toBe('direct string');
  });
});