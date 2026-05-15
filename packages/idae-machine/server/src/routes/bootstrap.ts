import { idaeApi } from '@medyll/idae-api';
import type { Request, Response } from 'express';
import { machineServer } from '../MachineServer.js';
import { logger } from '../utils/logger.js';

async function bootstrapHandler(req: Request, res: Response): Promise<void> {
	try {
		const org   = (req.body?.org as string | undefined) ?? 'test';
		const model = req.body?.model;

		if (!model || typeof model !== 'object') {
			res.status(400).json({ error: 'Missing body.model (MachineModel JSON)' });
			return;
		}

		await machineServer.seed(model, { org });

		res.json({ ok: true, org });
	} catch (err) {
		logger.error('Bootstrap failed:', err);
		res.status(500).json({ error: 'Bootstrap failed', detail: String(err) });
	}
}

export function registerBootstrapRoutes(): void {
	idaeApi.router.addRoute({ method: 'post', path: '/api/bootstrap', handler: bootstrapHandler });
	logger.info('Bootstrap route registered: POST /api/bootstrap (dev only)');
}
