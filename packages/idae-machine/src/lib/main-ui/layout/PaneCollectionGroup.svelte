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

<section class="pane-group">
	<header class="section-header">
		<h3>{typeLabels[group.type] ?? group.type}</h3>
	</header>
	<ul class="list list-stack" role="list">
		{#each group.collections as col}
			<li>
				<button
					type="button"
					class="list-item btn-ghost"
					onclick={() => onSelect?.({ collection: col.code })}
				>
					<div class="list-item-content">{col.name}</div>
				</button>
			</li>
		{/each}
	</ul>
</section>

<style>
	.pane-group { margin-bottom: var(--gutter-md); }
	/* Override default btn inline-flex centering: full-width left-aligned */
	.list-item.btn-ghost {
		width: 100%;
		justify-content: flex-start;
		border: none;
		background: transparent;
	}
</style>
