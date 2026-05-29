<!--
DataRecord.svelte
Iterates a record's fields and renders DataField for each.
@role data-record
@prop {string} collection - Collection name
@prop {Record<string,any>} data - Record data (bindable)
@prop {'show'|'create'|'update'} [mode] - Display mode
@prop {string[]} [showFields] - Filter to specific fields
@prop {SortBy | SortBy[]} [sortBy] - Sort field order (by field def properties e.g. order, label)
@prop {string} [groupBy] - Group fields by field def property (e.g. 'group')
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import DataField from '$lib/data-ui/field/DataField.svelte';
	import { machine } from '$lib/main/machine.js';
	import { sortItems, groupItems } from '$lib/data-ui/utils/data-utils.js';
	import type { SortBy } from '$lib/types/index.js';
	import { getContext } from 'svelte';

	let {
		collection = getContext('collection'),
		data = $bindable(),
		collectionId,
		mode = 'show',
		showFields,
		sortBy,
		groupBy,
		groupChildren,
		inputForm
	}: {
		collection: string;
		data?: Record<string, any>;
		collectionId?: string | number;
		mode?: 'show' | 'create' | 'update';
		showFields?: string[];
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		groupChildren?: Snippet<[{ key: string; fieldNames: string[] }]>;
		inputForm?: string;
	} = $props();

	let fetchedData = $state<Record<string, any> | undefined>(undefined);

	$effect(() => {
		if (data !== undefined || !collection || !collectionId) return;
		const id = isNaN(Number(collectionId)) ? collectionId : Number(collectionId);
		(async () => {
			const store = machine.collection(collection);
			fetchedData = (await store.get(id as any)) ?? undefined;
		})();
	});

	const effectiveData = $derived(data ?? fetchedData);

	function safeScheme(name: string) {
		try { return machine.logic.collection(name); } catch { return null; }
	}

	const scheme = $derived(collection ? safeScheme(collection) : null);

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
					{#if scheme?.fields?.[fieldName] && (mode !== 'show' || !effectiveData || fieldName in effectiveData)}
						<div class="field">
							{#if mode === 'show'}
								<DataField {collection} {fieldName} {mode} data={effectiveData ?? {}} {inputForm} />
							{:else}
								{#if data !== undefined}<DataField {collection} {fieldName} {mode} bind:data={data} {inputForm} />{/if}
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
				{#if scheme.fields?.[fieldName] && (mode !== 'show' || !effectiveData || fieldName in effectiveData)}
					<div class="field">
						{#if mode === 'show'}
							<DataField {collection} {fieldName} {mode} data={effectiveData ?? {}} {inputForm} />
						{:else}
							{#if data !== undefined}<DataField {collection} {fieldName} {mode} bind:data={data as Record<string,unknown>} {inputForm} />{/if}
						{/if}
					</div>
				{/if}
			{/each}
		{/if}
	</div>
{/if}
