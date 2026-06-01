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
	typeCode?:    string;
}

const ALL_OPS   = { c: true,  r: true,  u: true,  d: true,  l: true,  x: true  };
const WRITE_OPS = { c: true,  r: true,  u: true,  d: false, l: true,  x: false };
const READ_OPS  = { c: false, r: true,  u: false, d: false, l: true,  x: false };

interface SeedType {
	code:        string;
	name:        string;
	color?:      string;
	icon?:       string;
	order:       number;
	description: string;
	typeLevel:   number;
}

const DEMO_TYPES: SeedType[] = [
	{ code: 'admin',   name: 'Administrator', color: '#c0392b', icon: 'shield',  order: 1, description: 'Full system access',          typeLevel: 100 },
	{ code: 'manager', name: 'Manager',       color: '#2980b9', icon: 'user-tie', order: 2, description: 'Write access, no delete',     typeLevel: 50  },
	{ code: 'viewer',  name: 'Viewer',        color: '#7f8c8d', icon: 'eye',     order: 3, description: 'Read-only access',            typeLevel: 10  },
];

interface SeedGroup {
	code:        string;
	name:        string;
	description: string;
	ops:         typeof ALL_OPS;
}

const DEMO_GROUPS: SeedGroup[] = [
	{ code: 'admins',   name: 'Administrators', description: 'Full grants',  ops: ALL_OPS   },
	{ code: 'managers', name: 'Managers',       description: 'CRU + L',      ops: WRITE_OPS },
	{ code: 'viewers',  name: 'Viewers',        description: 'Read-only',    ops: READ_OPS  },
];

const DEMO_USERS: SeedUser[] = [
	{ login: 'admin',   password: 'admin123',   isAdmin: true,  directGrant: true,  directOps: ALL_OPS,  typeCode: 'admin',   groupCode: 'admins'   },
	{ login: 'manager', password: 'manager123', isAdmin: false, directGrant: false,                      typeCode: 'manager', groupCode: 'managers' },
	{ login: 'user',    password: 'user123',    isAdmin: false, directGrant: true,  directOps: READ_OPS, typeCode: 'viewer',  groupCode: 'viewers'  },
	{ login: 'viewer',  password: 'viewer123',  isAdmin: false, directGrant: false,                      typeCode: 'viewer',  groupCode: 'viewers'  },
];

export async function seedUsers(conn: Connection): Promise<void> {
	const users       = conn.collection('appuser');
	const grants      = conn.collection('appuser_grant');
	const groups      = conn.collection('appuser_group');
	const types       = conn.collection('appuser_type');
	const assignments = conn.collection('appuser_assignment');

	// 1. Seed types
	const typeIdByCode = new Map<string, string>();
	for (const t of DEMO_TYPES) {
		const result = await types.findOneAndUpdate(
			{ code: t.code },
			{
				$set: {
					code:        t.code,
					name:        t.name,
					color:       t.color,
					icon:        t.icon,
					order:       t.order,
					description: t.description,
					typeLevel:   t.typeLevel,
					isSystem:    false,
				},
				$setOnInsert: { createdAt: new Date() },
			},
			{ upsert: true, returnDocument: 'after' }
		);
		typeIdByCode.set(t.code, String(result!._id));
		console.log(`  [type] ${t.code} (level=${t.typeLevel}) seeded`);
	}

	// 2. Seed groups + group grants
	const groupIdByCode = new Map<string, string>();
	for (const g of DEMO_GROUPS) {
		const result = await groups.findOneAndUpdate(
			{ code: g.code },
			{
				$set: {
					code:        g.code,
					name:        g.name,
					description: g.description,
					isSystem:    false,
				},
				$setOnInsert: { createdAt: new Date() },
			},
			{ upsert: true, returnDocument: 'after' }
		);
		const groupId = String(result!._id);
		groupIdByCode.set(g.code, groupId);

		await grants.updateOne(
			{ grantType: 'group', groupId, schemeCode: '*' },
			{
				$set: {
					grantType:  'group',
					groupId,
					schemeCode: '*',
					...g.ops,
					grantedBy:  'system',
					grantedAt:  new Date().toISOString(),
				},
			},
			{ upsert: true }
		);
		console.log(`  [group] ${g.code} grant seeded`);
	}

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

		if (demo.groupCode) {
			const groupId = groupIdByCode.get(demo.groupCode);
			if (groupId) {
				await assignments.updateOne(
					{ userId, assignmentType: 'group', groupId },
					{
						$set: {
							assignmentType: 'group',
							userId,
							groupId,
							assignedBy:     'system',
							assignedAt:     new Date().toISOString(),
						},
					},
					{ upsert: true }
				);
			}
		}

		if (demo.typeCode) {
			const typeId = typeIdByCode.get(demo.typeCode);
			if (typeId) {
				await assignments.updateOne(
					{ userId, assignmentType: 'role', typeId },
					{
						$set: {
							assignmentType: 'role',
							userId,
							typeId,
							assignedBy:     'system',
							assignedAt:     new Date().toISOString(),
						},
					},
					{ upsert: true }
				);
			}
		}

		const parts: string[] = [];
		if (demo.directGrant)        parts.push('direct');
		if (demo.groupCode)          parts.push(`group:${demo.groupCode}`);
		if (demo.typeCode)           parts.push(`type:${demo.typeCode}`);
		console.log(`  [user] ${demo.login} (admin=${demo.isAdmin}) → ${parts.join(', ')}`);
	}
}
