<script lang="ts">
	import Stepper from './Stepper.svelte';

	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import { parameters, componentArgs } from './types.js';

	let code = `
	<Stepper>
	
	</Stepper>`;
</script>

<ComponentDemo
	component="Stepper"
	cite="If a step was a leap it would soar over the next step.<br /> Clara Boxee 2010"
>
	<div class="flex flex-col gap-large">
		<DemoPage component="Stepper" {code}>
			<Demoer {parameters} {...componentArgs}>
				{#snippet children({ activeParams })}
					<Stepper {...activeParams}>
						{#snippet children(step)}
							{step.title}, step
						{/snippet}
					</Stepper>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
