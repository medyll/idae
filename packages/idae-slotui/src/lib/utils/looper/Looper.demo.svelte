<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import Looper from './Looper.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { parameters, componentArgs } from './types.js';

	let code = `
<Looper groupBy={"lastname"}  {data}>
	{#snippet children({ item, idx })}
		<div>{item.name} {idx}</div>
		<div>{item.id} {idx}</div>
	{/snippet}
</Looper>`;
</script>

<ComponentDemo
	component="Looper"
	cite="A loop is a loop from start to the final reach. Ernest Hamilton, 1954"
>
	<DemoPage component="Alert" {code}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<Looper {...activeParams} groupBy={'lastname'}>
					{#snippet children({ item, idx })}
						<div class="flex">
							<div>{item.name}</div>
							<div>{item.id}</div>
							<div>{item.id}</div>
						</div>
					{/snippet}
				</Looper>
			{/snippet}
		</Demoer>
	</DemoPage>
</ComponentDemo>
