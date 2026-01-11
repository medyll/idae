
<script lang="ts">
import { CrudService } from '../_work/CrudService.js';
import CrudZone from '../_work/CrudZone.svelte';
import CollectionList from '../_work/CollectionList.svelte';
import CreateUpdate from '../_work/CreateUpdate.svelte';
import FieldValue from '../_work/FieldValue.svelte';

const crud = new CrudService();
crud.create('agents', { id: 1, name: 'John', code: 'A1' });
crud.create('agents', { id: 2, name: 'Jane', code: 'A2' });

let selected = $state<any>(null);
let showForm = $state(false);

function handleSelectAgent(agent) {
	selected = agent;
	showForm = true;
}
</script>

<h1>Demo: Svelte 5 CRUD Components</h1>

<section>
	<CrudZone collection="agents" crud={crud} />
</section>

<section>
	<h2>CollectionList</h2>
	<CollectionList collection="agents" items={crud.list('agents')} displayMode="grid" on:click={e => handleSelectAgent(e.detail.data)} />
</section>

{#if showForm}
	<section>
		<h2>Edit Agent</h2>
		<CreateUpdate 
			collection="agents" 
			mode="update" 
			dataId={selected.id} 
			showFields={["name", "code"]} 
			crud={crud}
			on:update={e => { selected = crud.get('agents', selected.id); showForm = false; }}
			on:create={e => { showForm = false; }}
		/>
		<h3>FieldValue Example</h3>
		<FieldValue collection="agents" fieldName="name" data={selected} mode="show" />
	</section>
{/if}
