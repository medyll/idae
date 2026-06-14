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
export async function resolveOrCreateByCode(
	adapter: any,  // IdaeDbAdapterInterface<T>
	code: string,
	data: Record<string, any>,
	unsetData?: Record<string, any>
): Promise<number> {
	// Ensure data includes the code
	const upsertData = { ...data, code };
	
	// Build the update operation
	const updateOp: Record<string, any> = { $set: upsertData };
	if (unsetData && Object.keys(unsetData).length > 0) {
		updateOp.$unset = unsetData;
	}
	
	// Use findOneAndUpdate with upsert to get the id immediately
	const result = await adapter.findOneAndUpdate(
		{ code },           // Match by code (unique natural key)
		updateOp,            // Additive update - never clobbers existing fields
		{ 
			returnDocument: 'after',  // Return the document after update/insert
			upsert: true              // Create if not found
		}
	);
	
	if (!result) {
		throw new Error(`resolveOrCreateByCode failed: no result for code=${code}`);
	}
	
	const id = result.id as number | undefined;
	if (id == null || isNaN(id)) {
		throw new Error(`resolveOrCreateByCode failed: invalid id=${id} for code=${code}`);
	}
	
	return id;
}