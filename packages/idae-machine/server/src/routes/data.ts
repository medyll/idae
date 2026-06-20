import { type SortOrder } from 'mongoose';
import { idaeApi } from '@medyll/idae-api';
import type { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { requireDroit } from '../middleware/permission.js';
import { extractAuditContext } from '../services/AuditService.js';
import * as DataService from '../services/DataService.js';
import { BadRequestError, ValidationError, NotFoundError, ConflictError } from '../services/DataService.js';

export { validateTableName } from '../services/DataService.js';
import { validateTableName } from '../services/DataService.js';

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

/** Map a DataService error to an HTTP response. Returns true if handled. */
function handleServiceError(err: unknown, res: Response): boolean {
	if (err instanceof BadRequestError) {
		res.status(400).json({ error: err.message });
		return true;
	}
	if (err instanceof ValidationError) {
		res.status(422).json({ error: err.message, errors: err.errors });
		return true;
	}
	if (err instanceof NotFoundError) {
		res.status(404).json({ error: err.message });
		return true;
	}
	if (err instanceof ConflictError) {
		res.status(409).json({ error: err.message });
		return true;
	}
	return false;
}

/**
 * Get list of records with pagination
 * GET /api/data/:table
 */
export async function listRecords(req: Request<{ table: string }>, res: Response): Promise<void> {
	try {
		const { table } = req.params;
		const { page, limit, skip } = parsePagination(req);
		const sort = parseSorting(req);
		const filters = parseFilters(req);

		const result = await DataService.list(table, { page, limit, skip, sort, filters });
		res.json(result);
	} catch (error) {
		if (handleServiceError(error, res)) return;
		logger.error('Error listing records:', error);
		res.status(500).json({ error: 'Failed to list records' });
	}
}

/**
 * Get single record by ID
 * GET /api/data/:table/:id
 */
export async function getRecord(req: Request<{ table: string; id: string }>, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;
		const record = await DataService.getById(table, id);
		res.json(record);
	} catch (error) {
		if (handleServiceError(error, res)) return;
		logger.error('Error getting record:', error);
		res.status(500).json({ error: 'Failed to get record' });
	}
}

/**
 * Create new record with broadcast
 * POST /api/data/:table
 */
export async function createRecord(req: Request<{ table: string }>, res: Response): Promise<void> {
	try {
		const { table } = req.params;
		const record = await DataService.create(table, req.body, { user: req.user, audit: extractAuditContext(req) });
		res.status(201).json(record);
	} catch (error) {
		if (handleServiceError(error, res)) return;
		logger.error('Error creating record:', error);
		res.status(500).json({ error: 'Failed to create record' });
	}
}

/**
 * Update existing record with broadcast
 * PUT /api/data/:table/:id
 */
export async function updateRecord(req: Request<{ table: string; id: string }>, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;
		const record = await DataService.updateById(table, id, req.body, { user: req.user, audit: extractAuditContext(req) });
		res.json(record);
	} catch (error) {
		if (handleServiceError(error, res)) return;
		logger.error('Error updating record:', error);
		res.status(500).json({ error: 'Failed to update record' });
	}
}

/**
 * Delete record with broadcast
 * DELETE /api/data/:table/:id
 * Soft delete by default, permanent with ?permanent=true
 */
export async function deleteRecord(req: Request<{ table: string; id: string }>, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;
		const permanent = req.query.permanent === 'true';
		await DataService.removeById(table, id, { permanent }, { user: req.user, audit: extractAuditContext(req) });
		res.status(204).send();
	} catch (error) {
		if (handleServiceError(error, res)) return;
		logger.error('Error deleting record:', error);
		res.status(500).json({ error: 'Failed to delete record' });
	}
}

/**
 * Restore a soft-deleted record
 * PATCH /api/data/:table/:id/restore
 */
export async function restoreRecord(req: Request<{ table: string; id: string }>, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;
		const record = await DataService.restoreById(table, id, { user: req.user, audit: extractAuditContext(req) });
		res.json(record);
	} catch (error) {
		if (handleServiceError(error, res)) return;
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
