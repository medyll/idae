<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import { DemoPage, Demoer } from '$lib/index.js';
	import Icon from '@iconify/svelte';
	import { defaultsArgs } from '../demoer/demoer.utils.js';
	import { iconAppDemoValues } from './types.js';

	let parameters = iconAppDemoValues;
	let componentArgs = defaultsArgs(parameters);

	let code = `
<Icon>
    mdi:tree
</Icon>`;
</script>

<ComponentDemo component="Icon" cite="The icon is the window to the soul of the app">
	<div class="flex-v gap-small">
		<DemoPage title="Using snippets" component="Icon" {code}>
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Icon {...activeParams} />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
