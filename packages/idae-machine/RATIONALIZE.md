# RATIONALIZE.md — model-core rationalization backlog

> Early-MVP rationalization of the model-core. Distinct from `bmal/intake-sources/UNHACK.md`
> (which was a closed workaround-elimination audit). This file tracks **deliberate
> structural simplifications** we choose to make now, while the surface is still small.
>
> Each item: **what · why · decision · touch-points · do-not-touch · effort/risk · status.**
> Nothing here is implemented until its status says so.

---

## 1. Split `fks`: model-def `fkRelations` vs record value-bag `fks`

**Status:** 🟡 decided (useful + necessary) · NOT started · implement later.

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
The trigger bug was `DataField.svelte:310` `--field-label-w: 90px` truncating long relation names
(e.g. `appscheme_view_type`). Pure CSS — adaptive/token-driven width + `title` tooltip. No split needed.

**Effort:** L (split) · S (CSS) · **Risk:** M (guardrail = the two lists above; don't conflate sides).

---

## 2. `appscheme_*` string literals are a code smell

**Status:** 🟡 noted · address opportunistically (and while doing #1).

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
