<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import { Demoer } from '$sitedata/slotuiComponents.js';
	import Icon from '@iconify/svelte';
	import DemoPage from '../demoer/DemoPage.svelte';
	import { defaultsArgs } from '../demoer/demoer.utils.js';
	import ContentSwitcher from './ContentSwitcher.svelte';
	import { contentSwitcherDemoValues } from './types.js';

	let parameters = contentSwitcherDemoValues;
	let componentArgs = defaultsArgs(parameters);
	const code = `
<ContentSwitcher {...activeParams} class="marg-tb-1">
    {#snippet contentSwitcherTogglerIcon()}
        <Icon icon="mdi:tree" />
    {/snippet}
    {#snippet contentSwitcherBackIcon()}
        <span>Switch</span>
    {/snippet}
    {#snippet contentSwitcherReveal()}
        <div class="pad-2 border-t">Some <br />switched <br />content</div>
    {/snippet}
</ContentSwitcher>`;
</script>

<ComponentDemo component="ContentSwitcher">
	<div class="flex-v gap-large">
		<DemoPage title="Using snippets" component="ContentSwitcher" {code}>
			<Demoer title="A simple contentSwitcher" {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<ContentSwitcher {...activeParams} class="marg-tb-1">
						{#snippet contentSwitcherTogglerIcon()}
							<Icon icon="mdi:tree" />
						{/snippet}
						{#snippet contentSwitcherBackIcon()}
							<span>Switch</span>
						{/snippet}
						{#snippet contentSwitcherReveal()}
							<div class="pad-2 border-t">Some <br />switched <br />content</div>
						{/snippet}
					</ContentSwitcher>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
