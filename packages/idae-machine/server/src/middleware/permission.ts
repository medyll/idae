import type { Request, Response, NextFunction } from 'express';
import { idaeApi } from '@medyll/idae-api';
import { grantService, type GrantConstraints } from '../services/GrantService.js';
import { resolveUser } from '../services/AuthService.js';
import { logAudit, extractAuditContext } from '../services/AuditService.js';
import { config } from '../config.js';

export type Permission = 'C' | 'R' | 'U' | 'D' | 'L' | 'X';

export interface UserContext {
	userId:      string;
	login:       string;
	isAdmin?:    boolean;
	/** Merged grant constraints for the current request — set by requireDroit. */
	constraints?: GrantConstraints;
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
		const targetTable = table ?? req.params.table;
		const ctx = extractAuditContext(req);

		// Auth disabled (e.g. AUTH_DISABLED=true in .env) → synthetic admin, no token needed.
		if (config.authDisabled) {
			req.user = { userId: 'dev', login: 'dev', isAdmin: true };
			return next();
		}

		// Schema metadata is read-only descriptors — public in all envs.
		if ((permission === 'L' || permission === 'R') && targetTable?.startsWith('appscheme')) {
			return next();
		}

		const user = await resolveUser(req);

		if (!user) {
			logAudit({
				action:        'unauthorized',
				resourceType:  targetTable ?? 'unknown',
				status:        'denied',
				failureReason: 'Missing or invalid token',
				details:       { permission },
				...ctx,
			});
			res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
			return;
		}

		req.user = user;

		// Admin bypass
		if (user.isAdmin) {
			next();
			return;
		}

		const { allowed, constraints } = await grantService.resolveAccess(user.userId, targetTable, permission);

		if (!allowed) {
			logAudit({
				action:        'permission_denied',
				userId:        user.userId,
				login:         user.login,
				resourceType:  targetTable ?? 'unknown',
				status:        'denied',
				failureReason: `No grant for ${permission}`,
				details:       { permission },
				...ctx,
			});
			res.status(403).json({
				error:      `Permission denied: ${permission} on ${targetTable ?? 'resource'}`,
				code:       'FORBIDDEN',
				permission,
				table:      targetTable,
			});
			return;
		}

		// Attach merged constraints — route handlers consume req.user.constraints
		if (constraints) req.user.constraints = constraints;

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

	const perm = permission as Permission;
	const tableStr = typeof table === 'string' ? table : undefined;

	if (!user) {
		res.json({ allowed: false, permission: perm, table: tableStr, reason: 'Not authenticated' } satisfies PermissionCheck);
		return;
	}

	if (user.isAdmin) {
		res.json({ allowed: true, permission: perm, table: tableStr } satisfies PermissionCheck);
		return;
	}

	const allowed = await grantService.checkGrant(user.userId, table as string, permission as Permission);
	res.json({ allowed, permission: permission as Permission, table: table as string | undefined } satisfies PermissionCheck);
}

export function registerPermissionRoutes(): void {
	idaeApi.app.get('/api/permissions/check', checkPermission as any);
}
