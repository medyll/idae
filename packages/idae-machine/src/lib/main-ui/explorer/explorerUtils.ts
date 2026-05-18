export type SortBy = { field: string; direction: 'asc' | 'desc' };

export function sortItems<T extends Record<string, unknown>>(
	items: T[],
	sortBy: SortBy
): T[] {
	const { field, direction } = sortBy;
	return [...items].sort((a, b) => {
		const av = a[field] ?? null;
		const bv = b[field] ?? null;
		if (av === null && bv === null) return 0;
		if (av === null) return 1;
		if (bv === null) return -1;
		const cmp = av < bv ? -1 : av > bv ? 1 : 0;
		return direction === 'asc' ? cmp : -cmp;
	});
}
