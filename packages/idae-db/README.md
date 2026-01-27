# Idae Database Library

**Idae Database Library** is a flexible, type-safe, event-driven database abstraction for Node.js and TypeScript. It supports MongoDB, MySQL, ChromaDB, PouchDB, SQLite, and PostgreSQL with a unified API, event hooks, and singleton connection management.

## Features

- **Multi-Database Support:** MongoDB, MySQL, ChromaDB, PouchDB, SQLite, PostgreSQL
- **Event-driven CRUD:** Pre/post/error hooks on all operations
- **Type Safety:** Full TypeScript generics, strict mode
- **Singleton Pattern:** One connection per URI+DbType
- **Adapter Pattern:** Easily extend to new databases
- **Auto-increment:** Native for MongoDB, extensible for others
- **Transaction Support:** Native in MongoDB/MySQL

## Supported Adapters

| DbType        | Adapter Class         | Peer Dependency |
|-------------- |----------------------|-----------------|
| MONGODB       | MongoDBAdapter        | mongodb         |
| MYSQL         | MySQLAdapter          | mysql2          |
| CHROMADB      | ChromaDBAdapter       | chromadb        |
| POUCHDB       | PouchDBAdapter        | pouchdb         |
| SQLITE        | SQLiteAdapter         | sqlite3         |
| POSTGRESQL    | PostgreSQLAdapter     | pg              |

## Installation

Install the core library and the peer dependencies for your database(s):

```bash
pnpm add @medyll/idae-db
# For MongoDB:
pnpm add mongodb
# For MySQL:
pnpm add mysql2
# For ChromaDB:
pnpm add chromadb
# For PouchDB:
pnpm add pouchdb
# For SQLite:
pnpm add sqlite3
# For PostgreSQL:
pnpm add pg
```

## Quick Start

### 1. Initialize a Database

```typescript
import { IdaeDb } from '@medyll/idae-db';
import { DbType } from '@medyll/idae-db/lib/@types/types';

const db = IdaeDb.init('mongodb://localhost:27017', {
    dbType: DbType.MONGODB,
    dbScope: 'app',
});
await db.db('app');
```

### 2. Define a Model

```typescript
interface User {
    iduser: number;
    name: string;
    email: string;
    age: number;
}
```

### 3. CRUD Operations

```typescript
const users = db.collection<User>('user');
const newUser = await users.create({ name: 'Alice', email: 'alice@example.com', age: 25 });
const found = await users.findOne({ query: { email: 'alice@example.com' } });
await users.update(found.iduser, { age: 26 });
await users.deleteById(found.iduser);
```

### 4. Event Hooks

```typescript
users.registerEvents({
    create: {
        pre: (data) => console.log('Creating:', data),
        post: (result, data) => console.log('Created:', result),
        error: (err) => console.error(err)
    }
});
```

## Adapter Usage Examples

### MongoDB

```typescript
const mongoDb = IdaeDb.init('mongodb://localhost:27017', { dbType: DbType.MONGODB });
await mongoDb.db('app');
const users = mongoDb.collection<User>('user');
```

### MySQL

```typescript
const mysqlDb = IdaeDb.init('mysql://user:password@localhost:3306', { dbType: DbType.MYSQL });
await mysqlDb.db('app');
const users = mysqlDb.collection<User>('user');
```

### ChromaDB

```typescript
const chromaDb = IdaeDb.init('chromadb://localhost:8000', { dbType: DbType.CHROMADB });
await chromaDb.db('app');
const items = chromaDb.collection<any>('item');
```

### PouchDB

```typescript
const pouchDb = IdaeDb.init('pouchdb://./my-pouchdb-folder', { dbType: DbType.POUCHDB });
await pouchDb.db('app');
const docs = pouchDb.collection<any>('doc');
```

### SQLite

```typescript
const sqliteDb = IdaeDb.init('sqlite://./mydb.sqlite', { dbType: DbType.SQLITE });
await sqliteDb.db('app');
const users = sqliteDb.collection<User>('user');
```

### PostgreSQL

```typescript
const pgDb = IdaeDb.init('postgresql://user:password@localhost:5432/mydb', { dbType: DbType.POSTGRESQL });
await pgDb.db('app');
const users = pgDb.collection<User>('user');
```

