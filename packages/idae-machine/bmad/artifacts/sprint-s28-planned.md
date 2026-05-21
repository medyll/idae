# Sprint 28 — IDB Schema Drift Detection

**Goal:** IDB auto-adapts to server schema. No manual migrations. No version files. Hash-based drift detection.

**Date:** planned (after S26 + S27)
**Status:** planned
**Depends on:** S26 (rename done), S27 (_views wired)

---

## Core principle

MongoDB `appscheme_*` = source of truth.
IDB = cache/replica.
When server schema changes → IDB must adapt automatically.

No `DB_MIGRATIONS` file. No manual version bumps. The model is defined in MongoDB by admins, not in code.

## Drift detection flow

```
machine.start()
  → buildEffectiveModel()         — collections expected
  → computeSchemaHash(storeNames) — hash of expected stores
  → getStoredSchemaHash()         — hash stored in __schema_meta__
  → if match: skip (no cost)
  → if mismatch:
      getCurrentIdbStores()       — actual IDB stores
      diff: toCreate, toDelete
      upgradeIdb(toCreate, toDelete, currentVersion + 1)
        onupgradeneeded:
          delete orphaned stores
          create missing stores
      storeSchemaHash(newHash)
  → createQoolie()                — opens upgraded IDB
```

## Key invariants

- `adaptIdbToSchema()` runs BEFORE `createQoolie()` — qoolie must see correct stores
- `__*` stores always protected from deletion (`__outbox__`, `__schema_meta__`, `__migrations__`)
- Renamed collection = old deleted + new created — data gone, server sync reloads from MongoDB
- Hash = sorted join of store names — deterministic, order-independent
- IDB version = auto-incremented on each upgrade, never managed manually

## Stories

- S28-01: computeSchemaHash + getCurrentIdbStores + hash persistence
- S28-02: upgradeIdb() — onupgradeneeded create + delete
- S28-03: machine.adaptIdbToSchema() wired into start()
- S28-04: fetchSchema() integration
- S28-05: Tests + edge cases
