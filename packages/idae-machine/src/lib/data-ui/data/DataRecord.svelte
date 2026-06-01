<!--
DataRecord.svelte
Iterates a record's fields and renders DataField for each.
@role data-record
@prop {string} collection - Collection name
@prop {Record<string,any>} data - Record data (bindable)
@prop {'show'|'create'|'update'} [mode] - Display mode
@prop {string[]} [showFields] - Filter to specific fields (overrides view)
@prop {'full'|'flat'|'fk'|'focus'|string} [view] - Named view to resolve field list (full=all, flat=non-fk, fk=fk-only, focus=identity subset)
@prop {SortBy | SortBy[]} [sortBy] - Sort field order (by field def properties e.g. order, label)
@prop {string} [groupBy] - Group fields by field def property (e.g. 'group')
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import DataField from '$lib/data-ui/field/DataField.svelte';
	import DataFkValue from '$lib/data-ui/field/DataFkValue.svelte';
	import { machine } from '$lib/main/machine.js';
	import { MachineRecordIdentity } from '$lib/main/index.js';
	import type { SortBy } from '$lib/types/index.js';
	import { getContext } from 'svelte';

	let {
		collection = getContext('collection'),
		collectionId,
		data = $bindable(),
		mode = 'show',
		showFields,
		view='full',
		sortBy,
		groupBy,
		groupChildren,
		inputForm
	}: {
		collection: string;
		collectionId?: string | number;
		data?: Record<string, any>;
		mode?: 'show' | 'create' | 'update';
		showFields?: string[];
		view?: 'full' | 'flat' | 'fk' | 'focus' | string;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		groupChildren?: Snippet<[{ key: string; fieldNames: string[] }]>;
		inputForm?: string;
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
			? machine.store(collection, MachineRecordIdentity.buildWhere(scheme?.index ?? 'id', queryId) as any)
			: null
	);
	const fetchedData = $derived(recordStore?.items?.[0] as Record<string, any> | undefined);

	const effectiveData = $derived(data ?? fetchedData);

	const resolved   = $derived(scheme?.resolveFieldList({ view, showFields, sortBy, groupBy }) ?? null);
	const fieldNames = $derived(resolved?.fieldNames ?? []);
	const groups     = $derived(resolved?.groups ?? undefined);

	// view='fk': fieldNames are already FK-only (getFieldsForView('fk')).
	// Title per FK field = target collection's appscheme.name (if appscheme in model),
	// else fall back to the collection key from the descriptor.
	const hasAppscheme   = $derived('appscheme' in (machine.logic?.model ?? {}));
	const appschemeItems = $derived(
		view === 'fk' && hasAppscheme
			? (machine.store('appscheme').items as Record<string, unknown>[])
			: []
	);
	const fkLabels = $derived.by(() => {
		const map = new Map<string, string>();
		if (view !== 'fk' || !scheme) return map;
		for (const fieldName of fieldNames) {
			const d = scheme.collectionValues.descriptor(fieldName);
			if (d?.kind !== 'fk') continue;
			const meta = appschemeItems.find(i => i.code === d.fkCollection);
			map.set(fieldName, String(meta?.name ?? d.fkCollection));
		}
		return map;
	});
	const fkFieldNames = $derived(fieldNames.filter(f => fkLabels.has(f)));

	$inspect('fieldNames', fieldNames);
	$inspect('scheme', scheme);
	$inspect('fkLabels', fkLabels);
	$inspect('appschemeItems', appschemeItems);
</script>

{#if groups}
	{#each Array.from(groups) as [key, groupFields] (key)}
		{#if groupChildren}
			{@render groupChildren({ key, fieldNames: groupFields.map(f => f.key) })}
		{:else}
			<fieldset class="field-group">
				<legend>{key}</legend>
				{#each groupFields as { key: fieldName } (fieldName)}
					{#if scheme?.fields?.[fieldName] && (mode !== 'show' || (effectiveData != null && fieldName in effectiveData))}
						<div class="field">
							{#if mode === 'show'}
								<DataField {collection} {fieldName} {mode} data={effectiveData!} {inputForm} />
							{:else}
								{#if data !== undefined}<DataField {collection} {fieldName} {mode} bind:data={data} {inputForm} />{/if}
							{/if}
						</div>
					{/if}
				{/each}
			</fieldset>
		{/if}
	{/each}
{:else if view === 'fk'}
	<div class="form">
		{#each fkFieldNames as fieldName (fieldName)}
			<div class="field">
				<span>{fkLabels.get(fieldName)}</span>
				<span><DataFkValue {collection} {fieldName} data={effectiveData ?? {}} /></span>
			</div>
		{/each}
	</div>
{:else}
	<div class="form">
		{#if scheme && fieldNames.length}
			{#each fieldNames as fieldName (fieldName)}
				{#if scheme.fields?.[fieldName] && (mode !== 'show' || (effectiveData != null && fieldName in effectiveData))}
					<div class="field">
						{#if mode === 'show'}
							<DataField {collection} {fieldName} {mode} data={effectiveData!} {inputForm} />
						{:else}
							{#if data !== undefined}<DataField {collection} {fieldName} {mode} bind:data={data as Record<string,unknown>} {inputForm} />{/if}
						{/if}
					</div>
				{/if}
			{/each}
		{/if}
	</div>
{/if}
