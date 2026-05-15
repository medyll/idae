# CLAUDE.md — idae-machine AI Reference

> Master reference for AI agents. Read this before touching any code.

---

## 1. What is idae-machine?

`@medyll/idae-machine` is the **modern rewrite** of `idae-legacy` (a PHP/PrototypeJS SPA from 2015).  
It is the **central package** of the `/idae` monorepo — a schema-driven, offline-first, full-stack framework built on:

- **SvelteKit + Svelte 5 runes** (UI)
- **IndexedDB via `@medyll/idae-idbql`** (client data layer)
- **Express + MongoDB** (server, in `server/`)
- **Socket.IO** (real-time sync)

The philosophy: declare a schema once → get CRUD UI, validation, routing, real-time sync for free.

---

## 2. Monorepo context (`D:/development/idae/packages/`)

| Package | Role |
|---------|------|
| `idae-machine` | **Central package** — schema-driven CRUD framework |
| `idae-idbql` | IndexedDB ORM with reactive Svelte 5 state |
| `idae-sync` | Background sync: IndexedDB ↔ server |
| `idae-api` | HTTP client layer |
| `idae-router` | Schema-driven SPA routing |
| `idae-socket` | Socket.IO client |
| `idae-stator` | State management |
| `idae-slotui` | UI primitives (MenuList, Button, etc.) |

**Rule:** `idae-idbql` is shared — changes to it affect all packages.

---

## 3. Legacy lineage (`D:/development/idae-legacy/`)

idae-machine is the TypeScript/Svelte successor of the PHP legacy app.  
Key concept mapping:

| Legacy (PHP) | idae-machine | Notes |
|---|---|---|
| `appscheme` / `app/app` | `IdbqModel` + `MachineScheme` | Schema definition |
| `app_liste` family | `explorer/` components | Collection browser |
| `app_fiche` family | `card/` components | Single record |
| `app_field_update` | `field/FieldDisplay.svelte` | Field edit in place |
| `appscheme_field` | `template.fields` + `FieldList` | Field catalog |
| `appscheme_field_type` | `MachineSchemeFieldType` registry | Type definitions |
| `app_droit` / RBAC | `AppUserGrant` (types only, stub) | Permissions |
| `search_item` | `explorer/ExplorerFilter.svelte` | Search |

Legacy source: `D:/development/idae-legacy/idae/web/mdl/app/`  
Legacy BP blueprint: `D:/development/idae-legacy/cf_module_bp.md`

---

## 4. Core architecture

```
Machine (singleton)
  └── MachineDb
        └── MachineScheme(collection)
              ├── .template            → {index, presentation, fields, fks}
              ├── .parse()             → all fields as IDbForge
              ├── .field(name)         → MachineSchemeField.parse() → IDbForge
              ├── .fieldForge(name, data) → MachineSchemeFieldForge (format, htmlInputType, etc.)
              ├── .collectionValues    → MachineSchemeValues (format, getInputDataSet)
              ├── .validator           → MachineSchemeValidate
              ├── .parseFks()          → forward FK collections
              └── .parseReverseFks()   → reverse FK collections

machine.store[collection]   → reactive IdbqState (getAll, where, add, update, delete)
machine.logic               → MachineDb instance
```

---

## 5. Schema declaration — NEW format (use this)

```ts
import { field } from '$lib/main/machine/fieldBuilder.js';
import type { IdbqModel } from '@medyll/idae-idbql';

export const myModel = {
  users: {
    keyPath:  '++id',
    model:    {},
    ts:       {} as { id: string; name: string; email: string },
    template: {
      index:        'id',
      presentation: 'name email',
      fields: {
        id:    field('id',    { readonly: true }),
        name:  field('text',  { required: true }),
        email: field('email', { required: true }),
        role:  field('fk-role.id'),
        notes: field('text-long'),
        active: field('boolean'),
      },
      fks: {
        role: { code: 'role', multiple: false }
      }
    }
  }
} satisfies IdbqModel;
```

**DEPRECATED** (still works, do not use for new code):
```ts
fields: {
  name: 'text (required)',   // ← old world, deprecated
}
```

### Field type reference

| Type | HTML input | Notes |
|------|-----------|-------|
| `'id'` | hidden | readonly, auto-gen |
| `'text'` | text | |
| `'text-long'` | text | |
| `'text-area'` | textarea | via InputTextarea |
| `'text-short'` / `'text-medium'` | text | |
| `'number'` | number | |
| `'boolean'` | checkbox | via InputBoolean |
| `'date'` | date | |
| `'datetime'` | datetime-local | |
| `'time'` | time | |
| `'email'` | email | via InputEmail |
| `'password'` | password | |
| `'url'` | url | |
| `'phone'` | tel | |
| `'currency'` | text+format | via InputCurrency |
| `'fk-collection.field'` | select | via InputSelect (FK-aware) |
| `'array-of-text'` | — | no UI yet |

