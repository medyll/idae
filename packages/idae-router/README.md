# idae-router

A lightweight, framework-agnostic SPA router (factory `createRouter`) with path params, query parsing, lifecycle hooks, DOM rendering into an outlet, link interception, automatic HTTP data-fetching, a built-in SWR cache engine, TypeScript generics, and support for actions that return cleanup functions.

## Complex Example

This example demonstrates routes that return HTML, DOM nodes, perform async effects, return cleanup functions, and use lifecycle hooks and programmatic navigation.

```ts
import { createRouter } from './src/lib';

const routes = [
	{ path: '/', action: () => '<h1>Home</h1><p>Welcome.</p>' },
	{
		path: '/about',
		action: () => {
			const frag = document.createDocumentFragment();
			const h = document.createElement('h1');
			h.textContent = 'About';
			frag.appendChild(h);
			return frag;
		}
	},
	{
		path: '/user/:id',
		action: async (ctx) => {
			// simulate async data load
			const data = await new Promise((res) =>
				setTimeout(() => res({ id: ctx.params.id, name: 'User ' + ctx.params.id }), 200)
			);
			const div = document.createElement('div');
			div.innerHTML = `<h1>User ${ctx.params.id}</h1><p>Name: ${(data as any).name}</p>`;
			// return a cleanup function to be called on leave
			const timer = setInterval(() => console.log('polling for user', ctx.params.id), 1000);
			return () => clearInterval(timer);
		}
	},
	{
		path: '/posts',
		action: (ctx) => {
			const el = document.createElement('div');
			el.innerHTML =
				'<h1>Posts</h1><ul><li><a href="/posts/1/comments">Post 1 comments</a></li></ul>';
			return el;
		}
	},
	{
		path: '/posts/:postId/comments',
		action: (ctx) => {
			// effect-only action (no render) — e.g., track analytics
			console.log('Viewing comments for', ctx.params.postId);
			return; // keep previous view
		}
	}
];

const router = createRouter({
	routes,
	outlet: '#app',
	mode: 'history',
	linkInterception: true,
	notFound: () => '<h1>404 — Not Found</h1>'
});

// before hook: block access to /posts if not authed
router.before((to, from, next) => {
	if (to.path.startsWith('/posts') && !window.localStorage.getItem('authed')) {
		// redirect to /login
		next('/login');
		return;
	}
	next();
});

router.after((to) => {
	console.log('navigated to', to.path);
});

router.onLeave((from) => {
	console.log('left', from.path);
});

// programmatic navigation examples
document.getElementById('go-user')?.addEventListener('click', () => router.push('/user/42'));
document.getElementById('refresh')?.addEventListener('click', () => router.refresh());
```

Behavior notes:

- `action` may return `string | Node | DocumentFragment` to render into the outlet.
- `action` may return `void` for effect-only actions (router keeps previous DOM view).
- `action` may return a function — this will be treated as a cleanup and invoked when navigating away.
- `before(to, from, next)` supports async flows via calling `next()`/`next(path)`/`next(false)`.

---

## HTTP data-fetching (`http` / `http_source`)

Declare an `http` (or `http_source`) property on any route. The router resolves URL param tokens (`:id` → value from `ctx.params`), fetches the endpoint, and passes the result as `ctx.data` to the action.

```ts
import { createRouter } from 'idae-router';

interface User { id: number; name: string; }

const routes = [
  {
    path: '/users/:id',
    http: { url: '/api/users/:id' },
    action: (ctx: Context<User>) => {
      if (ctx.isLoading) return '<p>Loading…</p>';
      if (ctx.queryError) return `<p>Error: ${ctx.queryError.message}</p>`;
      return `<h1>${ctx.data?.name}</h1>`;
    }
  }
];
```

`http_source` works identically but is used as a secondary / fallback data source.

**Context fields populated by the fetcher:**

| Field | Type | Description |
|---|---|---|
| `ctx.data` | `TData \| null` | Deserialized JSON response body |
| `ctx.isLoading` | `boolean` | `true` while the first fetch is in-flight |
| `ctx.isRevalidating` | `boolean` | `true` during background SWR revalidation |
| `ctx.queryError` | `Error \| undefined` | Set when the fetch fails or response is not ok |

---

## TypeScript generics

All core types accept a `TData` type parameter for full end-to-end type safety:

