<script lang="ts">
	import Tree from './Tree.svelte';

	/* demo */
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
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

	let selectedData: any = [];

	let parameters: any = {
		showCheckBox: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let componentArgs = {
		status: defaultsArgsFromProps('status', parameters)
	};

	let code = `
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
		<DemoPage {code} component="Loading">
			<Demoer {componentArgs} {parameters}>
				{#snippet children({ activeParams })}
					<div class="pos-rel flex-h">
						<div style="width:250px;" class="h-large overflow-auto">
							<Tree bind:selectedData {data} pathField="path" paths={pathsData} {...activeParams} />
						</div>
						<div style="width:250px;" class="h-large overflow-auto">
							<pre>{JSON.stringify(
									selectedData.filter((x: any) => x),
									null,
									' '
								)}</pre>
						</div>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
