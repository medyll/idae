import { type FilterQuery, type SortOrder, Schema } from 'mongoose';
import { idaeApi } from '@medyll/idae-api';
import type { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { requireDroit, type Permission } from '../middleware/permission.js';
import { getDbForCollection } from '../middleware/dbRouter.js';
import { dispatch } from '../hooks/HooksRegistry.js';
import { extractAuditContext } from '../services/AuditService.js';
import { getDomainActions } from '../models/domainActions.js';
import { validateAgainstScheme } from '../validation/SchemeValidator.js';

/**
 * Validate table name to prevent NoSQL injection
 */
export function validateTableName(table: string): boolean {
	// Only allow alphanumeric and underscore
	return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(table);
}

/**
 * Get collection from the correct DB via multi-DB routing.
 */
async function getCollectionModel(table: string) {
	const db     = await getDbForCollection(table);
	const schema = new Schema({}, { strict: false, timestamps: true, collection: table.toLowerCase() });
	const modelName = `${db.name}__${table}`;
	return db.models[modelName] ?? db.model(modelName, schema, table.toLowerCase());
}

/**
 * Decode idae-api's encoded params envelope: ?encoded=true&params=<urlencoded JSON>.
 * Returns a flat record merging top-level req.query with decoded params (params win).
 */
function decodeQuery(req: Request): Record<string, unknown> {
	const merged: Record<string, unknown> = { ...(req.query as Record<string, unknown>) };
	const raw = req.query.params;
	if (raw == null) return merged;
	try {
		let decoded: unknown = raw;
		if (typeof raw === 'string') {
			const dec = decodeURIComponent(raw);
			decoded = JSON.parse(dec);
		}
		if (decoded && typeof decoded === 'object') {
			Object.assign(merged, decoded as Record<string, unknown>);
		}
	} catch {
		/* malformed envelope — fall back to top-level query */
	}
	return merged;
}

/**
 * Parse pagination params
 */
function parsePagination(req: Request): { page: number; limit: number; skip: number } {
	const q = decodeQuery(req);
	const rawLimit = parseInt(q.limit as string);
	if (rawLimit === 0) return { page: 1, limit: 0, skip: 0 };
	const page = Math.max(1, parseInt(q.page as string) || 1);
	const limit = Math.min(1000, Math.max(1, rawLimit || 20));
	const skip = (page - 1) * limit;

	return { page, limit, skip };
}

/**
 * Parse sorting params
 */
function parseSorting(req: Request): Record<string, SortOrder> | undefined {
	const q = decodeQuery(req);
	const sort = q.sort as string;
	const order = q.order as string;

	if (!sort) return undefined;
	if (!validateTableName(sort)) return undefined;

	const sortOrder: SortOrder = order?.toLowerCase() === 'desc' ? -1 : 1;
	return { [sort]: sortOrder };
}

/**
 * Parse filter params
 */
function parseFilters(req: Request): Record<string, unknown> {
	const filters: Record<string, unknown> = {};
	const q = decodeQuery(req);

	// Parse filter[field]=value format
	if (q.filter && typeof q.filter === 'object') {
		for (const [key, value] of Object.entries(q.filter as Record<string, unknown>)) {
			if (validateTableName(key)) {
				filters[key] = value;
			}
		}
	}

	return filters;
}

/**
 * Build query filter that excludes soft-deleted records.
 * Uses $and to avoid collision with existing $or in customFilters.
 */
function activeRecordsFilter(customFilters: Record<string, unknown> = {}): Record<string, unknown> {
	const softDeleteFilter = { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] };
	if (Object.keys(customFilters).length === 0) return softDeleteFilter;
	return { $and: [customFilters, softDeleteFilter] };
}

/**
 * Get list of records with pagination
 * GET /api/data/:table
 */
