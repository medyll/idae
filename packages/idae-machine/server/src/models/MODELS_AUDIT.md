# Legacy Models Audit — crfr / idaenext / tactac

> Generated 2026-06-05 during the format-unification + legacy-cleanup pass.
> Source models were AUTO-GENERATED from legacy MongoDB (`<org>_sitebase_app` + sampled `_base`).
> These three orgs **do not need data seeding for now** (per owner) — this audit covers schema shape only.

---

## 1. Format unification (done)

All four business models now use the **canonical literal format** (same shape as `bootstrap/seed/idae-model-core.ts`):

- `field('type', opts)` helper → plain literal `{ type: 'type', ...opts }`.
- Removed `field` import, `keyPath: '++id'` (now defaults at engine/deploy via `?? '++id'`), `ts`/`model` slots.
- `MachineCollectionModel.keyPath` made **optional** in `src/lib/types/machine-model.ts` to allow omission.

Lossless: explicit `type` kept on every field because `deployModel()` reads `fd.type ?? 'text'` directly (it does **not** consult the `FieldList` catalog by name — only the engine-core builder does).

Files: `demo/demoScheme.ts`, `crfr/crfrScheme.ts`, `idaenext/idaenextScheme.ts`, `tactac/tactacScheme.ts`.

---

## 2. Own-core removal (done — WS3)

Each legacy model carried a duplicate of the engine meta-core + its own RBAC. These are now provided by the **shared engine** (`idae-model-core`, merged via `buildEffectiveModel(core, business)`). Removed per file:

| Collection group | crfr | idaenext | tactac |
|---|---|---|---|
| `agent_groupe`, `agent_groupe_droit` (RBAC) | ✓ | ✓ | ✓ |
| `appscheme`, `appscheme_base`, `appscheme_field`, `appscheme_field_group`, `appscheme_field_type`, `appscheme_has_field`, `appscheme_has_table_field`, `appscheme_icon`, `appscheme_type`, `appscheme_view` | ✓ | ✓ | ✓ |
| `appscheme_field_droit`, `appscheme_field_droit_group` | — | — | ✓ |

Stripped: crfr **12**, idaenext **12**, tactac **14** collections.

**FK repointing:** `appscheme*` fk refs keep their `code` (the shared engine provides identical names → they resolve transparently). The only orphan was tactac `agent.fks.agent_groupe` → repointed to engine **`appuser_group`**. crfr/idaenext had no remaining business→core FK.

> Note: engine RBAC group is `appuser_group` (not `agent_groupe`); droits live in `appuser_grant` / `appuser_assignment`. The removed `agent_groupe_droit` (C/R/U/D/L flags) maps conceptually to `appuser_grant` — no business collection referenced it, so no repoint needed.

---

## 3. Type coercion (done — WS4, conservative)

Legacy cast had defaulted nearly everything to `text`. A conservative, name-anchored pass retyped high-confidence fields (only fields previously `text`):

| Org | boolean | number | date | datetime | currency | total |
|---|---|---|---|---|---|---|
| crfr | 25 | 35 | 0 | 6 | 6 | **72** |
| idaenext | 4 | 23 | 2 | 11 | 7 | **47** |
| tactac | 10 | 19 | 0 | 26 | 5 | **60** |

Rules (anchored to avoid false hits): `^(est|is)[A-Z]` / exact `actif|active|online|archive|valide|visible` → boolean; `heure*`, `timestamp`, `mongodate`, `isodate*` → datetime; `date*` → date; `montant|prix|tarif|acompte|solde|tva|ttc|total|_total` → currency; `nombre|nbre|quantite|duree|volume|ordre|poids|stock|*count` → number.

Untouched (left `text`, **needs human/data review**): free-form undeclared fields like `settings`, `cart_lines`, `cart_adresse`, `etatCivil`, `droit_app`, `scope`, `ipClient`, `md5`, `private_key`, ambiguous `cart_total_time`/`cart_total_volume`, etc.

---

## 4. Deferred (NOT done — needs follow-up)

### 4a. FK reconstruction — **biggest remaining item**
Most legacy collections have `fks: {}` despite clearly relational data (e.g. `aeroport`, `agent`). The cast did not capture relations. Reconstructing them requires the legacy `_base` documents (FK encoded as `field_raw{Collection}` / suffixed keys) — deferred until that data is available. Since these orgs need no data now, this is low urgency but required before any real seed.

### 4b. FR → EN field rename — **separate plan**
Field names remain French (`petitNom`, `dateCreation`, `montantHt`, `estActif`, …). Rename deferred to a dedicated pass using the mapping tables in `server/src/migrate/mapping/<org>.ts` (see WS5 skeleton). Keeping format + rename in separate diffs on purpose.

### 4c. `undeclared` fields
Lines flagged `// ── undeclared in registry, detected in _base — verify ──` are kept verbatim. Validate presence/typing against real data before removing the marker.

---

## 5. Verification

- `npx tsc -p server/tsconfig.json --noEmit` — model files clean (0 errors).
- No `field(` / `keyPath` / own-core collections remain in the three legacy files.
