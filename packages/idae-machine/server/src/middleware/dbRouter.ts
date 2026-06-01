import { mongooseConnectionManager } from '@medyll/idae-api';
import type { Connection } from 'mongoose';
import { config } from '../config.js';

const baseCache = new Map<string, string>();

function cacheKey(org: string, collectionName: string): string {
	return `${org}:${collectionName}`;
}

export async function getConn(dbName: string): Promise<Connection> {
	return mongooseConnectionManager.getConnection(dbName)
		?? await mongooseConnectionManager.createConnection(config.mongodbUri, dbName, { dbName });
}

/**
 * Lookup which base a collection belongs to, then return a Connection scoped to that base.
 * Throws if the collection is not registered in appscheme — no silent fallback.
 */
export async function getDbForCollection(collectionName: string): Promise<Connection> {
	const key = cacheKey(config.org, collectionName);
	let base = baseCache.get(key);

	if (!base) {
		const metaConn = await getConn(`${config.org}_machine_app`);
		const scheme   = await metaConn.collection('appscheme').findOne({ code: collectionName });

		if (!scheme?.base) {
			throw new Error(
				`Collection '${collectionName}' not found in appscheme or missing 'base' field. Run seed first.`
			);
		}

		base = scheme.base as string;
		baseCache.set(key, base);
	}

	return getConn(`${config.org}_${base}`);
}

/** Invalidate cache entry — call after seed updates appscheme. */
export function invalidateBaseCache(collectionName?: string): void {
	if (collectionName) baseCache.delete(cacheKey(config.org, collectionName));
	else {
		for (const key of baseCache.keys()) {
			if (key.startsWith(`${config.org}:`)) baseCache.delete(key);
		}
	}
}
