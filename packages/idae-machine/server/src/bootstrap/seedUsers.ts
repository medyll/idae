/**
 * Seed demo appuser + appuser_grant + appuser_group + appuser_assignment docs
 * into {org}_machine_user. Idempotent.
 *
 * Demo data:
 *   - admin    : direct user grant, all ops on '*'
 *   - user     : direct user grant, R+L on '*'
 *   - viewer   : NO direct grant — only group cascade via 'viewers' group
 */
import type { Connection } from 'mongoose';
import { hashPassword } from '../services/AuthService.js';

interface SeedUser {
	login:        string;
	password:     string;
	isAdmin:      boolean;
	directGrant:  boolean;
	directOps?:   { c: boolean; r: boolean; u: boolean; d: boolean; l: boolean; x: boolean };
	groupCode?:   string;
}

const ALL_OPS  = { c: true,  r: true,  u: true,  d: true,  l: true,  x: true  };
const READ_OPS = { c: false, r: true,  u: false, d: false, l: true,  x: false };

const DEMO_USERS: SeedUser[] = [
	{ login: 'admin',  password: 'admin123',  isAdmin: true,  directGrant: true,  directOps: ALL_OPS  },
	{ login: 'user',   password: 'user123',   isAdmin: false, directGrant: true,  directOps: READ_OPS },
	{ login: 'viewer', password: 'viewer123', isAdmin: false, directGrant: false, groupCode: 'viewers' },
];

export async function seedUsers(conn: Connection): Promise<void> {
	const users       = conn.collection('appuser');
	const grants      = conn.collection('appuser_grant');
	const groups      = conn.collection('appuser_group');
	const assignments = conn.collection('appuser_assignment');

	// 1. Seed groups
	const viewersGroup = await groups.findOneAndUpdate(
		{ code: 'viewers' },
		{
			$set: {
				code:        'viewers',
				name:        'Viewers',
				description: 'Read-only access',
				isSystem:    false,
			},
			$setOnInsert: { createdAt: new Date() },
		},
		{ upsert: true, returnDocument: 'after' }
	);
	const viewersGroupId = String(viewersGroup!._id);

	// 2. Group grant: viewers → R+L on '*'
	await grants.updateOne(
		{ grantType: 'group', groupId: viewersGroupId, schemeCode: '*' },
		{
			$set: {
				grantType:  'group',
				groupId:    viewersGroupId,
				schemeCode: '*',
				...READ_OPS,
				grantedBy:  'system',
				grantedAt:  new Date().toISOString(),
			},
		},
		{ upsert: true }
	);
	console.log(`  [group] viewers → R+L grant seeded`);

	// 3. Seed users + grants + assignments
	for (const demo of DEMO_USERS) {
		const passwordHash = await hashPassword(demo.password);

		const result = await users.findOneAndUpdate(
			{ login: demo.login },
			{
				$set: {
					login:          demo.login,
					passwordHash,
					email:          `${demo.login}@demo.local`,
					emailVerified:  false,
					isActive:       true,
					isLocked:       false,
					appPermissions: demo.isAdmin ? { ADMIN: true } : {},
				},
				$setOnInsert: { createdAt: new Date() },
			},
			{ upsert: true, returnDocument: 'after' }
		);
		const userId = String(result!._id);

		if (demo.directGrant && demo.directOps) {
			await grants.updateOne(
				{ grantType: 'user', userId, schemeCode: '*' },
				{
					$set: {
						grantType:  'user',
						userId,
						schemeCode: '*',
						...demo.directOps,
						grantedBy:  'system',
						grantedAt:  new Date().toISOString(),
					},
				},
				{ upsert: true }
			);
		}

		if (demo.groupCode === 'viewers') {
			await assignments.updateOne(
				{ userId, assignmentType: 'group', groupId: viewersGroupId },
				{
					$set: {
						assignmentType: 'group',
						userId,
						groupId:        viewersGroupId,
						assignedBy:     'system',
						assignedAt:     new Date().toISOString(),
					},
				},
				{ upsert: true }
			);
		}

		const source = demo.directGrant ? 'direct' : `group:${demo.groupCode}`;
		console.log(`  [user] ${demo.login} (admin=${demo.isAdmin}) → ${source}`);
	}
}
