/**
 * useQoolieCollection — Svelte 5 reactive adapter for Qoolie collections.
 * Subscribes to idbEventBus 'change' events → updates local $state.
 *
 * Usage:
 *   const { items } = useQoolieCollection(qoolie, 'users');
 *   // items is reactive — updates on any mutation to the 'users' collection
 */
import type { Qoolie } from '../../lib/Qoolie.js';
import type { CollectionConfigMap } from '../../lib/types.js';
import { idbEventBus } from '../../lib/engine/IdbEventBus.js';

export function useQoolieCollection<T, C extends CollectionConfigMap>(
	qoolie: Qoolie<C>,
	collection: keyof C
): { items: T[] } {
	let items = $state<T[]>([]);

	$effect(() => {
		const col = qoolie.collection[collection];

		// Subscribe FIRST so we catch hydration events triggered by getAll()
		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail?.collection === collection) {
				items = (col.getAll() ?? []) as T[];
			}
		};
		idbEventBus.addEventListener('change', handler as EventListener);

		// Then initial load (may trigger hydration → event → handler above)
		items = (col.getAll() ?? []) as T[];

		return () => idbEventBus.removeEventListener('change', handler as EventListener);
	});

	return { get items() { return items; } };
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
): { items: T[] } {
	let items = $state<T[]>([]);

	$effect(() => {
		const col = qoolie.collection[collection];

		// Subscribe FIRST so we catch hydration events triggered by where()
		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail?.collection === collection) {
				items = (col.where(query) ?? []) as T[];
			}
		};
		idbEventBus.addEventListener('change', handler as EventListener);

		// Then initial load
		items = (col.where(query) ?? []) as T[];

		return () => idbEventBus.removeEventListener('change', handler as EventListener);
	});

	return { get items() { return items; } };
}
