<!--
RecentPanel.svelte — BL-19. Right-zone panel: appuser_history grouped by collection,
30 days / 15 records cap, gated by useMenuTree('panel') (rights+prefs+dev policy, BL-13).
appuser_history is a user-scoped collection (UserScopePolicy) — machine.store already
returns only the current user's rows. Click navigates via machine.menu.verbs.fiche.
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { useMenuTree } from '$lib/data-ui/utils/useMenuTree.svelte.js';
	import type { MenuZone } from '$lib/data-ui/utils/menuPrefs.js';

	let { zone = 'panel' }: { zone?: MenuZone } = $props();

	type HistoryRecord = {
		collection?: string;
		collection_value?: unknown;
		label?: string;
		lastSeen?: string;
	};

	const panelMenu = useMenuTree(() => zone);
	const historySrc = machine.store('appuser_history');

	const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

	const groups = $derived.by(() => {
		const cutoff = Date.now() - THIRTY_DAYS_MS;
		const records = historySrc.records as HistoryRecord[];

		return panelMenu.tree.groups
			.map((group) => ({
				key: group.key,
				label: group.label,
				items: group.items
					.map((item) => ({
						item,
						records: records
							.filter((r) => r.collection === item.collection)
							.filter((r) => {
								const seen = r.lastSeen ? Date.parse(r.lastSeen) : NaN;
								return !Number.isNaN(seen) && seen >= cutoff;
							})
							.sort((a, b) => String(b.lastSeen ?? '').localeCompare(String(a.lastSeen ?? '')))
							.slice(0, 15)
					}))
					.filter((entry) => entry.records.length > 0)
			}))
			.filter((group) => group.items.length > 0);
	});

	function navigate(collection: string, collectionId: unknown): void {
		machine.menu.verbs.fiche?.(collection, collectionId as string | number);
	}
</script>

<recent-panel-component>
	{#each groups as group (group.key)}
		<recent-panel-group>
			<h4>{group.label}</h4>
			{#each group.items as entry (entry.item.key)}
				{#each entry.records as record (`${record.collection}:${record.collection_value}`)}
					<button
						type="button"
						class="recent-panel-item"
						onclick={() => navigate(record.collection ?? '', record.collection_value)}
					>
						{record.label ?? record.collection_value}
					</button>
				{/each}
			{/each}
		</recent-panel-group>
	{:else}
		<span class="recent-panel-empty">—</span>
	{/each}
</recent-panel-component>

<style>
	@layer components {
		recent-panel-component {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-md, 1rem);
			padding: var(--gutter-sm, 0.5rem);
		}
		recent-panel-group {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs, 0.25rem);
		}
		.recent-panel-item {
			all: unset;
			display: block;
			cursor: pointer;
			padding: 0.25rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
		}
		.recent-panel-item:hover {
			background: var(--color-surface-alt);
		}
		.recent-panel-empty {
			color: var(--color-text-muted, #888);
			padding: 0.25rem 0.5rem;
		}
	}
</style>
