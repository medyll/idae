
# Idae Database Library — AI Coding Agent Guide

## Project Scope & Architecture

**@medyll/idae-db** is a TypeScript library providing a database abstraction layer for MongoDB, MySQL, and ChromaDB. It uses a **strategy pattern** with adapters, an event-driven CRUD system, and singleton connection management. All code is strict TypeScript and type-safe.

**Core flow:**
`IdaeDb.init(uri, options)` → `.db(dbName)` → `.collection<T>(name)` → CRUD ops (with events)

**Key components:**
- `IdaeDb`: Singleton entry, manages instances per URI+DbType
- `IdaeDbConnection`: Per-database connection, creates collections/tables
- `IdaeDbAdapter`: Facade with pre/post/error hooks via `@withEmitter` decorator
- `*Adapter` classes: MongoDBAdapter, MySQLAdapter, ChromaDBAdapter (see `src/lib/adapters/`)
- `IdaeDBModel`: MongoDB auto-increment tracking
- `IdaeEventEmitter`: Decorator-based event system

## Critical Patterns & Conventions

### Event System (MUST USE)
All adapter methods are decorated with `@withEmitter` (see `src/lib/IdaeEventEmitter.ts`). This emits `pre:method`, `post:method`, and `error:method` events. Register listeners via `collection.registerEvents()`:

```typescript
const users = db.collection<User>('user');
users.registerEvents({
  create: {
    pre: (data) => console.log('Creating:', data),
    post: (result, data) => console.log('Created:', result),
    error: (err) => console.error(err)
  }
});
```

### Adapter Pattern
To add a new DB, implement `IdaeDbAdapterInterface<T>` (see `src/lib/@types/types.ts`).
- Implement static: `connect()`, `getDb()`, `close()`
- Implement instance: `create()`, `find()`, `findOne()`, `update()`, `deleteById()`, `transaction()`
- Register in `IdaeDbAdapter.ts` static block:
  ```typescript
  static { IdaeDbAdapter.addAdapter(DbType.NEWDB, MyNewAdapter); }
  ```

### Type Safety
- All models: `T extends object`
- Query params: `IdaeDbParams<T>` (with `query`, `sortBy`, `limit`, `skip`)
- MongoDB filters: use `Filter<T>`
- ID field: MongoDB uses `_id` or custom via `autoIncrementFormat` (see `IdaeDBModel.fieldId`)


## Package Management

This project uses **pnpm** for dependency management. Always use pnpm commands (not npm or yarn) for installing or updating packages:

```bash
pnpm install         # Install all dependencies
pnpm add <package>   # Add a new dependency
pnpm update          # Update dependencies
```

## Developer Workflows

### Build & Test
- **Build:** `npm run build` (Vite → svelte-package → publint)
- **Test:** `npm run test` (Vitest, see `vite.config.ts`)
- **Lint/Format:** `npm run lint` / `npm run format`
- **Typecheck:** `npm run check`

### Usage Example
See `src/example.ts` and `README.md` for full CRUD and event usage.

### Integration Points
- Exports: All public API via `src/lib/index.ts`
- Peer deps: Svelte 5+, ChromaDB, MongoDB driver (not all in package.json)

## Known Constraints
- MongoDB `.db()` usage is not abstracted for all adapters
- Auto-increment is MongoDB-only
- No transaction support in MySQL/ChromaDB yet
- No test DB fixtures (add for integration tests)
- `DbType` enum is string-based (consider dynamic registration)

---
**Last updated:** January 2026 — Maintained by @medyll
