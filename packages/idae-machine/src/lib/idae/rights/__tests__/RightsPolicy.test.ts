// idae/rights/__tests__/RightsPolicy.test.ts
// Unit tests for IdaeRightsPolicy

import { describe, it, expect, beforeEach } from 'vitest';
import { IdaeRightsPolicy } from '$lib/idae/rights/RightsPolicy.js';
import type { AppUser, AppUserGrant } from '$lib/types/entity-types.js';
import type { MachineModel } from '$lib/types/index.js';

function makeUser(overrides: Partial<AppUser> & { grants?: AppUserGrant[] } = {}): AppUser {
	return {
		id: 1,
		code: 'user1',
		name: 'Test User',
		isActive: true,
		isLocked: false,
		appPermissions: {},
		...overrides
	} as unknown as AppUser;
}

function makeGrant(
	collection: string,
	perms: Partial<Record<'c' | 'r' | 'u' | 'd' | 'l' | 'x', boolean>> = {},
	extras: Record<string, unknown> = {}
): AppUserGrant {
	return {
		id: 1,
		gridFks: { appscheme: { code: collection } },
		...perms,
		...extras
	} as unknown as AppUserGrant;
}

function makeModel(): MachineModel {
	return {
		vehicle: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			rights: { ops: ['R', 'C', 'U', 'D', 'L'], public: ['R', 'L'], default: ['R'] }
		},
		category: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {},
			rights: { ops: ['R', 'L'] }
		},
		restricted: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fkRelations: {}
		}
	};
}

describe('IdaeRightsPolicy', () => {
	let policy: IdaeRightsPolicy;
	let model: MachineModel;

	beforeEach(() => {
		policy = new IdaeRightsPolicy();
		model = makeModel();
		policy.initialize(model);
	});

	describe('publicOps', () => {
		it('returns public ops for collection with public policy', () => {
			expect(policy.publicOps('vehicle')).toEqual(['R', 'L']);
		});

		it('returns empty array for collection without public policy', () => {
			expect(policy.publicOps('category')).toEqual([]);
		});

		it('returns empty array for unknown collection', () => {
			expect(policy.publicOps('nonexistent')).toEqual([]);
		});
	});

	describe('getPolicy', () => {
		it('returns rights policy for collection', () => {
			const p = policy.getPolicy('vehicle');
			expect(p).toBeDefined();
			expect(p?.ops).toEqual(['R', 'C', 'U', 'D', 'L']);
		});

		it('returns undefined for collection without rights', () => {
			expect(policy.getPolicy('restricted')).toBeUndefined();
		});
	});

	describe('getAllowedOps', () => {
		it('returns ops from policy', () => {
			expect(policy.getAllowedOps('vehicle')).toEqual(['R', 'C', 'U', 'D', 'L']);
		});

		it('returns ALL_OPS when no policy defined', () => {
			const ops = policy.getAllowedOps('restricted');
			expect(ops).toEqual(['C', 'R', 'U', 'D', 'L', 'X']);
		});
	});

	describe('getDefaultOps', () => {
		it('returns default ops from policy', () => {
			expect(policy.getDefaultOps('vehicle')).toEqual(['R']);
		});

		it('returns empty array when no default', () => {
			expect(policy.getDefaultOps('category')).toEqual([]);
		});
	});

	describe('grantsFor', () => {
		it('returns empty array for null user', () => {
			expect(policy.grantsFor(null as unknown as AppUser)).toEqual([]);
		});

		it('returns empty array for user without grants', () => {
			const user = makeUser();
			expect(policy.grantsFor(user)).toEqual([]);
		});

		it('normalizes grant with schemeCode', () => {
			const user = makeUser({
				grants: [makeGrant('vehicle', { r: true, l: true }, { schemeCode: 'vehicle' })]
			});
			const normalized = policy.grantsFor(user);
			expect(normalized).toHaveLength(1);
			expect(normalized[0].collection).toBe('vehicle');
			expect(normalized[0].permissions).toEqual(['R', 'L']);
		});

		it('normalizes grant with fks.appscheme.code (legacy)', () => {
			const user = makeUser({
				grants: [makeGrant('vehicle', { r: true })]
			});
			const normalized = policy.grantsFor(user);
			expect(normalized).toHaveLength(1);
			expect(normalized[0].collection).toBe('vehicle');
			expect(normalized[0].permissions).toEqual(['R']);
		});

		it('uses wildcard "*" when no schemeCode', () => {
			const grant = { id: 1, r: true } as unknown as AppUserGrant;
			const user = makeUser({ grants: [grant] });
			const normalized = policy.grantsFor(user);
			expect(normalized).toHaveLength(1);
			expect(normalized[0].collection).toBe('*');
		});

		it('filters out revoked grants', () => {
			const grant = makeGrant('vehicle', { r: true }, {
				schemeCode: 'vehicle',
				revokedAt: new Date().toISOString()
			});
			const user = makeUser({ grants: [grant] });
			expect(policy.grantsFor(user)).toEqual([]);
		});

		it('filters out future grants (validFrom)', () => {
			const future = new Date(Date.now() + 1_000_000).toISOString();
			const grant = makeGrant('vehicle', { r: true }, {
				schemeCode: 'vehicle',
				validFrom: future
			});
			const user = makeUser({ grants: [grant] });
			expect(policy.grantsFor(user)).toEqual([]);
		});

		it('filters out expired grants (validUntil)', () => {
			const past = new Date(Date.now() - 1_000_000).toISOString();
			const grant = makeGrant('vehicle', { r: true }, {
				schemeCode: 'vehicle',
				validUntil: past
			});
			const user = makeUser({ grants: [grant] });
			expect(policy.grantsFor(user)).toEqual([]);
		});

		it('normalizes multiple permissions', () => {
			const user = makeUser({
				grants: [makeGrant('vehicle', { c: true, r: true, u: true, d: true }, { schemeCode: 'vehicle' })]
			});
			const normalized = policy.grantsFor(user);
			expect(normalized).toHaveLength(1);
			expect(normalized[0].permissions).toEqual(['C', 'R', 'U', 'D']);
		});

		it('skips grant with no permissions', () => {
			const user = makeUser({
				grants: [makeGrant('vehicle', {}, { schemeCode: 'vehicle' })]
			});
			expect(policy.grantsFor(user)).toEqual([]);
		});

		it('handles multiple grants', () => {
			const user = makeUser({
				grants: [
					makeGrant('vehicle', { r: true }, { schemeCode: 'vehicle' }),
					makeGrant('category', { c: true, d: true }, { schemeCode: 'category' })
				]
			});
			const normalized = policy.grantsFor(user);
			expect(normalized).toHaveLength(2);
			expect(normalized[0].collection).toBe('vehicle');
			expect(normalized[1].collection).toBe('category');
		});

		it('preserves userId, userType, userGroup in normalized grant', () => {
			const grant = makeGrant('vehicle', { r: true }, {
				schemeCode: 'vehicle',
				userId: 42,
				userType: 'employee',
				userGroup: 'admin'
			});
			const user = makeUser({ grants: [grant] });
			const normalized = policy.grantsFor(user);
			expect(normalized[0].userId).toBe('42');
			expect(normalized[0].userType).toBe('employee');
			expect(normalized[0].userGroup).toBe('admin');
		});
	});
});
