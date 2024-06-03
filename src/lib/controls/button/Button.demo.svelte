<script lang="ts">
	import type { MenuItemProps } from '$lib/ui/menu/types.js';
	import Menu from '$lib/ui/menu/Menu.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';
	import { type UsePopperProps } from '$lib/ui/popper/usePopper.js';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Debug from '$lib/base/debug/Debug.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from './Button.svelte';
	import { ButtonDemoValues } from './types.js';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import ButtonAction from './ButtonAction.svelte';
	import ButtonMenu from './ButtonMenu.svelte';
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';

	const menuData: MenuItemProps[] = [
		{ text: 'text 1' },
		{ text: 'text 2' },
		{ text: 'text 3' },
		{ text: 'text 3' },
		{ text: 'text 3' },
		{ text: 'text 3', icon: 'i' }
	];

	const variants: string[] = ['link', 'contained', 'bordered', 'naked'];

	const usePopper: UsePopperProps = {
		component: Debug,
		componentProps: {
			title: 'title box',
			content: 'content'
		}
	};

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
			type: 'position',
			values: uiPresets.position
		}
	};

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

	let parameters: any = ButtonDemoValues;

	let parametersProps: any = {
		icon: {
			type: 'icon',
			values: ['icon-park-outline:avatar', 'carbon:phone-ip']
		},
		iconSize: {
			type: 'size-preset',
			values: Object.keys(uiPresets.width)
		},
		iconColor: {
			type: 'color',
			values: ['red', 'green', '#564547', 'orange']
		},
		primary: {
			type: 'string',
			values: ['primary 1', 'primary 2']
		},
		...parameters
	};

	let componentArgs = defaultsArgs(parameters);

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

	let code2 = `
<Button onclick={()=>{}} >
	My button
</Button>`;

	let code3 = `
const usePopper: UsePopperProps = {
  component: Debug,
  componentProps: {
    title: "title box",
    content: "content",
  },
};

<Button
  size="medium"
  usePopper={{ ...usePopper, position: activeParams?.position }}
  primary="Menu {activeParams?.position ?? ''}"
/>`;
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
		<DemoPage title="Using snippets" {code} component="Button">
			<Demoer {parameters} {componentArgs}>
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
						<Menu style="max-height:350px;overflow:auto" density="default">
							<MenuItem divider={true} text="strict">menu</MenuItem>
							<MenuItem data={{ some: 'data' }} text="strict">item</MenuItem>
							<MenuItem data={{ some: 'data' }} text="strict">item</MenuItem>
							<MenuItem data={{ some: 'data' }} text="strict">item</MenuItem>
						</Menu>
					{/snippet}
				</Button>
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" code={code2} component="Button">
			<Demoer parameters={parametersProps} {componentArgs}>
				{#snippet children({ activeParams })}
					<Button {...activeParams}>Using props</Button>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="" subTitle="Menu buttons" code={code3} component="Button">
			<Demoer parameters={parametersMenu} {componentArgs}>
				{#snippet children({ activeParams })}
					<!-- <Button
					size="medium"
					usePopper={{ ...usePopper, position: activeParams?.position }}
					primary="Menu {activeParams?.position ?? ''}"
				/> -->
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
