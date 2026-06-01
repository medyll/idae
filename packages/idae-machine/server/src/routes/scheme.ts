import { idaeApi } from '@medyll/idae-api';
import { logger } from '../utils/logger.js';
import { machineServer } from '../MachineServer.js';

class HttpError extends Error {
	constructor(public status: number, message: string) {
		super(message);
	}
}

/**
 * idae-api v3 handler signature: (service, params, body, query) => result
 * Framework wraps in handleRequest, calls res.json(result). Throw HttpError for non-200.
 */
export async function getAllSchemes(): Promise<unknown> {
	try {
		return await machineServer.getModel();
	} catch (error) {
		logger.error('Error fetching schemes:', error);
		throw new HttpError(500, 'Failed to fetch schemes');
	}
}

export async function getScheme(_service: unknown, params: { table: string }): Promise<unknown> {
	try {
		const { table } = params;
		if (!table) {
			throw new HttpError(400, 'Missing table parameter');
		}
		const model = await machineServer.getModel(table);
		if (!model[table]) {
			throw new HttpError(404, `Scheme '${table}' not found`);
		}
		return model;
	} catch (error) {
		if (error instanceof HttpError) throw error;
		logger.error('Error fetching scheme:', error);
		throw new HttpError(500, 'Failed to fetch scheme');
	}
}

export function registerSchemeRoutes(): void {
	idaeApi.router.addRoute({ method: 'get', path: '/api/scheme',        handler: getAllSchemes });
	idaeApi.router.addRoute({ method: 'get', path: '/api/scheme/:table', handler: getScheme });
	logger.info('Scheme routes registered');
}
