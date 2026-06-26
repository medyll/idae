import type { MachineFkDef } from '$lib/types/index.js';

/** Minimal schema bridge — avoids importing MachineDb (cycle risk). */
type FkSchemaBridge = {
	collection(name: string): { fks?: Record<string, MachineFkDef> } | null | undefined;
};

/** Minimal qoolie bridge — only the where() accessor is needed for FK resolution. */
type QoolieBridge = {
	collection?: Record<string, { where(q: Record<string, unknown>): unknown }>;
};

/**
 * MachineFkFold
 * Pure fold: given a record and a collection's `fks{}` block, denormalize a full
 * snapshot of each FK target into `record.fks.<field>` (single) or
 * `record.fks.<field>_<value>` (multiple) — the exact shape `resolvePresentationToken`
 * and `DataField.readFkRaw` already consume for display.
 *
 * No I/O here: target resolution is injected via `resolveTarget`, mirroring
 * `MachineSchemeValues.displayValue(resolveTarget)`.
 */

export type FkTargetResolver = (
	fkCollection: string,
	fkIndexField: string,
	value: unknown,
) => Promise<Record<string, unknown> | undefined> | Record<string, unknown> | undefined;

const FK_INDEX_FIELD = 'code';

export async function foldFksIntoRecord(
	fks: Record<string, MachineFkDef>,
	record: Record<string, unknown>,
	resolveTarget: FkTargetResolver,
): Promise<Record<string, unknown>> {
	const fkKeys = Object.keys(fks ?? {});
	if (!fkKeys.length) return record;

	const out: Record<string, unknown> = { ...record };
	const fksBag: Record<string, unknown> = { ...(out.fks as Record<string, unknown> | undefined) };

	for (const fieldName of fkKeys) {
		const fkDef = fks[fieldName];
		if (!fkDef?.code) continue;

		const raw = record[fieldName];
		if (raw == null) continue;

		if (fkDef.multiple) {
			const values = Array.isArray(raw) ? raw : [raw];
			for (const value of values) {
				if (value == null) continue;
				const target = await resolveTarget(fkDef.code, FK_INDEX_FIELD, value);
				if (target) fksBag[`${fieldName}_${value}`] = { ...target };
			}
			continue;
		}

		const target = await resolveTarget(fkDef.code, FK_INDEX_FIELD, raw);
		if (target) fksBag[fieldName] = { ...target };
	}

	out.fks = fksBag;
	return out;
}

/**
 * Wrap a QoolieCollection so create/update/updateWhere denormalize FK snapshots
 * into `record.fks.<field>` before persisting. All other methods forward untouched.
 *
 * Extracted from machine.ts (#resolveFkTarget + #wrapCollectionFkFold).
 * machine.collection() is the single call-site.
 */
export function wrapCollectionFkFold<C extends object>(
	machineDb: FkSchemaBridge,
	qoolie: QoolieBridge,
	name: string,
	col: C,
): C {
	const fks = machineDb.collection(name)?.fks ?? {};
	if (!Object.keys(fks).length) return col;

	const resolveFkTarget: FkTargetResolver = async (fkCollection, fkIndexField, value) => {
		const targetCol = qoolie.collection?.[fkCollection];
		if (!targetCol) return undefined;
		try {
			const docs = await Promise.resolve(targetCol.where({ [fkIndexField]: value }));
			return (docs as Record<string, unknown>[] | undefined)?.[0];
		} catch {
			return undefined;
		}
	};

	const fold = (data: Record<string, unknown>) => foldFksIntoRecord(fks, data, resolveFkTarget);

	const overrides: Record<string, unknown> = {
		create:      async (data: Record<string, unknown>) =>
			(col as Record<string, (...args: unknown[]) => unknown>).create(await fold(data)),
		update:      async (id: unknown, data: Record<string, unknown>) =>
			(col as Record<string, (...args: unknown[]) => unknown>).update(id, await fold(data)),
		updateWhere: async (query: unknown, data: Record<string, unknown>) =>
			(col as Record<string, (...args: unknown[]) => unknown>).updateWhere(query, await fold(data)),
	};

	// Proxy forwards every other method (where/get/getAll/…) to the real instance
	// with correct `this` binding — spreading would silently drop prototype methods.
	return new Proxy(col, {
		get(target, prop, receiver) {
			if (typeof prop === 'string' && prop in overrides) return overrides[prop];
			const val = Reflect.get(target, prop, receiver);
			return typeof val === 'function' ? val.bind(target) : val;
		},
	});
}
