/**
 * The return value of a route `action` callback.
 * Can be a string of HTML, a DOM node, a DocumentFragment, a cleanup function, or void —
 * either synchronously or wrapped in a Promise.
 *
 * @public
 * @since 0.1.0
 */
export type ActionResult =
	| string
	| Node
	| DocumentFragment
	| void
	| (() => void)
	| Promise<string | Node | DocumentFragment | void | (() => void)>;

/**
 * Cache control options for a route or the router.
 * Configures stale-while-revalidate behaviour for route-level HTTP data fetches.
 *
 * @public
 * @since 0.2.0
 * @example
 * ```ts
 * const router = createRouter({
 *   cache: { ttl: 30_000, staleTime: 5_000 }
 * });
 * ```
 */
export interface CacheOptions {
	/**
	 * Time-to-live in milliseconds. Cached data older than `ttl` is treated as stale.
	 * @default 60_000
	 */
	ttl?: number;
	/**
	 * Grace period in milliseconds. Stale data within `staleTime` is served immediately
	 * while a background revalidation is triggered.
	 * @default 0
	 */
	staleTime?: number;
	/**
	 * Optional cache key override. Defaults to the resolved fetch URL.
	 * Useful when multiple routes share the same data source.
	 */
	key?: string;
}

/**
 * Navigation context passed to every `action` callback.
 * Fully typed when `TData` is specified on the parent `Route<TData>`.
 *
 * @public
 * @typeParam TData - The shape of the data resolved by the route-level HTTP fetch.
 *   Defaults to `unknown` when the route has no generic annotation.
 * @since 0.1.0
 * @example
 * ```ts
 * const route: Route<User> = {
 *   path: '/users/:id',
 *   http: { url: '/api/users/:id' },
 *   action: (ctx: Context<User>) => {
 *     // ctx.data is User | null
 *     return ctx.data?.name ?? 'Loading…';
 *   }
 * };
 * ```
 */
export interface Context<TData = unknown> {
	/** The resolved pathname (no origin, no query string). */
	path: string;
	/** Dynamic route parameters extracted from the path pattern. */
	params: Record<string, string>;
	/** Parsed query-string values. Multi-value keys are represented as `string[]`. */
	query: Record<string, string | string[]>;
	/** Optional state payload passed via `push()` or `replace()`. */
	state?: unknown;
	/** Route-level metadata declared on the matched `Route`. */
	metadata?: Record<string, unknown>;
	/** The full stack of matched route records (parent→child). */
	matched?: RouteRecord[];
	/**
	 * Data resolved by the route-level `http` or `http_source` fetch.
	 * `null` when the fetch failed or when no HTTP config is present.
	 */
	data: TData | null;
	/** Set when the route-level fetch fails. Navigation continues regardless. */
	error?: Error;
	/** `true` while the initial fetch for this navigation is in flight. */
	isLoading?: boolean;
	/** `true` while a background revalidation fetch is in flight (SWR). */
	isRevalidating?: boolean;
	/** Error from the most recent revalidation attempt, if any. */
	queryError?: Error;
}

/**
 * A route action callback. Receives the navigation context and returns renderable content
 * or a cleanup function (or a Promise thereof).
 *
 * @public
 * @typeParam TData - Narrows `ctx.data` to `TData | null`.
 * @param ctx - The fully-resolved navigation context for this route.
 * @returns Renderable content, a cleanup function, or void.
 * @since 0.1.0
 * @example
 * ```ts
 * const action: Action<User> = (ctx) => {
 *   const el = document.createElement('p');
 *   el.textContent = ctx.data?.name ?? 'Unknown';
 *   return el;
 * };
 * ```
 */
export type Action<TData = unknown> = (ctx: Context<TData>) => ActionResult;

/**
 * Configuration for a route-level HTTP data-fetch.
 *
 * - For `http`: provide a path-only URL (e.g. `/api/users/:id`).
 *   `window.location.origin` is prepended automatically.
 * - For `http_source`: provide host+path without scheme (e.g. `api.example.com/users/:id`).
 *   `https://` is prepended automatically.
 *
 * `:param` tokens are interpolated from matched route params before fetching.
 *
 * @public
 * @typeParam TData - The expected shape of the JSON response body.
 *   Used to narrow `Context.data` on the consuming `Route<TData>`.
 * @since 0.1.0
 * @example
 * ```ts
 * const cfg: RouteHttpConfig<User> = { url: '/api/users/:id' };
 * ```
 */
