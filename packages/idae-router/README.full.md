idae-router — Comprehensive README

Short description

idae-router is a lightweight, framework-agnostic client-side router designed for single-page applications. It supports: path parameters, query parsing, lifecycle hooks (before/after/onLeave), multiple return types from route actions (HTML string, DOM Node, DocumentFragment), cleanup functions, nested routes and outlets, automatic HTTP data fetching, an in-memory SWR cache engine, and full TypeScript generics and JSDoc for a type-safe public API.

Table of contents

1. Quick start
2. Key concepts (simple)
3. Basic usage example
4. HTTP data fetching (http / http_source)
5. TypeScript & generics
6. SWR cache and prefetching
7. RouterInstance API (reference)
8. Nested routes & outlets
9. Advanced patterns and best practices
10. Development, build and publishing (monorepo notes)
11. Testing and E2E
12. Contributing and code style
13. Troubleshooting & FAQ
14. License and maintainers

1. Quick start

Prerequisites
- Node.js (LTS recommended)
- pnpm (this repository uses pnpm workspaces in the monorepo)

Install
- At repo root: pnpm install
- In this package (for local dev): pnpm install (if working in isolation)

Run local development server (component preview)
- npm run dev

Run unit tests
- npm run test:unit

Build
- npm run build

Notes about release in this repository
- This package is part of a monorepo. Publishing to npm is performed by the monorepo CI pipeline. Do not publish locally unless you explicitly manage credentials and the CI process.

2. Key concepts (simple)

- Route action: a function that runs when a route is matched. It may return:
  - A string (HTML) to be set into the outlet.
  - A DOM Node or DocumentFragment to be inserted.
  - void (no visual update; used for side-effect-only routes).
  - A cleanup function to be called when the route is left.
- Context: the data the router passes to actions and hooks. It includes params, query, optional data (from http fetch), and flags like isLoading.
- Hooks: before (guard), after (notification), onLeave (cleanup notification).
- HTTP sources: declarative fetch config on the route (http / http_source). The router runs a fetcher and populates ctx.data, ctx.isLoading, ctx.queryError.
- SWR cache: a simple in-memory cache with TTL and background revalidation.

3. Basic usage example (from simple to a little more advanced)

Minimal example

```ts
import { createRouter } from 'idae-router';

const routes = [
  { path: '/', action: () => '<h1>Home</h1>' },
  { path: '/about', action: () => '<h1>About</h1>' }
];

const router = createRouter({ routes, outlet: '#app' });
```

Example with params, cleanup and programmatic navigation

```ts
const routes = [
  {
    path: '/user/:id',
    action: (ctx) => {
      const node = document.createElement('div');
      node.textContent = `User ${ctx.params.id}`;
      const timer = setInterval(() => {/* polling */}, 1000);
      return () => clearInterval(timer); // cleanup on leave
    }
  }
];

const router = createRouter({ routes, outlet: '#app', linkInterception: true });
router.push('/user/1');
```

4. HTTP data fetching (http / http_source)

Define an http property on a route to instruct the router to fetch data before invoking the action. The router interpolates `:param` tokens and attaches the response to `ctx.data`.

```ts
{
  path: '/users/:id',
  http: { url: '/api/users/:id' },
  action: (ctx) => {
    if (ctx.isLoading) return '<p>Loading…</p>';
    if (ctx.queryError) return `<p>Error: ${ctx.queryError.message}</p>`;
    return `<h1>${ctx.data?.name}</h1>`;
  }
}
```

Fetcher-provided context fields
- ctx.data: TData | null — deserialized response payload
- ctx.isLoading: boolean — true while the initial fetch is in-flight
- ctx.isRevalidating: boolean — true during background revalidation
- ctx.queryError: Error | undefined — set if fetch fails

Use `http_source` as a secondary or fallback data provider; it behaves the same as `http` but is consumed with lower priority.

5. TypeScript & generics (typed-by-design)

All public types accept a `TData` generic. This lets callers declare route-level payload types so `ctx.data` is strongly typed throughout the app.

```ts
import type { Action, Route } from 'idae-router';

interface Post { id: number; title: string; }

const postAction: Action<Post> = (ctx) => `<h1>${ctx.data?.title}</h1>`;
const routes: Route<Post>[] = [{ path: '/posts/:id', http: { url: '/api/posts/:id' }, action: postAction }];
```

When `TData` is omitted, types default to `unknown` to remain safe and backward-compatible.

6. SWR cache and prefetching

Enable caching by passing a `cache` option to `createRouter`. Options:
- ttl: number — how long entries live before eviction (ms)
- staleTime: number — serve from cache and revalidate in the background (ms)

Example

```ts
const router = createRouter({ routes, outlet: '#app', cache: { ttl: 60_000, staleTime: 5_000 } });
```

Prefetching behaviour
- When `linkInterception` and `cache` are enabled, hovering an <a> tag for a short debounce (by default 200 ms) triggers a prefetch request.
- Prefetch is cancelled if the pointer leaves before the debounce expires.

Cache control
- Use `router.prefetch(path)` to programmatically warm the cache.
- Use `router.invalidate(pattern?)` to evict entries. If no pattern is provided the whole cache is cleared. Patterns support simple glob-like suffixes (e.g., `/api/users/*`).

