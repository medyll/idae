# PRD – idae-router: Advanced Data-Fetching & Developer Experience

**Version:** 2.0.0  
**Date:** 2026-03-02  
**Status:** Draft  
**Author:** PM (BMAD)  
**Supersedes:** v1.0.0 (http / http_source baseline)

---

## Overview

Extend `idae-router` from a baseline fetch integration (v1.0.0) into a full **data-aware router** with:

1. **`http` / `http_source`** — route-level declarative data-fetching (v1.0.0, carried forward)
2. **Total type-safety** — end-to-end TypeScript inference from route definition to `ctx.data`, zero code generation, full JSDoc coverage
3. **Async state management** — `loading` / `error` / `data` state lifecycle per route, background revalidation
4. **Intelligent cache** — stale-while-revalidate, TTL, per-route override, global on/off switch
5. **Typed search params** — validated, serialized `ctx.query` via built-in schema, no external dependency
6. **Strict programmatic navigation API** — typed redirects, transitions, route-aware `push`/`replace` with JSDoc

---

## Goals & Success Metrics

| Goal | Metric | Target |
|---|---|---|
| Remove fetch boilerplate | Lines per data-fetching route | −40% vs current |
| Zero breaking changes | Routes with only `action` unaffected | 100% |
| Full IntelliSense | `ctx.data` typed per route without codegen | ✅ via generics |
| Eliminate redundant requests | Cache hit ratio on same-path back/forward | ≥ 80% |
| No external dependencies | New runtime packages added | 0 |
| Strict type coverage | `tsc --strict --noEmit` on consuming project | 0 errors |
| Performance | Re-renders on unchanged data | 0 (memoised comparison) |

---

## User Personas

### Persona 1 – App Developer (Consumer)
- Needs: Data on navigation, typed, cached, no boilerplate.
- Pain points: `fetch` in every action; `any` typed results; no cache; repeated requests on back/forward.

### Persona 2 – Library Maintainer
- Needs: Zero runtime deps; clean generic API; tree-shakeable cache.
- Pain points: External SWR/TanStack locks consumers into React; code-gen breaks monorepo setups.

---

## Use Cases

### UC-01 – Typed internal fetch
**Trigger:** `/users/:id` navigated  
**Flow:** Router infers `TData = User` from route def → `ctx.data` is `User`, not `unknown`.  
**Outcome:** Full autocompletion on `ctx.data.email` in `action`.

### UC-02 – External HTTPS fetch
**Trigger:** Route with `http_source` matched  
**Flow:** `https://` enforced; `ctx.data` typed if generic provided.  
**Outcome:** Real cross-origin fetch via native browser `fetch`, HTTPS pinned.

### UC-03 – Stale-while-revalidate
**Trigger:** User navigates back to already-visited route  
**Flow:** Cache returns stale data instantly → action renders immediately → background revalidation updates cache → action re-runs silently only if data changed.  
**Outcome:** Zero perceived latency; eventual consistency.

### UC-04 – Per-route cache disable
**Trigger:** Route marked `cache: false`  
**Flow:** Cache bypassed for this route; fresh fetch on every navigation.  
**Outcome:** Always-fresh data for real-time routes (e.g., dashboard counters).

### UC-05 – Typed search params
**Trigger:** `/search?q=foo&page=2` navigated  
**Flow:** Route declares `searchParams` schema → `ctx.query.page` is `number`, `ctx.query.q` is `string`.  
**Outcome:** No manual `Number(ctx.query.page)` cast; schema validation rejects bad values.

### UC-06 – Prefetch on hover
**Trigger:** User hovers over `<a href="/users/42">`  
**Flow:** Router detects `pointerenter` on intercepted link → fires `http`/`http_source` fetch silently (200 ms debounce) → stores result in cache.  
**Outcome:** Navigation to `/users/42` renders instantly (cache hit).

### UC-07 – Typed programmatic navigation
**Trigger:** `router.push('/users/:id', { id: '42' })`  
**Flow:** TypeScript enforces param shape; JSDoc surfaces required args in IDE hover.  
**Outcome:** Runtime path mismatches eliminated at compile time.

