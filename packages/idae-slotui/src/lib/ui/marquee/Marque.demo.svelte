<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';

	import { parameters, componentArgs } from './types.js';
	import Marquee from './Marquee.svelte';

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
				<Marquee {...activeParams}>
					<div>thumb</div>
					<div>thumb no !!!</div>
					<div>thumb</div>
					<div>thumb</div>
					<div>thumb</div>
					<div>thumb</div>
					<div>thumb</div>
					<div>thumb</div>
					<div>thumb</div>
					<div>thumb</div>
					<div>thumb</div>
				</Marquee>
			{/snippet}
		</Demoer>
	</DemoPage>
</ComponentDemo>
