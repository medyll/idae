import type { Request, Response, NextFunction } from 'express';
import { idaeApi } from '@medyll/idae-api';

/**
 * Permission types
 */
export type Permission = 'C' | 'R' | 'U' | 'D' | 'L' | 'X';

/**
 * User context from JWT token
 */
export interface UserContext {
	userId: string;
	login: string;
	permissions?: Record<string, boolean>;
	roles?: string[];
}

/**
 * Permission check result
 */
export interface PermissionCheck {
	allowed: boolean;
	permission: Permission;
	table?: string;
	reason?: string;
}

/**
 * Extend Express Request with user context
 */
declare global {
	namespace Express {
		interface Request {
			user?: UserContext;
		}
	}
}

/**
 * Mock permission store - replace with real RBAC in production
 * For now, grants all permissions to logged-in users
 */
class PermissionStore {
	private permissions: Map<string, Set<Permission>> = new Map();

	constructor() {
		// Default: allow all permissions for demo
		this.permissions.set('*', new Set(['C', 'R', 'U', 'D', 'L', 'X', 'A']));
	}

	hasPermission(user: UserContext, permission: Permission, table?: string): boolean {
		// Check user-specific permissions
		if (user.permissions?.[`${table || '*'}:${permission}`]) {
			return true;
		}

		// Check role-based permissions
		if (user.roles?.includes('admin')) {
			return true;
		}

		// Check global permissions
		const globalPerms = this.permissions.get('*');
		return globalPerms?.has(permission) ?? false;
	}

	setPermission(role: string, permission: Permission): void {
		if (!this.permissions.has(role)) {
			this.permissions.set(role, new Set());
		}
		this.permissions.get(role)!.add(permission);
	}
}

// Singleton permission store
export const permissionStore = new PermissionStore();

/**
 * Extract user from JWT token (simplified for demo)
 */
function extractUser(req: Request): UserContext | null {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}

	// In production, verify JWT token here
	// For demo, extract from header or use mock user
	const token = authHeader.substring(7);

	// Mock user for development
	return {
		userId: 'demo-user',
		login: 'demo',
		permissions: { '*:C': true, '*:R': true, '*:U': true, '*:D': true, '*:L': true },
		roles: ['user']
	};
}

/**
 * Require permission middleware factory
 *
 * @param permission - Required permission (C, R, U, D, L, X, A)
 * @param table - Optional table name (defaults to req.params.table)
 */
export function requireDroit(permission: Permission, table?: string) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const user = extractUser(req);

		if (!user) {
			res.status(401).json({
				error: 'Authentication required',
				code: 'UNAUTHORIZED'
			});
			return;
		}

		// Attach user to request
		req.user = user;

		// Get table from params or argument
		const targetTable = table || req.params.table;

		// Check permission
		const allowed = permissionStore.hasPermission(user, permission, targetTable);

		if (!allowed) {
			res.status(403).json({
				error: `Permission denied: ${permission} on ${targetTable || 'resource'}`,
				code: 'FORBIDDEN',
				permission,
				table: targetTable
			});
			return;
		}

		next();
	};
}

/**
 * Check permissions endpoint handler
 * GET /api/permissions/check?permission=R&table=produit
 */
export function checkPermission(req: Request, res: Response): void {
	const user = extractUser(req);
	const { permission, table } = req.query;

	if (!permission || typeof permission !== 'string') {
		res.status(400).json({ error: 'permission query param required' });
		return;
	}

	if (!['C', 'R', 'U', 'D', 'L', 'X'].includes(permission)) {
		res.status(400).json({ error: 'Invalid permission type' });
		return;
	}

	const result: PermissionCheck = {
		allowed: user ? permissionStore.hasPermission(user, permission as Permission, table as string) : false,
		permission: permission as Permission,
		table: table as string | undefined,
		reason: user ? undefined : 'Not authenticated'
	};

	res.json(result);
}

/**
 * Register permission routes
 */
export function registerPermissionRoutes(): void {
	idaeApi.router.addRoute({
		method: 'get',
		path: '/api/permissions/check',
		handler: checkPermission
	});
}
