# @medyll/idae-api Development Guide for AI Agents

## Project Overview

**@medyll/idae-api** is a modular Node.js/TypeScript API framework that abstracts multiple database types (MongoDB, MySQL via Sequelize) through a unified interface. It features:
- Express-based server with dynamic routing and middleware
- TypeScript client for API consumption
- Multi-database connection management via `@medyll/idae-db` adapter pattern
- Built with SvelteKit (package library structure) and published as ESM module

## Architecture & Key Components

### Three-Layer Design

1. **Server Layer** (`src/lib/server/`)
   - `IdaeApi.ts`: Singleton that manages Express app lifecycle, initialization, and configuration
   - Exposes routes, auth, and database middleware through a unified entry point
   - Routes are defined in `src/lib/config/routeDefinitions.ts` and managed by `RouteManager`

2. **Engine Layer** (`src/lib/server/engine/`)
   - `routeManager.ts`: Manages route registration, enable/disable logic
   - `mongooseConnectionManager.ts`: Manages Mongoose connections per database
   - `requestDatabaseManager.ts`: Extracts db/collection info from request parameters
   - These engines are composed into Express middleware

3. **Client Layer** (`src/lib/client/`)
   - `IdaeApiClient.ts`: Main entry point for client initialization
   - `IdaeApiClientCollection.ts`: Collection-level operations (CRUD, queries)
   - `IdaeApiClientRequest.ts`: HTTP request handling with auth token support
   - Mirrors server routes: `.db(name).collection(name)` → underlying HTTP calls

### Critical Data Flow

1. **Request Reception**: Express receives request → `idaeDbMiddleware` injects `req.idaeDb` (initialized `IdaeDb` instance)
2. **Route Handling**: `routeManager` resolves handler → calls handler with service adapter
3. **Database Operation**: Handler calls `req.idaeDb.collection(name)` methods (inherited from `@medyll/idae-db`)
4. **Response**: Handler result returned as JSON response via Express

## Development Workflows

### Build & Package
```bash
npm run build        # Vite build + svelte-kit sync + svelte-package (outputs to dist/)
npm run package:pre  # Pre-build validation script
npm run package      # Publint check before npm publish
```

### Development & Testing
```bash
npm run dev          # Vite dev server
npm run test         # Vitest (looks for *.test.ts, *.spec.ts in src/)
npm run check        # TypeScript check + Svelte validation
npm run lint         # ESLint + Prettier check
npm run format       # Auto-format code
```

Key: Tests use Vitest, not Node's test runner. Svelte static analysis (`svelte-check`) validates exports.

### Debugging Notes
- TypeScript target: **ES2020**
- Module format: **ESNext** (tree-shakeable for bundlers)
- Output: `dist/index.d.ts`, `dist/index.js` (dual export with svelte/default)

## Project Conventions & Patterns

### Singleton Pattern (Critical)
- `IdaeApi`, `RouteManager`, `MongooseConnectionManager`: All use private constructors + static `getInstance()`
- Reason: Ensures single Express app instance, one route registry per process
- When modifying: Never instantiate directly; always use `.getInstance()`

### Route Definition Shape
```typescript
{
  method: string | string[],        // 'get', 'post', ['get', 'post']
  path: string,                     // '/:collectionName' or '/:collectionName/:id'
  handler: async (service, params, body, query) => any,
  disabled?: boolean,               // Used by RouteManager for enable/disable
  requiresAuth?: boolean            // Checked by AuthMiddleware
}
```
- `service` is an `IdaeDbAdapter<object>` (from @medyll/idae-db)
- Routes inherit CRUD methods: `.find()`, `.findById()`, `.create()`, `.update()`, `.deleteById()`

### Middleware Chain Order (in IdaeApi.configureIdaeApi)
1. Express body/URL parsers
2. Auth middleware (if enabled)
3. Database middleware (injects `req.idaeDb`)
4. Custom routes
5. 404/error handlers

**Important**: Database middleware depends on auth context (if tokens are used). Don't reorder.

### Query String Parsing
- Custom parser in `IdaeApi.constructor()` uses `qs` library with:
  - `parseArrays: true`, `depth: 10`, `parameterLimit: 1000`
  - Handles complex nested query filters (MongoDB-style `$in`, `$gt` operators)

### Request Augmentation (Express.Request Extension)
In [src/app.d.ts](src/app.d.ts) (SvelteKit global namespace):
```typescript
declare global {
  namespace Express {
    interface Request {
      idaeDb: IdaeDb;
      dbName: string;
      collectionName: string;
      connectedCollection: IdaeDbAdapter<any>;
    }
  }
}
```
Routes access these injected properties without explicit typing.

## Understanding the IdaeDb Adapter Pattern

