/**
 * Unified FK resolution utility - resolves code → id via upsert
 * Replaces the duplicated logic in publishModel, seedBusinessData, and seedAiData
 */
import { IdaeDb } from '@medyll/idae-db';

/**
 * Resolves a natural key (code) to an autoincrement id, creating the record if absent.
 * Uses findOneAndUpdate with upsert=true and returnDocument='after' to get the id immediately.
 * This is the single source of truth for "code → id" resolution across all seed paths.
 *
 * @param adapter - The database adapter for the target collection
 * @param code - The natural key (code field value)
 * @param data - The data to upsert (must include {code} at minimum)
 * @param unsetData - Optional fields to unset (for migration/cleanup)
 * @returns The autoincrement id of the resolved/created record
 */
/**
 * Ensure a record with the given code exists in the target collection, creating it if absent.
 * Returns the autoincrement id. Never returns null — throws on failure.
 *
 * Convention: `ensure*` = create-if-absent. `resolve*` = strict read, throws if absent.
 */
export async function ensureCodeToId(
	adapter: any,  // IdaeDbAdapterInterface<T>
	code: string,
	data: Record<string, any>,
	unsetData?: Record<string, any>
): Promise<number> {
	const upsertData = { ...data, code };

	const updateOp: Record<string, any> = { $set: upsertData };
	if (unsetData && Object.keys(unsetData).length > 0) {
		updateOp.$unset = unsetData;
	}

	const result = await adapter.findOneAndUpdate(
		{ code },
		updateOp,
		{ returnDocument: 'after', upsert: true }
	);

	if (!result) {
		throw new Error(`ensureCodeToId: no result for code=${code}`);
	}

	const id = result.id as number | undefined;
	if (id == null || isNaN(id)) {
		throw new Error(`ensureCodeToId: invalid id=${id} for code=${code}`);
	}

	return id;
}