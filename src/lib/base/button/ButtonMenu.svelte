<svelte:options accessors={true} />

<script lang="ts">
	import { openPopper } from '../../ui/popper/actions.js';
	import IconButton from './IconButton.svelte';
	import Menu from '../../ui/menu/Menu.svelte';
	import type { SvelteComponent } from 'svelte';
	import type { PopperPositionType } from '$lib/ui/popper/types.js';
	import type { IMenuItemProps, MenuProps } from '$lib/ui/menu/types.js';
	import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';

	type Props = {
		icon: string;
		menuData: IMenuItemProps[];
		actionComponent: SvelteComponent | any;
		menuProps: MenuProps;
		/*  menuPosition
		 * @type {"TC" | "TL" | "TR" | "BC" | "BL" | "BR"}
		 */
		menuPosition: PopperPositionType;
		class: string;
		element: HTMLElement;
	};

	let {
		icon = 'list',
		menuData = [],
		actionComponent = Menu,
		element,
		menuProps = {
			menuList: menuData,
			menuItemsList: menuData,
			onMenuItemClick: () => {
				console.log('...');
			}
		},
		menuPosition = 'BC',
		class: className
	} = $props<Props>();

	let componentProps = menuProps
		? menuProps
		: {
				menuList: menuData,
				menuItemsList: menuData,
				onMenuItemClick: () => {}
			};

	const onActionClick = (event: MouseEvent) => {
		event.stopPropagation();
		openPopper('settingActions', {
			parentNode: event.currentTarget as HTMLElement,
			component: actionComponent,
			componentProps: componentProps ?? {},
			position: menuPosition
		});
	};

	let openPoppOpt: UsePopperProps;

	openPoppOpt = {
		parentNode: element,
		component: actionComponent,
		componentProps: componentProps ?? {},
		position: 'BC',
		disabled: false
	};
</script>

<IconButton
	class={'ButtonMenu ' + className}
	bind:element
	icon="faEllipsisH"
	iconFontSize="small"
	on:click={onActionClick}
>
	<slot />
</IconButton>

<style lang="scss">
	@import 'ButtonMenu';
</style>
