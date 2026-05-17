/**
 * Seed demo appuser + appuser_grant docs into {org}_machine_user.
 * Idempotent — upserts by login / userId+schemeCode.
 */
import type { Connection } from 'mongoose';
import { hashPassword } from '../services/AuthService.js';

interface SeedUser {
	login:    string;
	password: string;
	isAdmin:  boolean;
}

const DEMO_USERS: SeedUser[] = [
	{ login: 'admin', password: 'admin123', isAdmin: true  },
	{ login: 'user',  password: 'user123',  isAdmin: false },
];

export async function seedUsers(conn: Connection): Promise<void> {
	const users = conn.collection('appuser');
	const grants = conn.collection('appuser_grant');

	for (const demo of DEMO_USERS) {
		const passwordHash = await hashPassword(demo.password);

		const result = await users.findOneAndUpdate(
			{ login: demo.login },
			{
				$set: {
					login: demo.login,
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

		// Grant: admin → all ops on '*', user → R+L on '*'
		await grants.updateOne(
			{ grantType: 'user', userId, schemeCode: '*' },
			{
				$set: {
					grantType:  'user',
					userId,
					schemeCode: '*',
					c:          demo.isAdmin,
					r:          true,
					u:          demo.isAdmin,
					d:          demo.isAdmin,
					l:          true,
					x:          demo.isAdmin,
					grantedBy:  'system',
					grantedAt:  new Date().toISOString(),
				},
			},
			{ upsert: true }
		);

		console.log(`  [user] ${demo.login} (admin=${demo.isAdmin}) → grant seeded`);
	}
}
