
# @medyll/idae-idbql Project Guide

## Overview
`@medyll/idae-idbql` is a TypeScript library that provides a MongoDB-like query interface for IndexedDB, designed specifically for Svelte 5 applications. It leverages `@medyll/idae-query` for query processing and offers reactive state management.

## Architecture

### Core Components
- **`IdbqlIndexedCore`** (`src/lib/idbqlCore/idbqlCore.ts`): The main entry point for database management. It handles opening the database, versioning, and schema creation.
- **`CollectionCore`** (`src/lib/collection/collection.svelte.ts`): Represents a single IndexedDB object store. It provides methods for CRUD operations (`add`, `put`, `get`, `getAll`, `delete`) and advanced querying (`where`).
- **`createIdbqlState`** (`src/lib/state/idbstate.svelte.ts`): A factory function that creates a reactive state object synchronized with the IndexedDB. It exposes methods that trigger UI updates.
- **`idbqlEvent`** (`src/lib/state/idbqlEvent.svelte.ts`): Handles events to ensure reactivity across the application.

### Data Flow
1.  **Initialization**: `createIdbqDb` (or similar factory) initializes `IdbqlIndexedCore` with a schema model.
2.  **Querying**: Users interact with `idbql` (reactive state) or `idbDatabase` (raw access).
3.  **Execution**: Queries are processed by `@medyll/idae-query` (e.g., `where` clauses) and executed against the IndexedDB stores via `CollectionCore`.
4.  **Reactivity**: Operations trigger events via `idbqlEvent`, updating the `idbqlState` which Svelte components subscribe to.

## Key Features
-   **MongoDB-like Syntax**: Uses a familiar API for querying (e.g., `.where({ age: { $gt: 18 } })`).
-   **Svelte 5 Runes**: Built using Svelte 5's reactive primitives (`$state`, `$effect`, etc.).
-   **TypeScript Support**: Full type inference for models and query results.


## Developer Workflow
-   **Build**: `npm run build` (uses Vite + svelte-package).
-   **Type Check**: `npm run check` (TypeScript check, à lancer avant commit).
-   **Dev**: `npm run dev` (démarre le serveur Vite).
-   **Test**: `npx vitest` (voir les fichiers `*.test.ts`).
-   **Backlog & Sprints**: Voir `backlog.md` et `/project-docs/sprints/` pour la planification et le suivi.

## Usage Examples

```typescript
import { createIdbqDb } from '@medyll/idae-idbql';

const model = {
	users: { keyPath: '++id', ts: {} as User },
	messages: { keyPath: '++id, chatId', ts: {} as Message }
};

const idbqStore = createIdbqDb(model, 1);
const { idbql } = idbqStore.create('myDb');

// Query
const users = await idbql.users.where({ age: { $gt: 18 } }).toArray();
```

## Versioning & Migrations

Pour changer le schéma ou migrer les données :

```typescript
const idbqStore = createIdbqDb(myModel, 2);
const { idbDatabase } = idbqStore.create('myDb', {
	upgrade(oldVersion, newVersion, transaction) {
		if (oldVersion < 2) {
			const userStore = transaction.objectStore('users');
			userStore.createIndex('emailIndex', 'email', { unique: true });
		}
	},
});
```

## Error Handling

```typescript
try {
	await idbql.users.add({ username: 'existing_user' });
} catch (error) {
	// Gestion fine des erreurs IndexedDB
}
```

## Testing Philosophy

- Les tests unitaires sont dans `*.test.ts` (voir `src/lib/collection/collection.test.ts`).
- Ciblez les méthodes critiques (CRUD, requêtes complexes, réactivité).
- Utilisez `fake-indexeddb` pour simuler IndexedDB côté Node.

## Liens Utiles
- [backlog.md](backlog.md)
- [Sprints](project-docs/sprints/)

## Dependencies
-   **`@medyll/idae-query`**: Core query engine.
-   **`svelte`**: Peer dependency (v5+).

## Directory Structure
-   `src/lib/collection/`: Collection logic.
-   `src/lib/idbqlCore/`: Core DB logic.
-   `src/lib/state/`: Reactive state management.
-   `src/lib/path/`: Path resolution utilities.