export interface RouteHttpConfig<TData = unknown> {
	/** URL template. Path-only for `http`; host+path (no scheme) for `http_source`. */
	url: string;
	/** Native fetch options (method, headers, body, signal…) */
	args?: RequestInit;
	/** @internal Phantom type marker — not a runtime field. */
	readonly _responseType?: TData;
}

/**
 * A single route definition. Generic over `TData` so that `ctx.data` inside its
 * `action` is typed as `TData | null` instead of `unknown`.
 *
 * @public
 * @typeParam TData - The shape of data resolved by this route's HTTP fetch config.
 *   Defaults to `unknown`; existing route definitions compile unchanged.
 * @since 0.1.0
 * @example
 * ```ts
 * interface User { id: number; name: string }
 *
 * const route: Route<User> = {
 *   path: '/users/:id',
 *   http: { url: '/api/users/:id' },
 *   action: (ctx) => `<h1>${ctx.data?.name}</h1>`
 * };
 * ```
 */
export interface Route<TData = unknown> {
	/** Path pattern, supporting `:param` tokens and optional trailing `?`. */
	path: string;
	/**
	 * Render function. Receives a fully-typed `Context<TData>` with `data` and `error`.
	 * @see Action
	 */
	action?: Action<TData>;
	/** Arbitrary key/value metadata attached to this route (e.g. page title, auth guards). */
	metadata?: Record<string, unknown>;
	/** Nested child routes. Resolved relative to this route's `path`. */
	children?: Route[];
	/** Same-origin fetch configuration. `window.location.origin` is prepended automatically. */
	http?: RouteHttpConfig<TData>;
	/** External HTTPS fetch configuration. `https://` is prepended; plain HTTP is rejected. */
	http_source?: RouteHttpConfig<TData>;
}

/**
 * A matched route record produced by the router's matching algorithm.
 * Holds the original `Route`, the extracted param values, and the resolved full path.
 *
 * @public
 * @since 0.1.0
 */
export interface RouteRecord {
	/** The matched route definition. */
	route: Route;
	/** Dynamic parameter values extracted from the URL. */
	params: Record<string, string>;
	/** Resolved full path for this record (parent segments prepended). */
	path: string;
}

/**
 * Signature of the `next` function passed to `BeforeHook`.
 * Call with no args (or `undefined`) to allow navigation; pass `false` to abort;
 * pass a string path to redirect.
 *
 * @public
 * @since 0.1.0
 */
export type BeforeNext = (nextArg?: false | string | void) => void;

/**
 * Navigation guard invoked *before* a route transition completes.
 * Call `next()` to proceed, `next(false)` to abort, or `next('/other')` to redirect.
 *
 * @public
 * @param to - The incoming navigation context.
 * @param from - The previous navigation context, or `null` on first load.
 * @param next - Must be called to resolve the guard.
 * @since 0.1.0
 */
export type BeforeHook = (
	to: Context,
	from: Context | null,
	next: BeforeNext
) => void | Promise<void>;

/**
 * Hook invoked *after* a route transition completes (after `action` runs).
 *
 * @public
 * @param to - The resolved navigation context.
 * @param from - The previous navigation context, or `null` on first load.
 * @since 0.1.0
 */
export type AfterHook = (to: Context, from: Context | null) => void | Promise<void>;

/**
 * Hook invoked when the user navigates *away* from the current route.
 *
 * @public
 * @param from - The navigation context being left.
 * @since 0.1.0
 */
export type OnLeaveHook = (from: Context) => void | Promise<void>;

/**
 * Options passed to `createRouter()`.
 *
 * @public
 * @since 0.1.0
 * @example
 * ```ts
 * const router = createRouter({
 *   mode: 'history',
 *   outlet: '#app',
 *   routes: [{ path: '/', action: () => '<h1>Home</h1>' }]
 * });
 * ```
 */
