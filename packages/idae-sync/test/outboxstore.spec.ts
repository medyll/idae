import { describe, it, expect } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/impl/InMemoryOutboxStore';
import type { OutboxEntry } from '../src/lib/OutboxStore';

describe('InMemoryOutboxStore', () => {
  it('basic operations', async () => {
    const store = new InMemoryOutboxStore();
    const now = new Date().toISOString();
    const e1: OutboxEntry = { id: '1', collection: 'c', op: 'add', data: {a:1}, meta: { retryCount:0, createdAt: now } };
    const e2: OutboxEntry = { id: '2', collection: 'c', op: 'update', key: 'k', meta: { retryCount:0, createdAt: now } };

    await store.append(e1);
    await store.append(e2);

    const list = await store.list();
    expect(list.map(l => l.id)).toEqual(['1','2']);

    const peek = await store.peek();
    expect(peek?.id).toBe('1');

    await store.ack('1');
    const afterAck = await store.list();
    expect(afterAck.map(l => l.id)).toEqual(['2']);

    await store.updateMeta('2', { retryCount: 1, failed: true, failureReason: 'err', lastAttempt: new Date().toISOString() });
    const updated = (await store.list())[0];
    expect(updated.meta.retryCount).toBe(1);
    expect(updated.meta.failed).toBe(true);
    expect(updated.meta.failureReason).toBe('err');

    await store.remove('2');
    expect(await store.list()).toEqual([]);

    const tx = { staged: [] as OutboxEntry[] };
    await store.transactionalAppend(tx, e1);
    expect(tx.staged.length).toBe(1);
  });
});
