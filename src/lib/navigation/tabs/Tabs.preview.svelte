<svelte:options />

<script lang="ts">
	import Tabs from './Tabs.svelte';
	import type { TabsItemsProps } from './types.js';
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import Divider from '$lib/base/divider/Divider.svelte';
	import Button from '$lib/controls/button/Button.svelte';

	const items: TabsItemsProps = [
		{ label: 'Tab 1', code: 'theTitle1', withContent: 'ff', secondary: 'some' },
		{ label: 'Tab 2', code: 'theTitle2' },
		{
			label: 'Another tab',
			code: 'theTitle3',
			withComponent: Cartouche,
			componentProps: { label: 'inner component' }
		}
	];
</script>

<Tabs activeTabCode="theTitle3" {items}>s</Tabs>
