/**
 * machineSeed.ts
 * Unified seed mechanism — same call for core and business data.
 * No distinction between system collections (appscheme) and business collections (vehicle).
 */

import { machine } from '$lib/main/machine.js';

/**
 * Seed collections with initial data.
 * Works for any collection — core (appscheme, appuser…) or business (vehicle, reservation…).
 *
 * @example
 * seed({
 *   appscheme: [{ code: 'vehicle', name: 'Vehicles', base: 'machine_app' }],
 *   vehicle:   [{ brand: 'Renault', model: 'Clio', year: 2022 }],
 * })
 */
export async function seed(data: Record<string, unknown[]>): Promise<void> {
	for (const [collection, rows] of Object.entries(data)) {
		const store = machine.collection(collection);
		if (!store) {
			console.warn(`[seed] collection "${collection}" not found — skipped`);
			continue;
		}
		for (const row of rows) {
			await store.create(row);
		}
	}
}

/**
 * Seed only if the collection is empty (idempotent).
 */
export async function seedIfEmpty(data: Record<string, unknown[]>): Promise<void> {
	for (const [collection, rows] of Object.entries(data)) {
		const store = machine.collection(collection);
		if (!store) {
			console.warn(`[seed] collection "${collection}" not found — skipped`);
			continue;
		}
		const existing = await store.getAll();
		if (existing.length > 0) continue;
		for (const row of rows) {
			await store.create(row);
		}
	}
}
