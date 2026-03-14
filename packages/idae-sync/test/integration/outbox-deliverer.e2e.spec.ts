import { describe, it, expect, vi } from 'vitest';

// Note: these imports assume the project exports the named helpers from src/index or relevant modules.
// Adjust paths if your codebase exports from different files.
import {
  InMemoryOutboxStore,
  createSyncAdapter,
  OutboxDeliverer,
  Deliverer,
  WhereSerializer,
  ensureUpdatedAt,
  ConflictResolver,
} from '../../src';

// Small helper to make deterministic delays
const tick = () => new Promise((r) => setTimeout(r, 0));

describe('OutboxDeliverer (integration)', () => {
  it('local write enqueues and deliverer.processOnce handles success; outbox entry removed and applyRemote invoked', async () => {
    const outbox = new InMemoryOutboxStore();
    const serializer = new WhereSerializer();
    const adapter = createSyncAdapter({ outbox, serializer, ensureUpdatedAt, conflictResolver: new ConflictResolver() });

    // Create deliverer that will process entries from outbox
    const deliverer = new OutboxDeliverer(outbox);

    // Spy for applyRemote side-effect
    const applyRemote = vi.fn();

    // deliverFn resolves successfully with a canonical response
    const deliverFn = vi.fn(async (_entry) => {
      return { status: 'success', response: { canonical: { id: 'doc-1', value: 'remote-canonical' } } };
    });

    // Perform a local write which should enqueue an outbox entry
    // The exact adapter.handleEvent signature depends on the project; we use a minimal assumed shape.
    await adapter.handleEvent({ type: 'local-write', doc: { id: 'doc-1', value: 'local' }, source: 'local' });

    // Ensure entry was enqueued
    const pending = await outbox.list();
    expect(pending.length).toBeGreaterThan(0);

    // Process one entry
    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });

    // allow microtasks to flush
    await tick();

    // deliverFn should have been called
    expect(deliverFn).toHaveBeenCalled();

    // applyRemote should have been invoked with the response
    expect(applyRemote).toHaveBeenCalledWith({ canonical: { id: 'doc-1', value: 'remote-canonical' } });

    // Entry should be acknowledged/removed from outbox
    const after = await outbox.list();
    expect(after.length).toBe(0);
  });

  it('transient error: first retry then success; retryCount increments and entry removed after success', async () => {
    const outbox = new InMemoryOutboxStore();
    const serializer = new WhereSerializer();
    const adapter = createSyncAdapter({ outbox, serializer, ensureUpdatedAt, conflictResolver: new ConflictResolver() });
    const deliverer = new OutboxDeliverer(outbox);

    const applyRemote = vi.fn();

    // deliverFn: first call -> retry, second call -> success
    const calls: Array<any> = [];
    const deliverFn = vi.fn(async (entry) => {
      calls.push(entry);
      if (calls.length === 1) return { status: 'retry' };
      return { status: 'success', response: { canonical: { id: 't1' } } };
    });

    await adapter.handleEvent({ type: 'local-write', doc: { id: 't1' }, source: 'local' });

    // Run first processOnce -> should request retry and not remove entry
    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });
    let all = await outbox.list();
    expect(all.length).toBe(1);
    expect(all[0].meta.retryCount >= 1).toBe(true);

    // Run second processOnce -> success and removed
    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });
    all = await outbox.list();
    expect(all.length).toBe(0);
  });

  it('permanent 4xx: mark entry as failed with failureReason', async () => {
    const outbox = new InMemoryOutboxStore();
    const serializer = new WhereSerializer();
    const adapter = createSyncAdapter({ outbox, serializer, ensureUpdatedAt, conflictResolver: new ConflictResolver() });
    const deliverer = new OutboxDeliverer(outbox);

    const applyRemote = vi.fn();

    const deliverFn = vi.fn(async () => ({ status: 'permanent', response: { error: 'bad' } }));

    await adapter.handleEvent({ type: 'local-write', doc: { id: 'bad-1' }, source: 'local' });

    // Process once -> should mark failed
    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });

    const all = await outbox.list();
    expect(all.length).toBe(1);
    expect(all[0].meta.failed).toBe(true);
    expect(all[0].meta.failureReason).toBeDefined();
  });

  it('transactional atomicity: transactionalAppend + commit makes entry visible; rollback hides it', async () => {
    const outbox = new InMemoryOutboxStore();
    const serializer = new WhereSerializer();
    const adapter = createSyncAdapter({ outbox, serializer, ensureUpdatedAt, conflictResolver: new ConflictResolver() });
    const deliverer = new OutboxDeliverer(outbox);

    const applyRemote = vi.fn();
    const deliverFn = vi.fn(async () => ({ status: 'success', response: { canonical: { id: 'tx-1' } } }));

    // Start a fake transaction
    const tx = {
      pending: [] as any[],
      async transactionalAppend(entry: any) {
        this.pending.push(entry);
        // don't expose to outbox yet
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

    // transactional append then rollback -> not visible
    const e = { docId: 'tx-1', payload: { id: 'tx-1' }, meta: {} };
    await tx.transactionalAppend(e);
    await tx.rollback();
    let list = await outbox.list();
    expect(list.length).toBe(0);

    // transactional append then commit -> visible and processable
    await tx.transactionalAppend(e);
    await tx.commit();
    list = await outbox.list();
    expect(list.length).toBe(1);

    await deliverer.processOnce({ deliver: deliverFn as Deliverer, applyRemote });
    const after = await outbox.list();
    expect(after.length).toBe(0);
  });
});
