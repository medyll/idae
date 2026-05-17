# BMAD Status — idae-machine v2
> Rebuilt: 2026-05-17 | Progress: 78% | Phase: development

---

## Sprint actif — S11: Validation minimal-data-functional

| Story | Titre | Priorité | État |
|-------|-------|----------|------|
| S11-01 | IDB CRUD round-trip via machine.collection() | 🔴 critique | ✅ complete |
| S11-02 | Auth flow: login → JWT → requête authentifiée | 🔴 critique | ✅ complete |
| S11-03 | API /api/data/* avec données réelles | 🟠 high | pending |
| S11-04 | machine.sync + machine.destroy() tests | 🟡 medium | pending |
| S11-05 | Fix data.test.ts + permission.test.ts (kareem) | 🟡 medium | pending |

---

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

### S11-05 — Fix data.test.ts + permission.test.ts (medium)
**Fichiers:** `server/src/__tests__/data.test.ts`, `permission.test.ts`

Root cause hypothèses:
1. Deux instances mongoose (idae-router alias browser vs node)
2. Hooks mongoose corrompus par conflit de module
3. Race condition sur mongoose.connection entre tests

Critères:
- Tous les tests data.test.ts passent
- Tous les tests permission.test.ts passent
- Root cause documentée

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
| BUG-01 | kareem callback.apply not a function (data/permission tests) | medium | S11-05 |
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
| client | machineCRUD.test.ts | 23/23 | ✅ S11-01 |
| server | data.test.ts | ❌ pre-existing | BUG-01 |
| server | permission.test.ts | ❌ pre-existing | BUG-01 |

**Total green: 211/221** (10 pre-existing BUG-01)

---

## Context clé

- **MongoDB demo org**: seeded — demoScheme (6 collections) + demoSeed + users (admin/user/viewer)
- **Machine surface**: `machine.collection(name)`, `machine.sync`, `machine.destroy()`, `machine.init({sync,stateEngine,hooks})` ajoutés
- **qoolie dist**: patché manuellement (build officiel cassé — BUG-02)
- **idae-router**: alias direct dist dans server/vitest.config.ts (exports `svelte` only)
- **Prochaine action**: S11-03 → API data avec données réelles
