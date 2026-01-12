
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
let showCreate = $state(false);
let confirmDelete = $state<{id:number,name:string}|null>(null);

function handleAddAgent() {
	showCreate = true;
}

function handleDeleteAgent(agent) {
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
	<CrudZone collection="agents" crud={crud} />
</section>
	<button on:click={handleAddAgent}>Ajouter un agent</button>

<section>
	<h2>CollectionList</h2>
	<CollectionList collection="agents" items={crud.list('agents')} displayMode="grid" on:click={e => handleSelectAgent(e.detail.data)} />
</section>
	<ul>
		{#each crud.list('agents') as agent}
			<li>
				{agent.name} ({agent.code})
				<button on:click={() => handleSelectAgent(agent)}>Éditer</button>
				<button on:click={() => handleDeleteAgent(agent)}>Supprimer</button>
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
			on:update={e => { selected = crud.get('agents', selected.id); showForm = false; }}
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
		<button on:click={confirmDeleteAgent}>Oui, supprimer</button>
		<button on:click={cancelDeleteAgent}>Annuler</button>
	</section>
{/if}
