# Investigation: `fkTargetCol` / `fkTargetField` as Flat Fields on `appscheme_field`

> **Author**: opencode (qwen3.7-max)
> **Date**: 2026-05-30
> **Status**: Investigation report — no code changes applied
>
> **Contributor**: Claude Opus 4.8 (Claude Code) — 2026-05-30
> Added §10: live browser verification, a secondary bug found **and fixed**
> (`null` rendered as the literal string `"null"`), and remediation Option E
> (`private: true`). One code change applied — see §10.3.
>
> **Contributor**: GitHub Copilot CLI (GPT-5.4) — 2026-05-30
> Added §11: system placement, categorical classification, contamination path,
> git-history trace, and a concise architectural verdict.
>
> **Contributor**: GitHub Copilot CLI (GPT-5.4) — 2026-05-30
> Added implementation note in §12: Path A is now applied in code with strict
> cleanup (`fieldType` persisted, legacy `fkTarget*` removed on rewritten docs).

---

## 1. Summary

`fkTargetCol` and `fkTargetField` are declared as **regular data fields** on the `appscheme_field` collection. They are a quick-win shortcut that bypasses the intended FK mechanics. They exist solely to transport FK target metadata (which collection, which field) through the bootstrap → MongoDB → server round-trip, so the runtime can reconstruct the composite `fk-{collection}.{field}` type string.

---

## 2. Where They Are Declared

### 2.1 Seed model declaration (`src/lib/types/idae-model-core.ts:112-113`)

```ts
appscheme_field: {
    fields: {
        // ... id, code, name, color, icon, order, required, readonly, private
        fkTargetCol:   { required: false, readonly: false },
        fkTargetField: { required: false, readonly: false },
    },
    fks: {
        appscheme_field_type:  { ... },
        appscheme_field_group: { ... },
    },
}
```

They sit alongside `required`, `readonly`, `private` as flat scalar fields — not in the `fks` section, not in `gridFks`, not in `template`.

### 2.2 TypeScript interface (`src/lib/types/schema-types.ts:989-990`)

```ts
export interface AppSchemeField extends Extendable, WithEssentials {
    // ...
    fkTargetCol?:   string | null;
    fkTargetField?: string | null;
    gridFks?: { ... };
}
```

### 2.3 Compiled outputs (auto-generated, not source)

- `src/lib/types/idae-model-core.js:108-109`
- `src/lib/types/idae-model-core.d.ts:208-212`
- `src/lib/types/schema-types.d.ts:927-928`

---

## 3. Where They Are Written

### 3.1 Bootstrap deploy (`server/src/bootstrap/deployModel.ts:331-371`)

When a model field has a composite FK type like `fk-category.id`:

```ts
let fkTargetCol:   string | null = null;
let fkTargetField: string | null = null;
if (rawType.startsWith('fk-')) {
    const [tc, tf] = rawType.replace('fk-', '').split('.');
    fkTargetCol   = tc ?? null;
    fkTargetField = tf ?? 'id';
}
```

These are then written as flat properties on the `appscheme_field` document:

```ts
await upsertGetId(
    col('appscheme_field'),
    { code: fieldName },
    {
        code: fieldName,
        // ...
        fkTargetCol,
        fkTargetField,
        gridFks: fieldGridFks,
    },
);
```

The `gridFks.appscheme_field_type` is set to `{ code: 'fk' }` (the base type, not the composite), so the composite information is **lost** in the type relation — it only survives in the flat `fkTargetCol`/`fkTargetField` fields.

---

## 4. Where They Are Read

### 4.1 Server model reconstruction (`server/src/MachineServer.ts:102-104`)

When the server builds the `MachineModel` from MongoDB to serve to clients:

```ts
const rawType = (fieldDoc?.gridFks?.appscheme_field_type?.code as string) ?? 'text';
let finalType = rawType;
if (rawType === 'fk' && fieldDoc?.fkTargetCol) {
    const tf = (fieldDoc.fkTargetField as string) ?? 'id';
    finalType = `fk-${fieldDoc.fkTargetCol}.${tf}`;
}
```

This is the **only consumer** of these fields. It reconstructs the composite `fk-{col}.{field}` string that was decomposed during bootstrap.

### 4.2 Tests (`server/src/__tests__/bootstrap.test.ts:85`)

```ts
expect(fields.some((f: any) =>
    f.code === 'categoryId'
    && f.gridFks?.appscheme_field_type?.code === 'fk'
    && f.fkTargetCol === 'category'
)).toBe(true);
```

