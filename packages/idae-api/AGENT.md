## MCP Integration

### Enabling MCP
- Set `enableMcp: true` in `idaeApi.setOptions({ ... })` to activate MCP endpoints and logic.
- When disabled, all MCP logic and routes are skipped.

### Best Practices
- Mount MCP endpoints after core middleware, before custom routes.
- All MCP endpoints should require tenant context and RBAC/ABAC by default.
- Keep MCP logic in the API/server layer—do not pollute DB adapters or core business logic.


### Example: Enabling and Registering MCP
```ts
idaeApi.setOptions({
	enableMcp: true,
	// ...other options
});

// Mount after core middleware, before custom routes
if (idaeApi.idaeApiOptions.enableMcp) {
	const { mcpMiddleware } = require('./server/middleware/mcpMiddleware.js');
	idaeApi.app.use('/mcp', mcpMiddleware());
}
```

### Extending MCP Middleware
- Add logic to `src/lib/server/middleware/mcpMiddleware.ts`.
- Use `tenantContextMiddleware` and `authorizationMiddleware` for all MCP routes.

### Troubleshooting MCP
- 403: Check tenant context and RBAC config.
- 404: Ensure `enableMcp` is true and MCP routes are registered.
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


## Advanced Features (2026)

- **OpenAPI auto-generation & docs**: `/openapi.json` serves the OpenAPI spec (YAML-to-JSON). `/docs` (Swagger UI) and `/redoc` (Redoc) provide interactive API docs. Keep `src/lib/openApi/openapi-base.yaml` up to date for contract-first workflows.
- **RBAC/ABAC**: Per-route authorization via `authorization` property in route definitions. Enforced by JWT roles/scopes (see `authorizationMiddleware`). Example:
	```ts
	{
		method: 'post',
		path: '/admin/task',
		handler: ..., 
		requiresAuth: true,
		authorization: { roles: ['admin'], scopes: ['write:task'] }
	}
	```
- **Strict multi-tenancy**: All requests require a tenant context (from JWT, e.g. `tenantId` claim). Middleware injects `req.tenantId` and enforces tenant isolation. DB adapters can use `setTenantFilter(tenantId)` for partitioning.
- **Security/validation**: CORS, helmet, rate limiting, payload limits, Zod validation, and DB guardrails are enabled by default. Health endpoints at `/health` and `/ready`.

## Extending
- New DB: implement `IdaeDbAdapter` in `src/lib/adapters` (server side) and wire in options.
- New routes: add to router or provide a `routes` array in `setOptions`.

## MCP note
- If exposing MCP capabilities, mount them here (Express layer). Keep `idae-db` pure (no server).

## Troubleshooting quick checklist
- MCP: 403/401 — check tenant context, RBAC config, and that enableMcp is true. 404 — ensure MCP routes are mounted after core middleware.
- 401/403: check `enableAuth`, JWT secret, and tenant context.
- 403: check RBAC/ABAC route config and user claims.
- 500 on DB: ensure `IdaeDb` initialized with correct `DbType` and URI.
- CORS: configure Express middleware before `idaeApi.start()`.
