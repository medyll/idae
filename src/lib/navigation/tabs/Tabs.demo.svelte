<svelte:options />

<script lang="ts">
	import Tabs from './Tabs.svelte';
	import type { TabsItemsProps } from './types.js';
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	/* demo */
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import { defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	/* demo */

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

	let parametersSlot: any = {
		activeTabCode: {
			type: 'string',
			values: ['tab1', 'tab2', 'tab3', undefined]
		}
	};

	$: componentArgsSlot = {
		activeTabCode: defaultsArgsFromProps('activeTabCode', parametersSlot)
	};

	let codeSlot = `
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
					<div class="pad-4 h-full overflow-auto">
						<!-- selected : {activeTabCode} -->
					</div>
				</div>
			{/snippet}
		{/snippet}
</Tabs>`;
</script>

<ComponentDemo cite="" component="Tabs">
	<div class="flex-v gap-large w-full">
		<DemoPage code={codeSlot} component="Tabs" title="Using snippets">
			<Demoer componentArgs={componentArgsSlot} parameters={parametersSlot}>
				{#snippet children({ activeParams })}
					<div style="height:450px;">
						<Tabs
							{...activeParams}
							onTabClick={(e) => {
								console.log(e);
								componentArgsSlot.activeTabCode = e.code;
							}}
							class="h-full"
							style="height:100%;width:350px"
							{items}
							>{#snippet children({ activeTabCode })}
								{#snippet tabTitle()}
									Some tabs title
								{/snippet}
								{#snippet tabButtons()}
									<Button variant="bordered">button</Button>
								{/snippet}
								{#snippet tabsInner()}
									<div class="h-full">
										<div class="pad-4 h-full overflow-auto">
											<!-- selected : {activeTabCode} -->
										</div>
									</div>
								{/snippet}
							{/snippet}
						</Tabs>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
