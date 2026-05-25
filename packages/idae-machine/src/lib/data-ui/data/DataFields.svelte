<!--
DataFields.svelte
Iterates a record's fields and renders FieldDisplay for each.
@role data-fields
@prop {string} collection - Collection name
@prop {Record<string,any>} data - Record data (bindable)
@prop {'show'|'create'|'update'} [mode] - Display mode
@prop {string[]} [showFields] - Filter to specific fields
@prop {SortBy | SortBy[]} [sortBy] - Sort field order (by field def properties e.g. order, label)
@prop {string} [groupBy] - Group fields by field def property (e.g. 'group')
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import FieldDisplay from '$lib/data-ui/field/FieldDisplay.svelte';
	import { machine } from '$lib/main/machine.js';
	import { sortItems, groupItems } from '$lib/data-ui/utils/explorerUtils.js';
	import type { SortBy } from '$lib/types/machine-model.js';
	import { getContext } from 'svelte';

	let {
		collection = getContext('collection'),
		data = $bindable(),
		mode = 'show',
		showFields,
		sortBy,
		groupBy,
		groupChildren
	}: {
		collection: string;
		data: Record<string, any>;
		mode?: 'show' | 'create' | 'update';
		showFields?: string[];
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		groupChildren?: Snippet<[{ key: string; fieldNames: string[] }]>;
	} = $props();

	const scheme = $derived(machine.logic.collection(collection));

	/** Fields as sortable/groupable objects — key + field definition properties */
	const fieldObjects = $derived.by(() => {
		const fields = scheme?.fields;
		if (!fields) return [];
		let keys = Object.keys(fields);
		if (showFields?.length) keys = keys.filter(k => showFields!.includes(k));
		return keys.map(key => ({ key, ...(fields[key] as unknown as Record<string, unknown>) }));
	});

	const sortedFields = $derived(
		sortBy ? sortItems(fieldObjects, sortBy) : fieldObjects
	);

	const groups = $derived(
		groupBy ? groupItems(sortedFields, groupBy) as Map<string, typeof sortedFields> : undefined
	);

	const fieldNames = $derived(sortedFields.map(f => f.key));
</script>

{#if groups}
	{#each Array.from(groups) as [key, groupFields] (key)}
		{#if groupChildren}
			{@render groupChildren({ key, fieldNames: groupFields.map(f => f.key) })}
		{:else}
			<fieldset class="field-group">
				<legend>{key}</legend>
				{#each groupFields as { key: fieldName } (fieldName)}
					{#if scheme?.fields?.[fieldName] && (mode !== 'show' || !data || fieldName in data)}
						<div class="field">
							{#if mode === 'show'}
								<FieldDisplay {collection} {fieldName} {mode} {data} />
							{:else}
								<FieldDisplay {collection} {fieldName} {mode} bind:data={data} />
							{/if}
						</div>
					{/if}
				{/each}
			</fieldset>
		{/if}
	{/each}
{:else}
	<div class="form">
		{#if scheme && fieldNames.length}
			{#each fieldNames as fieldName (fieldName)}
				{#if scheme.fields?.[fieldName] && (mode !== 'show' || !data || fieldName in data)}
					<div class="field">
						{#if mode === 'show'}
							<FieldDisplay {collection} {fieldName} {mode} {data} />
						{:else}
							<FieldDisplay {collection} {fieldName} {mode} bind:data={data} />
						{/if}
					</div>
				{/if}
			{/each}
		{/if}
	</div>
{/if}
