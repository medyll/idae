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
-   **Test**: `npm run check` (TypeScript check). *Note: Add unit tests if available.*
-   **Dev**: `npm run dev` (starts Vite dev server).

## Dependencies
-   **`@medyll/idae-query`**: Core query engine.
-   **`svelte`**: Peer dependency (v5+).

## Directory Structure
-   `src/lib/collection/`: Collection logic.
-   `src/lib/idbqlCore/`: Core DB logic.
-   `src/lib/state/`: Reactive state management.
-   `src/lib/path/`: Path resolution utilities.