export async function listRecords(req: Request, res: Response): Promise<void> {
	try {
		const { table } = req.params;

		if (!validateTableName(table)) {
			res.status(400).json({ error: 'Invalid table name' });
			return;
		}

		const Model = await getCollectionModel(table);
		const { page, limit, skip } = parsePagination(req);
		const sort = parseSorting(req);
		const filters = parseFilters(req);

		// Exclude soft-deleted records
		const activeFilters = activeRecordsFilter(filters);

		// Get total count
		const total = await Model.countDocuments(activeFilters as FilterQuery<any>);

		// Get paginated data — limit=0 means no limit (used by sync)
		const query = Model.find(activeFilters as FilterQuery<any>).sort(sort).skip(skip);
		if (limit > 0) query.limit(limit);
		const data = await query.lean();

		res.json({
			data,
			meta: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		logger.error('Error listing records:', error);
		res.status(500).json({ error: 'Failed to list records' });
	}
}

/**
 * Get single record by ID
 * GET /api/data/:table/:id
 */
export async function getRecord(req: Request, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;

		if (!validateTableName(table)) {
			res.status(400).json({ error: 'Invalid table name' });
			return;
		}

		const Model = await getCollectionModel(table);
		const record = await Model.findById(id).lean();

		if (!record) {
			res.status(404).json({ error: `Record '${id}' not found in '${table}'` });
			return;
		}

		// Check if soft-deleted
		if ((record as any).deletedAt) {
			res.status(404).json({ error: `Record '${id}' not found in '${table}'` });
			return;
		}

		res.json(record);
	} catch (error) {
		logger.error('Error getting record:', error);
		res.status(500).json({ error: 'Failed to get record' });
	}
}

/**
 * Create new record with broadcast
 * POST /api/data/:table
 */
export async function createRecord(req: Request, res: Response): Promise<void> {
	try {
		const { table } = req.params;

		if (!validateTableName(table)) {
			res.status(400).json({ error: 'Invalid table name' });
			return;
		}

		const Model = await getCollectionModel(table);

		// 1. Generic schema validation from appscheme
		const schemeResult = await validateAgainstScheme(table, req.body);
		if (!schemeResult.valid) {
			res.status(422).json({ error: 'Validation failed', errors: schemeResult.errors });
			return;
		}

		// 2. Domain custom validation (extension/override)
		const domainActions = getDomainActions(table);
		if (domainActions?.validate) {
			const result = domainActions.validate(req.body, table);
			if (!result.valid) {
				res.status(422).json({ error: 'Validation failed', errors: result.errors });
				return;
			}
		}

		// 3. Pre:create hooks (FK validation — blocking)
		try {
			await dispatch('pre:create', {
				event:      'pre:create',
				collection: table,
				data:       req.body,
				user:       req.user,
				req:        extractAuditContext(req),
			});
		} catch (err: unknown) {
			const e = err as any;
			if (e?.fkErrors) {
				res.status(422).json({ error: e.message, errors: e.fkErrors });
				return;
			}
			throw err;
		}

		const record = await Model.create(req.body);

		// Dispatch post:create hooks (audit, broadcast, domainActions)
		await dispatch('post:create', {
			event:      'post:create',
			collection: table,
			data:       record,
			user:       req.user,
			req:        extractAuditContext(req),
		});

		res.status(201).json(record);
	} catch (error) {
		logger.error('Error creating record:', error);
		res.status(500).json({ error: 'Failed to create record' });
	}
}

/**
 * Update existing record with broadcast
 * PUT /api/data/:table/:id
 */
export async function updateRecord(req: Request, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;

		if (!validateTableName(table)) {
			res.status(400).json({ error: 'Invalid table name' });
			return;
		}

		const Model = await getCollectionModel(table);

		// 1. Generic schema validation from appscheme
		const schemeResult = await validateAgainstScheme(table, req.body);
		if (!schemeResult.valid) {
			res.status(422).json({ error: 'Validation failed', errors: schemeResult.errors });
			return;
		}

		// 2. Domain custom validation (extension/override)
		const domainActions = getDomainActions(table);
		if (domainActions?.validate) {
			const result = domainActions.validate(req.body, table);
			if (!result.valid) {
				res.status(422).json({ error: 'Validation failed', errors: result.errors });
				return;
			}
		}

		// 3. Pre:update hooks (FK validation — blocking)
		try {
			await dispatch('pre:update', {
				event:      'pre:update',
				collection: table,
				recordId:   id,
				data:       req.body,
				user:       req.user,
				req:        extractAuditContext(req),
			});
		} catch (err: unknown) {
			const e = err as any;
			if (e?.fkErrors) {
				res.status(422).json({ error: e.message, errors: e.fkErrors });
				return;
			}
			throw err;
		}

		const record = await Model.findByIdAndUpdate(
			id,
			req.body,
			{ new: true, runValidators: true }
		).lean();

		if (!record) {
			res.status(404).json({ error: `Record '${id}' not found in '${table}'` });
			return;
		}

		// Dispatch post:update hooks (audit, broadcast, domainActions)
		await dispatch('post:update', {
			event:      'post:update',
			collection: table,
			recordId:   id,
			data:       record,
			user:       req.user,
			req:        extractAuditContext(req),
		});

		res.json(record);
	} catch (error) {
		logger.error('Error updating record:', error);
		res.status(500).json({ error: 'Failed to update record' });
	}
}

