// bootstrap.example.ts
// Minimal bootstrap example showing how to initialize idae-sync in a browser app.

import { createIdbql } from 'idae-idbql';
import { initSync, IdaeApiDeliverer } from 'idae-sync';

async function bootstrap() {
  // Initialize idae-idbql (replace with your real schema)
  const idbql = await createIdbql({
    name: 'app-db',
    version: 1,
    schema: [
      // { name: 'users', primaryKey: 'id', indexes: ['email'] },
    ],
  });

  // Access a collection (example)
  const users = idbql.collection('users');

  // Create a deliverer that maps outbox entries to your server API.
  // Replace apiClient with your configured idae-api client instance.
  const deliverer = new IdaeApiDeliverer({ apiClient: /* your idae-api client */ null as any });

  // Start sync: registers sync adapter and starts background processing.
  const { stop } = initSync({ idbql, deliverer, pollIntervalMs: 5000 });

  // Perform a local write — this will enqueue an outbox entry and attempt delivery.
  await users.put({ id: 'u1', name: 'Alice' });

  // To apply a server-origin write without creating an outbox entry, pass { silent: true }
  // await users.put({ id: 'u2', name: 'Server' }, { silent: true });

  // If you need atomic writes (data + outbox), use a transaction provided by idbql core:
  // await idbql.transaction(async (tx) => {
  //   await users.put({ id: 'u3', name: 'Atomic' }, { tx });
  //   // write outbox entry into tx.objectStore('__outbox__') so both changes are atomic
  // });

  // Stop background sync when shutting down the app
  // stop();
}

bootstrap().catch(console.error);
