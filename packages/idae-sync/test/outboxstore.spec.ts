import { describe, it, expect } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import type { OutboxEntry } from '../src/lib/outbox/OutboxStore';

describe('InMemoryOutboxStore', () => {
  it('basic operations', async () => {
    const store = new InMemoryOutboxStore();
    const now = new Date().toISOString();
    const e1: OutboxEntry = { id: '1', collection: 'c', op: 'add', data: {a:1}, meta: { retryCount:0, createdAt: now } };
    const e2: OutboxEntry = { id: '2', collection: 'c', op: 'update', key: 'k', meta: { retryCount:0, createdAt: now } };

    await store.enqueue(e1);
    await store.enqueue(e2);

    const list = await store.list();
    expect(list.map(l => l.id)).toEqual(['1','2']);

    const peek = await store.peek();
    expect(peek?.id).toBe('1');

    await store.remove('1');
    const afterRemove = await store.list();
    expect(afterRemove.map(l => l.id)).toEqual(['2']);

    e2.meta.retryCount = 1;
    e2.meta.failed = true;
    e2.meta.failureReason = 'err';
    e2.meta.lastAttempt = new Date().toISOString();
    await store.update(e2);
    const updated = (await store.list())[0];
    expect(updated.meta.retryCount).toBe(1);
    expect(updated.meta.failed).toBe(true);
    expect(updated.meta.failureReason).toBe('err');

    await store.remove('2');
    expect(await store.list()).toEqual([]);
  });
});
