<script lang="ts">
	import Tree from './Tree.svelte';

	/* demo */
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import { defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	/* demo */

	let paths = [
		'About.vue',
		'Categories/Index.vue',
		'Categories/Demo.vue',
		'Categories/Flavors.vue',
		'Categories/Demo',
		'Categories/Demo/Flavors.vue'
	];

	let pathsData = [
		{ name: '', path: 'Categories/Demo/Vue', other: 'item' },
		{ name: '', path: 'About' },
		{ name: '', path: 'More' },
		{ name: '', path: 'Categories/Demo/Vue/Demo' },
		{ name: '', path: 'Categories/Index' },
		{ name: '', path: 'Categories/About' },
		{ name: '', path: 'Categories/Demo' },
		{ name: '', path: 'New/With/Some/Unique/Levels/Yep' },
		{ name: '', path: 'New/With/Some/Other/Levels/Yep', data: { isbel: 'or' } }
	];

	let data = [
		{ name: '', path: 'Categories/Demo/Vue/Demo' },
		{
			name: '',
			path: 'New/With/Some/Unique/Levels/Yep'
		}
	];

	let selectedData = [];

	let parametersSlot: any = {
		showCheckBox: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let componentArgsSlot = {
		status: defaultsArgsFromProps('status', parametersSlot)
	};

	let codeSlot = `
<Tree bind:selectedData
    {data}
    pathField="path"
    paths={pathsData} />`;
</script>

<ComponentDemo
	cite="We were looking for leaves and we found trees<br /> B. Esein, 1354"
	component="Tree"
>
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="Loading" title="Using slots">
			<Demoer componentArgs={componentArgsSlot} let:activeParams parameters={parametersSlot}>
				<div class="pos-rel flex-h">
					<div style="width:250px;" class="h-large overflow-auto">
						<Tree bind:selectedData {data} pathField="path" paths={pathsData} {...activeParams} />
					</div>
					<div style="width:250px;" class="h-large overflow-auto">
						<pre>{JSON.stringify(
								selectedData.filter((x) => x),
								null,
								' '
							)}</pre>
					</div>
				</div>
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
