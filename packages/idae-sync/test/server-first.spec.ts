import { describe, it, expect, vi } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';
import type { IDeliverer } from '../src/lib/deliverer/IDeliverer';

describe('server-first mode via SyncAdapter', () => {
  function makeDeliverer(fn: IDeliverer['deliver']): IDeliverer {
    return { deliver: fn };
  }

  it('server-first: success removes entry and emits delivered', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const, response: { id: 'srv-1' } }));
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      mode: 'server-first',
    });

    const events: any[] = [];
    adapter.onSyncEvent(e => events.push(e));

    await adapter.applyEvent({ collection: 'orders', op: 'add', data: { name: 'test' } });

    expect(deliverFn).toHaveBeenCalled();
    const remaining = await outbox.list();
    expect(remaining.length).toBe(0);
    expect(events).toEqual([
      expect.objectContaining({ type: 'delivered', collection: 'orders' }),
    ]);
  });

  it('server-first: permanent rejection removes entry and emits rollback', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'permanent' as const, response: { error: 'forbidden' } }));
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      mode: 'server-first',
    });

    const events: any[] = [];
    adapter.onSyncEvent(e => events.push(e));

    await adapter.applyEvent({ collection: 'orders', op: 'add', data: { name: 'bad' } });

    const remaining = await outbox.list();
    expect(remaining.length).toBe(0);
    expect(events).toEqual([
      expect.objectContaining({ type: 'rollback', collection: 'orders', reason: { error: 'forbidden' } }),
    ]);
  });

  it('server-first: transient failure keeps entry in outbox and emits fallback', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'retry' as const }));
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      mode: 'server-first',
    });

    const events: any[] = [];
    adapter.onSyncEvent(e => events.push(e));

    await adapter.applyEvent({ collection: 'orders', op: 'add', data: { name: 'test' } });

    const remaining = await outbox.list();
    expect(remaining.length).toBe(1);
    expect(remaining[0].meta.retryCount).toBe(1);
    expect(events).toEqual([
      expect.objectContaining({ type: 'fallback', fallbackMode: 'mobile-first' }),
    ]);
  });

  it('server-first: network error falls back to mobile-first', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => { throw new Error('network down'); });
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      mode: 'server-first',
    });

    const events: any[] = [];
    adapter.onSyncEvent(e => events.push(e));

    await adapter.applyEvent({ collection: 'orders', op: 'add', data: { name: 'test' } });

    const remaining = await outbox.list();
    expect(remaining.length).toBe(1);
    expect(events[0].type).toBe('fallback');
    expect(events[0].fallbackMode).toBe('mobile-first');
  });

  it('mobile-first collection ignores server-first global', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      mode: 'server-first',
      collectionModes: { drafts: 'mobile-first' },
    });

    // drafts uses mobile-first path
    await adapter.applyEvent({ collection: 'drafts', op: 'add', data: { title: 'draft' } });
    expect(deliverFn).toHaveBeenCalled();
    // Entry removed on success (mobile-first immediate delivery)
    const remaining = await outbox.list();
    expect(remaining.length).toBe(0);
  });

  it('runtime mode switching works', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn));

    expect(adapter.getMode()).toBe('mobile-first');
    adapter.setMode('server-first');
    expect(adapter.getMode()).toBe('server-first');

    adapter.setCollectionMode('drafts', 'mobile-first');
    expect(adapter.getCollectionMode('drafts')).toBe('mobile-first');
    expect(adapter.getCollectionMode('orders')).toBe('server-first');
  });
});