### UC-08 – Global cache disable
**Trigger:** `createRouter({ cache: false })`  
**Flow:** Cache layer skipped globally; all fetches execute on every navigation.  
**Outcome:** SSR-compatible mode; test environments can disable cache without mocking.

---

## Functional Requirements

### Feature Group A — HTTP Data-Fetching (v1.0.0, carried forward)

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-A01 | `Route` accepts optional `http` property | Must | Same-origin fetch |
| FR-A02 | `Route` accepts optional `http_source` property | Must | External HTTPS fetch |
| FR-A03 | `http.url` path-only; origin prepended automatically | Must | `/api/users/:id` |
| FR-A04 | `http_source.url` host+path without scheme; `https://` prepended | Must | `api.example.com/users/:id` |
| FR-A05 | `:param` token interpolation from `ctx.params` | Must | Resolved before fetch |
| FR-A06 | Fetched JSON stored in `ctx.data` | Must | Typed via generic |
| FR-A07 | Fetch errors in `ctx.error`; navigation continues | Must | Never throws |
| FR-A08 | `args?: RequestInit` on both options | Should | Headers, method, body |
| FR-A09 | `http` and `http_source` mutually exclusive per route | Should | `http` wins, `console.warn` |
| FR-A10 | Child routes have independent fetch per level | Must | |

---

### Feature Group B — Total Type-Safety + JSDoc

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-B01 | `Route<TData>` generic propagates to `ctx.data: TData \| null` in `action` | Must | No codegen required |
| FR-B02 | `RouteHttpConfig<TData>` preserves generic through fetch utilities | Must | |
| FR-B03 | `Context<TData>` replaces `data?: unknown` with `data: TData \| null` | Must | |
| FR-B04 | All public types exported with `@public` JSDoc tag | Must | |
| FR-B05 | All public functions have `@param`, `@returns`, `@example` JSDoc | Must | |
| FR-B06 | `router.push` JSDoc-documented with `@param`, `@example`, `@since` | Must | |
| FR-B07 | `RouteSearchParams<TSchema>` generic for typed query | Should | |
| FR-B08 | JSDoc `@since`, `@see`, `@throws` on all throws-capable functions | Must | |

**Target type contract:**

```typescript
/**
 * Configuration for a route-level HTTP data-fetch.
 * @template TData The expected parsed JSON response type.
 * @public
 */
export interface RouteHttpConfig<TData = unknown> {
  /**
   * URL template.
   * - For `http`: path-only, e.g. `/api/users/:id`
   * - For `http_source`: host+path without scheme, e.g. `api.example.com/users/:id`
   * `:param` tokens are replaced with matched route params before fetching.
   */
  url: string;
  /** Native fetch options (method, headers, body, signal…) */
  args?: RequestInit;
}

/**
 * Route definition.
 * @template TData The type of data returned by `http` / `http_source`.
 * @public
 */
export interface Route<TData = unknown> {
  path: string;
  /** Render function. Receives a fully-typed Context. */
  action?: Action<TData>;
  /** Same-origin fetch. `window.location.origin` prepended automatically. */
  http?: RouteHttpConfig<TData>;
  /** External HTTPS fetch. `https://` prepended; plain HTTP rejected. */
  http_source?: RouteHttpConfig<TData>;
  /** Cache settings for this route. `false` disables caching. */
  cache?: CacheOptions | false;
  /** Schema for typed, validated query params. */
  searchParams?: SearchParamsSchema;
  metadata?: Record<string, unknown>;
  children?: Route[];
}

/**
 * Navigation context injected into every route action.
 * @template TData Type of data fetched by `http` / `http_source`.
 * @public
 */
