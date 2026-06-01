<!--
DataList.svelte
Data provider + renderer — fetches, sorts, groups, paginates, iterates.
Autonomous by default: renders DataRecord (template.presentation fields) when no snippet provided.
Consumers can override via the item snippet.

@prop {string} collection
@prop {Where<COL>} [where]
@prop {SortBy | SortBy[]} [sortBy]
@prop {string} [groupBy]
@prop {'list'|'table'|'grid'} [mode='list'] - Visual layout mode
@prop {string[]} [showFields] - Fields to display (overrides view)
@prop {'full'|'flat'|'fk'|'focus'|string} [view='full'] - Named view driving the field list (full=all, flat=non-fk, fk=fk-only, focus=identity subset)
@prop {(record: COL) => void} [onItemClick] - Click handler for items/rows
@prop {number} [pageSize] - chunk size for infinite scroll or page size for classic pagination
@prop {number} [page] - 1-based (only used when infiniteScroll=false)
@prop {boolean} [infiniteScroll=true] - append items as user scrolls (uses IntersectionObserver on sentinel)
@prop {string} [listClass] - CSS class for <ul>
@prop {string} [groupClass] - CSS class for group wrapper <div>
@snippet item({ record, idx, fieldValues }) - override record rendering (optional — DataRecord used by default)
@snippet groupHeader({ key, count }) - renders group section header (optional)
@snippet empty() - renders empty state (optional — "—" shown by default)
@snippet footer({ pagination }) - renders pagination/footer (optional)
-->
<script lang="ts" generics="COL extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { SortBy, Where } from '$lib/types/index.js';
	import { machine } from '$lib/main/machine.js';
	import { sortItems, groupItems, groupItemsResolved, parseFkGroupKey, fkObjectLabel } from '$lib/data-ui/utils/data-utils.js';
	import { useMachinePrefs } from '$lib/data-ui/utils/useMachinePrefs.svelte.js';
	import DataRecord from '$lib/data-ui/data/DataRecord.svelte';
	import TableInline from '$lib/data-ui/data/TableInline.svelte';
	import DataSort from '$lib/data-ui/controls/DataSort.svelte';
	import DataGroup from '$lib/data-ui/controls/DataGroup.svelte';
	import DataFind from '$lib/data-ui/controls/DataFind.svelte';
	import DataToolbar from '$lib/data-ui/controls/DataToolbar.svelte';
	import { parseLink } from '$lib/main/frame/linkParser.js';

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
		mode: modeProp = 'list',
		showFields,
		view = 'full',
		onItemClick,
		pageSize = 0,
		page = 1,
		infiniteScroll = true,
		listClass,
		groupClass,
		link,
		linkVars,
		linkCollectionField,
		showToolbar = true,
		usePrefs = true,
		prefsScope: prefsScopeProp,
		item: itemSnippet,
		groupHeader: groupHeaderSnippet,
		empty: emptySnippet,
		footer: footerSnippet,
		toolbar: toolbarSnippet
	}: {
		collection: string;
		where?: Where<COL>;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		mode?: 'list' | 'table' | 'grid';
		showFields?: string[];
		view?: 'full' | 'flat' | 'fk' | 'focus' | string;
		onItemClick?: (record: COL) => void;
		pageSize?: number;
		page?: number;
		infiniteScroll?: boolean;
		listClass?: string;
		groupClass?: string;
		link?: string;
		linkVars?: Record<string, any>;
		/** Field of the record to use as collection name for navigation (e.g. "code" for appscheme). */
		linkCollectionField?: string;
		/** Render the default toolbar (sort/group/find + mode switcher). */
		showToolbar?: boolean;
		/** Hydrate/persist appuser_prefs for this DataList instance. */
		usePrefs?: boolean;
		/** Override appuser_prefs scope key. Defaults to `datalist.{collection}`. */
		prefsScope?: string;
		item?: Snippet<[{ record: COL; idx: number; fieldValues: Record<string, unknown> }]>;
		groupHeader?: Snippet<[{ key: string; count: number }]>;
		empty?: Snippet;
		footer?: Snippet<[{ pagination: PaginationInfo }]>;
		/** Full toolbar override. Receives state + setters so consumer can compose any controls. */
		toolbar?: Snippet<[{
			collection: string;
			sortBy: SortBy[];
			setSortBy: (v: SortBy[]) => void;
			groupBy: string | undefined;
			setGroupBy: (v: string | undefined) => void;
			findWhere: Record<string, unknown> | undefined;
			setFindWhere: (v: Record<string, unknown> | undefined) => void;
			mode: 'list' | 'table' | 'grid';
			setMode: (v: 'list' | 'table' | 'grid') => void;
		}]>;
	} = $props();

	const prefsScope = $derived(prefsScopeProp ?? `datalist.${collection}`);

	const prefs = useMachinePrefs(
		() => prefsScope,
		{ mode: null as 'list' | 'table' | 'grid' | null, sortBy: [] as SortBy[], groupBy: undefined as string | undefined, find: undefined as Record<string, unknown> | undefined },
		() => usePrefs
	);

	let userMode      = $derived(prefs.slots.mode);
	let userSortBy    = $derived(prefs.slots.sortBy);
	let userGroupBy   = $derived(prefs.slots.groupBy);
	let userFindWhere = $derived(prefs.slots.find);

	const currentMode = $derived(userMode ?? modeProp);

	// AND-merge consumer where with finder where. Same field in both → finder wins.
	const effectiveWhere = $derived.by(() => {
		if (!where && !userFindWhere) return undefined;
		if (!userFindWhere) return where as Record<string, unknown>;
		if (!where) return userFindWhere;
		return { ...(where as Record<string, unknown>), ...userFindWhere };
	});

	const store = $derived(
		collection
			? effectiveWhere
				? machine.store(collection, effectiveWhere as Where<COL>)
				: machine.store(collection)
			: { items: [] as COL[] }
	);
	const collLogic = $derived(collection ? machine.logic.collectionOr(collection, null) : null);
	const indexField = 'id';
	const fieldValues = $derived(collLogic?.collectionValues ?? {});
	const defaultSort = $derived(
		collLogic?.defaultSort ?? [{ field: indexField as string, direction: 'asc' as const }]
	);
	const effectiveSort = $derived(userSortBy.length ? userSortBy : (sortBy ?? defaultSort));
	const effectiveGroupBy = $derived(userGroupBy ?? groupBy);
	const presentationFields = $derived(
		collLogic?.template?.presentation
			? (collLogic.template.presentation as string).split(/\s+/).filter(Boolean)
			: undefined
	);

	const fullFields = $derived.by(() => {
		if (showFields?.length) return showFields;
		const viewNames = (collLogic?.getFieldsForView(view as 'full' | 'flat' | 'fk' | 'focus') ?? []).map((f: { name: string }) => f.name);
		return viewNames.length ? viewNames : presentationFields;
	});


	const parsedLink = $derived(link ? parseLink(link) : null);

	function normalizeListClass(currentMode: 'list' | 'table' | 'grid', customClass?: string): string | undefined {
		if (currentMode !== 'list') return customClass;
		if (!customClass) return 'list list-stack';
		const classes = customClass.split(/\s+/).filter(Boolean);
		const normalized = classes.filter((name) => name !== 'list-grid');
		if (!normalized.includes('list')) normalized.unshift('list');
		if (!normalized.includes('list-stack')) normalized.push('list-stack');
		return normalized.join(' ');
	}

	const resolvedListClass = $derived(normalizeListClass(currentMode, listClass));

	function navigate(record: Record<string, unknown>): void {
		if (!parsedLink) return;
		const { action, module, zone } = parsedLink;

		let navCollection: string;
		let navId: string | undefined;

		if (linkCollectionField) {
			// record IS a collection reference — e.g. appscheme with linkCollectionField="code"
			navCollection = String(record[linkCollectionField] ?? '');
			navId = undefined;
		} else {
			// record IS a data record — navigate to its detail
			navCollection = collection;
			navId = String(record[indexField] ?? '');
		}

		if (action === 'loadFrame') {
			machine.framer.loadFrame(module, navCollection, navId, linkVars, zone);
		} else if (action === 'loadIn') {
			machine.framer.loadIn(zone, module, navCollection, navId, linkVars);
		} else if (action === 'loadInDialog') {
			void machine.framer.loadInDialog(module, navCollection, navId, linkVars);
		}
	}

	function handleItemClick(record: COL): void {
		onItemClick?.(record);
		if (parsedLink) {
			navigate(record as Record<string, unknown>);
		}
	}

	function renderPresentation(record: Record<string, unknown>): string {
		return collLogic?.collectionValues.presentation(record) ?? '';
	}

	const rawItems = $derived(store?.items ? (store.items as COL[]) : ([] as COL[]));

	const sortedItems = $derived.by(() => {
		if (!rawItems.length) return rawItems;
		return sortItems(rawItems, effectiveSort);
	});

	const paginatedItems = $derived.by(() => {
		if (infiniteScroll) return sortedItems.slice(0, visibleCount);
		if (!pageSize || pageSize <= 0) return sortedItems;
		const start = (page - 1) * pageSize;
		return sortedItems.slice(start, start + pageSize);
	});

	const chunkSize = $derived(pageSize > 0 ? pageSize : 20);
	let visibleCount = $state(20);
	let sentinel = $state<HTMLElement | null>(null);

	$effect(() => {
		void collection;
		void effectiveWhere;
		void pageSize;
		untrack(() => { visibleCount = chunkSize; });
	});

	$effect(() => {
		if (!infiniteScroll || !sentinel) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && visibleCount < sortedItems.length) {
					visibleCount = Math.min(visibleCount + chunkSize, sortedItems.length);
				}
			},
			{ rootMargin: '100px' }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	const total = $derived(rawItems.length);
	const totalPages = $derived(pageSize > 0 ? Math.ceil(total / pageSize) : 1);
	const pagination = $derived<PaginationInfo>({ page, pageSize, total, totalPages });

	const groups = $derived.by(() => {
		if (!effectiveGroupBy || !paginatedItems.length) return undefined;

		// FK grouping. Accepts the `fks.<key>` convention or a bare FK key.
		const fkKey = parseFkGroupKey(effectiveGroupBy, collLogic?.fks ?? {});
		if (fkKey) {
			// labelMap covers flat-stored FK values (record holds the target's
			// code/id); engine collections instead embed the relation as a nested
			// object under gridFks.<key>, resolved first via fkObjectLabel.
			const fkCollection = collLogic?.fks?.[fkKey]?.code ?? null;
			const labelMap = new Map<unknown, string>();
			if (fkCollection) {
				const fkScheme     = machine.logic.collectionOr(fkCollection, null);
				const fkIndexField = collLogic?.findFkField(fkCollection)?.targetIndex ?? fkScheme?.index ?? 'id';
				const fkItems      = machine.store(fkCollection).items as Record<string, unknown>[];
				for (const item of fkItems) {
					const id = item[fkIndexField];
					labelMap.set(id, fkScheme?.collectionValues.presentation(item) || String(id ?? '\u2014'));
				}
			}
			return groupItemsResolved(paginatedItems, fkKey, (item) => {
				const rec = item as Record<string, unknown>;
				const nested = fkObjectLabel(rec, fkKey);
				if (nested !== undefined) return nested;
				const raw = rec[fkKey];
				return labelMap.get(raw) ?? String(raw ?? '\u2014');
			});
		}

		return groupItems(paginatedItems, effectiveGroupBy);
	});

	let errorMessage = $state<string | null>(null);

	$effect(() => {
		if (!machine.logic.collectionOr(collection, null)) {
			errorMessage = `Collection '${collection}' not found in schema.`;
		} else {
			errorMessage = null;
		}
	});
