---
name: idae-db
description: Use this for multi-database access in Node.js/TypeScript. Provides a unified adapter API over MongoDB, MySQL, PostgreSQL, SQLite, PouchDB, and ChromaDB — always use this instead of raw drivers in Idae backend projects.
---

## What it does
`@medyll/idae-db` is a multi-database abstraction layer. A single `IdaeDb` instance manages
connections and hands out typed collection adapters with CRUD, lifecycle hooks (pre/post/error),
auto-increment, and pluggable adapters.

## Install
```bash
pnpm add @medyll/idae-db
```

## Quick start
```ts
import { IdaeDb, DbType } from '@medyll/idae-db';

interface User { iduser: number; name: string; email: string; age: number }

// 1. Init (singleton per uri+dbType)
const db = IdaeDb.init('mongodb://localhost:27017', {
  dbType: DbType.MONGODB,
  dbScope: 'myapp',          // prefixes every db name: "myapp_<dbName>"
  idaeModelOptions: {
    autoIncrementFormat: (col) => `id${col}`,
  },
});

// 2. Open a named database
await db.db('app');

// 3. Get a typed collection adapter
const users = db.collection<User>('user');

// 4. CRUD
await users.create({ name: 'Alice', email: 'alice@example.com', age: 30 });
const alice = await users.findOne({ query: { email: 'alice@example.com' } });
await users.update(alice.iduser, { age: 31 });
const results = await users.find({ query: { age: { $gt: 18 } }, sortBy: 'name:asc', limit: 10 });
await users.deleteById(alice.iduser);
await db.closeAllConnections();
```

## API

### `IdaeDb`
| Method | Description |
|---|---|
| `IdaeDb.init(uri, options?)` | Returns singleton for this uri+dbType |
| `db.db(dbName)` | Opens (or reuses) a named database connection |
| `db.collection<T>(name)` | Returns an `IdaeDbAdapter<T>` for a collection |
| `db.closeConnection()` | Close the current connection |
| `db.closeAllConnections()` | Close all open connections |
| `db.registerEvents(events)` | Attach global pre/post/error hooks to all collections |

### `IdaeDbOptions`
| Field | Type | Description |
|---|---|---|
| `dbType` | `DbType` | `MONGODB` \| `MYSQL` \| `POSTGRESQL` \| `SQLITE` \| `POUCHDB` \| `CHROMADB` |
| `dbScope` | `string` | Prefix prepended to every db name |
| `idaeModelOptions` | `IdaeModelOptions` | `autoIncrementFormat`, `autoIncrementDbCollection` |
| `dbEvents` | `EventListeners` | Global lifecycle hooks |

### `IdaeDbAdapter<T>` — collection methods
| Method | Signature |
|---|---|
| `create` | `(data: Partial<T>) => Promise<T>` |
| `findOne` | `({ query }) => Promise<T \| null>` |
| `find` / `where` | `({ query, sortBy?, limit?, skip? }) => Promise<T[]>` |
| `findById` | `(id: string) => Promise<T[]>` |
| `update` | `(id, Partial<T>) => Promise<unknown>` |
| `updateWhere` | `({ query }, updateData, opts?) => Promise<unknown>` |
| `deleteById` | `(id) => Promise<unknown>` |
| `deleteWhere` | `({ query }) => Promise<{ deletedCount? }>` |
| `createIndex` | `(fieldOrSpec, options?) => Promise<unknown>` |
| `transaction` | `(callback) => Promise<TResult>` |
| `registerEvents` | `(EventListeners) => void` |

## Patterns & gotchas
- `IdaeDb.init()` is a singleton — same uri+dbType always returns the same instance.
- Call `await db.db(name)` before calling `db.collection()`, or collection() will throw.
- `dbScope` joins with `_`: `dbScope: 'prod'` + `db('users')` → database `prod_users`.
- `where()` is the preferred alias for `find()`; both accept `IdaeDbParams<T>`.
- Auto-increment requires `idaeModelOptions.autoIncrementFormat` and stores counters in a
  separate `auto_increment` collection.
- Lifecycle hooks fire as `pre:<method>`, `post:<method>`, `error:<method>` events.
