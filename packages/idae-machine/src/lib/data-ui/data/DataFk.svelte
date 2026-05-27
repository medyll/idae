<!--
DataFk.svelte
Forward FK relation viewer — shows collections this record points to.
@role data-relations
@prop {string} collection - Collection name
@prop {SortBy | SortBy[]} [sortBy] - Sort FK entries
@prop {string} [groupBy] - Group FK entries by property
@slot children (let:item) - Custom FK rendering
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TplCollectionName } from '$lib/types/index.js';
	import type { SortBy } from '$lib/types/index.js';
	import { machine } from '$lib/main/machine.js';
	import { sortItems, groupItems } from '$lib/data-ui/utils/explorerUtils.js';

	let { collection, sortBy, groupBy, children } = $props<{
		collection: TplCollectionName;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		children?: Snippet<[[string, Record<string, unknown>]]>;
	}>();

	const fks = $derived(machine.logic.collection(collection).parseFks());

	const fkEntries = $derived(
		Object.entries(fks).map(([key, def]) => ({ key, ...(def as Record<string, unknown>) }))
	);
	const sortedFks = $derived(sortBy ? sortItems(fkEntries, sortBy) : fkEntries);
	const groups = $derived(groupBy ? groupItems(sortedFks, groupBy) : undefined);
</script>

{#if groups}
	{#each Array.from(groups) as [groupKey, groupEntries] (groupKey)}
		<section>
			<header>{groupKey}</header>
			{#each groupEntries as entry (entry.key)}
				<div>{entry.key}
					{#if children}{@render children([entry.key, entry])}{/if}
				</div>
			{/each}
		</section>
	{/each}
{:else}
	{#each sortedFks as entry (entry.key)}
		<div>{entry.key}
			{#if children}{@render children([entry.key, entry])}{/if}
		</div>
	{/each}
{/if}