## Event System

All CRUD methods emit `pre:method`, `post:method`, and `error:method` events. Register listeners with `registerEvents`:

```typescript
users.registerEvents({
    create: {
        pre: (data) => console.log('Creating:', data),
        post: (result, data) => console.log('Created:', result),
        error: (err) => console.error(err)
    },
    update: {
        pre: (id, data) => console.log('Updating:', id, data),
        post: (result, id, data) => console.log('Updated:', result),
        error: (err) => console.error(err)
    }
});
```

## Type Safety

- All models are fully typed (`T extends object`)
- Query params: `IdaeDbParams<T>`
- MongoDB filters: use `Filter<T>`
- ID field: MongoDB uses `_id` or custom via `autoIncrementFormat`

## Singleton & Connection Management

- One instance per URI+DbType
- Use `.closeAllConnections()` to gracefully close all DBs:

```typescript
await db.closeAllConnections();
```

## Scripts

```bash
pnpm run test            # Run all tests
pnpm run build           # Build the package
pnpm run lint            # Lint code
pnpm run format          # Format code
```

## License

MIT License
import { DbType } from './lib/@types/types.js';

const pouchDb = IdaeDb.init('pouchdb://./my-pouchdb-folder', {
    dbType: DbType.POUCHDB
});
```

#### SQLite

```typescript
import { IdaeDb } from './lib/idaeDb.js';
import { DbType } from './lib/@types/types.js';

const sqliteDb = IdaeDb.init('sqlite://./mydb.sqlite', {
    dbType: DbType.SQLITE
});
```

#### PostgreSQL

```typescript
import { IdaeDb } from './lib/idaeDb.js';
import { DbType } from './lib/@types/types.js';

const pgDb = IdaeDb.init('postgresql://user:password@localhost:5432/mydb', {
    dbType: DbType.POSTGRESQL
});
```

### Create a Connection

Create a connection to the database:

```typescript
await mongoDb.db('app');
await mysqlDb.db('app');
```

### Define a Model

Define a model interface:

```typescript
interface User {
    iduser: number;
    name: string;
    email: string;
    age: number;
}
```

### Register Event Listeners

Register event listeners for various operations:

```typescript
const usersCollection = mongoDb.collection<User>('user');

usersCollection.registerEvents<any>({
    findById: {
        pre: (id) => console.log(`About to find document with id: ${id}`),
        post: (result, id) => console.log(`Found document for id ${id}:`, result),
        error: (error) => console.error('Error in findById:', error)
    },
    update: {
        pre: (id, data) => console.log(`About to update document ${id} with:`, data),
        post: (result, id, data) => console.log(`Updated document ${id}:`, result)
    },
    create: {
        pre: (data) => console.log(`About to create document with:`, data),
        post: (data, result) => console.log(`Created document `, data, result)
    }
});
```

### CRUD Operations

Perform CRUD operations:

#### MongoDB

```typescript
// Create a new user
const newUser = await usersCollection.create({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});

// Find a user by email
const user = await usersCollection.findOne({ query: { email: 'john@example.com' } });

// Update a user's age
const updateResult = await usersCollection.update(user.iduser, { age: 31 });

// Find users with age greater than 25
const users = await usersCollection.find({
    query: { age: { $gt: 25 } },
    sortBy: 'name:asc',
    limit: 10
});

// Delete a user by ID
const deleteResult = await usersCollection.deleteById(5);
```

#### MySQL

```typescript
const usersCollection = mysqlDb.collection<User>('user');

// Create a new user
const newUser = await usersCollection.create({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});

// Find a user by email
const user = await usersCollection.findOne({ query: { email: 'john@example.com' } });

// Update a user's age
const updateResult = await usersCollection.update(user.iduser, { age: 31 });

// Find users with age greater than 25
const users = await usersCollection.find({
    query: { age: { $gt: 25 } },
    sortBy: 'name:asc',
    limit: 10
});

// Delete a user by ID
const deleteResult = await usersCollection.deleteById(5);
```

### Close Connections

Close all connections when done:

```typescript
await mongoDb.closeAllConnections();
await mysqlDb.closeAllConnections();
```

## License

This project is licensed under the MIT License.