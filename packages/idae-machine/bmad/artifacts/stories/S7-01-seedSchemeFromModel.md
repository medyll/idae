# S7-01 — seedSchemeFromModel (server bootstrap)

**Sprint:** 7 — Bootstrap
**Status:** todo
**Effort:** M
**Depends on:** S6-01

## Goal
One-shot function: takes `IdbqModel` (e.g. testScheme) → writes to MongoDB
`{org}_machine_app` database → `appscheme_base`, `appscheme`, `appscheme_field`.
Idempotent (upsert by code). Safe to re-run.

## New file: `server/src/bootstrap/seedSchemeFromModel.ts`

```typescript
import type { IdbqModel } from '@medyll/idae-idbql';
import mongoose from 'mongoose';

export async function seedSchemeFromModel(
  model: IdbqModel,
  opts: { org: string }
): Promise<{ bases: number; collections: number; fields: number }> {
  const metaDb = mongoose.connection.useDb(`${opts.org}_machine_app`, { useCache: true });

  const BaseColl   = metaDb.collection('appscheme_base');
  const SchemeColl = metaDb.collection('appscheme');
  const FieldColl  = metaDb.collection('appscheme_field');

  const bases = new Set<string>();
  let collCount = 0;
  let fieldCount = 0;

  for (const [collectionName, collModel] of Object.entries(model)) {
    const base = (collModel as any).base as string ?? 'machine_base';
    const tpl  = (collModel as any).template;
    bases.add(base);

    // Upsert appscheme
    await SchemeColl.updateOne(
      { code: collectionName },
      { $set: {
          code:         collectionName,
          base:         base,
          index:        tpl.index,
          presentation: tpl.presentation,
          updatedAt:    new Date()
        }
      },
      { upsert: true }
    );
    collCount++;

    // Upsert appscheme_field per field
    for (const [fieldName, fieldRule] of Object.entries(tpl.fields ?? {})) {
      const rule = fieldRule as any;
      await FieldColl.updateOne(
        { collection: collectionName, name: fieldName },
        { $set: {
            collection: collectionName,
            name:       fieldName,
            type:       rule?.type ?? rule,
            required:   rule?.required ?? false,
            readonly:   rule?.readonly ?? false,
            private:    rule?.private  ?? false,
            updatedAt:  new Date()
          }
        },
        { upsert: true }
      );
      fieldCount++;
    }

    // Upsert fks in appscheme
    if (tpl.fks) {
      await SchemeColl.updateOne(
        { code: collectionName },
        { $set: { fks: tpl.fks } }
      );
    }
  }

  // Upsert appscheme_base entries
  for (const base of bases) {
    await BaseColl.updateOne(
      { code: base },
      { $set: { code: base, name: base, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  return { bases: bases.size, collections: collCount, fields: fieldCount };
}
```

## New file: `server/src/bootstrap/seed.ts` (CLI)

```typescript
// CLI: tsx server/src/bootstrap/seed.ts
import mongoose from 'mongoose';
import { config } from '../config.js';
import { testScheme } from '../../../src/lib/demo/testScheme.js';  // dev only
import { seedSchemeFromModel } from './seedSchemeFromModel.js';

await mongoose.connect(config.mongodbUri);
const result = await seedSchemeFromModel(testScheme as any, { org: config.org });
console.log('Seeded:', result);
await mongoose.disconnect();
```

## New route: `server/src/routes/bootstrap.ts`

```typescript
// POST /api/bootstrap — dev only
import { idaeApi } from '@medyll/idae-api';
import { config } from '../config.js';
import { seedSchemeFromModel } from '../bootstrap/seedSchemeFromModel.js';

export function registerBootstrapRoute() {
  if (config.nodeEnv !== 'development') return;
  idaeApi.post('/api/bootstrap', async (req, res) => {
    const model = req.body.model;  // IdbqModel JSON
    const result = await seedSchemeFromModel(model, { org: config.org });
    res.json({ ok: true, ...result });
  });
}
```

## Tests
- `POST /api/bootstrap` with testScheme JSON → 200 + { bases: 1, collections: 6, fields: ~35 }
- Re-run → same result (idempotent, no duplicates)
- In prod (`NODE_ENV=production`) → route not registered → 404

## Done when
- `tsx server/src/bootstrap/seed.ts` runs without error
- MongoDB `test_machine_app` has: appscheme_base (1 doc), appscheme (6 docs), appscheme_field (~35 docs)
- Re-run is safe (no duplicates)
