<svelte:options accessors={true} />

<script lang="ts">
	import Tabs from './Tabs.svelte';
	import type { TabsItemsProps } from './types.js';
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	/* demo */
	import ComponentExample from '$components/Example.svelte';
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
<Tabs activeTabCode="tab3" onTabClick={()=>{}} {items}>
    <span slot="tabsTitle">Some tabs title</span>
    <span slot="tabsButtons" ><Button bordered >button</Button></span>
</Tabs>`;
</script>

<ComponentExample cite="" component="Tabs">
	<div class="flex-v gap-large w-full">
		<DemoPage code={codeSlot} component="Tabs" title="Using slots">
			<Demoer componentArgs={componentArgsSlot} let:activeParams parameters={parametersSlot}>
				<div style="height:450px;">
					<Tabs
						activeTabCode="tab1"
						{...activeParams}
						onTabClick={(e) => {
							console.log(e);
							componentArgsSlot.activeTabCode = e.code;
						}}
						class="h-full"
						style="height:100%;width:350px"
						{items}
						let:activeTabCode
					>
						<span slot="tabsTitle">Some tabs title</span>
						<span slot="tabsButtons"><Button bordered>button</Button></span>
						<div class="h-full" slot="tabsInner">
							<div class="pad-4 h-full overflow-auto">
								selected : {activeTabCode}
							</div>
						</div>
					</Tabs>
				</div>
			</Demoer>
		</DemoPage>
	</div>
	<!--<Tabs activeTabCode="tab1" {items}/>
    <Divider density="kind" expansion="centered"/>-->
</ComponentExample>
