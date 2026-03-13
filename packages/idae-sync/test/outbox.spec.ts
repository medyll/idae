import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { OutboxStore } from '../src/lib/outbox/OutboxStore';

describe('OutboxStore', () => {
  it('enqueue, list, remove and metrics', async () => {
    const outbox = new OutboxStore('test-outbox-db', 1);
    const entry = {
      id: 'e1',
      collection: 'users',
      op: 'put',
      data: { id: 'e1', name: 'Alice' },
      meta: { retryCount: 0, createdAt: new Date().toISOString() },
    } as any;

    await outbox.enqueue(entry);
    const list = await outbox.list();
    expect(list.length).toBeGreaterThan(0);

    const metrics = await outbox.getMetrics();
    expect(metrics.queueLength).toBe(list.length);

    await outbox.remove('e1');
    const list2 = await outbox.list();
    expect(list2.find((e) => e.id === 'e1')).toBeUndefined();
  });

  it('subscribe receives updates', async () => {
    const outbox = new OutboxStore('test-outbox-db-2', 1);
    let observed: any = null;
    const unsubscribe = outbox.subscribe((m) => {
      observed = m;
    });

    const entry = {
      id: 'e2',
      collection: 'users',
      op: 'add',
      data: { id: 'e2' },
      meta: { retryCount: 0, createdAt: new Date().toISOString() },
    } as any;

    await outbox.enqueue(entry);
    // wait for subscription callback
    await new Promise((r) => setTimeout(r, 50));
    expect(observed).not.toBeNull();
    unsubscribe();
  });
});
