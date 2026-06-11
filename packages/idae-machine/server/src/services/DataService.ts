/**
 * DataService — transport-free DDD CRUD pipeline.
 *
 * Single source of truth for record CRUD: schema validation (validateAgainstScheme)
 * → domain validation (domainActions.validate) → blocking pre:* hooks (FK checks,
 * beforeDelete) → Mongoose write → post:* hooks (audit, broadcast, afterCreate/Update).
 *
 * `routes/data.ts` (REST) and `mcp/CollectionTools.ts` (MCP) are both thin adapters
 * over this service — "write MCP ≡ write REST".
 */

import { type SortOrder, Schema } from 'mongoose';
import { getDbForCollection } from '../middleware/dbRouter.js';
import { dispatch } from '../hooks/HooksRegistry.js';
import { getDomainActions } from '../models/domainActions.js';
import { validateAgainstScheme } from '../validation/SchemeValidator.js';
import type { UserContext } from '../middleware/permission.js';

export class BadRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'BadRequestError';
	}
}

export class ValidationError extends Error {
	errors: unknown;
	constructor(message: string, errors: unknown) {
		super(message);
		this.name = 'ValidationError';
		this.errors = errors;
	}
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class ConflictError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ConflictError';
	}
}

export interface DataServiceContext {
	user?: UserContext;
	audit?: { ipAddress?: string; userAgent?: string };
}

export interface ListOptions {
	page?: number;
	limit?: number;
	skip?: number;
	sort?: Record<string, SortOrder>;
	filters?: Record<string, unknown>;
}

export interface ListResult {
	data: any[];
	meta: { total: number; page: number; limit: number; pages: number };
}

/** Validate table name to prevent NoSQL injection. */
export function validateTableName(table: string): boolean {
	return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(table);
}

/** Get collection model from the correct DB via multi-DB routing. */
async function getCollectionModel(table: string) {
	const db = await getDbForCollection(table);
	const schema = new Schema({}, { strict: false, timestamps: true, collection: table.toLowerCase() });
	const modelName = `${db.name}__${table}`;
	return db.models[modelName] ?? db.model(modelName, schema, table.toLowerCase());
}

/**
 * Build query filter that excludes soft-deleted records.
 * Uses $and to avoid collision with existing $or in customFilters.
 */
export function activeRecordsFilter(customFilters: Record<string, unknown> = {}): Record<string, unknown> {
	const softDeleteFilter = { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] };
	if (Object.keys(customFilters).length === 0) return softDeleteFilter;
	return { $and: [customFilters, softDeleteFilter] };
}

function requireValidTable(table: string): void {
	if (!validateTableName(table)) throw new BadRequestError('Invalid table name');
}

/** List records with pagination/sort/filters, excluding soft-deleted records. */
export async function list(table: string, opts: ListOptions = {}): Promise<ListResult> {
	requireValidTable(table);

	const Model = await getCollectionModel(table);
	const { page = 1, limit = 20, skip = 0, sort, filters = {} } = opts;
	const activeFilters = activeRecordsFilter(filters);

	const total = await Model.countDocuments(activeFilters as Record<string, unknown>);

	const query = Model.find(activeFilters as Record<string, unknown>).sort(sort).skip(skip);
	if (limit > 0) query.limit(limit);
	const data = await query.lean();

	return {
		data,
		meta: { total, page, limit, pages: Math.ceil(total / limit) },
	};
}

/** Get a single non-deleted record by id. Throws NotFoundError if missing or soft-deleted. */
export async function getById(table: string, id: string): Promise<any> {
	requireValidTable(table);

	const Model = await getCollectionModel(table);
	const record = await Model.findById(id).lean();

	if (!record || (record as any).deletedAt) {
		throw new NotFoundError(`Record '${id}' not found in '${table}'`);
	}

	return record;
}

/**
 * Create a record: schema validation → domain validation → pre:create (FK checks)
 * → write → post:create (audit/broadcast/afterCreate).
 */
export async function create(table: string, data: Record<string, unknown>, ctx: DataServiceContext = {}): Promise<any> {
	requireValidTable(table);

	const Model = await getCollectionModel(table);

	const schemeResult = await validateAgainstScheme(table, data);
	if (!schemeResult.valid) throw new ValidationError('Validation failed', schemeResult.errors);

	const domainActions = getDomainActions(table);
	if (domainActions?.validate) {
		const result = domainActions.validate(data, table);
		if (!result.valid) throw new ValidationError('Validation failed', result.errors);
	}

	try {
		await dispatch('pre:create', {
			event:      'pre:create',
			collection: table,
			data,
			user:       ctx.user,
			req:        ctx.audit ?? {},
		});
	} catch (err: unknown) {
		const e = err as any;
		if (e?.fkErrors) throw new ValidationError(e.message, e.fkErrors);
		throw err;
	}

	const record = await Model.create(data);

	await dispatch('post:create', {
		event:      'post:create',
		collection: table,
		data:       record,
		user:       ctx.user,
		req:        ctx.audit ?? {},
	});

	return record;
}

