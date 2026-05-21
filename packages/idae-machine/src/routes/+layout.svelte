<script lang="ts">
	import "../app.css";
	import { machine } from '$lib/main/machine.js';
	import { App } from '$lib/shell/layout/index.js';

	machine.init({ org: 'demo', domain: 'machine', version: 2 });
	machine.start();
	machine.initRouter({ baseUrl: '/', authEnabled: false });
</script>

<App />
