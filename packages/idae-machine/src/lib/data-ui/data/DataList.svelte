<!--
DataList.svelte
Pure data provider — fetches records, applies sort/group/page, exposes via snippets.
@role data-provider
@prop {string} collection - Collection name
@prop {Record<string,unknown>} [where] - Query filter
@prop {SortBy | SortBy[]} [sortBy] - Sort specification
@prop {string} [groupBy] - Group by field name
@prop {number} [pageSize] - Items per page (0 = no pagination)
@prop {number} [page] - Current page (1-based)
@snippet children(items, index, fieldValues, pagination, groups)
-->
<script lang="ts" generics="COL extends Record<string, unknown>">
	import type { SortBy } from '$lib/types/machine-model.js';
	import { machine } from '$lib/main/machine.js';
	import { signals } from '$lib/main/machineSignals.svelte.js';
	import { sortItems, groupItems } from '$lib/main-ui/explorer/explorerUtils.js';

	interface PaginationInfo {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	}

	let {
		collection,
		where,
		sortBy,
		groupBy,
		pageSize = 0,
		page = 1,
		children
	}: {
		collection: string;
		where?: Record<string, unknown>;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		pageSize?: number;
		page?: number;
		children: (props: {
			items: COL[];
			index: string;
			fieldValues: Record<string, unknown>;
			pagination: PaginationInfo;
			groups?: Map<string, COL[]>;
		}) => void;
	} = $props();

	const store = $derived(collection ? machine.store[collection] : undefined);
	const collLogic = $derived(collection ? safeCollection(collection) : null);
	const indexField = $derived(collLogic?.template?.index ?? 'id');
	const fieldValues = $derived(collLogic?.collectionValues ?? {});
	const defaultSort = $derived(collLogic?.defaultSort ?? [{ field: indexField, direction: 'asc' }]);
	const effectiveSort = $derived(sortBy ?? defaultSort);

	// Reactive to dataVersion changes
	const _dataVersion = $derived(signals.dataVersion);

	const rawItems = $derived.by(() => {
		if (!store) return [] as COL[];
		if (where) {
			return (store.where(where) ?? []) as COL[];
		}
		return (store.getAll() ?? []) as COL[];
	});

	const sortedItems = $derived.by(() => {
		if (!rawItems.length) return rawItems;
		return sortItems(rawItems, effectiveSort);
	});

	const paginatedItems = $derived.by(() => {
		if (!pageSize || pageSize <= 0) return sortedItems;
		const start = (page - 1) * pageSize;
		return sortedItems.slice(start, start + pageSize);
	});

	const total = $derived(rawItems.length);
	const totalPages = $derived(pageSize > 0 ? Math.ceil(total / pageSize) : 1);
	const pagination = $derived<PaginationInfo>({
		page,
		pageSize,
		total,
		totalPages
	});

	const groups = $derived.by(() => {
		if (!groupBy || !paginatedItems.length) return undefined;
		return groupItems(paginatedItems, groupBy);
	});

	function safeCollection(name: string) {
		try {
			return machine.logic.collection(name);
		} catch {
			return null;
		}
	}

	let errorMessage = $state<string | null>(null);

	$effect(() => {
		if (!safeCollection(collection)) {
			errorMessage = `Collection '${collection}' non trouvée dans le schéma.`;
		} else {
			errorMessage = null;
		}
	});
</script>

{#if errorMessage}
	<div class="error-message">{errorMessage}</div>
{:else}
	{@render children({
		items: paginatedItems,
		index: indexField,
		fieldValues,
		pagination,
		groups
	})}
{/if}

<style>
	.error-message { color: red; padding: 1rem; }
</style>
