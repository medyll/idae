
# Copilot Instructions for @medyll/idae-idbql

You are an expert TypeScript and Svelte 5 developer working on `@medyll/idae-idbql`, a high-performance IndexedDB wrapper with a MongoDB-like query interface and Svelte 5 reactivity.

## Project Architecture

- **Database Core (`src/lib/idbqlCore/`)**
  - `IdbqlIndexedCore`: Main class for `IDBDatabase` management (connections, versioning, schema). See [idbqlCore.ts](../src/lib/idbqlCore/idbqlCore.ts).
  - `Schema`: Database structure definition ([idbqlSchema.ts](../src/lib/idbqlCore/idbqlSchema.ts)).

- **Collection Management (`src/lib/collection/`)**
  - `CollectionCore`: Wraps `IDBObjectStore` for CRUD and queries. Always use `CollectionCore` methods for DB access (not raw IndexedDB APIs).

- **Reactivity & State (`src/lib/state/`)**
  - `createIdbqlState`: Factory for reactive DB proxies.
  - `idbqlEvent`: Global event bus for DB change notifications (uses Svelte 5 `$state`).
  - Use Svelte 5 runes (`$state`, `$derived`, `$effect`) in `.svelte.ts` files. **Do not use Svelte 4 stores.**

## Key Patterns & Conventions

- **Strict Typing**: All models and collections use TypeScript generics. Define types in [types.ts](../src/lib/idbqlCore/types.ts).
- **Svelte 5 Runes**: Use `.svelte.ts` for files with runes. Example:
  ```typescript
  class MyState {
    value = $state(0);
    double = $derived(this.value * 2);
  }
  ```
- **Querying**: Use the fluent API from `@medyll/idae-query`:
  ```typescript
  await idbql.users.where({ age: { $gt: 18 } }).toArray();
  ```
- **Transactions**: Handled internally by `CollectionCore` methods.
- **Testing**: Use `*.test.ts` files (see [collection.test.ts](../src/lib/collection/collection.test.ts)).

## Developer Workflow

- **Build**: `npm run build` (Vite + Svelte package)
- **Type Check**: `npm run check` (run before commit)
- **Dev Server**: `npm run dev`
- **Test**: `npx vitest`

## Directory Structure

- `src/lib/`: Core library code
- `src/routes/`: SvelteKit demo/test routes
- `scripts/`: Build/maintenance scripts
- `docs/`: Typedoc output (see `classes/`, `functions/`, `types/`)

## Integration & Debugging

- **@medyll/idae-query**: Used for query parsing and logic
- **idbqlEvent**: Use to track and trigger reactivity on DB changes
- **Debugging**: Inspect `IDBOpenDBRequest` and `CollectionCore` for connection/transaction issues

## Adding Features

1. Implement logic in `src/lib/idbqlCore/` or `src/lib/collection/`
2. Update types in `src/lib/idbqlCore/types.ts`
3. Add/adjust reactivity in `src/lib/state/` if needed
4. Add/extend tests in `src/index.test.ts` or relevant test file

---
If any section is unclear or missing, please provide feedback for further refinement.