7. RouterInstance API (reference, brief)

Public API methods
- push(path: string): navigate and push
- replace(path: string): navigate without pushing
- refresh(): re-run current route (re-fetch if necessary)
- before(guard): register a before-navigation guard
- after(hook): register an after-navigation hook
- onLeave(hook): register a leave hook
- prefetch(path: string): Promise<void> — warm cache
- invalidate(pattern?: string): void — clear cache entries
- buildUrl(path, params): string — interpolate tokens
- getState(): Context | null — current navigation context

8. Nested routes & outlets

Nested route trees are supported via `children` on a `Route`. When mounting:
- The matched ancestor chain is exposed as `Context.matched` (parent→...→leaf).
- Parent actions are mounted first; child actions mount into the parent's `data-idae-outlet` placeholder if present.
- Params from the ancestor chain are merged into `Context.params`.

Example of a parent with a child outlet

```ts
{
  path: '/blog/:blogId',
  action: (ctx) => `<section><h1>Blog ${ctx.params.blogId}</h1><div data-idae-outlet></div></section>`,
  children: [{ path: 'post/:postId', action: (ctx) => `<article>Post ${ctx.params.postId}</article>` }]
}
```

9. Advanced patterns and best practices (didactic)

- Keep actions idempotent and side-effects minimal: prefer fetching data via http/http_source and letting the router manage loading states.
- Use cleanup functions when registering timers or global subscriptions in an action to avoid leaks.
- Batch mutations: after a mutation call `router.invalidate(pattern)` to ensure the cache is coherent.
- Use `before` guards for auth checks; prefer redirecting (`next('/login')`) over blocking UI updates.
- For complex UIs prefer returning DOM nodes/DocumentFragments rather than raw HTML strings to avoid innerHTML pitfalls and to enable safe cleanup.
- When integrating with frameworks (Svelte components), mount framework-managed DOM into an outlet and let the router drive high-level navigation.

Performance considerations
- The built-in cache is in-memory — suitable for single-tab apps and demoing patterns. For multi-tab or persisted cache consider integrating a separate storage layer.
- Keep `ttl` and `staleTime` conservative for data that changes frequently.

10. Development, build and publishing (monorepo notes)

Relevant scripts (package-level)
- npm run dev — start vite dev server for preview
- npm run prepare — run svelte-kit sync (used to refresh package svelte entry)
- npm run prepackage — runs node scripts/package-pre.js (generates packaging index files)
- npm run build — bundle via vite and run prepack
- npm run prepack — svelte-kit sync && svelte-package && publint
- npm run test:unit — run unit tests (Vitest)
- npm test — run unit tests and e2e as configured
- npm run test:e2e — Playwright E2E (built preview on port 4173)
- npm run lint — run eslint
- npm run format — run prettier

Packaging rules
- package.json declares `svelte: ./dist/index.js` and `types: ./dist/index.d.ts`. Ensure svelte-package produces these files.
- `files` should include `dist/` only; do not include test files in published package.
- Keep `type: "module"` in package.json — outputs must be ESM.
- Do not bundle `svelte` — declare it as a peer dependency (v5+).

Publishing
- In this monorepo, publishing is handled by CI. The recommended flow for local checks before a CI publish is:
  1. pnpm install
  2. npm run format
  3. npm run lint
  4. npm run test:unit
  5. npm run build
  6. Optionally run npm run preview and e2e tests

11. Testing and E2E

- Unit tests: Vitest project configured in vite.config.ts. Unit test globs: `src/**/*.{test,spec}.{js,ts}`.
- Component tests are separated from server tests; Svelte component tests are excluded from the server project and handled in a separate vitest project setting.
- E2E: Playwright runs a built preview at port 4173 and runs tests in `e2e/`.

12. Contributing and code style

- Run `npm run format` and `npm run lint` before opening a pull request.
- Add unit tests for new features and regression tests for bug fixes.
- Add JSDoc comments to public exports; the repo expects full JSDoc coverage on public API.
- Follow the monorepo conventions: add public exports to `src/lib/index.ts` and run `npm run prepare` + `npm run prepackage` prior to build.

13. Troubleshooting & FAQ

Q: The build fails on `svelte-package` or `publint`.
A: Ensure `npm run prepack` runs locally: `npm run prepare && npm run prepackage`. Check publint output for missing exports or invalid package metadata.

Q: Unit tests pass locally but E2E fails in CI.
A: Recreate the CI preview locally: `npm run build && npm run preview` and run the playwright suite against `http://localhost:4173`.

Q: Where is the public API surface?
A: `src/lib/index.ts` is the canonical public surface. After build `dist/index.js` / `dist/index.d.ts` are the published outputs.

14. License & maintainers

This package follows the monorepo license (see repository root `LICENSE` file). For maintainers and contacts, see repository owner metadata.

Appendix: Quick reference snippets

- Prefetch programmatically: `await router.prefetch('/dashboard')`
- Invalidate cache: `router.invalidate('/api/users/42')`
- Build url: `router.buildUrl('/users/:id', { id: String(userId) })`

End of README
