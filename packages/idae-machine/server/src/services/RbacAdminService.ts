/**
 * RbacAdminService — admin operations on users, groups, grants, and the audit
 * trail. All ops scoped to `${getCurrentOrg()}_machine_user`.
 *
 * Conventions (same as seedUsers.ts / GrantService):
 *   - grants/assignments reference users and groups by String(_id)
 *   - grant identity = (grantType, userId|groupId, schemeCode) — upsert key
 *   - passwordHash via AuthService.hashPassword, never returned to callers
 */

import { getConn } from '../middleware/dbRouter.js';
import { getCurrentOrg } from '../middleware/orgContext.js';
import { hashPassword } from './AuthService.js';
import { grantService, type GrantConstraints, type ResolvedAccess } from './GrantService.js';
import type { Permission } from '../middleware/permission.js';

const AUDIT_MAX_LIMIT = 1000;

async function userDb() {
	return getConn(`${getCurrentOrg()}_machine_user`);
}

export interface UserSummary {
	_id: string;
	login: string;
	email?: string;
	isActive: boolean;
	isLocked: boolean;
	isAdmin: boolean;
	createdAt?: unknown;
}

/** List users — password hash never leaves this module. */
export async function listUsers(): Promise<UserSummary[]> {
	const conn = await userDb();
	const docs = await conn.collection('appuser').find({}, { projection: { passwordHash: 0 } }).toArray();
	return docs.map((d: any) => ({
		_id: String(d._id),
		login: d.login,
		email: d.email,
		isActive: d.isActive !== false,
		isLocked: d.isLocked === true,
		isAdmin: d.appPermissions?.ADMIN === true,
		createdAt: d.createdAt,
	}));
}

/** Create a user. Refuses an existing login. Returns the summary, never the hash. */
export async function createUser(params: {
	login: string;
	password: string;
	email?: string;
	isAdmin?: boolean;
}): Promise<UserSummary> {
	const { login, password, email, isAdmin } = params;
	if (!login?.trim()) throw new Error('login is required');
	if (!password || password.length < 8) throw new Error('password must be at least 8 characters');

	const conn = await userDb();
	const users = conn.collection('appuser');

	const existing = await users.findOne({ login });
	if (existing) throw new Error(`User '${login}' already exists`);

	const doc = {
		login:          login.trim(),
		passwordHash:   await hashPassword(password),
		email:          email ?? null,
		emailVerified:  false,
		isActive:       true,
		isLocked:       false,
		appPermissions: isAdmin === true ? { ADMIN: true } : {},
		createdAt:      new Date(),
	};
	const result = await users.insertOne(doc as any);

	return {
		_id: String(result.insertedId),
		login: doc.login,
		email: doc.email ?? undefined,
		isActive: true,
		isLocked: false,
		isAdmin: isAdmin === true,
		createdAt: doc.createdAt,
	};
}

/** Enable/disable a user. Disabling also kills their API keys (live owner check) and sessions at next grant check. */
export async function setUserActive(login: string, isActive: boolean): Promise<boolean> {
	const conn = await userDb();
	const result = await conn.collection('appuser').updateOne({ login }, { $set: { isActive } });
	if (result.matchedCount === 0) throw new Error(`User '${login}' not found`);
	return result.modifiedCount === 1;
}

/** Assign a user to a group (by codes). Invalidates the grant cache for the user. */
export async function assignGroup(login: string, groupCode: string): Promise<{ userId: string; groupId: string }> {
	const conn = await userDb();

	const user = await conn.collection('appuser').findOne({ login });
	if (!user) throw new Error(`User '${login}' not found`);
	const group = await conn.collection('appuser_group').findOne({ code: groupCode });
	if (!group) throw new Error(`Group '${groupCode}' not found`);

	const userId = String(user._id);
	const groupId = String(group._id);

	await conn.collection('appuser_assignment').updateOne(
		{ userId, assignmentType: 'group', groupId },
		{
			$set: {
				assignmentType: 'group',
				userId,
				groupId,
				assignedAt: new Date().toISOString(),
			},
		},
		{ upsert: true }
	);

	grantService.invalidateUser(userId);
	return { userId, groupId };
}

/** List groups with their grants attached. */
export async function listGroups(): Promise<Array<Record<string, unknown>>> {
	const conn = await userDb();
	const groups = await conn.collection('appuser_group').find({}).toArray();
	const grants = await conn.collection('appuser_grant').find({ grantType: 'group' }).toArray();

	return groups.map((g: any) => ({
		_id: String(g._id),
		code: g.code,
		name: g.name,
		description: g.description,
		grants: grants
			.filter((gr: any) => gr.groupId === String(g._id))
			.map(({ _id, ...rest }: any) => rest),
	}));
}

