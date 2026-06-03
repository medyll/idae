export type { SortBy } from '$lib/types/index.js';
import type { SortBy } from '$lib/types/index.js';

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

export function groupItemsResolved<T extends Record<string, unknown>>(
	items: T[],
	field: string,
	resolveKey: (item: T, field: string) => string
): Map<string, T[]> {
	const map = new Map<string, T[]>();
	for (const item of items) {
		const key = resolveKey(item, field);
		if (!map.has(key)) map.set(key, []);
		map.get(key)!.push(item);
	}
	return map;
}

/**
 * Resolve the FK relation key targeted by a `groupBy` expression.
 * Accepts the `fks.<key>` convention (e.g. `fks.appscheme_type`) used in
 * `template.presentation`, or a bare key when it matches a declared FK.
 * Returns null when `groupBy` does not reference an FK relation.
 */
export function parseFkGroupKey(
	groupBy: string,
	fks: Record<string, unknown> = {}
): string | null {
	if (groupBy.startsWith('fks.')) return groupBy.slice(4).split('.')[0] || null;
	return fks[groupBy] ? groupBy : null;
}

/**
 * Parse an FK field type string into its target collection and index field.
 * `fk-category.id` → `{ collection: 'category', targetIndex: 'id' }`.
 * Returns null for non-FK types. Pure, deterministic — no I/O.
 */
export function parseFkType(
	fieldType?: string
): { collection: string; targetIndex: string } | null {
	if (!fieldType?.startsWith('fk-')) return null;
	const [collection, targetIndex] = fieldType.slice(3).split('.');
	if (!collection) return null;
	return { collection, targetIndex: targetIndex || 'id' };
}

/**
 * Label for an FK relation stored as a nested object on the record under
 * `fks.<key>` — `{ id, code, name, … }`.
 * Returns undefined when the relation is not stored as a nested object
 * (e.g. flat code values that need a store lookup).
 */
export function fkObjectLabel(item: Record<string, unknown>, fkKey: string): string | undefined {
	const bag = item.fks as
		| Record<string, unknown>
		| undefined;
	const fk = bag?.[fkKey];
	if (fk && typeof fk === 'object') {
		const o = fk as Record<string, unknown>;
		return String(o.name ?? o.code ?? o.id ?? '—');
	}
	return undefined;
}
