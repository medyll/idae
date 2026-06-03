<script lang="ts">
	import { DataForm, machine } from "$lib/index.js";
	let {
		collection,
		collectionId
	}: {
		collection: string;
		collectionId: string;
	} = $props();
</script>

<fiche-component>
    <fiche-header>
        <toolbar-component>
            <button onclick={() => machine.framer.loadFrame('synthesis', collection, collectionId)}>synthese</button>
        </toolbar-component>
    </fiche-header>
    <fiche-zone>
        <zone-main>
            <DataForm {collection} dataId={collectionId} mode="update" />
        </zone-main>
    </fiche-zone>
</fiche-component>

<style lang="postcss">
    @layer components {
        :global(fiche-component) {
            display: flex;
            flex-direction: column;
            min-height: 0;
            gap: var(--gutter-sm);
            padding: var(--pad-md);
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

        :global(zone-main) {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
        }
    }
</style>
