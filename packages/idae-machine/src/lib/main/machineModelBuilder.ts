/**
 * machineModelBuilder.ts
 * Merges system collections (appModelDeclaration) with user model.
 * System collections always present; user model takes precedence on name collision.
 */

import appModelDeclaration from '$lib/types/idae-model-core.js';
import type { MachineModel } from '$lib/types/machine-model.js';

export function buildEffectiveModel(userModel?: MachineModel): MachineModel {
	const system: MachineModel = {};
	for (const [name, col] of Object.entries(appModelDeclaration.collections)) {
		system[name] = { keyPath: '++id', ...(col as any) };
	}
	if (!userModel) return system;
	return { ...system, ...userModel };
}
