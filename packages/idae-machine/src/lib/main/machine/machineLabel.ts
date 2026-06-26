import { MachineDb } from '$lib/main/machineDb.js';
import { MachineSchemeValues } from '$lib/main/machine/MachineSchemeValues.js';
import type { TplCollectionName } from '$lib/types/index.js';

type FetchRecord = (
	collection: string,
	id: string | number,
) => Promise<Record<string, unknown> | undefined>;

/**
 * Resolve a human-readable label for a record, using the collection's presentation template.
 * Composes an injected async fetch with MachineSchemeValues.presentation() — which handles
 * plain paths AND FK paths (fks.firm.name), unlike the former inline token walk.
 *
 * Extracted from machine.ts._renderLabel.
 */
export async function renderLabel(
	machineDb: MachineDb,
	fetchRecord: FetchRecord,
	collection: string,
	collectionId: string | number,
): Promise<string | undefined> {
	try {
		const id = isNaN(Number(collectionId)) ? collectionId : Number(collectionId);
		const rec = await fetchRecord(collection, id);
		if (!rec) return undefined;
		const values = new MachineSchemeValues(collection as TplCollectionName, machineDb);
		const label = values.presentation(rec);
		return label || undefined;
	} catch {
		return undefined;
	}
}
