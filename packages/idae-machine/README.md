## 🏗️ Model & Template Structure

Un modèle (template) pour `idae-machine` doit définir les collections, les champs, et les relations. Voici un exemple minimal :

```typescript
// Exemple de schemeModel pour Machine
export const schemeModel = {
  agents: {
    keyPath: 'id',
    ts: {} as Agent, // Typage optionnel pour l'autocomplétion
    template: {
      index: 'id',
      presentation: 'name',
      fields: {
        id: 'id (readonly)',
        name: 'text (required)',
        active: 'boolean',
        created_at: 'date'
      },
      fks: {
        group: { code: 'group', multiple: false, rules: '' }
      }
    }
  },
  groups: {
    keyPath: 'id',
    ts: {} as Group,
    template: {
      index: 'id',
      presentation: 'label',
      fields: {
        id: 'id (readonly)',
        label: 'text (required)'
      }
    }
  }
};
```

## 🔍 Query Examples (via Machine)

Après avoir instancié et démarré Machine :

```typescript
import { machine, schemeModel } from '@medyll/idae-machine';

// Initialisation du singleton
machine.init({ dbName: 'my-db', version: 1, model: schemeModel });
machine.start();

// Ajouter un agent
await machine.idbql.agents.add({ name: 'Alice', active: true });

// Requête simple
const activeAgents = await machine.idbql.agents.where({ active: true }).toArray();

// Mise à jour
await machine.idbql.agents.put({ id: 1, name: 'Alice Cooper', active: true });

// Suppression
await machine.idbql.agents.delete(1);

// Transaction multi-collections
const result = await machine.idbql.transaction([
  'agents', 'groups'
], 'readwrite', async (tx) => {
  const agentStore = tx.objectStore('agents');
  const groupStore = tx.objectStore('groups');
  const groupId = await groupStore.add({ label: 'Admins' });
  const agentId = await agentStore.add({ name: 'Bob', active: true, group: groupId });
  return { groupId, agentId };
});
```
## ⚡ Advanced Data & Reactivity

