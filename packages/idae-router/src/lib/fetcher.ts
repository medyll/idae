import type { RouteHttpConfig } from './types.js';

export interface FetchResult {
	data: unknown;
	error: Error | undefined;
}

/**
 * Interpolate `:param` tokens in a URL template using the provided params map.
 * Unknown tokens are left as-is (e.g. `:missing` stays `:missing`).
 * @param url - URL template, e.g. `/api/users/:id`
 * @param params - Matched route params, e.g. `{ id: '42' }`
 * @returns Interpolated URL string.
 * @example interpolateParams('/api/users/:id', { id: '42' }) // → '/api/users/42'
 */
export function interpolateParams(url: string, params: Record<string, string>): string {
	return url.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => params[key] ?? `:${key}`);
}

/**
 * Build the full fetch URL from a `RouteHttpConfig`.
 *
 * - `'internal'`: prepends `window.location.origin` (same-origin, origin-pinned).
 * - `'external'`: prepends `https://` (cross-origin, HTTPS enforced — plain HTTP rejected).
 *
 * @param config - The route's `http` or `http_source` config.
 * @param type - `'internal'` for same-origin; `'external'` for cross-origin.
 * @param params - Matched route params used for token interpolation.
 * @returns Fully-qualified URL string ready for `fetch()`.
 * @example resolveUrl({ url: '/api/users/:id' }, 'internal', { id: '42' })
 * // → 'http://localhost/api/users/42'
 * @example resolveUrl({ url: 'api.example.com/items/:slug' }, 'external', { slug: 'foo' })
 * // → 'https://api.example.com/items/foo'
 */
export function resolveUrl(
	config: RouteHttpConfig,
	type: 'internal' | 'external',
	params: Record<string, string>
): string {
	const interpolated = interpolateParams(config.url, params);
	if (type === 'internal') {
		if (config.url.includes('://')) {
			console.warn(
				`[idae-router] http.url should be a path (e.g. "/api/users/:id"), not a full URL. ` +
					`Got: "${config.url}". Origin will be prepended regardless.`
			);
		}
		const origin =
			typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
		return `${origin}${interpolated.startsWith('/') ? '' : '/'}${interpolated}`;
	}
	// External: HTTPS enforced — strip any accidental scheme prefix first
	const stripped = interpolated.replace(/^https?:\/\//, '');
	return `https://${stripped}`;
}

/**
 * Execute a route-level fetch and return a structured result. Never throws.
 *
 * Resolution order:
 * 1. If both `http` and `http_source` are defined, `http` wins and a warning is emitted.
 * 2. If neither is defined, returns `{ data: undefined, error: undefined }`.
 * 3. On non-OK HTTP status, returns `{ data: null, error: Error('HTTP <status>') }`.
 * 4. On network / parse error, returns `{ data: null, error: <Error> }`.
 *
 * @param route - Route definition slice with optional `http`/`http_source`.
 * @param params - Matched route params for URL interpolation.
 * @returns Promise resolving to `{ data, error }` — never rejects.
 * @example
 * const { data, error } = await fetchRouteData(route, ctx.params);
 * if (error) console.error(error);
 */
export async function fetchRouteData(
	route: { http?: RouteHttpConfig; http_source?: RouteHttpConfig },
	params: Record<string, string>
): Promise<FetchResult> {
	let config: RouteHttpConfig;
	let type: 'internal' | 'external';

	if (route.http && route.http_source) {
		console.warn(
			'[idae-router] Route defines both `http` and `http_source`. `http` takes precedence.'
		);
	}

	if (route.http) {
		config = route.http;
		type = 'internal';
	} else if (route.http_source) {
		config = route.http_source;
		type = 'external';
	} else {
		return { data: undefined, error: undefined };
	}

	const url = resolveUrl(config, type, params);

	try {
		const response = await fetch(url, config.args);
		if (!response.ok) {
			return { data: null, error: new Error(`HTTP ${response.status}`) };
		}
		const data: unknown = await response.json();
		return { data, error: undefined };
	} catch (err) {
		return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
	}
}
