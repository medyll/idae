<!--
DataList.svelte
Data provider + renderer — fetches, sorts, groups, paginates, iterates.
Autonomous by default: renders DataFields (template.presentation fields) when no snippet provided.
Consumers can override via the item snippet.

@prop {string} collection
@prop {Where<COL>} [where]
@prop {SortBy | SortBy[]} [sortBy]
@prop {string} [groupBy]
@prop {'list'|'table'|'grid'} [mode='list'] - Visual layout mode
@prop {string[]} [showFields] - Fields to display (overrides fieldViews.fullView)
@prop {(record: COL) => void} [onItemClick] - Click handler for items/rows
@prop {number} [pageSize] - chunk size for infinite scroll or page size for classic pagination
@prop {number} [page] - 1-based (only used when infiniteScroll=false)
@prop {boolean} [infiniteScroll=true] - append items as user scrolls (uses IntersectionObserver on sentinel)
@prop {string} [listClass] - CSS class for <ul>
@prop {string} [groupClass] - CSS class for group wrapper <div>
@snippet item({ record, idx, fieldValues }) - override record rendering (optional — DataFields used by default)
@snippet groupHeader({ key, count }) - renders group section header (optional)
@snippet empty() - renders empty state (optional — "—" shown by default)
@snippet footer({ pagination }) - renders pagination/footer (optional)
-->
<script lang="ts" generics="COL extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { SortBy, Where } from '$lib/types/index.js';
	import { machine } from '$lib/main/machine.js';
	import { sortItems, groupItems } from '$lib/data-ui/utils/explorerUtils.js';
	import DataFields from '$lib/data-ui/data/DataFields.svelte';
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

	let userMode = $state<'list' | 'table' | 'grid' | null>(null);
	const currentMode = $derived(userMode ?? modeProp);

	// Toolbar-owned state. Consumer props (`where`, `sortBy`, `groupBy`) act as defaults;
	// these override / extend at runtime. Persisted per (user, collection) via machine.action
	// on `appuser_prefs` (code = `{userId}:datalist.{collection}.{slot}`).
	let userSortBy   = $state<SortBy[]>([]);
	let userGroupBy  = $state<string | undefined>(undefined);
	let userFindWhere = $state<Record<string, unknown> | undefined>(undefined);

	const prefsScope = $derived(`datalist.${collection}`);
	let hydrated = $state(false);

	function persistSlot(slot: string, value: unknown): void {
		const scopeKey = `${prefsScope}.${slot}`;
		void machine.action(
			'appuser_prefs',
			{ scopeKey, name: scopeKey, value },
			{ code: '{userId}:{scopeKey}', upsertOn: ['code'] }
		);
	}

	// Hydrate from appuser_prefs whenever the collection changes. `hydrated` gates the
	// persistence effects below to avoid an immediate write-back of the initial empty state.
	$effect(() => {
		const scopeKey = prefsScope;
		hydrated = false;
		const user = machine.rights.currentUser;
		if (!user) { hydrated = true; return; }
		const prefix = `${String(user.id)}:${scopeKey}.`;
		untrack(() => {
			Promise.resolve(machine.collection('appuser_prefs').getAll())
				.then((rows: Array<{ code?: string; value?: unknown }>) => {
					const vals: Record<string, unknown> = {};
					for (const r of rows) {
						if (typeof r.code === 'string' && r.code.startsWith(prefix)) {
							vals[r.code.slice(prefix.length)] = r.value;
						}
					}
					userMode      = vals.mode === 'list' || vals.mode === 'table' || vals.mode === 'grid'
						? vals.mode : null;
					userSortBy    = Array.isArray(vals.sortBy) ? (vals.sortBy as SortBy[]) : [];
					userGroupBy   = typeof vals.groupBy === 'string' ? vals.groupBy : undefined;
					userFindWhere = vals.find && typeof vals.find === 'object'
						? (vals.find as Record<string, unknown>)
						: undefined;
				})
				.catch(() => {})
				.finally(() => { hydrated = true; });
		});
	});

	$effect(() => { const m = userMode;      if (hydrated) untrack(() => persistSlot('mode',    m)); });
	$effect(() => { const s = userSortBy;    if (hydrated) untrack(() => persistSlot('sortBy',  s)); });
	$effect(() => { const g = userGroupBy;   if (hydrated) untrack(() => persistSlot('groupBy', g ?? null)); });
	$effect(() => { const w = userFindWhere; if (hydrated) untrack(() => persistSlot('find',    w ?? null)); });

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
	const collLogic = $derived(collection ? safeCollection(collection) : null);
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

	const fieldViews = $derived(collLogic?.fieldViews ?? {});
	const fullFields = $derived(
		showFields?.length
			? showFields
			: (fieldViews.fullView ?? []).map((f: { name: string }) => f.name).length
				? (fieldViews.fullView ?? []).map((f: { name: string }) => f.name)
				: presentationFields
	);

	function getByPath(obj: unknown, path: string): unknown {
		if (obj == null) return undefined;
		let cur: any = obj;
		for (const seg of path.split('.')) {
			if (cur == null) return undefined;
			cur = cur[seg];
		}
		return cur;
	}

	const parsedLink = $derived(link ? parseLink(link) : null);

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
		if (!presentationFields?.length) return '';
		return presentationFields
			.map(tok => {
				const v = getByPath(record, tok);
				return v == null ? '' : String(v);
			})
			.filter(Boolean)
			.join(' ');
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
		return groupItems(paginatedItems, effectiveGroupBy);
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
			errorMessage = `Collection '${collection}' not found in schema.`;
		} else {
			errorMessage = null;
		}
	});
