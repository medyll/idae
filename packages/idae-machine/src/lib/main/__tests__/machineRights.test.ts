/**
 * machineRights.test.ts
 * Unit tests for MachineRights — checkAccess(), setPolicies(), loadPoliciesFromModel(), RBAC.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { machineRights } from '$lib/main/machine/MachineRights.js';
import type { AppUser, AppUserGrant } from '$lib/types/entity-types.js';
import type { MachineModel } from '$lib/types/index.js';

function makeUser(overrides: Partial<AppUser> = {}): AppUser {
	return {
		id: 1,
		code: 'user1',
		name: 'Test User',
		isActive: true,
		isLocked: false,
		appPermissions: {},
		...overrides,
	} as unknown as AppUser;
}

function makeGrant(collection: string, perms: Partial<Record<'c' | 'r' | 'u' | 'd' | 'l' | 'x', boolean>> = {}): AppUserGrant {
	return {
		id: 1,
		gridFks: { appscheme: { code: collection } },
		...perms,
	} as unknown as AppUserGrant;
}

beforeEach(() => {
	machineRights.clearCurrentUser();
	machineRights.setPolicies({});
});

describe('MachineRights — open mode (no auth)', () => {
	it('allows any operation in open mode', () => {
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(true);
		expect(machineRights.checkAccess('vehicle', 'C')).toBe(true);
		expect(machineRights.checkAccess('vehicle', 'D')).toBe(true);
	});

	it('isAuthEnabled is false before setCurrentUser', () => {
		expect(machineRights.isAuthEnabled).toBe(false);
	});

	it('currentUser is null in open mode', () => {
		expect(machineRights.currentUser).toBeNull();
	});
});

describe('MachineRights — ops policy (structural deny)', () => {
	it('denies ops not in the allowed list', () => {
		machineRights.setPolicies({ vehicle: { ops: ['R', 'L'] } });
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(true);
		expect(machineRights.checkAccess('vehicle', 'C')).toBe(false);
		expect(machineRights.checkAccess('vehicle', 'D')).toBe(false);
	});

	it('ops deny is absolute — even admin cannot bypass', () => {
		machineRights.setPolicies({ vehicle: { ops: ['R'] } });
		const admin = makeUser({ appPermissions: { ADMIN: true } } as never);
		machineRights.setCurrentUser(admin, []);
		expect(machineRights.checkAccess('vehicle', 'C')).toBe(false);
	});
});

describe('MachineRights — public policy', () => {
	it('allows public operation without a user', () => {
		machineRights.setPolicies({ vehicle: { public: ['R', 'L'] } });
		machineRights.setCurrentUser(null, []);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(true);
		expect(machineRights.checkAccess('vehicle', 'C')).toBe(false);
	});
});

describe('MachineRights — user checks', () => {
	it('denies when user is null (auth enabled)', () => {
		machineRights.setCurrentUser(null, []);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(false);
	});

	it('denies inactive user', () => {
		const user = makeUser({ isActive: false });
		machineRights.setCurrentUser(user, [makeGrant('vehicle', { r: true })]);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(false);
	});

	it('denies locked user', () => {
		const user = makeUser({ isLocked: true });
		machineRights.setCurrentUser(user, [makeGrant('vehicle', { r: true })]);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(false);
	});
});

describe('MachineRights — admin override', () => {
	it('admin user passes all checks within ops', () => {
		const admin = makeUser({ appPermissions: { ADMIN: true } } as never);
		machineRights.setCurrentUser(admin, []);
		expect(machineRights.checkAccess('vehicle', 'C')).toBe(true);
		expect(machineRights.checkAccess('vehicle', 'D')).toBe(true);
		expect(machineRights.checkAccess('any-collection', 'X')).toBe(true);
	});
});

describe('MachineRights — explicit grants', () => {
	it('allows operation via matching collection grant', () => {
		const user = makeUser();
		machineRights.setCurrentUser(user, [makeGrant('vehicle', { r: true })]);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(true);
		expect(machineRights.checkAccess('vehicle', 'C')).toBe(false);
	});

	it('allows via wildcard grant (*)', () => {
		const user = makeUser();
		const grant = makeGrant('*', { r: true, l: true });
		machineRights.setCurrentUser(user, [grant]);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(true);
		expect(machineRights.checkAccess('category', 'L')).toBe(true);
	});

	it('ignores revoked grants', () => {
		const user = makeUser();
		const grant = { ...makeGrant('vehicle', { r: true }), revokedAt: new Date().toISOString() } as unknown as AppUserGrant;
		machineRights.setCurrentUser(user, [grant]);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(false);
	});

	it('ignores grant not yet valid (validFrom in future)', () => {
		const user = makeUser();
		const future = new Date(Date.now() + 1_000_000).toISOString();
		const grant = { ...makeGrant('vehicle', { r: true }), validFrom: future } as unknown as AppUserGrant;
		machineRights.setCurrentUser(user, [grant]);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(false);
	});

	it('ignores expired grant (validUntil in past)', () => {
		const user = makeUser();
		const past = new Date(Date.now() - 1_000_000).toISOString();
		const grant = { ...makeGrant('vehicle', { r: true }), validUntil: past } as unknown as AppUserGrant;
		machineRights.setCurrentUser(user, [grant]);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(false);
	});
});

describe('MachineRights — default policy', () => {
	it('allows authenticated user via default policy', () => {
		machineRights.setPolicies({ vehicle: { default: ['R', 'L'] } });
		const user = makeUser();
		machineRights.setCurrentUser(user, []);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(true);
		expect(machineRights.checkAccess('vehicle', 'C')).toBe(false);
	});
});

describe('MachineRights — loadPoliciesFromModel', () => {
	const model: MachineModel = {
		vehicle: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fks: {},
			rights: { ops: ['R', 'L'], default: ['R'] },
		},
		category: {
			keyPath: '++id',
			fields: { id: { type: 'id' } },
			fks: {},
			// no rights
		},
	};

	it('loads policies from model collections that have rights', () => {
		machineRights.loadPoliciesFromModel(model);
		const user = makeUser();
		machineRights.setCurrentUser(user, []);
		// vehicle has default R — should allow
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(true);
		// vehicle has ops [R, L] — C should be denied structurally
		expect(machineRights.checkAccess('vehicle', 'C')).toBe(false);
	});

	it('does nothing when model is undefined', () => {
		machineRights.loadPoliciesFromModel(undefined);
		expect(machineRights.checkAccess('vehicle', 'R')).toBe(true); // open mode
	});

	it('collections without rights have no policy (allow all ops)', () => {
		machineRights.loadPoliciesFromModel(model);
		const user = makeUser();
		machineRights.setCurrentUser(user, [makeGrant('category', { c: true })]);
		expect(machineRights.checkAccess('category', 'C')).toBe(true);
	});
});

describe('MachineRights — clearCurrentUser', () => {
	it('returns to open mode after clearCurrentUser', () => {
		const user = makeUser();
		machineRights.setCurrentUser(user, []);
		expect(machineRights.isAuthEnabled).toBe(true);

		machineRights.clearCurrentUser();
		expect(machineRights.isAuthEnabled).toBe(false);
		expect(machineRights.currentUser).toBeNull();
		// Open mode: all allowed
		expect(machineRights.checkAccess('vehicle', 'D')).toBe(true);
	});
});
