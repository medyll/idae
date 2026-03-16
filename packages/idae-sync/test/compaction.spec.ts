import { describe, it, expect, vi } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';

describe('Outbox Compaction', () => {
  it('deduplicates successive puts on same key (compact: true)', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, { compact: true });

    // First write
    await adapter.applyEvent({ collection: 'users', op: 'put', data: { id: '1', name: 'Alice' }, key: '1' });

    // Second write on same key — should update the existing entry, not add a new one
    // (deliverer already called for first, so outbox is empty unless delivery failed)
    // Test scenario: no deliverer, just compaction behavior
    const adapterNoDeliverer = createSyncAdapter(outbox as any, undefined, { compact: true });

    await adapterNoDeliverer.applyEvent({ collection: 'items', op: 'put', data: { id: 'A', value: 1 }, key: 'A' });
    await adapterNoDeliverer.applyEvent({ collection: 'items', op: 'put', data: { id: 'A', value: 2 }, key: 'A' });
    await adapterNoDeliverer.applyEvent({ collection: 'items', op: 'put', data: { id: 'A', value: 3 }, key: 'A' });

    const entries = await outbox.list();
    const itemEntries = entries.filter(e => e.collection === 'items');

    // Only 1 entry for 'A', with latest data
    expect(itemEntries.length).toBe(1);
    expect((itemEntries[0].data as any).value).toBe(3);
  });

  it('does not compact when compact: false (default)', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox as any);

    await adapter.applyEvent({ collection: 'items', op: 'put', data: { id: 'B', value: 1 }, key: 'B' });
    await adapter.applyEvent({ collection: 'items', op: 'put', data: { id: 'B', value: 2 }, key: 'B' });

    const entries = await outbox.list();
    const itemEntries = entries.filter(e => e.collection === 'items');
    expect(itemEntries.length).toBe(2);
  });

  it('always adds entries without a key (no compaction possible)', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox as any, undefined, { compact: true });

    await adapter.applyEvent({ collection: 'logs', op: 'add', data: { msg: 'a' } });
    await adapter.applyEvent({ collection: 'logs', op: 'add', data: { msg: 'b' } });

    const entries = await outbox.list();
    const logEntries = entries.filter(e => e.collection === 'logs');
    expect(logEntries.length).toBe(2);
  });
});
