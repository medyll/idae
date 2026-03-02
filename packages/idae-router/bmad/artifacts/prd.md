# PRD – idae-router: Advanced Data-Fetching & Developer Experience

**Version:** 2.0.0  
**Date:** 2026-03-02  
**Status:** Draft  
**Author:** PM (BMAD)  
**Supersedes:** v1.0.0 (http / http_source baseline)

---

## Overview

Add two declarative data-fetching options to the `Route` definition: `http` for same-origin (internal) fetch calls, and `http_source` for cross-origin (external) fetch calls. Both options resolve before the route `action` executes and inject the fetched payload into `ctx.data`. This removes the need to write manual `fetch()` boilerplate inside every `action`.

---

## Goals & Success Metrics

| Goal | Metric | Target |
|---|---|---|
| Reduce route boilerplate | Lines of code per data-fetching route | −40% vs current |
| Zero breaking changes | Existing routes with only `action` still work | 100% |
| Dev ergonomics | URL interpolation supports `:param` tokens | All dynamic segments |
| Error safety | Failed fetch does not crash navigation | Error exposed in `ctx.error` |

---

## User Personas

### Persona 1 – App Developer
- Role: Consumer of the `idae-router` package.
- Needs: Fetch data per route without boilerplate; distinguish internal API calls from third-party sources.
- Pain point: Must write `fetch` + `await` + error-catching inside every `action`.

---

## Use Cases

### UC-01 – Fetch internal API data on navigation
**Actor:** App Developer  
**Trigger:** User navigates to `/users/:id`  
**Flow:**
1. Router matches route.
2. `http.url` is resolved: `:id` token replaced with the matched param, origin prepended.
3. `fetch` is called natively; result parsed as JSON.
4. Result injected as `ctx.data`.
5. `action(ctx)` receives the data and renders it.  
**Expected outcome:** Rendered page shows data from `/api/users/42` without manual fetch in `action`.  
**Edge cases:** 404 / network error → `ctx.error` set, `ctx.data` is `null`.

### UC-02 – Fetch external third-party source
**Actor:** App Developer  
**Trigger:** Route with `http_source` matches  
**Flow:**
1. Router matches route.
2. `http_source.url` is resolved: `:param` tokens replaced, `https://` prepended.
3. Fetch is executed; result parsed as JSON.
4. `ctx.data` populated.
5. `action(ctx)` renders.  
**Expected outcome:** Data from `https://api.example.com/items` available in `ctx.data`.  
**Edge cases:** CORS errors surface in `ctx.error`; HTTPS forced (no HTTP downgrade).

### UC-03 – Route with neither `action` nor `http`/`http_source`
**Actor:** Developer  
**Trigger:** Route omits all rendering options  
**Flow:** Router continues to existing `notFound` fallback.  
**Expected outcome:** No change from current behaviour.

### UC-04 – `http` + `action` coexistence
**Actor:** App Developer  
**Trigger:** Route defines both `http` and `action`  
**Flow:** `http` fetch runs first; result in `ctx.data`; `action` executes with enriched context.  
**Expected outcome:** `action` can use `ctx.data` without doing its own fetch.

---

## Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-01 | `Route` type accepts optional `http` property | Must | See type spec below |
| FR-02 | `Route` type accepts optional `http_source` property | Must | See type spec below |
| FR-03 | `http.url` — path-only string; router prepends `window.location.origin` | Must | e.g., `/api/users/:id` |
| FR-04 | `http_source.url` — host+path string without scheme; router prepends `https://` | Must | e.g., `api.example.com/users/:id` |
| FR-05 | Both `url` values support `:param` token interpolation from `ctx.params` | Must | Resolved before fetch |
| FR-06 | Fetched JSON result stored in `ctx.data` | Must | `unknown` type |
| FR-07 | Fetch errors stored in `ctx.error`, `ctx.data` set to `null` | Must | Does not abort navigation |
| FR-08 | Both options accept optional `args` aligning with `RequestInit` (headers, method, body, etc.) | Should | Typed as `RequestInit` |
| FR-09 | If `action` is absent and `http`/`http_source` present, auto-render JSON as `<pre>` fallback | Could | DX aid |
| FR-10 | `http` and `http_source` are mutually exclusive per route | Should | Warn in console if both present, `http` wins |
| FR-11 | Only one of `http` / `http_source` executes per route level; child routes can have their own | Must | Standard nested resolution |

---

## Type Specification

