import { machine } from '$lib/main/machine.js';
import { MachineRecordIdentity } from '$lib/main/index.js';

/**
 * Reactive dual-source record resolution — BL-24.
 *
 * A component receives either `(collection, collectionId)` or `(collection, data)`.
 * `data` wins when provided (controlled — e.g. DataList passes a store item); otherwise
 * the record is read reactively via `machine.store` (never `machine.collection` —
 * invariant CLAUDE.md 8) using the scheme's index field (default `id`).
 *
 * Extracted from the inline pattern in DataRecord.svelte (the documented contract,
 * CLAUDE.md §4 "DataRecord data source contract") so other collection+collectionId
 * consumers (ContextMenuContent, DataField, Fiche, ...) share one resolution path
 * instead of re-implementing it divergently (ContextMenuContent.svelte:40 used a loose
 * `== ` match against the raw store, ignoring `scheme.index` and never re-deriving).
 */
export function useRecordData(
	collection: () => string | undefined,
	source: () => { collectionId?: string | number; data?: Record<string, unknown> }
) {
	const scheme = $derived.by(() => {
		const c = collection();
		return c ? machine.logic.collectionOr(c, null) : null;
	});

	const queryId = $derived(MachineRecordIdentity.normalizeKey(source().collectionId));

	const recordStore = $derived.by(() => {
		const { data, collectionId } = source();
		const c = collection();
		if (data !== undefined || !c || collectionId === undefined) return null;
		return machine.store(c, MachineRecordIdentity.buildWhere(scheme?.index ?? 'id', queryId) as Record<string, unknown>);
	});

	const fetchedData = $derived(recordStore?.records?.[0] as Record<string, unknown> | undefined);

	const record = $derived(source().data ?? fetchedData);

	const resolvedCollectionId = $derived.by(() => {
		const { collectionId, data } = source();
		if (collectionId !== undefined) return collectionId;
		const idx = scheme?.index ?? 'id';
		return (data as Record<string, unknown> | undefined)?.[idx] as string | number | undefined;
	});

	return {
		get record() {
			return record;
		},
		get collectionId() {
			return resolvedCollectionId;
		},
		get scheme() {
			return scheme;
		}
	};
}
