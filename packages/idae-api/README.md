# @medyll/idae-api

A flexible and extensible Node.js API framework, built on top of [@medyll/idae-db](https://www.npmjs.com/package/@medyll/idae-db). It provides a complete solution for managing multiple database types (MongoDB, MySQL, PostgreSQL, SQLite, PouchDB, ChromaDB) with a modular architecture and a type-safe TypeScript client.

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Main Features](#main-features)
- [Server-Side Usage](#server-side-usage)
  - [Initialization & Configuration](#initialization--configuration)
  - [Routing & Custom Endpoints](#routing--custom-endpoints)
  - [Middleware & Multi-Tenancy](#middleware--multi-tenancy)
  - [Error Handling](#error-handling)
- [Client-Side Usage](#client-side-usage)
  - [Client Configuration](#client-configuration)
  - [Usage Examples](#usage-examples)
  - [Method Reference](#method-reference)
  - [Query Syntax (MongoDB-like)](#query-syntax-mongodb-like)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)
- [License](#license)

---

## Overview

`@medyll/idae-api` bridges your data layer and your application with a powerful API framework.

- **Unified Data Access**: Manage MongoDB, MySQL, PostgreSQL, SQLite, PouchDB, and ChromaDB through a single interface.
- **Developer Experience**: TypeScript-first approach, auto-generated OpenAPI docs, and intuitive MongoDB-like syntax for all databases.
- **Enterprise Features**: Strict multi-tenancy, JWT authentication, RBAC/ABAC authorization, and centralized error handling (moved to `HttpError`).
- **Observability**: Structured logging with `pino` default integration.

## Installation

```bash
npm install @medyll/idae-api
```

---

## Main Features

| Server Side | Client Side |
|-------------|-------------|
| 🛠 **Modular Architecture**: Express-based with dynamic connection management. | 📦 **Type-Safe Client**: Full TypeScript support for API consumption. |
| 🔌 **Multi-DB Support**: Native support for **MongoDB, MySQL, PostgreSQL, SQLite, PouchDB, and ChromaDB** via `idae-db`. | 🔍 **Unified Query Syntax**: Use MongoDB operators (`$in`, `$gt`, `$set`) for all DBs. |
| 🛡 **Security**: JWT Auth, RBAC Authorization, Rate Limiting, Helmet. | ⚡ **Reactive Hooks**: Register `pre` and `post` hooks on any CRUD operation. |
| 🏢 **Multi-Tenancy**: Built-in tenant context enforcement. | 🔗 **Chainable API**: Easy selection of databases and collections. |
| 📝 **Documentation**: Auto-generated OpenAPI (Swagger/Redoc). | |

---

# Server-Side Usage

This section covers how to set up and run the `idae-api` server.

### Initialization & Configuration

Use `idaeApi.setOptions()` to configure the server before starting it.

```typescript
import { idaeApi } from '@medyll/idae-api';
import { logger } from '@medyll/idae-api/services/logger'; // If available or custom logger

idaeApi.setOptions({
  port: 3000,
  enableAuth: true,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiration: '1h',
  onInUse: 'replace', // 'fail' or 'replace' if port is busy
  cors: { origin: '*' }, // Standard CORS options
  rateLimit: { windowMs: 60000, max: 100 }
});

idaeApi.start();
logger.info(`Server state: ${idaeApi.state}`);
```

### Routing & Custom Endpoints

You can inject custom routes into the API.

```typescript
const customRoutes = [
  {
    method: 'get',
    path: '/custom/hello',
    requiresAuth: false,
    // Handler receives the connected service derived from the URL context if applicable,
    // otherwise it's a standard endpoint.
    handler: async (service, params, body, query) => {
      return { message: 'Hello from custom route!' };
    }
  }
];

idaeApi.router.addRoutes(customRoutes);
```

### Middleware & Multi-Tenancy

The API server comes with a pre-configured middleware stack:
1. **Security**: Helmet, CORS, Rate Limiting.
2. **Body Parsing**: JSON and URL-encoded with configurable limits.
3. **Authentication**: (Optional) JWT validation.
4. **Tenant Context**: Enforced via `tenantContextMiddleware`. Extracts tenant info from the token.
5. **Database Context**: Resolves the correct DB/Collection based on the URL path.

**Multi-Tenancy Note**: All protected routes require a valid tenant context, which is automatically injected into `req` by the middleware.

### Error Handling & Logging

Errors are managed centrally. 
- Use the exported `HttpError` class to throw standard errors with status codes.
- All 500 errors are logged via `pino` (structured logging).
- The server automatically responds with formatted JSON error objects.

```typescript
import { HttpError } from '@medyll/idae-api/errors';

// Inside a handler
if (!user) {
  throw new HttpError(404, "User not found");
}
```

---

# Client-Side Usage

This section covers the purely client-side library used to consume the API.

### Client Configuration

Configure the client singleton before usage.

```typescript
import { IdaeApiClientConfig, IdaeApiClient } from '@medyll/idae-api/client';

IdaeApiClientConfig.setOptions({
  host: 'localhost',
  port: 3000,
  method: 'http', // or 'https'
  defaultDb: 'idae_base',
  headers: { 'Authorization': 'Bearer ...' } // Global headers
});

const client = new IdaeApiClient();
```

### Usage Examples

#### Basic CRUD
```typescript
// Select collection
const users = client.db('app').collection('users');

// Create
const newUser = await users.create({ name: "Alice", age: 30 });

// Find One (MongoDB-like syntax)
const user = await users.findOne({ 
    _id: newUser._id 
});

// Update
await users.update(user._id, { 
    $set: { age: 31 } 
});

// Delete
await users.deleteById(user._id);
```

#### Advanced Querying
```typescript
// Find with complex filters
const results = await users.find({
  age: { $gt: 18 },
  roles: { $in: ["admin", "editor"] }
});

console.log(results);
```

### Method Reference

The client exposes `IdaeApiClientCollection` with these core methods:

*   **`findAll(params?)`**: Retrieve all documents (paginated).
*   **`findById(id)`**: Get by unique ID.
*   **`findOne(filter)`**: Get first match.
*   **`find(filter, options?)`**: Search with full criteria.
*   **`create(data)`**: Create a new resource.
*   **`update(id, data)`**: Update existing resource.
*   **`deleteById(id)`**: Remove by ID.
*   **`deleteManyByQuery(filter)`**: Bulk delete.
*   **`registerEvents(hooks)`**: Add `pre`, `post`, or `error` hooks to local operations.

### Query Syntax (MongoDB-like)

We support standard MongoDB query operators across all supported database types:
*   **Comparison**: `$eq`, `$gt`, `$gte`, `$in`, `$lt`, `$lte`, `$ne`, `$nin`
*   **Logical**: `$or`, `$and`, `$not`, `$nor`
*   **Element**: `$exists`, `$type`
*   **Evaluation**: `$regex`
*   **Update**: `$set`, `$unset`, `$inc`, `$push`, `$pull`

---

## Troubleshooting

Common issues and solutions:

- **"Database connection not established" (Server)**:
  - Check if the route includes `/:collectionName`. The DB middleware attaches only when a collection context matches request params.
- **"Token invalid" (Client/Server)**:
  - Verify `jwtSecret` matches on both (or the token provider).
  - Check `tokenExpiration` settings.
- **Empty Query Results**:
  - Ensure you are querying the correct `db` and `collection`.
  - Check if tenant isolation is hiding data (if multi-tenancy is active).
- **CORS Errors**:
  - Update `cors` options in `idaeApi.setOptions()`.

See full documentation in `src/lib/server/middleware/README.md` for advanced middleware configuration.

---

## Architecture

```mermaid
flowchart TD
  subgraph ClientSide [APP / Client]
    ClientInstance[IdaeApiClient]
  end

  subgraph ServerSide [API Server]
    API[IdaeApi (Express)]
    Auth[Auth Middleware]
    Tenant[Tenant Context]
    DB_MW[DB Middleware]
    
    API --> Auth --> Tenant --> DB_MW
  end

  subgraph DataLayer [Data Persistence]
    IdaeDB[IdaeDB Adapter]
    DBs[(MongoDB / MySQL / PG / SQLite / PouchDB / ChromaDB)]
    
    DB_MW --> IdaeDB
    IdaeDB --> DBs
  end

  ClientInstance -- HTTP/JSON --> API
```

---

## License

This project is licensed under the MIT License.