**@medyll/idae-db** abstracts database operations behind a unified interface (`IdaeDbAdapter<T>`). This enables swapping database implementations without changing application logic.

### How the Adapter Works

1. **Initialization**: `IdaeDb.init(dbUri, idaeDbOptions)` creates an adapter instance
   - `dbUri`: Connection string (e.g., `mongodb://localhost/mydb`)
   - `idaeDbOptions`: Config object specifying `dbType` (MONGODB, MYSQL, etc.)

2. **Collection Access**: `req.idaeDb.collection<T>(collectionName)` returns an `IdaeDbAdapter<T>`
   - All CRUD methods are type-safe generics: `.find<UserType>()`, etc.

3. **Query Syntax**: MongoDB-like operators work across all adapters
   ```typescript
   // Works for both MongoDB and MySQL thanks to adapter abstraction
   adapter.find({ email: { $in: ['a@x.com', 'b@x.com'] }, age: { $gt: 25 } })
   adapter.update(id, { $set: { status: 'active' } })
   ```

4. **Middleware Integration** (`databaseMiddleware.ts`):
   ```typescript
   const { dbName, collectionName, dbUri } = requestDatabaseManager.fromReq(req);
   req.idaeDb = IdaeDb.init(dbUri, options);  // Per-request instance
   req.connectedCollection = req.idaeDb.collection(collectionName);
   ```
   Each request gets a fresh `IdaeDb` instance with proper collection binding.

### IdaeDbAdapter Interface (from @medyll/idae-db)
```typescript
interface IdaeDbAdapter<T> {
  find(filter?: any): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  deleteById(id: string): Promise<void>;
  deleteWhere(filter: any): Promise<number>;  // Returns count deleted
  findAll(): Promise<T[]>;
  // ... plus advanced methods for hooks, transactions, etc.
}
```

**Key insight**: Route handlers receive `service: IdaeDbAdapter<object>` as first parameter. Never assume it's a Mongoose model—use adapter methods for portability.

## Key Dependencies & Integration Points

- **@medyll/idae-db** (v0.106+): Abstract database adapter; provides `IdaeDb` class and `IdaeDbAdapter` interface
  - Supports MongoDB (Mongoose), MySQL (Sequelize), extensible for others
  - All query/update ops use MongoDB-like syntax (`$in`, `$set`, `$gt`)
  - Initialized per-request in `databaseMiddleware` with `IdaeDb.init()`
  
- **Express 5.1+**: Web framework; uses streaming responses, advanced middleware
  
- **Mongoose 8.15+**: MongoDB driver; managed via `MongooseConnectionManager` for connection pooling
  
- **JWT (jsonwebtoken 9.x)**: Token generation/verification in `AuthMiddleWare` (not a separate service)

## Common Implementation Tasks

### Adding a Custom Route

1. Define in `src/lib/config/routeDefinitions.ts` following the `RouteDefinition` interface:
```typescript
{
  method: 'post',
  path: '/custom/batch-update',
  handler: async (service, params, body, query) => {
    // service is IdaeDbAdapter<object>
    const results = await Promise.all(
      body.items.map(item => service.update(item.id, item.data))
    );
    return { updated: results.length };
  },
  requiresAuth: true
}
```

2. Add to route manager at startup:
```typescript
// In IdaeApi.setOptions():
idaeApi.setOptions({
  routes: [customRoute]
});
```

3. Route automatically available at: `POST /custom/batch-update` (requires Bearer token if `requiresAuth: true`)

### Common Route Pattern Examples

**Search with filters**:
```typescript
{
  method: 'get',
  path: '/search/:collectionName',
  handler: async (service, params, body, query) => {
    // query object contains parsed filters from URL
    // Example: ?email[]=a@x.com&email[]=b@x.com&age[$gt]=25
    const filters = query.filters || {};
    return service.find(filters);
  }
}
```

**Batch operations**:
```typescript
{
  method: 'post',
  path: '/bulk/:collectionName',
  handler: async (service, params, body) => {
    const { operations } = body;  // Array of {action, data, id}
    return Promise.all(
      operations.map(op => {
        if (op.action === 'create') return service.create(op.data);
        if (op.action === 'update') return service.update(op.id, op.data);
        if (op.action === 'delete') return service.deleteById(op.id);
      })
    );
  }
}
```

**Custom aggregation**:
```typescript
{
  method: 'post',
  path: '/stats/:collectionName',
  handler: async (service, params, body) => {
    const all = await service.findAll();
    return {
      total: all.length,
      avgAge: all.reduce((sum, u) => sum + u.age, 0) / all.length
    };
  }
}
```

### Enabling Authentication

1. Set options at startup:
```typescript
idaeApi.setOptions({
  enableAuth: true,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiration: '7d'
});
```

2. Mark routes requiring auth:
```typescript
{ method: 'delete', path: '/:collectionName/:id', requiresAuth: true }
```

