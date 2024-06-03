<script lang="ts">
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';
	import Paper from './Paper.svelte';
	import { paperDemoValues, type PaperProps } from './type.js';

	let parameters = paperDemoValues;
	let componentArgs = defaultsArgs(parameters);

	let code = `
<Paper elevation="2" style="height:350px;width:250px" >
    paper content
</Paper>`;
</script>

<ComponentDemo
	component="Paper"
	cite="What is separating before from after is not a time nor a place : it's only a component <br /> B. Franklin, 1854"
>
	<div class=" flex-v gap-small">
		<DemoPage title="Using snippets" component="Paper" {code}>
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Paper {...activeParams} style="height:350px;width:250px" />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