---

## 5. Where They Are NOT Used

### 5.1 Client-side UI — zero references

- `src/lib/data-ui/` — **no** component reads `fkTargetCol` or `fkTargetField`.
- `DataField.svelte` extracts FK info by parsing the `fieldType` string (`fk-category.code` → collection=`category`, target=`code`).
- `InputSelect.svelte` receives `collection` and `targetField` as props, derived from the parsed `fieldType`.
- `DataList.svelte`, `DataRecord.svelte`, `DataForm.svelte` — all work from the parsed model, never from raw `appscheme_field` documents.

### 5.2 Client-side scheme layer — zero references

- `MachineScheme.ts` — uses `fieldType.startsWith('fk-')` on the parsed model.
- `MachineSchemeField`, `MachineSchemeFieldForge` — work from `IDbForge` parsed output.
- `machineParserForge.ts` — parses `fk-{col}.{field}` strings, never touches `fkTargetCol`.

### 5.3 Model `fks` section — unrelated

The model's `fks` section (e.g., `fks: { appscheme_field_type: { code: 'appscheme_field_type', ... } }`) describes **collection-level relations** (which collections are related to this collection). It has nothing to do with field-level FK target metadata.

---

## 6. The Intended FK Mechanics (How It Should Work)

The model declaration has a **3-sibling structure** per collection (as documented in `idae-model-core.ts:39-41`):

| Sibling | Purpose |
|---------|---------|
| `fields` | Data column definitions (type, required, readonly) |
| `fks` | Relations to other collections (code, multiple, required) |
| `template` | Display hints (presentation, future: sections, fkLabelTpl) |

The FK type system works via a **composite string convention**: `fk-{targetCollection}.{targetField}`. This is:

1. **Declared** in the model via `field('fk-category.id')` (`fieldBuilder.ts:13`).
2. **Parsed** by `MachineParserForge` into `{ fieldType: 'fk-category.id', is: 'fk' }` (`machineParserForge.ts:178`).
3. **Consumed** by UI components that split the string: `fieldType.replace('fk-', '').split('.')` → `['category', 'id']` (`DataField.svelte:68-74`).
4. **Stored** in MongoDB as `appscheme_field_type.code = 'fk'` + the two flat fields.
5. **Reconstructed** by `MachineServer.getModel()` back into `fk-{col}.{field}` (`MachineServer.ts:102-104`).

The round-trip through steps 4-5 is where the quick-win lives: the composite string is **decomposed** into two flat fields for storage, then **recomposed** on read.

---

## 7. Why This Is a Problem

### 7.1 Architectural inconsistency

`fkTargetCol` and `fkTargetField` are FK metadata masquerading as data fields. They appear in:
- Field editing forms (any `DataForm` on `appscheme_field` will render them).
- Field listings and exports.
- The `AppSchemeField` TypeScript interface alongside legitimate data fields.

They are not user-editable data — they are **derived** from the field type string. Exposing them as editable fields invites corruption (e.g., user sets `fkTargetCol = 'wrong_collection'` while `appscheme_field_type.code = 'text'`).

### 7.2 Information duplication

The FK target information exists in **two places** simultaneously:
1. The composite type string `fk-{col}.{field}` (in the model definition / parsed model).
2. The two flat fields `fkTargetCol` + `fkTargetField` (in MongoDB `appscheme_field` documents).

The bootstrap always writes both. The server always reads from the flat fields to reconstruct the string. The model definition is the single source of truth, yet the storage layer has a redundant copy.

### 7.3 No validation

Nothing prevents `fkTargetCol` from referencing a non-existent collection, or `fkTargetField` from referencing a non-existent field on the target collection. The `fks` section of the model has `required` and `multiple` constraints — the flat fields have none.

### 7.4 View partitioning depends on the string, not the fields

`deployModel.ts:413-414` partitions views by checking `type.startsWith('fk-')` on the model definition, not by checking `fkTargetCol` on the stored document. The flat fields play no role in view logic.

---

## 8. Remediation Paths

> Goal: delete `fkTargetCol` and `fkTargetField` from the model declaration, the interface, the bootstrap, and MongoDB. The composite `fk-{col}.{field}` must survive the round-trip through another channel.
>
> If the goal is specifically **"remove these 2 fields without redesigning the whole FK system"**, then only **Path A** is a near-term fit.

### Path A — Store composite `fieldType` as a raw document property (recommended)

The `appscheme_field` document already carries undeclared properties (`gridFks`, `_views` on `appscheme`). Add `fieldType` the same way — written by `deployModel`, read by `MachineServer`, **not** declared in `fields`.

