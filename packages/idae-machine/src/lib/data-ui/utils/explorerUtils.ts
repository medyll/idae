export type { SortBy } from '\$lib/types/index.js';
import type { SortBy } from '\$lib/types/index.js';

export function sortItems<T extends Record<string, unknown>>(
	items: T[],
	sortBy: SortBy | SortBy[]
): T[] {
	const chain = Array.isArray(sortBy) ? sortBy : [sortBy];
	return [...items].sort((a, b) => {
		for (const { field, direction } of chain) {
			const av = a[field] ?? null;
			const bv = b[field] ?? null;
			if (av === null && bv === null) continue;
			if (av === null) return 1;
			if (bv === null) return -1;
			const cmp = av < bv ? -1 : av > bv ? 1 : 0;
			if (cmp !== 0) return direction === 'asc' ? cmp : -cmp;
		}
		return 0;
	});
}

export function groupItems<T extends Record<string, unknown>>(
	items: T[],
	field: string
): Map<string, T[]> {
	const map = new Map<string, T[]>();
	for (const item of items) {
		const key = String(item[field] ?? '\u2014');
		if (!map.has(key)) map.set(key, []);
		map.get(key)!.push(item);
	}
	return map;
}
