
<script lang="ts">
import CreateUpdate from '$lib/form/CreateUpdate.svelte'; 
import { machine } from '$lib/main/machine.js';
import { testScheme } from '$lib/demo/testScheme.js';
import CollectionList from '$lib/ui/CollectionList.svelte';


machine.init({ dbName: "demo-db", version: 1, model: testScheme});
machine.start();
 

machine.store['product']?.add({
	name: "Sample Product",
	price: 19.99,
	inStock: true,
	description: "This is a sample product for demonstration purposes."
});  

// console.log("machine.store:", machine.store.agent?.add); 
</script>

<h1>Demo: Svelte 5 CRUD Components</h1>

  

 <CreateUpdate 
	collection="product" 
	mode="create" />
	<CollectionList collection="product" />
	 

 
