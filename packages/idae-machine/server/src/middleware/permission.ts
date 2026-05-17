import type { Request, Response, NextFunction } from 'express';
import { idaeApi } from '@medyll/idae-api';
import { grantService } from '../services/GrantService.js';
import { resolveUser } from '../services/AuthService.js';

export type Permission = 'C' | 'R' | 'U' | 'D' | 'L' | 'X';

export interface UserContext {
	userId:  string;
	login:   string;
	isAdmin?: boolean;
}

export interface PermissionCheck {
	allowed:    boolean;
	permission: Permission;
	table?:     string;
	reason?:    string;
}

declare global {
	namespace Express {
		interface Request {
			user?: UserContext;
		}
	}
}

/**
 * Require permission middleware.
 * Resolution order:
 *   1. No user   → 401
 *   2. isAdmin   → allow (bypass grant check)
 *   3. DB grant  → check appuser_grant via GrantService
 *   4. No grant  → 403
 */
export function requireDroit(permission: Permission, table?: string) {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const user = await resolveUser(req);

		if (!user) {
			res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
			return;
		}

		req.user = user;

		// Admin bypass
		if (user.isAdmin) {
			next();
			return;
		}

		const targetTable = table ?? req.params.table;
		const allowed     = await grantService.checkGrant(user.userId, targetTable, permission);

		if (!allowed) {
			res.status(403).json({
				error:      `Permission denied: ${permission} on ${targetTable ?? 'resource'}`,
				code:       'FORBIDDEN',
				permission,
				table:      targetTable,
			});
			return;
		}

		next();
	};
}

/**
 * GET /api/permissions/check?permission=R&table=produit
 */
export async function checkPermission(req: Request, res: Response): Promise<void> {
	const user = await resolveUser(req);
	const { permission, table } = req.query;

	if (!permission || typeof permission !== 'string') {
		res.status(400).json({ error: 'permission query param required' });
		return;
	}

	if (!['C', 'R', 'U', 'D', 'L', 'X'].includes(permission)) {
		res.status(400).json({ error: 'Invalid permission type' });
		return;
	}

	if (!user) {
		res.json({ allowed: false, permission, table, reason: 'Not authenticated' } satisfies PermissionCheck);
		return;
	}

	if (user.isAdmin) {
		res.json({ allowed: true, permission, table } satisfies PermissionCheck);
		return;
	}

	const allowed = await grantService.checkGrant(user.userId, table as string, permission as Permission);
	res.json({ allowed, permission: permission as Permission, table: table as string | undefined } satisfies PermissionCheck);
}

export function registerPermissionRoutes(): void {
	idaeApi.router.addRoute({
		method:  'get',
		path:    '/api/permissions/check',
		handler: checkPermission,
	});
}
