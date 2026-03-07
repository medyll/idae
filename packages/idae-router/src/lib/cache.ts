/**
 * In-memory SWR (stale-while-revalidate) cache engine for `idae-router`.
 * No external dependencies. No localStorage persistence.
 *
 * @module cache
 * @since 0.2.0
 */

import type { CacheOptions } from './types.js';

/**
 * A single cache entry stored by {@link CacheStore}.
 *
 * @public
 * @since 0.2.0
 */
export interface CacheEntry {
	/** The fetched data payload (typed as `unknown`; cast at point of use). */
	data: unknown;
	/** Unix timestamp (ms) when the entry was stored. */
	timestamp: number;
	/** The resolved URL the data was fetched from. */
	url: string;
	/** HTTP status code of the response. */
	status: number;
}

/** @internal Default time-to-live if not supplied by the caller. */
const DEFAULT_TTL = 60_000;
/** @internal Default stale time if not supplied by the caller. */
const DEFAULT_STALE = 0;

/**
 * The public interface for a cache store instance.
 * Obtained via {@link createCacheStore}.
 *
 * @public
 * @since 0.2.0
 */
export interface CacheStore {
	/**
	 * Retrieve a cache entry by key, applying TTL and staleTime rules.
	 *
	 * - Returns `undefined` when the entry is not found or has expired (age > ttl).
	 * - Returns `{ entry, state: 'fresh' }` when age ≤ staleTime.
	 * - Returns `{ entry, state: 'stale' }` when staleTime < age ≤ ttl.
	 *
	 * @param key - Cache key (typically `"METHOD resolvedUrl"`).
	 * @param ttl - Time-to-live in ms. Defaults to `60_000`.
	 * @param staleTime - Grace period in ms before revalidation is triggered. Defaults to `0`.
	 * @returns Hit result or `undefined` on miss/expiry.
	 * @since 0.2.0
	 * @example
	 * ```ts
	 * const hit = store.get('GET /api/users/42', 30_000, 5_000);
	 * if (hit?.state === 'stale') triggerRevalidation();
	 * ```
	 */
	get(
		key: string,
		ttl?: number,
		staleTime?: number
	): { entry: CacheEntry; state: 'fresh' | 'stale' } | undefined;

	/**
	 * Store a cache entry.
	 *
	 * @param key - Cache key.
	 * @param entry - The entry to store.
	 * @since 0.2.0
	 */
	set(key: string, entry: CacheEntry): void;

	/**
	 * Invalidate one or more cache entries by key or glob pattern.
	 *
	 * - Exact key: removes that single entry.
	 * - Pattern ending in `*` (e.g. `'/api/users/*'`): removes all entries whose key
	 *   starts with the prefix before `*`.
	 * - A bare `*` clears all entries.
	 *
	 * @param pattern - Exact key or glob pattern.
	 * @since 0.2.0
	 * @example
	 * ```ts
	 * store.invalidate('GET /api/users/42');       // exact
	 * store.invalidate('GET /api/users/*');        // all user entries
	 * store.invalidate('*');                       // full clear
	 * ```
	 */
	invalidate(pattern: string): void;

	/**
	 * Remove all entries from the cache.
	 *
	 * @since 0.2.0
	 */
	clear(): void;
}

/**
 * Create an in-memory SWR cache store.
 *
 * When `enabled` is `false`, every method is a no-op and `get` always returns
 * `undefined`. This allows the router to import and call the store unconditionally
 * while still honouring `cache: false` in {@link RouterOptions}.
 *
 * @public
 * @param enabled - Pass `true` to enable caching; `false` for a no-op store.
 * @returns A `CacheStore` instance.
 * @since 0.2.0
 * @example
 * ```ts
 * const store = createCacheStore(true);
 * store.set('GET /api/users/1', { data: user, timestamp: Date.now(), url: '…', status: 200 });
 * const hit = store.get('GET /api/users/1', 60_000, 5_000);
 * ```
 */
export function createCacheStore(enabled: boolean): CacheStore {
	if (!enabled) {
		return {
			get: () => undefined,
			set: () => undefined,
			invalidate: () => undefined,
			clear: () => undefined
		};
	}

	const map = new Map<string, CacheEntry>();

	return {
		get(key: string, ttl = DEFAULT_TTL, staleTime = DEFAULT_STALE) {
			const entry = map.get(key);
			if (!entry) return undefined;

			const age = Date.now() - entry.timestamp;

			if (age > ttl) {
				// expired — evict
				map.delete(key);
				return undefined;
			}

			const state: 'fresh' | 'stale' = age <= staleTime ? 'fresh' : 'stale';
			return { entry, state };
		},

		set(key: string, entry: CacheEntry) {
			map.set(key, entry);
		},

		invalidate(pattern: string) {
			if (pattern === '*') {
				map.clear();
				return;
			}
			if (pattern.endsWith('*')) {
				const prefix = pattern.slice(0, -1); // strip trailing *
				for (const key of map.keys()) {
					if (key.startsWith(prefix)) map.delete(key);
				}
				return;
			}
			map.delete(pattern);
		},

		clear() {
			map.clear();
		}
	};
}

/**
 * Deep-equality comparison (recursive, no external dependencies).
 * Handles primitives, arrays, plain objects, `null`, and `undefined`.
 *
 * Used internally to detect whether a navigation context has changed before
 * re-invoking a route's `action`.
 *
 * @public
 * @param a - First value.
 * @param b - Second value.
 * @returns `true` when `a` and `b` are deeply equal.
 * @since 0.2.0
 * @example
 * ```ts
 * deepEqual({ id: 1 }, { id: 1 }); // true
 * deepEqual([1, 2],   [1, 3]);     // false
 * ```
 */
export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (a === null || b === null) return false;
	if (typeof a !== typeof b) return false;
	if (typeof a !== 'object') return false;

	if (Array.isArray(a) !== Array.isArray(b)) return false;

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!deepEqual(a[i], b[i])) return false;
		}
		return true;
	}

	const objA = a as Record<string, unknown>;
	const objB = b as Record<string, unknown>;
	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);
	if (keysA.length !== keysB.length) return false;
	for (const k of keysA) {
		if (!Object.prototype.hasOwnProperty.call(objB, k)) return false;
		if (!deepEqual(objA[k], objB[k])) return false;
	}
	return true;
}

/** Re-export for convenience — consumers can import `CacheOptions` from `cache` directly. */
export type { CacheOptions };
