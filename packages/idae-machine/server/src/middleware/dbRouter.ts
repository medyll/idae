import { mongooseConnectionManager } from '@medyll/idae-api';
import type { Connection } from 'mongoose';
import { config } from '../config.js';

const baseCache = new Map<string, string>();

async function getConn(dbName: string): Promise<Connection> {
	return mongooseConnectionManager.getConnection(dbName)
		?? await mongooseConnectionManager.createConnection(config.mongodbUri, dbName);
}

/**
 * Lookup which base a collection belongs to, then return a Connection scoped to that base.
 * Falls back to `{org}_machine_base` if collection not found in appscheme.
 */
export async function getDbForCollection(collectionName: string): Promise<Connection> {
	let base = baseCache.get(collectionName);

	if (!base) {
		const metaConn = await getConn(`${config.org}_machine_app`);
		const scheme   = await metaConn.collection('appscheme').findOne({ code: collectionName });
		base           = (scheme?.base as string | undefined) ?? 'machine_base';
		baseCache.set(collectionName, base);
	}

	return getConn(`${config.org}_${base}`);
}