/**
 * Update a record by id: schema validation → domain validation → pre:update (FK checks)
 * → write → post:update (audit/broadcast/afterUpdate). Throws NotFoundError if missing.
 */
export async function updateById(
	table: string,
	id: string,
	data: Record<string, unknown>,
	ctx: DataServiceContext = {}
): Promise<any> {
	requireValidTable(table);

	const Model = await getCollectionModel(table);

	const schemeResult = await validateAgainstScheme(table, data);
	if (!schemeResult.valid) throw new ValidationError('Validation failed', schemeResult.errors);

	const domainActions = getDomainActions(table);
	if (domainActions?.validate) {
		const result = domainActions.validate(data, table);
		if (!result.valid) throw new ValidationError('Validation failed', result.errors);
	}

	try {
		await dispatch('pre:update', {
			event:      'pre:update',
			collection: table,
			recordId:   id,
			data,
			user:       ctx.user,
			req:        ctx.audit ?? {},
		});
	} catch (err: unknown) {
		const e = err as any;
		if (e?.fkErrors) throw new ValidationError(e.message, e.fkErrors);
		throw err;
	}

	const record = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();

	if (!record) throw new NotFoundError(`Record '${id}' not found in '${table}'`);

	await dispatch('post:update', {
		event:      'post:update',
		collection: table,
		recordId:   id,
		data:       record,
		user:       ctx.user,
		req:        ctx.audit ?? {},
	});

	return record;
}

/**
 * Remove a record by id. Soft delete by default (sets `deletedAt`); pass
 * `{ permanent: true }` for hard delete. Throws NotFoundError if missing,
 * ConflictError if pre:delete hooks (beforeDelete) refuse the deletion.
 */
export async function removeById(
	table: string,
	id: string,
	opts: { permanent?: boolean } = {},
	ctx: DataServiceContext = {}
): Promise<any> {
	requireValidTable(table);

	const Model = await getCollectionModel(table);
	const permanent = opts.permanent === true;

	try {
		await dispatch('pre:delete', {
			event:      'pre:delete',
			collection: table,
			recordId:   id,
			user:       ctx.user,
			req:        ctx.audit ?? {},
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Deletion not allowed';
		throw new ConflictError(message);
	}

	if (permanent) {
		const record = await Model.findByIdAndDelete(id).lean();
		if (!record) throw new NotFoundError(`Record '${id}' not found in '${table}'`);

		await dispatch('post:delete', {
			event:      'post:delete',
			collection: table,
			recordId:   id,
			data:       record,
			details:    { permanent: true },
			user:       ctx.user,
			req:        ctx.audit ?? {},
		});

		return record;
	}

	const record = await Model.findByIdAndUpdate(id, { deletedAt: new Date().toISOString() }, { new: true }).lean();
	if (!record) throw new NotFoundError(`Record '${id}' not found in '${table}'`);

	await dispatch('post:delete', {
		event:      'post:delete',
		collection: table,
		recordId:   id,
		data:       record,
		details:    { permanent: false },
		user:       ctx.user,
		req:        ctx.audit ?? {},
	});

	return record;
}

/**
 * Restore a soft-deleted record. Throws NotFoundError if missing, ConflictError
 * if the record is not currently soft-deleted.
 */
export async function restoreById(table: string, id: string, ctx: DataServiceContext = {}): Promise<any> {
	requireValidTable(table);

	const Model = await getCollectionModel(table);

	const existing = await Model.findById(id).lean();
	if (!existing) throw new NotFoundError(`Record '${id}' not found in '${table}'`);
	if (!(existing as any).deletedAt) throw new ConflictError(`Record '${id}' is not deleted`);

	const record = await Model.findByIdAndUpdate(id, { $unset: { deletedAt: '' } }, { new: true }).lean();

	await dispatch('post:restore', {
		event:      'post:restore',
		collection: table,
		recordId:   id,
		data:       record,
		user:       ctx.user,
		req:        ctx.audit ?? {},
	});

	return record;
}
