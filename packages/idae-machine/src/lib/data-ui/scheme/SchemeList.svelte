<!--
SchemeList.svelte
Lists collections from machine.store['appscheme'] (IDB, synced from server).
Filters by RBAC and search query.
@role scheme-list
@prop {string} [filter] - Search query (matches code or name)
@prop {Record<string,unknown>} [where] - Store filter passed to store.where()
@prop {string} [groupBy] - Group by field name (undefined = flat list)
@prop {SortBy | SortBy[]} [sortBy] - Sort specification
@prop {string} [activeCollection] - Currently active collection code
@prop {(detail: {collection: string; id?: string}) => void} [onSelect] - Selection callback
@snippet children(items) - Custom flat renderer (when no groupBy)
@snippet groupChildren(group) - Custom group renderer (when groupBy is set)
-->
	<script lang="ts">
	import type { Snippet } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import type { SortBy } from '$lib/types/machine-model.js';
	import SchemeItem from './SchemeItem.svelte';

	type AppschemeRecord = {
		id: string | number;
		code: string;
		name?: string;
		isType?: boolean;
		isGroup?: boolean;
		isStatus?: boolean;
		order?: number;
		base?: string;
		[k: string]: unknown;
	};

	let {
		filter = '',
		where,
		groupBy,
		sortBy,
		activeCollection = '',
		onSelect,
		children,
		groupChildren
	}: {
		filter?: string;
		where?: Record<string, unknown>;
		groupBy?: string;
		sortBy?: SortBy | SortBy[];
		activeCollection?: string;
		onSelect?: (detail: { collection: string; id?: string }) => void;
		children?: Snippet<[{ items: AppschemeRecord[] }]>;
		groupChildren?: Snippet<[{ group: { key: string; collections: AppschemeRecord[] } }]>;
	} = $props();

	function applySort(rows: AppschemeRecord[], spec: SortBy | SortBy[]): AppschemeRecord[] {
		const specs = Array.isArray(spec) ? spec : [spec];
		return [...rows].sort((a, b) => {
			for (const { field, direction } of specs) {
				const av = (a as any)[field] ?? '';
				const bv = (b as any)[field] ?? '';
				const cmp = String(av).localeCompare(String(bv));
				if (cmp !== 0) return direction === 'desc' ? -cmp : cmp;
			}
			return 0;
		});
	}

	const items = $derived.by(() => {
		const store = machine.store['appscheme'];
		if (!store) return [] as AppschemeRecord[];

		let rows: AppschemeRecord[] = where
			? ((store.where(where) ?? []) as AppschemeRecord[])
			: ((store.getAll() ?? []) as AppschemeRecord[]);

		// Filter by RBAC
		rows = rows.filter(r => machine.rights.checkAccess(r.code, 'R'));

		// Filter by text search
		if (filter) {
			const q = filter.toLowerCase();
			rows = rows.filter(r =>
				r.code.toLowerCase().includes(q) ||
				(r.name ?? '').toLowerCase().includes(q)
			);
		}

		if (sortBy) rows = applySort(rows, sortBy);
		return rows;
	});

	const groups = $derived.by(() => {
		if (!groupBy) return undefined;
		const grouped: Record<string, AppschemeRecord[]> = {};
		for (const row of items) {
			const key = String((row as any)[groupBy] ?? '');
			if (!grouped[key]) grouped[key] = [];
			grouped[key].push(row);
		}
		return Object.entries(grouped).map(([key, collections]) => ({ key, collections }));
	});

	function schemeType(row: AppschemeRecord): 'standard' | 'type' | 'group' {
		if (row.isType) return 'type';
		if (row.isGroup) return 'group';
		return 'standard';
	}
</script>

{#if groups}
	{#each groups as group (group.key)}
		{#if groupChildren}
			{@render groupChildren({ group })}
		{:else}
			<section>
				<header>{group.key}</header>
				{#each group.collections as row (row.id)}
					<SchemeItem
						collection={row.code}
						name={row.name ?? row.code}
						type={schemeType(row)}
						active={activeCollection === row.code}
						onclick={() => onSelect?.({ collection: row.code })}
					/>
				{/each}
			</section>
		{/if}
	{/each}
{:else if children}
	{@render children({ items })}
{:else}
	{#each items as row (row.id)}
		<SchemeItem
			collection={row.code}
			name={row.name ?? row.code}
			type={schemeType(row)}
			active={activeCollection === row.code}
			onclick={() => onSelect?.({ collection: row.code })}
		/>
	{/each}
{/if}

{#if items.length === 0}
	<div class="empty-state">
		<p>No collections found.</p>
	</div>
{/if}

<style>
	.empty-state { padding: 1rem; text-align: center; color: var(--color-muted, #666); }
</style>
