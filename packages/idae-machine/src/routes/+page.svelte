
<script lang="ts">
import CreateUpdate from '$lib/form/CreateUpdate.svelte'; 
import { machine } from '$lib/main/machine.js';
import { testScheme } from '$lib/demo/testScheme.js';

machine.init({ dbName: "test-db", version: 1, model: testScheme});
machine.start();
 

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

 

function cancelDeleteAgent() {
	confirmDelete = null;
}
</script>

<h1>Demo: Svelte 5 CRUD Components</h1>

  

 <CreateUpdate 
	collection="agent" 
	mode="create" 
	oncreate={e => { showCreate = false; }}
	/>
	 

 
