<script lang="ts">
	import { DataRecord } from "$lib/index.js";
	let {
		collection,
		collectionId
	}: {
		collection: string;
		collectionId: string;
	} = $props();
</script>



<fiche-component>
    <fiche-header></fiche-header>
    <fiche-zone>
        <div></div>
        <zone-main>
            <DataRecord {collection} collectionId={collectionId} />
        </zone-main>
    </fiche-zone>
</fiche-component>