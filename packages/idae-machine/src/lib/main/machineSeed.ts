/**
 * machineSeed.ts
 * Unified seed mechanism — same call for core and business data.
 * No distinction between system collections (appscheme) and business collections (vehicle).
 */

import { machine } from '$lib/main/machine.js';

/** Auto-construct `code = String(id)` when a row has an id but no code (honors the code invariant). */
function withCode(row: unknown): unknown {
	if (row && typeof row === 'object') {
		const r = row as Record<string, unknown>;
		if ((r.code === undefined || r.code === null || r.code === '') && r.id != null) {
			return { ...r, code: String(r.id) };
		}
	}
	return row;
}

/**
 * Seed collections with initial data.
 * Works for any collection — core (appscheme, appuser…) or business (vehicle, reservation…).
 *
 * @param data - Map of collection name → rows to insert.
 * @param options.onlyIfEmpty - When true, skips collections that already have data (idempotent).
 *
 * @example
 * // Always insert
 * seed({ vehicle: [{ brand: 'Renault', model: 'Clio' }] });
 *
 * // Idempotent — only inserts if the collection is empty
 * seed({ vehicle: [{ brand: 'Renault', model: 'Clio' }] }, { onlyIfEmpty: true });
 */
export async function seed(
	data: Record<string, unknown[]>,
	{ onlyIfEmpty = false }: { onlyIfEmpty?: boolean } = {}
): Promise<void> {
	for (const [collection, rows] of Object.entries(data)) {
		const store = machine.collection(collection);
		if (onlyIfEmpty) {
			const existing = await store.getAll();
			if (existing.length > 0) continue;
		}
		for (const row of rows) {
			await store.create(withCode(row));
		}
	}
}
