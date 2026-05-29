/**
 * machineModelBuilder.ts
 * Pure merge of `core` and `business` MachineModels — no system baseline injection.
 *
 * The system baseline (appscheme_*, appuser_*, …) is the server's responsibility:
 * MongoDB `appscheme_*` rows are deployed from `idae-model-core` at server bootstrap,
 * and the client receives them through `machine.boot({ sync: { databaseHost } })`. Reading
 * `idae-model-core` directly on the client is forbidden (see header in that file
 * and BACK-07).
 */

import type { MachineModel } from '$lib/types/index.js';
import { field } from '$lib/main/machine/fieldBuilder.js';

/**
 * Ensure every collection declares a `code` field (semantic key, sibling of `id`).
 * Pure: returns a new model; collections already declaring `code` are left untouched.
 * Injected `code` is placed right after `id` when present, otherwise appended.
 */
export function ensureCodeField(model: MachineModel): MachineModel {
	const out: MachineModel = {};
	for (const [name, col] of Object.entries(model)) {
		const fields = col.fields ?? {};
		if ('code' in fields) { out[name] = col; continue; }
		const rebuilt: typeof fields = {};
		for (const [fn, fd] of Object.entries(fields)) {
			rebuilt[fn] = fd;
			if (fn === 'id') rebuilt.code = field('text');
		}
		if (!('code' in rebuilt)) rebuilt.code = field('text');
		out[name] = { ...col, fields: rebuilt };
	}
	return out;
}

/**
 * Merge an optional core MachineModel with an optional business MachineModel.
 * Priority on key collision: business > core. Guarantees the `code` invariant.
 *
 * @param core     Optional framework collections (rarely set directly — usually the
 *                 server-delivered schema covers everything).
 * @param business Optional application-specific collections.
 */
export function buildEffectiveModel(core?: MachineModel, business?: MachineModel): MachineModel {
	return ensureCodeField({ ...(core ?? {}), ...(business ?? {}) });
}