export interface Context<TData = unknown> {
  path: string;
  params: Record<string, string>;
  /** Typed if `searchParams` schema is present on the route; raw strings otherwise. */
  query: Record<string, unknown>;
  state?: unknown;
  metadata?: Record<string, unknown>;
  matched?: RouteRecord[];
  /** Populated by `http` / `http_source` before `action` runs. `null` on fetch error. */
  data: TData | null;
  /** Set when the route-level fetch fails. Navigation continues regardless. */
  error?: Error;
  /** `true` during initial fetch (before first render). */
  isLoading?: boolean;
  /** `true` during background SWR revalidation (after stale render). */
  isRevalidating?: boolean;
  /** Set when `searchParams` schema validation fails. Raw query still available. */
  queryError?: Error;
}

export type Action<TData = unknown> = (ctx: Context<TData>) => ActionResult;
```

---

### Feature Group C — Async State Management

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-C01 | `ctx.isLoading` is `true` between route match and initial fetch resolution | Must | |
| FR-C02 | `ctx.isRevalidating` is `true` during background SWR revalidation | Must | |
| FR-C03 | Background revalidation does not block navigation render | Must | Render with stale data; revalidate async |
| FR-C04 | On revalidation complete, re-invoke `action` only if data changed (deep-equal) | Should | Avoids unnecessary re-renders; equivalent to `useMemo` semantics |
| FR-C05 | `router.after` hook receives updated context with `isRevalidating` flag | Should | |
| FR-C06 | Prior fetch error cleared on successful refetch | Must | |
| FR-C07 | `action` cleanup called before re-render on revalidation (consistent lifecycle) | Must | |

---

### Feature Group D — Intelligent Cache

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-D01 | Default strategy: stale-while-revalidate (SWR) | Must |
| FR-D02 | Global disable: `createRouter({ cache: false })` | Must | Default: `true` |
| FR-D03 | Per-route disable: `{ cache: false }` on route | Must | Overrides global |
| FR-D04 | Per-route TTL: `{ cache: { ttl: 30_000 } }` (ms) | Should | Default: `60_000` |
| FR-D05 | Cache key: `method + resolved URL` (interpolated params included) | Must | |
| FR-D06 | Programmatic invalidation: `router.invalidate(pattern)` — exact path or glob | Should | |
| FR-D07 | `staleTime`: `{ cache: { staleTime: 5_000 } }` — serve from cache within window, revalidate after | Should | SWR pattern |
| FR-D08 | Cache storage: in-memory `Map`; no `localStorage` by default | Must | No cross-reload persistence |
| FR-D09 | Cache entry: `{ data, timestamp, url, status }` | Must | |
| FR-D10 | Cache module tree-shakeable when globally disabled | Should | |
| FR-D11 | Function-level result memoisation: repeated calls with identical params skip re-execution | Should | Equivalent to `useCallback` / memoized selector |
| FR-D12 | Deep-equal comparison prevents `action` re-invocation on identical revalidated data | Should | Equivalent to `useMemo` |

**CacheOptions type:**

```typescript
/**
 * Cache configuration for a route or globally.
 * @public
 */