/** List grants, optionally filtered by user login or group code. */
export async function listGrants(filter: { login?: string; groupCode?: string } = {}): Promise<Array<Record<string, unknown>>> {
	const conn = await userDb();
	const query: Record<string, unknown> = {};

	if (filter.login) {
		const user = await conn.collection('appuser').findOne({ login: filter.login });
		if (!user) throw new Error(`User '${filter.login}' not found`);
		query.grantType = 'user';
		query.userId = String(user._id);
	} else if (filter.groupCode) {
		const group = await conn.collection('appuser_group').findOne({ code: filter.groupCode });
		if (!group) throw new Error(`Group '${filter.groupCode}' not found`);
		query.grantType = 'group';
		query.groupId = String(group._id);
	}

	const docs = await conn.collection('appuser_grant').find(query).toArray();
	return docs.map(({ _id, ...rest }: any) => ({ id: String(_id), ...rest }));
}

export interface SetGrantParams {
	grantType: 'user' | 'group';
	/** Required when grantType = 'user'. */
	login?: string;
	/** Required when grantType = 'group'. */
	groupCode?: string;
	/** Collection code, or '*' for all collections. */
	schemeCode: string;
	c: boolean; r: boolean; u: boolean; d: boolean; l: boolean; x: boolean;
	constraints?: GrantConstraints;
	grantedBy?: string;
}

/** Upsert a grant on its identity key (grantType, holder, schemeCode). Flushes the grant cache. */
export async function setGrant(params: SetGrantParams): Promise<Record<string, unknown>> {
	const conn = await userDb();
	const { grantType, schemeCode } = params;
	if (!schemeCode?.trim()) throw new Error('schemeCode is required');

	let holderKey: { userId: string } | { groupId: string };
	if (grantType === 'user') {
		if (!params.login) throw new Error("login is required for grantType 'user'");
		const user = await conn.collection('appuser').findOne({ login: params.login });
		if (!user) throw new Error(`User '${params.login}' not found`);
		holderKey = { userId: String(user._id) };
	} else if (grantType === 'group') {
		if (!params.groupCode) throw new Error("groupCode is required for grantType 'group'");
		const group = await conn.collection('appuser_group').findOne({ code: params.groupCode });
		if (!group) throw new Error(`Group '${params.groupCode}' not found`);
		holderKey = { groupId: String(group._id) };
	} else {
		throw new Error(`Invalid grantType '${grantType}' (user | group)`);
	}

	const grant = {
		grantType,
		...holderKey,
		schemeCode,
		c: params.c === true, r: params.r === true, u: params.u === true,
		d: params.d === true, l: params.l === true, x: params.x === true,
		...(params.constraints ? { constraints: params.constraints } : {}),
		grantedBy: params.grantedBy ?? 'mcp',
		grantedAt: new Date().toISOString(),
	};

	await conn.collection('appuser_grant').updateOne(
		{ grantType, ...holderKey, schemeCode },
		{ $set: grant },
		{ upsert: true }
	);

	grantService.flush();
	return grant;
}

/** Resolve a user's effective access (direct + group + type cascade) for one collection/permission. */
export async function checkUserGrant(login: string, collection: string, permission: Permission): Promise<ResolvedAccess & { isAdmin: boolean }> {
	const conn = await userDb();
	const user = await conn.collection('appuser').findOne({ login });
	if (!user) throw new Error(`User '${login}' not found`);

	const isAdmin = (user as any).appPermissions?.ADMIN === true;
	if (isAdmin) return { allowed: true, isAdmin: true };

	const access = await grantService.resolveAccess(String(user._id), collection, permission);
	return { ...access, isAdmin: false };
}

export interface AuditQuery {
	action?: string;
	login?: string;
	resourceType?: string;
	status?: string;
	/** ISO date — only entries at/after this instant. */
	since?: string;
	limit?: number;
}

/** Query the audit trail, newest first. */
export async function queryAudit(q: AuditQuery = {}): Promise<Array<Record<string, unknown>>> {
	const conn = await userDb();
	const filter: Record<string, unknown> = {};
	if (q.action) filter.action = q.action;
	if (q.login) filter.login = q.login;
	if (q.resourceType) filter.resourceType = q.resourceType;
	if (q.status) filter.status = q.status;
	if (q.since) filter.performedAt = { $gte: q.since };

	const limit = Math.min(Math.max(q.limit ?? 100, 1), AUDIT_MAX_LIMIT);

	const docs = await conn
		.collection('appuser_audit')
		.find(filter)
		.sort({ performedAt: -1 })
		.limit(limit)
		.toArray();

	return docs.map(({ _id, ...rest }: any) => rest);
}