3. Client sends token:
```typescript
IdaeApiClientConfig.setOptions({ 
  host: 'localhost',
  port: 3000,
  token: 'eyJhbGc...'  // Bearer token from login endpoint
});
```

4. Auth middleware automatically validates `Authorization: Bearer <token>` header

### Adding Database Adapter Support

- Implement `IdaeDbAdapter` interface from `@medyll/idae-db`
- Pass config to `idaeApi.setOptions()`:
```typescript
idaeApi.setOptions({
  idaeDbOptions: {
    dbType: DbType.MYSQL,  // or custom type
    // ... other adapter options
  }
});
```
- Adapter is instantiated per-request in `databaseMiddleware`, no code changes needed in routes

## Client-Server Request/Response Cycle

### Complete Data Flow

1. **Client Initiates** (`IdaeApiClient` → `IdaeApiClientCollection` → `IdaeApiClientRequest`)
   ```typescript
   const collection = client.db('app').collection('user');
   const users = await collection.find({ age: { $gt: 25 } });
   ```

2. **Request Construction** (`IdaeApiClientRequest.doRequest()`)
   - Builds URL: `/user?age[$gt]=25` (with query string parsing via `qs`)
   - Adds `Authorization: Bearer <token>` header if configured
   - HTTP method inferred from operation (GET for `.find()`, POST for `.create()`)

3. **Server Receives** (Express routing)
   - Route pattern: `GET /:collectionName` matches `/user`
   - Extracts `collectionName='user'` from `req.params`

4. **Middleware Chain Executes**
   - **Auth Middleware** (if `requiresAuth: true`): Validates token, attaches user to `req.user`
   - **Database Middleware** (`idaeDbMiddleware`):
     - Calls `requestDatabaseManager.fromReq(req)` to extract `dbName`, `collectionName`, `dbUri`
     - Initializes: `req.idaeDb = IdaeDb.init(dbUri, options)`
     - Connects: `await req.idaeDb.db('app')`
     - Binds collection: `req.connectedCollection = req.idaeDb.collection('user')`
     - Parses complex query params: `req.query.params = JSON.parse(decodeURIComponent(...))`

5. **Route Handler Executes** (from `routeDefinitions.ts`)
   ```typescript
   handler: async (service, params, body, query) => {
     // service = req.connectedCollection (IdaeDbAdapter instance)
     // params = req.params (e.g., { collectionName: 'user' })
     // body = req.body (for POST/PUT)
     // query = req.query (URL params, pre-parsed by qs library)
     return service.find(query);  // Delegates to adapter
   }
   ```

6. **Adapter Executes** (from `@medyll/idae-db`)
   - MongoDB: Uses Mongoose query builder
   - MySQL: Converts MongoDB operators to Sequelize syntax
   - Returns `Promise<T[]>` or error

7. **Response Sent** (via Express)
   - Handler result automatically JSON-stringified
   - Status 200 (or error status if exception thrown)
   - Optional error handler wraps failures

8. **Client Receives**
   ```typescript
   // Response automatically deserialized to array
   // Type safety via TypeScript generics
   const users: User[] = await collection.find<User>({ age: { $gt: 25 } });
   ```

### Request Parameter Examples

**URL with filters**:
```
GET /user?age[$gt]=25&status=active&email[$in]=a@x.com&email[$in]=b@x.com
```
Parsed by `qs` library into:
```typescript
{
  age: { $gt: '25' },
  status: 'active',
  email: { $in: ['a@x.com', 'b@x.com'] }
}
```

**POST body with $set operator** (for updates):
```json
{
  "$set": {
    "status": "inactive",
    "lastLogin": "2026-01-11T10:00:00Z"
  }
}
```
Passed to: `adapter.update(id, { $set: { ... } })`

### Error Handling in Cycle

- **Client-side**: Network errors, parsing errors → logged to console
- **Auth failure**: Middleware returns 401 Unauthorized (no `Authorization` header or invalid token)
- **Database failure**: Adapter throws error → caught by Express error handler → 500 response
- **Route handler crash**: Exception caught → error handler → 500 response

## Troubleshooting Common Issues

### "req.idaeDb is undefined" or "req.connectedCollection is undefined"

**Cause**: Route registered before database middleware, or path doesn't match middleware pattern.

**Solution**:
- Middleware only applies to `/:collectionName` pattern (see `IdaeApi.configureMiddleware()`)
- Custom route without collection in path won't have `req.idaeDb`
- Workaround: Manually call `IdaeDb.init()` in handler for non-standard routes

