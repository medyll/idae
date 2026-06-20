import { getConn } from '../middleware/dbRouter.js';
import { getCurrentOrg } from '../middleware/orgContext.js';
import type { Permission } from '../middleware/permission.js';

/**
 * Free-form constraint payload — interpreted by route handlers.
 * Common keys: territory, maxAmount, departments, businessUnits.
 */
export interface GrantConstraints {
	territory?:     string;
	maxAmount?:     number;
	departments?:   string[];
	businessUnits?: string[];
	[key: string]:  unknown;
}

/**
 * Grant document shape as stored in MongoDB appuser_grant collection.
 * FK references stored as flat scalars (not nested objects).
 */
interface GrantDoc {
	grantType:  'user' | 'group' | 'type';
	userId?:    string;   // grantType === 'user'
	groupId?:   string;   // grantType === 'group'
	typeId?:    string;   // grantType === 'type'
	schemeCode: string;   // collection name, '*' = all collections
	c: boolean;
	r: boolean;
	u: boolean;
	d: boolean;
	l: boolean;
	x: boolean;
	validFrom?:   string | null;
	validUntil?:  string | null;
	revokedAt?:   string | null;
	constraints?: GrantConstraints;
}

export interface ResolvedAccess {
	allowed:      boolean;
	/** Merged constraints from matching grants. Undefined = unrestricted. */
	constraints?: GrantConstraints;
}

/**
 * Assignment document shape — links users to groups and types.
 * assignmentType: 'group' → groupId is set
 * assignmentType: 'role'  → typeId is set
 */
interface AssignmentDoc {
	assignmentType: 'group' | 'role';
	userId:    string;
	groupId?:  string;
	typeId?:   string;
	validFrom?:  string | null;
	validUntil?: string | null;
	revokedAt?:  string | null;
}

interface UserSources {
	groupIds: string[];
	typeIds:  string[];
}

interface GrantsCacheEntry {
	grants: GrantDoc[];
	expiry: number;
}

interface SourcesCacheEntry {
	sources: UserSources;
	expiry:  number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

class GrantService {
	#grantsCache  = new Map<string, GrantsCacheEntry>();
	#sourcesCache = new Map<string, SourcesCacheEntry>();

	/**
	 * Resolve access — returns allowed flag + merged constraints from matching grants.
	 * Cascades through direct user grants + group grants + type grants.
	 *
	 * Constraint merge logic (most permissive wins):
	 *   - If any matching grant has no constraints → unrestricted (constraints: undefined)
	 *   - maxAmount     → max across grants
	 *   - departments   → union
	 *   - businessUnits → union
	 *   - territory     → undefined if any conflict, kept if all agree
	 */
	async resolveAccess(
		userId:     string,
		collection: string,
		operation:  Permission
	): Promise<ResolvedAccess> {
		const grants = await this.#loadGrants(userId, collection);
		const field  = operation.toLowerCase() as 'c' | 'r' | 'u' | 'd' | 'l' | 'x';
		const now    = new Date();

		const matching = grants.filter(g => {
			if (g.revokedAt) return false;
			if (g.validFrom  && new Date(g.validFrom)  > now) return false;
			if (g.validUntil && new Date(g.validUntil) < now) return false;
			return g[field] === true;
		});

		if (matching.length === 0) return { allowed: false };

		// Most permissive: any grant without constraints → unrestricted
		const hasUnrestricted = matching.some(g => !g.constraints || Object.keys(g.constraints).length === 0);
		if (hasUnrestricted) return { allowed: true };

		return { allowed: true, constraints: mergeConstraints(matching.map(g => g.constraints!)) };
	}

	/**
	 * List every active grant doc for a user (direct + group + type cascade), with no
	 * collection filter. Used to hydrate the client's MachineRights after login so the
	 * UI gate matches server enforcement. `schemeCode` is preserved flat per grant.
	 */
	async listUserGrants(userId: string): Promise<GrantDoc[]> {
		const org = getCurrentOrg();
		try {
			const sources = await this.#loadSources(userId);
			const conn    = await getConn(`${org}_machine_user`);

			const orClauses: Record<string, unknown>[] = [
				{ grantType: 'user', userId },
			];
			if (sources.groupIds.length) {
				orClauses.push({ grantType: 'group', groupId: { $in: sources.groupIds } });
			}
			if (sources.typeIds.length) {
				orClauses.push({ grantType: 'type', typeId: { $in: sources.typeIds } });
			}

			return await conn.collection('appuser_grant').find({
				$or: orClauses,
				revokedAt: { $in: [null, undefined] as any },
			}).toArray() as unknown as GrantDoc[];
		} catch {
			return [];
		}
	}

