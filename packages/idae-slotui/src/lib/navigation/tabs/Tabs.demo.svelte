<svelte:options runes />

<script lang="ts">
	import Tabs from './Tabs.svelte';
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import type { TabsItemsProps } from './Tabs.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import DemoerComponent from '$lib/base/demoer/DemoerComponent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';

	import { parameters, componentArgs } from './types.js';

	const items: TabsItemsProps = [
		{ label: 'Tab 1', code: 'tab1', withContent: 'ff' },
		{ label: 'Tab 2', code: 'tab2' },
		{
			label: 'Another tab',
			code: 'tab3',
			withComponent: Cartouche,
			componentProps: { label: 'inner component' }
		}
	];

	let code = `
<Tabs
	activeTabCode="tab1" 
	onTabClick={(e) => { 
	}}
	class="h-full"
	style="height:100%;width:350px"
	{items}>
		{#snippet children({ activeTabCode })}
			{#snippet tabTitle()}
				Some tabs title
			{/snippet}
			{#snippet tabButtons()}
				<Button variant="bordered">button</Button>
			{/snippet}
			{#snippet tabsInner()}
				<div class="h-full">
					<div class="p-4 h-full overflow-auto">
						<!-- selected : {activeTabCode} -->
					</div>
				</div>
			{/snippet}
		{/snippet}
</Tabs>`;
</script>

<DemoerComponent component="Tabs">
	<DemoPage {code} component="Tabs">
		<Demoer {componentArgs} {parameters}>
			{#snippet children({ activeParams })}
				<div style="height:450px;">
					<Tabs
						{...activeParams}
						onTabClick={(e) => {
							console.log(e);
							componentArgs.activeTabCode = e.code;
						}}
						class="h-full"
						style="height:100%;width:350px"
					>
						{#snippet tabsTitle()}
							Some tabs title
						{/snippet}
						{#snippet tabsButtonZone()}
							<Button variant="bordered">button</Button>
						{/snippet}
						{#snippet tabsInner({ activeTabCode })}
							<div class="h-full">
								<div class="p-4 h-full overflow-auto">
									selected : {activeTabCode}
								</div>
							</div>
						{/snippet}
					</Tabs>
				</div>
			{/snippet}
		</Demoer>
	</DemoPage>
</DemoerComponent>
