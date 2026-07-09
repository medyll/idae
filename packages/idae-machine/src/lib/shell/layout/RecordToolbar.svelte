<!--
RecordToolbar.svelte (renamed from FicheToolbar — BL-22: toolbar of a record, not
of a Fiche specifically; now also consumed by ContextMenuContent).
Composed of generic ButtonAction bricks.

@prop {string} collection
@prop {string|number} collectionId
-->
<script lang="ts">
	import ButtonAction from '$lib/data-ui/controls/ButtonAction.svelte';

	let { collection, collectionId }: { collection: string; collectionId: string | number } =
		$props();
</script>

<toolbar-component>
	<ButtonAction {collection} {collectionId} frame="synthesis" label="synthese" />
	<ButtonAction {collection} {collectionId} frame="diagram" label="diagram" />
	<ButtonAction
		{collection}
		{collectionId}
		frame="fiche.update"
		label="update"
		action="loadInDialog"
	/>
</toolbar-component>

<style>
	@layer components {
		/* Dynamically mounted inside the fiche frame host — :global needed. */
		:global(toolbar-component) {
			display: flex;
			gap: var(--gutter-sm);
			align-items: center;
		}
	}
</style>
