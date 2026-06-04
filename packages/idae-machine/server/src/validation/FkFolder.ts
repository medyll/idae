import type { MachineModel } from '../../../src/lib/types/machine-model.js';

export type FkResolver = (
	targetCollection: string,
	scalarId:         unknown,
) => Promise<Record<string, unknown> | null>;

export interface FkFoldResult {
	data:   Record<string, unknown>;
	errors: Array<{ fkName: string; message: string }>;
}

/**
 * Build `fks.{relation}_{targetId}` entries from flat scalars in `data`.
 *
 * Pure — no I/O. Resolver is injected:
 *   - server hooks  → Mongo lookup via getDbForCollection
 *   - bootstrap seed → in-memory Map of already-inserted records
 *
 * Scalars are retained (source of truth for offline/pre-sync).
 * Existing `fks.*` entries are preserved; only keys we resolve are written/overwritten.
 */
export async function foldFks(
	model:      MachineModel,
	collection: string,
	data:       Record<string, unknown>,
	resolve:    FkResolver,
): Promise<FkFoldResult> {
	const colModel = model[collection];
	if (!colModel) return { data, errors: [] };

	const fkDefs = colModel.fks ?? {};
	if (!Object.keys(fkDefs).length) return { data, errors: [] };

	const newFks: Record<string, unknown> = { ...((data.fks as Record<string, unknown>) ?? {}) };
	const errors: Array<{ fkName: string; message: string }> = [];

	for (const [fkName, fkDef] of Object.entries(fkDefs)) {
		const scalar = data[fkName];

		if (scalar == null) {
			if (fkDef.required) errors.push({ fkName, message: `${fkName} is required` });
			continue;
		}

		const scalars = Array.isArray(scalar) ? scalar : [scalar];
		let resolved  = 0;

		for (const id of scalars) {
			if (id == null) continue;
			const target = await resolve(fkDef.code, id);
			if (!target) {
				errors.push({ fkName, message: `${fkName}: no record found for id=${id} in '${fkDef.code}'` });
				continue;
			}
			const targetId         = target.id ?? id;
			newFks[`${fkName}_${targetId}`] = target;
			resolved++;
		}

		if (fkDef.required && resolved === 0) {
			errors.push({ fkName, message: `${fkName} required but target could not be resolved` });
		}
	}

	return { data: { ...data, fks: newFks }, errors };
}
