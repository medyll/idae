# Middleware Documentation

This document describes all middleware available in the `@medyll/idae-api` package, their purpose, usage, and integration order.

## Overview

Middleware in this project is located in `src/lib/server/middleware/`. Each middleware serves a specific purpose (validation, authentication, multi-tenancy, docs, health, etc.) and is applied in a specific order in the Express app lifecycle.

## List of Middleware

- **authMiddleware**: Handles JWT authentication and attaches user context to requests.
- **authorizationMiddleware**: Enforces RBAC/ABAC policies per route.
- **databaseMiddleware**: Injects `req.idaeDb` and manages per-request DB/collection context.
- **tenantContextMiddleware**: Extracts tenant context from JWT/user and enforces multi-tenancy.
- **validationMiddleware**: Validates request bodies/queries using Zod schemas.
- **validationLayer**: (Advanced) Layered validation, supports Zod and future OpenAPI/ajv.
- **docsMiddleware**: Serves Swagger UI and Redoc API docs.
- **openApiMiddleware**: Serves OpenAPI JSON spec.
- **healthMiddleware**: Provides health and readiness endpoints.
- **mcpMiddleware**: Placeholder for MCP-specific logic (future extension).

## Middleware Application Order

The recommended order (see `IdaeApi.ts`):
1. Express body/URL parsers
2. `authMiddleware` (if enabled)
3. `tenantContextMiddleware` (if multi-tenancy enabled)
4. `databaseMiddleware`
5. `validationMiddleware`/`validationLayer`
6. Custom routes
7. `docsMiddleware`, `openApiMiddleware`, `healthMiddleware`
8. Error handler

## Usage Example

```
import { authMiddleware, tenantContextMiddleware, databaseMiddleware } from './middleware';
app.use(authMiddleware(...));
app.use(tenantContextMiddleware(...));
app.use(databaseMiddleware);
```

## Notes
- Always apply `authMiddleware` before `databaseMiddleware` if using per-user DB context.
- `tenantContextMiddleware` is required for strict multi-tenancy.
- See each middleware file for detailed JSDoc and options.