```typescript
// This route won't have req.idaeDb injected
{ method: 'get', path: '/stats', handler: async () => { ... } }

// Refactor to either:
// 1. Use collection-based path
{ method: 'get', path: '/stats/:collectionName', handler: async (service) => { ... } }

// 2. Manually initialize in handler
{ method: 'get', path: '/stats', handler: async () => {
  const db = IdaeDb.init('mongodb://localhost/mydb', options);
  // ... use db.collection() directly
} }
```

### "Invalid token" on protected routes

**Cause**: Missing or malformed `Authorization` header, or token expired.

**Solution**:
- Client must set token: `IdaeApiClientConfig.setOptions({ token: 'eyJ...' })`
- Token must be in format: `Authorization: Bearer <token>`
- Check `jwtSecret` matches between auth generation and verification
- Token expiration time may have passed; implement refresh via `AuthMiddleWare.refreshToken()`

### MongoDB connection timeouts or "getaddrinfo ENOTFOUND localhost"

**Cause**: Database URI invalid or MongoDB not running.

**Solution**:
- Check `requestDatabaseManager.config`: host, port, connection string format
- Ensure MongoDB daemon running: `mongod` (or check Docker container)
- Verify env vars: `MONGODB_DEFAULT_HOST`, `MONGODB_DEFAULT_PORT`, `MONGODB_DEFAULT_CONNECTION_PREFIX`
- Test URI directly: `mongo <uri>` or check logs for connection errors

### Query results empty when expecting data

**Cause**: Wrong collection name, wrong database, or filter too restrictive.

**Solution**:
```typescript
// Debug: Check what collection/db is being targeted
console.log(`Collection: ${req.collectionName}, DB: ${req.dbName}`);

// Check actual documents exist
const all = await service.findAll();
console.log(`Total docs in ${req.collectionName}: ${all.length}`);

// Validate filter syntax (MongoDB operators)
// ✓ Correct: { age: { $gt: 25 } }
// ✗ Wrong: { age: { gt: 25 } }
```

### Route handler not being called or 404 errors

**Cause**: Route path not registered, or method mismatch (POST vs GET).

**Solution**:
- Verify route in `defaultRoutes` (from `routeDefinitions.ts`) or passed via `setOptions()`
- Check HTTP method: `GET /user` is different from `POST /user`
- Ensure path pattern uses Express syntax: `/:collectionName` not `/{collectionName}`
- For array of methods: `method: ['get', 'post']` registers both

```typescript
// This won't match GET requests
{ method: 'post', path: '/user', handler: async () => { ... } }

// Correct for both
{ method: ['get', 'post'], path: '/user', handler: async () => { ... } }
```

### Type mismatches between client and server

**Cause**: Server returns different shape than client expects, or async/await issues.

**Solution**:
- Server handler return value is automatically JSON-stringified; ensure serializable (no functions, circular refs)
- Client uses generics for type safety: `collection.find<UserType>()`
- If server returns `{ data: [...], count: 10 }`, client must unpack it
- Test with curl/Postman first: `curl http://localhost:3000/user`

### Auth middleware not protecting all routes

**Cause**: Route defined without `requiresAuth: true`, or auth middleware not initialized.

**Solution**:
- Mark each protected route: `requiresAuth: true`
- Ensure `enableAuth: true` and `jwtSecret`/`tokenExpiration` set in `IdaeApi.setOptions()`
- Auth routes (`/login`, `/logout`, `/refresh-token`) are auto-registered by `AuthMiddleWare.configureAuthRoutes()`

```typescript
// Protected
{ method: 'delete', path: '/:collectionName/:id', requiresAuth: true, handler: async (service, { id }) => {
  return service.deleteById(id);
} }

// Unprotected (be careful with this!)
{ method: 'get', path: '/:collectionName', requiresAuth: false, handler: async (service) => {
  return service.findAll();
} }
```

## File Organization Notes

- **Exports**: All public APIs exported from [src/lib/index.ts](src/lib/index.ts); no deep imports in consumers
- **Types**: Centralized in `src/lib/@types/types.ts` and `src/lib/server/engine/types.ts`
- **Middleware**: Located in `src/lib/server/middleware/` for easy discovery and testing
- **Tests**: Colocated with source (e.g., `apiServer.test.ts` alongside implementation)

## When Modifying Code

- **Route handlers**: Always check if `requiresAuth` applies and if database is connected
- **Middleware**: Consider the chain order; adding before `idaeDbMiddleware` won't have `req.idaeDb`
- **Client methods**: Ensure corresponding server routes exist; test both sides
- **TypeScript**: Strict mode enabled (`strict: true`); no implicit `any`
- **Testing**: Run `npm test` before commit; tests use `.test.ts` or `.spec.ts` suffix

## References

- [README.md](README.md): API usage examples and configuration
- [@medyll/idae-db docs](https://www.npmjs.com/package/@medyll/idae-db): Adapter pattern and query syntax
- [TypeScript config](tsconfig.json): ES2020 + strict mode
