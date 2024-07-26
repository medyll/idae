// packages\idae-api\src\lib\middleware\authMiddleware.ts

import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export const createAuthMiddleware = (authService: AuthService) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const token = authHeader.split(' ')[1];

		try {
			const user = authService.verifyToken(token);
			req.user = user; // Attach user info to the request object
			next();
		} catch (error) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
	};
};
