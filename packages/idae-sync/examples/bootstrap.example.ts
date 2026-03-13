// bootstrap.example.ts
// Minimal bootstrap example showing how to initialize idae-sync in a browser app,
// demonstrate adapter ordering, and perform an atomic data+outbox transaction.

import { createIdbql, getIdbqlEvent } from 'idae-idbql';
import { initSync, IdaeApiDeliverer } from 'idae-sync';

async function bootstrap() {
  // Initialize idae-idbql (replace with your real schema)
  const idbql = await createIdbql({
    name: 'app-db',
    version: 1,
    schema: [
      { name: 'users', primaryKey: 'id', indexes: ['email'] },
    ],
  });

  // Access a collection (example)
  const users = idbql.collection('users');

  // Create a deliverer that maps outbox entries to your server API.
  // Replace apiClient with your configured idae-api client instance.
  const deliverer = new IdaeApiDeliverer({ apiClient: /* your idae-api client */ null as any });

  // Inspect current adapters (for demonstration). idbqlEvent exposes internal _adapters/_adapter.
  const ev = getIdbqlEvent() as any;
  console.log('Existing adapter(s):', ev._adapters ?? ev._adapter ?? null);

  // Start sync: registers sync adapter and starts background processing.
  // initSync preserves existing adapters and appends the SyncAdapter last, ensuring
  // deterministic ordering: existing adapters receive events first, then the sync adapter.
  const { stop, outbox } = initSync({ idbql, deliverer, intervalMs: 5000 });

  // Re-inspect adapter list after registration
  console.log('Adapters after initSync:', (getIdbqlEvent() as any)._adapters);

  // Perform a local write — this will enqueue an outbox entry and attempt delivery.
  await users.put({ id: 'u1', name: 'Alice' });

  // To apply a server-origin write without creating an outbox entry, pass { silent: true }
  // await users.put({ id: 'u2', name: 'Server' }, { silent: true });

  // Demonstrate atomic write: data + outbox entry in a single transaction.
  // This ensures the application state and the queued outbox entry are committed together.
  await idbql.transaction(async (tx: any) => {
    // data write uses the same transaction
    await users.put({ id: 'u_atomic', name: 'Atomic' }, { tx });

    // write the outbox record directly into the __outbox__ object store via the tx
    const outboxStore = tx.objectStore('__outbox__');
    const entry = {
      op: 'put',
      collection: 'users',
      data: { id: 'u_atomic', name: 'Atomic' },
      keyPath: 'id',
      createdAt: Date.now(),
      retryCount: 0,
    };
    outboxStore.add(entry);
  });

  console.log('Performed atomic data+outbox transaction');

  // Stop background sync when shutting down the app
  // stop();
}

bootstrap().catch(console.error);
