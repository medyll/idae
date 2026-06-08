export type { SortBy } from '$lib/types/index.js';
import type { SortBy } from '$lib/types/index.js';
import { parseFkKey } from '$lib/data-ui/utils/dataRelationUtils.js';

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
		const key = String(item[field] ?? '—');
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

/** Label a single nested FK entry object `{ id, code, name, … }`. */
function fkEntryLabel(o: Record<string, unknown>): string {
	return String(o.name ?? o.code ?? o.id ?? '—');
}

/**
 * Label for an FK relation stored as a nested object on the record under `fks`.
 *
 * Supports two storage shapes:
 *   - legacy bare key:   `fks.<key>      = { id, code, name }`
 *   - suffixed key(s):   `fks.<key>_<id> = { id, code, name }` (one per reference;
 *                        multiple references → labels joined with ', ')
 *
 * Returns undefined when the relation is not stored as a nested object
 * (e.g. flat code values that need a store lookup).
 */
export function fkObjectLabel(item: Record<string, unknown>, fkKey: string): string | undefined {
	const bag = item.fks as Record<string, unknown> | undefined;
	if (!bag || typeof bag !== 'object') return undefined;

	// Legacy bare key first (backward-compat).
	const bare = bag[fkKey];
	if (bare && typeof bare === 'object') return fkEntryLabel(bare as Record<string, unknown>);

	// Suffixed convention: collect every flat `fks.<fkKey>_<id>` snapshot.
	const labels: string[] = [];
	for (const key of Object.keys(bag)) {
		const { baseName, refId } = parseFkKey(key);
		if (!refId || baseName !== fkKey) continue;
		const entry = bag[key];
		if (entry && typeof entry === 'object') labels.push(fkEntryLabel(entry as Record<string, unknown>));
	}
	return labels.length ? labels.join(', ') : undefined;
}
