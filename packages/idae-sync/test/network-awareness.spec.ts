import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';
import type { IDeliverer } from '../src/lib/deliverer/IDeliverer';
import type { SyncEvent } from '../src/lib/SyncMode';

describe('Network Awareness', () => {
  let originalWindow: typeof global.window | undefined;
  let onlineHandlers: Array<() => void>;
  let offlineHandlers: Array<() => void>;

  function setNavigatorOnline(value: boolean) {
    Object.defineProperty(global, 'navigator', {
      value: { onLine: value },
      writable: true,
      configurable: true,
    });
  }

  beforeEach(() => {
    onlineHandlers = [];
    offlineHandlers = [];
    (global as any).window = {
      addEventListener: (event: string, handler: () => void) => {
        if (event === 'online') onlineHandlers.push(handler);
        if (event === 'offline') offlineHandlers.push(handler);
      },
      removeEventListener: () => {},
    };
    setNavigatorOnline(true);
  });

  afterEach(() => {
    delete (global as any).window;
    delete (global as any).navigator;
  });

  it('emits network-offline event when offline handler fires', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, { intervalMs: 100 });

    const events: SyncEvent[] = [];
    adapter.onSyncEvent(e => events.push(e));

    adapter.start();

    // Simulate going offline
    for (const h of offlineHandlers) h();

    expect(events.some(e => e.type === 'network-offline')).toBe(true);

    adapter.stop();
  });

  it('emits network-online and triggers flush when online', async () => {
    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, { intervalMs: 100 });

    const events: SyncEvent[] = [];
    adapter.onSyncEvent(e => events.push(e));

    adapter.start();

    // Queue an entry while offline
    await adapter.applyEvent({ collection: 'items', op: 'add', data: { id: '1' } });

    // Simulate coming back online
    for (const h of onlineHandlers) h();

    // Allow microtasks to flush
    await new Promise(r => setTimeout(r, 10));

    expect(events.some(e => e.type === 'network-online')).toBe(true);
    // Delivery should have been attempted (deliverFn called)
    expect(deliverFn).toHaveBeenCalled();

    adapter.stop();
  });

  it('starts paused if navigator.onLine is false', async () => {
    setNavigatorOnline(false);

    const outbox = new InMemoryOutboxStore();
    const deliverFn = vi.fn(async () => ({ status: 'success' as const }));
    const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, { intervalMs: 10 });

    const debugLogs: string[] = [];
    const debugAdapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, {
      intervalMs: 10,
      debug: (msg) => debugLogs.push(msg),
    });

    debugAdapter.start();
    await new Promise(r => setTimeout(r, 20));

    expect(debugLogs.some(l => l.includes('offline'))).toBe(true);
    debugAdapter.stop();
  });
});