---

## 6. UI component hierarchy

```
src/lib/main-ui/
├── explorer/    COLLECTION level — browse, list, filter
│   ├── ExplorerCollections  iterates all collections from scheme
│   ├── ExplorerList         records grid (was DataList)
│   ├── ExplorerCard         visual card renderer (no machine logic)
│   ├── ExplorerTable        visual table renderer (no machine logic)
│   ├── ExplorerActions      menu list of records (was DataListActions)
│   └── ExplorerFilter       filter bar (was FilterBar)
│
├── card/        RECORD level — CRUD, FK relations
│   ├── CardForm             main form engine (was DataForm)
│   ├── CardCreate           → CardForm mode="create"
│   ├── CardEdit             → CardForm mode="update"
│   ├── CardFields           iterates record fields → FieldDisplay (was DataListFields)
│   ├── CardProvider         context provider (was DataProvider)
│   ├── CardPicker           opens CardForm in window (was DataPicker)
│   ├── CardFk               forward FK viewer (was DataLinks)
│   └── CardRfk              reverse FK viewer (was DataLinksBack)
│
├── field/       FIELD level — atomic display/edit
│   ├── FieldDisplay         dispatches to Input* atoms by fieldType
│   └── FieldEditor          in-place edit wrapper
│
├── input/       INPUT atoms — type-specific, no machine logic
│   ├── InputBoolean         checkbox
│   ├── InputCurrency        formatted currency
│   ├── InputEmail           email with validation
│   ├── InputSelect          FK-aware select (queries machine.store)
│   └── InputTextarea        resizable textarea
│
├── layout/      structural shells (no data)
│   ├── AppShell, Navigation, Breadcrumb
│
└── fragments/   micro UI (no business logic)
    ├── Confirm, Frame, InfoLine, Selector, Skeleton
```

**Invariant:** Explorer composes Cards. Card composes Fields. Field uses Inputs. No level skipping.

### FieldDisplay dispatch table

| fieldType | Component |
|-----------|-----------|
| `'id'` | `<input type="hidden">` |
| `'fk-*'` | `InputSelect` (collection auto-extracted) |
| `'boolean'` | `InputBoolean` |
| `'email'` | `InputEmail` |
| `'currency'` | `InputCurrency` |
| `*area*` | `InputTextarea` |
| everything else | `<input type={htmlInputType}>` |

---

## 7. State of migration (2026-05-12)

| Topic | Status |
|-------|--------|
| Component rename (explorer/card/field/input) | ✅ Done |
| field() builder + TplFieldRulesObject in idae-idbql | ✅ Done |
| MachineParserForge handles object rules | ✅ Done |
| dbSchema.ts + demoScheme.ts migrated to field() | ✅ Done |
| FieldDisplay dispatches by fieldType | ✅ Done |
| MachineFieldType registry wired to format() | ✅ Done |
| Rights / #checkAccess() implementation | ✅ Done |
| FK show mode (display presentation, not raw id) | ✅ Done (FieldDisplay.svelte fkLabel) |

---

## 8. Key invariants (do not break)

1. `machine.init(opts)` then `machine.start()` before any store/logic access
2. `MachineParserForge` must be pure — no I/O, no side effects
3. `MachineDb` caches `MachineScheme` per collection — do not mutate cache
4. All UI components: Svelte 5 runes only (`$state`, `$derived`, `$effect`)
5. No `$:` reactive, no `onMount`, no `export let` for new components
6. `idae-idbql` changes must be backward-compatible (other packages use it)
7. String field rules still work — migration is progressive, do not bulk-convert

---

## 9. Dev commands

```bash
pnpm run dev       # SvelteKit dev server
pnpm run test      # vitest
pnpm run check     # TypeScript check
pnpm run build     # svelte-package build
```

---

## 10. Files NOT to confuse

| File | What it is |
|------|-----------|
| `server/src/models/demo/demoScheme.ts` | Demo schema (rental car app) — canonical location |
| `src/lib/demo/demoScheme.ts` | Re-export shim → server/src/models/demo/demoScheme.ts |
| `src/lib/demo/dbSchema.ts` | App schema (chat/book creator) — migrated to field() |
| `src/lib/main/types/idae-model-core.ts` | Meta-schema: appscheme_* collections definition |
| `src/lib/main/types/schema-types.ts` | FieldList catalog + RBAC types |
| `server/src/MachineServer.ts` | Server singleton — start/stop/getModel/deployModel |
| `ARCH-SOURCE.md` | Legacy architecture reference (READ ONLY — historical) |
| `bmad/` | Sprint planning artifacts (may be outdated) |
