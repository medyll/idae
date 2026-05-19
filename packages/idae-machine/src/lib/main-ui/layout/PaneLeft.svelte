<script lang="ts">
	/**
	 * PaneLeft — search + collections grouped by appscheme_type.
	 * Consumes machine.rights.checkAccess and machine.prefs for visibility filtering.
	 */
	import { machine } from '$lib/main/machine.js';
	import PaneCollectionGroup from './PaneCollectionGroup.svelte';

	interface Props {
		onSelect?: (detail: { collection: string; id?: string }) => void;
		activeCollection?: string;
	}

	let { onSelect, activeCollection = '' }: Props = $props();

	/** Search query */
	let query = $state('');

	/** Get collections from machine logic, grouped by type */
	let groups = $derived.by(() => {
		const schemes = machine.logic.collections();
		const grouped: Record<string, Array<{ code: string; name: string; type?: string }>> = {};

		for (const scheme of schemes) {
			const colName = scheme.collection ?? scheme.name;
			if (!colName) continue;

			// Filter by permissions
			if (!machine.rights.checkAccess(colName, 'R')) continue;

			// Filter by search
			if (query && !colName.toLowerCase().includes(query.toLowerCase())) continue;

			const type = (scheme as any).model?.isType ? 'type'
				: (scheme as any).model?.isGroup ? 'group'
				: 'standard';

			if (!grouped[type]) grouped[type] = [];
			grouped[type].push({ code: colName, name: colName, type });
		}

		return Object.entries(grouped).map(([type, cols]) => ({ type, collections: cols }));
	});
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
		{#each groups as group}
			<PaneCollectionGroup
				{group}
				{onSelect}
				{activeCollection}
			/>
		{/each}
		{#if groups.length === 0}
			<div class="empty-state">
				<div class="empty-state-icon">🔍</div>
				<p class="empty-state-text">No collections found.</p>
			</div>
		{/if}
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
