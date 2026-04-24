import { idaeApi } from '@medyll/idae-api';
import { AppScheme } from '../models/AppScheme.js';
import type { Request, Response } from 'express';
import { logger } from '../utils/logger.js';

/**
 * Get all schemes
 * GET /api/scheme
 */
export async function getAllSchemes(_req: Request, res: Response): Promise<void> {
	try {
		const schemes = await AppScheme.find().select('-__v').lean();

		res.json({
			schemes: schemes.map((s) => ({
				idappscheme: s.idappscheme,
				code: s.code,
				name: s.name,
				_views: s._views,
				fields: s.fields,
				createdAt: s.createdAt,
				updatedAt: s.updatedAt
			}))
		});
	} catch (error) {
		logger.error('Error fetching schemes:', error);
		res.status(500).json({ error: 'Failed to fetch schemes' });
	}
}

/**
 * Get single scheme by code
 * GET /api/scheme/:table
 */
export async function getScheme(req: Request, res: Response): Promise<void> {
	try {
		const { table } = req.params;

		const scheme = await AppScheme.findOne({ code: table }).select('-__v').lean();

		if (!scheme) {
			res.status(404).json({ error: `Scheme '${table}' not found` });
			return;
		}

		res.json({
			idappscheme: scheme.idappscheme,
			code: scheme.code,
			name: scheme.name,
			_views: scheme._views,
			fields: scheme.fields,
			createdAt: scheme.createdAt,
			updatedAt: scheme.updatedAt
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
		method: 'get',
		path: '/api/scheme',
		handler: getAllSchemes
	});

	idaeApi.router.addRoute({
		method: 'get',
		path: '/api/scheme/:table',
		handler: getScheme
	});

	logger.info('Scheme routes registered: /api/scheme, /api/scheme/:table');
}
