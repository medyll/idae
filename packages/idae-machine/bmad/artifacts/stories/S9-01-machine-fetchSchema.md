# S9-01 — machine.fetchSchema() — Async client init

**Sprint:** 9 — Client Async Init
**Status:** todo
**Effort:** L
**Depends on:** S8-01

## Goal
Replace `machine.init({ model: demoScheme })` with `await machine.fetchSchema(url)`.
Schema comes from server. Cache in IDB. Stale-while-revalidate offline support.

## New file: `src/lib/main/machineSchemaCache.ts`

```typescript
// IDB-based schema cache. Uses a dedicated object store '_schema'.
// Key = API URL. Value = { model: IdbqModel, fetchedAt: number }

const CACHE_STORE = '_idae_schema_cache';

export async function readSchemaCache(url: string): Promise<IdbqModel | null> {
  return new Promise((resolve) => {
    const req = indexedDB.open(CACHE_STORE, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('cache');
    req.onsuccess = () => {
      const tx  = req.result.transaction('cache', 'readonly');
      const get = tx.objectStore('cache').get(url);
      get.onsuccess = () => resolve(get.result?.model ?? null);
      get.onerror   = () => resolve(null);
    };
    req.onerror = () => resolve(null);
  });
}

export async function writeSchemaCache(url: string, model: IdbqModel): Promise<void> {
  return new Promise((resolve) => {
    const req = indexedDB.open(CACHE_STORE, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('cache');
    req.onsuccess = () => {
      const tx  = req.result.transaction('cache', 'readwrite');
      tx.objectStore('cache').put({ model, fetchedAt: Date.now() }, url);
      tx.oncomplete = () => resolve();
    };
    req.onerror = () => resolve();
  });
}
```

## Modify: `src/lib/main/machine.ts`

Add `fetchSchema()` method:

```typescript
import { readSchemaCache, writeSchemaCache } from './machineSchemaCache.js';

async fetchSchema(url: string): Promise<void> {
  // 1. Try cache first
  const cached = await readSchemaCache(url);

  if (cached) {
    // Serve stale immediately
    this._model = cached;
    this.start();

    // Refresh in background (fire and forget)
    this.#refreshSchemaInBackground(url);
    return;
  }

  // 2. No cache → blocking fetch (first boot)
  const model = await this.#fetchSchemaFromApi(url);
  await writeSchemaCache(url, model);
  this._model = model;
  this.start();
}

async #fetchSchemaFromApi(url: string): Promise<IdbqModel> {
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`Schema fetch failed: ${res.status}`);
  const data = await res.json();
  return data.model as IdbqModel;
}

async #refreshSchemaInBackground(url: string): Promise<void> {
  try {
    const model = await this.#fetchSchemaFromApi(url);
    await writeSchemaCache(url, model);
    // Emit event so app can soft-reload if schema changed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('idae:schema:updated', { detail: { model } }));
    }
  } catch {
    // Silent — background refresh, not critical
  }
}
```

## Modify: `src/routes/+page.svelte`

```svelte
<script>
  import { machine } from '$lib/main/machine.js';

  // Before:
  // import { demoScheme } from '$lib/demo/demoScheme.js';
  // machine.init({ dbName: 'demo-db', version: 1, model: demoScheme });
  // machine.start();

  // After:
  machine.init({ org: 'test', domain: 'machine' });
  await machine.fetchSchema('http://localhost:3000/api/scheme');
  // machine.start() called inside fetchSchema
</script>
```

## Offline behavior
- First boot without server → throws (no cache, no fallback) — acceptable
- Subsequent boots → cached schema, background refresh
- Schema change → `idae:schema:updated` event → optional app reload

## Tests
- Mock `fetch` to return demoScheme JSON → `machine._model` populated
- Second call → cache hit → no fetch → `start()` called immediately
- Fetch failure with cache → uses cache, no throw

## Done when
- `+page.svelte` imports NO demoScheme
- `machine.fetchSchema()` populates model from API
- IDB cache survives page reload
- Offline: cached schema boots machine without network
