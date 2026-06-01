/**
 * machineSchemaLoader.ts
 * Stale-while-revalidate schema fetching for machine.boot().
 * Reads from IDB cache, starts machine immediately, refreshes in background.
 */

import { readSchemaCache, writeSchemaCache } from '$lib/main/machineSchemaCache.js';
import type { MachineModel } from '$lib/types/index.js';

export interface SchemaLoaderCallbacks {
	onModel:  (model: MachineModel) => void;
	onStart:  () => void;
	onDrift:  () => Promise<void>;
}

/**
 * Load schema with stale-while-revalidate strategy.
 * - Cache hit  → call onModel + onStart immediately, refresh in background.
 * - Cache miss → fetch, cache, call onModel + onStart.
 * Returns an EventTarget that emits 'schema:updated' when background refresh brings new data.
 */
export async function loadSchema(url: string, callbacks: SchemaLoaderCallbacks): Promise<EventTarget> {
	const emitter = new EventTarget();
	const cached  = await readSchemaCache(url);

	if (cached) {
		callbacks.onModel(cached as MachineModel);
		callbacks.onStart();

		fetch(url)
			.then((r) => r.json())
			.then(async (fresh) => {
				if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
					await writeSchemaCache(url, fresh);
					callbacks.onModel(fresh as MachineModel);
					await callbacks.onDrift();
					emitter.dispatchEvent(new CustomEvent('schema:updated', { detail: fresh }));
				}
			})
			.catch((err) => {
				console.warn('[idae-machine] Background schema refresh failed:', err);
			});
	} else {
		const res   = await fetch(url);
		if (!res.ok) throw new Error(`[idae-machine] Schema fetch failed: ${res.status} ${res.statusText}`);
		const model = await res.json() as MachineModel;
		await writeSchemaCache(url, model);
		callbacks.onModel(model);
		callbacks.onStart();
	}

	return emitter;
}
