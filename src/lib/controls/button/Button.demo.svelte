<script lang="ts">
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from './Button.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import ButtonAction from './ButtonAction.svelte';
	import ButtonMenu from './ButtonMenu.svelte';

	import { parameters, componentArgs } from './types.js';

	let multiple = {
		bgTheme: {
			none: { bgTheme: undefined },
			primary: { bgTheme: 'primary' },
			secondary: { bgTheme: 'secondary' },
			tertiary: { bgTheme: 'tertiary' }
		}
	};

	let parametersMenu: any = {
		position: {
			type: 'stickyPosition',
			values: uiPresets.stickyPosition
		}
	};
	/** */
	let styleParameters: any = {
		color: {
			type: 'color-preset',
			values: [undefined, 'primary', 'secondary', 'tertiary']
		},
		contained: {
			type: 'boolean',
			values: [true, false]
		},
		bordered: {
			type: 'boolean',
			values: [true, false]
		},
		link: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let code = `
<Button onclick={()=>{}} >
	My button
	{#snippet buttonStart()}
		<Icon icon="user" />
	{/snippet}
	{#snippet buttonEnd()}
		<Icon icon="user" />
	{/snippet}
</Button>`;

	$inspect({ parameters, componentArgs });
</script>

<ButtonAction
	>test et essai
	{#snippet popperContent()}
		<div class="pad-4">content</div>
	{/snippet}
</ButtonAction>
<ButtonMenu
	>menu
	{#snippet menuItem()}
		content
	{/snippet}
</ButtonMenu>
<ComponentDemo
	component="Button"
	cite="There were a place where we used to click. You've called it a button, and we clicked yes.<br /> R. Falgt, 1354"
>
	<div class="flex-v gap-medium">
		<DemoPage {code} component="Button">
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Button {...activeParams}
						>Using snippets
						<!-- {#snippet buttonStart()}
							<Icon icon="user" /> 
						{/snippet} -->

						{#snippet buttonLoadingIcon()}
							<Icon icon="loading" rotate />
						{/snippet}
					</Button>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="" subTitle="Styling props" component="Button">
			<Demoer parameters={styleParameters} {multiple} {componentArgs}>
				{#snippet children({ activeParams })}
					<Button {...activeParams}
						>Using snippets
						{#snippet buttonStart()}
							<Icon icon="user" />
						{/snippet}
						{#snippet buttonLoadingIcon()}
							<Icon icon="loading" rotate />
						{/snippet}
					</Button>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="" subTitle="Menu buttons" component="Button">
			<Demoer parameters={parametersMenu} {componentArgs}>
				<Button>
					default action
					{#snippet buttonPopper()}
						<MenuList style="max-height:350px;overflow:auto" density="default">
							<MenuListItem divider={true} text="strict">menu</MenuListItem>
							<MenuListItem data={{ some: 'data' }} text="strict">item</MenuListItem>
							<MenuListItem data={{ some: 'data' }} text="strict">item</MenuListItem>
							<MenuListItem data={{ some: 'data' }} text="strict">item</MenuListItem>
						</MenuList>
					{/snippet}
				</Button>
			</Demoer>
		</DemoPage>
		<!-- <DemoPage title="Using props" code={code2} component="Button">
			<Demoer parameters={parametersProps} {componentArgs}>
				{#snippet children({ activeParams })}
					<Button {...activeParams}>Using props</Button>
				{/snippet}
			</Demoer>
		</DemoPage> -->
		<!-- <DemoPage title="" subTitle="Menu buttons" code={code3} component="Button">
			<Demoer parameters={parametersMenu} {componentArgs}>
				{#snippet children({ activeParams })}
					<Button
					size="medium"
					usePopper={{ ...usePopper, position: activeParams?.position }}
					primary="Menu {activeParams?.position ?? ''}"
				/>
				{/snippet}
			</Demoer>
		</DemoPage> -->
	</div>
</ComponentDemo>
