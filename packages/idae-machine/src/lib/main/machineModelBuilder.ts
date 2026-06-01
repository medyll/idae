/**
 * machineModelBuilder.ts
 * Pure merge of `core` and `business` MachineModels — no system baseline injection.
 *
 * The system baseline (appscheme_*, appuser_*, …) is the server's responsibility:
 * MongoDB `appscheme_*` rows are deployed from `engineMetaSeed` at server bootstrap,
 * and the client receives them through `machine.boot({ sync: { databaseHost } })`. Reading
 * `engineMetaSeed` directly on the client is forbidden (see header in that file
 * and BACK-07).
 */

import type { MachineModel } from '$lib/types/index.js';
import { field } from '$lib/main/machine/fieldBuilder.js';

/**
 * Synthesize fk fields from the `fks` block into `fields` so forward FK resolution
 * (getFieldsForView, descriptor, findFkField) can see them without double-declaration.
 * Idempotent: skips any field already present (avoids overwriting an explicit declaration).
 * Join index = 'id' (data layer). `fkDef.code` = target collection name.
 */
export function foldFksIntoFields(model: MachineModel): MachineModel {
	const out: MachineModel = {};
	for (const [name, col] of Object.entries(model)) {
		const fks    = col.fks    ?? {};
		const fields = { ...( col.fields ?? {}) };
		for (const [fkKey, fkDef] of Object.entries(fks)) {
			if (fkKey in fields) continue;
			const fd = field(`fk-${fkDef.code}.id`, { required: !!fkDef.required });
			(fd as unknown as Record<string, unknown>).group = 'relations';
			fields[fkKey] = fd;
		}
		out[name] = { ...col, fields };
	}
	return out;
}

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
