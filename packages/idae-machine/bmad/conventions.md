# Conventions — idae-machine

## Code style

- Indentation: Tabs
- Quotes: Single
- Trailing commas: No
- Line width: 100 chars

## Svelte 5 rules

- `$state`, `$derived`, `$effect` — no `$:`, no `onMount`, no `onDestroy`
- `$props()` for all props
- `$bindable()` for two-way binding
- Key all `{#each}` blocks: `{#each items as item (item.id)}`
- No `export let` in new components

## File locations

| Purpose | Location |
|---------|----------|
| Core schema logic | `src/lib/main/machine/*.ts` |
| Field parser | `src/lib/main/machineParserForge.ts` |
| Field builder helper | `src/lib/main/machine/fieldBuilder.ts` |
| Data components (DataList/DataForm/DataRecord…) | `src/lib/data-ui/data/` |
| Toolbar/find/sort/group controls | `src/lib/data-ui/controls/` |
| Field dispatch + edit | `src/lib/data-ui/field/` |
| Input atoms | `src/lib/data-ui/input/` |
| Fragments (Confirm, Skeleton, Dialog…) | `src/lib/data-ui/fragments/` |
| Frame mount + frame types (Explorer, Synthesis, Rbac) | `src/lib/shell/Frame.svelte`, `src/lib/shell/frame/` |
| Static layout shells (App, TemplateShell, TaskBar, Pane…) | `src/lib/shell/layout/` |
| Logic tests | `src/lib/main/__tests__/*.test.ts` |
| Component tests | Colocated: `Component.svelte.spec.ts` |

## Naming

- Classes: PascalCase (`MachineDb`, `MachineScheme`)
- Files: camelCase for logic, PascalCase for components
- Components: prefix = role (`Data*` for data-ui, frame-type name for shell/frame, layout name for shell/layout — no `Explorer*`/`Card*`/`Field*`/`Input*` global-prefix scheme anymore)
- Tests: `.test.ts` for logic, `.svelte.spec.ts` for components
- Props UI de visibilité de contrôle: ordre sémantique `showControlX` (`showControlSort`,
  `showControlGroup`, `showControlFind`, `showControlMode`)
- Props métier / état séparées des props UI (`sortBy`, `groupBy`, `where`, `mode` ne doivent
  pas être confondues avec les props `showControlX`)

## Schema field declaration

```ts
import { field } from '$lib/main/machine/fieldBuilder.js';

fields: {
  name: field('text', { required: true }),   // ← new world
  // name: 'text (required)',                // ← deprecated string format
}
```

## Commands

```bash
pnpm run check   # TypeScript
pnpm run test    # vitest
pnpm run build   # build library
pnpm run format  # Prettier
pnpm run lint    # Prettier check
```

## Domain actions

- Colocalisé avec le schéma — jamais dans un répertoire séparé
- Convention : `server/src/models/{domain}/actions.ts`
- Interface : `DomainActions` de `server/src/models/domainActions.ts`
- Enregistrement : `registerDomainActions(collection, actions)` au boot
- Chargement : `import './models/{domain}/actions.js'` dans `index.ts`

## Soft delete

- Champ `deletedAt: string | null` — null = record actif
- `listRecords`/`getRecord` filtrent `{ deletedAt: null }` automatiquement
- `DELETE /api/data/:table/:id` → soft delete par défaut
- `DELETE /api/data/:table/:id?permanent=true` → hard delete admin

## Validation serveur

- Règles pures dans `src/lib/main/machine/validateRules.ts` (sans dépendance browser)
- `validateField(value, rule)` + `validateRecord(data, fields)`
- Même module utilisé côté client (MachineSchemeValidate) et serveur (domain actions)
- Validation domain custom via `DomainActions.validate()` — appelée avant Model.create/update
- Réponse erreur : HTTP 422 + `{ error: 'Validation failed', errors: Record<field, message> }`
- PAS de Zod

## Dependencies

- Package manager: **pnpm** (not npm/yarn)
- Key: Svelte 5, `@medyll/qoolie` (data layer — replaced `idae-idbql`, see [[project_qoolie_migration]]), `@medyll/idae-slotui-svelte`

## Image presets

- Entité système : `appimage_preset` (idae-model-core.ts)
- Seedés au boot : thumb, square, small, medium, large, banner, avatar
- Free notation : `free-WxH` / `free-wW` / `free-hH` → auto-créés à la 1ère requête (flag `auto: true`)
- DOS bounds : 16..4096 px (config.image.minDim/maxDim)
- Registry cache : `ImagePresetRegistry.ts` — invalidation hook-driven (priority 10)
- Resolver : `ImageResolver.ts` — DB lookup + free notation auto-create + duplicate catch
- Champ schema : `field('image', { presets: ['thumb', 'banner'], free: false })`
- Focus point : `FileMeta.image.focus` réservé pour crop intelligent futur (UI focus-pin)
- Endpoint : `PATCH /api/files/:fileId/focus` body `{ x, y }` (0..1 normalisés)

## DataList snippet API (S32 — 2026-05-23)

`DataList` is **data provider + renderer**. Consumer provides named snippets, DataList owns the loop and the `<ul>` wrapper.

**Props:**
- `collection`, `where?`, `sortBy?`, `groupBy?`, `pageSize?`, `page?`
- `listClass?` → CSS class on `<ul>`
- `groupClass?` → CSS class on group wrapper `<div>`

**Snippets:**
- `item({ record, idx, fieldValues })` — REQUIRED. Renders one `<li>` per record.
- `groupHeader?({ key, count })` — group section header (when `groupBy` set).
- `empty?()` — empty state placeholder.
- `footer?({ pagination })` — pagination/footer block.

**Pitfall — scoped CSS:** styles applied via `listClass`/`groupClass` live on elements rendered by DataList, not by the parent. Svelte scopes parent CSS, so selectors like `.explorer-group` won't match. Use `:global(.explorer-group) { … }` in parent `<style>`, or move to `app.css`.

**Old API (`children({ items, groups, pagination })`) removed.** Migrate by extracting the inner `<li>` markup into the `item` snippet and moving wrapper class to `listClass`.

## FicheToolbar → RecordToolbar rename (BL-22 — 2026-06-24)

`shell/layout/FicheToolbar.svelte` renamed to `RecordToolbar.svelte` — it's a record-level
action toolbar (`{collection, collectionId}`), not specific to the Fiche frame. Now also
mounted inside `ContextMenuContent.svelte`'s contextual menu (any consumer with a resolved
`collection`+`collectionId` gets the same toolbar). Callers updated: `Fiche.svelte`,
`Synthesis.svelte`, `ContextMenuContent.svelte`. The `<toolbar-component>` custom tag and its
3 `ButtonAction` bricks (synthese/diagram/update) are unchanged — import path only.
