/**
 * useQoolieCollection — Svelte 5 reactive adapter for Qoolie collections.
 * Subscribes to idbEventBus 'change' events → updates local $state.
 *
 * Reads return a ResultSet<T> (array + .sortBy/.groupBy/.getPage/.distinct/...) so
 * downstream code keeps full query ergonomics on the reactive snapshot. The
 * ResultSet wrapping is re-applied per access on a fresh array copy — safe with
 * Svelte's $state proxy, no shared mutation, and Svelte still tracks the read.
 *
 * Usage:
 *   const { items } = useQoolieCollection(qoolie, 'users');
 *   const sorted = items.sortBy({ name: 'asc' });
 *   const grouped = items.groupBy('role');
 */
import type { Qoolie } from '../../lib/Qoolie.js';
import type { CollectionConfigMap } from '../../lib/types.js';
import { idbEventBus } from '../../lib/engine/IdbEventBus.js';
import { getResultSet } from '../../lib/engine/IdbCollection.js';
import type { ResultSet } from '../../lib/engine/types.js';

export function useQoolieCollection<T, C extends CollectionConfigMap>(
	qoolie: Qoolie<C>,
	collection: keyof C
): { items: ResultSet<T> } {
	let items = $state<T[]>([]);

	$effect(() => {
		const col = qoolie.collection[collection];

		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail?.collection === collection) {
				items = [...((col.getAll() ?? []) as T[])];
			}
		};
		idbEventBus.addEventListener('change', handler as EventListener);

		items = [...((col.getAll() ?? []) as T[])];

		return () => idbEventBus.removeEventListener('change', handler as EventListener);
	});

	// ⚠️ DO NOT "simplify" this to `return items` or a Proxy that "is" the array.
	// The $effect above REASSIGNS the `items` binding (`items = [...]`) on every
	// change. A returned value/Proxy captured once would go stale — the caller
	// holds the old reference and never sees reassignments. The getter re-reads
	// the LIVE binding on each access, so (a) the caller always sees the latest
	// snapshot and (b) the read happens inside the caller's reactive frame →
	// Svelte tracks it → $derived/$effect re-run. This getter-returning-object is
	// the idiomatic Svelte 5 cross-boundary reactive pattern; the obvious-looking
	// alternatives silently break reactivity. See machine.store() for the rename
	// to `.records` and the same warning.
	return {
		get items() {
			return getResultSet([...items]) as ResultSet<T>;
		}
	};
}

/**
 * useQoolieQuery — reactive where query with auto-refresh.
 *
 * Usage:
 *   const { items: adults } = useQoolieQuery<User>(qoolie, 'users', { age: { gte: 18 } });
 */
export function useQoolieQuery<T, C extends CollectionConfigMap>(
	qoolie: Qoolie<C>,
	collection: keyof C,
	query: Record<string, any>
): { items: ResultSet<T> } {
	let items = $state<T[]>([]);

	$effect(() => {
		const col = qoolie.collection[collection];

		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail?.collection === collection) {
				items = [...((col.where(query) ?? []) as T[])];
			}
		};
		idbEventBus.addEventListener('change', handler as EventListener);

		items = [...((col.where(query) ?? []) as T[])];

		return () => idbEventBus.removeEventListener('change', handler as EventListener);
	});

	// Same getter-object contract as useQoolieCollection — see the warning there.
	// Do not collapse to a bare return; the `items` binding is reassigned.
	return {
		get items() {
			return getResultSet([...items]) as ResultSet<T>;
		}
	};
}
