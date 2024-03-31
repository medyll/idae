<svelte:options accessors runes />

<script lang="ts" generics="T= Data">
	import { getContext } from 'svelte';

	import Divider from '$lib/base/divider/Divider.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { IMenuItemProps, IMenuProps } from './types.js';
	import type { CommonProps, Data, ElementProps } from '$lib/types/index.js';
	import type { Writable } from 'svelte/store';
	import Slot from '$lib/utils/slot/Slotted.svelte';

	let mounted: boolean = $state(false);
	const menuStateContext = getContext<Writable<IMenuProps>>('menuStateContext');

	type MenuItemProps = CommonProps & {
		/** className off the root component */
		class?: string;

		/** element root HTMLDivElement props */
		element?: HTMLElement | null;

		/** text displayed in the menu item */
		text?: string;

		/** text props, shown on the right side of the menuItem */
		action?: string;

		/** icon displayed in the menu item */
		icon?: string;

		/** color of the icon */
		iconColor?: string;

		/** size of the icon */
		iconSize?: ElementProps['sizeType'];

		/** whether to show a divider after the menu item */
		divider?: IMenuItemProps['divider'];

		/** whether to show a divider before the menu item */
		dividerBefore?: IMenuItemProps['divider'];

		/** data associated with the menu item */
		data?: T;

		/** whether the menu item is selected */
		selected?: boolean;

		/** @deprecated
		 * function to be called when the menu item is clicked */
		onMenuItemClick?: (data: T) => void;
		/** function to be called when the menu item is clicked */
		onclick?: (data: T) => void;

		/** position in the list */
		itemIndex?: number;
		/** component to be rendered in the menu item */
		component?: any;

		/** whether the menu item is outer */
		outer?: boolean;
	};

	let {
		class: className = '',
		element = null,
		text = undefined,
		action = undefined,
		icon = undefined,
		iconColor = undefined,
		iconSize = 'small',
		divider = false,
		dividerBefore = false,
		data = $bindable<T>({} as T),
		selected = $bindable(undefined),
		onMenuItemClick = () => {},
		onclick = (args) => {},
		itemIndex = undefined,
		component = null,
		outer = true,
		children = undefined,
		slots = {
			itemIcon: undefined,
			menuItemEnd: undefined
		}
	}: MenuItemProps = $props();

	if (icon || slots.itemIcon) {
		$menuStateContext.hasIcon = true;
	}

	if (selected) {
		$menuStateContext.selectedIndex = itemIndex;
	}

	$effect(() => {
		if (mounted) {
			$menuStateContext.menuItemsInstances?.push(component);
		}
		element?.addEventListener('click', handleClick);
	});

	const handleClick = () => {
		const event = new CustomEvent('menu:item:clicked', { detail: data, bubbles: true });
		if (element) element.dispatchEvent(event);
		// set selectedIndex if we have index
		// set selected style
		setSelected();
		onMenuItemClick(data);
		onclick(data);
	};

	const setSelected = () => {
		$menuStateContext.selectedIndex = itemIndex;
	};
</script>

{#if dividerBefore}
	<li>
		<Divider density="tight" expansion="centered" />
	</li>
{/if}
<li
	class="menuItem {className}"
	aria-selected={($menuStateContext.selectedIndex
		? $menuStateContext.selectedIndex === itemIndex
		: undefined) ?? undefined}
	role="listitem"
	bind:this={element}
>
	<span class="menuItemChip" />
	{#if $menuStateContext?.hasIcon}
		<div class="menuItemIcon">
			<Slot slotted={slots.itemIcon}>
				<Icon {icon} color={iconColor} fontSize={iconSize} />
			</Slot>
		</div>
	{/if}
	<div class="menuItemText">
		<Slot slotted={children} slotArgs={data}>
			{text}
		</Slot>
	</div>
	{#if slots.menuItemEnd || action}
		<div class="menuItemActions">
			<Slot slotted={slots.menuItemEnd}>
				{action}
			</Slot>
		</div>
	{/if}
</li>
{#if divider}
	<li>
		<Divider density="tight" expansion="padded" />
	</li>
{/if}

<style global lang="scss">
	@import './menu.scss';
</style>
