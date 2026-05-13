import mongoose from 'mongoose';
import { config } from '../config.js';

const baseCache = new Map<string, string>();

/**
 * Lookup which base a collection belongs to, then return a mongoose db scoped to that base.
 * Result: `{org}_{base}` DB via useDb(), with connection reuse.
 *
 * Falls back to `{org}_machine_base` if collection not found in appscheme.
 */
export async function getDbForCollection(
	collectionName: string
): Promise<ReturnType<typeof mongoose.connection.useDb>> {
	let base = baseCache.get(collectionName);

	if (!base) {
		const metaDb  = mongoose.connection.useDb(`${config.org}_machine_app`, { useCache: true });
		const scheme  = await metaDb.collection('appscheme').findOne({ code: collectionName });
		base          = (scheme?.base as string | undefined) ?? 'machine_base';
		baseCache.set(collectionName, base);
	}

	const dbName = `${config.org}_${base}`;
	return mongoose.connection.useDb(dbName, { useCache: true });
}
