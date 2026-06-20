import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request } from 'express';
import { getConn } from '../middleware/dbRouter.js';
import { getCurrentOrg } from '../middleware/orgContext.js';
import { config } from '../config.js';
import type { UserContext } from '../middleware/permission.js';
import { isApiKeyToken, resolveApiKey } from './ApiKeyService.js';
import { grantService } from './GrantService.js';

interface JwtPayload {
	userId:  string;
	login:   string;
	isAdmin: boolean;
	org:     string;
}

interface AppUserDoc {
	_id:          any;
	login:        string;
	passwordHash: string;
	isActive:     boolean;
	isLocked:     boolean;
	appPermissions?: { ADMIN?: boolean };
}

/**
 * Resolve the authenticated user from the request's Bearer token.
 * Accepts a signed JWT or a long-lived API key (`mk_<org>_<secret>`).
 * Returns null if token is missing, invalid, expired, or revoked.
 */
export async function resolveUser(req: Request): Promise<UserContext | null> {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) return null;

	const token = authHeader.slice(7);

	if (isApiKeyToken(token)) return resolveApiKey(token);

	try {
		const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
		return {
			userId:  payload.userId,
			login:   payload.login,
			isAdmin: payload.isAdmin ?? false,
			org:     payload.org,
		};
	} catch {
		return null;
	}
}

/**
 * Authenticate a user by login + password.
 * Returns a signed JWT + UserContext on success, null on failure.
 */
export async function login(
	login:    string,
	password: string,
): Promise<{ token: string; user: UserContext; grants: unknown[] } | null> {
	const org  = getCurrentOrg();
	const conn = await getConn(`${org}_machine_user`);
	const doc  = await conn.collection('appuser').findOne({ login }) as AppUserDoc | null;

	if (!doc)              return null;
	if (!doc.isActive)     return null;
	if (doc.isLocked)      return null;

	const valid = await bcrypt.compare(password, doc.passwordHash);
	if (!valid) return null;

	const isAdmin = doc.appPermissions?.ADMIN === true;

	const payload: JwtPayload = {
		userId:  String(doc._id),
		login:   doc.login,
		isAdmin,
		org,
	};

	const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtTtl as any });

	// Hydrate the client's rights gate with the user's effective grants. Admins get
	// the ADMIN override client-side and don't need them, but non-admins do — without
	// these the client denies every read even though the server would allow it.
	const grants = isAdmin ? [] : await grantService.listUserGrants(payload.userId);

	return {
		token,
		user: { userId: payload.userId, login: payload.login, isAdmin, org },
		grants,
	};
}

/** Hash a password — use when creating/updating appuser records. */
export async function hashPassword(plain: string): Promise<string> {
	return bcrypt.hash(plain, 12);
}
