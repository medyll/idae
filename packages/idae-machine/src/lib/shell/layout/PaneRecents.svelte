<script lang="ts">
	/**
	 * PaneRecents — recent history entries grouped by collection.
	 */
	interface HistoryEntry {
		id: string;
		collection: string;
		collection_value: unknown;
		label?: string;
		count: number;
		lastSeen: string;
	}

	interface Props {
		entries: HistoryEntry[];
		onSelect?: (detail: { collection: string; id?: string }) => void;
	}

	let { entries, onSelect }: Props = $props();

	let grouped = $derived.by(() => {
		const groups: Record<string, HistoryEntry[]> = {};
		for (const entry of entries) {
			if (!groups[entry.collection]) groups[entry.collection] = [];
			groups[entry.collection].push(entry);
		}
		return Object.entries(groups);
	});

	function formatDate(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

<div class="pane-recents">
	<header class="section-header">
		<h3>Recent</h3>
	</header>
	{#each grouped as [collection, items]}
		<section class="pane-recent-group">
			<header class="section-header section-header-lg">
				<h4>{collection}</h4>
			</header>
			<ul class="list list-stack list-compact" role="list">
				{#each items as item}
					<li>
						<button
							type="button"
							class="list-item btn-ghost"
							onclick={() => onSelect?.({ collection, id: String(item.collection_value) })}
						>
							<div class="list-item-content">
								<div class="list-item-title">{item.label ?? String(item.collection_value)}</div>
							</div>
							<div class="list-item-trail">
								<span>{item.count}×</span>
								<span>{formatDate(item.lastSeen)}</span>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
	{#if entries.length === 0}
		<div class="empty-state">
			<p class="empty-state-text">No recent activity.</p>
		</div>
	{/if}
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
