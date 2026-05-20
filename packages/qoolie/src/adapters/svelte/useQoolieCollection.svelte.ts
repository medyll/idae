/**
 * useQoolieCollection — Svelte 5 reactive adapter for Qoolie collections.
 * Subscribes to IdbEventBus 'change' events → updates local $state.
 *
 * Usage:
 *   const { items } = useQoolieCollection(qoolie, 'users');
 *   // $items is reactive — updates on any mutation to the 'users' collection
 */
import type { Qoolie } from '../../lib/Qoolie.js';
import type { CollectionConfigMap } from '../../lib/types.js';

export function useQoolieCollection<T, C extends CollectionConfigMap>(
	qoolie: Qoolie<C>,
	collection: keyof C
): { items: T[] } {
	let items = $state<T[]>([]);

	$effect(() => {
		// Initial load
		const col = qoolie.collection[collection];
		items = (col.getAll() ?? []) as T[];

		// Subscribe to EventBus changes
		const bus = (qoolie as any).db?.idbDatabase?.eventBus;
		if (bus && typeof bus.addEventListener === 'function') {
			const handler = (e: Event) => {
				const detail = (e as CustomEvent).detail;
				if (detail?.collection === collection) {
					items = (col.getAll() ?? []) as T[];
				}
			};
			bus.addEventListener('change', handler as EventListener);
			return () => bus.removeEventListener('change', handler as EventListener);
		}
	});

	return { get items() { return items; } };
}

/**
 * useQoolieQuery — reactive where query with auto-refresh.
 *
 * Usage:
 *   const { items } = useQoolieCollection<User>(qoolie, 'users');
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
		items = (col.where(query) ?? []) as T[];

		const bus = (qoolie as any).db?.idbDatabase?.eventBus;
		if (bus && typeof bus.addEventListener === 'function') {
			const handler = (e: Event) => {
				const detail = (e as CustomEvent).detail;
				if (detail?.collection === collection) {
					items = (col.where(query) ?? []) as T[];
				}
			};
			bus.addEventListener('change', handler as EventListener);
			return () => bus.removeEventListener('change', handler as EventListener);
		}
	});

	return { get items() { return items; } };
}
