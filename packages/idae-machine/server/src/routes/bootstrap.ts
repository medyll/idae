import { idaeApi } from '@medyll/idae-api';
import type { Request, Response } from 'express';
import { machineServer } from '../MachineServer.js';
import { logger } from '../utils/logger.js';
import { invalidateSchemeCache } from '../validation/SchemeValidator.js';
import { clearCollections, seedEngineRegistries, publishModel } from '../bootstrap/publishModel.js';
import { buildEngineModel } from '../bootstrap/seed/engineModel.js';
import { seedUsers } from '../bootstrap/seedUsers.js';
import { seedBusinessData } from '../bootstrap/seedBusinessData.js';
import { seedImagePresets } from '../bootstrap/seedImagePresets.js';
import { demoSeed, demoScheme } from '../models/demo/demoScheme.js';
import { config } from '../config.js';
import { mongooseConnectionManager } from '@medyll/idae-api';

async function bootstrapHandler(req: Request, res: Response): Promise<void> {
	try {
		const org   = (req.body?.org as string | undefined) ?? 'test';
		const model = req.body?.model;

		if (!model || typeof model !== 'object') {
			res.status(400).json({ error: 'Missing body.model (MachineModel JSON)' });
			return;
		}

		await machineServer.publishModel(model, { org });
		invalidateSchemeCache();

		res.json({ ok: true, org });
	} catch (err) {
		logger.error('Bootstrap failed:', err);
		res.status(500).json({ error: 'Bootstrap failed', detail: String(err) });
	}
}

/**
 * POST /api/admin/reset
 * Body: { steps?: ('clear'|'deploy'|'seed')[], model?: MachineModel, org?: string }
 * Runs selected reset steps against MongoDB. Dev/admin only.
 */
async function adminResetHandler(req: Request, res: Response): Promise<void> {
	const org      = (req.body?.org as string | undefined) ?? config.org;
	const mongoUri = config.mongodbUri;
	const steps    = (req.body?.steps as string[] | undefined) ?? ['clear', 'deploy', 'seed'];
	const model    = req.body?.model ?? null;

	const results: Record<string, 'ok' | 'skipped' | string> = {};

	try {
		if (steps.includes('clear')) {
			await clearCollections({ org, mongoUri });
			results.clear = 'ok';
			logger.info(`[admin/reset] clear done for org="${org}"`);
		} else {
			results.clear = 'skipped';
		}

		if (steps.includes('deploy')) {
			await seedEngineRegistries({ org, mongoUri });
			await publishModel(buildEngineModel(), { org, mongoUri });
			// Default to demoScheme when no model supplied — dev reset shortcut
			await publishModel(model ?? demoScheme, { org, mongoUri });
			invalidateSchemeCache();
			results.deploy = 'ok';
			logger.info(`[admin/reset] deploy done for org="${org}"`);
		} else {
			results.deploy = 'skipped';
		}

		if (steps.includes('seed')) {
			const appConn  = await mongooseConnectionManager.getOrCreate(mongoUri, `${org}_machine_app`);
			const userConn = await mongooseConnectionManager.getOrCreate(mongoUri, `${org}_machine_user`);
			await seedImagePresets(appConn);
			await seedUsers(userConn);
			await seedBusinessData({ org, mongoUri, model: demoScheme, data: demoSeed });
			results.seed = 'ok';
			logger.info(`[admin/reset] seed done for org="${org}"`);
		} else {
			results.seed = 'skipped';
		}

		res.json({ ok: true, org, results });
	} catch (err) {
		logger.error('[admin/reset] failed:', err);
		res.status(500).json({ ok: false, results, error: String(err) });
	}
}

export function registerBootstrapRoutes(): void {
	idaeApi.app.post('/api/bootstrap',   bootstrapHandler as any);
	idaeApi.app.post('/api/admin/reset', adminResetHandler as any);
	logger.info('Bootstrap routes registered: POST /api/bootstrap, POST /api/admin/reset');
}
