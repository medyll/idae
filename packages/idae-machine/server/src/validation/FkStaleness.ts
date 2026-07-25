import { Schema } from 'mongoose';
import { getDbForCollection } from '../middleware/dbRouter.js';
import { findReverseFkHolders } from './FkValidator.js';

/**
 * FK staleness cascade (UNMULTIPLE.md Phase 5). A FK is always single, so every
 * holder's snapshot lives at the bare `fks.<fkName>` key — no suffix scan needed
 * to find it, just match on `fks.<fkName>.id`.
 */

async function getMongoModel(collection: string): Promise<any> {
	const db = await getDbForCollection(collection);
	const schema = new Schema({}, { strict: false, collection: collection.toLowerCase() });
	const modelName = `${db.name}__${collection}`;
	return db.models[modelName] ?? db.model(modelName, schema, collection.toLowerCase());
}

/**
 * Target record updated → refold every holder's stale `fks.<fkName>` snapshot
 * to match the new target state. Non-blocking: a failure on one holder
 * collection does not roll back the write that triggered it.
 */
export async function refoldReverseFkSnapshots(
	targetCollection: string,
	updatedRecord: Record<string, unknown>,
): Promise<void> {
	const targetId = updatedRecord.id;
	if (targetId == null) return;

	const holders = await findReverseFkHolders(targetCollection);
	if (!Object.keys(holders).length) return;

	const { _id, fks: _nested, ...snapshot } = updatedRecord as Record<string, unknown> & { _id?: unknown; fks?: unknown };

	for (const [sourceCollection, fkNames] of Object.entries(holders)) {
		try {
			const Model = await getMongoModel(sourceCollection);
			for (const fkName of fkNames) {
				await Model.updateMany(
					{ [`fks.${fkName}.id`]: targetId },
					{ $set: { [`fks.${fkName}`]: snapshot } },
				);
			}
		} catch (err) {
			console.warn(`FK staleness refold failed for ${sourceCollection}:`, err);
		}
	}
}

/**
 * Target record deleted → drop the now-dangling `fks.<fkName>` snapshot from
 * every holder (mirrors refoldReverseFkSnapshots' matching, but unsets instead
 * of replacing).
 */
export async function nullifyReverseFkSnapshots(
	targetCollection: string,
	deletedId: unknown,
): Promise<void> {
	if (deletedId == null) return;

	const holders = await findReverseFkHolders(targetCollection);
	if (!Object.keys(holders).length) return;

	for (const [sourceCollection, fkNames] of Object.entries(holders)) {
		try {
			const Model = await getMongoModel(sourceCollection);
			for (const fkName of fkNames) {
				await Model.updateMany(
					{ [`fks.${fkName}.id`]: deletedId },
					{ $unset: { [`fks.${fkName}`]: '' } },
				);
			}
		} catch (err) {
			console.warn(`FK cascade nullify failed for ${sourceCollection}:`, err);
		}
	}
}
