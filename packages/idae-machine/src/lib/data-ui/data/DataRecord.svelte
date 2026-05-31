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
	import { sortItems, groupItems, parseFkType } from '$lib/data-ui/utils/data-utils.js';
	import type { SortBy } from '$lib/types/index.js';
	import { getContext } from 'svelte';

	let {
		collection = getContext('collection'),
		data = $bindable(),
		collectionId,
		mode = 'show',
		showFields,
		view,
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
		view?: 'full' | 'flat' | 'fk' | 'focus' | string;
		sortBy?: SortBy | SortBy[];
		groupBy?: string;
		groupChildren?: Snippet<[{ key: string; fieldNames: string[] }]>;
		inputForm?: string;
	} = $props();

	function safeScheme(name: string) {
		try { return machine.logic.collection(name); } catch { return null; }
	}

	const scheme = $derived(collection ? safeScheme(collection) : null);

	// Data source contract:
	//  - `data` prop provided  → controlled (e.g. DataList store items). Use as-is.
	//  - else `collectionId`   → reactive read via machine.store (NOT machine.collection;
	//    store is the reactive read layer, collection is imperative CRUD). Same path
	//    DataList uses, so it resolves the correct qoolie instance.
	const queryId = $derived(
		collectionId == null
			? undefined
			: isNaN(Number(collectionId)) ? collectionId : Number(collectionId)
	);
	const recordStore = $derived(
		data === undefined && collection && queryId !== undefined
			? machine.store(collection, { [scheme?.index ?? 'id']: queryId } as any)
			: null
	);
	const fetchedData = $derived(recordStore?.items?.[0] as Record<string, any> | undefined);

	const effectiveData = $derived(data ?? fetchedData);

	/** Fields as sortable/groupable objects — key + field definition properties */
	const fieldObjects = $derived.by(() => {
		const fields = scheme?.fields;
		if (!fields) return [];
		let keys: string[];
		if (showFields?.length) {
			keys = showFields.filter(k => k in fields);
		} else if (view) {
			// Named view returns an ordered field list; keep only existing fields.
			keys = (scheme?.getFieldsForView(view as 'full' | 'flat' | 'fk' | 'focus') ?? [])
				.map(f => f.name)
				.filter(k => k in fields);
		} else {
			keys = Object.keys(fields);
		}
		return keys.map(key => ({ key, ...(fields[key] as unknown as Record<string, unknown>) }));
	});

	const sortedFields = $derived(
		sortBy ? sortItems(fieldObjects, sortBy) : fieldObjects
	);

	const groups = $derived(
		groupBy ? groupItems(sortedFields, groupBy) as Map<string, typeof sortedFields> : undefined
	);

	const fieldNames = $derived(sortedFields.map(f => f.key));

	// view='fk': fieldNames are already FK-only (getFieldsForView('fk')).
	// Label per field = target collection's appscheme.name, read reactively from the store.
	// Guard: only read when appscheme is part of the effective model (else fall back to collection key).
	const hasAppscheme = $derived('appscheme' in (machine.logic?.model ?? {}));
	const appschemeItems = $derived(
		view === 'fk' && hasAppscheme
			? (machine.store('appscheme').items as Record<string, unknown>[])
			: []
	);
	const fkLabels = $derived.by(() => {
		const map = new Map<string, string>();
		if (view !== 'fk' || !scheme) return map;
		for (const fieldName of fieldNames) {
			const fk = parseFkType(scheme.field(fieldName).parse()?.fieldType as string | undefined);
			if (!fk) continue;
			const meta = appschemeItems.find(i => i.code === fk.collection);
			map.set(fieldName, String(meta?.name ?? fk.collection));
		}
		return map;
	});
	const fkFieldNames = $derived(fieldNames.filter(f => fkLabels.has(f)));
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
