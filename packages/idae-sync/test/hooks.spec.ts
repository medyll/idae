import { describe, it, expect, vi } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';
import type { OutboxEntry } from '../src/lib/outbox/OutboxStore';

describe('Hooks Pipeline', () => {
  it('onEnqueue transforms entry before it hits the outbox', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox as any, undefined, {
      hooks: {
        onEnqueue: (entry) => ({ ...entry, data: { ...(entry.data as object), _tagged: true } }),
      },
    });

    await adapter.applyEvent({ collection: 'items', op: 'add', data: { id: '1' } });
    const entries = await outbox.list();
    expect((entries[0].data as any)._tagged).toBe(true);
  });

  it('onBeforeDeliver transforms entry before delivery', async () => {
    const outbox = new InMemoryOutboxStore();
    const delivered: OutboxEntry[] = [];
    const deliverFn = vi.fn(async (entry: OutboxEntry) => {
      delivered.push(entry);
      return { status: 'success' as const };
    });

    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, {
      hooks: {
        onBeforeDeliver: (entry) => ({ ...entry, data: { ...(entry.data as object), _modified: true } }),
      },
    });

    await adapter.applyEvent({ collection: 'items', op: 'add', data: { id: '2' } });

    expect(deliverFn).toHaveBeenCalled();
    expect((delivered[0].data as any)._modified).toBe(true);
    // Original entry data in outbox is NOT mutated
    // (entry was removed on success anyway)
  });

  it('onAfterDeliver is called with entry and result', async () => {
    const outbox = new InMemoryOutboxStore();
    const afterDeliver = vi.fn();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const, response: { ok: true } }));

    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, {
      hooks: {
        onAfterDeliver: afterDeliver,
      },
    });

    await adapter.applyEvent({ collection: 'items', op: 'add', data: { id: '3' } });

    expect(afterDeliver).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'items' }),
      expect.objectContaining({ status: 'success', response: { ok: true } })
    );
  });

  it('all hooks can be async', async () => {
    const outbox = new InMemoryOutboxStore();
    const log: string[] = [];

    const adapter = createSyncAdapter(outbox as any, { deliver: async () => ({ status: 'success' as const }) }, {
      hooks: {
        onEnqueue: async (entry) => { log.push('enqueue'); return entry; },
        onBeforeDeliver: async (entry) => { log.push('before'); return entry; },
        onAfterDeliver: async () => { log.push('after'); },
      },
    });

    await adapter.applyEvent({ collection: 'x', op: 'add', data: {} });

    expect(log).toEqual(['enqueue', 'before', 'after']);
  });
});
