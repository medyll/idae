import { describe, it, expect, vi } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';

describe('getStatus() devtools snapshot', () => {
  it('returns correct queueLength and mode', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox as any, undefined, { mode: 'server-first' });

    await outbox.enqueue({ id: 'a', collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString() } });
    await outbox.enqueue({ id: 'b', collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString() } });

    const status = await adapter.getStatus();
    expect(status.queueLength).toBe(2);
    expect(status.dlqLength).toBe(0);
    expect(status.mode).toBe('server-first');
    expect(status.running).toBe(false);
    expect(status.networkPaused).toBe(false);
  });

  it('reflects DLQ entries', async () => {
    const outbox = new InMemoryOutboxStore();
    await outbox.enqueue({ id: 'x', collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString() } });
    await outbox.moveToDlq('x', 'test');

    const adapter = createSyncAdapter(outbox as any);
    const status = await adapter.getStatus();
    expect(status.queueLength).toBe(0);
    expect(status.dlqLength).toBe(1);
  });

  it('reflects circuit breaker status', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'retry' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, {
      circuitBreaker: { failureThreshold: 1 },
    });

    await outbox.enqueue({ id: 'z', collection: 'orders', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString() } });
    await adapter.processOnce(); // → failure → circuit opens

    const status = await adapter.getStatus();
    expect(status.circuitBreaker['orders']).toBeDefined();
    expect(status.circuitBreaker['orders'].state).toBe('open');
  });
});
