<!--
DataFields.svelte
Iterates a record's fields and renders FieldDisplay for each.
@role data-fields
@prop {string} collection - Collection name
@prop {Record<string,any>} data - Record data (bindable)
@prop {'show'|'create'|'update'} [mode] - Display mode
@prop {string[]} [showFields] - Filter to specific fields
-->
<script lang="ts">
	import FieldDisplay from '$lib/data-ui/field/FieldDisplay.svelte';
	import { machine } from '$lib/main/machine.js';
	import { getContext } from 'svelte';

	let {
		collection = getContext('collection'),
		data = $bindable(),
		mode = 'show',
		showFields
	}: {
		collection: string;
		data: Record<string, any>;
		mode?: 'show' | 'create' | 'update';
		showFields?: string[];
	} = $props();

	const scheme = $derived(machine.logic.collection(collection));
	const fieldNames = $derived.by(() => {
		const fields = scheme?.fields;
		if (fields) {
			let keys = Object.keys(fields);
			if (showFields && Array.isArray(showFields)) {
				return keys.filter((key) => showFields.includes(key));
			}
			return keys;
		}
		return [];
	});
</script>

<div class="form">
	{#if scheme && fieldNames.length}
		{#each fieldNames as fieldName (fieldName)}
			{#if scheme.fields && scheme.fields[fieldName] && (mode !== 'show' || !data || fieldName in data)}
				<div class="field">
					<FieldDisplay
						{collection}
						{fieldName}
						{mode}
						bind:data={data}
					/>
				</div>
			{/if}
		{/each}
	{/if}
</div>