export interface CacheOptions {
  /**
   * Max age in ms before a cache entry is considered stale.
   * After TTL expires the entry is removed and a fresh fetch is triggered.
   * @default 60_000
   */
  ttl?: number;
  /**
   * Window in ms during which stale data is served without triggering revalidation.
   * Set to `0` to always revalidate in the background.
   * @default 0
   */
  staleTime?: number;
  /**
   * Custom cache key. Use when the resolved URL is not a sufficient discriminator.
   * @example 'user-profile-v2'
   */
  key?: string;
}
```

---

### Feature Group E — Typed Search Params

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-E01 | `Route.searchParams` accepts a field → descriptor schema object | Must | Zero external deps |
| FR-E02 | Descriptors support: `string`, `number`, `boolean`, `string[]`, `number[]` | Must | |
| FR-E03 | Descriptors support `default` value and `required` flag | Should | |
| FR-E04 | On navigation, raw query string coerced + validated against schema | Must | |
| FR-E05 | Validation failure: `ctx.queryError` set; `ctx.query` falls back to raw strings | Should | Graceful degradation |
| FR-E06 | `ctx.query` TypeScript type narrowed to schema shape | Should | via `Context<TData, TQuery>` |
| FR-E07 | `router.buildUrl(path, params, query)` serialises typed query object to URL string | Should | |
| FR-E08 | No `zod`, `valibot`, or any external validator | Must | Internal micro-validator only |

**Schema example:**

```typescript
const routes = [{
  path: '/search',
  searchParams: {
    q:    { type: 'string',  required: true },
    page: { type: 'number',  default: 1 },
    sort: { type: 'string',  default: 'asc' },
    tags: { type: 'string[]' }
  },
  action: (ctx) => {
    // ctx.query.page is number, ctx.query.q is string — no manual casting
    return `<p>Results for \"${ctx.query.q}\" — page ${ctx.query.page}</p>`;
  }
}];
```

---

### Feature Group F — Strict Programmatic Navigation API + JSDoc

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-F01 | `router.push(path, state?)` — fully JSDoc-documented | Must | |
| FR-F02 | `router.replace(path, state?)` — fully JSDoc-documented | Must | |
| FR-F03 | `router.redirect(to)` — sugar for `replace` with guard semantics | Should | |
| FR-F04 | `router.prefetch(path)` — fires fetch without navigating; stores in cache | Should | |
| FR-F05 | `router.invalidate(pattern)` — invalidate cache by glob | Should | |
| FR-F06 | `router.buildUrl(path, params?, query?)` — type-safe URL builder | Should | |
| FR-F07 | `router.getState()` — returns current `Context` snapshot | Should | |
| FR-F08 | All `RouterInstance` methods have `@param`, `@returns`, `@example`, `@since` | Must | |
| FR-F09 | `pointerenter` on intercepted links fires `prefetch()` with 200 ms debounce | Should | |
| FR-F10 | `router.onError` documented with `@example` | Must | Exists since v0.1.0 |

**RouterInstance additions (JSDoc contract excerpt):**

```typescript
interface RouterInstance {
  /**
   * Navigate to a new path, pushing a new history entry.
   * @param path - Target path (e.g. `/users/42`).
   * @param state - Optional History API state payload.
   * @example router.push('/users/42', { from: 'list' });
   * @since 0.1.0
   */
  push(path: string, state?: unknown): void;

  /**
   * Prefetch route data for a path without navigating.
   * Result is stored in cache and consumed on the next navigation to that path.
   * @param path - Path to prefetch (e.g. `/users/42`).
   * @returns Promise that resolves when the prefetch is complete.
   * @example
   * anchorEl.addEventListener('pointerenter', () => router.prefetch('/users/42'));
   * @since 0.2.0
   */
  prefetch(path: string): Promise<void>;

  /**
   * Invalidate cached fetch results matching a path or glob pattern.
   * @param pattern - Exact path or glob (e.g. `/users/*`).
   * @example router.invalidate('/users/*'); // clear all user detail pages
   * @since 0.2.0
   */
  invalidate(pattern: string): void;

  /**
   * Build a URL string from a path template, params, and query object.
   * Query values are serialised automatically (arrays → repeated keys).
   * @param path - Path template (e.g. `/users/:id`).
   * @param params - Param values (e.g. `{ id: '42' }`).
   * @param query - Query values (e.g. `{ tab: 'posts', page: 2 }`).
   * @returns Full URL string (e.g. `/users/42?tab=posts&page=2`).
   * @example const url = router.buildUrl('/users/:id', { id: '42' }, { tab: 'posts' });
   * @since 0.2.0
   */
  buildUrl(path: string, params?: Record<string, string>, query?: Record<string, unknown>): string;
}

---

## Non-Functional Requirements

| Category | Requirement | Acceptance Criteria |
|---|---|---|
| Performance | Cache hit returns data synchronously | `action` receives `ctx.data` without await on cache hit |
| Performance | Prefetch on hover eliminates perceived fetch latency | E2E: click after hover = 0 ms perceived delay |
| Performance | Deep-equal prevents redundant `action` re-invocations | Unit test: same data → action not re-called |
| Security | `http` pins to `window.location.origin` | Unit test asserts URL origin |
| Security | `http_source` forces `https://` | Unit test asserts URL scheme |
| Bundle size | Cache module tree-shakeable when disabled | Build output size diff |
| Zero deps | No new runtime package in `dependencies` | `package.json` diff |
| TypeScript | All new generics compile under `strict: true` | `tsc --strict --noEmit` |

