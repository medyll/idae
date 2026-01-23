<script lang="ts">
	import type { TplCollectionName, Where } from '@medyll/idae-idbql';
	import { Looper } from '@medyll/idae-slotui-svelte';
	import { machine } from '$lib/main/machine.js'; 

	type CollectionFksProps = {
		collection:    TplCollectionName;
		collectionId?: any;
		where?:        Where;
	};

	let { collection,collectionId,where }: CollectionFksProps = $props();

 
	const fks = $derived(machine.logic.collection(collection).parseFks()); 
</script>

<Looper data={Object.entries(fks)}>
	{#snippet children({ item })}
		<div>{item[0]}</div>
	{/snippet}
</Looper>
