<script lang="ts">
	import DataList from '$lib/data-ui/data/DataList.svelte';

	interface HistoryEntry {
		id: string;
		collection: string;
		collection_value: unknown;
		label?: string;
		count: number;
		lastSeen: string;
	}

	interface Props {
		onSelect?: (detail: { collection: string; id?: string }) => void;
	}

	let { onSelect }: Props = $props();

	function formatDate(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

<div class="pane-recents">
	<header class="section-header">
		<h3>Recent</h3>
	</header>
	<DataList collection="_history" groupBy="collection" sortBy={{ field: 'lastSeen', direction: 'desc' }}>
		{#snippet children({ groups, items })}
			{#if groups && groups.size > 0}
				{#each Array.from(groups) as [col, colItems]}
					<section class="pane-recent-group">
						<header class="section-header section-header-lg">
							<h4>{col}</h4>
						</header>
						<ul class="list list-stack list-compact" role="list">
							{#each colItems as item}
								{@const entry = item as unknown as HistoryEntry}
								<li>
									<button
										type="button"
										class="list-item btn-ghost"
										onclick={() => onSelect?.({ collection: col, id: String(entry.collection_value) })}
									>
										<div class="list-item-content">
											<div class="list-item-title">{entry.label ?? String(entry.collection_value)}</div>
										</div>
										<div class="list-item-trail">
											<span>{entry.count}×</span>
											<span>{formatDate(String(entry.lastSeen))}</span>
										</div>
									</button>
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			{:else if items.length === 0}
				<div class="empty-state">
					<p class="empty-state-text">No recent activity.</p>
				</div>
			{/if}
		{/snippet}
	</DataList>
</div>

<style>
	.pane-recent-group { margin-bottom: var(--gutter-md); }
	.list-item.btn-ghost {
		width: 100%;
		justify-content: space-between;
		border: none;
		background: transparent;
	}
	.list-item-trail {
		display: flex;
		gap: var(--gutter-sm);
	}
</style>
