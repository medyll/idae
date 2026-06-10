<!--
DataListRelations.svelte
Renders forward or reverse FK relations for a record as DataList sections.
@role data-relations
@prop {string} collection - Source collection name
@prop {'forward'|'reverse'} [direction] - FK direction (default: 'forward')
@prop {string|number} [recordId] - Source record id (if data not provided)
@prop {Record<string,unknown>|null} [data] - Source record (controlled)
@prop {string} [fk] - Filter to a single FK key
@prop {boolean} [showTitle] - Show section title (default: true)
@prop {boolean} [usePrefs] - Use persisted user prefs (default: false)
@prop {string} [prefsScope] - Custom prefs scope
-->
<script lang="ts">
	import DataList from './DataList.svelte';
	import { machine } from '$lib/main/machine.js';
	import { resolveForwardRelations, resolveReverseRelations } from '$lib/data-ui/utils/dataRelationUtils.js';

	let {
		collection,
		direction = 'forward',
		recordId,
		data = undefined,
		fk,
		showTitle  = true,
		usePrefs   = false,
		prefsScope,
		...dataListProps
	}: {
		collection:  string;
		direction?:  'forward' | 'reverse';
		recordId?:   string | number;
		data?:       Record<string, unknown> | null;
		fk?:         string;
		showTitle?:  boolean;
		usePrefs?:   boolean;
		prefsScope?: string;
		[key: string]: unknown;
	} = $props();

	const sourceStore = $derived(collection ? machine.store<Record<string, unknown>>(collection) : { records: [] as Record<string, unknown>[] });
	const scheme      = $derived(collection ? machine.logic.collectionOr(collection, null) : null);
	const record      = $derived.by(() => {
		if (data) return data;
		if (recordId == null) return null;
		return sourceStore.records.find((item) => String(item.id) === String(recordId)) ?? null;
	});

	let recordLookupSettled = $state(false);
	$effect(() => {
		void collection; void recordId; void data;
		recordLookupSettled = data != null || recordId == null;
		if (data != null || recordId == null) return;
		const timer = setTimeout(() => { recordLookupSettled = true; }, 50);
		return () => clearTimeout(timer);
	});

	const recordState = $derived.by(() => {
		if (record) return 'found';
		return recordLookupSettled ? 'absent' : 'loading';
	});

	const relations = $derived.by(() => {
		if (!scheme || !record) return { resolved: [], unresolved: [] };
		return direction === 'reverse'
			? resolveReverseRelations(scheme, record, fk)
			: resolveForwardRelations(scheme, record, fk);
	});
</script>

{#if recordState === 'loading'}
	<div class="data-list-relation-state">Loading...</div>
{:else if recordState === 'absent'}
	<div class="data-list-relation-state">Record not found.</div>
{:else}
	{#each relations.unresolved as relation (relation.collection + ':' + relation.key)}
		<div class="data-list-relation-error">{relation.error}</div>
	{/each}
	{#if relations.resolved.length}
		{#each relations.resolved as relation (relation.collection + ':' + relation.key)}
			<section class="data-list-relation">
				{#if showTitle}
					<h3 class="data-list-relation-title">{relation.title}</h3>
				{/if}
				<DataList
					{usePrefs}
					{prefsScope}
					collection={relation.collection}
					where={relation.where}
					{...dataListProps}
				/>
			</section>
		{/each}
	{:else if !relations.unresolved.length}
		<div class="data-list-relation-state">No related records.</div>
	{/if}
{/if}
