import { machineServer } from '../MachineServer.js';
import type { MachineFkDef } from '../../../src/lib/types/machine-model.js';

export interface FkValidationError { field: string; message: string; }
export interface FkValidationResult { valid: boolean; errors: FkValidationError[]; }

/**
 * Split "destination_42" → { baseName: "destination", refId: "42" }
 * The suffix IS the referenced record id.
 */
export function parseFkKey(key: string): { baseName: string; refId: string } {
	const pos = key.lastIndexOf('_');
	if (pos < 1) return { baseName: key, refId: '' };
	return { baseName: key.slice(0, pos), refId: key.slice(pos + 1) };
}

const fkDefsCache = new Map<string, Record<string, MachineFkDef>>();

export function invalidateFkDefsCache(collection?: string): void {
	if (collection) fkDefsCache.delete(collection);
	else fkDefsCache.clear();
}

export async function getFkDefs(collection: string): Promise<Record<string, MachineFkDef>> {
	if (fkDefsCache.has(collection)) return fkDefsCache.get(collection)!;
	try {
		const model = await machineServer.getModel(collection);
		const defs = (model[collection] as any)?.fks ?? {};
		fkDefsCache.set(collection, defs);
		return defs;
	} catch {
		return {};
	}
}

/**
 * Validate fks.* payload for a write (POST or PUT).
 * Rules:
 *   - key must be {baseName}_{refId} — suffix always required
 *   - baseName must exist in FK defs for the collection
 *   - entry must have an `id` field matching refId
 *   - required FKs must have at least one entry
 */
export async function validateFkEntries(
	collection: string,
	data: Record<string, unknown>,
): Promise<FkValidationResult> {
	const fks = data.fks;
	if (!fks || typeof fks !== 'object' || Array.isArray(fks)) {
		return { valid: true, errors: [] };
	}

	const fkDefs = await getFkDefs(collection);
	if (Object.keys(fkDefs).length === 0) return { valid: true, errors: [] };

	const errors: FkValidationError[] = [];
	const presentBases = new Set<string>();

	for (const [key, entry] of Object.entries(fks as Record<string, unknown>)) {
		const { baseName, refId } = parseFkKey(key);

		if (!refId) {
			errors.push({ field: `fks.${key}`, message: `Key '${key}' missing _id suffix — use {fkName}_{recordId}` });
			continue;
		}

		if (!(baseName in fkDefs)) {
			errors.push({ field: `fks.${key}`, message: `Unknown FK relation '${baseName}'` });
			continue;
		}

		presentBases.add(baseName);

		if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
			errors.push({ field: `fks.${key}`, message: `Entry must be an object` });
			continue;
		}

		const entryObj = entry as Record<string, unknown>;
		if (!('id' in entryObj)) {
			errors.push({ field: `fks.${key}`, message: `Missing 'id' field` });
			continue;
		}

		if (String(entryObj.id) !== refId) {
			errors.push({ field: `fks.${key}`, message: `Key suffix '${refId}' must match entry.id '${entryObj.id}'` });
		}
	}

	for (const [name, def] of Object.entries(fkDefs)) {
		if (def.required && !presentBases.has(name)) {
			errors.push({ field: `fks.${name}`, message: `FK '${name}' is required` });
		}
	}

	return { valid: errors.length === 0, errors };
}

/**
 * Build a map of all collections that hold FKs pointing to targetCollection.
 * Returns { [sourceCollection]: [fkBaseName, ...] }
 */
export async function findReverseFkHolders(
	targetCollection: string,
): Promise<Record<string, string[]>> {
	try {
		const model = await machineServer.getModel();
		const result: Record<string, string[]> = {};
		for (const [colCode, colDef] of Object.entries(model)) {
			const matches = Object.entries((colDef as any).fks ?? {})
				.filter(([, def]) => (def as MachineFkDef).code === targetCollection)
				.map(([fkName]) => fkName);
			if (matches.length) result[colCode] = matches;
		}
		return result;
	} catch {
		return {};
	}
}
