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
	<DataList
		collection="appuser_history"
		groupBy="collection"
		sortBy={{ field: 'lastSeen', direction: 'desc' }}
		listClass="list list-stack list-compact"
		groupClass="pane-recent-group"
	>
		{#snippet groupHeader({ key: col })}
			<header class="section-header section-header-lg">
				<h4>{col}</h4>
			</header>
		{/snippet}

		{#snippet item({ record })}
			{@const entry = record as unknown as HistoryEntry}
			<li>
				<button
					type="button"
					class="list-item btn-ghost"
					onclick={() => onSelect?.({ collection: String(entry.collection), id: String(entry.collection_value) })}
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
		{/snippet}

		{#snippet empty()}
			<div class="empty-state">
				<p class="empty-state-text">No recent activity.</p>
			</div>
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
