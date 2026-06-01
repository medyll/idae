# Sprint 17 — Generic Schema Validation

**Date:** 2026-05-18  
**Goal:** Auto-valider n'importe quelle collection server-side depuis appscheme MongoDB, sans écrire de domain actions.

---

## Context

S16 a posé `validateRules.ts` + `domainActions.validate()`. Domain actions = validation custom par collection. Problème : si pas de `actions.ts` pour une collection, aucune validation générique.

Solution : `SchemeValidator` service — lit `appscheme_has_field` + `appscheme_field` dans MongoDB, construit `Record<fieldName, FieldRule>`, cache, injecte dans handlers data.ts avant domain actions.

Flow final dans `createRecord`/`updateRecord` :
```
1. SchemeValidator.validate(table, body)   → generic (required, type, min/max from schema)
2. domainActions.validate(body, table)     → custom override/extension
3. Model.create/update
```

## Source des données (MongoDB machine_app)

**`appscheme_has_field`** — par collection
- `gridFks.appscheme.code` = collection name (filtre)
- `gridFks.appscheme_field.code` = field name
- `required: 0|1` — required per-collection

**`appscheme_field`** — par field name
- `code` = field name (filtre IN)
- `gridFks.appscheme_field_type.code` = type string ('text', 'email', 'number', etc.)
- `readonly: 0|1`

**2 requêtes → merge JS → FieldRule map → cache Map<collection, FieldRule[]>**

## Type mapping appscheme → FieldRule

| appscheme type | FieldRule.type |
|----------------|---------------|
| `text`, `text-*` | `'text'` |
| `number` | `'number'` |
| `integer` | `'integer'` |
| `boolean` | `'boolean'` |
| `email` | `'email'` |
| `url` | `'url'` |
| `date` | `'date'` |
| `datetime` | `'datetime'` |
| `time` | `'time'` |
| `phone` | `'phone'` |
| `currency` | `'currency'` |
| `password` | `'password'` |
| `fk-*`, `id`, `image`, `file`, `json`, `any` | skip (pas de validation type) |

## Stories

| ID | Title | Effort | Dep |
|----|-------|--------|-----|
| S17-01 | SchemeValidator service — fetch + cache + FieldRule map | M | — |
| S17-02 | Wire SchemeValidator dans createRecord/updateRecord | S | S17-01 |
| S17-03 | Tests — violations schema → 422, collection inconnue → skip | M | S17-02 |

## Decisions

- **Graceful skip** : collection absente d'appscheme → log warning + continue (pas de 500). Validation générique optionnelle, pas bloquante si schema manque.
- **Cache invalidation** : même stratégie que `baseCache` dans dbRouter — `invalidateSchemeCache(collection?)` exposé.
- **readonly fields** : pas bloqués par validation (lecture seule = UI concern). Ignorer côté validation.
- **fk-* fields** : pas de type validation (FK integrity = autre layer). Skip.
- **Domain actions priorité** : domain `validate()` s'exécute APRÈS SchemeValidator — peut ajouter des règles custom mais ne remplace pas le générique.

## Output files

- `server/src/validation/SchemeValidator.ts` — service + cache
- `server/src/routes/data.ts` — wire dans create/update
- `server/src/__tests__/schemeValidation.test.ts` — tests
