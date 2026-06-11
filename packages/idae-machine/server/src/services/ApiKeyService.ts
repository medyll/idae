/**
 * ApiKeyService — long-lived API keys for agent/MCP access.
 *
 * Key format: `mk_<org>_<48-hex-secret>`. The org segment is readable so
 * orgContextMiddleware can route the request before any DB lookup; the secret
 * is random and only its SHA-256 hash is stored (collection `appuser_apikey`
 * in `${org}_machine_user`). The plaintext key is returned exactly once, at
 * creation.
 *
 * A key authenticates as its owning user: isAdmin/isActive/isLocked are read
 * from the live `appuser` document on every resolution (no privilege snapshot),
 * and RBAC scope = the user's grants, same as a JWT session.
 */

import { createHash, randomBytes } from 'node:crypto';
import { getConn } from '../middleware/dbRouter.js';
import { getCurrentOrg } from '../middleware/orgContext.js';
import type { UserContext } from '../middleware/permission.js';
import { logger } from '../utils/logger.js';
import { API_KEY_PREFIX, parseApiKey, isApiKeyToken } from '../utils/apiKeyFormat.js';

export { parseApiKey, isApiKeyToken };

const SECRET_BYTES = 24; // 48 hex chars

export interface ApiKeyDoc {
	name:        string;
	/** First 8 chars of the secret — display/identification only. */
	prefix:      string;
	/** SHA-256 hex of the full plaintext key. */
	keyHash:     string;
	userId:      string;
	login:       string;
	org:         string;
	createdAt:   string;
	expiresAt?:  string | null;
	revokedAt?:  string | null;
	lastUsedAt?: string | null;
}

export interface ApiKeyMeta {
	name:        string;
	prefix:      string;
	userId:      string;
	login:       string;
	createdAt:   string;
	expiresAt?:  string | null;
	revokedAt?:  string | null;
	lastUsedAt?: string | null;
}

function hashKey(plaintext: string): string {
	return createHash('sha256').update(plaintext).digest('hex');
}

async function keysCollection(org: string) {
	const conn = await getConn(`${org}_machine_user`);
	return conn.collection('appuser_apikey');
}

/**
 * Create an API key for a user. Returns the plaintext key — the only time it
 * is ever available.
 */
export async function createApiKey(
	user: { userId: string; login: string },
	name: string,
	opts: { expiresInDays?: number } = {}
): Promise<{ key: string; name: string; prefix: string; expiresAt: string | null }> {
	if (!name?.trim()) throw new Error('API key name is required');

	const org = getCurrentOrg();
	const secret = randomBytes(SECRET_BYTES).toString('hex');
	const key = `${API_KEY_PREFIX}${org}_${secret}`;

	const expiresAt =
		opts.expiresInDays && opts.expiresInDays > 0
			? new Date(Date.now() + opts.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
			: null;

	const doc: ApiKeyDoc = {
		name:      name.trim(),
		prefix:    secret.slice(0, 8),
		keyHash:   hashKey(key),
		userId:    user.userId,
		login:     user.login,
		org,
		createdAt: new Date().toISOString(),
		expiresAt,
		revokedAt: null,
		lastUsedAt: null,
	};

	const col = await keysCollection(org);
	await col.insertOne(doc as any);

	return { key, name: doc.name, prefix: doc.prefix, expiresAt };
}

/**
 * Resolve an API key token → UserContext, or null when the key is unknown,
 * revoked, expired, or its owner is inactive/locked. Reads the live appuser
 * document so privilege changes apply immediately.
 */
export async function resolveApiKey(token: string): Promise<UserContext | null> {
	const parsed = parseApiKey(token);
	if (!parsed) return null;

	try {
		const col = await keysCollection(parsed.org);
		const doc = (await col.findOne({ keyHash: hashKey(token) })) as ApiKeyDoc | null;

		if (!doc) return null;
		if (doc.revokedAt) return null;
		if (doc.expiresAt && new Date(doc.expiresAt) < new Date()) return null;

		// Live owner check — a disabled user must not keep API access.
		const conn = await getConn(`${parsed.org}_machine_user`);
		const owner = await conn.collection('appuser').findOne({ login: doc.login }) as
			| { isActive?: boolean; isLocked?: boolean; appPermissions?: { ADMIN?: boolean } }
			| null;
		if (!owner || owner.isActive === false || owner.isLocked === true) return null;

		// Fire-and-forget usage stamp.
		void col
			.updateOne({ keyHash: doc.keyHash }, { $set: { lastUsedAt: new Date().toISOString() } })
			.catch((err) => logger.error('API key lastUsedAt update failed:', err));

		return {
			userId:  doc.userId,
			login:   doc.login,
			isAdmin: owner.appPermissions?.ADMIN === true,
			org:     parsed.org,
		};
	} catch (err) {
		logger.error('API key resolution failed:', err);
		return null;
	}
}

/** List a user's API keys — metadata only, never the hash. */
export async function listApiKeys(userId: string): Promise<ApiKeyMeta[]> {
	const col = await keysCollection(getCurrentOrg());
	const docs = (await col.find({ userId }).toArray()) as unknown as ApiKeyDoc[];
	return docs.map(({ name, prefix, userId: uid, login, createdAt, expiresAt, revokedAt, lastUsedAt }) => ({
		name, prefix, userId: uid, login, createdAt, expiresAt, revokedAt, lastUsedAt,
	}));
}

/**
 * Revoke an API key by prefix. Non-admin callers can only revoke their own
 * keys. Returns true when a key was revoked.
 */
export async function revokeApiKey(
	caller: { userId: string; isAdmin?: boolean },
	prefix: string
): Promise<boolean> {
	const col = await keysCollection(getCurrentOrg());
	const filter: Record<string, unknown> = { prefix, revokedAt: null };
	if (!caller.isAdmin) filter.userId = caller.userId;

	const result = await col.updateOne(filter, { $set: { revokedAt: new Date().toISOString() } });
	return result.modifiedCount === 1;
}
