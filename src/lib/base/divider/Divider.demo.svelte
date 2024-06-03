<script lang="ts">
	import Divider from './Divider.svelte';

	/* demo */
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { defaultsArgs } from '../demoer/demoer.utils.js';
	import { DividerDemoValues } from './types.js';
	/* demo */

	let parametersSlot = DividerDemoValues;

	let componentArgsSlot = defaultsArgs(parametersSlot);

	let codeSlot = `
	<Divider />`;
</script>

<ComponentDemo
	component="Divider"
	cite="What is separating before from after is not a time nor a place : it's only a component <br /> B. Franklin,
1854"
>
	<div class=" flex-v gap-small">
		<DemoPage title="Using snippets" component="Divider" code={codeSlot}>
			<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot}>
				{#snippet children({ activeParams })}
					<div class="pad">
						<div class="pad">What is before</div>
						<Divider {...activeParams} />
						<div class="pad">And what is after</div>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