`idae-machine` s’appuie sur la puissance de [@medyll/idae-idbql](https://github.com/medyll/idae-idbql) pour offrir :
- Un moteur de requêtes IndexedDB inspiré de MongoDB
- Transactions complexes multi-collections
- State réactif Svelte 5 (`idbqlState`) pour des UI en temps réel
- Gestion des migrations et versioning
- Robustesse et gestion d’erreur avancée

### Svelte 5: State Réactif

Utilisez `idbqlState` pour des listes ou des vues réactives :

```svelte
<script lang="ts">
  import { machine } from './store'; // ou créez votre instance
  // Liste réactive des agents actifs
  const activeAgents = $derived(() => machine.idbqlState.agents.where({ active: true }));
</script>

<h2>Agents actifs</h2>
{#each $activeAgents as agent}
  <p>{agent.name}</p>
{/each}
```

### Transactions & Migrations

Vous pouvez effectuer des transactions complexes et gérer les migrations de schéma :

```typescript
const result = await machine.idbql.transaction([
  "users", "posts"
], "readwrite", async (tx) => {
  const userStore = tx.objectStore("users");
  const postStore = tx.objectStore("posts");
  const userId = await userStore.add({ name: "Alice" });
  const postId = await postStore.add({ userId, title: "Hello" });
  return { userId, postId };
});

// Migration
const { indexedb } = machine;
indexedb.upgrade(oldVersion, newVersion, transaction => {
  if (oldVersion < 2) {
    transaction.objectStore("users").createIndex("emailIndex", "email", { unique: true });
  }
});
```

### Error Handling

```typescript
try {
  await machine.idbql.users.add({ username: "existing_user" });
} catch (error) {
  if (error instanceof UniqueConstraintError) {
    console.error("Username already exists");
  } else {
    console.error("Unexpected error", error);
  }
}
```

### Performance Tips
- Utilisez les indexes pour accélérer les requêtes
- Limitez les résultats avec `.limit(n)`
- Préférez `.count()` à `.toArray().length`
- Optimisez vos schémas pour la recherche
# @medyll/idae-machine

**Low-code UI framework** for rapid data structure visualization and CRUD operations in Svelte 5. Declare your database schema once, automatically generate rich UI components for displaying, creating, and updating structured data in IndexedDB.

## 🎯 Purpose

`idae-machine` bridges the gap between **data modeling** (`@medyll/idae-idbql`) and **rich UI components** (`@medyll/idae-slotui-svelte`). It provides:
- **Schema-driven UI generation**: Declare your data model, get form components for free
- **CRUD Zone**: Pre-built "Create-Read-Update-Delete" interface for any collection
- **Relational support**: Foreign key and reverse foreign key visualization
- **In-place editing**: Edit records inline without modal dialogs
- **Field-level validation**: Type-safe field rules (required, readonly, private)

## 📦 Core Architecture

### Layer Stack

```
UI Components (Svelte 5 Components)
    ↓
Form Management & Validation Logic
    ↓
Database Schema Definition (TypeScript Types)
    ↓
IndexedDB Abstraction (@medyll/idae-idbql)
```

### Key Modules

| Module | Purpose |


## 🚀 Quick Start: App Initialization

The recommended way to initialize your app is to use the `Machine` class, which centralizes schema, collections, and IndexedDB access.


```typescript
import { machine, schemeModel } from '@medyll/idae-machine';

// Initialisation du singleton
machine.init({ dbName: 'my-db', version: 1, model: schemeModel });
machine.start();

// Accès aux collections, à la base et au modèle
const collections = machine.collections;
const idbql = machine.idbql;
const idbqlState = machine.idbqlState;
const db = machine.indexedb;
const model = machine.idbqModel;
```

You can now pass `collections` and other instances to Svelte components for CRUD, data listing, and editing.

---

### Legacy/Direct Usage (not recommended)
You can still use `createIdbqDb` directly if you need low-level access:

```typescript
import { createIdbqDb, type IdbqModel } from '@medyll/idae-idbql';
const idbqlState = createIdbqDb(schemeModel);
```

### 2. Use CRUD Components

```svelte
<script lang="ts">
  import { CrudZone, CreateUpdate, DataList } from '@medyll/idae-machine';
</script>

<!-- Full CRUD interface -->
<CrudZone collection="agents" />

<!-- Or compose individually -->
<DataList collection="agents" />
<CreateUpdate collection="agents" mode="create" />
```

## 📋 Component Guide

### `<CrudZone>`
Unified CRUD interface with sidebar list and detail editing.
```svelte
<CrudZone collection="agents" style="height: 600px; min-width: 750px" />
```

### `<DataList>`
Displays collection records as grid with click-to-edit.
```svelte
<DataList 
  collection="agents"
  displayMode="grid"
  where={{ active: { $eq: true } }}
  onclick={(data, idx) => console.log(data)}
/>
```

### `<CreateUpdate>`
Form for creating/updating/viewing records.
```svelte
<CreateUpdate 
  collection="agents"
  mode="show"
  dataId={1}
  showFields={['name', 'code', 'model']}
  inPlaceEdit={true}
  showFks={true}
/>
```

### `<FieldValue>`
Renders a single field with intelligent type detection.
```svelte
<FieldValue 
  collection="agents"
  fieldName="name"
  data={formData}
  mode="edit"
  editInPlace={true}
/>
```

### Relational Components
```svelte
<!-- Foreign Keys (refs TO other collections) -->
<CollectionFks collection="agents" />

<!-- Reverse Foreign Keys (records pointing TO this one) -->
<CollectionReverseFks collection="agents">
  {#snippet children({ collection, template })}
    <div>{collection} references this agent</div>
  {/snippet}
</CollectionReverseFks>
```

## 🔧 Schema Definition (dbFields.ts)

Field types are declared using string-based DSL:

```typescript
fields: {
  // Primitives
  id: 'id (readonly)',
  name: 'text (required)',
  age: 'number',
  active: 'boolean',
  email: 'email',
  created: 'date',
  
  // Text variants
  bio: 'text-long',
  note: 'text-area',
  
  // Relations
  categoryId: 'fk-category.id (required)',
  
  // Collections
  tagIds: 'array-of-number',
  
  // Modifiers
  password: 'password (private)',
  system_field: 'text (readonly private)'
}
```



## 🛡️ Robustness, Coverage & Performance

Tout le cœur métier (`dbFields.ts`, `machine.ts`, etc.) est testé et optimisé :
- **Parsing de schéma** : tous les types et modificateurs sont gérés
- **Relations** : FK et reverse-FK typés et testés
- **Tests unitaires** : chaque méthode exportée est couverte (Vitest)
- **Svelte 5** : conformité stricte aux conventions
- **Gestion d’erreur** : exceptions typées, robustesse transactionnelle
- **Performance** : indexes, requêtes optimisées, conseils intégrés

### Focus actuel
- ✅ Déclaration de schéma & typage
- ✅ Intégration IndexedDB avancée
- ✅ Export de composants & structure modulaire
- ✅ Couverture de tests exhaustive
- ✅ Politique Svelte 5
- 🔄 Validation de formulaire (en cours)
- 🔄 Pipeline de rendu de champ
- ⏳ Workflows CRUD end-to-end

## 🧪 Testing Policy

All logic in `dbFields.ts` and related modules is covered by unit tests:

- **Test schema**: All tests use a realistic, complex schema (see `testDbSchema.ts`).
- **Coverage**: Every method of every exported class is tested, including edge cases (array/object/fk/required/readonly).
- **Continuous validation**: All tests must pass before merge. See `CHANGELOG.md` for test and coverage history.


## 🦄 Svelte 5 Coding Policy

All UI code must strictly follow Svelte 5 syntax and conventions. See `AGENTS.md` for details and migration rules.

## 📖 Developer & Documentation Policy

- All classes and methods in the codebase are fully documented with jsDoc, including `@role`, `@param`, and `@return` in English.
- Internal imports use `$lib` alias for consistency and maintainability.
- All code is strictly compliant with Svelte 5 standards (see `AGENTS.md`).
- Pull requests must respect documentation and Svelte 5 rules, or will be rejected.

### Example jsDoc
```typescript
/**
 * @class MachineDb
 * @role Central class for parsing, introspecting, and extracting metadata from the database schema.
 * @param {IdbqModel} model Custom model to use.
 */
```

See source files for full jsDoc coverage.

## 🔗 Dependencies

- **@medyll/idae-idbql**: IndexedDB abstraction with schema support
- **@medyll/idae-slotui-svelte**: UI component library (Button, MenuList, Looper, etc.)
- **svelte**: ^5.0.0 (uses Svelte 5 runes)
### Build
```bash
### Development Server
```bash
npm run dev          # Start dev server on localhost
npm run dev -- --open  # Auto-open in browser
```

### Quality Assurance
```bash
npm run check        # Svelte type checking
npm run lint         # ESLint + Prettier check
npm run format       # Auto-format code
npm run test:unit    # Run Vitest unit tests
npm run test         # Single-run test mode
```

## 📚 Code Structure

```
src/lib/
├── db/                    # Schema & field layers
│   ├── dbSchema.ts       # Collection templates
│   ├── dbFields.ts       # Field rules & validation
│   └── dataModel.ts      # TypeScript types
│   ├── CollectionFks.svelte      # Forward relations
│   ├── CollectionReverseFks.svelte # Back-references
│   └── ...
└── index.ts             # Main exports
```

## 🎓 Example Projects

See `src/routes/` for a working showcase of all components in action.

## 📄 License

MIT - See LICENSE file

---

**Next Steps for Contributors:**
1. Stabilize form validation pipeline
2. Add comprehensive test suite
3. Document TypeScript schema inference
4. Create migration guides from legacy code in `src/_old/`
