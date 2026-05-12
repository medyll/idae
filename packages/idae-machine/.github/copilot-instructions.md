# AI Agent Instructions — idae-machine

> See `CLAUDE.md` for the full reference. This file is a quick orientation.

## What is this?

`@medyll/idae-machine` — schema-driven CRUD framework, Svelte 5 + IndexedDB.  
Next generation of `idae-legacy` (PHP/2015 app). Part of the `/idae` monorepo.

## Core principle

Declare schema → machine parses it → CRUD UI + validation generated automatically.

## Initialization (critical path)

```ts
machine.init({ dbName, version, model });  // set schema
machine.start();                           // open IndexedDB, create stores
// then: machine.store[collection] / machine.logic.collection(name)
```

## Schema declaration (new format)

```ts
import { field } from '$lib/main/machine/fieldBuilder.js';

fields: {
  id:    field('id',    { readonly: true }),
  name:  field('text',  { required: true }),
  email: field('email', { required: true }),
  catId: field('fk-category.id'),
}
// String format 'text (required)' is DEPRECATED — do not add new ones
```

## UI component hierarchy

```
explorer/ → card/ → field/ → input/
```

- `Explorer*` — collection level (ExplorerList, ExplorerActions, ExplorerFilter...)
- `Card*` — record level (CardForm, CardCreate, CardEdit, CardFk, CardRfk...)
- `Field*` — field level (FieldDisplay dispatches to Input* by fieldType)
- `Input*` — atomic inputs (InputBoolean, InputEmail, InputSelect, InputCurrency, InputTextarea)

## Core class chain

```
machine.logic → MachineDb → MachineScheme(collection)
  .template          {index, presentation, fields, fks}
  .field(name)       → IDbForge {fieldType, fieldArgs, is}
  .fieldForge(n, d)  → MachineSchemeFieldForge (format, htmlInputType)
  .validator         → MachineSchemeValidate
  .parseFks()        → forward FK map
  .parseReverseFks() → reverse FK map

machine.store[collection]  → reactive IdbqState
```

## Key rules

1. Svelte 5 runes only — `$state`, `$derived`, `$effect`, `$props()`, `$bindable()`
2. `MachineParserForge` must stay pure (no I/O)
3. `idae-idbql` changes must be backward-compatible
4. New fields: use `field()` builder, not string rules
5. New components: follow `explorer/card/field/input` hierarchy
