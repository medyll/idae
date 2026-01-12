# Idae Database Library

The Idae Database Library provides a flexible and extensible way to interact with various databases such as MongoDB, MySQL. It includes features like event emitters for pre/post hooks, auto-increment fields, and more.

## Installation

To install the library, run:

```bash
npm install idae-db
```

## Scripts

```bash
npm run test            # Run all tests
npm run test:coverage   # Run tests with coverage (v8)
npm run test:mongodb    # Run only the MongoDB adapter suite (in-memory mongo)
```

## Usage

### Initialization

First, initialize the database connection:

#### MongoDB

```typescript
import { IdaeDb } from './lib/idaeDb.js';
import { DbType } from './lib/@types/types.js';

const mongoDb = IdaeDb.init('mongodb://localhost:27017', {
    dbType: DbType.MONGODB,
    dbScope: 'a_idae_db_sitebase',
    dbScopeSeparator: '_',
    idaeModelOptions: {
        autoIncrementFormat: (collection: string) => `id${collection}`,
        autoIncrementDbCollection: 'auto_increment'
    }
});
```

#### MySQL

```typescript
import { IdaeDb } from './lib/idaeDb.js';
import { DbType } from './lib/@types/types.js';

const mysqlDb = IdaeDb.init('mysql://user:password@localhost:3306', {
    dbType: DbType.MYSQL,
    dbScope: 'a_idae_db_sitebase',
    dbScopeSeparator: '_',
    idaeModelOptions: {
        autoIncrementFormat: (collection: string) => `id${collection}`,
        autoIncrementDbCollection: 'auto_increment'
    }
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