# Test Results — Sprint 43

> Story: S43-01 — DataRecord mode="row" + svelte:element — conformité ADR-06
> Date: 2026-06-01
> Status: ✅ PASS

## svelte-check

```
svelte-check found 0 errors and 0 warnings
```

## Vitest (client + server)

```
Test Files  52 passed (52)
     Tests  586 passed (586)
  Duration  7.72s
```

## Acceptance criteria

- [x] `DataRecord` accepte `mode="row"` — type TS valide, 0 erreurs svelte-check
- [x] `mode="row"` émet `<td><DataField/></td>` par field présent dans `effectiveData`
- [x] `DataList` table tbody utilise `{@render renderItem(...)}` — aucun `{#each tableColumns}` dans tbody
- [x] `renderItem` snippet utilise `<svelte:element this={currentMode === 'table' ? 'tr' : 'li'}>`
- [x] `import DataField` absent de `DataList.svelte` (grep DataField DataList.svelte = 0)
- [x] `tableColumns` présent uniquement dans `<thead>` (grep tableColumns DataList.svelte = headers only)
- [x] `mode='list'` et `mode='grid'` — comportement inchangé (586/586 green)
- [x] `pnpm check` 0 erreurs, 0 warnings
- [x] `pnpm test` 586/586 tests verts (client)
