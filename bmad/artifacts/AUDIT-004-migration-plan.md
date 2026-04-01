# AUDIT-004: Svelte 4 → Runes Migration Plan

**Date:** 2026-03-30  
**Priority:** High  
**Estimated Effort:** 2-3 hours  
**Risk:** Low (isolated demo/test files)

---

## Summary

Status.yaml indicates AUDIT-004 covers Svelte 4 → runes migration for:
- **idae-machine:** 3 files (per backlog note)
- **idae-dom-events:** 1 file (per backlog note)

Actual scan found **4 files total** using Svelte 4 patterns (`export let`, `onMount`, `$:`).

---

## Files Requiring Migration

### 1. idae-machine — UI Components (2 files)

#### 1.1 `CollectionTable.svelte`
**Location:** `packages/idae-machine/src/lib/ui/CollectionTable.svelte`

**Current (Svelte 4):**
```svelte
<script lang="ts">
export let items = [];
export let columns: string[] = [];
</script>
```

**Target (Svelte 5):**
```svelte
<script lang="ts">
let { items = [], columns = [] } = $props();
</script>
```

**Complexity:** ✅ Trivial (props only)

---

#### 1.2 `CollectionCard.svelte`
**Location:** `packages/idae-machine/src/lib/ui/CollectionCard.svelte`

**Current (Svelte 4):**
```svelte
<script lang="ts">
export let items = [];
</script>
```

**Target (Svelte 5):**
```svelte
<script lang="ts">
let { items = [] } = $props();
</script>
```

**Complexity:** ✅ Trivial (props only)

---

### 2. idae-machine — Demo Components (2 files)

#### 2.1 `CollectionTable.svelte` (demo)
**Location:** `packages/idae-machine/src/lib/demo/CollectionTable.svelte`

**Current (Svelte 4):**
```svelte
export let collection: string;
export let items: any[] = [];
```

**Target (Svelte 5):**
```svelte
let { collection, items = [] } = $props();
```

**Complexity:** ✅ Trivial

---

#### 2.2 `CollectionCard.svelte` (demo)
**Location:** `packages/idae-machine/src/lib/demo/CollectionCard.svelte`

**Current (Svelte 4):**
```svelte
export let collection: string;
export let items: any[] = [];
```

**Target (Svelte 5):**
```svelte
let { collection, items = [] } = $props();
```

**Complexity:** ✅ Trivial

---

### 3. idae-dom-events — Demo Page (1 file)

#### 3.1 `+page.svelte`
**Location:** `packages/idae-dom-events/src/routes/+page.svelte`

**Current (Svelte 4):**
```svelte
<script lang="ts">
import { onMount } from 'svelte';
let timer: NodeJS.Timeout;

onMount(() => {
  playIt(timerDelay);
  return () => {
    clearTimeout(timer);
  };
});
</script>
```

**Target (Svelte 5):**
```svelte
<script lang="ts">
let timer: ReturnType<typeof setTimeout>;

$effect(() => {
  playIt(timerDelay);
  return () => {
    clearTimeout(timer);
  };
});
</script>
```

**Complexity:** ⚠️ Moderate (lifecycle migration)

**Note:** Also uses `on:click` syntax → migrate to `onclick`

---

## Migration Checklist

- [ ] **idae-machine** (4 files)
  - [ ] `src/lib/ui/CollectionTable.svelte` — `export let` → `$props()`
  - [ ] `src/lib/ui/CollectionCard.svelte` — `export let` → `$props()`
  - [ ] `src/lib/demo/CollectionTable.svelte` — `export let` → `$props()`
  - [ ] `src/lib/demo/CollectionCard.svelte` — `export let` → `$props()`

- [ ] **idae-dom-events** (1 file)
  - [ ] `src/routes/+page.svelte` — `onMount` → `$effect`, `on:click` → `onclick`

- [ ] **Testing**
  - [ ] Run `pnpm --filter idae-machine check` (TypeScript)
  - [ ] Run `pnpm --filter idae-dom-events check` (TypeScript)
  - [ ] Run `pnpm --filter idae-machine test:unit` (if tests exist)
  - [ ] Run `pnpm --filter idae-dom-events test:unit` (if tests exist)

- [ ] **Documentation**
  - [ ] Update `packages/idae-machine/README.md` (remove Svelte 4 references if any)
  - [ ] Update `packages/idae-dom-events/README.md` (remove Svelte 4 references if any)

---

## Migration Rules

### Props
```svelte
<!-- Svelte 4 -->
<script>
  export let name = 'default';
  export let items = [];
</script>

<!-- Svelte 5 -->
<script>
  let { name = 'default', items = [] } = $props();
</script>
```

### Lifecycle
```svelte
<!-- Svelte 4 -->
<script>
  import { onMount } from 'svelte';
  onMount(() => {
    // setup
    return () => { /* cleanup */ };
  });
</script>

<!-- Svelte 5 -->
<script>
  $effect(() => {
    // setup
    return () => { /* cleanup */ };
  });
</script>
```

### Event Handlers
```svelte
<!-- Svelte 4 -->
<button on:click={handler}>Click</button>

<!-- Svelte 5 -->
<button onclick={handler}>Click</button>
```

### Reactive Statements
```svelte
<!-- Svelte 4 -->
<script>
  $: doubled = count * 2;
</script>

<!-- Svelte 5 -->
<script>
  let doubled = $derived(count * 2);
</script>
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes | Low | All files are demo/test components, not core logic |
| Type errors | Low | TypeScript will catch issues during `check` |
| Runtime bugs | Low | Simple migrations, no complex reactivity patterns |
| Test failures | Low | Tests will validate behavior remains unchanged |

---

## Success Criteria

✅ All `export let` statements replaced with `$props()`  
✅ All `onMount()` calls replaced with `$effect()`  
✅ All `on:event` syntax replaced with `onevent`  
✅ TypeScript compilation passes (`pnpm run check`)  
✅ All existing tests pass  
✅ No Svelte 4 warnings in dev server

---

## Estimated Timeline

| Phase | Duration | Output |
|-------|----------|--------|
| Migration (idae-machine) | 30 min | 4 files updated |
| Migration (idae-dom-events) | 30 min | 1 file updated |
| Testing & validation | 30 min | All checks green |
| Documentation | 15 min | README updates |
| **Total** | **~2 hours** | ✅ Complete |

---

## Recommendation

**Proceed with migration.** All files are low-risk demo/test components. The migration is straightforward and will bring the packages fully up to Svelte 5 standards.

**Next action:** Execute migration (Developer role) → `bmad continue`

---

**Related Stories:**
- ✅ AUDIT-003: @ts-ignore → @ts-expect-error + ban-ts-comment rule
- ✅ AUDIT-SLOTUI-001: Remove @ts-ignore from idae-slotui
- ⏳ AUDIT-004: Svelte 4 → runes migration (this plan)
