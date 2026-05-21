<script lang="ts">
	import SchemeList from '$lib/data-ui/scheme/SchemeList.svelte';
	import PaneCollectionGroup from './PaneCollectionGroup.svelte';

	interface Props {
		onSelect?: (detail: { collection: string; id?: string }) => void;
		activeCollection?: string;
	}

	let { onSelect, activeCollection = '' }: Props = $props();

	let query = $state('');

	type SchemeRow = { code: string; name?: string; isType?: boolean; isGroup?: boolean; [k: string]: unknown };

	function schemeType(row: SchemeRow): 'standard' | 'type' | 'group' {
		if (row.isType) return 'type';
		if (row.isGroup) return 'group';
		return 'standard';
	}

	function groupByType(items: SchemeRow[]) {
		const map: Record<string, { code: string; name: string; type: string }[]> = {};
		for (const row of items) {
			const t = schemeType(row);
			if (!map[t]) map[t] = [];
			map[t].push({ code: row.code, name: row.name ?? row.code, type: t });
		}
		return Object.entries(map).map(([type, collections]) => ({ type, collections }));
	}
</script>

<div class="pane-left">
	<div class="toolbar">
		<input
			type="search"
			bind:value={query}
			placeholder="Search collections…"
			aria-label="Search collections"
		/>
	</div>
	<div class="pane-groups">
		<SchemeList filter={query} {activeCollection} {onSelect}>
			{#snippet children({ items })}
				{#each groupByType(items) as group (group.type)}
					<PaneCollectionGroup {group} {onSelect} {activeCollection} />
				{/each}
			{/snippet}
		</SchemeList>
	</div>
</div>

<style>
	.pane-left {
		flex: 1;
		display: flex;
		flex-direction: column;
		border-right: var(--border-width) solid var(--color-border);
		overflow: hidden;
	}

	.pane-groups {
		flex: 1;
		overflow-y: auto;
		padding: 0 var(--pad-md) var(--pad-md);
	}
</style>
