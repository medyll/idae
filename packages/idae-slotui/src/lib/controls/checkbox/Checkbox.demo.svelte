<script lang="ts">
	import Checkbox from './Checkbox.svelte';

	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';
	import { CheckboxDemoValues } from './types.js';

	let parameters = CheckboxDemoValues;
	let componentArgs = defaultsArgs(parameters);

	let code = `
<Checkbox>
	label
</Checkbox>`;
</script>

<ComponentDemo component="Checkbox">
	<div class="flex-v gap-medium">
		<DemoPage {code} component="Checkbox">
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Checkbox {...activeParams}>label</Checkbox>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
