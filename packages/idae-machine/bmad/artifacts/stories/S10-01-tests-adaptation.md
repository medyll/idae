# S10-01 — Tests Adaptation + demoScheme relocation

**Sprint:** 10 — Cleanup
**Status:** todo
**Effort:** M
**Depends on:** S9-01

## Goal
Tests still use `new MachineDb(demoScheme)` directly — that's fine for unit tests
(MachineDb interface unchanged). But `+page.svelte` and integration tests need adaptation.
Also: move demoScheme to `src/lib/bootstrap/` to signal it's not prod code.

## Changes

### Move demoScheme
```
src/lib/demo/demoScheme.ts  →  src/lib/bootstrap/demoScheme.ts
src/lib/demo/demoInit.ts    →  src/lib/bootstrap/demoInit.ts
src/lib/demo/seedData.ts    →  src/lib/bootstrap/seedData.ts
```

Update all imports accordingly.

### Unit tests — unchanged
`new MachineDb(demoScheme)` is still valid. MachineDb interface didn't change.
Only the source of the model changes (wire vs static). Tests stay green.

### Add: schema fetch mock helper
```typescript
// src/lib/main/__tests__/helpers/mockSchemaFetch.ts
import { demoScheme } from '../../bootstrap/demoScheme.js';

export function mockSchemaFetch() {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true, model: demoScheme, org: 'test' })
  });
}
```

### Add: machine.fetchSchema test
```typescript
// src/lib/main/__tests__/machineFetchSchema.test.ts
import { mockSchemaFetch } from './helpers/mockSchemaFetch.js';
import { Machine } from '../machine.js';

it('fetchSchema populates model from API', async () => {
  mockSchemaFetch();
  const m = new Machine();
  m.init({ org: 'test', domain: 'machine' });
  await m.fetchSchema('http://localhost:3000/api/scheme');
  expect(m._model).toBeDefined();
  expect(Object.keys(m._model!)).toContain('vehicle');
});
```

### Add: bootstrap server integration test
```typescript
// server/src/__tests__/bootstrap.test.ts
it('POST /api/bootstrap seeds appscheme_*', async () => {
  const res = await request(app).post('/api/bootstrap').send({ model: demoScheme });
  expect(res.status).toBe(200);
  expect(res.body.collections).toBe(6);
  expect(res.body.fields).toBeGreaterThan(30);
});

it('bootstrap is idempotent', async () => {
  await request(app).post('/api/bootstrap').send({ model: demoScheme });
  const res = await request(app).post('/api/bootstrap').send({ model: demoScheme });
  expect(res.status).toBe(200);
  // Count unchanged
});
```

## Done when
- `pnpm vitest run` → 15+/15 tests pass
- No import of `demoScheme` in `src/routes/+page.svelte`
- demoScheme lives in `src/lib/bootstrap/`
- `machineSchemaCache` has tests for read/write
