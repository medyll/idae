# Sprint 31 — Server seed business + qoolie sync server-first

**Goal:** MongoDB = source de vérité pour les données business. Qoolie sync server-first ramène les données vers IDB. seedIfEmpty(layout) supprimé.

**Date:** 2026-05-22
**Status:** planned
**Depends on:** S30 (core/business init), S29 (Explorer)

---

## Contexte

Actuellement:
- `+layout.svelte` appelle `seedIfEmpty(demoSeed)` → écrit directement dans IDB
- MongoDB business collections vides → qoolie sync ne ramène rien
- Architecture incorrecte: IDB ne doit pas être seedé en direct

Architecture cible:
```
Server start → seedBusinessData(demoSeed) → MongoDB:vehicle, category, reservation
Client start → qoolie sync (server-first) → MongoDB → IDB
Explorer → machine.store.vehicle.getAll() → données présentes
```

---

## Stories

### S31-01 — seedBusinessData(demoSeed) côté serveur (M)

**Fichier:** `server/src/bootstrap/seedBusinessData.ts` (nouveau)

**AC:**
- `seedBusinessData(model, data, opts)` — insère les rows `demoSeed` dans MongoDB
- Idempotent: skip si collection déjà non-vide (même logique que seedSchemeFromModel)
- Wired dans `MachineServer.start()` après `deployModel` si data seed configuré
- Utilise la connexion MongoDB existante (via idaeApi / mongooseConnectionManager)
- Exported depuis bootstrap/index.ts

**API:**
```ts
await seedBusinessData(demoScheme, demoSeed, { org: 'demo', mongoUri: '...' });
// → insère demoSeed.category, demoSeed.vehicle... dans MongoDB si vides
```

---

### S31-02 — machine.init sync server-first dans +layout.svelte (S)

**Fichier:** `src/routes/+layout.svelte`

**AC:**
- `machine.init({ ..., sync: { mode: 'server-first', url: 'http://localhost:3000' } })`
- Sync activée → qoolie contacte le serveur au démarrage
- URL configurable via env variable (`PUBLIC_API_URL` ou similar)
- Si serveur absent → qoolie tombe en `fallbackMode: 'mobile-first'` (resilient)

**Config:**
```ts
machine.init({
    org: 'demo', domain: 'machine', version: 2,
    business: demoScheme,
    sync: {
        mode: 'server-first',
        url: import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000',
        fallbackMode: 'mobile-first',
    }
});
```

---

### S31-03 — Retirer seedIfEmpty du layout (S)

**Fichier:** `src/routes/+layout.svelte`

**AC:**
- Supprimer `import { seedIfEmpty }` et `seedIfEmpty(demoSeed)`
- Supprimer `import { demoSeed }` du layout (demoSeed reste dans demoScheme.ts pour usage serveur)
- Layout réduit à: init + start + initRouter

---

### S31-04 — Tests integration (M)

**AC:**
- Test server: `seedBusinessData` insère dans MongoDB, skip si déjà peuplé
- Test client: qoolie sync configuré server-first → collections accessibles après sync
- `pnpm run test` (server project) — doit inclure le nouveau test
- Full suite verte

---

## Souplesse local-first (futur)

L'architecture reste compatible local-first:
```ts
// Futur: changer une ligne
sync: { mode: 'mobile-first', url: '...' }
```

Aucun refactor applicatif. Qoolie gère les deux modes de façon transparente.

---

## Definition of Done

- [ ] 4/4 stories
- [ ] MongoDB:vehicle, category, reservation peuplés par server seed
- [ ] Qoolie sync active en mode server-first
- [ ] seedIfEmpty retiré du layout
- [ ] Tests verts
