import type { AppUser, AppUserGrant, PermissionCode } from '$lib/types/entity-types.js';
import type { MachineModel, MachineRightsPolicy } from '$lib/types/index.js';
import { getGrantDecoder } from '$lib/machine/ext/hooks.js';

const ALL_OPS: PermissionCode[] = ['C', 'R', 'U', 'D', 'L', 'X'];

export class MachineRights {
	#currentUser: AppUser | null = null;
	#grants: AppUserGrant[] = [];
	#authEnabled = false;
	#policies: Record<string, MachineRightsPolicy> = {};

	/**
	 * Load structural rights policies from the MachineModel.
	 * Call once at Machine.boot() — after model is resolved.
	 */
	setPolicies(policies: Record<string, MachineRightsPolicy>): void {
		this.#policies = policies;
	}

	/** Extract and load rights policies directly from a MachineModel. */
	loadPoliciesFromModel(model: MachineModel | undefined): void {
		if (!model) return;
		const policies: Record<string, MachineRightsPolicy> = {};
		for (const [name, col] of Object.entries(model)) {
			if ('rights' in col && col.rights) policies[name] = col.rights;
		}
		this.setPolicies(policies);
	}

	/**
	 * Enable auth and set the current user + their grants.
	 * Once called, open mode is disabled — all access goes through checkAccess().
	 */
	setCurrentUser(user: AppUser | null, grants: AppUserGrant[] = []): void {
		this.#authEnabled = true;
		this.#currentUser = user;
		this.#grants = grants;
	}

	/** Disable auth and return to open mode (all access allowed). */
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
	 * 1. `ops` policy blocks the operation → deny (structural, absolute)
	 * 2. Auth not initialized → allow (open mode, dev/test)
	 * 3. `public` policy includes the operation → allow (no auth required)
	 * 4. No user → deny
	 * 5. User inactive or locked → deny
	 * 6. appPermissions.ADMIN → allow all (within ops)
	 * 7. Explicit grant (temporal + collection scoped) → respected
	 * 8. `default` policy includes the operation → allow (authenticated fallback)
	 * 9. Deny
	 */
	checkAccess(collection: string, operation: PermissionCode = 'R'): boolean {
		const policy = this.#policies[collection];

		// 1. Structural ops whitelist — hard deny regardless of user/grants
		const allowedOps = policy?.ops ?? ALL_OPS;
		if (!allowedOps.includes(operation)) return false;

		// 2. Open mode (auth not initialized)
		if (!this.#authEnabled) return true;

		// 3. Public access
		if (policy?.public?.includes(operation)) return true;

		// 4–5. User checks
		if (!this.#currentUser) return false;
		if (!this.#currentUser.isActive || this.#currentUser.isLocked) return false;

		// 6. Admin override
		if (this.#currentUser.appPermissions?.ADMIN) return true;

		// 7. Explicit grants
		const permField = operation.toLowerCase() as 'c' | 'r' | 'u' | 'd' | 'l' | 'x';
		const now = new Date();

		const granted = this.#grants.some(grant => {
			if (grant.revokedAt) return false;
			if (grant.validFrom && new Date(grant.validFrom as string) > now) return false;
			if (grant.validUntil && new Date(grant.validUntil as string) < now) return false;
			const decoder = getGrantDecoder();
			const schemeCode = decoder
				? decoder.decodeSchemeCode(grant as unknown as Record<string, unknown>)
				: ((grant as Record<string, unknown>).schemeCode as string | undefined) ??
					((grant.fks as Record<string, Record<string, unknown>>)?.appscheme?.code as string | undefined);
			if (schemeCode && schemeCode !== collection && schemeCode !== '*') return false;
			return grant[permField] === true;
		});
		if (granted) return true;

		// 8. Default policy for authenticated users
		if (policy?.default?.includes(operation)) return true;

		return false;
	}

	/**
	 * Enumerate all collections the current user has access to for the given operation.
	 * Returns an array of collection names where checkAccess(collection, op) returns true.
	 * Used by menu generators and UI components that need to filter collections by rights.
	 */
	allowedCollections(operation: PermissionCode = 'R'): string[] {
		const result: string[] = [];
		for (const [name] of Object.entries(this.#policies)) {
			if (this.checkAccess(name, operation)) {
				result.push(name);
			}
		}
		return result;
	}
}

export const machineRights = new MachineRights();
export default machineRights;
