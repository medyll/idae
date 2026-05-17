# BMAD Status — idae-machine v2
> Rebuilt: 2026-05-17 | Progress: 90% | Phase: development

---

## ✅ Sprint 11 COMPLETE: Validation minimal-data-functional

| Story | Titre | Priorité | État |
|-------|-------|----------|------|
| S11-01 | IDB CRUD round-trip via machine.collection() | 🔴 critique | ✅ complete |
| S11-02 | Auth flow: login → JWT → requête authentifiée | 🔴 critique | ✅ complete |
| S11-03 | API /api/data/* avec données réelles | 🟠 high | ✅ complete |
| S11-04 | machine.sync + machine.destroy() tests | 🟡 medium | ✅ complete |
| S11-05 | Fix data.test.ts + permission.test.ts (kareem) | 🟡 medium | ✅ complete |

---

## Sprint 12 — Polish (upcoming)

| Story | Titre | Priorité |
|-------|-------|----------|
| S12-01 | idae-sync S-fix-01 à S-fix-06 | medium |
| S12-02 | qoolie npm run package fix (tsc errors) | low |

---

## Bugs ouverts

| ID | Titre | Sévérité | Story |
|----|-------|----------|-------|
| BUG-02 | qoolie npm run package tsc errors | low | S12-02 |

---

## Root cause: BUG-01 (RESOLVED)

**Problem:** `kareem callback.apply is not a function` in data.test.ts + permission.test.ts
**Root cause:** Mongoose version mismatch — `idae-api` uses mongoose 9.3.3, server had 8.23.1.
Two mongoose instances loaded simultaneously caused kareem hook conflicts.
**Fix:** Aligned server to mongoose ^9.0.0 + fixed test mocks (socket.remoteAddress, resolveUser, resolveAccess).

## Détail stories S11

### S11-01 — IDB CRUD round-trip (critique) ✅ COMPLETE
**Fichier:** `src/lib/main/__tests__/machineCRUD.test.ts`
**Tests:** 23/23 pass | Full suite: 193/193 green

Tous les critères validés avec fake-indexeddb sur 6 collections:
- create → doc avec id auto-généré
- getAll → retourne les docs créés
- where({status:'available'}) → filtre correct
- update(id, data) → doc modifié retourné
- delete(id) → true, doc supprimé de getAll
- count() / count(query) → entiers corrects
- collection('nonexistent') → throw
- Edge cases: delete idempotent (true), update upsert

### S11-02 — Auth flow (critique) ✅ COMPLETE
**Fichier:** `server/src/__tests__/auth.test.ts`
**Tests:** 18/18 pass

Flux complet validé:
- admin/user/viewer login → JWT token
- bad credentials → null (401 au niveau handler)
- JWT décodable: userId, login, isAdmin, exp
- Sans token → resolveUser = null → 401
- Avec token admin → resolveUser = admin context
- viewer (groupe R+L) → grantService deny sur C

### S11-03 — API data avec données réelles (high) ✅ COMPLETE
**Fichier:** `server/src/__tests__/dataReal.test.ts`
**Tests:** 7/7 pass

Données réelles validées:
- GET /api/data/vehicle → 3 véhicules (demoSeed)
- GET /api/data/category → 3 catégories
- GET /api/data/vehicle?sort=mileage&order=desc → Clio premier (45000)
- GET /api/data/vehicle?page=1&limit=2 → meta.total=3, data.length=2
- POST /api/data/category → 201 + doc retourné
- DELETE /api/data/category/{id} → 204
- GET /api/data/rental → vehicleId=2 présent (FK integrity)

### S11-04 — machine.sync + machine.destroy() (medium) ✅ COMPLETE
**Fichier:** `src/lib/main/__tests__/machineSyncDestroy.test.ts`
**Tests:** 10/10 pass | Full client suite: 203/203 green

API surface validée:
- sync:false → start() OK, machine.sync throw 'not enabled'
- sync config → forwarded to createQoolie
- stateEngine:stator → forwarded
- destroy() après start() → _qoolie undefined
- destroy() avant start() → no-op
- sync/collection avant start() → throw
- collection après start() → QoolieCollection avec CRUD verbs

---

### S11-02 — Auth flow (critique)
**Fichier:** `server/src/__tests__/auth.test.ts`

Critères:
- `POST /api/auth/login {login:'admin',password:'admin123'}` → 200 + JWT
- `POST /api/auth/login {login:'user',password:'user123'}` → 200 + JWT
- `POST /api/auth/login {login:'bad',password:'bad'}` → 401
- `GET /api/data/vehicle` sans Authorization → 401
- `GET /api/data/vehicle` avec token admin → 200
- JWT contient userId + org (décodable)
- viewer (groupe R+L) peut lire, ne peut pas créer

---

### S11-03 — API data avec données réelles (high)
**Fichier:** `server/src/__tests__/dataReal.test.ts`

Pré-requis: demo org seeded (CLI seed fait).

Critères:
- `GET /api/data/vehicle` → 3 véhicules (demoSeed)
- `GET /api/data/category` → 3 catégories
- `GET /api/data/vehicle?sort=mileage&order=desc` → Captur en premier (mileage=15000)
- `GET /api/data/vehicle?page=1&limit=2` → meta.total=3, data.length=2
- `POST /api/data/category {code:'lux2',name:'Luxury2'}` → 201
- `DELETE /api/data/category/{id}` → 204
- `GET /api/data/rental` → vehicleId=2 présent

---

### S11-04 — machine.sync + machine.destroy() (medium)
**Fichier:** `src/lib/main/__tests__/machineSyncDestroy.test.ts`

Critères:
- `machine.init({sync:false})` → start() OK, `machine.sync` throw 'not enabled'
- `machine.init({sync:{databaseHost:'http://x',mode:'mobile-first'}})` → createQoolie avec sync config
- `machine.destroy()` après start() → `machine._qoolie === undefined`
- `machine.destroy()` avant start() → no-op, pas de throw
- `machine.sync` avant start() → throw 'Machine not started'
- `machine.collection(name)` avant start() → throw
- `machine.collection(name)` après start() → QoolieCollection avec bons verbes

---

### S11-05 — Fix data.test.ts + permission.test.ts (medium) ✅ COMPLETE
**Fichiers:** `server/src/__tests__/data.test.ts`, `permission.test.ts`, `server/package.json`

Root cause: **mongoose version mismatch** — idae-api utilise mongoose 9.3.3, server avait 8.23.1.
Deux instances mongoose chargées simultanément → conflits kareem hooks.
Fix: server aligné sur mongoose ^9.0.0 + mocks corrigés (socket.remoteAddress, resolveUser, resolveAccess).

---

## ✅ Sprint 12 COMPLETE: Polish

| Story | Titre | Priorité | État |
|-------|-------|----------|------|
| S12-01 | idae-sync S-fix-01 à S-fix-06 | medium | ✅ complete |
| S12-02 | qoolie npm run package fix (tsc errors) | low | pending |

### S12-01 — idae-sync fixes (medium) ✅ COMPLETE
**Package:** `../idae-sync` | **Tests:** 93/93 pass (24 suites) | **Build:** green

S-fix-04: Legacy files already cleaned (outbox/ subdirectory).
S-fix-05: IOutboxStore interface extracted, DLQ methods typed, `as any` casts removed.
S-fix-06: OutboxEntry.meta already had nextAttempt/failed typed.

---

## Bugs ouverts

| ID | Titre | Sévérité | Story |
|----|-------|----------|-------|
| BUG-02 | qoolie npm run package tsc errors | low | S12-02 |

---

## Tests actuels (2026-05-17)

| Suite | Fichier | Tests | État |
|-------|---------|-------|------|
| server | demo-roundtrip.test.ts | 10/10 | ✅ |
| server | demo-seed.test.ts | 14/14 | ✅ |
| server | fetchSchemaE2E.test.ts | 7/7 | ✅ |
| server | scheme.test.ts | 3/3 | ✅ |
| server | auth.test.ts | 18/18 | ✅ S11-02 |
| client | machine.test.ts | 15/15 | ✅ |
| client | machineClient.test.ts | 11/11 | ✅ |
| client | machineSchemaFromModel.test.ts | 12/12 | ✅ |
| client | machineSyncDestroy.test.ts | 10/10 | ✅ S11-04 |
| client | machineCRUD.test.ts | 23/23 | ✅ S11-01 |
| server | dataReal.test.ts | 7/7 | ✅ S11-03 |
| server | data.test.ts | 8/8 | ✅ S11-05 |
| server | permission.test.ts | 8/8 | ✅ S11-05 |

**Total green: 282/282** (all tests passing)

---

## Context clé

- **MongoDB demo org**: seeded — demoScheme (6 collections) + demoSeed + users (admin/user/viewer)
- **Machine surface**: `machine.collection(name)`, `machine.sync`, `machine.destroy()`, `machine.init({sync,stateEngine,hooks})` ajoutés
- **qoolie dist**: patché manuellement (build officiel cassé — BUG-02)
- **idae-router**: alias direct dist dans server/vitest.config.ts (exports `svelte` only)
- **Prochaine action**: Sprint 12 — idae-sync fixes + qoolie build
