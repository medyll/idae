# Project: @medyll/idae-machine

`@medyll/idae-machine` is a **low-code UI framework** for rapid data structure visualization and CRUD operations in Svelte 5. It is written in TypeScript and built with SvelteKit.

The primary purpose of this library is to bridge the gap between data modeling and UI components. It automatically generates rich UI components from a declared database schema, enabling developers to quickly build interfaces for displaying, creating, and updating structured data stored in IndexedDB.

**Project Status:** ⚠️ Early Development Phase. The API is still under refinement and is not yet recommended for production use.

## Key Technologies

*   **Framework:** SvelteKit
*   **Language:** TypeScript
*   **UI Library:** Svelte 5 (uses Runes)
*   **Bundler:** Vite
*   **Testing:** Vitest with Svelte Testing Library
*   **Linting & Formatting:** ESLint and Prettier

## Architecture & Core Dependencies

The library operates in a layered stack:

1.  **UI Components:** Svelte 5 components for forms, lists, and fields.
2.  **Form Logic:** Manages form state and validation.
3.  **DB Schema:** TypeScript types define the data structure.
4.  **DB Abstraction:** Uses `@medyll/idae-idbql` to interact with IndexedDB.

It also relies on `@medyll/idae-slotui-svelte` for some base UI components.

### Key Features

*   **Schema-driven UI generation**: Automatically creates forms from a data model.
*   **CRUD Zone**: A pre-built, all-in-one "Create-Read-Update-Delete" interface for any data collection.
*   **Relational support**: Visualizes foreign key and reverse foreign key relationships.
*   **In-place editing**: Allows editing records directly in a list or view.

The main source code is structured in `src/lib/`, with schema/data logic in `src/lib/db/` and UI components in `src/lib/form/`. The project is configured for distribution on npm under the `@medyll` scope.
