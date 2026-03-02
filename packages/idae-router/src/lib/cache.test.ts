import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCacheStore, deepEqual } from './cache';
import type { CacheEntry } from './cache';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeEntry(overrides: Partial<CacheEntry> = {}): CacheEntry {
	return {
		data: { id: 1 },
		timestamp: Date.now(),
		url: '/api/users/1',
		status: 200,
		...overrides
	};
}

// ── createCacheStore ──────────────────────────────────────────────────────────

describe('createCacheStore (enabled)', () => {
	let store: ReturnType<typeof createCacheStore>;

	beforeEach(() => {
		store = createCacheStore(true);
	});

	it('returns undefined for an unknown key', () => {
		expect(store.get('GET /api/users/99')).toBeUndefined();
	});

	it('stores and retrieves an entry (cache hit)', () => {
		const entry = makeEntry();
		store.set('GET /api/users/1', entry);
		const hit = store.get('GET /api/users/1');
		expect(hit).toBeDefined();
		expect(hit!.entry).toBe(entry);
	});

	it('returns state "fresh" when age ≤ staleTime', () => {
		const entry = makeEntry({ timestamp: Date.now() - 100 }); // 100ms old
		store.set('k', entry);
		const hit = store.get('k', 60_000, 5_000); // staleTime=5000ms → 100ms < 5000ms → fresh
		expect(hit!.state).toBe('fresh');
	});

	it('returns state "stale" when staleTime < age ≤ ttl', () => {
		const entry = makeEntry({ timestamp: Date.now() - 3_000 }); // 3s old
		store.set('k', entry);
		const hit = store.get('k', 60_000, 0); // staleTime=0 → 3000ms > 0 → stale
		expect(hit!.state).toBe('stale');
	});

	it('evicts entry and returns undefined when age > ttl', () => {
		const entry = makeEntry({ timestamp: Date.now() - 10_000 }); // 10s ago
		store.set('k', entry);
		const hit = store.get('k', 5_000); // ttl=5000ms → expired
		expect(hit).toBeUndefined();
		// evicted — second call also returns undefined
		expect(store.get('k', 5_000)).toBeUndefined();
	});

	it('defaults ttl to 60_000ms (entry is fresh within default)', () => {
		const entry = makeEntry({ timestamp: Date.now() - 1_000 }); // 1s ago
		store.set('k', entry);
		expect(store.get('k')).toBeDefined(); // within 60s → hit
	});

	it('invalidates an exact key', () => {
		store.set('GET /api/a', makeEntry());
		store.set('GET /api/b', makeEntry());
		store.invalidate('GET /api/a');
		expect(store.get('GET /api/a')).toBeUndefined();
		expect(store.get('GET /api/b')).toBeDefined();
	});

	it('invalidates by glob prefix (ending with *)', () => {
		store.set('GET /api/users/1', makeEntry());
		store.set('GET /api/users/2', makeEntry());
		store.set('GET /api/posts/1', makeEntry());
		store.invalidate('GET /api/users/*');
		expect(store.get('GET /api/users/1')).toBeUndefined();
		expect(store.get('GET /api/users/2')).toBeUndefined();
		expect(store.get('GET /api/posts/1')).toBeDefined();
	});

	it('clears all entries with bare * glob', () => {
		store.set('a', makeEntry());
		store.set('b', makeEntry());
		store.invalidate('*');
		expect(store.get('a')).toBeUndefined();
		expect(store.get('b')).toBeUndefined();
	});

	it('clear() removes all entries', () => {
		store.set('a', makeEntry());
		store.set('b', makeEntry());
		store.clear();
		expect(store.get('a')).toBeUndefined();
		expect(store.get('b')).toBeUndefined();
	});
});

describe('createCacheStore (disabled)', () => {
	let store: ReturnType<typeof createCacheStore>;

	beforeEach(() => {
		store = createCacheStore(false);
	});

	it('get() always returns undefined', () => {
		expect(store.get('any-key')).toBeUndefined();
	});

	it('set() is a no-op (get still returns undefined after set)', () => {
		store.set('k', makeEntry());
		expect(store.get('k')).toBeUndefined();
	});

	it('invalidate() is a no-op (no throw)', () => {
		expect(() => store.invalidate('*')).not.toThrow();
	});

	it('clear() is a no-op (no throw)', () => {
		expect(() => store.clear()).not.toThrow();
	});
});

// ── deepEqual ────────────────────────────────────────────────────────────────

describe('deepEqual', () => {
	it('returns true for identical primitives', () => {
		expect(deepEqual(1, 1)).toBe(true);
		expect(deepEqual('x', 'x')).toBe(true);
		expect(deepEqual(null, null)).toBe(true);
	});

	it('returns false for different primitives', () => {
		expect(deepEqual(1, 2)).toBe(false);
		expect(deepEqual('a', 'b')).toBe(false);
	});

	it('returns false when types differ', () => {
		expect(deepEqual(1, '1')).toBe(false);
		expect(deepEqual(null, undefined)).toBe(false);
	});

	it('returns true for deeply equal objects', () => {
		expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
	});

	it('returns false for objects with different values', () => {
		expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
	});

	it('returns false for objects with different key counts', () => {
		expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
	});

	it('returns false when one is null and the other is an object', () => {
		expect(deepEqual(null, { a: 1 })).toBe(false);
		expect(deepEqual({ a: 1 }, null)).toBe(false);
	});

	it('returns true for equal arrays', () => {
		expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
	});

	it('returns false for arrays of different length', () => {
		expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
	});

	it('returns false for arrays with different elements', () => {
		expect(deepEqual([1, 2], [1, 3])).toBe(false);
	});

	it('returns false when one is an array and the other is an object', () => {
		expect(deepEqual([1], { 0: 1 })).toBe(false);
	});
});
