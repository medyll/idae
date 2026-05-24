# @medyll/idae-machine

**Schema-driven, offline-first CRUD framework — Svelte 5 + IndexedDB + MongoDB**

[![npm version](https://img.shields.io/npm/v/@medyll/idae-machine.svg)](https://www.npmjs.com/package/@medyll/idae-machine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Svelte 5](https://img.shields.io/badge/svelte-5-ff3e00)

> Declare a schema once → reactive CRUD UI, validation, FK relations, offline-first sync, real-time WebSocket updates, RBAC permissions, and frame-based navigation.  
> Central package of the `/idae` monorepo. Successor of `idae-legacy` (PHP/2015).

---

## What's new in v2.0

- **Schema-from-server** — `machine.start()` auto-fetches schema from your Express/MongoDB server when `databaseHost` is set. No local model needed.
- **Unified Explorer** — Single `Explorer` component with four modes: `list`, `table`, `card`, `actions`. Driven by `_views` registry from MongoDB.
- **Frame-based navigation** — Multi-window, tab-like UI with `machine.loadFrame()`, URL-driven state, and a reactive `TaskBar`.
- **RBAC Matrix UI** — Visual grant editor to assign CRUDL permissions by group and collection.
- **Image presets** — Dynamic image sizing (`thumb`, `banner`, `avatar`, ...) from schema definitions. Free notation (`free-800x600`) auto-creates on first request.
- **DataList snippet API** — Composable list rendering with `item`, `groupHeader`, `empty`, and `footer` snippets.
- **IDB drift detection** — IndexedDB auto-adapts to server schema changes. No manual migrations ever.
- **File & mail services** — Upload/download with metadata, SMTP via Markdown templates.
- **Domain actions** — Hook custom validation/business logic into create/update/delete operations.
- **Soft delete + audit** — Records are soft-deleted by default; every mutation is logged to `appuser_audit`.

---

## Install

```bash
pnpm add @medyll/idae-machine
```

**Requirements:** Node 22+, Svelte 5, SvelteKit 2+

---

## Quick start

### 1. Define schema (optional — server-first mode needs no local model)

```ts
import { field } from '@medyll/idae-machine';
import type { MachineModel } from '@medyll/idae-machine';

export const myModel: MachineModel = {
	users: {
		keyPath: '++id',
		base: 'machine_user',
		model: {},
		ts: {} as { id: string; name: string; email: string },
		fields: {
			id: field('id', { readonly: true }),
			name: field('text', { required: true }),
			email: field('email', { required: true }),
			roleId: field('fk-role.id')
		},
		fks: {
			role: { code: 'role', multiple: false }
		},
		template: { presentation: 'name email' }
	},
	role: {
		keyPath: '++id',
		base: 'machine_user',
		model: {},
		ts: {} as { id: string; name: string },
		fields: {
			id: field('id', { readonly: true }),
			name: field('text', { required: true })
		},
		fks: {},
		template: { presentation: 'name' }
	}
};
```

### 2. Initialize (server-first — recommended)

```ts
import { machine } from '@medyll/idae-machine';

// Fetches schema from server, caches in IDB, starts machine.
// Stale-while-revalidate: serves cache immediately, refreshes in background.
machine.init({
	org: 'myapp',
	domain: 'machine',
	version: 1,
	sync: {
		databaseHost: 'http://localhost:3000',
		mode: 'server-first',
		intervalMs: 5000
	}
});

await machine.start(); // async: fetches schema + hydrates IDB stores
```

### 3. Initialize (static model — fallback)

```ts
import { machine } from '@medyll/idae-machine';
import { myModel } from './myModel';

machine.init({ org: 'myapp', domain: 'machine', version: 1, model: myModel });
machine.start();
```

### 4. Use in Svelte components

```svelte
<script>
	import { Explorer, AppShell, TaskBar } from '@medyll/idae-machine';
	import { machine } from '@medyll/idae-machine';
</script>

<TaskBar />
<AppShell>
	<!-- Explorer with mode switcher: list / table / card / actions -->
	<Explorer collection="users" mode="list" />
</AppShell>

<!-- Or open a record in a frame -->
<button onclick={() => machine.loadFrame('card', 'users', userId)}>
	Edit user
</button>
```

---

## Machine API

```ts
import { machine, Machine } from '@medyll/idae-machine';
```

### init options

```ts
machine.init({
	org: 'myorg', // prefixes all DB names
	domain: 'machine', // IDB DB = org_domain
	version: 1, // IDB schema version
	model: myModel, // MachineModel (optional if using fetchSchema)
	sync: {
		// optional: Qoolie sync config
		databaseHost: 'http://localhost:3000',
		mode: 'server-first', // or 'mobile-first'
		intervalMs: 5000,
		token: 'jwt...'
	},
	// sync: false,                 // disable sync entirely
	stateEngine: 'svelte5', // or 'stator' (default: 'svelte5')
	hooks: {
		onSyncEvent: (event) => {
			/* delivered, fallback, dead-letter, etc. */
		},
		onError: (err, ctx) => {
			/* sync errors */
		}
	}
});

// Async start: fetches schema from server if databaseHost is set,
// detects IDB drift, creates stores, and hydrates data.
await machine.start();
```

### Data access

```ts
// Shorthand accessor → QoolieCollection
machine.collection('users').getAll();
machine.collection('users').where({ active: { eq: true } });
machine.collection('users').get(id);
machine.collection('users').create({ name: 'Alice', email: 'alice@x.com' });
machine.collection('users').update(id, { name: 'Bob' });
machine.collection('users').delete(id); // soft delete by default
machine.collection('users').count({ active: { eq: true } });
machine.collection('users').updateWhere({ active: false }, { active: true });
machine.collection('users').deleteWhere({ active: false });

// Bracket notation (same result)
machine.store('users').items;
```

### Schema introspection

```ts
const scheme = machine.logic.collection('users');

scheme.index; // keyPath field name
scheme.template.presentation; // display fields
scheme.views; // → { listView, miniView, formView, fkLabelView } from _views registry
scheme.field('email').parse(); // → { fieldType, fieldArgs, ... }
scheme.parse(); // → all fields as IDbForge
scheme.parseFks(); // → { role: { id: IDbForge, name: IDbForge } }
scheme.parseReverseFks(); // → collections that point back here
await scheme.validator.validateForm(data, { ignoreFields: ['notes'] });
await scheme.validator.validateField('email', value);
```

### Frame navigation

```ts
// Open a collection or record in a frame (tab-like window)
machine.loadFrame('explorer', 'users'); // collection explorer
machine.loadFrame('card', 'users', userId); // edit record
machine.loadFrame('rbac.matrix'); // RBAC matrix UI

// Frame controls via MachineFrameManager singleton
import { machineFrameManager } from '@medyll/idae-machine';
machineFrameManager.show(frameId);
machineFrameManager.hide(frameId);
machineFrameManager.close(frameId);
```

### Sync control

```ts
// Only available when sync is enabled in init()
await machine.sync.pause();
await machine.sync.resume();
await machine.sync.flush();
const status = await machine.sync.getStatus();
// → { running, networkPaused, queueLength, dlqLength, mode, circuitBreaker }

machine.sync.setToken('new-jwt');
machine.sync.onEvent((e) => console.log(e.type, e.collection));

// Dead letter queue
const failed = await machine.sync.dlq.list();
await machine.sync.dlq.replay(entryId);
await machine.sync.dlq.clear();
```

### Lifecycle

```ts
machine.destroy(); // stops sync adapter, releases Qoolie resources

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
| `'image'` | file upload | presets: `['thumb', 'banner']`, free notation support |
| `'schemelink'` | — | polymorphic FK: `{ collection, collection_value, collection_vars? }` |
| `'fk-collection.field'` | select | FK-aware, queries store, uses `_views.fkLabelView` for labels |
| `'array-of-text'` | — | no UI yet |

```ts
fields: {
	id: field('id', { readonly: true }),
	name: field('text', { required: true }),
	email: field('email', { required: true }),
	notes: field('text-long'),
	price: field('currency'),
	active: field('boolean'),
	catId: field('fk-category.id', { required: true }),
	avatar: field('image', { presets: ['thumb', 'avatar'], free: false })
}
```

---

## Component reference

### Explorer (collection level)

| Component | Description |
|-----------|-------------|
| `Explorer` | Unified component — modes: `list`, `table`, `card`, `actions`. Props: `collection`, `mode`, `where`, `sortBy`, `groupBy`, `pageSize` |
| `DataList` | Data provider + renderer. Snippets: `item`, `groupHeader`, `empty`, `footer` |
| `SchemeList` | Renders collections from schema for navigation |

### Card (record level)

| Component | Description |
|-----------|-------------|
| `CardForm` | Form engine (`collection`, `mode`, `dataId?`, `onsubmit?`) |
| `DataForm` | Low-level form renderer used by CardForm |
| `DataFields` | Field list renderer |
| `DataFk` | Forward FK viewer |
| `DataRfk` | Reverse FK viewer |

### Field & Input

| Component | Description |
|-----------|-------------|
| `FieldDisplay` | Auto-dispatches to Input atoms by fieldType |
| `InputBoolean` | `boolean` |
| `InputEmail` | `email` |
| `InputCurrency` | `currency` |
| `InputSelect` | `fk-*` (uses `_views.fkLabelView` for labels) |
| `InputTextarea` | `*area*` |
| `InputImage` | `image` (upload + preset selection) |

### Layout & navigation

| Component | Description |
|-----------|-------------|
| `AppShell` | Root layout with navbar/sidebar/content snippets |
| `TaskBar` | Reactive list of open frames (toggle/close) |
| `Frame` | Frame mount/unmount wrapper |
| `Navigation` | Schema-driven navigation |
| `Breadcrumb` | Dynamic path breadcrumb |
| `Confirm` | Confirmation dialog |
| `RbacMatrix` | RBAC grant editor (group × collection × CRUDL) |

---

## Architecture

```
Machine
  ├── machine.init({ org, domain, version, model, sync, stateEngine, hooks })
  ├── machine.start()              → async: fetchSchema + drift detect + createStores + hydrate
  │
  ├── machine.collection(name)     → QoolieCollection (CRUD + reactive)
  ├── machine.store(name)          → reactive { items } via Svelte 5 runes
  ├── machine.sync                 → SyncController (pause/resume/flush/dlq)
  ├── machine.destroy()            → cleanup Qoolie + stop sync
  │
  ├── machine.logic                → MachineDb (schema introspection)
  │     └── MachineScheme(collection)
  │           ├── field(name).parse()    → IDbForge
  │           ├── views                  → { listView, miniView, formView, fkLabelView }
  │           ├── parseFks()             → forward FK collections
  │           ├── parseReverseFks()      → reverse FK map
  │           └── validator              → MachineSchemeValidate
  │
  ├── machine.router               → SchemaRouter (hash URL dispatcher + auth guard)
  │
  └── machine.loadFrame(type, collection, id?, vars?)  → MachineFrameManager
        └── TaskBar (reactive open frames)
```

**Data layer:** Qoolie → `@medyll/idae-idbql` (IndexedDB) + optional `@medyll/idae-sync` (outbox, retry, conflict resolution)  
**Real-time:** Socket.IO broadcasts CRUD events → `RealtimeClient` → Svelte 5 reactivity  
**Server:** Express + MongoDB multi-tenant routing (`{org}_machine_app`, `{org}_machine_user`, `{org}_machine_base`)

---

## Server

```ts
import { machineServer } from '@medyll/idae-machine/server';

await machineServer.start(); // Express + MongoDB + Socket.IO
const model = await machineServer.getModel(); // reads appscheme_* → MachineModel
await machineServer.deployModel(myModel, { org }); // writes MachineModel → MongoDB
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
| `DELETE` | `/api/data/:table/:id` | Soft delete (add `?permanent=true` for hard delete) |
| `POST` | `/api/auth/login` | `{ login, password }` → `{ token }` |
| `POST` | `/api/bootstrap` | Deploy model via HTTP (dev only) |
| `POST` | `/api/admin/reset` | Reset + reseed demo data |
| `POST` | `/api/files/upload` | File upload (multer) |
| `GET` | `/api/files/:id` | File download |
| `GET` | `/api/image/:preset/:fileId` | Image resize by preset |
| `PATCH` | `/api/files/:id/focus` | Set image focus point `{ x, y }` |

### DB naming convention

```
{org}_machine_app    → schema meta (appscheme_*)
{org}_machine_user   → user data collections
{org}_machine_base   → base/system collections
```

### Seed & bootstrap

```bash
# Deploy schema + seed users (admin/user/viewer) into MongoDB
tsx server/src/bootstrap/bootstrap-demo.ts [org] [mongoUri]

# Example
tsx server/src/bootstrap/bootstrap-demo.ts demo mongodb://localhost:27017
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
pnpm run test     # vitest (client 470 + server 79 = 549 tests)
pnpm run check    # TypeScript check
pnpm run build    # svelte-package
```

---

See `CLAUDE.md` for full architecture reference and AI agent guide.