export interface RouterOptions {
	/**
	 * Routing mode.
	 * - `'history'` (default): uses the HTML5 History API (`pushState`).
	 * - `'hash'`: uses `location.hash` (useful for static file hosts).
	 */
	mode?: 'history' | 'hash';
	/** Base path prefix stripped from all route patterns (e.g. `'/app'`). */
	base?: string;
	/** CSS selector string or DOM Element where matched route content is rendered. */
	outlet?: string | Element;
	/** Route definitions to match against. */
	routes?: Route[];
	/** When `true`, clicks on `<a>` tags with same-origin `href` are intercepted. Default: `true`. */
	linkInterception?: boolean;
	/** Invoked when no route matches the current path. */
	notFound?: Action;
	/**
	 * Global cache settings for route-level HTTP data fetches.
	 * Pass `false` to disable caching entirely.
	 * Individual routes can override per-route via `Route.cache` (Sprint 04 S04-04).
	 */
	cache?: CacheOptions | false;
}

/**
 * The router instance returned by `createRouter()`.
 * Provides imperative navigation helpers and lifecycle hook registration.
 *
 * @public
 * @since 0.1.0
 * @example
 * ```ts
 * const router = createRouter({ routes });
 * router.push('/users/42');
 * router.before((to, from, next) => {
 *   if (!isAuthenticated()) next('/login');
 *   else next();
 * });
 * ```
 */
export interface RouterInstance {
	/**
	 * Push a new entry onto the history stack and navigate to `path`.
	 * @param path - Target path (absolute, e.g. `'/users/42'`).
	 * @param state - Optional state payload attached to the history entry.
	 */
	push(path: string, state?: unknown): void;
	/**
	 * Replace the current history entry and navigate to `path`.
	 * @param path - Target path.
	 * @param state - Optional state payload.
	 */
	replace(path: string, state?: unknown): void;
	/** Re-run the current route (re-fetch + re-render). */
	refresh(): void;
	/**
	 * Low-level navigation primitive used by `push` and `replace`.
	 * @param path - Target path.
	 * @param state - Optional state payload.
	 * @param replace - When `true`, replaces the current history entry instead of pushing.
	 */
	navigate(path: string, state?: unknown, replace?: boolean): void;
	/**
	 * Register a navigation guard (before hook).
	 * @param fn - Guard function. Must call `next()` to proceed.
	 */
	before(fn: BeforeHook): void;
	/**
	 * Register a post-navigation hook (after hook).
	 * @param fn - Hook function called after each route transition.
	 */
	after(fn: AfterHook): void;
	/**
	 * Register a hook invoked when leaving the current route.
	 * @param fn - Hook function called before the next route renders.
	 */
	onLeave(fn: OnLeaveHook): void;
	/**
	 * Optional error handler invoked when navigation fails (fetch error, action throws, etc.).
	 * If not provided, errors are logged to `console.error`.
	 * @param error - The caught error.
	 * @param path - The path that triggered the error.
	 */
	onError?: (error: Error, path: string) => void;
	/**
	 * Pre-fetch data for `path` and warm the cache without rendering.
	 * No-op if caching is disabled.
	 * @param path - The path to prefetch.
	 * @since 0.2.0
	 */
	prefetch?(path: string): Promise<void>;
	/**
	 * Invalidate the cache entry for `path` (or all entries if omitted).
	 * The next navigation to `path` will trigger a fresh fetch.
	 * @param path - Specific path to invalidate; omit to clear all.
	 * @since 0.2.0
	 */
	invalidate?(path?: string): void;
	/**
	 * Construct a full URL string from a named or pattern-based path,
	 * interpolating `params` into `:param` tokens.
	 * @param path - Path pattern or name.
	 * @param params - Param values to interpolate.
	 * @returns The resolved URL string.
	 * @since 0.2.0
	 */
	buildUrl?(path: string, params?: Record<string, string>): string;
	/**
	 * Return the current navigation context without triggering navigation.
	 * @returns The most recent `Context`, or `null` before first navigation.
	 * @since 0.2.0
	 */
	getState?(): Context | null;
}
