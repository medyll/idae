import { describe, it, expect, vi } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';

describe('flush()', () => {
  it('delivers all pending entries immediately', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, { batchSize: 1 });

    for (let i = 0; i < 5; i++) {
      await outbox.enqueue({ id: `f${i}`, collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString() } });
    }

    await adapter.flush();

    const remaining = await outbox.list();
    expect(remaining.length).toBe(0);
    expect(deliverFn).toHaveBeenCalledTimes(5);
  });

  it('flush() is a no-op when outbox is empty', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn });
    await adapter.flush();
    expect(deliverFn).not.toHaveBeenCalled();
  });
});

describe('maxQueueSize', () => {
  it('reject strategy: drops new entry when queue full', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox as any, undefined, {
      maxQueueSize: 2,
      queueFullStrategy: 'reject',
    });

    await adapter.applyEvent({ collection: 'c', op: 'add', data: { id: '1' } });
    await adapter.applyEvent({ collection: 'c', op: 'add', data: { id: '2' } });
    await adapter.applyEvent({ collection: 'c', op: 'add', data: { id: '3' } }); // rejected

    const entries = await outbox.list();
    expect(entries.length).toBe(2);
  });

  it('drop-oldest strategy: removes oldest when queue full', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox as any, undefined, {
      maxQueueSize: 2,
      queueFullStrategy: 'drop-oldest',
    });

    await adapter.applyEvent({ collection: 'c', op: 'add', data: { id: '1' } });
    await adapter.applyEvent({ collection: 'c', op: 'add', data: { id: '2' } });
    await adapter.applyEvent({ collection: 'c', op: 'add', data: { id: '3' } }); // drops oldest

    const entries = await outbox.list();
    expect(entries.length).toBe(2);
    // oldest was dropped, remaining are 2nd and 3rd
    expect(entries.some(e => (e.data as any)?.id === '3')).toBe(true);
  });
});

describe('Priority queue', () => {
  it('list() returns higher-priority entries first', async () => {
    const outbox = new InMemoryOutboxStore();

    await outbox.enqueue({ id: 'low', collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString(), priority: 0 } });
    await outbox.enqueue({ id: 'high', collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString(), priority: 10 } });
    await outbox.enqueue({ id: 'med', collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString(), priority: 5 } });

    const entries = await outbox.list();
    expect(entries[0].id).toBe('high');
    expect(entries[1].id).toBe('med');
    expect(entries[2].id).toBe('low');
  });

  it('processOnce() delivers highest-priority entry first', async () => {
    const outbox = new InMemoryOutboxStore();
    const delivered: string[] = [];
    const deliverFn = vi.fn(async (entry: any) => {
      delivered.push(entry.id);
      return { status: 'success' as const };
    });
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, { batchSize: 1 });

    await outbox.enqueue({ id: 'low', collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString(), priority: 0 } });
    await outbox.enqueue({ id: 'urgent', collection: 'c', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString(), priority: 99 } });

    await adapter.processOnce();
    expect(delivered[0]).toBe('urgent');
  });
});
