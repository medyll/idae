# @medyll/idae-machine

**Schema-driven CRUD framework for Svelte 5 + IndexedDB**

[![npm version](https://img.shields.io/npm/v/@medyll/idae-machine.svg)](https://www.npmjs.com/package/@medyll/idae-machine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Svelte 5](https://img.shields.io/badge/svelte-5-ff3e00)

> Declare a schema → get reactive CRUD UI, validation, FK relations, real-time sync automatically.  
> Central package of the `/idae` monorepo. Next generation of `idae-legacy` (PHP/2015).

---

## Install

```bash
pnpm add @medyll/idae-machine
```

**Requirements:** Node 18+, Svelte 5, SvelteKit 2+

---

## Quick start

### 1. Define schema

```ts
import { field } from '@medyll/idae-machine';
import type { IdbqModel } from '@medyll/idae-idbql';

export const myModel = {
  users: {
    keyPath: '++id',
    model: {}, ts: {} as { id: string; name: string; email: string },
    template: {
      index: 'id',
      presentation: 'name email',
      fields: {
        id:    field('id',    { readonly: true }),
        name:  field('text',  { required: true }),
        email: field('email', { required: true }),
        role:  field('fk-role.id'),
      },
      fks: {
        role: { code: 'role', multiple: false }
      }
    }
  },
  role: {
    keyPath: '++id',
    model: {}, ts: {} as { id: string; name: string },
    template: {
      index: 'id',
      presentation: 'name',
      fields: {
        id:   field('id',   { readonly: true }),
        name: field('text', { required: true }),
      },
      fks: {}
    }
  }
} satisfies IdbqModel;
```

### 2. Initialize

```ts
import { machine } from '@medyll/idae-machine';
import { myModel } from './myModel';

machine.init({ dbName: 'myapp', version: 1, model: myModel });
machine.start();
```

### 3. Use components

```svelte
<script>
  import { ExplorerList, CardCreate, CardEdit, CardPicker } from '@medyll/idae-machine';

  let selectedId = $state(null);
</script>

<!-- Browse collection -->
<ExplorerList
  collection="users"
  onclick={(record) => selectedId = record.id}
/>

<!-- Quick-create button -->
<CardPicker collection="users" mode="create" />

<!-- Edit selected -->
{#if selectedId}
  <CardEdit collection="users" dataId={selectedId} />
{/if}
```

---

## Schema field types

```ts
import { field } from '@medyll/idae-machine';

fields: {
  id:       field('id',              { readonly: true }),
  name:     field('text',            { required: true }),
  email:    field('email',           { required: true }),
  notes:    field('text-long'),
  body:     field('text-area'),
  price:    field('currency'),
  active:   field('boolean'),
  count:    field('number'),
  date:     field('date'),
  password: field('password'),
  url:      field('url'),
  catId:    field('fk-category.id',  { required: true }),
  tags:     field('array-of-text'),
}
```

---

## Component reference

### Explorer (collection level)

| Component | Props | Description |
|-----------|-------|-------------|
| `ExplorerCollections` | `children` snippet | Iterates all scheme collections |
| `ExplorerList` | `collection`, `where?`, `onclick?` | Records grid |
| `ExplorerActions` | `collection`, `data?`, `onclick?` | Menu list |
| `ExplorerFilter` | `fields`, `onFilter` | Search + filter bar |
| `ExplorerCard` | `items` | Visual card grid |
| `ExplorerTable` | `items`, `columns` | Visual table |

### Card (record level)

| Component | Props | Description |
|-----------|-------|-------------|
| `CardForm` | `collection`, `mode`, `dataId?`, `onsubmit?` | Form engine |
| `CardCreate` | `collection`, `onsubmit?` | Create form |
| `CardEdit` | `collection`, `dataId`, `onsubmit?` | Edit form |
| `CardFields` | `collection`, `data`, `mode?` | Field list renderer |
| `CardFk` | `collection`, `collectionId?` | FK relations |
| `CardRfk` | `collection`, `showTitle?` | Reverse FK relations |
| `CardPicker` | `collection`, `mode?` | Opens CardForm in window |
| `CardProvider` | `collection`, `data?` | Context provider |

### Field

| Component | Props | Description |
|-----------|-------|-------------|
| `FieldDisplay` | `collection`, `fieldName`, `data` (bindable), `mode?` | Auto-dispatches by type |
| `FieldEditor` | `collection`, `field`, `validate?` | In-place edit |

### Input atoms

| Component | For fieldType | Description |
|-----------|--------------|-------------|
| `InputBoolean` | `boolean` | Checkbox |
| `InputEmail` | `email` | With validation |
| `InputCurrency` | `currency` | Formatted number |
| `InputSelect` | `fk-*` | FK select, queries store |
| `InputTextarea` | `*area*` | Resizable textarea |

### Layout & fragments

`AppShell`, `Navigation`, `Breadcrumb`, `Confirm`, `Frame`, `InfoLine`, `Selector`, `Skeleton`

---

## Core API

```ts
import { machine, Machine } from '@medyll/idae-machine';

// Access reactive store
const items = machine.store['users'].getAll();
const filtered = machine.store['users'].where({ active: { eq: true } });

// Schema introspection
const scheme = machine.logic.collection('users');
const fields = scheme.template.fields;
const isValid = await scheme.validator.validateForm(data);

// Multi-database
const sub = machine.createInstance('reporting', 'reports-db', 1, reportsModel);
const inst = Machine.instance('reporting');
```

---

## Architecture

```
Machine
  └── MachineDb
        └── MachineScheme(collection)
              ├── template        {index, presentation, fields, fks}
              ├── parse()         all fields as IDbForge
              ├── fieldForge()    per-field with data context
              ├── collectionValues  format, defaults
              ├── validator       MachineSchemeValidate
              ├── parseFks()      forward FK map
              └── parseReverseFks()  reverse FK map

machine.store[collection]  →  reactive IdbqState (getAll, where, add, update, delete)
machine.logic              →  MachineDb
```

---

## Dev

```bash
pnpm run dev      # SvelteKit dev server
pnpm run test     # vitest
pnpm run check    # TypeScript check
pnpm run build    # svelte-package
```

See `CLAUDE.md` for full architecture reference and AI agent guide.
