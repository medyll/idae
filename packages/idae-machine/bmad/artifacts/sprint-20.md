# Sprint 20 — Hooks unifiés + Services spécialisés

**Date:** 2026-05-18
**Goal:** Combler les 2 vrais gaps issus de l'intake `LEGACY-ACTIONS-MIGRATION.md` : (1) un registry global pre/post unifié au-dessus de `domainActions` + `AuditService`, (2) les services spécialisés du legacy (fichiers, mail, images).

---

## Context

Audit 2026-05-18 sur la doc `bmad/intake-sources/LEGACY-ACTIONS-MIGRATION.md` :

- Priorités 1, 3, 4, 5 = déjà DONE (CRUD Express, validation serveur, convention `actions.ts`, soft delete)
- Priorité 2 = PARTIAL — `domainActions` per-collection + `AuditService` direct + Mongoose `timestamps:true` couvrent une partie, mais aucun registry global type `pre:create` / `post:update` n'unifie le flow. Cross-cutting concerns (audit, broadcast, history) sont câblés en dur dans `routes/data.ts`.
- Priorité 6 = NOT STARTED — pas de service fichiers, ni mail, ni images.

Les 4 stories du sprint adressent ces gaps sans casser l'existant.

## Stories

| ID | Title | Effort | Dep |
|----|-------|--------|-----|
| S20-01 | Global hooks registry — `pre:*` / `post:*` unifié | M | — |
| S20-02 | File service — upload + storage local | M | — |
| S20-03 | Mail service — SMTP + templates transactionnels | M | — |
| S20-04 | Image service — resize + thumbnails + metadata | M | S20-02 |

## Decisions

- **Backward-compat absolue** : `domainActions` reste l'API publique côté domaine. Les hooks globaux sont une couche infra qui s'exécute en plus, pas à la place.
- **Stockage fichiers** : disque local par défaut (`server/data/files/{org}/{table}/{id}/`). GridFS = option future, pas dans ce sprint.
- **Mail** : nodemailer, pas de service tiers. Templates Markdown → HTML simple (pas de moteur lourd).
- **Images** : sharp pour resize/thumbnail. Pas d'EXIF strip dans ce sprint (sécurité = sprint séparé).
- **Pas de queue/job** : tout synchrone ou fire-and-forget. Bull/BullMQ = sprint séparé si besoin.

## Output files (récap)

- `server/src/hooks/HooksRegistry.ts` — registry + dispatcher
- `server/src/hooks/builtins.ts` — hooks standards (timestamps, audit, broadcast)
- `server/src/services/FileService.ts`
- `server/src/services/MailService.ts`
- `server/src/services/ImageService.ts`
- `server/src/routes/files.ts`
- Tests colocalisés dans `server/src/__tests__/`
