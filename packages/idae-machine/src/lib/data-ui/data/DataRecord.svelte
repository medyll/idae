<!--
DataRecord.svelte
Iterates a record's fields and renders DataField for each.
@role data-record
@prop {string} collection - Collection name
@prop {Record<string,any>} data - Record data (bindable)
@prop {'show'|'create'|'update'|'row'} [mode] - Display mode. 'row' emits <td> per field for use inside <tr> (no groupBy support in this mode).
@prop {string[]} [showFields] - Explicit field list, bypasses the view query entirely
@prop {string} [view] - Named view (resolved via appscheme_view/appscheme_field query — see useViewFields)
@prop {string} [groupFieldBy] - FK relation key on appscheme_field to group by (e.g. 'appscheme_field_type'); grouping runs on `fks.{groupFieldBy}.code` via native groupBy
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import DataField from '$lib/data-ui/field/DataField.svelte';
	import { machine } from '$lib/main/machine.js';
	import { MachineRecordIdentity } from '$lib/main/index.js';
	import { useViewFields } from '$lib/data-ui/utils/useViewFields.svelte.js';
	import { getContext } from 'svelte';

	let {
		collection = getContext('collection'),
		collectionId,
		data = $bindable(),
		mode = 'show',
		showFields,
		view = 'full',
		groupFieldBy,
		groupChildren,
		inputForm,
		showLabel = true
	}: {
		collection: string;
		collectionId?: string | number;
		data?: Record<string, any>;
		mode?: 'show' | 'create' | 'update' | 'row';
		showFields?: string[];
		view?: string;
		groupFieldBy?: string;
		groupChildren?: Snippet<[{ key: string; fieldNames: string[] }]>;
		inputForm?: string;
		showLabel?: boolean | string;
	} = $props();

	const scheme = $derived(collection ? machine.logic.collectionOr(collection, null) : null);

	// Data source contract:
	//  - `data` prop provided  → controlled (e.g. DataList store items). Use as-is.
	//  - else `collectionId`   → reactive read via machine.store (NOT machine.collection;
	//    store is the reactive read layer, collection is imperative CRUD). Same path
	//    DataList uses, so it resolves the correct qoolie instance.
	const queryId = $derived(MachineRecordIdentity.normalizeKey(collectionId));
	const recordStore = $derived(
		data === undefined && collection && queryId !== undefined
			? machine.store(
					collection,
					MachineRecordIdentity.buildWhere(scheme?.index ?? 'id', queryId) as any
				)
			: null
	);
	const fetchedData = $derived(recordStore?.records?.[0] as Record<string, any> | undefined);

	const effectiveData = $derived(data ?? fetchedData);

	// Field list: explicit `showFields` bypasses the view query; otherwise query-resolved
	// via appscheme_view → appscheme_field (see useViewFields — no client-side heuristics).
	const viewFields = useViewFields(() => collection, () => view, () => groupFieldBy);
	const fieldNames = $derived(showFields?.length ? showFields : viewFields.fieldNames);
	const groups = $derived(showFields?.length ? undefined : viewFields.groups);

	// FK fields are shown even when absent from the record (placeholder empty value).
	// Scalar fields are skipped when absent — MachineSchemeValues.format throws FIELD_NOT_FOUND.
	const schemeFks = $derived(scheme?.fks ?? {});
	const isFkField = (fieldName: string) => fieldName in schemeFks;
</script>

{#if mode === 'row'}
	{#if scheme && fieldNames.length && effectiveData != null}
		{#each fieldNames as fieldName (fieldName)}
			{#if (scheme.fields?.[fieldName] || isFkField(fieldName)) && (fieldName in effectiveData || isFkField(fieldName))}
				<td>
					<DataField {collection} {fieldName} mode="show" data={effectiveData} showLabel={false} />
				</td>
			{/if}
		{/each}
	{/if}
{:else if groups}
	{#each Object.entries(groups) as [key, groupFields] (key)}
		{#if groupChildren}
			{@render groupChildren({ key, fieldNames: groupFields.map((f) => f.code) })}
		{:else}
			<fieldset class="field-group">
				<legend  >- {key}</legend>
				{#each groupFields as { code: fieldName } (fieldName)}
					{#if (scheme?.fields?.[fieldName] || isFkField(fieldName)) && (mode !== 'show' || (effectiveData != null && (fieldName in effectiveData || isFkField(fieldName))))}
						<div class="field">
							{#if mode === 'show'}
								<DataField {showLabel} {collection} {fieldName} {mode} data={effectiveData!} {inputForm} />
							{:else if data !== undefined}<DataField
									{collection}
									{fieldName}
									{mode}
									bind:data
									{inputForm}
								/>{/if}
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
				{#if (scheme.fields?.[fieldName] || isFkField(fieldName)) && (mode !== 'show' || (effectiveData != null && (fieldName in effectiveData || isFkField(fieldName))))}
					<div class="field">
						{#if mode === 'show'}
							<DataField {collection} {fieldName} {mode} data={effectiveData!} {showLabel} {inputForm} />
						{:else if data !== undefined}<DataField
								{collection}
								{fieldName}
								{mode}
								bind:data={data as Record<string, unknown>}
								{inputForm}
								{showLabel}
							/>{/if}
					</div>
				{/if}
			{/each}
		{/if}
	</div>
{/if}

<style>
	.form {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
		align-items: flex-start;
	}
	.field {
		display: contents;
	}
	fieldset.field-group {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
		align-items: flex-start;
		border: none;
	}
	legend {
		padding: var(--space-2, 0.5rem)
	}
</style>
