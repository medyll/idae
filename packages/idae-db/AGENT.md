# @medyll/idae-db - Agent Instructions

**Version**: 0.106.0  
**Scope**: `@medyll`  
**Type**: TypeScript/library published to npm

## Monorepo Context

This package is part of the **idae** monorepo:
```
idae/
├── packages/
│   ├── idae-db (this package)
│   └── [other packages]
└── [root config files]
```

All packages in `idae/packages/*` share:
- Common TypeScript configuration
- Shared dev dependencies (Vite, Vitest, ESLint, Prettier)
- SvelteKit build tooling
- Monorepo root coordination

## Package Overview

**@medyll/idae-db** is a flexible database abstraction layer for **MongoDB**, **MySQL**, and **ChromaDB** with:
- Event-driven CRUD operations (pre/post/error hooks)
- Auto-increment support (MongoDB)
- Connection pooling via singleton pattern
- Type-safe generic API with TypeScript strict mode

### Key Features

- **Strategy Pattern with Adapters**: Database-agnostic API via adapter facade
- **Event Emitter System**: Pre/post/error hooks on all operations
- **Singleton Connection Management**: One instance per URI+DbType combination
- **Generic Type Safety**: `T extends object` for all models
- **Transaction Support**: Native in MongoDB and MySQL

## Architecture

### Core Components

| Component | Purpose |
|-----------|---------|
| `IdaeDb` | Singleton entry point, manages instances per URI+DbType |
| `IdaeDbConnection` | Per-database connection, creates collections/tables |
| `IdaeDbAdapter` | Facade with pre/post hooks via `@withEmitter` decorator |
| `*Adapter` classes | Database-specific implementations (Mongo, MySQL, ChromaDB) |
| `IdaeDBModel` | MongoDB-specific auto-increment tracking |
| `IdaeEventEmitter` | Decorator-based event system |

### Data Flow

```
IdaeDb.init(uri, type)
  → db(dbName)
    → collection<T>(name)
      → adapter methods (create, find, findOne, update, deleteById, transaction)
        → @withEmitter hooks (pre/post/error)
          → Database-specific implementation
```

## Development

### Quick Start

```bash
npm install                # Install dependencies
npm run format            # Fix formatting (Prettier)
npm run lint              # Check code style (ESLint + Prettier)
npm run check             # Svelte type checking
npm run dev               # Start Vite dev server
npm run build             # Build and package (vite + svelte-package + publint)
npm run test              # Run Vitest tests
npm run  prepackage      # Pre-publish script
```

### Build Pipeline

1. **Vite transpilation** → ESM output to `dist/`
2. **svelte-package** → Type definitions + bundling
3. **publint** → Validation
4. **Exports** → `dist/index.d.ts` (types), `dist/index.js` (module)

### Testing

- Framework: **Vitest**
- Pattern: `describe()`, `it()`, `expect()`
- Files: `src/**/*.{test,spec}.{js,ts}`
- Config: [vite.config.ts](vite.config.ts)

### Code Quality

- **Prettier**: Auto-formatting
- **ESLint**: Linting with Svelte plugin
- **TypeScript**: `strict: true`

## Code Patterns

### Event System (Critical)

All adapter methods support pre/post/error hooks via `@withEmitter` decorator:

```typescript
// In adapter class:
@withEmitter()
async create(data: Partial<T>): Promise<T> { ... }

// Register listeners on collection:
const collection = db.collection<User>('user');
collection.registerEvents<User>({
  create: {
    pre: (data) => console.log('Creating:', data),
    post: (result, data) => console.log('Created:', result),
    error: (err) => console.error(err)
  }
});
```

Events emitted: `pre:methodName`, `post:methodName`, `error:methodName`

### Adding New Adapters

1. Implement `IdaeDbAdapterInterface<T>` from [types.ts](src/lib/@types/types.ts)
2. Implement static methods: `connect()`, `getDb()`, `close()`
3. Implement instance methods: `create()`, `find()`, `findOne()`, `update()`, `deleteById()`, `transaction()`
4. Register in [IdaeDbAdapter.ts](src/lib/IdaeDbAdapter.ts) static initializer:

