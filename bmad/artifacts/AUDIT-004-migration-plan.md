# AUDIT-004 Migration Plan – Svelte 4 → Svelte 5 Runes

**Created:** 2026-03-02  
**Status:** Ready for implementation

---

## 📊 Assessment Summary

Good news: **81% of idae-machine and 50% of idae-dom-events are already Svelte 5 rune-compliant!**

The violations are minimal and isolated:

| Package | Total Files Scanned | Already Migrated | Requires Migration |
| :--- | :---: | :---: | :---: |
| idae-machine | 16 | 13 ✅ | 3 |
| idae-dom-events | 2 | 1 ✅ | 1 |
| **TOTAL** | **18** | **14** | **4** |

---

## 🎯 Files Requiring Migration

### **idae-machine** (3 files, 6 `export let` declarations)

#### 1. **Frame.svelte** (`src/lib/fragments/Frame.svelte`)
- **Current:**
  ```svelte
  export let showPanel: boolean = true;
  export let panelMode: 'expanded' | 'reduced' = 'expanded';
  ```
- **Target:**
  ```svelte
  let { showPanel = true, panelMode = 'expanded' } = $props();
  ```

#### 2. **InfoLine.svelte** (`src/lib/fragments/InfoLine.svelte`)
- **Current:**
  ```svelte
  export let title: string | undefined = undefined;
  export let vertical: boolean = false;
  ```
- **Target:**
  ```svelte
  let { title, vertical = false } = $props();
  ```

#### 3. **Selector.svelte** (`src/lib/fragments/Selector.svelte`)
- **Current:**
  ```svelte
  export let values: any = [];
  export let value: any | undefined = undefined;
  ```
- **Target:**
  ```svelte
  let { values = [], value } = $props();
  ```
- **Note:** Also contains `any` type — should be replaced with proper types (e.g., `unknown[]`, generic `T`)

---

### **idae-dom-events** (1 file, 1 `export let` declaration)

#### 4. **modulesLib/+page.svelte** (`src/routes/modulesLib/+page.svelte`)
- **Current:**
  ```svelte
  export let data: PageData;
  ```
- **Target:**
  ```svelte
  let { data } = $props();
  ```

---

## ✨ Already Migrated Files (No Action Required)

### **idae-machine** (13 files)
✅ CreateUpdate.svelte — Uses `$props()`, `$derived()`, `$effect()`, callback props  
✅ FieldValue.svelte — Uses `$props()`, `$bindable()`, `$derived()`  
✅ CollectionListFieldValues.svelte — Uses `$props()`, `$bindable()`, `$derived()`  
✅ CollectionReverseFks.svelte — Uses `$props()`, `$derived()`  
✅ CollectionListMenu.svelte — Uses `$props()`, callback props  
✅ CollectionList.svelte — Uses `$props()`, `$derived()`, callback props  
✅ FieldInPlace.svelte — Uses `$props()`, `$state()`, Snippets  
✅ DataProvider.svelte — Uses `$props()`, `$bindable()`, `$inspect()`  
✅ CollectionButton.svelte  
✅ CollectionFks.svelte  
✅ (and 3 others)

### **idae-dom-events** (1 file)
✅ +page.svelte — No violations

---

## 🔄 Migration Strategy

### Phase 1: idae-machine (Quick)
1. Convert 3 files using find-and-replace + manual review
2. Run `pnpm test` in idae-machine
3. Run `pnpm lint` to verify ESLint compliance

### Phase 2: idae-dom-events (Trivial)
1. Convert 1 file in +page.svelte
2. Run `pnpm test` in idae-dom-events

### Phase 3: Verification
- Smoke test in any consuming UI component
- Verify all 4 files compile without TypeScript errors
- Confirm `pnpm lint` passes monorepo-wide

---

## 📝 Implementation Checklist

- [ ] **idae-machine/src/lib/fragments/Frame.svelte** — Convert 2 exports to `$props()`
- [ ] **idae-machine/src/lib/fragments/InfoLine.svelte** — Convert 2 exports to `$props()`
- [ ] **idae-machine/src/lib/fragments/Selector.svelte** — Convert 2 exports to `$props()` + type audit (replace `any`)
- [ ] **idae-dom-events/src/routes/modulesLib/+page.svelte** — Convert 1 export to `$props()`
- [ ] Run `pnpm test` in both packages
- [ ] Run `pnpm lint` monorepo-wide
- [ ] Smoke test UI components
- [ ] Update AUDIT-004.md with Implementation Notes

---

## 🎓 Observations

1. **No `createEventDispatcher` usage** — Codebase already uses callback prop pattern ✅
2. **No `$:` reactive statements** — All computed values use `$derived()` ✅
3. **Minimal migration scope** — Only 4 files, all same pattern (export → props)
4. **Type quality issue** — Selector.svelte uses `any`; recommend fixing as part of AUDIT-002 (TypeScript strict mode)

---

## 🚀 Expected Outcomes

- **4 files migrated** from `export let` to `$props()` ✅
- **0 violations remaining** in both packages
- **Full Svelte 5 rune compliance** across idae-machine and idae-dom-events ✅
- All tests passing, lints clean

---