</script>

{#snippet modeSwitcher()}
	<div class="mode-switcher">
		<button type="button" class="mode-btn" class:active={currentMode === 'list'}  onclick={() => userMode = 'list'}>List</button>
		<button type="button" class="mode-btn" class:active={currentMode === 'table'} onclick={() => userMode = 'table'}>Table</button>
		<button type="button" class="mode-btn" class:active={currentMode === 'grid'}  onclick={() => userMode = 'grid'}>Grid</button>
	</div>
{/snippet}

{#if toolbarSnippet}
	{@render toolbarSnippet({
		collection,
		sortBy: userSortBy,
		setSortBy: (v) => (userSortBy = v),
		groupBy: userGroupBy,
		setGroupBy: (v) => (userGroupBy = v),
		findWhere: userFindWhere,
		setFindWhere: (v) => (userFindWhere = v),
		mode: currentMode,
		setMode: (v) => (userMode = v)
	})}
{:else if showToolbar}
	<DataToolbar>
		{#snippet find()}
			<DataFind {collection} bind:where={userFindWhere} />
		{/snippet}
		{#snippet sort()}
			{#if presentationFields?.length}
				{#each presentationFields as f (f)}
					<DataSort field={f} bind:sortBy={userSortBy} />
				{/each}
			{/if}
		{/snippet}
		{#snippet group()}
			<DataGroup {collection} bind:groupBy={userGroupBy} />
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
						<DataFields
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
			{#if groupHeaderSnippet}{@render groupHeaderSnippet({ key, count: groupItems.length })}{/if}
			<ul class={listClass} role="list">
				{#each groupItems as record, idx ((record as Record<string, unknown>)[indexField])}
					{#if itemSnippet}
						{@render itemSnippet({ record: record as COL, idx, fieldValues })}
					{:else if parsedLink}
						<li><button type="button" class="data-list-link" onclick={() => navigate(record as Record<string, unknown>)}>{presentationFields?.length ? renderPresentation(record as Record<string, unknown>) : ''}{#if !presentationFields?.length}<DataFields collection={collection} data={record as Record<string, unknown>} mode="show" />{/if}</button></li>
					{:else}
						<li><button type="button" class="data-list-link" onclick={() => handleItemClick(record)}>{#if presentationFields?.length}{renderPresentation(record as Record<string, unknown>)}{:else}<DataFields collection={collection} data={record as Record<string, unknown>} mode="show" />{/if}</button></li>
					{/if}
				{/each}
			</ul>
		</div>
	{/each}
{:else}
	<ul class={listClass} role="list">
		{#each paginatedItems as record, idx ((record as Record<string, unknown>)[indexField])}
			{#if itemSnippet}
				{@render itemSnippet({ record: record as COL, idx, fieldValues })}
			{:else if parsedLink}
				<li><button type="button" class="data-list-link" onclick={() => navigate(record as Record<string, unknown>)}>{presentationFields?.length ? renderPresentation(record as Record<string, unknown>) : ''}{#if !presentationFields?.length}<DataFields collection={collection} data={record as Record<string, unknown>} mode="show" />{/if}</button></li>
			{:else}
				<li><button type="button" class="data-list-link" onclick={() => handleItemClick(record)}>{#if presentationFields?.length}{renderPresentation(record as Record<string, unknown>)}{:else}<DataFields collection={collection} data={record as Record<string, unknown>} mode="show" />{/if}</button></li>
			{/if}
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
