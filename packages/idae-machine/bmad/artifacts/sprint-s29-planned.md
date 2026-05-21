# Sprint 29 — Explorer vars + CollectionNav

**Goal:** Explorer fully configurable via vars. Sidebar becomes a dedicated CollectionNav component.

**Date:** 2026-05-21
**Status:** planned
**Depends on:** S28 (IDB drift detection complete)

---

## Context

S28 complete (454/454). Three gaps identified:

1. `Explorer.svelte` accepts `vars` prop but only `mode` is forwarded from Frame.svelte.
   `where`, `sortBy`, `groupBy`, `pageSize` — ignored.
2. AppShell sidebar is a 20-line inline DataList[appscheme] block — not reusable.
3. No UI to switch mode (list → table → card) once Explorer is loaded.

---

## Core principle

`vars` is the configuration contract between `machine.loadFrame()` and mounted components.
Any prop Explorer accepts should be settable via `vars`.
CollectionNav = first-class component, not an AppShell implementation detail.

---

## Stories

### S29-01 — Frame.svelte forwards full vars to Explorer (S)

**What:** `Frame.svelte doLoad()` currently only extracts `vars.mode`.
Forward all known Explorer vars: `mode`, `where`, `sortBy`, `groupBy`, `pageSize`.

**Files:** `src/lib/shell/frame/Frame.svelte`

**AC:**
- `doLoad()` maps vars → Explorer props: `mode`, `where`, `sortBy`, `groupBy`, `pageSize`
- `where` parsed from JSON string if vars value is string
- `sortBy` parsed from `"field:direction"` notation e.g. `"name:asc"`
- No breaking change to existing `machine.loadFrame('explorer', col, id, { mode:'card' })`

---

### S29-02 — Explorer reads vars internally for groupBy/sortBy/pageSize (M)

**What:** Explorer.svelte uses `vars` to override default behaviour.

**Files:** `src/lib/shell/explorer/Explorer.svelte`

**AC:**
- `vars.sortBy` applied to DataList (forwarded as prop)
- `vars.groupBy` applied to DataList (forwarded as prop)
- `vars.pageSize` overrides default 20
- `vars.where` merged with prop `where` (prop takes precedence)
- Existing `mode` prop behavior unchanged

---

### S29-03 — Explorer mode switcher toolbar (M)

**What:** Toolbar with list/table/actions toggle buttons, rendered above collection content.

**Files:** `src/lib/shell/explorer/Explorer.svelte`

**AC:**
- Toolbar shows 3 buttons: List / Table / Actions (card mode = opened via record click, not toggled)
- Active mode highlighted
- Toggle updates `mode` local state → re-renders content area
- Toolbar hidden when `mode === 'card'` (detail view)
- No new file — inline in Explorer.svelte

---

### S29-04 — CollectionNav component (M)

**What:** Dedicated sidebar nav component. Replaces inline DataList[appscheme] block in AppShell.

**File:** `src/lib/shell/layout/CollectionNav.svelte` (new)

**Props:**
```ts
{
  activeCollection?: string;    // highlights active item
  onSelect?: (code: string) => void;  // callback on click
  filter?: string[];            // optional allowlist of collection codes
  sortBy?: { field: string; direction: 'asc' | 'desc' };  // default: order:asc
}
```

**AC:**
- Uses `DataList collection="appscheme"` internally
- Active item highlighted via `class:active`
- Click calls `onSelect(code)` if provided, else `machine.loadFrame('explorer', code, undefined, { mode: 'list' })`
- `filter` prop hides collections not in list
- Exported from `src/lib/shell/layout/index.ts` and `src/lib/index.ts`

---

### S29-05 — AppShell uses CollectionNav (S)

**What:** Replace inline DataList[appscheme] block in AppShell default sidebar with `<CollectionNav>`.

**Files:** `src/lib/shell/layout/AppShell.svelte`

**AC:**
- Default sidebar: `<CollectionNav activeCollection={activeCollection} onSelect={handleCollectionClick} />`
- `activeCollection` state + `handleCollectionClick()` remain in AppShell (no change to logic)
- AppShell imports CollectionNav (no DataList import needed for sidebar)
- Same visual result as before

---

### S29-06 — Tests (M)

**What:** Unit tests for new/changed logic.

**Files:** `src/lib/main/__tests__/collectionNav.test.ts` (new)

**AC:**
- CollectionNav renders items from mocked appscheme store
- Active item has `active` class
- `filter` prop hides non-listed codes
- Explorer mode switcher changes displayed mode
- Frame vars forwarding: `mode`/`where`/`sortBy`/`groupBy`/`pageSize` mapped to props
- Full suite still green (454+N / 454+N)

---

## Effort summary

| ID | Title | Effort |
|----|-------|--------|
| S29-01 | Frame forwards full vars | S |
| S29-02 | Explorer reads vars internally | M |
| S29-03 | Explorer mode switcher toolbar | M |
| S29-04 | CollectionNav component | M |
| S29-05 | AppShell uses CollectionNav | S |
| S29-06 | Tests | M |

Total: 1S + 4M + 1S = ~2S + 4M = comfortable sprint (no L stories)

---

## Key invariants

- `vars` parsing stays in Frame.svelte — Explorer stays dumb about frames
- CollectionNav has no frame awareness — pure UI + callback
- DataList[appscheme] is still the data source for CollectionNav (not a custom query)
- Mode switcher stores state locally in Explorer — no external state

---

## Definition of Done

- [ ] 6/6 stories complete
- [ ] Full test suite green (≥ 460 tests)
- [ ] `pnpm run check` — 0 new errors
- [ ] CollectionNav exported from index.ts
- [ ] Explorer mode switcher works in all 3 modes
