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

<section class="pane-quick-create">
	<header class="section-header">
		<h3>Quick Create</h3>
	</header>
	<div class="toolbar toolbar-wrap" style="padding:0;">
		{#each collections as col}
			<button
				type="button"
				class="btn btn-sm"
				onclick={() => onSelect?.({ collection: col.code })}
			>
				+ {col.name}
			</button>
		{/each}
	</div>
</section>

<style>
	.pane-quick-create { margin-bottom: var(--gutter-lg); }
</style>
