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
