import type { Request } from 'express';
import { getConn } from '../middleware/dbRouter.js';
import { getCurrentOrg } from '../middleware/orgContext.js';
import { logger } from '../utils/logger.js';

export type AuditAction =
	| 'login'
	| 'logout'
	| 'login_failed'
	| 'permission_denied'
	| 'unauthorized'
	| 'create'
	| 'update'
	| 'delete'
	| 'view'
	| 'execute';

export type AuditStatus = 'success' | 'failure' | 'denied';

export interface AuditEntry {
	action:        AuditAction;
	userId?:       string;
	login?:        string;
	resourceType:  string;
	resourceId?:   string;
	status:        AuditStatus;
	failureReason?: string;
	details?:      Record<string, unknown>;
	ipAddress?:    string;
	userAgent?:    string;
}

/**
 * Extract client info from request — for audit context.
 */
export function extractAuditContext(req: Request): { ipAddress?: string; userAgent?: string } {
	return {
		ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.socket.remoteAddress,
		userAgent: req.headers['user-agent'],
	};
}

/**
 * Log an audit entry. Fire-and-forget — never blocks the caller.
 * Failures logged to stderr but never thrown.
 */
export function logAudit(entry: AuditEntry): void {
	void writeAudit(entry).catch(err => {
		logger.error('Audit write failed:', err, entry);
	});
}

async function writeAudit(entry: AuditEntry): Promise<void> {
	const conn = await getConn(`${getCurrentOrg()}_machine_user`);
	await conn.collection('appuser_audit').insertOne({
		...entry,
		performedAt: new Date().toISOString(),
	});
}
