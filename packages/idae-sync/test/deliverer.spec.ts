import { describe, it, expect, vi } from 'vitest';
import { OutboxDeliverer } from '../src/lib/Deliverer';
import type { OutboxEntry } from '../src/lib/outbox/OutboxStore';

class InMemoryOutboxStore {
  entries: OutboxEntry[] = [];
  removed: string[] = [];
  updated: OutboxEntry[] = [];
  constructor(entries: OutboxEntry[] = []) { this.entries = entries.map(e=>({...e})); }
  async list(limit = 100) { return this.entries.slice(0, limit); }
  async remove(id: string) { this.removed.push(id); this.entries = this.entries.filter(e=>e.id!==id); }
  async update(entry: OutboxEntry) { const idx = this.entries.findIndex(e=>e.id===entry.id); if (idx>=0) this.entries[idx] = {...entry}; this.updated.push(entry); }
}

describe('OutboxDeliverer.processOnce', () => {
  it('acks and applies remote on success', async () => {
    const entry: OutboxEntry = { id: '1', collection: 'c', op: 'add', data: {a:1}, meta: { retryCount: 0, createdAt: new Date().toISOString() } };
    const store = new InMemoryOutboxStore([entry]);
    const applyRemote = vi.fn();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const, response: { ok: true } }));

    const d = new OutboxDeliverer(store as any);
    await d.processOnce({ deliver: deliverFn, applyRemote });

    expect(store.removed).toContain('1');
    expect(applyRemote).toHaveBeenCalledWith({ ok: true });
  });

  it('updates retry meta on retry', async () => {
    const entry: OutboxEntry = { id: '2', collection: 'c', op: 'put', data: {b:2}, meta: { retryCount: 0, createdAt: new Date().toISOString() } };
    const store = new InMemoryOutboxStore([entry]);
    const deliverFn = vi.fn(async () => ({ status: 'retry' as const }));
    const d = new OutboxDeliverer(store as any, { backoffBaseMs: 10 });

    await d.processOnce({ deliver: deliverFn });

    expect(store.updated.length).toBeGreaterThan(0);
    const updated = store.updated[store.updated.length-1];
    expect(updated.meta).toBeDefined();
    expect(updated.meta.retryCount).toBe(1);
    expect(updated.meta.nextAttempt).toBeDefined();
  });

  it('marks failed on permanent', async () => {
    const entry: OutboxEntry = { id: '3', collection: 'c', op: 'delete', data: null, meta: { retryCount: 0, createdAt: new Date().toISOString() } };
    const store = new InMemoryOutboxStore([entry]);
    const deliverFn = vi.fn(async () => ({ status: 'permanent' as const, response: 'oops' }));
    const d = new OutboxDeliverer(store as any);

    await d.processOnce({ deliver: deliverFn });

    expect(store.updated.length).toBeGreaterThan(0);
    const updated = store.updated[store.updated.length-1];
    expect(updated.meta.failed).toBeTruthy();
    expect(updated.meta.failureReason).toBe('oops');
  });
});