```typescript
static {
  IdaeDbAdapter.addAdapter(DbType.NEWDB, MyNewAdapter);
}
```

### Type Safety

- Use `T extends object` for all generic models
- Filter types: MongoDB's `Filter<T>` from driver
- Query params: `IdaeDbParams<T>` (optional `query`, `sortBy`, `limit`, `skip`)
- ID fields: MongoDB uses `_id`, custom via `autoIncrementFormat`

## File Structure

```
src/
├── lib/
│   ├── idaeDb.ts              # Singleton entry point
│   ├── IdaeDbAdapter.ts       # Facade with hook decorators
│   ├── IdaeDbConnection.ts    # Per-database connection
│   ├── IdaeDBModel.ts         # Auto-increment tracking (MongoDB)
│   ├── IdaeEventEmitter.ts    # @withEmitter decorator
│   ├── index.ts               # Public API exports
│   ├── @types/
│   │   └── types.ts           # All TypeScript interfaces
│   └── adapters/
│       ├── MongoDBAdapter.ts
│       ├── MySQLAdapter.ts
│       └── ChromaDBAdapter.ts
├── index.test.ts              # Main tests
├── example.ts                 # Usage examples
└── routes/ + app.*            # SvelteKit boilerplate

scripts/
├── index.js
└── package-pre.js             # Pre-publish hook

tests/
└── mongodb.test.ts            # Integration tests
```

## Dependencies

### Production
- `chromadb@^2.2.1` — ChromaDB client

### Peer Dependencies
- `svelte@^5.0.0-next` — Svelte framework

### Dev Dependencies
- `@sveltejs/kit@^2.20.7` — Build framework
- `@sveltejs/package@^2.3.11` — Packaging
- `typescript@^5.8.3` — Type checking
- `vite@^6.3.2` — Build tool
- `vitest@^3.1.1` — Test runner
- `prettier@^3.5.3` + `eslint@^9.25.0` — Code quality

> **Note**: MongoDB and MySQL drivers are NOT in package.json—implement as peer dependencies or optional in the future

## Known Constraints & TODOs

- ⚠️ MongoDB adapter uses `.db()` for connections—needs refactoring for MySQL/ChromaDB compatibility
- ⚠️ Auto-increment is MongoDB-specific—needs abstraction for other adapters
- ⚠️ Transaction support missing in MySQL/ChromaDB adapters
- ⚠️ No test database fixtures setup—add MongoDB/MySQL integration tests
- 🔄 DbType enum is string-based—consider supporting dynamic registration

## Npm Publishing

- **Main entry**: `dist/index.d.ts` (types) + `dist/index.js` (ESM)
- **Pre-publish hook**: `scripts/package-pre.js` (runs before `npm publish`)
- **Files included**: Only `dist/` (test files excluded)
- **Distribution formats**: CommonJS (via ESM) + TypeScript declarations

## Useful Commands for Agents

```bash
# Develop & test
npm run dev              # Hot-reload during development
npm run check            # Type checking (Svelte + TS)
npm run test             # Run unit tests

# Code quality
npm run lint             # Check Prettier + ESLint
npm run format           # Auto-fix formatting

# Build & publish
npm run build            # Full build pipeline (vite → svelte-package → publint)
npm run prepackage      # Pre-publish validation
```

## Implementation Guidelines

1. **Always maintain type safety**: Use strict TypeScript, avoid `any`
2. **Use the event system**: Leverage pre/post hooks for cross-cutting concerns
3. **Follow adapter pattern**: New DB support = new adapter + registration
4. **Test with Vitest**: Unit tests in same directory as source
5. **Respect strict mode**: tsconfig has `strict: true`
6. **Export via index.ts**: Public API defined in [index.ts](src/lib/index.ts)

---

**Last Updated**: January 2026  
**Maintained By**: @medyll team