```ts
import type { Route, Context, Action, RouterOptions } from 'idae-router';

interface Post { id: number; title: string; }

// Fully typed — ctx.data is Post | null
const postAction: Action<Post> = (ctx) => `<h1>${ctx.data?.title}</h1>`;

const routes: Route<Post>[] = [
  {
    path: '/posts/:id',
    http: { url: '/api/posts/:id' },
    action: postAction
  }
];
```

Omitting `TData` defaults to `unknown`, preserving backward compatibility.

---

## SWR cache

Pass a `cache` option to `createRouter` to enable the built-in SWR engine. Responses are stored in memory and served synchronously on subsequent navigations. A background re-fetch runs when the entry is stale; the action is re-invoked only if the new data differs.

```ts
const router = createRouter({
  routes,
  outlet: '#app',
  cache: {
    ttl: 60_000,       // max age before eviction (ms, default 60 s)
    staleTime: 5_000   // serve from cache and revalidate in background (ms, default 0)
  }
});
```

Pass `cache: false` to disable caching entirely (fetches on every navigation).

**Hover prefetch:** when `cache` is enabled and `linkInterception: true`, hovering an `<a>` tag for 200 ms triggers a prefetch. Moving the pointer away before 200 ms cancels it.

---

## RouterInstance API

All methods returned by `createRouter`:

| Method | Signature | Description |
|---|---|---|
| `push` | `(path: string) => void` | Navigate and push a history entry |
| `replace` | `(path: string) => void` | Navigate without adding a history entry |
| `refresh` | `() => void` | Re-run the current route |
| `before` | `(guard) => void` | Register a before-navigation guard |
| `after` | `(hook) => void` | Register an after-navigation hook |
| `onLeave` | `(hook) => void` | Register an on-leave hook |
| `prefetch` | `(path: string) => Promise<void>` | Warm the cache for a path |
| `invalidate` | `(pattern?: string) => void` | Clear cache entries (all if no pattern, glob `*` suffix supported) |
| `buildUrl` | `(path: string, params?: Record<string, string>) => string` | Interpolate `:param` tokens |
| `getState` | `() => Context \| null` | Return the current navigation context |

```ts
// Prefetch on mount so the first user click is instant
router.prefetch('/dashboard');

// Invalidate a specific resource after a mutation
await fetch('/api/users/42', { method: 'PATCH', body: … });
router.invalidate('GET http://localhost/api/users/42');

// Build a typed URL
const url = router.buildUrl('/users/:id', { id: String(userId) });

// Read current state (e.g. for breadcrumbs)
const state = router.getState();
console.log(state?.path, state?.params);
```

---

## Usage

- Import `createRouter` from the package entry (`idae-router` once published, `src/lib` during development).
- Provide an `outlet` CSS selector or `HTMLElement` (default `#app`) where views are mounted.
- See the **RouterInstance API** table above for all available methods.

## Nested routes

This router supports nested route trees via a `children` array on a `Route` object. When a route and one of its descendants match the current pathname the router will:

- match the ancestor chain (parent → ... → leaf) and expose it as `Context.matched`, an array of `RouteRecord` objects in ancestor→leaf order. Each `RouteRecord` contains `{ route, params, path }` where `path` is the resolved full path for that record.
- merge params from the matched chain into `Context.params` (descendant params override parent keys when duplicated).
- mount parent actions first, then mount children into the parent's outlet element. A parent should provide a placeholder element for children using the `data-idae-outlet` attribute (e.g. `<div data-idae-outlet></div>`). If the placeholder is absent the router will fall back to mounting the child into the parent's mounted outlet.

Example:

```ts
const routes = [
	{
		path: '/parent/:id',
		action: (ctx) => `<div><h1>Parent ${ctx.params.id}</h1><div data-idae-outlet></div></div>`,
		children: [
			{ path: 'child', action: () => '<p>Child</p>' },
			{ path: 'other', action: () => '<p>Other</p>' }
		]
	}
];

// child paths are relative by default: 'child' -> '/parent/:id/child'
// if a child path starts with `/` it is treated as absolute and not joined to the parent prefix.
```

Notes:

- Parent actions can return cleanup functions; the router tracks cleanup per-level and invokes the appropriate cleanup when that level is left.
- The nested behavior is backward-compatible: a flat `routes: Route[]` still works exactly as before.
- `Context.matched` is useful for breadcrumbs, meta lookups, and for actions that need access to ancestor metadata.
