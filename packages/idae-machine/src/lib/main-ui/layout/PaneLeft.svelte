<script lang="ts">
	/**
	 * PaneLeft — search + collections grouped by appscheme_type.
	 * Consumes machine.rights.checkAccess and machine.prefs for visibility filtering.
	 */
	import { machine } from '$lib/main/machine.js';
	import PaneCollectionGroup from './PaneCollectionGroup.svelte';

	interface Props {
		onSelect?: (detail: { collection: string; id?: string }) => void;
	}

	let { onSelect }: Props = $props();

	/** Search query */
	let query = $state('');

	/** Get collections from machine logic, grouped by type */
	let groups = $derived.by(() => {
		const schemes = machine.logic.collections();
		const grouped: Record<string, Array<{ code: string; name: string; type?: string }>> = {};

		for (const scheme of schemes) {
			const colName = scheme.code ?? scheme.name;
			if (!colName) continue;

			// Filter by permissions
			if (!machine.rights.checkAccess(colName, 'R')) continue;

			// Filter by search
			if (query && !colName.toLowerCase().includes(query.toLowerCase())) continue;

			const type = (scheme as any).isType ? 'type'
				: (scheme as any).isGroup ? 'group'
				: 'standard';

			if (!grouped[type]) grouped[type] = [];
			grouped[type].push({ code: colName, name: (scheme as any).name ?? colName, type });
		}

		return Object.entries(grouped).map(([type, cols]) => ({ type, collections: cols }));
	});
</script>

<div class="pane-left">
	<input
		type="search"
		bind:value={query}
		placeholder="Search collections…"
		class="pane-search"
		aria-label="Search collections"
	/>
	<div class="pane-groups">
		{#each groups as group}
			<PaneCollectionGroup
				{group}
				{onSelect}
			/>
		{/each}
		{#if groups.length === 0}
			<p class="pane-empty">No collections found.</p>
		{/if}
	</div>
</div>

<style>
	.pane-left {
		flex: 1;
		display: flex;
		flex-direction: column;
		border-right: 1px solid #e5e7eb;
		overflow: hidden;
	}

	.pane-search {
		margin: 1rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	.pane-groups {
		flex: 1;
		overflow-y: auto;
		padding: 0 1rem 1rem;
	}

	.pane-empty {
		color: #6b7280;
		font-size: 0.875rem;
		text-align: center;
		padding: 2rem 0;
	}
</style>
