<script lang="ts">
	import Menu from './Menu.svelte';
	import MenuItem from './MenuItem.svelte';
	/* demo */
	import ComponentExample from '$components/Example.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	/* demo */

	let parametersSlot: any = {
		density: {
			type: 'density-preset',
			values: Object.keys(uiPresets.density)
		},
		bordered: {
			type: 'boolean',
			values: [false, true]
		}
	};

	let componentArgsSlot = {
		...defaultsArgs(parametersSlot),
		density: 'default'
	};

	let codeSlot = `
<Menu>
	<MenuItem divider={true}>menu item</MenuItem>
	<MenuItem icon="home" selected={true}>menu item</MenuItem>
	<MenuItem icon="close">menu item</MenuItem>
	<MenuItem divider={true}>menu item</MenuItem>
	<MenuItem>menu item</MenuItem>
</Menu>`;

	let codeProps = `
<Loader
    status={"loading"}
    messages={{
        loading: 'Loading dataset',
        error  : 'An error occurred',
        empty  : 'Empty results',
        success: 'Success !'
      }}
    emptyIcon="mdi:database-search-outline"
    errorIcon="mdi:alert-circle-outline"
    loadingIcon="mdi:loading"
    successIcon="clarity:success-standard-line" />`;
</script>

<ComponentExample
	component="Menu"
	cite="A menu is not a list, it's just like a list but more and less"
>
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="Popper" title="Using slots">
			<Demoer componentArgs={componentArgsSlot} let:activeParams parameters={parametersSlot}>
				<div class="flex-h flex-align-bottom gap-small">
					<div class="pad-tiny">
						<Menu {...activeParams}>
							<MenuItem>menu item</MenuItem>
							<MenuItem>menu item</MenuItem>
							<MenuItem>menu item</MenuItem>
							<MenuItem>menu item</MenuItem>
							<MenuItem>menu item</MenuItem>
						</Menu>
						<h6 class="pad">A menu</h6>
					</div>
					<div class="pad">
						<Menu {...activeParams}>
							<MenuItem>menu item</MenuItem>
							<MenuItem icon="home" selected={true}>menu item</MenuItem>
							<MenuItem icon="close">menu item</MenuItem>
							<MenuItem>menu item</MenuItem>
							<MenuItem>menu item</MenuItem>
						</Menu>
						<h6 class="pad">A menu with icons</h6>
					</div>
					<div class="pad">
						<Menu {...activeParams}>
							<MenuItem divider={true}>menu item</MenuItem>
							<MenuItem icon="home" selected={true}>menu item</MenuItem>
							<MenuItem icon="close">menu item</MenuItem>
							<MenuItem divider={true}>menu item</MenuItem>
							<MenuItem>menu item</MenuItem>
						</Menu>
						<h6 class="pad">A menu with some dividers</h6>
					</div>
				</div>
			</Demoer>
		</DemoPage>
	</div></ComponentExample
>
<br />
<br />
<br />
<br />
<ComponentExample component="MenuItem" cite="A MenuItem gets one place to stay" />
