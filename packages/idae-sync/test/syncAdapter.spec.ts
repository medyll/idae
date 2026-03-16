import { describe, it, expect } from 'vitest';
import type { OutboxEntry } from '../src/lib/outbox/OutboxStore';
import { createSyncAdapter, IdbqlEventPayload } from '../src/lib/SyncAdapter';

class InMemoryOutbox {
  entries: OutboxEntry[] = [];
  async enqueue(e: OutboxEntry) { this.entries.push(e); }
  async list(limit = 100) { return this.entries.slice(0, limit); }
  async update(e: OutboxEntry) { const idx = this.entries.findIndex(x=>x.id===e.id); if (idx>=0) this.entries[idx]=e; }
  async remove(id: string) { this.entries = this.entries.filter(x=>x.id!==id); }
}

describe('SyncAdapter (outbox-backed)', () => {
  it('handleEvent enqueues local non-silent events', async () => {
    const outbox = new InMemoryOutbox();
    const deliverer = { deliver: async () => ({ status: 'retry' as const }) };
    const adapter = createSyncAdapter(outbox as any, deliverer);

    const payload: IdbqlEventPayload = { collection: 'books', op: 'add', data: {title:'A'}, source: 'local' };
    await adapter.handleEvent(payload);
    expect(outbox.entries.length).toBe(1);
    expect(outbox.entries[0].meta?.createdAt).toBeDefined();
  });

  it('processOnce handles success and removes entry', async () => {
    const outbox = new InMemoryOutbox();
    const entry: OutboxEntry = { id: '1', collection: 'c', op: 'add', data: {x:1}, meta: { retryCount:0, createdAt: new Date().toISOString() } };
    outbox.entries.push(entry);

    const deliverer = { deliver: async () => ({ status: 'success' as const, response: { id: 'srv-1' } }) };
    const adapter = createSyncAdapter(outbox as any, deliverer);

    await adapter.processOnce();
    expect(outbox.entries.length).toBe(0);
  });

  it('processOnce handles retry by incrementing retryCount and keeping entry', async () => {
    const outbox = new InMemoryOutbox();
    const entry: OutboxEntry = { id: '2', collection: 'c', op: 'add', data: {x:2}, meta: { retryCount:0, createdAt: new Date().toISOString() } };
    outbox.entries.push(entry);
    const deliverer = { deliver: async () => ({ status: 'retry' as const }) };
    const adapter = createSyncAdapter(outbox as any, deliverer);
    await adapter.processOnce();
    expect(outbox.entries.length).toBe(1);
    expect(outbox.entries[0].meta?.retryCount).toBe(1);
  });

  it('processOnce handles permanent failure by marking failed in meta', async () => {
    const outbox = new InMemoryOutbox();
    const entry: OutboxEntry = { id: '3', collection: 'c', op: 'add', data: {x:3}, meta: { retryCount:0, createdAt: new Date().toISOString() } };
    outbox.entries.push(entry);
    const deliverer = { deliver: async () => ({ status: 'permanent' as const }) };
    const adapter = createSyncAdapter(outbox as any, deliverer);
    await adapter.processOnce();
    expect(outbox.entries.length).toBe(1);
    expect((outbox.entries[0].meta as any).failed).toBe(true);
  });
});
