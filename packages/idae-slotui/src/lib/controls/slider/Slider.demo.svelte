<script lang="ts">
	import Slider from './Slider.svelte';

	/* demo */
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	/* demo */

	import { parameters, componentArgs } from './types.js';

	let codeSlot = `
<Slider  name={'switcher'} class="w-small" >
  <span   />
</Slider>`;

	let isOpen = false;
</script>

<ComponentDemo component="Slider">
	<div class="flex flex-col gap-large">
		<DemoPage code={codeSlot} component="Slider">
			<Demoer {parameters} {...componentArgs}>
				{#snippet children({ activeParams })}
					<div class="p-2">
						<Slider {...activeParams} class="flex-h flex-align-middle w-small">
							<span>tooltip</span>
						</Slider>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
