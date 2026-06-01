import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request } from 'express';
import { getConn } from '../middleware/dbRouter.js';
import { config } from '../config.js';
import type { UserContext } from '../middleware/permission.js';

interface JwtPayload {
	userId:  string;
	login:   string;
	isAdmin: boolean;
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
 * Returns null if token is missing, invalid, or expired.
 */
export async function resolveUser(req: Request): Promise<UserContext | null> {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) return null;

	const token = authHeader.slice(7);
	try {
		const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
		return {
			userId:  payload.userId,
			login:   payload.login,
			isAdmin: payload.isAdmin ?? false,
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
): Promise<{ token: string; user: UserContext } | null> {
	const conn = await getConn(`${config.org}_machine_user`);
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
	};

	const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtTtl as any });

	return {
		token,
		user: { userId: payload.userId, login: payload.login, isAdmin },
	};
}

/** Hash a password — use when creating/updating appuser records. */
export async function hashPassword(plain: string): Promise<string> {
	return bcrypt.hash(plain, 12);
}
