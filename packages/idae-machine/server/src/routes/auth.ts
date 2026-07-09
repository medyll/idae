import { idaeApi } from '@medyll/idae-api';
import { login } from '../services/AuthService.js';
import { logAudit } from '../services/AuditService.js';
import { logger } from '../utils/logger.js';

class HttpError extends Error {
	constructor(public status: number, message: string, public code?: string) { super(message); }
}

/**
 * POST /api/auth/login — idae-api v3 handler signature (service, params, body)
 * Body: { login: string, password: string }
 */
async function loginHandler(_service: unknown, _params: unknown, body: { login?: string; password?: string }): Promise<unknown> {
	const { login: loginName, password } = body ?? {};

	if (!loginName || !password) {
		throw new HttpError(400, 'login and password required');
	}

	try {
		const result = await login(loginName, password);

		if (!result) {
			logAudit({
				action:        'login_failed',
				login:         loginName,
				resourceType:  'auth',
				status:        'failure',
				failureReason: 'Invalid credentials',
			});
			throw new HttpError(401, 'Invalid credentials', 'UNAUTHORIZED');
		}

		logAudit({
			action:       'login',
			userId:       result.user.userId,
			login:        result.user.login,
			resourceType: 'auth',
			status:       'success',
		});

		return { token: result.token, user: result.user, grants: result.grants, menuBaseline: result.menuBaseline };
	} catch (err) {
		if (err instanceof HttpError) throw err;
		logger.error('Login error:', err);
		throw new HttpError(500, 'Login failed');
	}
}

export function registerAuthRoutes(): void {
	idaeApi.router.addRoute({
		method:  'post',
		path:    '/api/auth/login',
		handler: loginHandler,
	});
}
