
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { demoScheme } from '$lib/demo/demoScheme.js';

	// Initialize machine — demoScheme IS the model (top-level keys = collection names)
	machine.init({  org: 'demo',  domain: 'machine',dbName: 'testdb', version: 1, model: demoScheme });
	machine.start();


</script>



