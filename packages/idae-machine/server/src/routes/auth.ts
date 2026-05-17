import type { Request, Response } from 'express';
import { idaeApi } from '@medyll/idae-api';
import { login } from '../services/AuthService.js';
import { logAudit, extractAuditContext } from '../services/AuditService.js';
import { logger } from '../utils/logger.js';

/**
 * POST /api/auth/login
 * Body: { login: string, password: string }
 */
async function loginHandler(req: Request, res: Response): Promise<void> {
	const { login: loginName, password } = req.body ?? {};
	const ctx = extractAuditContext(req);

	if (!loginName || !password) {
		res.status(400).json({ error: 'login and password required' });
		return;
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
				...ctx,
			});
			res.status(401).json({ error: 'Invalid credentials', code: 'UNAUTHORIZED' });
			return;
		}

		logAudit({
			action:       'login',
			userId:       result.user.userId,
			login:        result.user.login,
			resourceType: 'auth',
			status:       'success',
			...ctx,
		});

		res.json({ token: result.token, user: result.user });
	} catch (err) {
		logger.error('Login error:', err);
		res.status(500).json({ error: 'Login failed' });
	}
}

export function registerAuthRoutes(): void {
	idaeApi.router.addRoute({
		method:  'post',
		path:    '/api/auth/login',
		handler: loginHandler,
	});
}
