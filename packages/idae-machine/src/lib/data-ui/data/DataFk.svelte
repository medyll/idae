<!--
DataFk.svelte
Forward FK relation viewer — shows collections this record points to.
@role data-relations
@prop {string} collection - Collection name
@prop {string|number} [collectionId] - Optional record id
@prop {Record<string,unknown>} [where] - Optional filter
@slot children (let:item) - Custom FK rendering
-->
<script lang="ts">
	import type { TplCollectionName } from '$lib/types/machine-model.js';
	import type { Where } from '@medyll/qoolie';
	import { machine } from '$lib/main/machine.js';

	let { collection, collectionId, where, children } = $props<{
		collection: TplCollectionName;
		collectionId?: string | number;
		where?: Where;
		children?: any;
	}>();

	const fks = $derived(machine.logic.collection(collection).parseFks());
</script>

{#each Object.entries(fks) as item (item[0])}
	<div>{item[0]}
		{#if children}
			{@render children(item)}
		{/if}
	</div>
{/each}
