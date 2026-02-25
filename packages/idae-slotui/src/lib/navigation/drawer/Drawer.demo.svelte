<script lang="ts">
	import Drawer from '$lib/navigation/drawer/Drawer.svelte';

	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';

	import { parameters, componentArgs } from './types.js';

	let code = `
<Drawer >
	{#snippet drawerIcon()}
		<Icon icon="window" />
	{/snippet}
	{#snippet drawerTop()}
		<div class="p-2">Drawer's title</div>
	{/snippet}
	<div class="p-2">Drawer's content</div>
	{#snippet drawerBottom()}
		<div class="p-2">Drawer's bottom zone</div>
	{/snippet}
</Drawer>s`;
</script>

<ComponentDemo component="Drawer">
	<div class="flex-v gap-medium w-full">
		<DemoPage component="Drawer" {code}>
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<div style="width:450px;height:500px;position:relative;" class="pad flex-h">
						<div class="flex-main p-4 text-right">
							Side content Side content Side content Side content
						</div>
						<Drawer {...activeParams}>
							{#snippet drawerIcon()}
								<Icon icon="window" />
							{/snippet}
							{#snippet drawerTop()}
								<div class="p-2">Drawer's title</div>
							{/snippet}
							{#snippet drawerFooter()}
								<div class="p-2">Drawer's bottom zone</div>
							{/snippet}
							<div class="p-2">Drawer's content</div>
						</Drawer>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
