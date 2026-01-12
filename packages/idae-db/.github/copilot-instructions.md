# Idae Database Library - AI Coding Instructions

## Project Overview

**@medyll/idae-db** is a TypeScript library providing a flexible database abstraction layer for MongoDB, MySQL, and ChromaDB with event-driven CRUD operations, auto-increment support, and connection pooling via singleton pattern.

### Architecture

The library uses a **Strategy pattern** with adapters:
- **IdaeDb** (singleton): Entry point, manages instances per URI+DbType combo, handles initialization
- **IdaeDbConnection**: Per-database connection instance, creates collections/tables via adapters
- **IdaeDbAdapter**: Generic adapter facade with pre/post hooks via decorators
- **Database-specific adapters**: MongoDBAdapter, MySQLAdapter, ChromaDBAdapter (implement IdaeDbAdapterInterface)
- **IdaeDBModel**: Per-collection model for MongoDB, handles auto-increment tracking

Key flow: `IdaeDb.init()` → `db(dbName)` → `collection<T>(name)` → operations with events

## Development Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Build and package (runs vite build + svelte-package + publint)
npm run test         # Run Vitest tests (src/**/*.{test,spec}.{js,ts})
npm run lint         # Check Prettier + ESLint
npm run format       # Auto-fix formatting
npm run check        # Svelte type checking
npm run check:watch  # Watch mode type checking
npm run package:pre  # Pre-publish script
```

## Code Patterns & Conventions

### Event System (Critical Pattern)

All adapter methods support pre/post/error hooks via **@withEmitter decorator** (in [IdaeEventEmitter.ts](src/lib/IdaeEventEmitter.ts)):

```typescript
// In adapter implementation, decorate methods:
@withEmitter()
async create(data: Partial<T>): Promise<T> { ... }

// Register global listeners on connection:
const collection = db.collection<User>('user');
collection.registerEvents<User>({
  create: {
    pre: (data) => console.log('Creating:', data),
    post: (result, data) => console.log('Created:', result),
    error: (err) => console.error(err)
  }
});
```

Emitter events: `pre:methodName`, `post:methodName`, `error:methodName`

### Adapter Pattern

New adapters must implement `IdaeDbAdapterInterface<T>` from [types.ts](src/lib/@types/types.ts):

```typescript
// Required static methods for connection lifecycle
static async connect(uri: string): Promise<Client>
static getDb(client: Client, dbName: string): Database
static async close(client: Client): Promise<void>

// Required instance methods
async create(data: Partial<T>): Promise<T>
async find(params: IdaeDbParams<T>): Promise<T[]>
async findOne(params: IdaeDbParams<T>): Promise<T | null>
async update(id: string, updateData: Partial<T>): Promise<unknown>
async deleteById(id: string): Promise<unknown>
async transaction<TResult>(callback: (session) => Promise<TResult>): Promise<TResult>
```

Register new adapters in [IdaeDbAdapter.ts](src/lib/IdaeDbAdapter.ts) static initializer:
```typescript
static {
  IdaeDbAdapter.addAdapter(DbType.NEWDB, MyNewAdapter);
}
```

### Type Safety

- Enforce strict TypeScript with `strict: true` in tsconfig
- Use generic `T extends object` for all model types
- Filter types use MongoDB's `Filter<T>` from driver for consistency
- Query params: `IdaeDbParams<T>` with optional `query`, `sortBy`, `limit`, `skip`

### ID Fields

- MongoDB: uses `_id` by default or custom via `autoIncrementFormat`
- Custom ID tracking via `IdaeDBModel.fieldId` and auto-increment collection
- Retrieved from model: `adapter.model.fieldId`

## Build & Package

- **Build**: Vite → ESM output to `dist/`, exports via [index.ts](src/lib/index.ts)
- **Package**: svelte-package generates `dist/index.d.ts` and `dist/index.js`
- **Pre-publish**: `scripts/package-pre.js` runs before npm publish
- **Export maps** in package.json support Svelte, ESM, and TypeScript

## Testing

- Framework: **Vitest** (config in [vite.config.ts](vite.config.ts))
- Pattern: `describe()`, `it()`, `expect()` (e.g., [index.test.ts](src/index.test.ts))
- Test files: `src/**/*.{test,spec}.{js,ts}`
- No test database setup yet—add MongoDB/MySQL fixtures as needed

## External Dependencies

- **mongodb**: MongoDB driver for queries and transactions
- **svelte/svelte-kit**: Framework (peer dependency for Svelte 5+)
- **vite/vitest**: Build and test runner
- **prettier/eslint**: Code formatting and linting
- **@sveltejs/package**: Packaging utility

## Known Constraints

- MongoDB adapter references `.db()` for connection, needs refactoring for MySQL/ChromaDB
- Auto-increment currently MongoDB-specific, needs abstraction
- No transaction support in MySQL/ChromaDB adapters yet
- DbType enum is string-based (consider supporting registration for extensibility)
