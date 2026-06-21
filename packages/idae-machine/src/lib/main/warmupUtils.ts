/**
 * Utilities for deriving warmup collection lists from the machine model
 * Replaces hardcoded warmup arrays with model-driven collection selection
 */
import type { MachineModel } from '$lib/types/index.js';

/**
 * Get collections that are critical for schema hydration (warmup candidates).
 * These are collections with base='machine_app' that feed the shell UI.
 *
 * @param model - The machine model to analyze
 * @param bases - Array of bases to include (default: ['machine_app'])
 * @returns Array of collection names that should be warmed up
 */
export function getSchemaCriticalCollections(
	model: MachineModel,
	bases: string[] = ['machine_app']
): string[] {
	// Model-driven only — no hardcoded appscheme_* fallback. Every model-core
	// collection (appscheme, appscheme_field, …) declares base:'machine_app' in
	// idae-model-core.ts, so the base-filter already covers them (RATIONALIZE #2).
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

	// Add other high-priority collections that are frequently accessed
	const additionalCollections: string[] = [
		// Add any other collections that should be warmed up
		// e.g., 'appuser', 'appuser_prefs', etc.
	];

	for (const collection of additionalCollections) {
		if (model[collection] && !collections.includes(collection)) {
			collections.push(collection);
		}
	}

	return collections;
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