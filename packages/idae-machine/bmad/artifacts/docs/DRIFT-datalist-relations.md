# Drift Report — DataListFk / DataListRfk / DataListRelations

> Date: 2026-06-01 | Scope: `src/lib/data-ui/data/` FK relation viewers
> Trigger: user flagged DataListRelations.svelte + DataListFk.svelte as surnuméraires / drift

## 1. Current structure

```
DataListFk.svelte      (8 lines)  → <DataListRelations direction="forward" />
DataListRfk.svelte     (8 lines)  → <DataListRelations direction="reverse" />
DataListRelations.svelte (101 ln) → resolve relations → N × <DataList where=… />
dataRelationUtils.ts   (126 ln)   → resolveForwardRelations / resolveReverseRelations (pure)
```

Chain: `Fk/Rfk` → `Relations` → `DataList`. **Triple indirection.**

## 2. Drift findings

### D1 — Middle layer not in original ADR (architectural drift)
S40 spec (memory `project_idae-machine-*`, ADR S40-03/04): *"DataListFk/Rfk = wrapper around DataList"*.
Reality: Fk/Rfk wrap **DataListRelations**, which wraps DataList. A 3rd component was
inserted between spec'd wrapper and DataList. The 8-line files now carry zero logic —
they flip one string constant (`direction`).

### D2 — Naming drift (4 names, 1 component)
| Surface | Name |
|---|---|
| File | `DataListRelations.svelte` |
| `@role` tag | `data-relations` |
| Test file | `DataRelations.svelte.test.ts` |
| Memory index | "DataRelations" |

Filename says `DataListRelations`; everything else says `DataRelations`. Inconsistent.

### D3 — Asymmetric usage (dead-ish export)
- `DataListRfk` — used in prod: `Synthesis.svelte:174`.
- `DataListFk` — **prod usage = 0**. Referenced only in `DataRelations.svelte.test.ts`.

Both exported from `index.ts` (L11-12) + `data-ui/data/index.ts` (L3-4). Half the public
surface is test-only.

### D4 — Pure passthrough files
`DataListFk.svelte` / `DataListRfk.svelte` add no behavior. 8 lines each = prop spread +
one literal `direction`. Pure indirection cost.

## 3. Option évaluée : variant de DataList

**User idea:** call `DataList` with a variant instead of separate files.

**Verdict: reject.** Altitude mismatch.

| | DataList | Relations |
|---|---|---|
| Input | 1 collection | 1 **record** |
| Output | N items (one list) | N relation **sections**, each its own DataList |
| Shape | 1→N items | 1→N **lists** (fan-out) |
| Needs | `where`, sort, group, paginate | record resolution + FK schema walk + N×DataList |

A `variant="relations"` prop would inject record-centric fan-out + FK resolution into the
collection-centric renderer (already 543 lines). DataList renders ONE collection's rows;
Relations renders a record's outgoing/incoming edges. Different domain, different altitude.
Merging bloats DataList and couples it to `dataRelationUtils`. **Don't.**

## 4. Recommendation — collapse indirection, keep the logic component

Kill the two passthrough files. One exported component, `direction` as prop.

```
DELETE  DataListFk.svelte
DELETE  DataListRfk.svelte
RENAME  DataListRelations.svelte → DataRelations.svelte   (aligns role + test + memory)
KEEP    dataRelationUtils.ts                               (pure, correct altitude)
```

Public API:
```svelte
<!-- before -->
<DataListRfk {collection} recordId={id} />
<DataListFk  {collection} recordId={id} />

<!-- after -->
<DataRelations {collection} recordId={id} direction="reverse" />
<DataRelations {collection} recordId={id} direction="forward" />  <!-- default forward -->
```

Net: **3 files → 1**, **2 exports → 1**, naming unified. Update:
- `index.ts` / `data-ui/data/index.ts` — single `DataRelations` export
- `Synthesis.svelte:174` — `DataListRfk` → `DataRelations … direction="reverse"`
- `DataRelations.svelte.test.ts` — render `DataRelations` w/ direction prop (already correctly named)

### If API stability matters
Keep `DataListFk` / `DataListRfk` as **named re-exports** in `index.ts` only (no separate
`.svelte` files):
```ts
export { default as DataRelations } from '$lib/data-ui/data/DataRelations.svelte';
// optional back-comat aliases — but prefer dropping pre-1.0
```
Pre-1.0 (v0.136.0) → just rename, no back-compat debt.

## 5. Effort

S — mechanical. Delete 2 files, rename 1, update 2 import sites + 1 test. `direction`
default `'forward'` preserves the common case. ~20 min + test run.
