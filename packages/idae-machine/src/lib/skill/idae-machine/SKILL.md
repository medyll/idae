---
name: idae-machine
description: Use when building schema-driven CRUD UIs in SvelteKit. Bridges IndexedDB schemas (@medyll/idae-idbql) to reactive Svelte 5 components — use this whenever you need data-bound forms, lists, field validation, or schema introspection.
---

## What it does
`@medyll/idae-machine` is a schema-driven SvelteKit library that connects an IndexedDB data model to a ready-made set of CRUD components and validation logic. It exposes a `Machine` singleton that manages the database connection, reactive state, and schema introspection. UI components (`DataForm`, `DataList`, `DataProvider`, etc.) wire directly to the schema with no manual mapping.

## Install
```bash
pnpm add @medyll/idae-machine
```

## Quick start
```ts
import { machine } from '@medyll/idae-machine';
import { myModel } from './myModel'; // IdbqModel from @medyll/idae-idbql

// Initialize and start the database connection
machine.init({ dbName: 'myapp', version: 1, model: myModel });
machine.start();

// Access schema logic for a collection
const scheme = machine.collections.collection('users');
const fields = scheme.template.fields;
const isValid = scheme.validator.validate(data);

// Named instance (multi-db)
const sub = machine.createInstance('reporting', 'reports-db', 1, reportsModel);
const inst = Machine.instance('reporting');
```

```svelte
<script>
  import { DataProvider, DataList, DataForm } from '@medyll/idae-machine';
</script>

<DataProvider collection="users">
  <DataList />
  <DataForm />
</DataProvider>
```

## API

### Core classes
| Export | Role |
|---|---|
| `machine` | Singleton `Machine` — init/start, holds `idbql`, `idbqlState`, `collections` |
| `Machine` | Class — `createInstance()`, `Machine.instance(name)`, static registry |
| `MachineDb` | Schema introspection — `collections()`, `collection(name)` → `MachineScheme` |
| `MachineScheme` | Per-collection helpers — `template`, `validator`, `collectionValues`, `field()`, `fieldForge()` |
| `MachineSchemeValidate` | Field-level + record validation |
| `MachineSchemeValues` | Default/computed values for a collection |
| `MachineSchemeFieldForge` | Per-field value resolution with data context |
| `MachineError` / `MachineErrorValidation` | Typed error classes |

### UI components
`DataCreate`, `DataEdit`, `DataForm`, `DataList`, `DataListActions`, `DataListFields`,
`DataLinks`, `DataLinksBack`, `DataPicker`, `DataProvider`, `FieldDisplay`, `FieldEditor`,
`CollectionCard`, `CollectionTable`, `Confirm`, `Frame`, `InfoLine`, `Selector`, `Skeleton`

### Schema DSL (via `MachineParserForge`)
Fields are defined as strings: `'text (required)'`, `'id (readonly)'`,
`'fk-category.id (required)'`, `'array-of-number'`

## Patterns & gotchas
- Call `machine.init(...)` then `machine.start()` before accessing `idbql` or `collections`.
- `machine.idbql` is read-only queries; `machine.idbqlState` is Svelte 5 reactive state (`$state`-backed).
- `machine.collections` is deprecated — use `machine.logic` going forward (check source before using).
- `MachineDb` caches `MachineScheme` instances per collection — do not mutate the cache when changing schema parsing logic.
- All Svelte components require Svelte 5 runes; never use `$:` or `onMount`.
- `MachineScheme` throws `MachineError` if the collection name is missing from the model or lacks a `template` property.
- Use `Machine.instanceRegistry` for multi-database scenarios (e.g. reporting DB alongside main DB).
