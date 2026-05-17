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

	/** Group entries by collection */
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
	<h3 class="pane-section-title">Recent</h3>
	{#each grouped as [collection, items]}
		<div class="pane-recent-group">
			<h4 class="pane-recent-group-title">{collection}</h4>
			<ul class="pane-recent-list">
				{#each items as item}
					<li>
						<button
							class="pane-recent-item"
							onclick={() => onSelect?.({ collection, id: String(item.collection_value) })}
						>
							<span class="pane-recent-label">{item.label ?? String(item.collection_value)}</span>
							<span class="pane-recent-meta">
								<span class="pane-recent-count">{item.count}×</span>
								<span class="pane-recent-time">{formatDate(item.lastSeen)}</span>
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
	{#if entries.length === 0}
		<p class="pane-empty">No recent activity.</p>
	{/if}
</div>

<style>
	.pane-section-title {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
		margin: 0 0 0.75rem;
	}

	.pane-recent-group {
		margin-bottom: 1rem;
	}

	.pane-recent-group-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: #374151;
		margin: 0 0 0.5rem;
	}

	.pane-recent-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.pane-recent-item {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.375rem 0.5rem;
		background: none;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		text-align: left;
	}

	.pane-recent-item:hover {
		background: #f3f4f6;
	}

	.pane-recent-label {
		font-size: 0.8125rem;
		color: #374151;
	}

	.pane-recent-meta {
		display: flex;
		gap: 0.5rem;
		font-size: 0.6875rem;
		color: #9ca3af;
	}

	.pane-empty {
		color: #6b7280;
		font-size: 0.875rem;
		text-align: center;
		padding: 1rem 0;
	}
</style>
