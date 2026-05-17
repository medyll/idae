# idae-sync — Status Report
*Generated: 2026-05-17*

## Phase: `phase-2-sync-modes`
**Build:** ✅ Green — `npm run build` exit 0, dist generated  
**Tests:** ✅ 25/25 (100%)  
**Next:** `bmad-continue` → Developer → S-fix-01

---

## Fixes Applied (2026-05-17 session)

| Fix | File |
|-----|------|
| ✅ tsconfig.json created | new file |
| ✅ package.json — type:module, exports, build script | package.json |
| ✅ Import casing: `'./deliverer'` → `'./deliverer/index'` | initSync.ts:3 |
| ✅ `unknown` → `as any` for updated_at | ConflictResolver.ts:10-11 |
| ✅ Client config `any` | IdaeApiDeliverer.ts:8 |
| ✅ Index signature `as any` | WhereSerializer.ts:15 |

---

## Pending Stories

| ID | Priority | Issue |
|----|----------|-------|
| **S-fix-01** | 🔴 High | Wire or remove `onConflict` hook — param accepted, never called. Dead overloads at lines 442-489. |
| **S-fix-02** | 🔴 High | `serverFirstHandler` null guard in `applyServerFirst()` — crash risk if `getDb` missing |
| **S-fix-03** | 🟡 Med | Remove dead `createSyncAdapter` overload signatures |
| **S-fix-04** | 🟡 Med | Delete legacy files: `src/lib/OutboxStore.ts`, `src/lib/impl/InMemoryOutboxStore.ts` |
| **S-fix-05** | 🟡 Med | Type DLQ methods in `OutboxStore` interface, remove `as any` |
| **S-fix-06** | 🟢 Low | Extend `OutboxEntry.meta` type (`nextAttempt`, `failed`) |

---

## Audits
- `bmad/artifacts/audit-2026-03-15.md` — initial audit (duplicate files, missing index/tsconfig)
- `bmad/artifacts/audit-2026-05-17.md` — current audit (conflict stub, overload dead code, serverFirst crash)
