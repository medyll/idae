
<script lang="ts">
import { CrudService } from '$lib/db/CrudService.js';
import CrudZone from '$lib/form/CrudZone.svelte';
import DataList from '$lib/form/DataList.svelte';
import CreateUpdate from '$lib/form/CreateUpdate.svelte';
import FieldValue from '$lib/form/FieldValue.svelte';

const crud = new CrudService();
crud.create('agents', { id: 1, name: 'John', code: 'A1' });
crud.create('agents', { id: 2, name: 'Jane', code: 'A2' });

let selected = $state<any>(null);
let showForm = $state(false);

function handleSelectAgent(agent: any) {
	selected = agent;
	showForm = true;
}
let showCreate = $state(false);
let confirmDelete = $state<{id:number,name:string}|null>(null);

function handleAddAgent() {
	showCreate = true;
}

function handleDeleteAgent(agent: any) {
	confirmDelete = { id: agent.id, name: agent.name };
}

function confirmDeleteAgent() {
	if (confirmDelete) {
		crud.delete('agents', confirmDelete.id);
		confirmDelete = null;
		selected = null;
		showForm = false;
	}
}

function cancelDeleteAgent() {
	confirmDelete = null;
}
</script>

<h1>Demo: Svelte 5 CRUD Components</h1>

<section>
	<!-- <CrudZone collection="agents" crud={crud} /> -->
</section>
	<button onclick={handleAddAgent}>Ajouter un agent</button>

<section>
	<h2>DataList</h2>
	<DataList collection="agents" items={crud.list('agents')} displayMode="grid" onItemClick={handleSelectAgent} />
</section>
	<ul>
		{#each crud.list('agents') as agent}
			<li>
				{agent.name} ({agent.code})
				<button onclick={() => handleSelectAgent(agent)}>Éditer</button>
				<button onclick={() => handleDeleteAgent(agent)}>Supprimer</button>
			</li>
		{/each}
	</ul>

{#if showForm}
	<section>
		<h2>Éditer un agent</h2>
		<CreateUpdate 
			collection="agents" 
			mode="update" 
			dataId={selected.id} 
			showFields={["name", "code"]} 
			crud={crud}
			onupdate={e => { selected = crud.get('agents', selected.id); showForm = false; }}
		/>
		<h3>FieldValue Example</h3>
		<FieldValue collection="agents" fieldName="name" data={selected} mode="show" />
	</section>
{/if}

{#if showCreate}
	<section>
		<h2>Créer un agent</h2>
		<CreateUpdate 
			collection="agents" 
			mode="create" 
			showFields={["name", "code"]} 
			crud={crud}
			on:create={e => { showCreate = false; }}
		/>
	</section>
{/if}

{#if confirmDelete}
	<section>
		<h2>Confirmer la suppression</h2>
		<p>Supprimer l'agent : <b>{confirmDelete.name}</b> ?</p>
		<button onclick={confirmDeleteAgent}>Oui, supprimer</button>
		<button onclick={cancelDeleteAgent}>Annuler</button>
	</section>
{/if}