**deployModel.ts** — write the composite string directly:
```ts
// before (L331-337): decompose into two vars
// after:
const fieldType = rawType; // keep 'fk-category.id' as-is

// L361-373: write it as a raw property, drop fkTargetCol/fkTargetField
{
    code: fieldName,
    fieldType,  // ← raw prop, not a declared field
    required: ...,
    gridFks: fieldGridFks,
}
```

**MachineServer.ts** — read it directly:
```ts
// before (L101-105): recompose from fkTargetCol + fkTargetField
// after:
const finalType = (fieldDoc?.fieldType as string) ?? rawType;
```

**idae-model-core.ts** — delete lines 112-113.
**schema-types.ts** — delete lines 989-990.
**bootstrap.test.ts** — update assertion L85 to check `f.fieldType === 'fk-category.id'`.

Pros: minimal diff, no new abstraction, `appscheme_field_type.code` stays `'fk'` (static registry intact). Cons: `fieldType` is an undeclared property — same pattern as `gridFks`, already accepted.

### Path B — Encode in `gridFks.appscheme_field_type`

Store the composite on the existing FK relation object:
```ts
gridFks: {
    appscheme_field_type: {
        id: ftId, code: 'fk', name: 'fk',
        fieldType: 'fk-category.id',  // ← extra prop on gridFks item
    },
}
```
Server reads: `fieldDoc.gridFks.appscheme_field_type.fieldType`.

