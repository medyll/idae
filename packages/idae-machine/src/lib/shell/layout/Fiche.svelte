<script lang="ts">
	import DataRecord from '$lib/data-ui/data/DataRecord.svelte';
	import RecordToolbar from './RecordToolbar.svelte';
	import RecordTimeline from './RecordTimeline.svelte';
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
		<RecordToolbar {collection} {collectionId} />
	</fiche-header>
	<fiche-zone>
		<sidebar-info>
			<DataRecord {collection} {collectionId} showFields={['icon']} showLabel={false} />
		</sidebar-info>
		<zone-main-half>
			<zone-main-content>
				<zone-main-fields><DataRecord {collection} {collectionId} groupFieldBy="appscheme_field_group" /></zone-main-fields>
				<fiche-timeline><RecordTimeline {collection} {collectionId} /></fiche-timeline>
			</zone-main-content>
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
			gap: 0;
			padding: 0;
			width: 100%;
			max-inline-size: calc(var(--gutter-3xl) * 12);
			background: var(--color-surface-raised);
		}

		:global(fiche-header) {
			display: block;
			background: var(--color-surface-alt);
			border-bottom: var(--border-width) solid var(--color-border-strong);
		}

		:global(fiche-zone) {
			display: flex;
			flex: 1;
			min-height: 0;
			gap: 0;
		}

		:global(sidebar-info) {
			display: block;
			flex: 0 0 calc(var(--gutter-3xl) * 2);
			padding: var(--pad-sm);
			background: var(--color-surface-alt);
			border-right: var(--border-width) solid var(--color-border);
		}

		:global(zone-main-half) {
			display: flex;
			flex-direction: row;
			flex: 1;
			min-width: 0;
			gap: 0;
		}

		/* was a bare <div> with no flex-grow — zone-main-half's flex children
		   default to shrink-to-fit, so the grouped fields never stretched,
		   leaving a dead gap before info-bar-right. */
		:global(zone-main-fields) {
			display: block;
			flex: 1;
			min-width: 0;
		}

		:global(zone-main-content) {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-width: 0;
			gap: var(--gutter-sm);
			padding: var(--pad-sm);
		}

		:global(fiche-timeline) {
			display: block;
		}

		:global(info-bar-right) {
			display: block;
			flex: 0 0 calc(var(--gutter-3xl) * 3);
			max-width: calc(var(--gutter-3xl) * 3);
			padding: var(--pad-sm);
			background: var(--color-surface-alt);
			border-left: var(--border-width) solid var(--color-border);
		}
	}
</style>
