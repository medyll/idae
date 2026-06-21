import type { MachineFkDef } from '../../../src/lib/types/machine-model.js';

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
 * Pure — no I/O. Both the relation definitions (`fkDefs`) and the resolver are
 * injected. Relation defs are the source of truth from `appscheme[col].fkRelations`
 * (FKRELATIONS.md), supplied by the caller:
 *   - server hooks  → `getFkDefs(collection)` (meta-DB appscheme) + Mongo resolver
 *   - bootstrap seed → `model[col].fkRelations` (in-memory) + in-memory Map resolver
 *
 * Scalars are retained (source of truth for offline/pre-sync).
 * Existing `fks.*` entries are preserved; only keys we resolve are written/overwritten.
 */
export async function foldFks(
	fkDefs:  Record<string, MachineFkDef>,
	data:    Record<string, unknown>,
	resolve: FkResolver,
): Promise<FkFoldResult> {
	if (!fkDefs || !Object.keys(fkDefs).length) return { data, errors: [] };

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
			let target: Record<string, unknown> | null;
			try { target = await resolve(fkDef.code, id); }
			catch { target = null; }
			if (!target) {
				errors.push({ fkName, message: `${fkName}: no record found for id=${id} in '${fkDef.code}'` });
				continue;
			}
			const targetId = target.id ?? id;
			// Flat snapshot — depth-1, strip Mongo _id and any nested fks block.
			// Order of members lives in the scalar FK array, NOT here. Relation-level
			// attrs (principal, etc.) are decomposed into parent FK fields, never folded onto the link.
			const { _id, fks: _nested, ...snapshot } = target as Record<string, unknown> & { _id?: unknown; fks?: unknown };
			newFks[`${fkName}_${targetId}`] = snapshot;
			resolved++;
		}

		if (fkDef.required && resolved === 0) {
			errors.push({ fkName, message: `${fkName} required but target could not be resolved` });
		}
	}

	return { data: { ...data, fks: newFks }, errors };
}
