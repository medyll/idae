# Test Results — Sprint 30

**Date:** 2026-05-22
**Sprint:** S30 — machine.init({ core, business }) + seed unifié
**Result:** ✅ PASS

## Test run

```
Test Files  38 passed (38)
Tests       455 passed (455)
Duration    3.54s
```

## Stories verified

- S30-01: machine.init({ core, business }) — model → core + business, shim @deprecated ✅
- S30-02: buildEffectiveModel(core?, business?) — fusion system + core + business ✅
- S30-03: seed() + seedIfEmpty() — machineSeed.ts créé et exporté ✅
- S30-04: +layout.svelte → machine.init({ business: demoScheme }) ✅
- S30-05: appModelDeclaration format déjà compatible MachineModel ✅
- S30-06: 455/455 tests verts, check 0 erreurs ✅

## Rétro-compat

- `new Machine(dbName, version, model)` constructor → sets _business + _model ✅
- `machine.init({ model: demoScheme })` → alias vers business ✅
- `machine.init({ core, business })` nouvelle API ✅
