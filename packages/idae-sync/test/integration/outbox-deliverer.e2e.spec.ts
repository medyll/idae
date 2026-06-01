import { describe, it, expect, vi } from 'vitest';

import { InMemoryOutboxStore } from '../../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../../src/lib/SyncAdapter';
import { OutboxDeliverer } from '../../src/lib/Deliverer';
import type { Deliverer } from '../../src/lib/Deliverer';

const tick = () => new Promise((r) => setTimeout(r, 0));

describe('OutboxDeliverer (integration)', () => {
  it('local write enqueues and deliverer.processOnce handles success; outbox entry removed and applyRemote invoked', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox);

    const deliverer = new OutboxDeliverer(outbox);

    const applyRemote = vi.fn();

    const deliverFn = vi.fn(async (_entry) => {
      return { status: 'success', response: { canonical: { id: 'doc-1', value: 'remote-canonical' } } };
    });

    await adapter.handleEvent({ type: 'local-write', doc: { id: 'doc-1', value: 'local' }, source: 'local' });

    const pending = await outbox.list();
    expect(pending.length).toBeGreaterThan(0);

    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });

    await tick();

    expect(deliverFn).toHaveBeenCalled();
    expect(applyRemote).toHaveBeenCalledWith({ canonical: { id: 'doc-1', value: 'remote-canonical' } });

    const after = await outbox.list();
    expect(after.length).toBe(0);
  });

  it('transient error: first retry then success; retryCount increments and entry removed after success', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox);
    const deliverer = new OutboxDeliverer(outbox);

    const applyRemote = vi.fn();

    const calls: Array<any> = [];
    const deliverFn = vi.fn(async (entry) => {
      calls.push(entry);
      if (calls.length === 1) return { status: 'retry' };
      return { status: 'success', response: { canonical: { id: 't1' } } };
    });

    await adapter.handleEvent({ type: 'local-write', doc: { id: 't1' }, source: 'local' });

    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });
    let all = await outbox.list();
    expect(all.length).toBe(1);
    expect(all[0].meta.retryCount >= 1).toBe(true);

    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });
    all = await outbox.list();
    expect(all.length).toBe(0);
  });

  it('permanent 4xx: mark entry as failed with failureReason', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox);
    const deliverer = new OutboxDeliverer(outbox);

    const applyRemote = vi.fn();

    const deliverFn = vi.fn(async () => ({ status: 'permanent', response: { error: 'bad' } }));

    await adapter.handleEvent({ type: 'local-write', doc: { id: 'bad-1' }, source: 'local' });

    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });

    const all = await outbox.list();
    expect(all.length).toBe(1);
    expect(all[0].meta.failed).toBe(true);
    expect(all[0].meta.failureReason).toBeDefined();
  });

  it('transactional atomicity: transactionalAppend + commit makes entry visible; rollback hides it', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox);
    const deliverer = new OutboxDeliverer(outbox);

    const applyRemote = vi.fn();
    const deliverFn = vi.fn(async () => ({ status: 'success', response: { canonical: { id: 'tx-1' } } }));

    const tx = {
      pending: [] as any[],
      async transactionalAppend(entry: any) {
        this.pending.push(entry);
        return entry;
      },
      async commit() {
        for (const e of this.pending) {
          await outbox.append(e);
        }
        this.pending = [];
      },
      async rollback() {
        this.pending = [];
      },
    };

    const e = { docId: 'tx-1', payload: { id: 'tx-1' }, meta: {} };
    await tx.transactionalAppend(e);
    await tx.rollback();
    let list = await outbox.list();
    expect(list.length).toBe(0);

    await tx.transactionalAppend(e);
    await tx.commit();
    list = await outbox.list();
    expect(list.length).toBe(1);

    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });
    const after = await outbox.list();
    expect(after.length).toBe(0);
  });
});
