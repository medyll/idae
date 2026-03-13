import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { OutboxStore } from '../src/lib/outbox/OutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';

describe('SyncAdapter', () => {
  it('applies event and deliverer consumes entry', async () => {
    const outbox = new OutboxStore('test-sync-db', 1);
    const delivered: any[] = [];
    const deliverer = async (entry: any) => {
      delivered.push(entry);
      return true;
    };

    const adapter = createSyncAdapter(outbox, deliverer, 100);

    const event = { collection: 'users', op: 'put', data: { id: 's1', name: 'Server' }, keyPath: 'id' } as any;
    await adapter.applyEvent(event);

    // allow immediate delivery to run
    await new Promise((r) => setTimeout(r, 50));

    expect(delivered.length).toBeGreaterThan(0);
    const list = await outbox.list();
    expect(list.find((e) => e.data?.id === 's1')).toBeUndefined();
  });
});
