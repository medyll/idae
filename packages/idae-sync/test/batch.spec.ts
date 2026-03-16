import { describe, it, expect, vi } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';
import type { IDeliverer } from '../src/lib/deliverer/IDeliverer';

describe('Batch Delivery', () => {
  it('processes batchSize entries per processOnce call', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, { batchSize: 3 });

    // Enqueue 5 entries directly (bypassing applyEvent's immediate delivery)
    for (let i = 0; i < 5; i++) {
      await outbox.enqueue({
        id: `e${i}`,
        collection: 'c',
        op: 'add',
        data: { i },
        meta: { retryCount: 0, createdAt: new Date().toISOString() },
      });
    }

    await adapter.processOnce();

    // Should have processed 3 entries (batchSize=3), 2 remaining
    const remaining = await outbox.list();
    expect(remaining.length).toBe(2);
    expect(deliverFn).toHaveBeenCalledTimes(3);
  });

  it('default batchSize=1 processes one entry at a time', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn });

    for (let i = 0; i < 3; i++) {
      await outbox.enqueue({
        id: `f${i}`,
        collection: 'c',
        op: 'add',
        data: { i },
        meta: { retryCount: 0, createdAt: new Date().toISOString() },
      });
    }

    await adapter.processOnce();

    const remaining = await outbox.list();
    expect(remaining.length).toBe(2);
    expect(deliverFn).toHaveBeenCalledTimes(1);
  });
});
