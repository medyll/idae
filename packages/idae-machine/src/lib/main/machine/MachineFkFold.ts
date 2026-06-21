import type { MachineFkDef } from '$lib/types/index.js';

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
