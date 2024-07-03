<script lang="ts" generics="T= Data">
	import { getContext } from 'svelte';

	import Divider from '$lib/base/divider/Divider.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { MenuListItemProps, MenuListProps } from './types.js';
	import type { Data, IconObj } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let menuStateContext = getContext<MenuListProps>('menuStateContext');

	let {
		class: className = '',
		element = $bindable(),
		text = undefined,
		action = undefined,
		iconFirst = {} as IconObj,
		iconLast = {} as IconObj,
		icon,
		iconColor = undefined,
		iconSize = 'small',
		divider = false,
		dividerBefore = false,
		href,
		selectable = true,
		data = $bindable({}),
		selected = $bindable(false),
		onMenuItemClick = () => {},
		onclick = (event, args) => {},
		itemIndex = undefined,
		tall = menuStateContext?.tall ?? 'default',
		children,
		menuItemFirst,
		menuItemLast,
		wrap,
		role = 'menuitem',
		tag = 'li',
		...rest
	}: MenuListItemProps = $props();

	$effect(() => {
		if (icon ?? iconFirst?.icon ?? menuItemFirst) {
			menuStateContext.hasIcon = true;
		}
	});

	$effect(() => {
		if (selected) {
			menuStateContext.selectedIndex = itemIndex;
		}
		element?.addEventListener('click', handleClick);
	});

	$effect(() => {
		if (itemIndex === undefined && element?.parentElement) {
			itemIndex = [
				...element?.parentElement?.querySelectorAll('.menu-list-item:not(.menu-list-title')
			].indexOf(element);
		}
	});

	const handleClick = (event: Event) => {
		const cevent = new CustomEvent('menu:item:clicked', { detail: data, bubbles: true });
		if (element) element.dispatchEvent(cevent);
		// set selectedIndex if we have index
		// set selected style
		if (selectable) setSelected();
		onMenuItemClick(data);
		if (menuStateContext?.onclick) {
			menuStateContext?.onclick(cevent, data);
		}
		if (onclick) {
			onclick(cevent, data);
		}
	};

	const setSelected = () => {
		menuStateContext.selectedIndex = itemIndex;
		menuStateContext.selectedData = data;
	};
</script>

{#if dividerBefore}
	<li role="separator">
		<Divider tall="small" expansion="centered" />
	</li>
{/if}
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<svelte:element
	this={href ? 'a' : tag}
	class="menu-list-item {className} tall-{menuStateContext?.tall ?? tall}"
	data-selected={selectable ? menuStateContext.selectedIndex === itemIndex : false}
	aria-selected={selectable ? menuStateContext.selectedIndex === itemIndex : false}
	bind:this={element}
	tabindex="-1"
	{...rest}
	{role}
	{href}
>
	{#if icon && iconFirst && menuStateContext?.hasIcon}
		<div class="menuListItemIcon">
			<Slotted child={menuItemFirst}>
				<Icon {icon} ico={iconFirst} color={iconColor} {iconSize} />
			</Slotted>
		</div>
	{/if}
	<div class="menu-list-item-text" class:wrap>
		<Slotted child={children} slotArgs={data}>
			{text}
		</Slotted>
	</div>
	{#if menuItemLast || action || iconLast}
		<div class="menu-list-item-action">
			<Slotted child={menuItemLast}>
				<Icon ico={iconLast} />
				{action}
			</Slotted>
		</div>
	{/if}
</svelte:element>
{#if divider}
	<li role="separator">
		<Divider expansion="padded" />
	</li>
{/if}

<style global lang="scss">
	@import './menu-list.scss';
</style>
