

 
<script lang="ts">
import { machine } from '$lib/main/machine.js';
import CollectionButton from '$lib/ui/CollectionButton.svelte';
import CollectionList from '$lib/ui/CollectionList.svelte';
import CollectionListMenu from '$lib/ui/CollectionListMenu.svelte';
import CollectionFks from '$lib/ui/CollectionFks.svelte';
import CollectionReverseFks from '$lib/ui/CollectionReverseFks.svelte';
import DataProvider from '$lib/form/DataProvider.svelte';
import CreateUpdate from '$lib/form/CreateUpdate.svelte';
import FieldValue from '$lib/form/FieldValue.svelte';
import { schemeModelTestDb } from '$lib/demo/testDbSchema.js';

machine.init({ dbName: 'demo-db', version: 5, model: schemeModelTestDb });
machine.start();
</script>

<h1>Svelte 5 UI/Form Components Demo</h1>

<!-- Minimal demo for each component, no CRUD, just visible usage -->
<section>
	<h2>CollectionButton</h2>
	<CollectionButton collection="agent" />
</section>

<section>
	<h2>CollectionList</h2>
	{#if machine.store.agent}
		<CollectionList collection="agent" />
	{:else}
		<p>Collection store not initialized.</p>
	{/if}
</section>

<section>
	<h2>CollectionListMenu</h2>
	<CollectionListMenu collection="agent" />
</section>

<section>
	<h2>CollectionFks</h2>
	<CollectionFks collection="agent" />
</section>

<section>
	<h2>CollectionReverseFks</h2>
	<CollectionReverseFks collection="agent" />
</section>

<section>
	<h2>DataProvider</h2>
	<DataProvider collection="agent" data={[]}> <!-- empty for demo -->
		<div>DataProvider children go here</div>
	</DataProvider>
</section>

<section>
	<h2>CreateUpdate</h2>
	<CreateUpdate collection="agent" mode="create"   />
</section>

<section>
	<h2>FieldValue</h2>
	<FieldValue collection="agent" fieldName="name" data={{ name: 'Demo' }} mode="show" />
</section>


