<!--
CardFields.svelte
Retro-compat wrapper for DataFields.
-->
<script lang="ts">
	import DataFields from '$lib/data-ui/data/DataFields.svelte';

	let {
		collection,
		data = $bindable(),
		mode = 'show',
		showFields
	}: {
		collection: string;
		data: Record<string, any>;
		mode?: 'show' | 'create' | 'update';
		showFields?: string[];
	} = $props();
</script>

<DataFields {collection} bind:data={data} {mode} {showFields} />
