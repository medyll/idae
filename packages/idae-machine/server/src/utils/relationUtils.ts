/**
 * Server-side utility for reading FK relations from appscheme records.
 * Replaces reading from model[col].fks (which will be removed).
 */
import type { Db } from 'mongodb';
import type { FkRelations } from '../../../src/lib/types/machine-model.js';

/**
 * Get FK relations for a collection from the appscheme record (source of truth).
 * Server-side implementation using direct DB query.
 */
export async function getCollectionRelations(
	metaConn: Db,
	collection: string
): Promise<FkRelations | null> {
	const appschemeDoc = await metaConn.collection('appscheme').findOne(
		{ code: collection },
		{ projection: { fkRelations: 1 } }
	);
	return appschemeDoc?.fkRelations ?? null;
}