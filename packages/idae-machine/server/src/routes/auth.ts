import type { Request, Response } from 'express';
import { idaeApi } from '@medyll/idae-api';
import { login } from '../services/AuthService.js';
import { logger } from '../utils/logger.js';

/**
 * POST /api/auth/login
 * Body: { login: string, password: string }
 */
async function loginHandler(req: Request, res: Response): Promise<void> {
	const { login: loginName, password } = req.body ?? {};

	if (!loginName || !password) {
		res.status(400).json({ error: 'login and password required' });
		return;
	}

	try {
		const result = await login(loginName, password);

		if (!result) {
			res.status(401).json({ error: 'Invalid credentials', code: 'UNAUTHORIZED' });
			return;
		}

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
