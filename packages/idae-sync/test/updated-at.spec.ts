import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { OutboxStore } from '../src/lib/outbox/OutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';

describe('updated_at propagation', () => {
  it('sets updated_at when missing', async () => {
    const outbox = new OutboxStore('test-updated-at-1', 1);
    const adapter = createSyncAdapter(outbox);
    const event = { collection: 'users', op: 'put', data: { id: 'u1', name: 'Alice' } } as any;
    await adapter.applyEvent(event);
    const list = await outbox.list();
    const e = list.find((en) => en.data?.id === 'u1');
    expect(e).toBeDefined();
    expect(e!.data.updated_at).toBeTruthy();
  });

  it('does not modify existing updated_at', async () => {
    const outbox = new OutboxStore('test-updated-at-2', 1);
    const adapter = createSyncAdapter(outbox);
    const existing = '2020-01-01T00:00:00.000Z';
    const event = { collection: 'users', op: 'put', data: { id: 'u2', updated_at: existing } } as any;
    await adapter.applyEvent(event);
    const list = await outbox.list();
    const e = list.find((en) => en.data?.id === 'u2');
    expect(e).toBeDefined();
    expect(e!.data.updated_at).toBe(existing);
  });
});
