<script lang="ts">
	import { DataRecord } from '$lib/index.js';
	import FicheToolbar from './FicheToolbar.svelte';
	let {
		collection,
		collectionId
	}: {
		collection: string;
		collectionId: string | number;
	} = $props();
</script>

<fiche-component>
	<fiche-header>
		<FicheToolbar {collection} {collectionId} />
	</fiche-header>
	<fiche-zone>
		<sidebar-info>
			<DataRecord {collection} {collectionId} showFields={['icon']} showLabel={false} />
        </sidebar-info>
		<zone-main-half>
			<div><DataRecord {collection} {collectionId} groupFieldBy="appscheme_field_group" /></div>
			<info-bar-right>
				<DataRecord {collection} {collectionId} view="fk" />
			</info-bar-right>
		</zone-main-half>
	</fiche-zone>
</fiche-component>

<style lang="postcss">
	/* Custom tags default to display:inline — without explicit block/flex the
       fiche collapses and its content is clipped by the host (dialog) body.
       :global required: Svelte scopes element selectors, but these tags are
       mounted dynamically by the framer host. */
	@layer components {
		:global(fiche-component) {
			display: flex;
			flex-direction: column;
			min-height: 0;
			gap: var(--gutter-sm);
			padding: var(--pad-md);
            width: clamp(100%, 300px, 750px);
		}

		:global(fiche-header) {
			display: block;
		}

		:global(fiche-zone) {
			display: flex;
			flex: 1;
			min-height: 0;
			gap: var(--gutter-md);
		}

		:global(sidebar-info) {
			display: block;
			flex: 0 0 auto;
		}

		:global(zone-main-half) {
			display: flex;
			flex-direction: row;
			flex: 1;
			min-width: 0;
			gap: var(--gutter-md);
		}
	}
</style>