</script>

{#snippet renderItem(record: COL, idx: number)}
	{#if itemSnippet}
		{@render itemSnippet({ record, idx, fieldValues })}
	{:else}
		{@const rec = record as Record<string, unknown>}
		{@const label = renderPresentation(rec)}
		<li>
			<button type="button" class="data-list-link"
				onclick={() => parsedLink ? navigate(rec) : handleItemClick(record)}>
				{#if label}{label}{:else}<DataRecord {collection} data={rec} mode="show" />{/if}
			</button>
		</li>
	{/if}
{/snippet}

{#snippet modeSwitcher()}
	<div class="mode-switcher">
		<button type="button" class="mode-btn" class:active={currentMode === 'list'}  onclick={() => prefs.set('mode', 'list')}>List</button>
		<button type="button" class="mode-btn" class:active={currentMode === 'table'} onclick={() => prefs.set('mode', 'table')}>Table</button>
		<button type="button" class="mode-btn" class:active={currentMode === 'grid'}  onclick={() => prefs.set('mode', 'grid')}>Grid</button>
	</div>
{/snippet}

{#if toolbarSnippet}
	{@render toolbarSnippet({
		collection,
		sortBy: userSortBy,
		setSortBy: (v) => prefs.set('sortBy', v),
		groupBy: userGroupBy,
		setGroupBy: (v) => prefs.set('groupBy', v),
		findWhere: userFindWhere,
		setFindWhere: (v) => prefs.set('find', v),
		mode: currentMode,
		setMode: (v) => prefs.set('mode', v)
	})}
{:else if showToolbar}
	<DataToolbar>
		{#snippet find()}
			<DataFind {collection} bind:where={prefs.slots.find} />
		{/snippet}
		{#snippet sort()}
			{#if presentationFields?.length}
				{#each presentationFields as f (f)}
					<DataSort field={f} bind:sortBy={prefs.slots.sortBy} />
				{/each}
			{/if}
		{/snippet}
		{#snippet group()}
			<DataGroup {collection} bind:groupBy={prefs.slots.groupBy} />
		{/snippet}
		{#snippet extras()}
			{@render modeSwitcher()}
		{/snippet}
	</DataToolbar>
{/if}

{#if errorMessage}
	<div class="error-message">{errorMessage}</div>
{:else if currentMode === 'table'}
	<TableInline {collection} {where} onItemClick={handleItemClick} />
{:else if currentMode === 'grid'}
	<ul class="grid-list" role="list">
		{#each paginatedItems as record, idx ((record as Record<string, unknown>)[indexField])}
			<li class="grid-item panel panel-bordered">
				<button type="button" class="grid-item-button" onclick={() => handleItemClick(record as COL)}>
					<div class="grid-item-content">
						<DataRecord
							{collection}
							data={record as Record<string, any>}
							mode="show"
							showFields={fullFields?.length ? fullFields : undefined}
						/>
					</div>
				</button>
			</li>
		{/each}
		{#if !paginatedItems.length}
			{#if emptySnippet}
				{@render emptySnippet()}
			{:else}
				<li class="data-list-empty">—</li>
			{/if}
		{/if}
	</ul>
{:else if groups}
	{#each Array.from(groups) as [key, groupItems] (key)}
		<div class={groupClass ?? 'data-list-group'}>
			{#if groupHeaderSnippet}{@render groupHeaderSnippet({ key, count: groupItems.length })}{:else}<div class="data-list-group-header">{key}<span class="data-list-group-count">{groupItems.length}</span></div>{/if}
			<ul class={resolvedListClass} role="list">
				{#each groupItems as record, idx ((record as Record<string, unknown>)[indexField])}
					{@render renderItem(record as COL, idx)}
				{/each}
			</ul>
		</div>
	{/each}
{:else}
	<ul class={resolvedListClass} role="list">
		{#each paginatedItems as record, idx ((record as Record<string, unknown>)[indexField])}
			{@render renderItem(record as COL, idx)}
		{/each}
		{#if !paginatedItems.length}
			{#if emptySnippet}
				{@render emptySnippet()}
			{:else}
				<li class="data-list-empty">—</li>
			{/if}
		{/if}
	</ul>
{/if}
{#if infiniteScroll && visibleCount < sortedItems.length}
	<div bind:this={sentinel} class="data-list-sentinel" aria-hidden="true"></div>
{/if}
{#if footerSnippet}
	{@render footerSnippet({ pagination })}
{/if}

<style>
	@layer components {
		.mode-switcher {
			display: flex;
			gap: 0.25rem;
		}
		.mode-btn {
			padding: 0.25rem 0.75rem;
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			cursor: pointer;
			border-radius: var(--radius-sm);
		}
		.mode-btn.active {
			background: var(--color-primary);
			color: var(--color-on-primary);
			border-color: var(--color-primary);
		}
		.grid-list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
			gap: var(--gutter-md);
			list-style: none;
			padding: 0;
			margin: 0;
		}
		.grid-item-button {
			all: unset;
			display: block;
			width: 100%;
			cursor: pointer;
		}
		:global(.data-list-sentinel) {
			height: 1px;
			list-style: none;
			pointer-events: none;
		}
		:global(.data-list-group) {
			margin-bottom: var(--gutter-md);
		}
		:global(.data-list-group-header) {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			padding: var(--gutter-sm, 0.5rem) var(--gutter-sm, 0.5rem) 0.25rem;
			font-weight: 600;
			font-size: 0.8125rem;
			text-transform: uppercase;
			letter-spacing: 0.03em;
			color: var(--color-text-muted, #888);
			border-bottom: 1px solid var(--color-border);
		}
		:global(.data-list-group-count) {
			font-weight: 400;
			color: var(--color-text-muted, #888);
		}
		:global(.data-list-empty) {
			color: var(--color-text-muted, #888);
			list-style: none;
			padding: var(--gutter-sm, 0.5rem) 0;
		}
		:global(.data-list-link) {
			width: 100%;
			text-align: left;
			justify-content: flex-start;
			background: transparent;
			border: none;
			padding: 6px 8px;
			cursor: pointer;
			border-radius: var(--radius-sm);
		}
		:global(.data-list-link:hover) { background: var(--color-hover); }
		:global(.error-message) { color: red; padding: 1rem; }
	}
</style>
