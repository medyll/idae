# Sprint 16 — Actions Layer

**Date:** 2026-05-18  
**Goal:** Ajouter soft delete, audit trail CRUD, validation serveur, et établir le pattern domain actions.ts (colocalisé avec le schéma).

---

## Context

CRUD handlers existent dans `server/src/routes/data.ts` (POST/PUT/DELETE/GET + permission middleware).  
`AuditService` existe mais pas branché sur CRUD — seulement auth events.  
Pas de soft delete, pas de validation serveur, pas de domain actions pattern.  
idae-db `registerEvents()` disponible mais server layer utilise Mongoose directement → utiliser Mongoose pre/post middleware pour hooks domain.

## Stories

| ID | Title | Effort | Dep |
|----|-------|--------|-----|
| S16-01 | Soft delete — deletedAt + filter | S | — |
| S16-02 | CRUD audit trail via AuditService | S | S16-01 |
| S16-03 | Domain actions pattern + rental demo | M | — |
| S16-04 | MachineSchemeValidate server-side | M | S16-03 |

## Decisions validées (ne pas reouvrir)

- **Soft delete** : champ `deletedAt: Date | null`, filter `{ deletedAt: null }` dans listRecords/getRecord. Hard delete via `?permanent=true` pour admin.
- **Audit CRUD** : `logAudit()` fire-and-forget dans handlers, pas de classe wrapper (ADR-01).
- **Domain actions** : Option A — colocalisé `server/src/models/{domain}/actions.ts`. Enregistrement via Mongoose schema hooks ou handler middleware. Jamais loin du schéma.
- **Validation** : `MachineSchemeValidate` étendu — pas Zod. Partagé client+serveur. Règles déduites de `template.fields`.
- **Timestamps** : Mongoose `timestamps: true` déjà actif — `createdAt`/`updatedAt` automatiques. Pas d'injection manuelle.

## Capacity

Effort total : S+S+M+M = sprint court, 1-2 sessions.

## Output files

- `server/src/routes/data.ts` — soft delete + audit calls
- `server/src/models/{domain}/actions.ts` — pattern établi (rental demo)
- `src/lib/main/machine/MachineSchemeValidate.ts` — règles serveur ajoutées
- Tests: `server/src/__tests__/data.test.ts` mis à jour
