<!--
SchemeList.svelte
Lists collections from machine.logic.collections(), grouped by type (standard/type/group).
Filters by RBAC and search query.
@role scheme-list
@prop {string} [filter] - Search query
@prop {string} [activeCollection] - Currently active collection code
@prop {(detail: {collection: string; id?: string}) => void} [onSelect] - Selection callback
@snippet children(group) - Custom group renderer
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import SchemeItem from './SchemeItem.svelte';

	let {
		filter = '',
		activeCollection = '',
		onSelect,
		children
	}: {
		filter?: string;
		activeCollection?: string;
		onSelect?: (detail: { collection: string; id?: string }) => void;
		children?: any;
	} = $props();

	const groups = $derived.by(() => {
		const schemes = machine.logic.collections();
		const grouped: Record<string, Array<{ code: string; name: string; type: string }>> = {};

		for (const scheme of schemes) {
			const colName = scheme.collection ?? scheme.name;
			if (!colName) continue;

			// Filter by permissions
			if (!machine.rights.checkAccess(colName, 'R')) continue;

			// Filter by search
			if (filter && !colName.toLowerCase().includes(filter.toLowerCase())) continue;

			const type = (scheme as any).model?.isType ? 'type'
				: (scheme as any).model?.isGroup ? 'group'
				: 'standard';

			if (!grouped[type]) grouped[type] = [];
			grouped[type].push({ code: colName, name: colName, type });
		}

		return Object.entries(grouped).map(([type, cols]) => ({ type, collections: cols }));
	});
</script>

{#each groups as group (group.type)}
	{#if children}
		{@render children({ group })}
	{:else}
		{#each group.collections as col (col.code)}
			<SchemeItem
				collection={col.code}
				name={col.name}
				type={col.type as 'standard' | 'type' | 'group'}
				active={activeCollection === col.code}
				onclick={() => onSelect?.({ collection: col.code })}
			/>
		{/each}
	{/if}
{/each}

{#if groups.length === 0}
	<div class="empty-state">
		<p>No collections found.</p>
	</div>
{/if}

<style>
	.empty-state { padding: 1rem; text-align: center; color: var(--color-muted, #666); }
</style>
