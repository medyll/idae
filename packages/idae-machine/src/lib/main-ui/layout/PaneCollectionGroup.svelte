<script lang="ts">
	/**
	 * PaneCollectionGroup — renders a group of collections with a type header.
	 */
	interface Props {
		group: { type: string; collections: Array<{ code: string; name: string; type?: string }> };
		onSelect?: (detail: { collection: string; id?: string }) => void;
	}

	let { group, onSelect }: Props = $props();

	const typeLabels: Record<string, string> = {
		standard: 'Collections',
		type: 'Types',
		group: 'Groups',
	};
</script>

<div class="pane-group">
	<h3 class="pane-group-title">{typeLabels[group.type] ?? group.type}</h3>
	<ul class="pane-group-list">
		{#each group.collections as col}
			<li>
				<button
					class="pane-collection-btn"
					onclick={() => onSelect?.({ collection: col.code })}
				>
					{col.name}
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.pane-group {
		margin-bottom: 1rem;
	}

	.pane-group-title {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
		margin: 0 0 0.5rem;
	}

	.pane-group-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.pane-group-list li {
		margin-bottom: 0.25rem;
	}

	.pane-collection-btn {
		width: 100%;
		text-align: left;
		padding: 0.5rem 0.75rem;
		background: none;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		color: #374151;
	}

	.pane-collection-btn:hover {
		background: #f3f4f6;
	}
</style>
