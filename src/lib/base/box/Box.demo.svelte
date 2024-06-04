<script lang="ts">
	import Box from './Box.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { BoxDemoValues } from './types.js';
	import { defaultsArgs } from '../demoer/demoer.utils.js';

	import { parameters, componentArgs } from './types.js';

	let code = `
<Box>
	{#snippet titleBarTitle()}
		<span>Title of the box</span>
	{/snippet}
	{#snippet titleBarIcon()}
		<Icon fontSize="small" icon="clock" />
	{/snippet}
	{#snippet boxBottomZone()}
		<div class="flex-h gap-small pad border-t marg-ii-1">bottom zoone</div>
	{/snippet}
	{#snippet children()}
		<div class="pad-2">Content of the box</div>
	{/snippet}
</Box>`;
</script>

<ComponentDemo
	component="Box"
	cite="Boxes, essentially, contain other boxes. That's the meaning we'll found if open them<br /> B. Franklin,1854"
	><div class="flex-v gap-medium">
		<DemoPage {code} title="Using snippets" component="Box">
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Box {...activeParams}>
						{#snippet titleBarTitle()}
							<span>Title of the box</span>
						{/snippet}
						{#snippet titleBarIcon()}
							<Icon fontSize="small" icon="clock" />
						{/snippet}
						{#snippet boxBottomZone()}
							<div class="flex-h gap-small pad border-t marg-ii-1">bottom zoone</div>
						{/snippet}
						{#snippet children()}
							<div class="pad-2">Content of the box</div>
						{/snippet}
					</Box>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
