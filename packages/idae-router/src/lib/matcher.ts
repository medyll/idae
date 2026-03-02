// matcher utilities for route path compilation and query parsing

/**
 * Internal: compiled route pattern produced by {@link compilePath}.
 * @internal
 */
export interface Compiled {
	regex: RegExp;
	keys: string[];
}

/**
 * Compile a route path pattern into a `Compiled` object with a regex and
 * an ordered list of named parameter keys.
 *
 * `:param` tokens are converted to `([^/]+)` capture groups.
 * A bare `*` wildcard captures the rest of the path.
 *
 * @public
 * @param path - Route path pattern (e.g. `'/users/:id'`, `'/files/*'`).
 * @returns A `Compiled` object whose `regex` can be tested against a pathname.
 * @since 0.1.0
 * @example
 * ```ts
 * const c = compilePath('/users/:id');
 * const m = c.regex.exec('/users/42'); // m[1] === '42'
 * ```
 */
export function compilePath(path: string): Compiled {
	const keys: string[] = [];
	// escape regex special chars, but keep :param and *
	let pattern = path.replace(/([.+?^=!:${}()|\\])/g, '\\$1');
	pattern = pattern.replace(/\\:(\w+)/g, (_m, key) => {
		keys.push(key);
		return '([^/]+)';
	});
	// wildcard * -> capture rest
	pattern = pattern.replace(/\*/g, () => {
		keys.push('*');
		return '(.*)';
	});
	const regex = new RegExp('^' + pattern + '$');
	return { regex, keys };
}

/**
 * Match a compiled route pattern against a pathname and return
 * the extracted parameter map, or `null` if no match.
 *
 * @public
 * @param compiled - The compiled route (from {@link compilePath}).
 * @param pathname - The URL pathname to test (no query string).
 * @returns A `Record<string, string>` of param values, or `null`.
 * @since 0.1.0
 * @example
 * ```ts
 * const c = compilePath('/users/:id');
 * matchCompiled(c, '/users/42'); // { id: '42' }
 * matchCompiled(c, '/posts/1');  // null
 * ```
 */
export function matchCompiled(compiled: Compiled, pathname: string): Record<string, string> | null {
	const m = compiled.regex.exec(pathname);
	if (!m) return null;
	const params: Record<string, string> = {};
	for (let i = 1; i < m.length; i++) {
		const key = compiled.keys[i - 1] || String(i - 1);
		params[key] = decodeURIComponent(m[i] || '');
	}
	return params;
}

/**
 * Parse a query string into a key→value map.
 * Keys with multiple values produce a `string[]`; single-value keys produce a `string`.
 *
 * @public
 * @param search - Raw query string, with or without a leading `?`.
 * @returns Parsed query parameters.
 * @since 0.1.0
 * @example
 * ```ts
 * parseQuery('?tag=a&tag=b&page=1');
 * // { tag: ['a', 'b'], page: '1' }
 * ```
 */
export function parseQuery(search: string): Record<string, string | string[]> {
	const out: Record<string, string | string[]> = {};
	if (!search) return out;
	const s = search.startsWith('?') ? search.slice(1) : search;
	const params = new URLSearchParams(s);
	for (const key of params.keys()) {
		const values = params.getAll(key);
		out[key] = values.length > 1 ? values : values[0];
	}
	return out;
}

import type { Route, RouteRecord } from './types';

// Helper: join parent and child path pieces
function joinPaths(parent: string, child: string) {
	if (!parent) return child.startsWith('/') ? child : '/' + child;
	if (child.startsWith('/')) return child;
	return (parent.replace(/\/$/, '') + '/' + child).replace(/\/+/g, '/');
}

/**
 * Recursively walk a route tree and return the matched ancestor-to-leaf chain
 * for the given `pathname`.
 *
 * - Returns an empty array when no route matches.
 * - For nested routes, parent records appear before child records.
 * - Dynamic params from all levels are merged into each record's `params` map.
 *
 * @public
 * @param rs - Array of route definitions to search.
 * @param pathname - URL pathname to match (no query string, no hash).
 * @param parentPrefix - Internal prefix used during recursion; omit on initial call.
 * @returns Ordered array of `RouteRecord` objects from root to matched leaf.
 * @since 0.1.0
 * @example
 * ```ts
 * const routes = [
 *   { path: '/users', children: [{ path: ':id', action: () => '' }] }
 * ];
 * matchRouteTree(routes, '/users/42');
 * // [ { route: …users, params: {}, path: '/users' },
 * //   { route: …:id,   params: { id: '42' }, path: '/users/:id' } ]
 * ```
 */
export function matchRouteTree(rs: Route[], pathname: string, parentPrefix = ''): RouteRecord[] {
	for (const r of rs) {
		const fullPath = r.path.startsWith('/') ? r.path : joinPaths(parentPrefix || '', r.path);
		const compiled = compilePath(fullPath);
		const params = matchCompiled(compiled, pathname);
		if (params) {
			const record: RouteRecord = { route: r, params, path: fullPath };
			if (r.children && r.children.length) {
				const childChain = matchRouteTree(r.children, pathname, fullPath);
				if (childChain.length) return [record, ...childChain];
			}
			return [record];
		}
		if (r.children && r.children.length) {
			const src = compiled.regex.source.replace(/\$$/, '');
			const prefixRe = new RegExp(src + '(?:/|$)');
			const m = prefixRe.exec(pathname);
			if (m) {
				const p: Record<string, string> = {};
				for (let i = 1; i < m.length; i++) {
					const key = compiled.keys[i - 1] || String(i - 1);
					p[key] = decodeURIComponent(m[i] || '');
				}
				const record: RouteRecord = { route: r, params: p, path: fullPath };
				const childChain = matchRouteTree(r.children, pathname, fullPath);
				if (childChain.length) return [record, ...childChain];
				return [record];
			}
		}
	}
	return [];
}
