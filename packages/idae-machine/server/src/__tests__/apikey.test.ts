/**
 * ApiKeyService tests — key format parsing (pure) + full lifecycle roundtrip
 * against real Mongo (create → resolve → list → revoke → resolve fails).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { getConn } from '../middleware/dbRouter.js';
import { parseApiKey, isApiKeyToken } from '../utils/apiKeyFormat.js';
import { createApiKey, resolveApiKey, listApiKeys, revokeApiKey } from '../services/ApiKeyService.js';

const TEST_ORG = 'vitest';
const USER_DB  = `${TEST_ORG}_machine_user`;

const owner = { userId: 'u-apikey-test', login: 'apikey-tester' };

describe('apiKeyFormat', () => {
	it('parses mk_<org>_<hexsecret>', () => {
		const parsed = parseApiKey('mk_demo_0123456789abcdef0123456789abcdef');
		expect(parsed).toEqual({ org: 'demo', secret: '0123456789abcdef0123456789abcdef' });
	});

	it('handles orgs containing underscores (last _ splits)', () => {
		const parsed = parseApiKey('mk_my_org_0123456789abcdef');
		expect(parsed).toEqual({ org: 'my_org', secret: '0123456789abcdef' });
	});

	it('rejects JWTs and malformed tokens', () => {
		expect(parseApiKey('eyJhbGciOi...')).toBeNull();
		expect(parseApiKey('mk_demo_NOTHEX')).toBeNull();
		expect(parseApiKey('mk_short')).toBeNull();
		expect(isApiKeyToken('eyJhbGciOi...')).toBe(false);
		expect(isApiKeyToken('mk_demo_abc')).toBe(true);
	});
});

describe('ApiKeyService lifecycle', () => {
	beforeAll(async () => {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.mongodbUri);
		}
		(config as any).org = TEST_ORG;

		// Owner appuser must exist and be active for key resolution.
		const conn = await getConn(USER_DB);
		await conn.collection('appuser').updateOne(
			{ login: owner.login },
			{ $set: { login: owner.login, isActive: true, isLocked: false, passwordHash: 'n/a' } },
			{ upsert: true }
		);
	});

	afterAll(async () => {
		const conn = await getConn(USER_DB);
		await conn.collection('appuser_apikey').deleteMany({ userId: owner.userId });
		await conn.collection('appuser').deleteOne({ login: owner.login });
		await mongoose.disconnect();
	});

	it('create → resolve returns the owner UserContext', async () => {
		const created = await createApiKey(owner, 'test-key');
		expect(created.key.startsWith(`mk_${TEST_ORG}_`)).toBe(true);
		expect(created.prefix).toHaveLength(8);
		expect(created.expiresAt).toBeNull();

		const ctx = await resolveApiKey(created.key);
		expect(ctx).not.toBeNull();
		expect(ctx!.userId).toBe(owner.userId);
		expect(ctx!.login).toBe(owner.login);
		expect(ctx!.org).toBe(TEST_ORG);
		expect(ctx!.isAdmin).toBe(false);
	});

	it('list returns metadata without the hash or plaintext', async () => {
		const keys = await listApiKeys(owner.userId);
		expect(keys.length).toBeGreaterThan(0);
		for (const k of keys) {
			expect((k as any).keyHash).toBeUndefined();
			expect((k as any).key).toBeUndefined();
			expect(k.prefix).toHaveLength(8);
		}
	});

	it('revoke kills the key; resolve then fails', async () => {
		const created = await createApiKey(owner, 'revoke-me');
		expect(await resolveApiKey(created.key)).not.toBeNull();

		const revoked = await revokeApiKey(owner, created.prefix);
		expect(revoked).toBe(true);

		expect(await resolveApiKey(created.key)).toBeNull();
	});

	it('non-owner non-admin cannot revoke someone else\'s key', async () => {
		const created = await createApiKey(owner, 'protected');
		const revoked = await revokeApiKey({ userId: 'someone-else', isAdmin: false }, created.prefix);
		expect(revoked).toBe(false);
		expect(await resolveApiKey(created.key)).not.toBeNull();
	});

	it('admin can revoke any key', async () => {
		const created = await createApiKey(owner, 'admin-revocable');
		const revoked = await revokeApiKey({ userId: 'admin-x', isAdmin: true }, created.prefix);
		expect(revoked).toBe(true);
	});

	it('expired key resolves to null', async () => {
		const created = await createApiKey(owner, 'expired', { expiresInDays: 1 });
		const conn = await getConn(USER_DB);
		await conn.collection('appuser_apikey').updateOne(
			{ prefix: created.prefix },
			{ $set: { expiresAt: new Date(Date.now() - 1000).toISOString() } }
		);
		expect(await resolveApiKey(created.key)).toBeNull();
	});

	it('inactive owner kills all their keys immediately', async () => {
		const created = await createApiKey(owner, 'owner-disabled');
		const conn = await getConn(USER_DB);
		await conn.collection('appuser').updateOne({ login: owner.login }, { $set: { isActive: false } });
		expect(await resolveApiKey(created.key)).toBeNull();
		await conn.collection('appuser').updateOne({ login: owner.login }, { $set: { isActive: true } });
	});

	it('wrong secret resolves to null', async () => {
		expect(await resolveApiKey(`mk_${TEST_ORG}_${'f'.repeat(48)}`)).toBeNull();
	});
});
