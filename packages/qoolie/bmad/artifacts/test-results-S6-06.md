# Test Results — S6-06

**Story:** Rewire Qoolie.ts + QoolieCollection.ts → engine/  
**Date:** 2026-05-20  
**Runner:** vitest v4.1.2

## All Tests

```
 RUN  v4.1.2 D:/development/idae/packages/qoolie

 Test Files  15 passed (15)
      Tests  193 passed (193)
   Start at  23:31:23
   Duration  3.04s
```

### Test Files
- ✅ config.test.ts
- ✅ health.test.ts
- ✅ operators.test.ts
- ✅ Qoolie.test.ts
- ✅ QoolieCollection.test.ts
- ✅ engine/pathResolver.test.ts (10)
- ✅ engine/IdbEngine.test.ts (12)
- ✅ engine/IdbCollection.test.ts (19)
- ✅ engine/IdbState.test.ts (10)
- ✅ encryption/EncryptionHelper.test.ts
- ✅ migrations/migrations.test.ts
- ✅ plugins/PluginManager.test.ts
- ✅ push/ServerPushListener.test.ts
- ✅ sync/conflict/ConflictResolver.test.ts
- ✅ validation/validate.test.ts

## TypeScript Check

```
tsc --noEmit — ✅ No errors
```

## Acceptance Criteria

- ✅ Qoolie.ts importe createDb depuis ./engine/IdbEngine.js
- ✅ Qoolie.ts importe createIdbState depuis ./engine/IdbState.js
- ✅ QoolieCollection.ts importe CollectionState depuis ./engine/IdbState.js
- ✅ package.json : @medyll/idae-idbql retiré des dependencies
- ✅ toIdbqModel() supprimé (plus besoin de convertir)
- ✅ Tous les tests existants Qoolie + QoolieCollection passent (193/193)

✅ All tests passed
