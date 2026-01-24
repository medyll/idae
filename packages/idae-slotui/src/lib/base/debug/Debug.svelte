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

<div style="padding:0.5rem">
	<Cartouche isOpen={true} primary="debug zone here">
		<pre>{JSON.stringify($$props, null, ' ')}</pre>
	</Cartouche>
</div>
