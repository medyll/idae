# FKRELATIONS.md — `fkRelations` lives on the appscheme record, never on the model

> Authoritative working spec for the `fkRelations` feature. Written in-repo (not in any
> private/assistant store) so it travels with the code and survives a context reset.
> Status: **IMPLEMENTED 2026-06-21.** Server + client re-sourced to `appscheme[col].fkRelations`;
> relations removed from the in-memory model; authoring sweep done (579 `fks:`→`fkRelations:`).
> Gate green: server 577/577, client 34/34, svelte-check 0, server typecheck 0.
> Supersedes `RATIONALIZE.md` §1 (which mis-framed this as a "rename/cleanup"; it is the
> **implementation of a new declarative concept**). See §8 for the shipped change log.

---

## 0. The rule (read this first)

A collection's relations are read from **exactly one place**:

> **`appscheme[collection].fkRelations`** — the relation definitions carried on that collection's
> `appscheme` record (data layer / store).

Hard constraints:
- **`collection.fkRelations` (runtime / in-memory) must NEVER exist.** `getModel` must not build
  it, `MachineCollectionModel` must not carry it, no consumer may read `model[col].fkRelations`
  (nor today's `model[col].fks` as a definition).
- A record's resolved relation **values** stay in the runtime **`fks`** bag (`record.fks`).
  Unchanged. The `fks` bag is a **value bag** (resolved relation snapshots, keyed
  `{relation}_{id}`), **NOT** a definition. Its entries are **written server-side by CRUD hooks**,
  never authored by hand and never sourced from the model:
  - `pre:create` / `pre:update` (`server/src/hooks/builtins.ts`, blocking, prio 20) →
    `foldFks` (`server/src/validation/FkFolder.ts`) resolves each FK ref and folds the snapshot
    into `data.fks.{relation}_{id}`.
  - `post:delete` (prio 95) → cascade-nullify `$unset`s `fks.{fkName}_{deletedId}` in every
    referencing collection (`findReverseFkHolders`).
  The relation **definitions** that drive this fold come from `fkRelations` (the source of truth);
  the **values** the fold produces live in `fks`. Two layers, two names — do not conflate.
- `fkRelations` is **NOT** a user-facing field — never in any `fields` map or in `FieldList`.

This is "schema as data": relations are read from the appscheme records, the same way business
data is read — not from a model object held in memory.

---

## 1. The three scopes

| Scope | Where | Key | Lifetime | Content |
|------|-------|-----|----------|---------|
| **Authoring declaration** | scheme source (`*Scheme.ts`, `idae-model-core.ts`, …) | `fkRelations:` | **transient** — input to `publishModel`, then discarded | `{ code, multiple, required }` |
| **Source of truth** | `appscheme[collection]` record (Mongo / store) | `fkRelations` | persistent | the declared definitions, **moved** here at deploy |
| **Runtime values** | business/meta records | `fks` (bag) | persistent | resolved relation values/snapshots, e.g. `category_1:{…}` |

- "Déplacées, pas copiées": at deploy the declaration is **moved** into `appscheme[col].fkRelations`.
  Nothing relation-shaped survives on the in-memory model.
- The `appscheme` collection is **no exception**: its own relations (`appscheme_base`,
  `appscheme_type`), today declared `appscheme.fks`, are authored as `appscheme.fkRelations` and
  moved onto the `appscheme` record for `appscheme` like any other.

---

## 2. Current state (verified against source + live demo DB, 2026-06-21)

### 2a. Shipped on `dev` — PARTIAL and mis-aimed
- `f4110cce` — `publishModel` writes the appscheme doc in two parts:
  - `doc.fks` = `{ appscheme_base, appscheme_type }` (resolved value bag = the record's own values)
  - `doc.fkRelations` = business relation descriptors `{ code, multiple, required }` ✅ (this part
    is the right idea: relations land on the appscheme record)
  - **BUT** `MachineServer.getModel` then reads `doc.fkRelations` and rebuilds the in-memory
    **`model[col].fks`** — i.e. it puts relations back onto the model object. ❌ This is exactly
    what the new rule forbids. The whole "relations on the model" path must be removed.
- `edb5457d` — unrelated (CSS label width + warmup). Leave.
- `791e145e` — removed an earlier wrong attempt to declare `fkRelations` as an appscheme field.

Live demo DB doc shape (dumped, correct for the source-of-truth layer):
```
appscheme[vehicle].fkRelations = { category:{code,multiple,required}, location_office:{…} }   ← source of truth
appscheme[vehicle].fks         = { appscheme_base:{…}, appscheme_type:{…} }                    ← record's own value bag
vehicle#1 (business).fks       = { category_1:{…snapshot}, location_office_1:{…snapshot} }     ← runtime values
```

### 2b. Earlier "fkRelations as a renderable field" pollution — ALREADY REVERTED ✅
A prior session wrongly treated `fkRelations` as a renderable field/type. **Reverted/untracked
as of 2026-06-21** — verified clean: working tree shows only `FKRELATIONS.md` untracked, the
new files are gone, the tracked files carry no `fkRelations` field wiring. Nothing to do here.
For the record, the reverted set was:
- `server/src/idae/field-defs.ts` — `fkRelations` in `FieldList` (gone ✅)
- `server/src/idae/idae-model-core.ts` — `fkRelations` in `appscheme.fields` (gone ✅; only a
  comment at L86 remains)
- `src/lib/data-ui/field/DataField.svelte` — `'relations'` dispatch branch + import (gone ✅)
- `src/lib/data-ui/field/snippets/index.ts` — `FieldRelations` export (gone ✅)
- `src/lib/data-ui/field/snippets/FieldRelations.svelte` — new file (deleted ✅)
- `fkcheck.mjs` (repo root) — throwaway Playwright script (deleted ✅)

---

## 3. Target state

1. **Authoring**: scheme source declares `fkRelations:` (transient). No `fks:` declaration blocks.
2. **Deploy** (`publishModel`): read `colDef.fkRelations` → write `appscheme[col].fkRelations`.
3. **getModel**: build `model[col]` with **fields + views only**. Emit **NO relations** key
   (drop the current `model.fks` build).
4. **Reads**: every consumer resolves a collection's relations from
   `appscheme[collection].fkRelations`:
   - **client** → `machine.store('appscheme', { code: collection })` then `.fkRelations`
     (reactive; the appscheme store is already warmed/hydrated).
   - **server** → query the `appscheme` collection in the meta DB for `{ code }`, read `fkRelations`.
5. **Runtime values**: `record.fks` bag unchanged.

---

## 4. Touch-point map (the real "huge impact")

The impact is NOT a rename `model[col].fks → model[col].fkRelations`. It is **removing relations
from the in-memory model entirely** and **re-sourcing every relation read to the appscheme record**.

### 4a. Authoring declaration sites — `fks:` block → `fkRelations:`
- `server/src/idae/idae-model-core.ts` — all model-core collections.
- `server/src/models/*/*Scheme.ts` — ~20 business schemes (demo, jobber, hotelo, restau, iot,
  factory, ledger, medbook, comix, school, hippo, agile, flix, boutique, blogcms, master, latent,
  crfr, tactac, idaenext).
- `src/lib/ai/schema/*.ts` (tag, ai-user-prompt, ai-tool-call, ai-message, ai-companion,
  ai-chat-session, ai-catalogs).
- `src/lib/__fixtures__/demoModel.ts`.
- ⚠️ `server/src/migrate/**` `map.fks` = a THIRD meaning (migration resolve-map). Leave untouched.

### 4b. Deploy + model build
- `server/src/bootstrap/publishModel.ts` — read `colDef.fkRelations` (L271 area) instead of
  `colDef.fks`; keep writing `appscheme[col].fkRelations`.
- `server/src/bootstrap/seed/schemaWalker.ts` (L81/117/148/173), `seed/idaeModel.ts` (L46) —
  read the declaration as `fkRelations`.
- `server/src/MachineServer.ts#getModel` — **stop emitting relations** onto `model[col]` (remove
  the `model.fks` construction, ~L116-135). Keep building `fields` and `_views`. The meta-doc
  bag reads inside getModel (`hf.fks.appscheme`, `fieldDoc.fks.appscheme_field_type`,
  `v.fks.appscheme_view_type`) are **resolved value bags on meta records → stay `fks`**.

### 4c. Relation READ consumers — re-source to `appscheme[collection].fkRelations`
Each of these currently reads the relation **definitions** from the model object. They must instead
read from the appscheme record (client: appscheme store; server: meta-DB appscheme query). None may
keep a `model[col]`/`scheme` definition read.
- `src/lib/main/machine/MachineScheme.ts` — `get fks()` (L57) and everything built on it:
  `parseFks` (L136), `findFkField` (L148), `hasFkValue` def branch (L164), `parseReverseFks`
  (L194). NOTE L167 `record.fks` = runtime bag, keep. (Likely: replace `get fks()` with an
  appscheme-store-backed relations accessor; reverse-FK now means scanning appscheme records.)
- `src/lib/main/machine/MachineSchemeField.ts` (L67) — `#collectionModel.fks`.
- `src/lib/main/machine/MachineSchemeValues.ts` (L313) — `scheme.fks` (descriptor). L29 `data.fks`
  = runtime bag, keep.
- `src/lib/main/machine/MachineSchemeValidate.ts` (L238) — `scheme.fks`.
- `src/lib/main/machine/MachineFkFold.ts` — reads the relation def to fold; re-source the def.
  `out.fks` bag written (L31/L54) stays `fks`.
- `src/lib/main/machine.ts` (L366) — `collection(name).fks` def read for fold.
- `src/lib/data-ui/utils/dataRelationUtils.ts` (L70) — `scheme.fks`. L45/92 `record.fks` bag, keep.
- `src/lib/data-ui/data/DataRecord.svelte` (L75) — `scheme.fks`.
- `src/lib/data-ui/data/DataList.svelte` (L240/245) — `collLogic.fks`.
- `src/lib/data-ui/controls/DataGroup.svelte` (L28) — `collLogic.fks`.
- `server/src/validation/FkFolder.ts` (L32) — `colModel.fks`; re-source from meta-DB appscheme.
  L35 `data.fks` bag, keep.
- `server/src/validation/FkValidator.ts` (L30/131) — `model/colDef.fks`; re-source. L50 `data.fks`
  bag, keep.
- `server/src/mcp/SchemeTools.ts` (L43), `server/src/mcp/tools/schemaTools.ts` (L24) — `model/def.fks`.

> ⚠️ **Hardest part:** server-side fold/validate (`FkFolder`, `FkValidator`, `publishModel`'s own
> needs) read relation defs **synchronously from the model**. Re-sourcing them to the appscheme
> records means an async meta-DB read (or an in-process appscheme cache). This is the core
> design decision of the feature — not a mechanical edit. Same on the client: `MachineScheme`
> methods that are sync today must read the (already-hydrated) appscheme store.

### 4d. Runtime value-bag / meta-doc bag — KEEP `fks` (do NOT touch)
`MachineFkFold` `out.fks`; `MachineSchemeValues` L29 `data.fks`; `MachineScheme` L167 `record.fks`;
`dataRelationUtils` L45/92; `DataField.svelte` `readFkSnapshot`/`readFkRaw` (`rec.fks`);
`data-utils.ts` L96; `FkFolder` L35; `FkValidator` L50; `migrate-legacy` `out.fks`.
Meta-doc value bags read as `fks`: `getModel` (`hf/fieldDoc/v .fks.*`), `SchemeValidator`
(L54/65/72), `useViewFields` (L42 `r.fks.appscheme_field.code`), `MachineRights` (L100 `grant.fks`),
`RbacMatrix` (L36/44), `Explorer.svelte` (`groupBy="fks.appscheme_base"`), `DataRecord` template
tokens `fks.<rel>.code`, `FksItem` in `entity-types.ts`.

### 4e. Tests
- Server: `demo-roundtrip.test.ts`, `fetchSchemaE2E.test.ts`, `scheme.test.ts` assert
  `model.X.fks` as the **definition** — these must change to assert the appscheme record's
  `fkRelations` (or the new read API), since `model[col]` no longer carries relations.
  `bootstrap.test.ts` L97-98 read the doc `fks` bag (base/type → keep); L99-100 read `fkRelations`.
- Client: tests with model-object `fks:` declarations and `scheme.fks` reads
  (`machineSchemaFromModel`, `machineSchemeValidate`, `machineRelationHelpers`,
  `presentationFkSuffix`, `machine`, `dataGroupFk`, `DataRecord.svelte`, `useViewFields.svelte`,
  `DataRelations.svelte`, `machineRights`, `machineValidation*`, `rbacMatrix`,
  `machineSchemeDefaultSort`, `machineErrorPaths`) — update to the appscheme-store read; record/bag
  `fks` left alone.

### 4f. Wire / cache impact
- `model[col]` JSON shrinks (no relations). Relations now travel as appscheme records (already
  synced/hydrated). Client SWR schema cache (`machineSchemaCache`) revalidates on diff; consider a
  forced bust on deploy.
- After the change, `grep '\.fks\b'` should show **only** runtime-bag hits — zero model-definition
  relation reads remain.

---

## 5. Open decisions
1. **Relation read API shape**: add a method (e.g. `machine.logic.relations(collection)` /
   `MachineScheme.relations`) backed by the appscheme store (client) and meta-DB (server)? Define
   once, route all §4c consumers through it.
2. **Sync vs async** on server fold/validate (appscheme meta read or in-process cache).
3. **Migration maps** `map.fks` — leave (3rd meaning). (assumed yes)
4. **`MachineFkDef`** interface name — keep (types a relation def). (assumed yes)
5. **Cache bust** on deploy — SWR diff vs force-invalidate.
6. `order` / cascade — out of scope (user: "aucune importance").

---

## 6. Suggested execution order
1. §2b pollution already reverted; just confirm baseline green (`pnpm run check`, server `typecheck`).
2. Decide §5.1 read API + §5.2 sync/async. Implement the appscheme-backed relations accessor.
3. `getModel`: stop emitting relations on `model[col]`; `publishModel`/seed: read declaration as
   `fkRelations`.
4. Route every §4c consumer through the new accessor (remove all `model[col]`/`scheme.fks`
   definition reads).
5. Authoring sweep §4a: `fks:` → `fkRelations:`.
6. Tests §4e.
7. **Drop** `demo_machine_app` then reseed (`ensureCodeToId` is create-if-absent; stale meta DB
   keeps old shapes), then verify: appscheme record has `fkRelations`; `model[col]` has **no**
   relations key; vehicle fiche renders FK values; appscheme fiche shows described relations.
8. Full gate green.

---

## 7. Verified facts log (trust without re-deriving)
- Demo creds: `mongodb://admin:gwetme2011@localhost:27017`; meta DB `demo_machine_app`, business
  base DB `demo_machine_base`.
- Dev server port **7842**; `/api/scheme?org=demo` returns the model JSON.
- Client dev **5173**; login `admin` / `admin123` (`server/src/bootstrap/seedUsers.ts`).
- Reseed: `cd server && npx tsx src/bootstrap/bootstrap.ts demo`. `ensureCodeToId` create-if-absent
  → drop `demo_machine_app` first to apply field/type/shape changes.
- `FIELD_TYPES` (publishModel) derives from `FieldList` (`server/src/idae/field-defs.ts`).
- appscheme fiche right panel: `Fiche.svelte` → `<DataRecord view="fk">`; `view="fk"` field list
  from `appscheme_view` rows; FK render via `DataField` descriptor (`descriptor.kind === 'fk'`).
- Relations source of truth (confirmed by user): `appscheme[collection].fkRelations` only;
  `collection.fkRelations` in-memory must never exist.

---

## 8. Shipped change log (2026-06-21)

Decision (§5.1/§5.2): relations read **only** from the appscheme store, never the model.
Accessor is **imperative** (`where`) not reactive (`machine.store`) — relation defs are static
schema data and the reactive read needs a Svelte frame (dead in node tests).

**Server**
- `MachineServer.getRelations(col)` / `getAllRelations()` — read `appscheme[col].fkRelations`
  from the meta DB. New single relation source server-side.
- `FkFolder.foldFks` — pure, takes `fkDefs` (no longer reads dead `model[col].fks`).
- `FkValidator.getFkDefs` + `findReverseFkHolders` — re-sourced via `getRelations`/`getAllRelations`.
- `hooks/builtins.ts`, `mcp/tools/dataTools.ts` (`resolve_fks`), `bootstrap/seedBusinessData.ts` —
  feed defs from appscheme (runtime) or model authoring decl (seed).
- `getModel` already emits no relations on `model[col]` (kept).

**Authoring sweep (§4a)** — 579 `fks:`→`fkRelations:` across 20 `server/src/models/*/*Scheme.ts`
(line-start only; runtime/value bags untouched).

**Client**
- `dataRelationUtils.getCollectionRelations(col)` — imperative `_qoolie.collection['appscheme']
  .where({ code: col }).fkRelations`, guarded against a missing appscheme store.
  Consumers (`MachineScheme.get fks`, `MachineSchemeField`, `#wrapCollectionFkFold`) unchanged —
  they already route through this accessor.

**Tests (§4e)**
- `server/src/__tests__/fkFolder.test.ts` — pure signature.
- 5 client `.test.ts` (`machineClient`, `machineFkFeed`, `machineRelationHelpers`,
  `machineSchemaFromModel`, `machineSchemeValidate`) drive the **global** machine + seed appscheme
  via `src/lib/main/__tests__/_relationTestUtils.ts` (boots global, seeds one appscheme record per
  collection — client analog of publishModel's "move").
- 3 svelte tests (`DataRecord`, `useViewFields`, `DataRelations`) seed appscheme records with
  `fkRelations`.

**Open / deferred** — `order`/cascade (out of scope); SWR cache-bust on deploy (§5.5) not forced.
