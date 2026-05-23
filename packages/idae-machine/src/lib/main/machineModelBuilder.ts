/**
 * machineModelBuilder.ts
 * Pure merge of `core` and `business` MachineModels — no system baseline injection.
 *
 * The system baseline (appscheme_*, appuser_*, …) is the server's responsibility:
 * MongoDB `appscheme_*` rows are deployed from `idae-model-core` at server bootstrap,
 * and the client receives them through `machine.fetchSchema(/api/scheme)`. Reading
 * `idae-model-core` directly on the client is forbidden (see header in that file
 * and BACK-07).
 */

import type { MachineModel } from '$lib/types/machine-model.js';

/**
 * Merge an optional core MachineModel with an optional business MachineModel.
 * Priority on key collision: business > core.
 *
 * @param core     Optional framework collections (rarely set directly — usually the
 *                 server-delivered schema covers everything).
 * @param business Optional application-specific collections.
 */
export function buildEffectiveModel(core?: MachineModel, business?: MachineModel): MachineModel {
	return { ...(core ?? {}), ...(business ?? {}) };
}
