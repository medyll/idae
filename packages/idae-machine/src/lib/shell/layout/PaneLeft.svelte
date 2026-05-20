<script lang="ts">
	import SchemeList from '$lib/data-ui/scheme/SchemeList.svelte';
	import PaneCollectionGroup from './PaneCollectionGroup.svelte';

	interface Props {
		onSelect?: (detail: { collection: string; id?: string }) => void;
		activeCollection?: string;
	}

	let { onSelect, activeCollection = '' }: Props = $props();

	let query = $state('');
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
			{#snippet children({ group })}
				<PaneCollectionGroup {group} {onSelect} {activeCollection} />
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
