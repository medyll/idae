
<script lang="ts">
import CreateUpdate from '$lib/form/CreateUpdate.svelte'; 
import { machine } from '$lib/main/machine.js';
import { testScheme } from '$lib/demo/testScheme.js';
    import CollectionList from '$lib/ui/CollectionList.svelte';


machine.init({ dbName: "test-db", version: 1, model: testScheme});
machine.start();
 

/*   machine.store['agent']?.add({
	name: "Agent Smith",
	email: "Bt3o3@example.com",
	phone: "123-456-7890",
	address: "123 Main Street, Anytown, USA",
	age: 42,
	isActive: true
});  */ 

console.log("machine.store:", machine.store.agent?.add); 
</script>

<h1>Demo: Svelte 5 CRUD Components</h1>

  

 <CreateUpdate 
	collection="agent" 
	mode="create" />
	<CollectionList collection="agent" />
	 

 
