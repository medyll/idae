import { getConn } from '../middleware/dbRouter.js';
import { config } from '../config.js';
import type { Permission } from '../middleware/permission.js';

/**
 * Grant document shape as stored in MongoDB appuser_grant collection.
 * FK references stored as flat scalars (not nested objects).
 */
interface GrantDoc {
	grantType:  'user' | 'group' | 'type';
	userId?:    string;    // grantType === 'user'
	groupId?:   string;    // grantType === 'group'
	typeId?:    string;    // grantType === 'type'
	schemeCode: string;    // collection name, '*' = all collections
	c: boolean;
	r: boolean;
	u: boolean;
	d: boolean;
	l: boolean;
	x: boolean;
	validFrom?:  string | null;
	validUntil?: string | null;
	revokedAt?:  string | null;
}

/** TTL cache entry */
interface CacheEntry {
	grants:  GrantDoc[];
	expiry:  number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

class GrantService {
	#cache = new Map<string, CacheEntry>();

	/**
	 * Check if userId has permission for operation on collection.
	 * Checks direct user grants only (group/type cascade = phase C).
	 */
	async checkGrant(
		userId:     string,
		collection: string,
		operation:  Permission
	): Promise<boolean> {
		const grants = await this.#loadUserGrants(userId, collection);
		const field  = operation.toLowerCase() as 'c' | 'r' | 'u' | 'd' | 'l' | 'x';
		const now    = new Date();

		return grants.some(grant => {
			if (grant.revokedAt) return false;
			if (grant.validFrom  && new Date(grant.validFrom)  > now) return false;
			if (grant.validUntil && new Date(grant.validUntil) < now) return false;
			return grant[field] === true;
		});
	}

	async #loadUserGrants(userId: string, collection: string): Promise<GrantDoc[]> {
		const cacheKey = `${userId}:${collection}`;
		const cached   = this.#cache.get(cacheKey);

		if (cached && cached.expiry > Date.now()) return cached.grants;

		try {
			const conn   = await getConn(`${config.org}_machine_user`);
			const grants = await conn.collection('appuser_grant').find({
				grantType:  'user',
				userId,
				schemeCode: { $in: [collection, '*'] },
			}).toArray() as unknown as GrantDoc[];

			this.#cache.set(cacheKey, { grants, expiry: Date.now() + CACHE_TTL_MS });
			return grants;
		} catch {
			// DB unavailable — fail open in dev, fail closed should be enforced at middleware level
			return [];
		}
	}

	/** Invalidate all cached grants for a user (call after grant change). */
	invalidateUser(userId: string): void {
		for (const key of this.#cache.keys()) {
			if (key.startsWith(`${userId}:`)) this.#cache.delete(key);
		}
	}

	/** Flush entire cache (call after bulk grant update). */
	flush(): void {
		this.#cache.clear();
	}
}

export const grantService = new GrantService();
