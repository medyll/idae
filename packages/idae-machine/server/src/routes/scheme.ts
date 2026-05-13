import mongoose from 'mongoose';
import { idaeApi } from '@medyll/idae-api';
import type { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

function getMetaDb() {
	return mongoose.connection.useDb(`${config.org}_machine_app`, { useCache: true });
}

/**
 * Read appscheme_* and reconstruct IdbqModel-compatible JSON.
 * GET /api/scheme
 */
export async function getAllSchemes(_req: Request, res: Response): Promise<void> {
	try {
		const db     = getMetaDb();
		const schemes = await db.collection('appscheme').find().toArray();
		const fields  = await db.collection('appscheme_field').find().toArray();

		// Group fields by collection
		const fieldsByCollection: Record<string, any[]> = {};
		for (const f of fields) {
			const col = f.collection as string;
			if (!fieldsByCollection[col]) fieldsByCollection[col] = [];
			fieldsByCollection[col].push(f);
		}

		// Build IdbqModel-compatible JSON
		const model: Record<string, unknown> = {};
		for (const scheme of schemes) {
			const code = scheme.code as string;
			const colFields: Record<string, unknown> = {};

			for (const f of fieldsByCollection[code] ?? []) {
				colFields[f.name] = {
					type:     f.type,
					required: f.required,
					readonly: f.readonly,
					private:  f.private,
				};
			}

			model[code] = {
				keyPath:  scheme.keyPath ?? '++id',
				base:     scheme.base,
				model:    {},
				template: {
					index:        scheme.index,
					presentation: scheme.presentation,
					fields:       colFields,
					fks:          {},
				},
			};
		}

		res.json(model);
	} catch (error) {
		logger.error('Error fetching schemes:', error);
		res.status(500).json({ error: 'Failed to fetch schemes' });
	}
}

/**
 * Get single collection scheme.
 * GET /api/scheme/:table
 */
export async function getScheme(req: Request, res: Response): Promise<void> {
	try {
		const { table } = req.params;
		const db     = getMetaDb();
		const scheme = await db.collection('appscheme').findOne({ code: table });

		if (!scheme) {
			res.status(404).json({ error: `Scheme '${table}' not found` });
			return;
		}

		const fields = await db.collection('appscheme_field').find({ collection: table }).toArray();
		const colFields: Record<string, unknown> = {};
		for (const f of fields) {
			colFields[f.name] = {
				type:     f.type,
				required: f.required,
				readonly: f.readonly,
				private:  f.private,
			};
		}

		res.json({
			[table]: {
				keyPath:  scheme.keyPath ?? '++id',
				base:     scheme.base,
				model:    {},
				template: {
					index:        scheme.index,
					presentation: scheme.presentation,
					fields:       colFields,
					fks:          {},
				},
			},
		});
	} catch (error) {
		logger.error('Error fetching scheme:', error);
		res.status(500).json({ error: 'Failed to fetch scheme' });
	}
}

/**
 * Register scheme routes
 */
export function registerSchemeRoutes(): void {
	idaeApi.router.addRoute({
		method:  'get',
		path:    '/api/scheme',
		handler: getAllSchemes
	});

	idaeApi.router.addRoute({
		method:  'get',
		path:    '/api/scheme/:table',
		handler: getScheme
	});

	logger.info('Scheme routes registered: /api/scheme, /api/scheme/:table');
}
