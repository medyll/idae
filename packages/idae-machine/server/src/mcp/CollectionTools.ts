/**
 * CollectionTools — imperative CRUD primitives backing the MCP collection tools.
 *
 * Multi-tenant: every call routes through `getDbForCollection`, which resolves the
 * collection's `base` from `appscheme` and returns a Connection scoped to the right
 * DB (same routing as routes/data.ts). Never hardcode a DB name here.
 */

import { getDbForCollection } from '../middleware/dbRouter.js';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

function clampLimit(limit?: number): number {
	if (!limit || limit <= 0) return DEFAULT_LIMIT;
	return Math.min(limit, MAX_LIMIT);
}

/** Find documents in a collection (capped result set). */
export async function find(
	collection: string,
	query: Record<string, any> = {},
	limit?: number
): Promise<any[]> {
	const db = await getDbForCollection(collection);
	return db.collection(collection).find(query).limit(clampLimit(limit)).toArray();
}

/** Find one document in a collection. */
export async function findOne(collection: string, query: Record<string, any> = {}): Promise<any | null> {
	const db = await getDbForCollection(collection);
	return db.collection(collection).findOne(query);
}

/** Create a document in a collection. */
export async function create(collection: string, data: Record<string, any>): Promise<any> {
	const db = await getDbForCollection(collection);
	return db.collection(collection).insertOne(data);
}

/**
 * Update documents in a collection.
 * Refuses an empty query — an unbounded $set would rewrite the whole collection.
 */
export async function update(
	collection: string,
	query: Record<string, any>,
	data: Record<string, any>
): Promise<any> {
	if (!query || Object.keys(query).length === 0) {
		throw new Error('update refused: empty query would match the entire collection');
	}
	const db = await getDbForCollection(collection);
	return db.collection(collection).updateMany(query, { $set: data });
}

/**
 * Delete documents from a collection.
 * Refuses an empty query — an unbounded delete would wipe the whole collection.
 */
export async function deleteMany(collection: string, query: Record<string, any>): Promise<any> {
	if (!query || Object.keys(query).length === 0) {
		throw new Error('delete refused: empty query would wipe the entire collection');
	}
	const db = await getDbForCollection(collection);
	return db.collection(collection).deleteMany(query);
}

/** Count documents in a collection. */
export async function count(collection: string, query: Record<string, any> = {}): Promise<number> {
	const db = await getDbForCollection(collection);
	return db.collection(collection).countDocuments(query);
}
