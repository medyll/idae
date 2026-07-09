// idae/rights/RightsPolicy.ts
// Domain implementation of RightsPolicy + GrantDecoder bridge.
// Decodes grant.fks/appscheme/code → neutral NormalizedGrant form.

import type { RightsPolicy, NormalizedGrant, AppUser, PermissionCode } from '$lib/main/ext/interfaces.js';
import type { GrantDecoder } from '$lib/main/ext/hooks.js';
import type { AppUserGrant, MachineModel, MachineRightsPolicy } from '$lib/types/index.js';

const ALL_OPS: PermissionCode[] = ['C', 'R', 'U', 'D', 'L', 'X'];

export class IdaeRightsPolicy implements RightsPolicy, GrantDecoder {
	private model: MachineModel | null = null;
	private policies: Record<string, MachineRightsPolicy> = {};

	initialize(model: MachineModel): void {
		this.model = model;
		this.loadPoliciesFromModel(model);
	}

	private loadPoliciesFromModel(model: MachineModel): void {
		const policies: Record<string, MachineRightsPolicy> = {};
		for (const [name, col] of Object.entries(model)) {
			if ('rights' in col && col.rights) policies[name] = col.rights;
		}
		this.policies = policies;
	}

	decodeSchemeCode(grant: Record<string, unknown>): string | undefined {
		return (grant.schemeCode as string | undefined)
			?? ((grant.fks as Record<string, Record<string, unknown>> | undefined)?.appscheme?.code as string | undefined)
			?? ((grant.gridFks as Record<string, Record<string, unknown>> | undefined)?.appscheme?.code as string | undefined);
	}

	grantsFor(user: AppUser): NormalizedGrant[] {
		if (!user) return [];
		const grants: AppUserGrant[] = (user as any).grants ?? [];
		const normalized: NormalizedGrant[] = [];

		for (const grant of grants) {
			const n = this.#normalizeGrant(grant);
			if (n) normalized.push(n);
		}
		return normalized;
	}

	#normalizeGrant(grant: AppUserGrant): NormalizedGrant | null {
		if (grant.revokedAt) return null;
		const now = new Date();
		if (grant.validFrom && new Date(grant.validFrom as string) > now) return null;
		if (grant.validUntil && new Date(grant.validUntil as string) < now) return null;

		const permissions: PermissionCode[] = [];
		const permFields: Array<[PermissionCode, 'c' | 'r' | 'u' | 'd' | 'l' | 'x']> = [
			['C', 'c'], ['R', 'r'], ['U', 'u'], ['D', 'd'], ['L', 'l'], ['X', 'x']
		];
		for (const [permCode, permField] of permFields) {
			if (grant[permField] === true) permissions.push(permCode);
		}
		if (permissions.length === 0) return null;

		const schemeCode = this.decodeSchemeCode(grant as unknown as Record<string, unknown>);
		const normalized: NormalizedGrant = {
			collection: schemeCode ?? '*',
			permissions
		};
		if ((grant as any).userId !== undefined) normalized.userId = String((grant as any).userId);
		if ((grant as any).userType !== undefined) normalized.userType = String((grant as any).userType);
		if ((grant as any).userGroup !== undefined) normalized.userGroup = String((grant as any).userGroup);
		return normalized;
	}

	publicOps(collection: string): PermissionCode[] {
		return this.policies[collection]?.public ?? [];
	}

	getPolicy(collection: string): MachineRightsPolicy | undefined {
		return this.policies[collection];
	}

	getAllowedOps(collection: string): PermissionCode[] {
		return this.policies[collection]?.ops ?? ALL_OPS;
	}

	getDefaultOps(collection: string): PermissionCode[] {
		return this.policies[collection]?.default ?? [];
	}
}