/**
 * Delete record with broadcast
 * DELETE /api/data/:table/:id
 * Soft delete by default, permanent with ?permanent=true
 */
export async function deleteRecord(req: Request, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;

		if (!validateTableName(table)) {
			res.status(400).json({ error: 'Invalid table name' });
			return;
		}

		const Model = await getCollectionModel(table);
		const permanent = req.query.permanent === 'true';

		// Dispatch pre:delete hooks (domainActions.beforeDelete — blocking)
		try {
			await dispatch('pre:delete', {
				event:      'pre:delete',
				collection: table,
				recordId:   id,
				user:       req.user,
				req:        extractAuditContext(req),
			});
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Deletion not allowed';
			res.status(409).json({ error: message });
			return;
		}

		if (permanent) {
			// Hard delete — permanent removal
			const record = await Model.findByIdAndDelete(id).lean();
			if (!record) {
				res.status(404).json({ error: `Record '${id}' not found in '${table}'` });
				return;
			}

			// Dispatch post:delete hooks (audit, broadcast)
			await dispatch('post:delete', {
				event:      'post:delete',
				collection: table,
				recordId:   id,
				data:       record,
				details:    { permanent: true },
				user:       req.user,
				req:        extractAuditContext(req),
			});

			res.status(204).send();
		} else {
			// Soft delete — set deletedAt timestamp
			const record = await Model.findByIdAndUpdate(
				id,
				{ deletedAt: new Date().toISOString() },
				{ new: true }
			).lean();

			if (!record) {
				res.status(404).json({ error: `Record '${id}' not found in '${table}'` });
				return;
			}

			// Dispatch post:delete hooks (audit, broadcast)
			await dispatch('post:delete', {
				event:      'post:delete',
				collection: table,
				recordId:   id,
				data:       record,
				details:    { permanent: false },
				user:       req.user,
				req:        extractAuditContext(req),
			});

			res.status(204).send();
		}
	} catch (error) {
		logger.error('Error deleting record:', error);
		res.status(500).json({ error: 'Failed to delete record' });
	}
}

/**
 * Restore a soft-deleted record
 * PATCH /api/data/:table/:id/restore
 */
export async function restoreRecord(req: Request, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;

		if (!validateTableName(table)) {
			res.status(400).json({ error: 'Invalid table name' });
			return;
		}

		const Model = await getCollectionModel(table);

		// Only restore actually soft-deleted records
		const existing = await Model.findById(id).lean();
		if (!existing) {
			res.status(404).json({ error: `Record '${id}' not found in '${table}'` });
			return;
		}
		if (!(existing as any).deletedAt) {
			res.status(409).json({ error: `Record '${id}' is not deleted` });
			return;
		}

		const record = await Model.findByIdAndUpdate(
			id,
			{ $unset: { deletedAt: '' } },
			{ new: true }
		).lean();

		// Dispatch post:restore hooks (broadcast, audit)
		await dispatch('post:restore', {
			event:      'post:restore',
			collection: table,
			recordId:   id,
			data:       record,
			user:       req.user,
			req:        extractAuditContext(req),
		});

		res.json(record);
	} catch (error) {
		logger.error('Error restoring record:', error);
		res.status(500).json({ error: 'Failed to restore record' });
	}
}

/**
 * Register data routes with permission middleware
 */
export function registerDataRoutes(): void {
	// Data routes use Mongoose directly — bypass idae-api's handleRequest wrapper
	// (which expects IdaeDbAdapter signature) and register on Express app directly.
	const app = idaeApi.app;
	app.get('/api/data/:table',            requireDroit('L'), listRecords);
	app.get('/api/data/:table/:id',        requireDroit('R'), getRecord);
	app.post('/api/data/:table',           requireDroit('C'), createRecord);
	app.put('/api/data/:table/:id',        requireDroit('U'), updateRecord);
	app.delete('/api/data/:table/:id',     requireDroit('D'), deleteRecord);
	app.patch('/api/data/:table/:id/restore', requireDroit('U'), restoreRecord);

	logger.info('Data routes registered: CRUD endpoints for /api/data/:table');
}
