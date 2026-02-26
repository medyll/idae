<script module lang="ts">
// Module-level Props marker for migration tooling
export type DebugProps = Record<string, unknown>;
</script>

<script lang="ts">
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import type TabsItemsProps from '$lib/navigation/tabs/Tabs.svelte';

	const items: TabsItemsProps = [
		{ label: 'theTitle', code: 'theTitle1' },
		{ label: 'theTitle bis', code: 'theTitle2' },
		{
			label: 'theTitle ter',
			code: 'theTitle3',
			component: Cartouche,
			componentProps: { label: 'dynamic' }
		}
	];
</script>

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--debug-bg: #f5f5f5;
		--debug-color: #333;
		--debug-radius: 6px;
		--debug-padding: 0.5rem 1rem;
	}

	.debug {
		background: var(--debug-bg);
		color: var(--debug-color);
		border-radius: var(--debug-radius);
		padding: var(--debug-padding);
		font-size: 0.95em;
		font-family: monospace;
	}
</style>

<div style="padding:0.5rem">
	<Cartouche isOpen={true} primary="debug zone here">
		<pre>{JSON.stringify($$props, null, ' ')}</pre>
	</Cartouche>
</div>
