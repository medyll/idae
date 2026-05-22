<script lang="ts">
	import "../app.css";
	import { machine } from '$lib/main/machine.js';
	import { App } from '$lib/shell/layout/index.js';
	import { demoScheme } from '$lib/demo/demoScheme.js';

	const apiUrl = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? 'http://localhost:3000';

	machine.init({
		org: 'demo', domain: 'machine', version: 2,
		business: demoScheme,
		sync: {
			mode: 'server-first',
			databaseHost: apiUrl,
		},
	});
	machine.start();
	machine.initRouter({ baseUrl: '/', authEnabled: false });
</script>

<App />
