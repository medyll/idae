import { describe, it, expect, vi } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';
import type { IDeliverer } from '../src/lib/deliverer/IDeliverer';
import type { SyncEvent } from '../src/lib/SyncMode';

describe('Fallback: server-first → mobile-first on network failure', () => {
  function makeDeliverer(fn: IDeliverer['deliver']): IDeliverer {
    return { deliver: fn };
  }

  it('network error: entry stays in outbox for background retry', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => { throw new Error('ECONNREFUSED'); });
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      mode: 'server-first',
    });

    const events: SyncEvent[] = [];
    adapter.onSyncEvent(e => events.push(e));

    await adapter.applyEvent({ collection: 'users', op: 'put', data: { id: '1', name: 'test' }, key: '1' });

    // Entry persists in outbox for retry
    const entries = await outbox.list();
    expect(entries.length).toBe(1);
    expect(entries[0].meta.retryCount).toBe(1);
    expect(entries[0].meta.lastAttempt).toBeDefined();

    // Fallback event emitted
    expect(events.length).toBe(1);
    expect(events[0].type).toBe('fallback');
    expect(events[0].fallbackMode).toBe('mobile-first');
  });

  it('after fallback, background processPending can succeed later', async () => {
    const outbox = new InMemoryOutboxStore();
    let callCount = 0;
    const deliverFn = vi.fn(async () => {
      callCount++;
      if (callCount === 1) throw new Error('timeout');
      return { status: 'success' as const, response: { ok: true } };
    });
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      mode: 'server-first',
    });

    // First call: server-first → fallback
    await adapter.applyEvent({ collection: 'items', op: 'add', data: { id: '2' } });
    let entries = await outbox.list();
    expect(entries.length).toBe(1);

    // Simulate background poll — processOnce picks up the entry
    await adapter.processOnce();
    entries = await outbox.list();
    expect(entries.length).toBe(0); // success on retry
  });

  it('onSyncEvent handler can be unsubscribed', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      mode: 'server-first',
    });

    const events: SyncEvent[] = [];
    const unsub = adapter.onSyncEvent(e => events.push(e));

    await adapter.applyEvent({ collection: 'a', op: 'add', data: {} });
    expect(events.length).toBe(1);

    unsub();
    await adapter.applyEvent({ collection: 'b', op: 'add', data: {} });
    expect(events.length).toBe(1); // no new event after unsub
  });
});
