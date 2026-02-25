<script lang="ts">
	import Grouper from './Grouper.svelte';

	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	/* demo */

	import { parameters, componentArgs } from './types.js';

	let code = `<Grouper 
	bind:groupedData
	bind:activeGroupField 
	{data}
	/>`;

	let groupedData: any;
	let activeGroupField: any;
</script>

<ComponentDemo component="Grouper">
	<div class="flex flex-col gap-large">
		<DemoPage {code} component="Popper">
			<Demoer {componentArgs} {parameters}>
				{#snippet children({ activeParams })}
					<div class="flex-h flex-align-middle gap-tiny">
						<Grouper bind:groupedData bind:activeGroupField {...activeParams} />
						{activeGroupField}
					</div>
					{JSON.stringify(groupedData)}
					{JSON.stringify(activeGroupField)}
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
