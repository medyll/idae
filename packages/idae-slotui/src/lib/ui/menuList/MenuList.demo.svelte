<script lang="ts">
	import MenuList from './MenuList.svelte';
	import MenuItem from './MenuListItem.svelte';
	/* demo */
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	/* demo */

	import { parameters, componentArgs } from './types.js';

	let codeSlot = `
<Menu>
	<MenuItem divider={true}>menu item</MenuItem>
	<MenuItem icon="home" selected={true}>menu item</MenuItem>
	<MenuItem icon="close">menu item</MenuItem>
	<MenuItem divider={true}>menu item</MenuItem>
	<MenuItem>menu item</MenuItem>
</Menu>`;
</script>

<ComponentDemo
	component="Menu"
	cite="A menu is not a list, it's just like a list but more and less"
>
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="Popper">
			<Demoer {componentArgs} {parameters}>
				{#snippet children({ activeParams })}
					<div class="flex-h flex-align-bottom gap-small">
						<div class="pad-tiny">
							<MenuList {...activeParams}>
								<MenuItem>menu item</MenuItem>
								<MenuItem>menu item</MenuItem>
								<MenuItem>menu item</MenuItem>
								<MenuItem>menu item</MenuItem>
								<MenuItem>menu item</MenuItem>
							</MenuList>
							<h6 class="pad">A menu</h6>
						</div>
						<div class="pad">
							<MenuList {...activeParams}>
								<MenuItem>menu item</MenuItem>
								<MenuItem icon="home" selected={true}>menu item</MenuItem>
								<MenuItem icon="close">menu item</MenuItem>
								<MenuItem>menu item</MenuItem>
								<MenuItem>menu item</MenuItem>
							</MenuList>
							<h6 class="pad">A menu with icons</h6>
						</div>
						<div class="pad">
							<MenuList {...activeParams}>
								<MenuItem divider={true}>menu item</MenuItem>
								<MenuItem icon="home" selected={true}>menu item</MenuItem>
								<MenuItem icon="close">menu item</MenuItem>
								<MenuItem divider={true}>menu item</MenuItem>
								<MenuItem>menu item</MenuItem>
							</MenuList>
							<h6 class="pad">A menu with some dividers</h6>
						</div>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div></ComponentDemo
>
<br />
<br />
<br />
<br />
<ComponentDemo component="MenuItem" cite="A MenuItem gets one place to stay" />
