<script lang="ts">
	import { titleBarDemoValues } from './types.js';
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import TitleBar from './TitleBar.svelte';
	let parameters = titleBarDemoValues;
	let componentArgs = defaultsArgs(parameters);

	let code = `
    <TitleBar {...activeParams} class="m-tb-1">
        {#snippet titleBarIcon()}
            <Icon fontSize="small" icon="circle" />
        {/snippet}
        {#snippet titleBarTitle()}
            This is a title bar
        {/snippet}
    </TitleBar>`;
</script>

<ComponentDemo component="TitleBar" cite="The title bar is the window to the soul of the app">
	<DemoPage component="TitleBar" {code}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<TitleBar {...activeParams} />
			{/snippet}
		</Demoer>
	</DemoPage>
</ComponentDemo>
