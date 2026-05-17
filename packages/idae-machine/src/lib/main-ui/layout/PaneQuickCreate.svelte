<script lang="ts">
	/**
	 * PaneQuickCreate — buttons for creating records in accessible collections.
	 */
	interface Props {
		collections: Array<{ code: string; name: string }>;
		onSelect?: (detail: { collection: string; id?: string }) => void;
	}

	let { collections, onSelect }: Props = $props();
</script>

<div class="pane-quick-create">
	<h3 class="pane-section-title">Quick Create</h3>
	<div class="pane-create-buttons">
		{#each collections as col}
			<button
				class="pane-create-btn"
				onclick={() => onSelect?.({ collection: col.code })}
			>
				+ {col.name}
			</button>
		{/each}
	</div>
</div>

<style>
	.pane-quick-create {
		margin-bottom: 1.5rem;
	}

	.pane-section-title {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
		margin: 0 0 0.75rem;
	}

	.pane-create-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.pane-create-btn {
		padding: 0.5rem 0.75rem;
		background: #f0f9ff;
		border: 1px solid #bae6fd;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.8125rem;
		color: #0369a1;
		transition: background 0.15s;
	}

	.pane-create-btn:hover {
		background: #e0f2fe;
	}
</style>
