<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';

	import { parameters, componentArgs } from './types.js';
	import Marquee from './Marquee.svelte';
    import Looper from '$lib/utils/looper/Looper.svelte';
    import { dataOp } from '@medyll/idae-engine';

	let code = `
<Marquee >
    <div></div>
    <div></div>
    <div></div>
</Marquee>`;
</script>

<ComponentDemo component="Marquee">
	<DemoPage component="Rating" {code}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<Marquee style="width:450px;height:450px;gap!2rem;border:1px solid black;display:flex;" {...activeParams}>					
					<Looper style="display:flex;"   data={[...Array(90)].map((_,idx)=>({idx}))} >
						{#snippet children({ item ,idx})}
							<div style="min-width:250px;height:250px;border:1px solid green;"  >cell {item?.idx}  </div> 
						{/snippet}		
					</Looper>
				</Marquee>
			{/snippet}
		</Demoer>
	</DemoPage>
</ComponentDemo>
