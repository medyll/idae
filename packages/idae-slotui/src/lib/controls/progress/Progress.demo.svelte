<script lang="ts">
	import Progress from './Progress.svelte';

	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';
	import { ProgressDemoValues } from './types.js';

	const code = `<Progress value="50" />`;

	let parameters = ProgressDemoValues;

	let componentArgs = defaultsArgs(parameters);
</script>

<ComponentDemo
	component="Progress"
	cite="You'll never know that you've got a score, unless comes the day when you see the other's ones.<br/> S. Roch, 1824"
>
	<div class="flex-v gap-large">
		<DemoPage component="Progress" {code}>
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Progress {...activeParams} />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
