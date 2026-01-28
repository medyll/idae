<!--
DataProvider.svelte
Svelte 5 context provider for collection/data
@role context-provider
@prop {string} collection - Collection name
@prop {object[]} data - Data array (bindable)
@slot children - Render children with context
-->

<script lang="ts">
	import { setContext } from 'svelte';
	const props = $props<{ collection: string; data?: Record<string, any>[] }>();
	let data = props.data ?? $bindable();
	setContext('collection', props.collection);
	setContext('data', data);
	$inspect('data.provider', data);
</script>

{#snippet children()}
	<!-- Default children: nothing rendered -->
{/snippet}

{@render children()}
