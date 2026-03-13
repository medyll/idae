<!--
DataLinks.svelte
Svelte 5 FK relation viewer for a collection
@role ui-fragment
@prop {string} collection - Collection name
@prop {any} [collectionId] - Optional collection id
@prop {object} [where] - Optional filter
@slot children (let:item) - Custom FK rendering
-->
<script lang="ts">
	import type { TplCollectionName, Where } from '@medyll/idae-idbql';
	import { machine } from '$lib/main/machine.js';
	let { collection, collectionId, where, children } = $props<{
		collection: TplCollectionName;
		collectionId?: any;
		where?: Where;
		children?: any;
	}>();
	const fks = $derived(machine.logic.collection(collection).parseFks());

	$inspect('fks', fks);
</script>
 
{#each Object.entries(fks) as item (item[0])}
	<div>  {item[0]}
		<!-- {#if children}
			{@render children(item)}
		{/if} -->
	</div>
{/each}
