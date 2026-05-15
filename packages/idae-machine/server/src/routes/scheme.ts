import { idaeApi } from '@medyll/idae-api';
import type { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { machineServer } from '../MachineServer.js';

export async function getAllSchemes(_req: Request, res: Response): Promise<void> {
	try {
		const model = await machineServer.getModel();
		res.json(model);
	} catch (error) {
		logger.error('Error fetching schemes:', error);
		res.status(500).json({ error: 'Failed to fetch schemes' });
	}
}

export async function getScheme(req: Request, res: Response): Promise<void> {
	try {
		const { table } = req.params;
		const model = await machineServer.getModel(table);

		if (!Object.keys(model).length) {
			res.status(404).json({ error: `Scheme '${table}' not found` });
			return;
		}

		res.json(model);
	} catch (error) {
		logger.error('Error fetching scheme:', error);
		res.status(500).json({ error: 'Failed to fetch scheme' });
	}
}

export function registerSchemeRoutes(): void {
	idaeApi.router.addRoute({ method: 'get', path: '/api/scheme',        handler: getAllSchemes });
	idaeApi.router.addRoute({ method: 'get', path: '/api/scheme/:table', handler: getScheme });
	logger.info('Scheme routes registered');
}
