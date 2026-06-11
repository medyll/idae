/**
 * RbacAdminService tests — real Mongo lifecycle: create user → assign group →
 * set grant → resolve effective access → audit query.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { getConn } from '../middleware/dbRouter.js';
import { grantService } from '../services/GrantService.js';
import {
	listUsers, createUser, setUserActive, assignGroup,
	listGroups, listGrants, setGrant, checkUserGrant, queryAudit,
} from '../services/RbacAdminService.js';

const TEST_ORG = 'vitest';
const USER_DB  = `${TEST_ORG}_machine_user`;

const LOGIN = 'rbacadmin-tester';
const GROUP = 'rbacadmin-group';

async function cleanup() {
	const conn = await getConn(USER_DB);
	const user = await conn.collection('appuser').findOne({ login: LOGIN });
	if (user) {
		const userId = String(user._id);
		await conn.collection('appuser_grant').deleteMany({ userId });
		await conn.collection('appuser_assignment').deleteMany({ userId });
		await conn.collection('appuser').deleteOne({ login: LOGIN });
	}
	const group = await conn.collection('appuser_group').findOne({ code: GROUP });
	if (group) {
		await conn.collection('appuser_grant').deleteMany({ groupId: String(group._id) });
		await conn.collection('appuser_group').deleteOne({ code: GROUP });
	}
	grantService.flush();
}

describe('RbacAdminService', () => {
	beforeAll(async () => {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.mongodbUri);
		}
		(config as any).org = TEST_ORG;
		await cleanup();
		const conn = await getConn(USER_DB);
		await conn.collection('appuser_group').insertOne({ code: GROUP, name: 'Test group', isSystem: false } as any);
	});

	afterAll(async () => {
		await cleanup();
		await mongoose.disconnect();
	});

	it('createUser hashes the password and refuses duplicates and short passwords', async () => {
		const user = await createUser({ login: LOGIN, password: 'secret-pass-1', email: 'x@y.z' });
		expect(user.login).toBe(LOGIN);
		expect(user.isAdmin).toBe(false);
		expect((user as any).passwordHash).toBeUndefined();

		const conn = await getConn(USER_DB);
		const doc = await conn.collection('appuser').findOne({ login: LOGIN }) as any;
		expect(doc.passwordHash).toBeTruthy();
		expect(doc.passwordHash).not.toBe('secret-pass-1');
		expect(doc.isActive).toBe(true);

		await expect(createUser({ login: LOGIN, password: 'secret-pass-1' })).rejects.toThrow('already exists');
		await expect(createUser({ login: 'other', password: 'short' })).rejects.toThrow('at least 8');
	});

	it('listUsers returns the user without hash', async () => {
		const users = await listUsers();
		const me = users.find((u) => u.login === LOGIN);
		expect(me).toBeTruthy();
		expect((me as any).passwordHash).toBeUndefined();
	});

	it('no grant → access denied', async () => {
		const access = await checkUserGrant(LOGIN, 'vehicle', 'R');
		expect(access.allowed).toBe(false);
	});

	it('setGrant (direct user) → access allowed', async () => {
		await setGrant({ grantType: 'user', login: LOGIN, schemeCode: 'vehicle', c: false, r: true, u: false, d: false, l: true, x: false });
		const read = await checkUserGrant(LOGIN, 'vehicle', 'R');
		expect(read.allowed).toBe(true);
		const del = await checkUserGrant(LOGIN, 'vehicle', 'D');
		expect(del.allowed).toBe(false);
	});

	it('group grant cascades through assignment', async () => {
		await setGrant({ grantType: 'group', groupCode: GROUP, schemeCode: 'brand', c: true, r: true, u: true, d: false, l: true, x: false });
		// Not assigned yet → no access.
		expect((await checkUserGrant(LOGIN, 'brand', 'C')).allowed).toBe(false);

		await assignGroup(LOGIN, GROUP);
		expect((await checkUserGrant(LOGIN, 'brand', 'C')).allowed).toBe(true);
		expect((await checkUserGrant(LOGIN, 'brand', 'D')).allowed).toBe(false);
	});

	it('listGrants filters by login and groupCode', async () => {
		const userGrants = await listGrants({ login: LOGIN });
		expect(userGrants.some((g) => g.schemeCode === 'vehicle')).toBe(true);
		const groupGrants = await listGrants({ groupCode: GROUP });
		expect(groupGrants.some((g) => g.schemeCode === 'brand')).toBe(true);
	});

	it('listGroups attaches grants', async () => {
		const groups = await listGroups();
		const g = groups.find((x) => x.code === GROUP) as any;
		expect(g).toBeTruthy();
		expect(g.grants.some((gr: any) => gr.schemeCode === 'brand')).toBe(true);
	});

	it('setUserActive(false) disables the user', async () => {
		await setUserActive(LOGIN, false);
		const conn = await getConn(USER_DB);
		const doc = await conn.collection('appuser').findOne({ login: LOGIN }) as any;
		expect(doc.isActive).toBe(false);
		await setUserActive(LOGIN, true);
		await expect(setUserActive('ghost-no-such-user', false)).rejects.toThrow('not found');
	});

	it('queryAudit returns newest-first capped entries', async () => {
		const conn = await getConn(USER_DB);
		await conn.collection('appuser_audit').insertMany([
			{ action: 'execute', login: LOGIN, resourceType: 'rbactest', status: 'success', performedAt: '2026-01-01T00:00:00Z' },
			{ action: 'execute', login: LOGIN, resourceType: 'rbactest', status: 'success', performedAt: '2026-01-02T00:00:00Z' },
		] as any);

		const entries = await queryAudit({ login: LOGIN, resourceType: 'rbactest' });
		expect(entries.length).toBe(2);
		expect(entries[0].performedAt).toBe('2026-01-02T00:00:00Z');

		const since = await queryAudit({ login: LOGIN, resourceType: 'rbactest', since: '2026-01-02T00:00:00Z' });
		expect(since.length).toBe(1);

		await conn.collection('appuser_audit').deleteMany({ resourceType: 'rbactest' });
	});
});
