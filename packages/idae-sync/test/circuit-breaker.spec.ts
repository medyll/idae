import { describe, it, expect, vi } from 'vitest';
import { CircuitBreaker } from '../src/lib/CircuitBreaker';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';

describe('CircuitBreaker unit', () => {
  it('starts closed', () => {
    const cb = new CircuitBreaker();
    expect(cb.isOpen('orders')).toBe(false);
    expect(cb.getState('orders')).toBe('closed');
  });

  it('opens after failureThreshold consecutive failures', () => {
    const cb = new CircuitBreaker({ failureThreshold: 3 });
    cb.recordFailure('orders');
    cb.recordFailure('orders');
    expect(cb.isOpen('orders')).toBe(false);
    cb.recordFailure('orders');
    expect(cb.isOpen('orders')).toBe(true);
    expect(cb.getState('orders')).toBe('open');
  });

  it('resets on success', () => {
    const cb = new CircuitBreaker({ failureThreshold: 2 });
    cb.recordFailure('orders');
    cb.recordSuccess('orders');
    cb.recordFailure('orders');
    expect(cb.isOpen('orders')).toBe(false); // reset counter
  });

  it('becomes half-open after resetTimeoutMs', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 10 });
    cb.recordFailure('orders');
    expect(cb.isOpen('orders')).toBe(true);
    await new Promise(r => setTimeout(r, 15));
    expect(cb.getState('orders')).toBe('half-open');
    expect(cb.isOpen('orders')).toBe(false); // half-open allows probe
  });

  it('reset() clears all state', () => {
    const cb = new CircuitBreaker({ failureThreshold: 1 });
    cb.recordFailure('orders');
    cb.reset();
    expect(cb.isOpen('orders')).toBe(false);
  });

  it('getStatus() returns per-collection state', () => {
    const cb = new CircuitBreaker({ failureThreshold: 3 });
    cb.recordFailure('orders');
    cb.recordFailure('orders');
    const status = cb.getStatus();
    expect(status['orders'].failures).toBe(2);
    expect(status['orders'].state).toBe('closed');
  });
});

describe('CircuitBreaker integration with SyncAdapter', () => {
  it('skips delivery when circuit is open', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'retry' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, {
      circuitBreaker: { failureThreshold: 2 },
    });

    // Queue 3 entries
    for (let i = 0; i < 3; i++) {
      await outbox.enqueue({ id: `e${i}`, collection: 'orders', op: 'add', data: {}, meta: { retryCount: 0, createdAt: new Date().toISOString() } });
    }

    // processOnce: 2 retries → circuit opens
    await adapter.processOnce(); // e0 → retry (failure 1)
    await adapter.processOnce(); // e1 → retry (failure 2) → circuit OPENS

    const callsBefore = deliverFn.mock.calls.length;

    // Next call: circuit is open → should skip
    await adapter.processOnce();
    expect(deliverFn.mock.calls.length).toBe(callsBefore); // no new call
  });
});
