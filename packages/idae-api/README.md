# @medyll/idae-api

A flexible and extensible Node.js API, based on the [@medyll/idae-db](https://www.npmjs.com/package/@medyll/idae-db) library, allowing you to manage multiple types of databases (MongoDB, MySQL, etc.) and providing a complete TypeScript client to interact with your endpoints.

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Main Features](#main-features)
- [Server Usage](#server-usage)
  - [Configuration](#configuration)
  - [Adding Custom Routes](#adding-custom-routes)
  - [Database Management](#database-management)
  - [Error Handling](#error-handling)
- [Client Usage](#client-usage)
  - [Client Configuration](#client-configuration)
  - [Available Methods](#available-methods)
  - [Usage Examples](#usage-examples)
- [Full List of Methods (inherited from idae-db)](#full-list-of-methods-inherited-from-idae-db)
- [Contributing](#contributing)
- [License](#license)

---

## Overview


`@medyll/idae-api` is a modular Node.js API framework designed to work with multiple database types thanks to the [@medyll/idae-db](https://www.npmjs.com/package/@medyll/idae-db) library. It offers:

- Modular architecture (routes, middlewares, dynamic connection management)
- TypeScript/JavaScript client for easy API consumption
- Extension system to support other databases
- Native support for MongoDB and MySQL (via idae-db)
- Hooks/events on CRUD operations
- **MongoDB-like API syntax:** All query and update operations use a syntax very close to MongoDB (operators like `$in`, `$gt`, `$set`, etc.), making it intuitive for developers familiar with MongoDB.

## Installation

```bash
npm install @medyll/idae-api

npm install @medyll/idae-api --latest # to install the latest version
npm install @medyll/idae-api --next # for the next version (if available)

```

---

## Main Features

- Multi-database management (MongoDB, MySQL, etc.)
- Flexible routing and custom route addition
- Optional authentication middleware
- Centralized error handling
- Hooks/events on all CRUD operations
- Complete TypeScript client for API consumption
- Inherits all advanced methods from [@medyll/idae-db](https://www.npmjs.com/package/@medyll/idae-db)

---

## Server Usage

### Configuration

```typescript
import { idaeApi } from '@medyll/idae-api';

idaeApi.setOptions({
  port: 3000,
  enableAuth: true, // or false
  jwtSecret: 'your-secret-key',
  tokenExpiration: '1h',
  routes: customRoutes // optional
});

idaeApi.start();
```

#### Example of custom routes

```typescript
const customRoutes = [
  {
    method: 'get',
    path: '/custom/hello',
    handler: async () => ({ message: 'Hello from custom route!' }),
    requiresAuth: false
  }
];

idaeApi.router.addRoutes(customRoutes);
```

### Database Management

`idae-api` relies on `@medyll/idae-db` for connection and database operation management. You can:

- Add new database adapters (see the `DatabaseAdapter` interface in idae-db)
- Use all hooks/events from idae-db (see below)

### Error Handling

An error handling middleware is included. You can customize it via the `configureErrorHandling` method in the `IdaeApi` class.

---

## Client Usage

### Client Configuration

```typescript
import { IdaeApiClientConfig } from '@medyll/idae-api';

IdaeApiClientConfig.setOptions({
  host: 'localhost',
  port: 3000,
  method: 'http',
  defaultDb: 'idae_base',
  separator: '//'
});
```

### Creating a client instance

```typescript
import { IdaeApiClient } from '@medyll/idae-api';

const client = new IdaeApiClient();
```

### Available Methods

#### Database and Collection Management

- `getDbList()` : List available databases
- `getCollections(dbName)` : List collections in a database
- `db(dbName)` : Select a database (returns an object with `collection` and `getCollections`)
- `collection(collectionName, dbName?)` : Select a collection (optionally in a given database)

### Event/Hook Management (inherited from idae-db)

You can register hooks on all operations:

```typescript
const usersCollection = client.collection('user');

usersCollection.registerEvents({
  findById: {
    pre: (id) => console.log(`Before searching for ID: ${id}`),
    post: (result, id) => console.log(`Result for ${id}:`, result),
    error: (error) => console.error('Error on findById:', error)
  },
  // ... same for update, create, etc.
});

#### CRUD Operations on a Collection

All the following methods are available via the `IdaeApiClientCollection` object:

- `findAll(params?)` : List all documents (with filters, sorting, pagination)
- `findById(id)` : Get a document by its ID
- `findOne(params)` : Get a document by a filter (inherited from idae-db)
- `create(body)` : Create a document
- `update(id, body)` : Update a document
- `deleteById(id)` : Delete a document by its ID
- `deleteManyByQuery(params)` : Delete multiple documents by filter

#
```

### Usage Examples

### MongoDB-like Query Syntax

All query and update operations use a syntax very close to MongoDB. For example, you can use operators like `$in`, `$gt`, `$set`, etc. in your queries and updates.

---

#### List databases

```typescript
const dbList = await client.getDbList();
console.log('Databases:', dbList);
```

#### List collections in a database

```typescript
const collections = await client.getCollections('idae_base');
console.log('Collections:', collections);
```

#### Find documents with advanced query (MongoDB-like)

```typescript
const userCollection = client.db('app').collection('user');
const users = await userCollection.find({
  email: { $in: ["Karin@example.com", "Test@Value"] },
  age: 31,
});
console.log(users);
```

#### Create a new document

```typescript
const newUser = await userCollection.create({
  name: "new user",
  email: "Test@Value",
});
console.log(newUser);
```

#### Find all documents in a collection

```typescript
const allDocs = await userCollection.findAll();
console.log(allDocs);
```

#### Find a specific document by ID

```typescript
const foundDoc = await userCollection.findById(newUser._id);
console.log(foundDoc);
```

#### Update a document (MongoDB-like update syntax)

```typescript
const updatedDoc = await userCollection.update(newUser._id, {
  $set: { value: "Updated Value" },
});
console.log(updatedDoc);
```

#### Delete a document

```typescript
const deleteResult = await userCollection.deleteById(newUser._id);
console.log(deleteResult);
```

#### Use a specific database and collection

```typescript
const appSchemeCollection = client.db('idae_base').collection('appscheme');
const docs = await appSchemeCollection.findAll();
console.log(docs);
```

#### Delete many documents by query (be careful with this!)

```typescript
const deleteResult2 = await client
  .collection('appscheme_base')
  .deleteManyByQuery({ testField: 'testValue' });
console.log(deleteResult2);
```

#### Register hooks/events on collection methods

```typescript
const usersCollection = client.collection('user');

usersCollection.registerEvents({
  findById: {
    pre: (id) => console.log(`Before searching for ID: ${id}`),
    post: (result, id) => console.log(`Result for ${id}:`, result),
    error: (error) => console.error('Error on findById:', error)
  },
  // ... same for update, create, etc.
});
```

---

## Full List of Methods (inherited from idae-db)

### Collection Methods

- `find(params)` : Advanced search (filters, sorting, pagination)
- `findOne(params)` : Find a single document by filter
- `findById(id)` : Find by ID
- `create(data)` : Create
- `update(id, data)` : Update
- `deleteById(id)` : Delete by ID
- `deleteManyByQuery(params)` : Bulk delete
- `registerEvents(events)` : Register hooks (pre/post/error) on each method

### Connection Management

- `closeAllConnections()` : Close all active connections

### Useful Types

- `RequestParams` : `Record<string, unknown>`
- `HttpMethod` : `'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'`
- `RouteNamespace` : ``methods/${'dbs' | 'collections'}``
- `UrlParams` : `{ dbName?: string; collectionName?: string; slug?: string; params?: Record<string, string>; routeNamespace?: RouteNamespace }`
- `RequestOptions<T>` : `UrlParams & { baseUrl?: string; method?: HttpMethod; body?: T; headers?: RequestInit['headers'] }`

---

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

---

## License

This project is licensed under the MIT License.
