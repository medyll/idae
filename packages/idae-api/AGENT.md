# AGENT Guide — @medyll/idae-api

This file is for automation agents (Copilot/CI) to operate `idae-api` safely.

## What this package is
- REST API framework on Express 5.
- Uses `@medyll/idae-db` for DB abstraction (MongoDB, MySQL via Sequelize).
- Provides a TypeScript client (IdaeApiClient) mirroring server routes.
- MongoDB-like query syntax end-to-end.

## Key entry points (src/lib)
- server/IdaeApi.ts: main server class (setOptions, start, router).
- server/middleware/databaseMiddleware.ts: wires `IdaeDb` per request.
- server/services/AuthService.ts: JWT auth helper.
- config/routeDefinitions.ts: default CRUD route factory.
- client/*: IdaeApiClient, IdaeApiClientCollection, IdaeApiClientConfig, request helpers.
- @types/types.ts: shared types (DbType, etc.).

## Server usage (minimal)
```ts
import { idaeApi } from '@medyll/idae-api';
idaeApi.setOptions({ port: 3000, enableAuth: true, jwtSecret: 'secret' });
idaeApi.start();
```
- Custom routes: `idaeApi.router.addRoutes([...])` (method, path, handler, requiresAuth?).
- DB adapters: provided by `@medyll/idae-db` (Mongo/MySQL). Extend via `IdaeDbAdapter` if needed.

## Client usage (minimal)
```ts
import { IdaeApiClient, IdaeApiClientConfig } from '@medyll/idae-api';
IdaeApiClientConfig.setOptions({ host: 'localhost', port: 3000 });
const client = new IdaeApiClient();
const users = await client.db('app').collection('user').findAll();
```
- Same MongoDB-like filters as server.

## Authentication
- Optional JWT middleware (see AuthService, authMiddleware).
- Configure with `enableAuth`, `jwtSecret`, `tokenExpiration` in `setOptions`.

## Error handling
- Central error middleware; can customize via `configureErrorHandling` in IdaeApi.

## Testing
- Unit/e2e via Vitest/Jest + supertest. Use `npm run test`.
- `mongodb-memory-server` and `mysql2` available for integration tests.

## Build & dev
- `npm run dev` (vite dev)
- `npm run build && npm run package`
- `npm run check` (svelte-check), `npm run lint`, `npm run format`

## Do / Don’t
- Do keep route additions in `config/routeDefinitions.ts` or via router API.
- Do inject DB via `databaseMiddleware` instead of manual connections.
- Do reuse shared types from `@types/`.
- Don’t hardcode DB URIs in code; pass via options/env.
- Don’t bypass auth middleware when `enableAuth` is true.

## Extending
- New DB: implement `IdaeDbAdapter` in `src/lib/adapters` (server side) and wire in options.
- New routes: add to router or provide a `routes` array in `setOptions`.

## MCP note
- If exposing MCP capabilities, mount them here (Express layer). Keep `idae-db` pure (no server).

## Troubleshooting quick checklist
- 401/403: check `enableAuth` and JWT secret.
- 500 on DB: ensure `IdaeDb` initialized with correct `DbType` and URI.
- CORS: configure Express middleware before `idaeApi.start()`.
