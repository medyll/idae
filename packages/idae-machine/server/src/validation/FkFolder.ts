import { foldFk } from '@medyll/qoolie';
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
 * Server-side FK fold. Thin wrapper over the shared primitive in qoolie
 * (`foldFk`) — see UNMULTIPLE.md Phase 1. Relation defs are the source of
 * truth from `appscheme[col].fkRelations` (FKRELATIONS.md), supplied by the caller:
 *   - server hooks  → `getFkDefs(collection)` (meta-DB appscheme) + Mongo resolver
 *   - bootstrap seed → `model[col].fkRelations` (in-memory) + in-memory Map resolver
 *
 * Shape: single FK → `fks.<name>`; multiple FK (legacy, dying — UNMULTIPLE.md) →
 * `fks.<name>_<targetId>`.
 */
export async function foldFks(
	fkDefs:  Record<string, MachineFkDef>,
	data:    Record<string, unknown>,
	resolve: FkResolver,
): Promise<FkFoldResult> {
	const result = await foldFk(fkDefs, data, (targetCollection, _indexField, value) => resolve(targetCollection, value));
	return result;
}
