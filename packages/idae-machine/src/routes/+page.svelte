<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { demoScheme } from '$lib/demo/demoScheme.js';

	machine.init({ org: 'demo', domain: 'machine', dbName: 'testdb', version: 1, model: demoScheme });
machine.start();
machine.initRouter({ baseUrl: '/' });
</script>

<div class="home-empty">
	<p>Select a collection from the sidebar</p>
</div>

<style>
	.home-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-text-muted);
	}
</style>
