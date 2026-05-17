# @medyll/idae-machine

**Schema-driven, offline-first CRUD framework — Svelte 5 + IndexedDB + MongoDB**

[![npm version](https://img.shields.io/npm/v/@medyll/idae-machine.svg)](https://www.npmjs.com/package/@medyll/idae-machine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Svelte 5](https://img.shields.io/badge/svelte-5-ff3e00)

> Declare a schema once → reactive CRUD UI, validation, FK relations, offline-first sync.  
> Central package of the `/idae` monorepo. Successor of `idae-legacy` (PHP/2015).

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
import type { MachineModel } from '@medyll/idae-machine';

export const myModel: MachineModel = {
  users: {
    keyPath: '++id',
    base:    'machine_user',
    model:   {},
    ts:      {} as { id: string; name: string; email: string },
    fields: {
      id:    field('id',    { readonly: true }),
      name:  field('text',  { required: true }),
      email: field('email', { required: true }),
      roleId: field('fk-role.id'),
    },
    fks: {
      role: { code: 'role', multiple: false }
    },
    template: { presentation: 'name email' }
  },
  role: {
    keyPath: '++id',
    base:    'machine_user',
    model:   {},
    ts:      {} as { id: string; name: string },
    fields: {
      id:   field('id',   { readonly: true }),
      name: field('text', { required: true }),
    },
    fks:      {},
    template: { presentation: 'name' }
  }
};
```

### 2. Initialize (static model)

```ts
import { machine } from '@medyll/idae-machine';
import { myModel } from './myModel';

machine.init({ org: 'myapp', domain: 'machine', version: 1, model: myModel });
machine.start();
```

### 3. Initialize (schema from server)

```ts
// Fetches schema from Express server, caches in IDB, starts machine.
// Stale-while-revalidate: serves cache immediately, refreshes in background.
const emitter = await machine.fetchSchema('http://localhost:3000/api/scheme');

emitter.addEventListener('schema:updated', () => {
  // New schema available — trigger UI refresh if needed
});
```

### 4. Use in Svelte components

```svelte
<script>
  import { ExplorerList, CardCreate, CardEdit, CardPicker } from '@medyll/idae-machine';
  let selectedId = $state(null);
</script>

<ExplorerList collection="users" onclick={(r) => selectedId = r.id} />
<CardPicker collection="users" mode="create" />
{#if selectedId}
  <CardEdit collection="users" dataId={selectedId} />
{/if}
```

---

## Machine API

```ts
import { machine, Machine } from '@medyll/idae-machine';
```

### init options

```ts
machine.init({
  org:          'myorg',          // prefixes all DB names
  domain:       'machine',        // IDB DB = org_domain
  version:      1,                // IDB schema version
  model:        myModel,          // MachineModel (required)
  sync:         {                 // optional: Qoolie sync config
    databaseHost: 'http://localhost:3000',
    mode:         'mobile-first', // or 'server-first'
    intervalMs:   5000,
    token:        'jwt...',
  },
  // sync: false,                 // disable sync entirely
  stateEngine:  'svelte5',        // or 'stator' (default: 'svelte5')
  hooks: {
    onSyncEvent: (event) => { /* delivered, fallback, dead-letter, etc. */ },
    onError:     (err, ctx) => { /* sync errors */ },
  },
});
machine.start();
```

### Data access

```ts
// Shorthand accessor → QoolieCollection
machine.collection('users').getAll()
machine.collection('users').where({ active: { eq: true } })
machine.collection('users').get(id)
machine.collection('users').create({ name: 'Alice', email: 'alice@x.com' })
machine.collection('users').update(id, { name: 'Bob' })
machine.collection('users').delete(id)
machine.collection('users').count({ active: { eq: true } })
machine.collection('users').updateWhere({ active: false }, { active: true })
machine.collection('users').deleteWhere({ active: false })

// Bracket notation (same result)
machine.store['users'].getAll()
```

### Schema introspection

```ts
const scheme = machine.logic.collection('users');

scheme.index                    // keyPath field name
scheme.template.presentation    // display fields
scheme.field('email').parse()   // → { fieldType, fieldArgs, ... }
scheme.parse()                  // → all fields as IDbForge
scheme.parseFks()               // → { role: { id: IDbForge, name: IDbForge } }
scheme.parseReverseFks()        // → collections that point back here
await scheme.validator.validateForm(data, { ignoreFields: ['notes'] })
await scheme.validator.validateField('email', value)
```

### Sync control

```ts
// Only available when sync is enabled in init()
await machine.sync.pause()
await machine.sync.resume()
await machine.sync.flush()
const status = await machine.sync.getStatus()
// → { running, networkPaused, queueLength, dlqLength, mode, circuitBreaker }

machine.sync.setToken('new-jwt')
machine.sync.onEvent((e) => console.log(e.type, e.collection))

// Dead letter queue
const failed = await machine.sync.dlq.list()
await machine.sync.dlq.replay(entryId)
await machine.sync.dlq.clear()
```

### Lifecycle

```ts
machine.destroy()   // stops sync adapter, releases Qoolie resources

// Multiple instances
const sub = machine.createInstance('reporting', 'reports-db', 1, reportsModel);
const inst = Machine.instance('reporting');
```

---

## Schema field types

| Type | HTML input | Notes |
|------|-----------|-------|
| `'id'` | hidden | readonly, auto-gen |
| `'text'` / `'text-short'` / `'text-medium'` / `'text-long'` / `'text-area'` | text/textarea | |
| `'number'` | number | |
| `'boolean'` | checkbox | |
| `'date'` / `'datetime'` / `'time'` | date inputs | |
| `'email'` | email | |
| `'password'` | password | |
| `'url'` | url | |
| `'phone'` | tel | |
| `'currency'` | text+format | |
| `'schemelink'` | — | polymorphic FK: `{ collection, collection_value, collection_vars? }` |
| `'fk-collection.field'` | select | FK-aware, queries store |
| `'array-of-text'` | — | no UI yet |

```ts
fields: {
  id:       field('id',             { readonly: true }),
  name:     field('text',           { required: true }),
  email:    field('email',          { required: true }),
  notes:    field('text-long'),
  price:    field('currency'),
  active:   field('boolean'),
  catId:    field('fk-category.id', { required: true }),
}
```

---

## Component reference

### Explorer (collection level)

| Component | Description |
|-----------|-------------|
| `ExplorerCollections` | Iterates all collections from scheme |
| `ExplorerList` | Records grid (`collection`, `where?`, `onclick?`) |
| `ExplorerActions` | Menu list of records |
| `ExplorerFilter` | Search + filter bar |
| `ExplorerCard` | Visual card grid |
| `ExplorerTable` | Visual table |

### Card (record level)

| Component | Description |
|-----------|-------------|
| `CardForm` | Form engine (`collection`, `mode`, `dataId?`, `onsubmit?`) |
| `CardCreate` | → CardForm mode="create" |
| `CardEdit` | → CardForm mode="update" |
| `CardFields` | Field list renderer |
| `CardFk` | Forward FK viewer |
| `CardRfk` | Reverse FK viewer |
| `CardPicker` | Opens CardForm in window |
| `CardProvider` | Context provider |

### Field

| Component | Description |
|-----------|-------------|
| `FieldDisplay` | Auto-dispatches to Input atoms by fieldType |
| `FieldEditor` | In-place edit wrapper |

### Input atoms

| Component | fieldType |
|-----------|----------|
| `InputBoolean` | `boolean` |
| `InputEmail` | `email` |
| `InputCurrency` | `currency` |
| `InputSelect` | `fk-*` |
| `InputTextarea` | `*area*` |

### Layout & fragments

`AppShell`, `Navigation`, `Breadcrumb`, `Confirm`, `Frame`, `InfoLine`, `Selector`, `Skeleton`

---

## Architecture

```
Machine
  ├── machine.init({ org, domain, version, model, sync, stateEngine, hooks })
  ├── machine.fetchSchema(url)    → IDB-cached schema, stale-while-revalidate
  ├── machine.start()             → createCollections + createStore (Qoolie)
  │
  ├── machine.collection(name)   → QoolieCollection (CRUD + reactive)
  ├── machine.store[name]        → same, bracket notation
  ├── machine.sync               → SyncController (pause/resume/flush/dlq)
  ├── machine.destroy()          → cleanup Qoolie + stop sync
  │
  ├── machine.logic              → MachineDb (schema introspection)
  │     └── MachineScheme(collection)
  │           ├── field(name).parse()    → IDbForge
  │           ├── parseFks()            → forward FK collections
  │           ├── parseReverseFks()     → reverse FK map
  │           └── validator             → MachineSchemeValidate
  │
  └── machine.router             → SchemaRouter (SPA navigation)
```

**Data layer:** Qoolie → `@medyll/idae-idbql` (IndexedDB) + optional `@medyll/idae-sync` (outbox, retry, conflict resolution)

---

## Server

```ts
import { machineServer } from '@medyll/idae-machine/server';

await machineServer.start();                          // Express + MongoDB + Socket.IO
const model = await machineServer.getModel();         // reads appscheme_* → MachineModel
await machineServer.deployModel(myModel, { org });    // writes MachineModel → MongoDB
await machineServer.stop();
```

### HTTP endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/scheme` | Full MachineModel JSON |
| `GET` | `/api/scheme/:table` | Single collection schema |
| `GET` | `/api/data/:table` | Records (pagination: `?page=1&limit=20`, sort: `?sort=name&order=desc`) |
| `GET` | `/api/data/:table/:id` | Single record |
| `POST` | `/api/data/:table` | Create record |
| `PUT` | `/api/data/:table/:id` | Update record |
| `DELETE` | `/api/data/:table/:id` | Delete record |
| `POST` | `/api/auth/login` | `{ login, password }` → `{ token }` |
| `POST` | `/api/bootstrap` | Deploy model via HTTP (dev only) |

### DB naming convention

```
{org}_machine_app    → schema meta (appscheme_*)
{org}_machine_user   → user data collections
{org}_machine_base   → base/system collections
```

### Seed & bootstrap

```bash
# Deploy schema + seed users (admin/user/viewer) into MongoDB
tsx server/src/bootstrap/seed.ts [org] [mongoUri]

# Example
tsx server/src/bootstrap/seed.ts demo mongodb://localhost:27017
```

Default seeded users (`{org}_machine_user`):

| Login | Password | Access |
|-------|----------|--------|
| `admin` | `admin123` | all ops |
| `user` | `user123` | read + list |
| `viewer` | `viewer123` | read + list (via group) |

### Environment (`server/.env`)

```env
MONGODB_URI=mongodb://user:pass@localhost:27017
ORG=demo
PORT=3000
JWT_SECRET=change-me
```

---

## Dev

```bash
pnpm run dev      # SvelteKit dev server
pnpm run test     # vitest (client 282 + server 79 = 361 tests)
pnpm run check    # TypeScript check
pnpm run build    # svelte-package
```

---

See `CLAUDE.md` for full architecture reference and AI agent guide.
