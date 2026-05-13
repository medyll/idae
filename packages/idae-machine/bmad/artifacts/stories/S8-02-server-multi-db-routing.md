# S8-02 — Server Multi-DB Routing for data endpoints

**Sprint:** 8 — Server Schema Delivery
**Status:** todo
**Effort:** M
**Depends on:** S7-01, S6-01

## Goal
`/api/data/:table` routes to the correct MongoDB database per collection,
using `appscheme.base` to compute `{org}_{base}`.
Replaces current single-DB routing.

## New file: `server/src/middleware/dbRouter.ts`

```typescript
import mongoose from 'mongoose';
import { config } from '../config.js';

// Cache: collectionName → dbName
const dbCache = new Map<string, string>();

export async function resolveDb(collectionName: string): Promise<{
  db: mongoose.Connection;
  dbName: string;
} | null> {
  // Check cache
  if (dbCache.has(collectionName)) {
    const dbName = dbCache.get(collectionName)!;
    return { db: mongoose.connection.useDb(dbName, { useCache: true }), dbName };
  }

  // Lookup appscheme
  const metaDb = mongoose.connection.useDb(`${config.org}_machine_app`, { useCache: true });
  const scheme = await metaDb.collection('appscheme').findOne({ code: collectionName });
  if (!scheme) return null;

  const dbName = `${config.org}_${scheme.base}`;
  dbCache.set(collectionName, dbName);

  return { db: mongoose.connection.useDb(dbName, { useCache: true }), dbName };
}

// Call when schema changes (after bootstrap)
export function clearDbCache() { dbCache.clear(); }
```

## Modify: `server/src/routes/data.ts`

Replace `mongoose.connection.collection(table)` with:
```typescript
const resolved = await resolveDb(table);
if (!resolved) return res.status(404).json({ error: `Unknown collection: ${table}` });
const col = resolved.db.collection(table);
// ... use col for CRUD
```

## Tests
- `GET /api/data/vehicle` → hits `test_machine_base.vehicle`
- `GET /api/data/nonexistent` → 404
- After schema change: `clearDbCache()` → next request re-resolves

## Done when
- Vehicle data CRUD uses `test_machine_base` not `idae_machine`
- Unknown collection returns 404 not DB error
