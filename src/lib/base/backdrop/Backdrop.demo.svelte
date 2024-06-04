<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { defaultsArgs } from '../demoer/demoer.utils.js';
	import Backdrop from './Backdrop.svelte';
	import { BackdropDemoValues } from './types.js';

	import { parameters, componentArgs } from './types.js';

	let codeSlot = `
	<Backdrop
		flow="relative"
		onclick={()=>{}}> 
		<div class="flex-h flex-align-middle-center h-full">
			<div class="pad-4 border radius-small theme-bg">
				some content
			</div>
		</div>
	</Backdrop>`;

	let BackdropRef: Backdrop;
</script>

<ComponentDemo component="Backdrop">
	<div class="flex-v gap-medium">
		<DemoPage title="Using snippets" code={codeSlot} component="Backdrop">
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<div style="width:350px;height:350px;position:realive;">
						<Backdrop
							bind:this={BackdropRef}
							onclick={() => {
								componentArgs.flow = 'relative';
								BackdropRef.flow = 'relative';
							}}
							{...componentArgs}
							{...activeParams}
						>
							<div class="flex-h flex-align-middle-center h-full">
								<div class="pad-4 border radius-small theme-bg">some content</div>
							</div>
						</Backdrop>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
