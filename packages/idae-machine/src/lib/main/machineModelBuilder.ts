/**
 * machineModelBuilder.ts
 * Merges system collections (appModelDeclaration) with user model.
 * System collections always present; user model takes precedence on name collision.
 */

import appModelDeclaration from '$lib/types/idae-model-core.js';
import type { MachineModel } from '$lib/types/machine-model.js';

/**
 * Merge system baseline + core + business into one effective model.
 * Priority (highest wins on collision): business > core > system baseline.
 *
 * @param core     System/framework collections. Falls back to appModelDeclaration.
 * @param business Application business collections (vehicle, reservation, …).
 */
export function buildEffectiveModel(core?: MachineModel, business?: MachineModel): MachineModel {
	const system: MachineModel = {};
	for (const [name, col] of Object.entries(appModelDeclaration.collections)) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		system[name] = { keyPath: '++id', ...(col as any) };
	}
	return { ...system, ...(core ?? {}), ...(business ?? {}) };
}
