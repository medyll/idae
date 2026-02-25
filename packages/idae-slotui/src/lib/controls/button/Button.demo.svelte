<script lang="ts">
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from './Button.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import ButtonAction from '../buttonAction/ButtonAction.svelte';
	import ButtonMenu from '../buttonMenu/ButtonMenu.svelte';

	import { parameters, componentArgs } from './types.js'; // keep for now if needed for demo values
	// Types are now in Button.svelte, update type imports if needed
// import type { ButtonProps, ButtonMenuProps } from './Button.svelte';

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
</script>

<Button variant="contained" value="red" icon="material-symbols-light:post-add-sharp"></Button>
<ButtonAction
	>test et essai
	{#snippet popperContent()}
		<div class="p-4">content</div>
	{/snippet}
</ButtonAction>
<ButtonMenu
	>menu
	{#snippet menuItem()}
		content
	{/snippet}
</ButtonMenu>
<ButtonMenu
    tall="small"
    width="auto"
    icon="material-symbols-light:post-add-sharp"
    value={"Some text for the menu with an icon"}
    popperProps={{ stickToHookWidth: true, position: 'TL', flow: 'fixed', autoClose: true }}
    variant="naked"
    menuProps={{
        data: [],
        grid: 3, 
        onclick: (event) => {
            // chatParams.promptSystem = event;
        },
    }}>
    {#snippet menuItem({ item })}
        <MenuListItem data={item}>
            {item?.name}
        </MenuListItem>
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
						>Using snippets scscs dsvdvd
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
