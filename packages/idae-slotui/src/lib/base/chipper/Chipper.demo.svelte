<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import { chipperDemoValues, type ChipperProps } from './types.js';
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';
	import Chipper from './Chipper.svelte';

	import { parameters, componentArgs } from './types.js';

	let codeSlot = `
<Chipper >
	<div class="pad-2">some content</div>
	{#snippet chipperChip()}
		<div class="theme-bg-primary radius-small w-full h-full"></div>
	{/snippet}
</Chipper>`;

	let codeProps = `
<Chipper
	content="<div class='pad'>Some props html content<\/div>"
	color="red" />`;
</script>

<ComponentDemo component="Chipper">
	<DemoPage component="Chipper" code={codeSlot}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<Chipper {...activeParams}>
					<div class="pad-2">some content</div>
					{#snippet chipperChip()}
						<div class="theme-bg-primary radius-small w-full h-full"></div>
					{/snippet}
				</Chipper>
			{/snippet}
		</Demoer>
	</DemoPage>
	<DemoPage title="Without slots" component="Chipper" code={codeProps}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<Chipper {...activeParams} />
			{/snippet}
		</Demoer>
	</DemoPage>
</ComponentDemo>