```typescript
/**
 * Configuration for a route-level HTTP data-fetch.
 */
export interface RouteHttpConfig {
  /**
   * URL path for `http` (no scheme, no origin): e.g. `/api/users/:id`
   * URL host+path for `http_source` (no scheme): e.g. `api.example.com/users/:id`
   * `:param` tokens are interpolated from matched route params before fetching.
   */
  url: string;

  /** Optional native fetch options (method, headers, body, signal, etc.) */
  args?: RequestInit;
}

export interface Route {
  path: string;
  action?: Action;
  metadata?: Record<string, unknown>;
  children?: Route[];

  /**
   * Internal (same-origin) fetch.
   * `window.location.origin` is prepended automatically.
   */
  http?: RouteHttpConfig;

  /**
   * External (cross-origin) fetch.
   * `https://` is prepended automatically.
   */
  http_source?: RouteHttpConfig;
}
```

**`Context` additions:**

```typescript
export interface Context {
  // ... existing fields ...
  /** Populated by `http` or `http_source` before `action` executes. */
  data?: unknown;
  /** Populated if the fetch failed; navigation continues regardless. */
  error?: Error;
}
```

---

## Non-Functional Requirements

| Category | Requirement | Acceptance Criteria |
|---|---|---|
| Performance | Fetch runs before `action`; no double-fetch per route level | Single `fetch()` call per matched route with `http`/`http_source` |
| Security | `http_source` forces `https://`; no plain `http://` on external calls | Unit test asserts URL scheme |
| Security | `http` pins to `window.location.origin`; cannot be used for cross-origin | Unit test asserts final URL origin |
| Bundle size | No new runtime dependency | Implemented via native `fetch` only |
| Compatibility | Works in all environments where native `fetch` is available | No polyfill provided; consumers add their own if needed |

---

## API Usage Examples

```typescript
const routes = [
  {
    path: '/parent/:id',
    // fetch from internal API before rendering
    http: {
      url: '/api/items/:id',
      args: { headers: { 'Accept': 'application/json' } }
    },
    action: (ctx) => `<div><h1>Item ${ctx.params.id}</h1><pre>${JSON.stringify(ctx.data, null, 2)}</pre><div data-idae-outlet></div></div>`,
    children: [
      {
        path: 'reviews',
        // fetch from external source for child route
        http_source: {
          url: 'reviews.api.example.com/items/:id'
        },
        action: (ctx) => `<ul>${ctx.data.map(r => `<li>${r.text}</li>`).join('')}</ul>`
      }
    ]
  }
];
```

---

## Demo Page

**File:** `static/demo.html` — complete, no-build demo. Load after `npm run dev` or `npm run preview`.

The page covers every feature including the new `http`/`http_source` options via a **Sprint 03 shim** that emulates `fetchRouteData` in-browser. The shim is removed once Sprint 03 ships and the router natively supports `http`/`http_source`.

### Demo routes

| Path | Feature | Notes |
|---|---|---|
| `/` | Basic string render | Home with feature list |
| `/about` | DocumentFragment render | No innerHTML |
| `/user/:id` | Async action + cleanup | 80ms delay; timer cancelled on leave |
| `/fetch/user/:id` | **`http`** internal fetch | `window.location.origin + /api/users/:id`; mocked in demo |
| `/external/post/:id` | **`http_source`** external fetch | `https://jsonplaceholder.typicode.com/posts/:id` |
| `/parent/:id/child` | Nested routes 2 levels | `data-idae-outlet` |
| `/parent/:id/deep/child` | Nested routes 3 levels | Two outlets |
| `/posts` | Programmatic DOM render | `document.createElement` |
| `/nowhere` | 404 handler | `notFound` callback |

### Sprint 03 shim (in-demo) — key functions

```js
// interpolate :param tokens
interpolateParams(url, params)

// build full URL (origin-pinned for internal, https:// for external)
resolveUrl(config, type, params)

// execute fetch, return { data, error } — never throws
fetchRouteData(route, params)

// wrap route array so http/http_source trigger before action
shimRoutes(routes)
```

The mock internal API (`window.fetch` intercepted for `/api/users/*`) returns fixture data so the `http` demo works without a running backend.

---

## Out of Scope

- GraphQL / non-REST protocols.
- Request caching or deduplication (can be added in a future iteration).
- Streaming responses.
- Response schema validation.
- Retry logic (consumers can wrap via `args` + `signal`).
- `http` over plain `http://` for external sources (security boundary: HTTPS only for `http_source`).

---

## Implementation Notes (for Architect / Developer)

- The fetch logic should live in a new `src/lib/fetcher.ts` utility, called from `handleNavigation` in `router.ts` before the `action` call loop.
- `resolveUrl(config: RouteHttpConfig, type: 'internal' | 'external', ctx: Context): string` — interpolates params then prepends origin or `https://`.
- The `Context` type in `types.ts` needs `data?: unknown` and `error?: Error` fields.
- `buildContext` does not yet know about fetch results; the enrichment step happens in `handleNavigation` after matching, before mounting.

---

## Acceptance Criteria

- [ ] `Route.http` and `Route.http_source` types compile without error.
- [ ] Navigation to a route with `http` populates `ctx.data` from the internal endpoint.
- [ ] Navigation to a route with `http_source` populates `ctx.data` from the external endpoint.
- [ ] `:param` tokens in both `url` strings are replaced with actual matched params.
- [ ] A fetch error sets `ctx.error` and does NOT abort navigation.
- [ ] `http_source` URL always starts with `https://` in the actual `fetch()` call.
- [ ] `http` URL always starts with `window.location.origin` in the actual `fetch()` call.
- [ ] Existing routes without `http`/`http_source` are unaffected.
- [ ] Unit tests cover: URL resolution, param interpolation, error path, `ctx.data` injection.