	/**
	 * Boolean wrapper for resolveAccess — convenience for callers that don't need constraints.
	 */
	async checkGrant(
		userId:     string,
		collection: string,
		operation:  Permission
	): Promise<boolean> {
		return (await this.resolveAccess(userId, collection, operation)).allowed;
	}

	/**
	 * Load assignments for user → groupIds + typeIds (active only).
	 */
	async #loadSources(userId: string): Promise<UserSources> {
		const org    = getCurrentOrg();
		const srcKey = `${org}:${userId}`;
		const cached = this.#sourcesCache.get(srcKey);
		if (cached && cached.expiry > Date.now()) return cached.sources;

		try {
			const conn = await getConn(`${org}_machine_user`);
			const docs = await conn.collection('appuser_assignment').find({
				userId,
				revokedAt: { $in: [null, undefined] as any },
			}).toArray() as unknown as AssignmentDoc[];

			const now = new Date();
			const valid = docs.filter(a => {
				if (a.validFrom  && new Date(a.validFrom)  > now) return false;
				if (a.validUntil && new Date(a.validUntil) < now) return false;
				return true;
			});

			const sources: UserSources = {
				groupIds: valid.filter(a => a.assignmentType === 'group' && a.groupId).map(a => a.groupId!),
				typeIds:  valid.filter(a => a.assignmentType === 'role'  && a.typeId ).map(a => a.typeId!),
			};

			this.#sourcesCache.set(srcKey, { sources, expiry: Date.now() + CACHE_TTL_MS });
			return sources;
		} catch {
			return { groupIds: [], typeIds: [] };
		}
	}

	/**
	 * Load all grants matching user + collection (direct + group + type cascade).
	 */
	async #loadGrants(userId: string, collection: string): Promise<GrantDoc[]> {
		const org      = getCurrentOrg();
		const cacheKey = `${org}:${userId}:${collection}`;
		const cached   = this.#grantsCache.get(cacheKey);

		if (cached && cached.expiry > Date.now()) return cached.grants;

		try {
			const sources = await this.#loadSources(userId);
			const conn    = await getConn(`${org}_machine_user`);

			const orClauses: Record<string, unknown>[] = [
				{ grantType: 'user', userId },
			];
			if (sources.groupIds.length) {
				orClauses.push({ grantType: 'group', groupId: { $in: sources.groupIds } });
			}
			if (sources.typeIds.length) {
				orClauses.push({ grantType: 'type', typeId: { $in: sources.typeIds } });
			}

			const grants = await conn.collection('appuser_grant').find({
				$or: orClauses,
				schemeCode: { $in: [collection, '*'] },
			}).toArray() as unknown as GrantDoc[];

			this.#grantsCache.set(cacheKey, { grants, expiry: Date.now() + CACHE_TTL_MS });
			return grants;
		} catch {
			return [];
		}
	}

	/**
	 * Invalidate all cached entries for a user across every org (call after
	 * grant/assignment change). Keys are `${org}:${userId}[:${collection}]`.
	 */
	invalidateUser(userId: string): void {
		for (const key of this.#sourcesCache.keys()) {
			if (key.endsWith(`:${userId}`)) this.#sourcesCache.delete(key);
		}
		for (const key of this.#grantsCache.keys()) {
			if (key.includes(`:${userId}:`)) this.#grantsCache.delete(key);
		}
	}

	/** Flush entire cache (call after bulk update). */
	flush(): void {
		this.#grantsCache.clear();
		this.#sourcesCache.clear();
	}
}

/**
 * Merge multiple constraint objects → most permissive union.
 * Arrays unioned; numbers maxed; strings undefined on conflict.
 */
function mergeConstraints(list: GrantConstraints[]): GrantConstraints {
	const merged: GrantConstraints = {};

	for (const c of list) {
		// maxAmount → max
		if (typeof c.maxAmount === 'number') {
			merged.maxAmount = Math.max(merged.maxAmount ?? 0, c.maxAmount);
		}
		// departments → union
		if (Array.isArray(c.departments)) {
			merged.departments = Array.from(new Set([...(merged.departments ?? []), ...c.departments]));
		}
		// businessUnits → union
		if (Array.isArray(c.businessUnits)) {
			merged.businessUnits = Array.from(new Set([...(merged.businessUnits ?? []), ...c.businessUnits]));
		}
		// territory → keep if all agree, drop on conflict
		if (typeof c.territory === 'string') {
			if (merged.territory === undefined) merged.territory = c.territory;
			else if (merged.territory !== c.territory) delete merged.territory;
		}
		// Extension keys → first-wins (caller can override semantics)
		for (const k of Object.keys(c)) {
			if (['maxAmount', 'departments', 'businessUnits', 'territory'].includes(k)) continue;
			if (merged[k] === undefined) merged[k] = c[k];
		}
	}

	return merged;
}

export const grantService = new GrantService();
