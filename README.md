# Idae Monorepo

A concise, progressive README: start simple, then add more detail. Use the sections below as your guide from quick setup to advanced development.

## 1. Quick summary (very short)
- Purpose: unified data + UI toolkit for full-stack apps.
- Core pieces: `idae-api`, `idae-db`, `idae-idbql`, `idae-query`, `idae-socket`, UI libs.

## 2. Quick start (commands)
- Install dependencies:

```bash
pnpm install
```

- Build all packages:

```bash
pnpm run package
```

- Run API package tests (example):

```bash
pnpm --filter idae-api test
```

## 3. Basic usage (dev flow)
- Create a client and call a collection (example):

```ts
import { IdaeApiClient, IdaeApiClientConfig } from '@medyll/idae-api';
IdaeApiClientConfig.setOptions({ host: 'localhost', port: 3000, method: 'http', defaultDb: 'app' });
const client = new IdaeApiClient();
const users = client.collection('users');
await users.find({ query: { active: true } });
```

## 4. API surface (methods mapping)
- Common client collection methods (align with `idae-db` interface):
  - `find(params)` — query records
  - `findById(id)` — read single by id
  - `create(body)` — insert
  - `update(id, body)` — update by id
  - `deleteById(id)` — remove by id
  - `updateWhere(params, update)` — update by filter (client may issue multiple requests)
  - `deleteWhere(params)` — delete by filter (client may issue multiple requests)

## 5. Advanced topics (architectural notes)
- Sync: `idae-socket` relays backend changes to frontends.
- Local first: `idae-idbql` provides a Mongo-like local query layer backed by IndexedDB and `idae-query` for in-memory operations.
- Adapters: `idae-db` defines adapters (Mongo, MySQL, SQLite, etc.) and a common adapter interface.

## 6. Development & tests
- Run package tests selectively to speed iterations. Examples:

```bash
pnpm --filter idae-api test:unit
pnpm --filter idae-idbql test:unit
```

- Type checks / lint / format:

```bash
pnpm run lint
pnpm run format
pnpm run check
```

## 7. Contributing (short)
- Follow repo coding style (Prettier + ESLint). Use `pnpm --filter <pkg> run build` for package-level builds.
- Add tests for new behavior. Run `pnpm run check` before pushing.

## 8. Where to look next (files)
- API server: `packages/idae-api/src`
- DB adapters: `packages/idae-db/src`
- IndexedDB + local queries: `packages/idae-idbql/src`
- Query engine: `packages/idae-query/src`

---

If you want a longer README section (examples, diagrams, or reference tables), tell me which parts to expand and I will add them in order of complexity.
