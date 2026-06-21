# RATIONALIZE.md — model-core rationalization backlog

> Early-MVP rationalization of the model-core. Distinct from `bmal/intake-sources/UNHACK.md`
> (which was a closed workaround-elimination audit). This file tracks **deliberate
> structural simplifications** we choose to make now, while the surface is still small.
>
> Each item: **what · why · decision · touch-points · do-not-touch · effort/risk · status.**
> Nothing here is implemented until its status says so.

---

## 1. Split `fks`: model-def `fkRelations` vs record value-bag `fks`

**Status:** ✅ DONE (scoped) — commit `f4110cce`, 2026-06-21. Shipped the **appscheme-record-only**
split (per user narrowing): a stored `appscheme` doc now carries `fkRelations` (relation descriptors)
separate from its own `fks` value-bag (base/type pointers). The **global** model-side rename
(`MachineCollectionModel.fks` and all consumers) was **descoped** — in-memory model keeps `fks`.
`order?` field + cascade **deferred** (user: "laisse tombé"). CSS cheap win below **not done**.

### What
`fks` currently names two different things at two layers:
- **model definition** — `{code, multiple, required}`, lives in scheme code (`scheme.fks`).
- **record value bag** — `{<rel>_<id>: snapshot}`, lives on a document (`data.fks`).

They sit in separate object spaces so they never collide at runtime — looks merely nominal.

### Why split (the real reason — not the name clash)
The model-core tables **are the model expressed as data**, and the schema editor is driven by the
**same** `DataList` / `DataField` / `descriptor` engine as business data — "utiliser l'interface
pour gérer l'interface." For that, a model **definition** must be parseable the **same way** a
record is. One overloaded name blocks the uniform parse. Confirmed pattern from idae-legacy.

The recent denorm-feed work (commits `fa4e9d81`, `e4d401a7`, `e21e90c5`) is a clever patch that
made FK **render** work — it did NOT rationalize the naming. We're early MVP and want max
rationalization, so do it properly rather than keep the patch shape.

### Decision (2026-06-21, user)
- Rename **model-side** `fks` → `fkRelations`. Leave **record-side** `fks` = value bag only.
- Probably add `order?` to the relation def (`MachineFkDef`). User flagged an "order cascade" but
  the mechanism is **not yet captured** — **ask the user to re-explain before adding `order`.**

### Touch-points (model-side `fks` → `fkRelations`)
- `src/lib/types/machine-model.ts` — `MachineCollectionModel.fks` (L124), `MachineFkDef` (L49).
- `src/lib/main/machine/MachineScheme.ts` — `get fks()` (L56), `findFkField`, `parseReverseFkFields` (L205-226).
- `src/lib/main/machine/MachineSchemeValues.ts#descriptor` (L313).
- `src/lib/main/machine/MachineSchemeField.ts#getFieldRule` (L67).
- `src/lib/main/machine/MachineFkFold.ts#foldFksIntoRecord(fks, …)` (param = def block).
- `server/src/validation/FkFolder.ts#foldFks` → `colModel.fks`.
- `server/src/bootstrap/publishModel.ts` — reads model def, reifies into the model-core tables.
- Scheme literals: `server/src/models/*/*Scheme.ts`, `src/lib/ai/schema/*.ts`,
  fixtures `src/lib/__fixtures__/demoModel.ts`, every `*.test.ts` with `fks: {…}` in a model object.

### Do NOT touch (record-side value bag — stays `fks`)
`data.fks`, `record.fks`, `out.fks`, the `fks.<rel>` / `fks.<rel>_<id>` snapshot bag,
`FksItem` in `entity-types.ts`, `resolvePresentationToken`, `readFkSnapshot`/`readFkRaw`
in `DataField.svelte`. (`'fks.appscheme.code'`-style store queries read the record bag — keep.)

### Orthogonal cheap win (can do first, independently)
✅ DONE 2026-06-21. `DataField.svelte` `.field-label`: was fixed `flex: 0 0 90px` truncating long
relation names (e.g. `appscheme_view_type`). Now `flex: 0 1 auto` with `min/max-width` tokens
(`--field-label-min-w`/`--field-label-max-w`) so short labels stay tight and long ones grow up to
the cap before ellipsis; added `title={fieldLabel}` tooltip.

**Effort:** L (split) · S (CSS) · **Risk:** M (guardrail = the two lists above; don't conflate sides).

---

## 2. `appscheme_*` string literals are a code smell

**Status:** 🟡 partially addressed 2026-06-21 · rest noted, opportunistic.

### Done
`src/lib/main/warmupUtils.ts#getSchemaCriticalCollections` carried a hardcoded
`coreSchemaCollections` fallback list (`'appscheme'`, `'appscheme_field'`, …) "just in case" the
base-filter missed them. It was dead weight: every model-core collection already declares
`base: 'machine_app'` in `idae-model-core.ts`, so the base-filter alone covers them. Removed the
fallback — now purely model-driven (no literal collection-name list to drift).

### Remaining (architecturally harder, left as direction)
`useViewFields.svelte.ts`, `DataField.svelte`, `Explorer.svelte` (`groupBy="fks.appscheme_base"`)
still call `machine.store('appscheme_view', …)` / check `'appscheme' in model` with the literal
name. This is different from the warmup case: querying `appscheme`/`appscheme_view` IS how you
read the model in the first place (chicken-and-egg — there's no metadata to derive the name of the
metadata-holding collection from). Not a quick win; would need a structural indirection (e.g. a
well-known semantic role flag instead of a name match) — left for a future deliberate pass, not
touched here.

### What
The **only fixed naming rule is `machine_app`** (the app / namespace). The model-core tables are
`appscheme_*` (they express/store the format of the model + data collections), and `appscheme` is
the collection that lists **all** collections of the base — including the `appscheme_*` ones
themselves (`machine_app.appscheme` = registry of every collection, model + business).

But the `appscheme_` **prefix is NOT a guaranteed contract.** So any hardcoded
`appscheme_field` / `appscheme_view` / `appscheme_view_type` / `appscheme` literal in code is fragile.

### Where literals leak today
`src/lib/data-ui/utils/useViewFields.svelte.ts`, `server/src/bootstrap/publishModel.ts`,
`src/lib/data-ui/field/DataField.svelte` (appscheme name lookup), and likely others.

### Direction
Derive these collection names from `machine_app` / model metadata, not literals. Especially
relevant in #1 since `publishModel` reifies the model def into these tables.

**Effort:** M · **Risk:** L.
