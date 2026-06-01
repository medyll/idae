/**
 * MachineRecordIdentity
 * Shared record-key normalization and matching.
 *
 * Problem: `collectionId` travels as a string through routing/frame state,
 * but the IDB index may be numeric. `'42' !== 42` breaks store lookups.
 * This module is the single place that resolves that mismatch.
 */
export const MachineRecordIdentity = {
	/**
	 * Normalize a raw key (string from URL/frame) to the canonical type.
	 * Returns a number when the value is a finite integer string, otherwise
	 * keeps it as a string. Returns undefined for null/undefined/empty.
	 */
	normalizeKey(raw: unknown): string | number | undefined {
		if (raw == null || raw === '') return undefined;
		const n = Number(raw);
		if (Number.isFinite(n) && !Number.isNaN(n)) return n;
		return String(raw);
	},

	/**
	 * Build a where-clause for machine.store() / collection.get().
	 * Returns null when raw is null/undefined (caller should skip the query).
	 */
	buildWhere(indexName: string, raw: unknown): Record<string, unknown> | null {
		const key = MachineRecordIdentity.normalizeKey(raw);
		if (key === undefined) return null;
		return { [indexName]: key };
	},

	/**
	 * Check whether a record's index field matches a raw key.
	 * Compares by normalized value so '42' matches 42 and vice-versa.
	 */
	recordMatchesIndex(record: Record<string, unknown>, indexName: string, raw: unknown): boolean {
		const normalized = MachineRecordIdentity.normalizeKey(raw);
		if (normalized === undefined) return false;
		const recordKey = MachineRecordIdentity.normalizeKey(record[indexName]);
		return recordKey === normalized;
	},
} as const;
