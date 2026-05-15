import type { AppUser, AppUserGrant, PermissionCode } from '$lib/types/schema-types.js';

type PermissionField = 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete' | 'canList' | 'canExecute' | 'canAdmin';

const OPERATION_MAP: Record<PermissionCode, PermissionField> = {
	C: 'canCreate',
	R: 'canRead',
	U: 'canUpdate',
	D: 'canDelete',
	L: 'canList',
	X: 'canExecute',
	A: 'canAdmin'
};

class MachineRights {
	#currentUser: AppUser | null = null;
	#grants: AppUserGrant[] = [];
	#authEnabled = false;

	/**
	 * Enable auth and set the current user + their grants.
	 * Once called, open mode is disabled — all access goes through checkAccess().
	 */
	setCurrentUser(user: AppUser | null, grants: AppUserGrant[] = []): void {
		this.#authEnabled = true;
		this.#currentUser = user;
		this.#grants = grants;
	}

	/**
	 * Disable auth and return to open mode (all access allowed).
	 */
	clearCurrentUser(): void {
		this.#authEnabled = false;
		this.#currentUser = null;
		this.#grants = [];
	}

	get currentUser(): AppUser | null {
		return this.#currentUser;
	}

	get isAuthEnabled(): boolean {
		return this.#authEnabled;
	}

	/**
	 * Check if the current user has access to perform `operation` on `collection`.
	 *
	 * Resolution order:
	 * 1. Auth not initialized → allow (open mode)
	 * 2. No user → deny
	 * 3. User inactive or locked → deny
	 * 4. appPermissions.ADMIN → allow all
	 * 5. No grants configured → allow (no restrictions set up)
	 * 6. Check grants: temporal scope + collection scope + permission field
	 */
	checkAccess(collection: string, operation: PermissionCode = 'R'): boolean {
		if (!this.#authEnabled) return true;
		if (!this.#currentUser) return false;
		if (!this.#currentUser.isActive || this.#currentUser.isLocked) return false;
		if (this.#currentUser.appPermissions?.ADMIN) return true;
		if (this.#grants.length === 0) return true;

		const permField = OPERATION_MAP[operation];
		const now = new Date();

		return this.#grants.some(grant => {
			if (grant.revokedAt) return false;
			if (grant.validFrom && new Date(grant.validFrom as string) > now) return false;
			if (grant.validUntil && new Date(grant.validUntil as string) < now) return false;
			const schemeCode = (grant.gridFks as Record<string, any>)?.appscheme?.code as string | undefined;
			if (schemeCode && schemeCode !== collection && schemeCode !== '*') return false;
			return grant[permField] === true;
		});
	}
}

export const machineRights = new MachineRights();
export default machineRights;
