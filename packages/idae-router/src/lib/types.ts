export type ActionResult =
	| string
	| Node
	| DocumentFragment
	| void
	| (() => void)
	| Promise<string | Node | DocumentFragment | void | (() => void)>;

export interface Context {
	path: string;
	params: Record<string, string>;
	query: Record<string, string | string[]>;
	state?: unknown;
	metadata?: Record<string, unknown>;
    matched?: RouteRecord[];
	/** Populated by `http` or `http_source` before `action` executes. `null` on fetch error. */
	data?: unknown;
	/** Set when the route-level fetch fails. Navigation continues regardless. */
	error?: Error;
}

export type Action = (ctx: Context) => ActionResult;

/**
 * Configuration for a route-level HTTP data-fetch.
 *
 * - For `http`: provide a path-only URL (e.g. `/api/users/:id`).
 *   `window.location.origin` is prepended automatically.
 * - For `http_source`: provide host+path without scheme (e.g. `api.example.com/users/:id`).
 *   `https://` is prepended automatically.
 *
 * `:param` tokens are interpolated from matched route params before fetching.
 */
export interface RouteHttpConfig {
	/** URL template. Path-only for `http`; host+path (no scheme) for `http_source`. */
	url: string;
	/** Native fetch options (method, headers, body, signal…) */
	args?: RequestInit;
}

export interface Route {
	path: string;
	/** Render function. Receives a fully-typed Context with optional `data` and `error`. */
	action?: Action;
	metadata?: Record<string, unknown>;
	children?: Route[];
	/** Same-origin fetch. `window.location.origin` prepended automatically. */
	http?: RouteHttpConfig;
	/** External HTTPS fetch. `https://` prepended automatically; plain HTTP rejected. */
	http_source?: RouteHttpConfig;
}

export interface RouteRecord {
	route: Route;
	params: Record<string, string>;
	path: string; // resolved full path for this record
}

export type BeforeNext = (nextArg?: false | string | void) => void;
export type BeforeHook = (
	to: Context,
	from: Context | null,
	next: BeforeNext
) => void | Promise<void>;
export type AfterHook = (to: Context, from: Context | null) => void | Promise<void>;
export type OnLeaveHook = (from: Context) => void | Promise<void>;

export interface RouterOptions {
	mode?: 'history' | 'hash';
	base?: string;
	outlet?: string | Element;
	routes?: Route[];
	linkInterception?: boolean;
	notFound?: Action;
}

export interface RouterInstance {
	push(path: string, state?: unknown): void;
	replace(path: string, state?: unknown): void;
	refresh(): void;
	navigate(path: string, state?: unknown, replace?: boolean): void;
	before(fn: BeforeHook): void;
	after(fn: AfterHook): void;
	onLeave(fn: OnLeaveHook): void;
	/**
	 * Optional error handler invoked when navigation fails.
	 * If not provided, errors are logged to console.error.
	 */
	onError?: (error: Error, path: string) => void;
}
