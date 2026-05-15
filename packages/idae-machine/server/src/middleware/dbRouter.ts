import { mongooseConnectionManager } from '@medyll/idae-api';
import type { Connection } from 'mongoose';
import { config } from '../config.js';

const baseCache = new Map<string, string>();

export async function getConn(dbName: string): Promise<Connection> {
	return mongooseConnectionManager.getConnection(dbName)
		?? await mongooseConnectionManager.createConnection(config.mongodbUri, dbName);
}

/**
 * Lookup which base a collection belongs to, then return a Connection scoped to that base.
 * Throws if the collection is not registered in appscheme — no silent fallback.
 */
export async function getDbForCollection(collectionName: string): Promise<Connection> {
	let base = baseCache.get(collectionName);

	if (!base) {
		const metaConn = await getConn(`${config.org}_machine_app`);
		const scheme   = await metaConn.collection('appscheme').findOne({ code: collectionName });

		if (!scheme?.base) {
			throw new Error(
				`Collection '${collectionName}' not found in appscheme or missing 'base' field. Run seed first.`
			);
		}

		base = scheme.base as string;
		baseCache.set(collectionName, base);
	}

	return getConn(`${config.org}_${base}`);
}

/** Invalidate cache entry — call after seed updates appscheme. */
export function invalidateBaseCache(collectionName?: string): void {
	if (collectionName) baseCache.delete(collectionName);
	else baseCache.clear();
}
