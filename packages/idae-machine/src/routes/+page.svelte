
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { testScheme } from '$lib/demo/testScheme.js';

	// Initialize machine — testScheme IS the model (top-level keys = collection names)
	machine.init({  org: 'test',  domain: 'machine',dbName: 'testdb', version: 1, model: testScheme });
	machine.start();


</script>



