<script lang="ts">
	import { titleBarDemoValues, parameters, componentArgs } from './TitleBar.svelte';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import TitleBar from './TitleBar.svelte';


	let code = `
    <TitleBar {...activeParams} class="marg-tb-1">
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
