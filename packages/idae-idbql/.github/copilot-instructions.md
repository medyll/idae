# GitHub Copilot Instructions for @medyll/idae-idbql

You are an expert TypeScript and Svelte 5 developer working on `@medyll/idae-idbql`, a high-performance IndexedDB wrapper with a MongoDB-like query interface and Svelte 5 reactivity.

## Project Overview
- **Goal**: Provide a type-safe, reactive, and easy-to-use interface for IndexedDB.
- **Core Tech**: TypeScript, Svelte 5 (Runes), Vite, IndexedDB.
- **Key Dependency**: `@medyll/idae-query` (handles query parsing and logic).

## Architecture & Core Components

### 1. Database Core (`src/lib/idbqlCore/`)
- **`IdbqlIndexedCore`**: The main class wrapping `IDBDatabase`. It manages connections, versioning, and schema initialization.
- **`Schema`**: Defines the database structure.

### 2. Collection Management (`src/lib/collection/`)
- **`CollectionCore`**: Wraps an `IDBObjectStore`. Handles CRUD operations (`add`, `put`, `get`, `delete`) and query execution.
- **Pattern**: Do not use `IDBObjectStore` directly; use `CollectionCore` methods which handle transactions and error wrapping.

### 3. Reactivity & State (`src/lib/state/`)
- **`createIdbqlState`**: Factory that creates a reactive proxy around the database.
- **`idbqlEvent`**: A global event bus (using `$state`) that triggers updates when DB operations occur.
- **Svelte 5 Runes**: This project uses Svelte 5. Use `$state`, `$derived`, and `$effect` in `.svelte.ts` files. **Do not use Svelte 4 stores (`writable`, `readable`) unless absolutely necessary.**

## Coding Conventions

### TypeScript
- **Strict Typing**: Ensure all database models are strictly typed. Use generics `T` for collections.
- **Interfaces**: Define models in `src/lib/idbqlCore/types.ts` or locally if specific to a feature.

### Svelte 5
- **File Extensions**: Use `.svelte.ts` for TypeScript files that contain Svelte runes (e.g., `collection.svelte.ts`).
- **Reactivity**:
  ```typescript
  // Correct (Svelte 5)
  class MyState {
      value = $state(0);
      double = $derived(this.value * 2);
  }
  ```

### Database Operations
- **Querying**: Use the fluent API provided by `@medyll/idae-query`.
  ```typescript
  // Example
  await idbql.users.where({ age: { $gt: 18 } }).toArray();
  ```
- **Transactions**: `CollectionCore` methods should handle transaction lifecycles automatically.

## Developer Workflow

### Commands
- **Build**: `npm run build` (Vite build + Svelte package).
- **Type Check**: `npm run check` (Essential before committing).
- **Dev Server**: `npm run dev`.
- **Testing**: Run tests via `npx vitest` (files are `*.test.ts`).

### Directory Structure
- `src/lib/`: Library source code.
- `src/routes/`: SvelteKit routes (used for testing/demoing the library).
- `scripts/`: Build and maintenance scripts.

## Common Tasks

### Adding a New Feature
1.  Implement core logic in `src/lib/idbqlCore/` or `src/lib/collection/`.
2.  Update types in `src/lib/idbqlCore/types.ts`.
3.  Ensure reactivity in `src/lib/state/` if the feature affects data state.
4.  Add a test case in `src/index.test.ts` or a dedicated test file.

### Debugging
- Use `idbqlEvent` to track data changes.
- Check `IDBOpenDBRequest` events in `CollectionCore` for connection issues.
