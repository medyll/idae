/**
 * e2e tests using real OutboxStore + fake-indexeddb
 * Validates IDB schema, DLQ store, priority sort, and findPending.
 */
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { OutboxStore } from '../src/lib/outbox/OutboxStore';
import type { OutboxEntry } from '../src/lib/outbox/OutboxStore';

function makeEntry(id: string, priority = 0): OutboxEntry {
  return {
    id,
    collection: 'test',
    op: 'add',
    key: id,
    data: { id },
    meta: { retryCount: 0, createdAt: new Date().toISOString(), priority },
  };
}

describe('OutboxStore (IDB real)', () => {
  let store: OutboxStore;

  beforeEach(() => {
    // Each test gets a fresh DB name to avoid IDB version conflicts
    store = new OutboxStore(`test-db-${Math.random().toString(36).slice(2)}`);
  });

  it('enqueue + list', async () => {
    await store.enqueue(makeEntry('a'));
    await store.enqueue(makeEntry('b'));
    const entries = await store.list();
    expect(entries.length).toBe(2);
  });

  it('remove deletes entry', async () => {
    await store.enqueue(makeEntry('c'));
    await store.remove('c');
    const entries = await store.list();
    expect(entries.length).toBe(0);
  });

  it('update persists changes', async () => {
    const entry = makeEntry('d');
    await store.enqueue(entry);
    entry.meta.retryCount = 5;
    await store.update(entry);
    const entries = await store.list();
    expect(entries[0].meta.retryCount).toBe(5);
  });

  it('list() sorts by priority descending', async () => {
    await store.enqueue(makeEntry('low', 0));
    await store.enqueue(makeEntry('high', 10));
    await store.enqueue(makeEntry('med', 5));
    const entries = await store.list();
    expect(entries[0].id).toBe('high');
    expect(entries[1].id).toBe('med');
    expect(entries[2].id).toBe('low');
  });

  it('size() returns count', async () => {
    await store.enqueue(makeEntry('x'));
    await store.enqueue(makeEntry('y'));
    expect(await store.size()).toBe(2);
    await store.remove('x');
    expect(await store.size()).toBe(1);
  });

  it('findPending returns matching pending entry', async () => {
    await store.enqueue(makeEntry('k1'));
    const found = await store.findPending('test', 'k1');
    expect(found?.id).toBe('k1');
  });

  it('moveToDlq + listDlq + replayDlq', async () => {
    await store.enqueue(makeEntry('dlq1'));
    await store.moveToDlq('dlq1', 'test-reason');

    const main = await store.list();
    expect(main.length).toBe(0);

    const dlq = await store.listDlq();
    expect(dlq.length).toBe(1);
    expect(dlq[0].meta.failureReason).toBe('test-reason');

    await store.replayDlq('dlq1');
    const dlqAfter = await store.listDlq();
    expect(dlqAfter.length).toBe(0);
    const mainAfter = await store.list();
    expect(mainAfter[0].meta.retryCount).toBe(0);
    expect(mainAfter[0].meta.failed).toBeFalsy();
  });

  it('clearDlq empties DLQ', async () => {
    await store.enqueue(makeEntry('e1'));
    await store.moveToDlq('e1');
    await store.clearDlq();
    expect(await store.listDlq()).toHaveLength(0);
  });

  it('subscribe calls callback with metrics', async () => {
    const metrics: any[] = [];
    store.subscribe(m => metrics.push(m));
    await new Promise(r => setTimeout(r, 20)); // initial call
    await store.enqueue(makeEntry('sub1'));
    await new Promise(r => setTimeout(r, 10));
    expect(metrics.length).toBeGreaterThan(0);
    const last = metrics[metrics.length - 1];
    expect(last.queueLength).toBeGreaterThanOrEqual(1);
  });
});
