import { describe, it, expect, vi } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';
import type { IDeliverer } from '../src/lib/deliverer/IDeliverer';

describe('Dead Letter Queue', () => {
  function makeDeliverer(fn: IDeliverer['deliver']): IDeliverer {
    return { deliver: fn };
  }

  it('moves entry to DLQ after maxRetries exceeded', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'retry' as const }));
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(deliverFn), {
      maxRetries: 2,
    });

    const events: any[] = [];
    adapter.onSyncEvent(e => events.push(e));

    await adapter.applyEvent({ collection: 'orders', op: 'add', data: { id: '1' } });

    // Entry is in outbox with retryCount=1 after first applyEvent
    let entries = await outbox.list();
    expect(entries.length).toBe(1);

    // Manually increment retryCount to simulate background retries
    const entry = entries[0];
    entry.meta.retryCount = 2; // at maxRetries
    await outbox.update(entry);

    // Next processPending call: retry → exceeds maxRetries → DLQ
    const processPendingResult = await adapter.processOnce();
    const remaining = await outbox.list();
    expect(remaining.length).toBe(0);

    const dlq = await outbox.listDlq();
    expect(dlq.length).toBe(1);
    expect(dlq[0].meta.failureReason).toBe('max-retries');

    const dlqEvent = events.find(e => e.type === 'dead-letter');
    expect(dlqEvent).toBeDefined();
    expect(dlqEvent.collection).toBe('orders');
  });

  it('replayDlq moves entry back to outbox with reset retryCount', async () => {
    const outbox = new InMemoryOutboxStore();
    const adapter = createSyncAdapter(outbox as any, makeDeliverer(async () => ({ status: 'retry' as const })), {
      maxRetries: 1,
    });

    // Enqueue directly to bypass immediate delivery
    await outbox.enqueue({ id: 'dlq-r1', collection: 'items', op: 'add', data: { id: '2' }, meta: { retryCount: 1, createdAt: new Date().toISOString() } });
    await adapter.processOnce(); // → DLQ

    const dlq = await outbox.listDlq();
    expect(dlq.length).toBe(1);

    await outbox.replayDlq(dlq[0].id);

    const dlqAfter = await outbox.listDlq();
    expect(dlqAfter.length).toBe(0);

    const outboxAfter = await outbox.list();
    expect(outboxAfter.length).toBe(1);
    expect(outboxAfter[0].meta.retryCount).toBe(0);
    expect(outboxAfter[0].meta.failed).toBeFalsy();
  });

  it('clearDlq empties the dead letter queue', async () => {
    const outbox = new InMemoryOutboxStore();
    await outbox.enqueue({ id: 'dlq-1', collection: 'c', op: 'add', meta: { retryCount: 99, createdAt: new Date().toISOString() } });
    await outbox.moveToDlq('dlq-1', 'test');

    await outbox.clearDlq();
    const dlq = await outbox.listDlq();
    expect(dlq.length).toBe(0);
  });
});
