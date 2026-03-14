import { describe, it, expect } from 'vitest';
import { InMemoryOutboxStore, Tx } from '../src/lib/outbox/InMemoryOutboxStore';

describe('InMemoryOutboxStore transactions', () => {
  it('transactional append followed by commit makes entry visible via list/peek', async () => {
    const store = new InMemoryOutboxStore();
    const tx = new Tx(store);

    const entry = {
      id: 't1',
      collection: 'users',
      op: 'put',
      data: { id: 't1', name: 'Bob' },
      meta: { retryCount: 0, createdAt: new Date().toISOString() },
    } as any;

    await store.transactionalAppend(tx, entry);
    // not visible yet
    let list = await store.list();
    expect(list.find((e) => e.id === 't1')).toBeUndefined();
    expect(await store.peek('t1')).toBeUndefined();

    await tx.commit();

    list = await store.list();
    expect(list.find((e) => e.id === 't1')).toBeDefined();
    expect((await store.peek('t1'))?.id).toBe('t1');
  });

  it('transactional append followed by rollback leaves no entry', async () => {
    const store = new InMemoryOutboxStore();
    const tx = new Tx(store);

    const entry = {
      id: 't2',
      collection: 'users',
      op: 'put',
      data: { id: 't2', name: 'Eve' },
      meta: { retryCount: 0, createdAt: new Date().toISOString() },
    } as any;

    await store.transactionalAppend(tx, entry);
    // not visible yet
    expect((await store.peek('t2'))).toBeUndefined();

    await tx.rollback();

    expect((await store.peek('t2'))).toBeUndefined();
    const list = await store.list();
    expect(list.find((e) => e.id === 't2')).toBeUndefined();
  });
});
