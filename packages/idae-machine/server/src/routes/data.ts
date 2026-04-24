import mongoose, { type FilterQuery, type SortOrder } from 'mongoose';
import { idaeApi } from '@medyll/idae-api';
import type { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { requireDroit, type Permission } from '../middleware/permission.js';
import { broadcastToTable } from '../socket/index.js';

/**
 * Validate table name to prevent NoSQL injection
 */
function validateTableName(table: string): boolean {
	// Only allow alphanumeric and underscore
	return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(table);
}

/**
 * Get collection model dynamically
 */
function getCollectionModel(table: string) {
	// Try to get existing model, or create a generic one
	if (mongoose.models[table]) {
		return mongoose.models[table];
	}

	// Create a generic schema for any collection
	const schema = new mongoose.Schema({}, {
		strict: false,
		timestamps: true,
		collection: table.toLowerCase()
	});

	return mongoose.model(table, schema);
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

		const Model = getCollectionModel(table);
		const { page, limit, skip } = parsePagination(req);
		const sort = parseSorting(req);
		const filters = parseFilters(req);

		// Get total count
		const total = await Model.countDocuments(filters as FilterQuery<any>);

		// Get paginated data
		const data = await Model.find(filters as FilterQuery<any>)
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

		const Model = getCollectionModel(table);
		const record = await Model.findById(id).lean();

		if (!record) {
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

		const Model = getCollectionModel(table);
		const record = await Model.create(req.body);

		// Broadcast to table room
		broadcastToTable(table, 'data:created', record);

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

		const Model = getCollectionModel(table);
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

		res.json(record);
	} catch (error) {
		logger.error('Error updating record:', error);
		res.status(500).json({ error: 'Failed to update record' });
	}
}

/**
 * Delete record with broadcast
 * DELETE /api/data/:table/:id
 */
export async function deleteRecord(req: Request, res: Response): Promise<void> {
	try {
		const { table, id } = req.params;

		if (!validateTableName(table)) {
			res.status(400).json({ error: 'Invalid table name' });
			return;
		}

		const Model = getCollectionModel(table);
		const record = await Model.findByIdAndDelete(id).lean();

		if (!record) {
			res.status(404).json({ error: `Record '${id}' not found in '${table}'` });
			return;
		}

		// Broadcast to table room
		broadcastToTable(table, 'data:deleted', { id });

		res.status(204).send();
	} catch (error) {
		logger.error('Error deleting record:', error);
		res.status(500).json({ error: 'Failed to delete record' });
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

	logger.info('Data routes registered: CRUD endpoints for /api/data/:table');
}
