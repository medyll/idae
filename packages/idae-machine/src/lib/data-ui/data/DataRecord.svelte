<!--
DataRecord.svelte
Iterates a record's fields and renders DataField for each.
@role data-record
@prop {string} collection - Collection name
@prop {Record<string,any>} data - Record data (bindable)
@prop {'show'|'create'|'update'} [mode] - CRUD state, independent of layout.
@prop {'fields'|'row'} [as] - Layout wrapper. 'row' emits <td> per field for use inside <tr> (no groupBy support). Does not affect `mode`.
@prop {string[]} [showFields] - Explicit field list, bypasses the view query entirely
@prop {string} [view] - Named view (resolved via appscheme_view/appscheme_field query — see useViewFields)
@prop {string} [groupFieldBy] - FK relation key on appscheme_field to group by (e.g. 'appscheme_field_type'); grouping runs on `fks.{groupFieldBy}.code` via native groupBy
-->
<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ViewTypeCode } from '$lib/types/index.js';

	export interface DataRecordProps {
		collection: string;
		collectionId?: string | number;
		data?: Record<string, any>;
		mode?: 'show' | 'create' | 'update';
		as?: 'fields' | 'row';
		showFields?: string[];
		view?: ViewTypeCode;
		groupFieldBy?: string;
		groupChildren?: Snippet<[{ key: string; fieldNames: string[] }]>;
		inputForm?: string;
		showLabel?: boolean | string;
		showGroupNames?: boolean;
	}
</script>

<script lang="ts">
	import DataField from '$lib/data-ui/field/DataField.svelte';
	import { machine } from '$lib/main/machine.js';
	import { useViewFields } from '$lib/data-ui/utils/useViewFields.svelte.js';
	import { useRecordData } from '$lib/data-ui/utils/useRecordData.svelte.js';
	import { getContext } from 'svelte';

	let {
		collection = getContext('collection'),
		collectionId,
		data = $bindable(),
		mode = 'show',
		as = 'fields',
		showFields,
		view = 'full',
		groupFieldBy,
		groupChildren,
		inputForm,
		showLabel = true,
		showGroupNames = true
	}: DataRecordProps = $props();

	// Data source contract (CLAUDE.md §4): `data` prop → controlled (e.g. DataList store
	// items), used as-is; else `collectionId` → reactive read via machine.store (BL-24,
	// useRecordData — NOT machine.collection; store is the reactive read layer).
	const recordData = useRecordData(() => collection, () => ({ collectionId, data }));
	const scheme = $derived(recordData.scheme);
	const effectiveData = $derived(recordData.record);

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

{#if as === 'row'}
	{#if scheme && fieldNames.length && effectiveData != null}
		{#each fieldNames as fieldName (fieldName)}
			{#if (scheme.fields?.[fieldName] || isFkField(fieldName)) && (fieldName in effectiveData || isFkField(fieldName))}
				<td>
					{#if mode === 'show'}
						<DataField {collection} {fieldName} mode="show" data={effectiveData} showLabel={false} />
					{:else if data !== undefined}
						<DataField {collection} {fieldName} {mode} bind:data showLabel={false} />
					{/if}
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
				{#if showGroupNames}<legend>- {key}</legend>{/if}
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
	/* flex-wrap (legacy .fiche_field_group: flex_h flex_wrap) — each DataField's
	   `.field-line` carries its own flex-basis (~320px, legacy min-width:40%) and
	   fixed-width label, so values line up without a rigid grid forcing uneven
	   rows to match height. */
	.form,
	fieldset.field-group {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
	}
	fieldset.field-group {
		border: none;
		padding: 0;
	}
	.field {
		display: contents;
	}
	legend {
		width: 100%;
		padding: var(--pad-sm) 0 var(--pad-xs);
		font-weight: var(--font-medium);
		color: var(--color-text-muted);
	}
</style>
