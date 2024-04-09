<svelte:options accessors runes />

<script lang="ts" generics="T= Data">
	import { getContext } from 'svelte';

	import Divider from '$lib/base/divider/Divider.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { MenuListItemProps, MenuListProps } from './types.js';
	import type { Data, IconObj } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slot/Slotted.svelte';

	const menuStateContext = getContext<MenuListProps>('menuStateContext');

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
		data = $bindable<T>({} as T),
		selected = $bindable(false),
		onMenuItemClick = () => {},
		onclick = (event, args) => {},
		itemIndex = undefined,
		dense = menuStateContext?.dense ?? 'default',
		children,
		menuItemFirst,
		menuItemLast,
		role = 'menuitem',
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
			itemIndex = [...element?.parentElement?.querySelectorAll('.menuListItem')].indexOf(element);
		}
	});

	$effect(() => {
		/* if (menuStateContext?.selectorField && Object.keys(data ?? {}).length) {
			selected = menuStateContext.selector(menuStateContext.selectorField, data);
		} */
		/* selector: (field: keyof T, data: T) => {
			if (!data?.[field] || !selectedData?.[field]) return false;
			return selectedData[field] === data[field];
		}; */
	});

	const handleClick = (event: Event) => {
		const cevent = new CustomEvent('menu:item:clicked', { detail: data, bubbles: true });
		if (element) element.dispatchEvent(cevent);
		// set selectedIndex if we have index
		// set selected style
		setSelected();
		onMenuItemClick(data);
		if (menuStateContext?.onclick) {
			menuStateContext?.onclick(event, data);
		} else {
			onclick(event, data);
		}
	};

	const setSelected = () => {
		menuStateContext.selectedIndex = itemIndex;
		menuStateContext.selectedData = data;
	};
</script>

{#if dividerBefore}
	<li role="separator">
		<Divider density="tight" expansion="centered" />
	</li>
{/if}
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<li
	class="menuListItem {className} dense-{dense}"
	data-selected={menuStateContext.selectedIndex === itemIndex}
	role="presentation"
	bind:this={element}
	tabindex="0"
	{...rest}
>
	<span class="menuItemChip" />
	{#if menuStateContext?.hasIcon}
		<div class="menuListItemIcon">
			<Slotted child={menuItemFirst}>
				<Icon {icon} ico={iconFirst} color={iconColor} fontSize={iconSize} />
			</Slotted>
		</div>
	{/if}
	<div role="menuitem" class="menuListItemText">
		<Slotted child={children} slotArgs={data}>
			{text}
		</Slotted>
	</div>
	{#if menuItemLast || action || iconLast}
		<div class="menuItemActions">
			<Slotted child={menuItemLast}>
				<Icon ico={iconLast} />
				{action}
			</Slotted>
		</div>
	{/if}
</li>
{#if divider}
	<li role="separator">
		<Divider density="tight" expansion="padded" />
	</li>
{/if}

<style global lang="scss">
	@import './menu-list.scss';
</style>
