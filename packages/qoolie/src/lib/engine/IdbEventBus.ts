/**
 * IdbEventBus — Pure JS event bus for IndexedDB mutations
 * Replaces idbqlEvent.svelte.ts — no $state, no Svelte.
 * Extends EventTarget for native event dispatching.
 */
import type { IdbEventOp, IdbEventDetail } from './types.js';

/**
 * Handler function for collection events.
 */
export type EventBusHandler = (detail: IdbEventDetail) => void;

/**
 * IdbEventBus — EventTarget-based event bus for IndexedDB operations.
 * Maintains a plain-object dataState mirror of collection data.
 */
export class IdbEventBus extends EventTarget {
	/** Plain-object mirror of collection data (no $state). */
	dataState: Record<string, any[]> = {};

	/**
	 * Emit a mutation event and update dataState.
	 * @param collection - The collection name.
	 * @param op - The operation type (add, put, update, delete, clear).
	 * @param data - The affected data.
	 */
	emit(collection: string, op: IdbEventOp, data?: any): void {
		// Update dataState mirror
		this.syncDataState(collection, op, data);

		// Dispatch native event
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { collection, op, data } as IdbEventDetail
			})
		);
	}

	/**
	 * Subscribe to events for a specific collection.
	 * @param collection - The collection name to filter on.
	 * @param handler - Callback receiving the event detail.
	 * @returns Unsubscribe function.
	 */
	on(collection: string, handler: EventBusHandler): () => void {
		const wrapped = (e: Event) => {
			const detail = (e as CustomEvent).detail as IdbEventDetail;
			if (detail.collection === collection) {
				handler(detail);
			}
		};
		this.addEventListener('change', wrapped as EventListener);
		return () => this.removeEventListener('change', wrapped as EventListener);
	}

	/**
	 * Unsubscribe a handler from a collection.
	 */
	off(collection: string, handler: EventBusHandler): void {
		// Note: off requires the same function reference. Use the return value of on() instead.
	}

	/**
	 * Set the full dataState for a collection (used during initialization).
	 */
	setState(collection: string, data: any[]): void {
		this.dataState[collection] = data;
	}

	/**
	 * Get the current dataState for a collection.
	 */
	getState(collection: string): any[] {
		return this.dataState[collection] || [];
	}

	private syncDataState(collection: string, op: IdbEventOp, data?: any): void {
		const current = this.dataState[collection] || [];

		switch (op) {
			case 'add':
			case 'put':
				if (Array.isArray(data)) {
					// Batch operation — merge all items
					for (const item of data) {
						const idx = current.findIndex((d) => d?.id === item?.id);
						if (idx >= 0) {
							current[idx] = item;
						} else {
							current.push(item);
						}
					}
				} else if (data) {
					const idx = current.findIndex((d) => d?.id === data?.id);
					if (idx >= 0) {
						current[idx] = data;
					} else {
						current.push(data);
					}
				}
				break;
			case 'update':
				if (data && !Array.isArray(data)) {
					const idx = current.findIndex((d) => d?.id === data?.id);
					if (idx >= 0) {
						current[idx] = { ...current[idx], ...data };
					}
				}
				break;
			case 'delete':
				if (data?.id) {
					const idx = current.findIndex((d) => d?.id === data.id);
					if (idx >= 0) current.splice(idx, 1);
				}
				break;
			case 'clear':
				this.dataState[collection] = [];
				return;
			case 'load':
				// dataState already set by caller (e.g. feed()) — no-op here
				return;
		}

		this.dataState[collection] = current;
	}
}

/** Singleton event bus instance. */
export const idbEventBus = new IdbEventBus();
