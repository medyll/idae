---
name: idae-machine
description: Use when building schema-driven CRUD UIs in SvelteKit. Bridges IndexedDB schemas (@medyll/idae-idbql) to reactive Svelte 5 components — use whenever you need data-bound forms, lists, field validation, FK selectors, or schema introspection.
---

## What it does

`@medyll/idae-machine` is a schema-driven SvelteKit library connecting an IndexedDB data model to a complete CRUD UI. Declare a schema → get forms, lists, validation, real-time sync, FK relations automatically.

Part of the `/idae` monorepo. Next generation of `idae-legacy` (PHP/2015 SPA).

## Install

```bash
pnpm add @medyll/idae-machine
```

## Quick start

```ts
import { machine } from '@medyll/idae-machine';
import { field } from '@medyll/idae-machine';
import type { IdbqModel } from '@medyll/idae-idbql';

const myModel = {
  users: {
    keyPath: '++id',
    model: {}, ts: {},
    template: {
      index: 'id',
      presentation: 'name email',
      fields: {
        id:    field('id',    { readonly: true }),
        name:  field('text',  { required: true }),
        email: field('email', { required: true }),
      },
      fks: {}
    }
  }
} satisfies IdbqModel;

machine.init({ dbName: 'myapp', version: 1, model: myModel });
machine.start();
```

```svelte
<script>
  import { ExplorerList, CardCreate, CardEdit } from '@medyll/idae-machine';
</script>

<ExplorerList collection="users" onclick={(rec) => selectedId = rec.id} />
<CardCreate collection="users" onsubmit={() => reload()} />
<CardEdit collection="users" dataId={selectedId} />
```

## Schema field builder

```ts
import { field } from '@medyll/idae-machine';

fields: {
  id:      field('id',           { readonly: true }),
  name:    field('text',         { required: true }),
  email:   field('email',        { required: true }),
  desc:    field('text-long'),
  notes:   field('text-area'),
  active:  field('boolean'),
  price:   field('currency'),
  catId:   field('fk-category.id', { required: true }),
  tags:    field('array-of-text'),
  created: field('date',         { readonly: true }),
}
```

## Component hierarchy

```
explorer/  → collection level (list, filter, actions)
card/      → record level (form, FK relations, picker)
field/     → field level (FieldDisplay dispatches to Input*)
input/     → atomic inputs (InputBoolean, InputEmail, InputSelect, InputCurrency, InputTextarea)
layout/    → shells (AppShell, Navigation, Breadcrumb)
fragments/ → micro UI (Confirm, Skeleton, InfoLine, Selector, Frame)
```

## API

### Core

| Export | Role |
|---|---|
| `machine` | Singleton — `init()`, `start()`, `store`, `logic` |
| `field(type, opts?)` | Schema field builder (new format) |
| `MachineScheme` | Per-collection — `template`, `validator`, `field()`, `fieldForge()` |
| `MachineSchemeFieldType` | Field type registry — `registerFieldType()` |

### Explorer components (collection level)

| Component | Props | Was |
|-----------|-------|-----|
| `ExplorerCollections` | `children` snippet | `CollectionList` |
| `ExplorerList` | `collection`, `where?`, `onclick?` | `DataList` |
| `ExplorerActions` | `collection`, `data?`, `onclick?` | `DataListActions` |
| `ExplorerFilter` | `fields`, `onFilter` | `FilterBar` |
| `ExplorerCard` | `items` | `CollectionCard` |
| `ExplorerTable` | `items`, `columns` | `CollectionTable` |

### Card components (record level)

| Component | Props | Was |
|-----------|-------|-----|
| `CardForm` | `collection`, `mode`, `dataId?`, `onsubmit?` | `DataForm` |
| `CardCreate` | `collection`, `onsubmit?` | `DataCreate` |
| `CardEdit` | `collection`, `dataId`, `onsubmit?` | `DataEdit` |
| `CardFields` | `collection`, `data`, `mode?` | `DataListFields` |
| `CardFk` | `collection`, `collectionId?` | `DataLinks` |
| `CardRfk` | `collection`, `showTitle?` | `DataLinksBack` |
| `CardPicker` | `collection`, `mode?` | `DataPicker` |
| `CardProvider` | `collection`, `data?` | `DataProvider` |

### Field components

| Component | Props |
|-----------|-------|
| `FieldDisplay` | `collection`, `fieldName`, `data` (bindable), `mode?` |
| `FieldEditor` | `collection`, `field`, `validate?` |

### Input atoms

| Component | fieldType | Notes |
|-----------|-----------|-------|
| `InputBoolean` | `boolean` | checkbox |
| `InputEmail` | `email` | with validation |
| `InputCurrency` | `currency` | formatted |
| `InputSelect` | `fk-*` | FK-aware, queries machine.store |
| `InputTextarea` | `*area*` | resizable |

## Patterns & gotchas

- `machine.init()` then `machine.start()` before any store access
- `machine.store[collection]` → reactive state (Svelte 5 `$state`-backed)
- `machine.logic` → schema introspection
- `FieldDisplay` auto-dispatches to correct Input atom based on `fieldType`
- FK fields (`fk-collection.field`) auto-populate InputSelect from `machine.store`
- All components: Svelte 5 runes only — no `$:`, no `onMount`
- String field rules (`'text (required)'`) still work but are deprecated
