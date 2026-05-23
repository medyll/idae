import { idaeApi } from '@medyll/idae-api';
import { config } from '../config.js';
import type { Request, Response } from 'express';

/**
 * Health check handler
 * GET /health
 */
export function healthHandler(_req: Request, res: Response): void {
	res.json({
		status: 'ok',
		version: config.version,
		timestamp: new Date().toISOString(),
		environment: config.nodeEnv
	});
}

/**
 * Register health routes
 */
export function registerHealthRoutes(): void {
	idaeApi.app.get('/health', healthHandler as any);
}
