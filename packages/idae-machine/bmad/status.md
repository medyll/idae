# BMAD Status — idae-machine v2
> Vérifié: 2026-05-17 | Progress: 82% | Phase: development

---

## Sprint 11 — Validation minimal-data-functional (in_progress)

| Story | Titre | Priorité | État |
|-------|-------|----------|------|
| S11-01 | IDB CRUD round-trip via machine.collection() | 🔴 critique | ✅ complete |
| S11-02 | Auth flow: login → JWT → requête authentifiée | 🔴 critique | ✅ complete |
| S11-03 | API /api/data/* avec données réelles | 🟠 high | ✅ complete |
| S11-04 | machine.sync + machine.destroy() tests | 🟡 medium | ✅ complete |
| S11-05 | Fix CreateUpdate.integration.test.ts (8 failures) | 🟡 medium | ⏳ pending |

---

## Sprint 12 — Polish (upcoming)

| Story | Titre | Priorité | État |
|-------|-------|----------|------|
| S12-01 | idae-sync S-fix-01 à S-fix-06 | medium | ⏳ pending |
| S12-02 | qoolie npm run package fix | low | ⏳ pending |

---

## Résultats réels (mesurés 2026-05-17)

| Suite | Commande | Tests | État |
|-------|---------|-------|------|
| Server (server/) | `cd server && pnpm vitest run` | **79/79** | ✅ |
| Client (root) | `pnpm vitest run --project server` | **274/282** | ⚠️ 8 failures |

### Détail server/vitest (79/79) ✅
| Fichier | Tests |
|---------|-------|
| demo-roundtrip.test.ts | 10 |
| demo-seed.test.ts | 14 |
| fetchSchemaE2E.test.ts | 7 |
| scheme.test.ts | 3 |
| auth.test.ts | ✅ S11-02 |
| dataReal.test.ts | ✅ S11-03 |
| health.test.ts | ✅ |
| bootstrap.test.ts | ✅ |
| data.test.ts | ✅ |
| permission.test.ts | ✅ |

### Détail client failures (8/282) ⚠️
Fichier: `src/lib/form/__tests__/CreateUpdate.integration.test.ts`
- 8/30 tests failing — form validation (isValid, cross-field, reset)
- Pre-existing (3 commits anciens, pas introduit cette session)
- Story: S11-05

### Fichiers créés cette session (tous green)
| Fichier | Tests |
|---------|-------|
| `src/lib/main/__tests__/machineCRUD.test.ts` | ✅ S11-01 |
| `src/lib/main/__tests__/machineSyncDestroy.test.ts` | ✅ S11-04 |
| `server/src/__tests__/auth.test.ts` | ✅ S11-02 |
| `server/src/__tests__/dataReal.test.ts` | ✅ S11-03 |
| `server/src/__tests__/demo-seed.test.ts` | ✅ session précédente |
| `server/src/__tests__/fetchSchemaE2E.test.ts` | ✅ session précédente |

---

## Bugs ouverts

| ID | Titre | Sévérité | Story |
|----|-------|----------|-------|
| BUG-01 | CreateUpdate.integration.test.ts — 8 form validation failures | medium | S11-05 |
| BUG-02 | qoolie npm run package — tsc errors pre-existants | low | S12-02 |

---

## Context clé

- **MongoDB demo org**: seeded — demoScheme (6 collections) + demoSeed + users (admin/user/viewer)
- **Machine API surface**: `machine.collection(name)`, `machine.sync`, `machine.destroy()`, `machine.init({sync,stateEngine,hooks})`
- **qoolie dist**: patché manuellement — build officiel cassé (BUG-02)
- **idae-router**: alias direct dist dans server/vitest.config.ts (`svelte` exports only)
- **Prochaine action**: S11-05 → fix CreateUpdate failures
