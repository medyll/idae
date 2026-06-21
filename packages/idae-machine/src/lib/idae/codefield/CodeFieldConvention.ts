// idae/codefield/CodeFieldConvention.ts
// Domain convention: every collection must have a `code` field (semantic key).
// Implements the CodeFieldConvention hook registered in the engine bridge.

import type { MachineModel } from '$lib/types/index.js';
import { field } from '$lib/main/machine/fieldBuilder.js';

export const CODE_FIELD_NAME = 'code';

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
