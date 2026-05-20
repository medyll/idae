<!-- /**
* @component CardForm
* @role Retro-compat wrapper for DataForm
* @description Delegates to DataForm in data-ui/data/.
* Supports three modes: 'create' (new record), 'update' (existing), 'show' (readonly).
*/ -->
<script lang="ts" generics="COL = Record<string,unknown>">
	import DataForm from '$lib/data-ui/data/DataForm.svelte';
	import CardRfk from '$lib/main-ui/card/CardRfk.svelte';
	import CardFk from '$lib/main-ui/card/CardFk.svelte';
	import type { CreateUpdateProps } from './types.js';

	let {
		onsubmit: onsubmit_callback,
		mode = 'create',
		collection,
		data,
		dataId,
		withData,
		...createUpdateProps
	}: CreateUpdateProps<COL> & { onsubmit?: (payload: unknown) => void } = $props();
</script>

<DataForm
	{collection}
	{mode}
	{data}
	{dataId}
	{withData}
	onsubmit={onsubmit_callback as any}
/>

<!-- FK sections preserved for retro-compat -->
<div>
	<CardFk
		collection={collection}
		collectionId={dataId}
	>
	{#snippet children()}
		<div class="p2">{collection}</div>
	{/snippet}
	</CardFk>
	<CardRfk
		showTitle={true}
		collection={collection}
		collectionId={dataId}
	>
		{#snippet children()}
			<div class="p2">Presentation</div>
		{/snippet}
	</CardRfk>
</div>
