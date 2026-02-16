// matcher utilities for route path compilation and query parsing

export interface Compiled {
	regex: RegExp;
	keys: string[];
}

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

// Recursively match a route tree and return the matched chain (ancestors -> leaf)
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