---

## New File Map (implementation guide)

| File | Role |
|---|---|
| `src/lib/fetcher.ts` | URL resolution, fetch execution, `fetchRouteData()` |
| `src/lib/cache.ts` | In-memory SWR cache, `CacheStore`, `CacheEntry`, TTL + staleTime logic |
| `src/lib/search-params.ts` | Schema-based query parser, coercion, validation, `buildUrl()` |
| `src/lib/memo.ts` | Function-level result memoisation (`memoize`, deep-equal check) |
| `src/lib/types.ts` | All new generics + JSDoc, replaces existing `Context`/`Route` |
| `src/lib/router.ts` | Integrates fetcher, cache, prefetch on `pointerenter` |
| `src/lib/index.ts` | Exports: `RouteHttpConfig`, `CacheOptions`, `SearchParamsSchema`, additions |

---

## Demo Page

**File:** `static/demo.html` — self-contained in-browser demo with Sprint 03 shim.

### Demo routes map

| Path | Feature |
|---|---|
| `/` | Home — feature list |
| `/about` | DocumentFragment render |
| `/user/:id` | Async action + cleanup timer |
| `/fetch/user/:id` | `http` → origin-pinned, mocked `/api/users/:id` |
| `/external/post/:id` | `http_source` → `https://jsonplaceholder.typicode.com/posts/:id` |
| `/parent/:id/child` | 2-level nested outlet |
| `/parent/:id/deep/child` | 3-level nested outlet |
| `/posts` | Programmatic DOM render |
| `/nowhere` | 404 notFound handler |

---

## Out of Scope

- GraphQL / non-REST protocols.
- `localStorage` / `IndexedDB` cache persistence.
- Streaming responses.
- Schema validation beyond built-in primitive coercion.
- Retry logic (consumers use `args.signal` + their own wrapper).
- SSR hydration protocol.
- React / Svelte component binding (vanilla JS only).

---

## Acceptance Criteria (full suite)

### Type-safety
- [ ] `Route<User>` with `http` → `ctx.data` inside `action` is `User | null`, not `unknown`
- [ ] `tsc --strict --noEmit` on a consumer project using all new types: 0 errors
- [ ] All exported symbols have JSDoc visible on IDE hover

### Async state
- [ ] `ctx.isLoading` is `true` during initial fetch, `false` after
- [ ] `ctx.isRevalidating` is `true` during SWR background refetch
- [ ] Re-render skipped when revalidated data deep-equals cached data

### Cache
- [ ] Cache hit: `ctx.data` populated synchronously on same-path back-navigation
- [ ] `createRouter({ cache: false })` — every navigation fetches fresh; no cache reads/writes
- [ ] Route `{ cache: false }` — only that route bypasses cache; others unaffected
- [ ] `{ cache: { ttl: 5000 } }` — entry expires after 5 s; next navigation refetches
- [ ] `router.invalidate('/users/*')` — clears all `/users/` cache entries
- [ ] No cache entry created for routes without `http`/`http_source`

### Search params
- [ ] `{ type: 'number', default: 1 }` — `?page=3` → `ctx.query.page === 3` (number)
- [ ] Missing required param → `ctx.queryError` set; `ctx.query` has raw string
- [ ] `router.buildUrl('/search', {}, { q: 'foo', page: 2 })` returns `/search?q=foo&page=2`
- [ ] `node_modules` contains no `zod` / `valibot` at build time

### Programmatic navigation
- [ ] `router.prefetch('/users/42')` → subsequent `router.push('/users/42')` hits cache
- [ ] Hover on `<a href="/users/42">` triggers prefetch after 200 ms debounce
- [ ] `router.invalidate('/users/42')` clears entry; next navigation refetches
- [ ] All `RouterInstance` methods have JSDoc visible in IDE hover
