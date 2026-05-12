# Architecture — idae-machine

**Updated:** 2026-05-12  
**See also:** `CLAUDE.md` for full reference

---

## System overview

```
Browser (SvelteKit SPA)
  ├── Svelte 5 components (main-ui/)
  ├── Machine singleton (main/machine.ts)
  │     ├── MachineDb (schema layer)
  │     └── IdbqState (reactive IndexedDB)
  ├── idae-router (SPA navigation)
  └── idae-socket client (real-time)
         │
         │ HTTP + WebSocket
         ▼
Server (Node.js Express — server/)
  ├── idae-api (CRUD endpoints)
  ├── idae-socket (Socket.IO broadcast)
  └── MongoDB
```

---

## Client: Machine class chain

```
Machine (singleton)
  └── MachineDb
        └── MachineScheme(collection)
              ├── .template            {index, presentation, fields, fks}
              ├── .parse()             all fields → IDbForge[]
              ├── .field(name)         MachineSchemeField.parse() → IDbForge
              ├── .fieldForge(n, data) MachineSchemeFieldForge (format, htmlInputType)
              ├── .collectionValues    MachineSchemeValues (format, getInputDataSet)
              ├── .validator           MachineSchemeValidate
              ├── .parseFks()          forward FK collections
              └── .parseReverseFks()   reverse FK collections

machine.store[collection]  →  reactive IdbqState (Svelte 5 $state-backed)
machine.logic              →  MachineDb
```

---

## Client: UI component hierarchy

```
explorer/   collection browser   ExplorerList, ExplorerActions, ExplorerFilter...
card/       record CRUD          CardForm, CardCreate, CardEdit, CardFk, CardRfk...
field/      field render         FieldDisplay (dispatches to Input*), FieldEditor
input/      atomic inputs        InputBoolean, InputEmail, InputSelect, InputCurrency, InputTextarea
layout/     structural shells    AppShell, Navigation, Breadcrumb
fragments/  micro UI             Confirm, Frame, InfoLine, Selector, Skeleton
```

**FieldDisplay dispatch:**
- `fk-*` → InputSelect (FK-aware)
- `boolean` → InputBoolean
- `email` → InputEmail
- `currency` → InputCurrency
- `*area*` → InputTextarea
- else → `<input type={htmlInputType}>`

---

## Schema field format

### New world (use this)
```ts
import { field } from '$lib/main/machine/fieldBuilder.js';
fields: {
  name: field('text',  { required: true }),
  catId: field('fk-category.id'),
}
```

### Old world (deprecated, backward-compat only)
```ts
fields: {
  name: 'text (required)',  // ← deprecated string
}
```

`TplFieldRules = TplFieldArgs | TplTypes | TplFieldRulesObject` — union in `idae-idbql/types.ts`.  
`MachineParserForge` handles both forms.

---

## Data flow: field render

```
CardFields renders collection record
  → FieldDisplay(collection, fieldName, data)
      → scheme.fieldForge(fieldName, data) → MachineSchemeFieldForge
      → fieldForge.fieldType → dispatch to Input atom
      → Input atom bind:value → updateValue() → data[fieldName] (bindable)
```

---

## Field type registry

`MachineSchemeFieldType` — singleton registry of formatters + validators per type.  
**TODO:** Wire registry into `MachineSchemeValues.format()` (currently uses manual switch).

---

## RBAC (stub)

Types fully defined in `src/lib/main/types/schema-types.ts`:  
`AppUser`, `AppUserRole`, `AppUserGroup`, `AppUserGrant`, `AppUserAssignment`, `AppUserSession`, `AppUserAudit`

DB collections defined in `src/lib/main/types/idae-model-core.ts`.

`MachineSchemeValues.#checkAccess()` → stub, always returns `true`.  
**TODO:** Inject user context + resolve grants.