Pros: no new top-level property. Cons: pollutes `gridFksItem` semantics (it's supposed to be a relation pointer, not a data carrier). `gridFksItem<T>` interface needs extending.

### Path C — Dynamic `appscheme_field_type` entries

Store `fk-category.id` as a distinct `appscheme_field_type` record instead of collapsing to `'fk'`. The type registry gains one entry per unique FK target.

Pros: fully normalized, no extra properties anywhere. Cons: `appscheme_field_type` is `isType: true` (static registry). Dynamic entries break that contract. Bootstrap must create type records on the fly. Server reconstruction becomes trivial (`rawType` is already the composite). High blast radius for a storage concern.

### Verdict

**Path A** is the surgical option: 4 files touched, ~15 lines changed, zero impact on the type registry or `gridFks` semantics. The `fieldType` raw property is the same pattern as `_views` on `appscheme` — undeclared, written by bootstrap, read by server, invisible to generic UI.

### Minimal migration note

To actually remove the two fields cleanly:

1. stop writing them in `deployModel.ts`;
2. stop reading them in `MachineServer.ts`;
3. store/read one canonical string instead (`fieldType`);
4. delete them from `idae-model-core.ts` and `schema-types.ts`;
5. let old Mongo documents be overwritten on the next deploy/bootstrap, or run a small cleanup migration to unset both keys.

---

## 9. Full File Reference

| File | Lines | Role |
|------|-------|------|
| `src/lib/types/idae-model-core.ts` | 112-113 | Seed declaration as fields |
| `src/lib/types/schema-types.ts` | 989-990 | TypeScript interface |
| `src/lib/types/idae-model-core.js` | 108-109 | Compiled JS (auto) |
| `src/lib/types/idae-model-core.d.ts` | 208-212 | Compiled .d.ts (auto) |
| `src/lib/types/schema-types.d.ts` | 927-928 | Compiled .d.ts (auto) |
| `server/src/bootstrap/deployModel.ts` | 331-337, 370-371 | Write path (decompose + store) |
| `server/src/MachineServer.ts` | 102-104 | Read path (recompose) |
| `server/src/__tests__/bootstrap.test.ts` | 85 | Test assertion |
| `bmad/intake-sources/ARCH-SOURCE.md` | 6 | Historical reference |

### Files that do NOT reference these fields (consume FK info via parsed model)

| File | How it gets FK info |
|------|-------------------|
| `src/lib/data-ui/field/DataField.svelte:66-76` | Parses `fieldType` string (`fk-{col}.{field}`) |
| `src/lib/data-ui/input/InputSelect.svelte:6-7` | Receives `collection` + `targetField` props |
| `src/lib/main/machine/MachineScheme.ts:115` | `fieldType.startsWith('fk-')` on parsed model |
| `src/lib/main/machineParserForge.ts:78,178` | Parses `fk-` prefix from string rule |
| `src/lib/main/machine/fieldBuilder.ts:13` | `field('fk-category.id')` builder helper |

---

## 10. Runtime Verification & Additional Findings (Claude Opus 4.8, 2026-05-30)

> Added by Claude Opus 4.8. The sections above (§1–§9) are unchanged.
> This section adds empirical browser verification, corrects one nuance about
> the display path, documents a secondary bug that was **fixed**, and adds a
> remediation option not covered above.

### 10.1 Live reproduction (Playwright, real browser, demo `business` model)

Flow: Explorer → `appscheme_field` collection → open the record whose
`code = "fkTargetCol"` → fiche dialog hosts `<DataRecord {collection} {collectionId} />`.

Dialog title resolved: `appscheme_field — fkTargetCol`. The full-view `DataRecord`
rendered **11 fields**, the last two being:

```
fkTargetCol   = [null]      ← rendered as the literal text "null"
fkTargetField = [null]      ← rendered as the literal text "null"
```

This confirms §7.1 empirically: because `fkTargetCol`/`fkTargetField` are declared
in `appscheme_field.fields` (§2.1), they flow into the runtime model, become
`appscheme_field` records (created by `deployModel`), and therefore `DataRecord`
lists them as displayable fields for **every** `appscheme_field` record — showing
empty/`null` for records that do not describe an FK.

### 10.2 Correcting one nuance vs §5.1

§5.1 ("Client-side UI — zero references") is correct **literally**: no component
reads a property *named* `fkTargetCol`. But the fields still **render**, because
the leak is structural, not by-reference: they are members of the `fields` map,
and `DataRecord`/`DataField` render whatever the `fields` map contains. So "no
component references them" and "they appear in the UI" are both true — the UI
renders them generically as part of the schema, never by name.

### 10.3 Secondary bug found and FIXED — `null` → literal `"null"`

Independent of the FK-fields question, the empty values above exposed a real
formatting bug.

- **Root cause**: `src/lib/main/machine/MachineFieldType.ts` `format(value, typeId)`
  fell back to `String(value)` when the type formatter returned `undefined`.
  For `value === null`, `String(null) === "null"` — the literal four-letter
  string was painted into the field.
- **Fix applied**:

  ```ts
  format(value: unknown, typeId: FieldTypeId): string {
      // Empty values render as empty, never the literal strings "null"/"undefined".
      if (value === null || value === undefined) return '';
      const formatted = this.getFieldType(typeId)?.formatter(value);
      return formatted !== undefined ? String(formatted) : String(value);
  }
  ```

- **Verification**: same fiche re-opened → `fkTargetCol = []`, `fkTargetField = []`
  (empty). `pnpm run check` → 0 errors. `MachineFieldType.test.ts` → 23/23
  (added a regression test asserting `format(null, …) === ''`).
- **Scope note**: this fix is general (every nullable field across the app stops
  showing `"null"`); it is *not* specific to the FK fields and stands regardless
  of how §8/§10.4 is decided.

### 10.4 Remediation Option E — mark the fields `private: true` (display-only)

A minimal fix that hides the metadata from the UI **without** touching the
load-bearing storage round-trip (§3–§4, §6 steps 4–5):

```ts
// src/lib/types/idae-model-core.ts
fkTargetCol:   { required: false, readonly: false, private: true },
fkTargetField: { required: false, readonly: false, private: true },
```

- **Mechanism verified**: `machineParserForge.ts:109` maps a field rule's
  `private` flag into `fieldArgs: ['private']`; `DataField.svelte` computes
  `isPrivate = fieldForge?.fieldArgs?.includes('private')` and renders **nothing**
  when true. So the fields stay in the model/storage, the server FK
  reconstruction (`MachineServer.ts:102-104`) keeps working, but they no longer
  appear in any `DataRecord`/`DataForm`.
- **Pros**: one-line ×2, zero risk to the FK mechanic, immediately removes the
  leak. **Cons**: purely cosmetic — the architectural duplication (§7.2) and
  lack of validation (§7.3) remain. Treat as a stopgap, orthogonal to A/B/C.

### 10.5 Confirmation: the fields are load-bearing, not dead code

To be unambiguous about §6: the composite target (`{collection}.{field}`) is
**only** persisted in these two flat fields. The normalized
`appscheme_field_type.code` stores just `'fk'` (the base type) and loses the
target. `MachineServer.getModel` (`:102-104`) is the sole reader and it
*requires* `fkTargetCol` to rebuild `fk-{col}.{field}`. Therefore Options A–C
(§8) are the only paths that can *remove* the fields; Option D (document) and
Option E (hide) keep them. Deleting them outright without first relocating the
  target encoding **breaks all FK type reconstruction server-side**.
  *Update (§8 rewrite): Paths A–C now cover removal; the former Option D
  (document) and Option E (hide/private) are no longer listed — the goal is
  deletion, not concealment.*

### 10.6 Additional file references (this section)

| File | Lines | Role |
|------|-------|------|
| `src/lib/main/machine/MachineFieldType.ts` | 332-336 | `format()` — null-guard fix applied (§10.3) |
| `src/lib/main/__tests__/MachineFieldType.test.ts` | — | regression test for null formatting (§10.3) |
| `src/lib/main/machineParserForge.ts` | 107-110 | maps `private` rule → `fieldArgs:['private']` (§10.4) |
| `src/lib/data-ui/field/DataField.svelte` | 60 | `isPrivate` gate that hides private fields (§10.4) |

---

## 11. System Placement, Category Map, and Architectural Verdict (GitHub Copilot CLI, 2026-05-30)

> Added by GitHub Copilot CLI. This section does not replace any prior content.
> It reframes the investigation categorically: where the mechanism sits, what
> category each piece belongs to, how the contamination happens, and why the
> current shape reads as a quick-win rather than a first-class FK primitive.

### 11.1 Placement in the system

```text
MachineModel declaration
  field('fk-category.id')
          |
          v
deployModel() / bootstrap
  split composite FK type into:
  - appscheme_field_type.code = 'fk'
  - appscheme_field.fkTargetCol
  - appscheme_field.fkTargetField
          |
          v
MongoDB meta-collections
  appscheme_field stores both transport columns
          |
          v
MachineServer.getModel()
  recompose:
  'fk-' + fkTargetCol + '.' + fkTargetField
          |
          v
Runtime model + UI
  sees a normal parsed field type again: 'fk-category.id'
```

This places `fkTargetCol` / `fkTargetField` in a very narrow segment of the
chain: they are not part of the authoring API, not part of the client-side FK
mechanic, and not part of the runtime field parser. They exist in the
**bootstrap/storage/server round-trip** only.

### 11.2 Category map

| Category | What belongs here | Where `fkTargetCol` / `fkTargetField` actually sit |
|------|------|------|
| Authoring primitive | `field('fk-category.id')` | Not here |
| Parsed runtime primitive | `fieldType = 'fk-category.id'` | Not here |
| Collection-level schema relation | `fks: { ... }` on a collection | Not here |
| Transport/storage metadata | decomposition of FK target for persistence | **Here** |
| User-facing data field | normal `fields` entry rendered by generic UI | They are **incorrectly exposed as this too** |

This is the key mismatch: semantically they belong to **transport/storage
metadata**, but structurally they are implemented as **normal fields** on
`appscheme_field`.

### 11.3 Why they are considered fields at all

The root cause is structural:

1. `appscheme_field` is itself a schema-driven collection.
2. Any scalar value stored on an `appscheme_field` record tends to be declared in
   `appscheme_field.fields`.
3. Once declared in `fields`, the generic machinery treats it like any other
   field: typing, interfaces, views, records, forms, exports, introspection.

So the system did not merely "store two helper properties". It stored them
inside a collection whose own structure is driven by the same field mechanic.
That immediately promoted them from "technical metadata" to "official field
surface".

### 11.4 Contamination path

The contamination is automatic, not explicit:

1. `src/lib/types/idae-model-core.ts:99-114` declares `fkTargetCol` and
   `fkTargetField` inside `appscheme_field.fields`.
2. `server/src/bootstrap/deployModel.ts:358-373` writes them on
   `appscheme_field` documents.
3. `server/src/bootstrap/deployModel.ts:412-428` generates view definitions from
   `Object.keys(fields)`.
4. Therefore the two metadata columns become eligible for `full` / `flat` /
   `focus` / `fk` view composition exactly like any other declared field.
5. Generic `DataRecord` / `DataForm` / list rendering then surfaces them because
   they are part of the schema, not because the UI knows them by name.

That is why the leak is architectural. No component needs to reference
`fkTargetCol` directly for the UI to still expose it.

### 11.5 Evidence that this is a quick-win, not a first-class primitive

The pattern has the signature of a tactical bridge:

| Signal | Observation |
|------|------|
| Split/recompose pair | `deployModel.ts:331-337` splits; `MachineServer.ts:101-105` recomposes |
| Narrow usage | only the server reconstruction needs the stored values |
| No dedicated abstraction | no dedicated `fkMeta`, no typed relation object, no sub-structure |
| Runtime remains string-based | parser/UI/scheme still reason in `fk-{collection}.{field}` |
| Structural leakage | metadata has to masquerade as fields to survive the round-trip |

If this were a first-class FK primitive, the system would likely expose a single
coherent representation end-to-end. Instead, it converts:

- **authoring/runtime form**: `fk-category.id`
- **storage form**: `fk` + `fkTargetCol` + `fkTargetField`
- **runtime form again**: `fk-category.id`

That shape is consistent with a pragmatic storage shortcut.

### 11.6 Git-history trace

`git blame` on the load-bearing lines shows a two-step introduction:

| Date | Commit | What appears |
|------|------|------|
| 2026-05-15 | `48dbf5706` | split in bootstrap + recompose in `MachineServer` |
| 2026-05-16 | `029e4191c` | declaration of `fkTargetCol` / `fkTargetField` in `appscheme_field.fields` |

This sequence matters:

1. the transport mechanism appears first;
2. the field declaration is added immediately after so the transport columns can
   live inside the meta-collection model.

That ordering reinforces the interpretation that the field declaration was added
to support the transport shortcut, not because these keys were originally
designed as domain-level fields.

### 11.7 Final architectural verdict

`fkTargetCol` and `fkTargetField` are currently:

- **load-bearing** for server-side FK type reconstruction;
- **not** part of the intended public FK mechanic;
- **implemented** as normal `appscheme_field` fields for transport reasons;
- therefore **architecturally misplaced**.

The deepest issue is not their mere existence. The deeper issue is that the
chosen persistence shortcut forces transport metadata to enter the same
declarative field surface that drives generic schema, views, and UI. That is the
exact point where a technical bridge becomes a systemic leak.

---

## 12. Removal Track — Concrete Sequence (Claude Sonnet 4.6, 2026-05-30)

> Goal: delete the two fields for real. Shortest verified path consistent with
> §8's Path A verdict. Added by Claude Sonnet 4.6.

### 12.1 The one gap §8 Path A does not address — IDB-only (no MongoDB)

The server round-trip (`deployModel → MachineServer`) is one consumer. The
**client-only / IDB path** (local model, no server) does not go through
`MachineServer.getModel`. It uses the in-memory `MachineModel` built directly
from `idae-model-core.ts` by `buildEffectiveModel`. There the composite string
`fk-category.id` already lives intact in `fields[field].type` — it never
needs to be reconstructed. So removing the flat fields from `idae-model-core.ts`
is safe for the IDB path; the server path is the only one that needs Path A.

Summary: **two independent paths, one fix needed per path.**

| Path | What breaks on removal | Fix required |
|------|------------------------|--------------|
| IDB (local model) | nothing — composite already in `type` | just delete from `fields` |
| MongoDB (server) | `MachineServer.ts:102-104` reads the flat fields | Path A: write `fieldType` undeclared prop, read it back |

### 12.2 Recommended removal sequence

1. **deployModel.ts** — replace `fkTargetCol`/`fkTargetField` decompose+write
   with a single raw `fieldType: rawType` property (undeclared, like `gridFks`).
2. **MachineServer.ts** — replace the `rawType === 'fk' && fieldDoc?.fkTargetCol`
   branch with `const finalType = (fieldDoc?.fieldType as string) ?? rawType`.
3. **idae-model-core.ts** — delete lines 112-113 (`fkTargetCol`, `fkTargetField`).
4. **schema-types.ts** — delete lines 989-990 from `AppSchemeField`.
5. **bootstrap.test.ts** — update assertion to check `f.fieldType` instead of
   `f.fkTargetCol`.
6. Run `pnpm run check` (0 errors target) and the full test suite.
7. Re-deploy / re-seed MongoDB if a running instance exists (`npm run bootstrap-demo`).

Steps 1–2 are server only. Steps 3–4 are client-side type declarations.
Steps 1–2 must be done before step 7 or the server will break on the old schema.

### 12.3 Risk surface

- **No client-side code change needed.** The `fieldType` raw prop on
  `appscheme_field` is never read by any component or scheme class — only by
  `MachineServer`.
- **No IDB migration needed.** The IDB schema does not store `appscheme_field`
  documents; those live in MongoDB.
- **MongoDB documents must be re-deployed** after the change. The implemented
  Path A now writes `fieldType` and unsets `fkTargetCol` / `fkTargetField` on
  rewritten `appscheme_field` docs. Stale docs that have not gone through
  bootstrap/redeploy remain incompatible with the chosen strict-cleanup policy.
