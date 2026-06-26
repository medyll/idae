/**
 * Utilities for deriving warmup collection lists from the machine model
 * Replaces hardcoded warmup arrays with model-driven collection selection
 */
import type { MachineModel } from '$lib/types/index.js';
import { getMetaCollectionResolver } from '$lib/machine/ext/hooks.js';

/**
 * Get collections that are critical for schema hydration (warmup candidates).
 * These are collections with base='machine_app' that feed the shell UI.
 * Delegates to the domain bridge if registered; falls back to inline implementation.
 *
 * @param model - The machine model to analyze
 * @param bases - Array of bases to include (default: ['machine_app'])
 * @returns Array of collection names that should be warmed up
 */
export function getSchemaCriticalCollections(
	model: MachineModel,
	bases: string[] = ['machine_app']
): string[] {
	const resolver = getMetaCollectionResolver();
	if (resolver) return resolver.getSchemaCriticalCollections(bases);

	const criticalCollections: string[] = [];
	for (const [collectionName, collectionDef] of Object.entries(model)) {
		if (collectionDef.base && bases.includes(collectionDef.base)) {
			criticalCollections.push(collectionName);
		}
	}
	return Array.from(new Set(criticalCollections)).sort();
}

/**
 * Get all collections that should be warmed up for optimal UI performance.
 * Includes schema-critical collections plus other high-priority collections.
 *
 * @param model - The machine model to analyze
 * @returns Array of collection names for comprehensive warmup
 */
export function getComprehensiveWarmupCollections(model: MachineModel): string[] {
	const collections = getSchemaCriticalCollections(model, ['machine_app', 'machine_user', 'machine_ai']);

	const additionalCollections: string[] = [];

	for (const collection of additionalCollections) {
		if (model[collection] && !collections.includes(collection)) {
			collections.push(collection);
		}
	}

	return collections;
}

/** Minimal interface — hydrateAll is a qoolie extension, not in the public type. */
type HydratableQoolie = { hydrateAll?: (collections: string[]) => Promise<void> };

/**
 * Pre-fetch collections into IDB. Derives the list from the model when not provided.
 * Swallows errors so a warmup failure never blocks the app.
 */
export async function warmup(
	qoolie: HydratableQoolie,
	model: MachineModel,
	collections?: string[]
): Promise<void> {
	const collectionsToWarm = (collections && collections.length > 0)
		? collections
		: getSchemaCriticalCollections(model);

	const hydratePromise = qoolie.hydrateAll?.(collectionsToWarm);
	if (!hydratePromise) return;

	const timeout = new Promise<never>((_, reject) =>
		setTimeout(() => reject(new Error('[idae-machine] warmup timed out after 30s')), 30000)
	);

	try {
		await Promise.race([hydratePromise, timeout]);
	} catch (err) {
		console.warn('[idae-machine] warmup failed (non-blocking):', err);
	}
}

/**
 * Get all base names used in the model
 *
 * @param model - The machine model to analyze
 * @returns Array of unique base names
 */
export function getModelBases(model: MachineModel): string[] {
	const bases = new Set<string>();

	for (const collectionDef of Object.values(model)) {
		if (collectionDef.base) {
			bases.add(collectionDef.base);
		}
	}

	return Array.from(bases).sort();
}