/**
 * CollectionTools — MCP collection tool primitives, backed by DataService.
 *
 * Multi-tenant: every call routes through `getDbForCollection`, which resolves the
 * collection's `base` from `appscheme` and returns a Connection scoped to the right
 * DB (same routing as routes/data.ts). Never hardcode a DB name here.
 *
 * `create`/`update`/`delete` delegate to `DataService` — same schema validation,
 * domain hooks (FK checks, beforeDelete), soft-delete semantics and audit/broadcast
 * as the REST `/api/data/:table` routes ("write MCP ≡ write REST"). `find`/`find_one`/
 * `count` apply the same soft-delete-aware filter as REST `listRecords`/`getRecord`.
 */

import { getDbForCollection } from '../middleware/dbRouter.js';
import * as DataService from '../services/DataService.js';
import { activeRecordsFilter, type DataServiceContext } from '../services/DataService.js';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

/** Cap on the number of records a bulk update/delete can affect in one call. */
const BULK_OP_LIMIT = 1000;

function clampLimit(limit?: number): number {
	if (!limit || limit <= 0) return DEFAULT_LIMIT;
	return Math.min(limit, MAX_LIMIT);
}

export interface BulkOpResult {
	matchedCount: number;
	affectedCount: number;
	errors?: Array<{ id: string; error: string }>;
}

export interface FindOptions {
	limit?: number;
	skip?: number;
	sort?: Record<string, 1 | -1>;
	projection?: Record<string, 0 | 1>;
}

/** Find documents in a collection (capped result set), excluding soft-deleted records. */
export async function find(
	collection: string,
	query: Record<string, any> = {},
	opts: FindOptions = {}
): Promise<any[]> {
	const db = await getDbForCollection(collection);
	let cursor = db.collection(collection).find(activeRecordsFilter(query));
	if (opts.sort) cursor = cursor.sort(opts.sort);
	if (opts.skip && opts.skip > 0) cursor = cursor.skip(opts.skip);
	if (opts.projection) cursor = cursor.project(opts.projection);
	return cursor.limit(clampLimit(opts.limit)).toArray();
}

/** Distinct values of a field across documents matching a query, excluding soft-deleted records. */
export async function distinct(
	collection: string,
	field: string,
	query: Record<string, any> = {}
): Promise<any[]> {
	const db = await getDbForCollection(collection);
	return db.collection(collection).distinct(field, activeRecordsFilter(query));
}

/** Aggregation stages an MCP caller may use — no $out/$merge (writes), no $lookup/$unionWith/$graphLookup (cross-collection reads would bypass per-collection RBAC). */
const ALLOWED_AGGREGATE_STAGES = new Set([
	'$match', '$group', '$sort', '$limit', '$skip', '$project', '$count', '$unwind', '$addFields', '$bucket', '$sortByCount', '$facet',
]);

/** Validate an aggregation pipeline against the stage whitelist. Throws on violation. */
export function assertAggregateStages(pipeline: unknown): asserts pipeline is Record<string, any>[] {
	if (!Array.isArray(pipeline) || pipeline.length === 0) {
		throw new Error('aggregate refused: pipeline must be a non-empty array of stages');
	}
	for (const stage of pipeline) {
		const keys = Object.keys((stage ?? {}) as Record<string, unknown>);
		if (keys.length !== 1) {
			throw new Error('aggregate refused: each stage must contain exactly one operator');
		}
		if (!ALLOWED_AGGREGATE_STAGES.has(keys[0])) {
			throw new Error(
				`aggregate refused: stage '${keys[0]}' not allowed (allowed: ${[...ALLOWED_AGGREGATE_STAGES].join(', ')})`
			);
		}
	}
}

/**
 * Run a whitelisted aggregation pipeline. Soft-deleted records are excluded by
 * a prepended $match; the result is capped by an appended $limit.
 */
export async function aggregate(collection: string, pipeline: unknown): Promise<any[]> {
	assertAggregateStages(pipeline);
	const db = await getDbForCollection(collection);
	return db
		.collection(collection)
		.aggregate([{ $match: activeRecordsFilter() }, ...pipeline, { $limit: MAX_LIMIT }])
		.toArray();
}

/** Find one document in a collection, excluding soft-deleted records. */
export async function findOne(collection: string, query: Record<string, any> = {}): Promise<any | null> {
	const db = await getDbForCollection(collection);
	return db.collection(collection).findOne(activeRecordsFilter(query));
}

/** Count documents matching a query, excluding soft-deleted records. */
export async function count(collection: string, query: Record<string, any> = {}): Promise<number> {
	const db = await getDbForCollection(collection);
	return db.collection(collection).countDocuments(activeRecordsFilter(query));
}

/** Create a document in a collection via DataService (validation + hooks + audit/broadcast). */
export async function create(collection: string, data: Record<string, any>, ctx: DataServiceContext = {}): Promise<any> {
	return DataService.create(collection, data, ctx);
}

/**
 * Update documents matching a query via DataService (validation + hooks + audit/broadcast),
 * one record at a time. Refuses an empty query — an unbounded update would rewrite the
 * whole collection. Capped to BULK_OP_LIMIT matches per call.
 */
export async function update(
	collection: string,
	query: Record<string, any>,
	data: Record<string, any>,
	ctx: DataServiceContext = {}
): Promise<BulkOpResult> {
	if (!query || Object.keys(query).length === 0) {
		throw new Error('update refused: empty query would match the entire collection');
	}

	const db = await getDbForCollection(collection);
	const docs = await db
		.collection(collection)
		.find(activeRecordsFilter(query))
		.project({ _id: 1 })
		.limit(BULK_OP_LIMIT)
		.toArray();

	let affectedCount = 0;
	const errors: Array<{ id: string; error: string }> = [];

	for (const doc of docs) {
		const id = String(doc._id);
		try {
			await DataService.updateById(collection, id, data, ctx);
			affectedCount++;
		} catch (e) {
			errors.push({ id, error: (e as Error).message });
		}
	}

	return { matchedCount: docs.length, affectedCount, ...(errors.length ? { errors } : {}) };
}

/**
 * Delete documents matching a query via DataService (soft delete by default, hooks +
 * audit/broadcast), one record at a time. Refuses an empty query — an unbounded delete
 * would wipe the whole collection. Capped to BULK_OP_LIMIT matches per call.
 */
export async function deleteMany(
	collection: string,
	query: Record<string, any>,
	ctx: DataServiceContext = {},
	opts: { permanent?: boolean } = {}
): Promise<BulkOpResult> {
	if (!query || Object.keys(query).length === 0) {
		throw new Error('delete refused: empty query would wipe the entire collection');
	}

	const db = await getDbForCollection(collection);
	const docs = await db
		.collection(collection)
		.find(activeRecordsFilter(query))
		.project({ _id: 1 })
		.limit(BULK_OP_LIMIT)
		.toArray();

	let affectedCount = 0;
	const errors: Array<{ id: string; error: string }> = [];

	for (const doc of docs) {
		const id = String(doc._id);
		try {
			await DataService.removeById(collection, id, opts, ctx);
			affectedCount++;
		} catch (e) {
			errors.push({ id, error: (e as Error).message });
		}
	}

	return { matchedCount: docs.length, affectedCount, ...(errors.length ? { errors } : {}) };
}
