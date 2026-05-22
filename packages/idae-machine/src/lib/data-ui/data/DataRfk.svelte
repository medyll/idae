<!--
DataRfk.svelte
Reverse FK relation viewer — shows collections that point to this record.
@role data-relations
@prop {string} collection - Collection name
@prop {string|number} [collectionId] - Optional record id
@prop {Record<string,unknown>} [where] - Optional filter
@prop {boolean|string} [showTitle] - Show or override title
@prop {SortBy | SortBy[]} [sortBy] - Sort reverse FK entries
@prop {string} [groupBy] - Group reverse FK entries by property
@prop {typeof SvelteComponent} [component] - Custom component
@prop {Record<string,any>} [componentProps] - Props for custom component
@slot children (let:item) - Custom reverse FK rendering
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TplCollectionName } from '$lib/types/machine-model.js';
	import type { SortBy } from '$lib/types/machine-model.js';
	import type { Where } from '@medyll/qoolie';
	import type { SvelteComponent } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import { sortItems, groupItems } from '$lib/shell/frame/explorerUtils.js';

	let { collection, showTitle = false, component, componentProps = {}, sortBy, groupBy, children } = $props<{
		collection: TplCollectionName;
		collectionId?: string | number;
		where?: Where;
		showTitle?: boolean | string;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		component?: typeof SvelteComponent;
		componentProps?: Record<string, any>;
		children?: Snippet<[[string, Record<string, unknown>]]>;
	}>();

	const reverseFks = $derived(machine.logic.collection(collection).parseReverseFks());

	const rfkEntries = $derived(
		Object.entries(reverseFks).map(([key, def]) => ({ key, ...(def as Record<string, unknown>) }))
	);
	const sortedRfks = $derived(sortBy ? sortItems(rfkEntries, sortBy) : rfkEntries);
	const groups = $derived(groupBy ? groupItems(sortedRfks, groupBy) : undefined);
</script>

{#if groups}
	{#each Array.from(groups) as [groupKey, groupEntries] (groupKey)}
		<section>
			<header>{groupKey}</header>
			{#each groupEntries as entry (entry.key)}
				<div>
					{#if showTitle}<div class="p2 font-bold">{entry.key}</div>{/if}
					{#if component}
						{@const DynComp = component}
						<DynComp collection={collection} template={entry} {...componentProps} />
					{:else if children}
						{@render children([entry.key, entry])}
					{/if}
				</div>
			{/each}
		</section>
	{/each}
{:else}
	{#each sortedRfks as entry (entry.key)}
		<div>
			{#if showTitle}<div class="p2 font-bold">{entry.key}</div>{/if}
			{#if component}
				{@const DynComp = component}
				<DynComp collection={collection} template={entry} {...componentProps} />
			{:else if children}
				{@render children([entry.key, entry])}
			{/if}
		</div>
	{/each}
{/if}
