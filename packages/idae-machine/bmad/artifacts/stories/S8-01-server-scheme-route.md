# S8-01 — GET /api/scheme → IdbqModel JSON

**Sprint:** 8 — Server Schema Delivery
**Status:** todo
**Effort:** M
**Depends on:** S7-01

## Goal
Server reads `appscheme_*` from MongoDB → reconstructs IdbqModel-compatible JSON → returns to client.
This replaces the hardcoded `testScheme.ts` on the client.

## Modify: `server/src/routes/scheme.ts`

Current: returns hardcoded or empty schema.
Target: reads from `{org}_machine_app` and builds IdbqModel JSON.

```typescript
export function registerSchemeRoutes() {
  // GET /api/scheme — full model as IdbqModel JSON
  idaeApi.get('/api/scheme', async (req, res) => {
    const org    = config.org;
    const metaDb = mongoose.connection.useDb(`${org}_machine_app`, { useCache: true });

    const [bases, schemes, fields] = await Promise.all([
      metaDb.collection('appscheme_base').find().toArray(),
      metaDb.collection('appscheme').find().toArray(),
      metaDb.collection('appscheme_field').find().toArray(),
    ]);

    const model: Record<string, any> = {};

    for (const scheme of schemes) {
      const collFields = fields.filter(f => f.collection === scheme.code);
      const fieldsMap: Record<string, any> = {};
      for (const f of collFields) {
        fieldsMap[f.name] = { type: f.type, required: f.required, readonly: f.readonly, private: f.private };
      }

      model[scheme.code] = {
        keyPath:  '++id',
        base:     scheme.base,
        model:    {},
        ts:       {},
        template: {
          index:        scheme.index,
          presentation: scheme.presentation,
          fields:       fieldsMap,
          fks:          scheme.fks ?? {}
        }
      };
    }

    res.json({ ok: true, model, org });
  });

  // GET /api/scheme/:table — single collection schema
  idaeApi.get('/api/scheme/:table', async (req, res) => {
    const org    = config.org;
    const table  = req.params.table;
    const metaDb = mongoose.connection.useDb(`${org}_machine_app`, { useCache: true });

    const scheme = await metaDb.collection('appscheme').findOne({ code: table });
    if (!scheme) return res.status(404).json({ error: 'Collection not found' });

    const fields = await metaDb.collection('appscheme_field').find({ collection: table }).toArray();
    const fieldsMap: Record<string, any> = {};
    for (const f of fields) {
      fieldsMap[f.name] = { type: f.type, required: f.required, readonly: f.readonly, private: f.private };
    }

    res.json({
      ok: true,
      collection: {
        keyPath: '++id', base: scheme.base, model: {}, ts: {},
        template: { index: scheme.index, presentation: scheme.presentation, fields: fieldsMap, fks: scheme.fks ?? {} }
      }
    });
  });
}
```

## Tests
- After seed (S7-01): `GET /api/scheme` → 200 + `{ model: { vehicle: {...}, category: {...}, ... } }`
- `GET /api/scheme/vehicle` → 200 + single collection
- `GET /api/scheme/nonexistent` → 404

## Done when
- Client can `fetch('/api/scheme')` and get a valid IdbqModel JSON
- All 6 collections from testScheme are returned
- Fields include type, required, readonly
