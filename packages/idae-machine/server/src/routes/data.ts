import { type FilterQuery, type SortOrder, Schema } from 'mongoose';
import { idaeApi } from '@medyll/idae-api';
import type { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { requireDroit, type Permission } from '../middleware/permission.js';
import { broadcastToTable } from '../socket/index.js';
import { getDbForCollection } from '../middleware/dbRouter.js';
import { logAudit, extractAuditContext } from '../services/AuditService.js';
import { getDomainActions } from '../models/domainActions.js';

/**
 * Validate table name to prevent NoSQL injection
 */
function validateTableName(table: string): boolean {
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
 * Parse pagination params
 */
function parsePagination(req: Request): { page: number; limit: number; skip: number } {
	const page = Math.max(1, parseInt(req.query.page as string) || 1);
	const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
	const skip = (page - 1) * limit;

	return { page, limit, skip };
}

/**
 * Parse sorting params
 */
function parseSorting(req: Request): Record<string, SortOrder> | undefined {
	const sort = req.query.sort as string;
	const order = req.query.order as string;

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

	// Parse filter[field]=value format
	if (req.query.filter && typeof req.query.filter === 'object') {
		for (const [key, value] of Object.entries(req.query.filter)) {
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

		// Get paginated data
		const data = await Model.find(activeFilters as FilterQuery<any>)
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.lean();

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

		// Domain validation
		const domainActions = getDomainActions(table);
		if (domainActions?.validate) {
			const result = domainActions.validate(req.body, table);
			if (!result.valid) {
				res.status(422).json({ error: 'Validation failed', errors: result.errors });
				return;
			}
		}

		const record = await Model.create(req.body);

		// Broadcast to table room
		broadcastToTable(table, 'data:created', record);

		// Domain afterCreate hook (fire-and-forget)
		if (domainActions?.afterCreate) {
			void domainActions.afterCreate(record, table).catch(err =>
				logger.error('afterCreate hook failed:', err)
			);
		}

		// Audit trail
		const auditCtx = extractAuditContext(req);
		logAudit({
			action: 'create',
			userId: req.user?.userId,
			login: req.user?.login,
			resourceType: table,
			resourceId: String(record._id),
			status: 'success',
			...auditCtx
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

		// Domain validation
		const domainActions = getDomainActions(table);
		if (domainActions?.validate) {
			const result = domainActions.validate(req.body, table);
			if (!result.valid) {
				res.status(422).json({ error: 'Validation failed', errors: result.errors });
				return;
			}
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

		// Broadcast to table room
		broadcastToTable(table, 'data:updated', { id, record });
		if (domainActions?.afterUpdate) {
			void domainActions.afterUpdate(record, table).catch(err =>
				logger.error('afterUpdate hook failed:', err)
			);
		}

		// Audit trail
		const auditCtx = extractAuditContext(req);
		logAudit({
			action: 'update',
			userId: req.user?.userId,
			login: req.user?.login,
			resourceType: table,
			resourceId: id,
			status: 'success',
			details: { fields: Object.keys(req.body) },
			...auditCtx
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
		const auditCtx = extractAuditContext(req);
		const domainActions = getDomainActions(table);

		// Domain beforeDelete hook (blocking — can veto deletion)
		if (domainActions?.beforeDelete) {
			try {
				await domainActions.beforeDelete(id, table);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Deletion not allowed';
				res.status(409).json({ error: message });
				return;
			}
		}

		if (permanent) {
			// Hard delete — permanent removal
			const record = await Model.findByIdAndDelete(id).lean();
			if (!record) {
				res.status(404).json({ error: `Record '${id}' not found in '${table}'` });
				return;
			}
			broadcastToTable(table, 'data:deleted', { id });

			// Audit trail
			logAudit({
				action: 'delete',
				userId: req.user?.userId,
				login: req.user?.login,
				resourceType: table,
				resourceId: id,
				status: 'success',
				details: { permanent: true },
				...auditCtx
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

			// Broadcast to table room
			broadcastToTable(table, 'data:deleted', { id });

			// Audit trail
			logAudit({
				action: 'delete',
				userId: req.user?.userId,
				login: req.user?.login,
				resourceType: table,
				resourceId: id,
				status: 'success',
				details: { permanent: false },
				...auditCtx
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

		// Broadcast to table room
		broadcastToTable(table, 'data:restored', { id });

		// Audit trail
		const auditCtx = extractAuditContext(req);
		logAudit({
			action: 'update',
			userId: req.user?.userId,
			login: req.user?.login,
			resourceType: table,
			resourceId: id,
			status: 'success',
			details: { action: 'restore' },
			...auditCtx
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
	idaeApi.router.addRoute({
		method: 'get',
		path: '/api/data/:table',
		handler: listRecords,
		middleware: [requireDroit('L')]
	});

	idaeApi.router.addRoute({
		method: 'get',
		path: '/api/data/:table/:id',
		handler: getRecord,
		middleware: [requireDroit('R')]
	});

	idaeApi.router.addRoute({
		method: 'post',
		path: '/api/data/:table',
		handler: createRecord,
		middleware: [requireDroit('C')]
	});

	idaeApi.router.addRoute({
		method: 'put',
		path: '/api/data/:table/:id',
		handler: updateRecord,
		middleware: [requireDroit('U')]
	});

	idaeApi.router.addRoute({
		method: 'delete',
		path: '/api/data/:table/:id',
		handler: deleteRecord,
		middleware: [requireDroit('D')]
	});

	idaeApi.router.addRoute({
		method: 'patch',
		path: '/api/data/:table/:id/restore',
		handler: restoreRecord,
		middleware: [requireDroit('U')]
	});

	logger.info('Data routes registered: CRUD endpoints for /api/data/:table');
}
