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
        <sidebar-info></sidebar-info>
        <zone-main>
            <DataRecord {collection} {collectionId} />
            <DataRecord {collection} {collectionId} view="fk" />
        </zone-main>
    </fiche-zone>
</fiche-component>