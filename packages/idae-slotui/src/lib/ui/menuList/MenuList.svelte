<script module lang="ts">
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data, IconObj } from '$lib/types/index.js';
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the MenuList component.
 * @template T - The type of data for the menu items.
 */
export type MenuListProps<T = Data> = CommonProps & {
	menuItemsInstances?: any[];
	hasIcon?: boolean;
	onclick?: (event: CustomEvent<T>, itemIndex: number) => void;
	element?: HTMLElement;
	menuListItems?: MenuListItemProps[];
	data?: T[];
	tall?: ElementProps['tall'];
	width?: ElementProps['width'];
	/** Displayed field for the listItem */
	presentationField?: [keyof T];
	/** Displayed as a grid */
	grid?: boolean | number;
	/** Index to select the item */
	selectedIndex?: number;
	/** Field used to select the item */
	selectorField?: keyof T;
	/** Selected data */
	selectedData?: T;
	/** Show last item on selected */
	showLastOnSelected?: boolean;
	/** Role available for li element */
	role?: 'directory' | 'group' | 'listbox' | 'menu' | 'menubar' | 'tablist' | 'toolbar' | 'tree';
	/** Actions to be performed on the menu */
	actions?: {
		navigate: (e: KeyboardEvent) => void;
		gotoIndex: (idx: number) => void;
	};
};
</script>
<script lang="ts" generics="T= Data">
	import { navigation } from '$lib/utils/uses/navigation.js';

	import { setContext } from 'svelte';

	import MenuListItem from './MenuListItem.svelte';
	import { tallPreset, widthPreset, type Data, type ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import Looper from '$lib/utils/looper/Looper.svelte';

	export const actions = {
		navigate(e: KeyboardEvent) {
			element?.dispatchEvent(new CustomEvent('menu:navigate', { detail: e }));
		},
		gotoIndex: (idx: number) => {
			if (element && idx > -1) {
				element.dispatchEvent(new CustomEvent('menu:gotoIndex', { detail: { index: idx } }));
				selectedIndex = idx;
				if (menuStore) menuStore.selectedIndex = idx;
				const target = element.querySelector('[aria-selected=true]');
				if (target) {
					scrollToElement(target as HTMLElement);
				}
			}
		}
	};
	let {
		class: className = '',
		tall = tallPreset.small,
		width = widthPreset.full,
		style,
		selectorField,
		role = 'menu',
		grid,
		showLastOnSelected = true,
		presentationField,
		onclick,
		data = $bindable(),
		selectedData = $bindable(),
		selectedIndex = $bindable(),
		element = $bindable(),
		menuListItems = $bindable(),
		menuListItemProps = $bindable(),
		children,
		menuListItem,
		listItemBottom,
		...rest
	}: MenuListProps = $props();

	menuListItemProps = {
		tall,
		width,
		selectorField,
		presentationField,
		...menuListItemProps
	};

	let defaultStoreValues = {
		menuListItems,
		menuItemsInstances: [],
		tall,
		width,
		data,
		selectorField,
		selectedIndex,
		actions,
		presentationField,
		...menuListItemProps
	};

	let menuStore = $state(defaultStoreValues);
	setContext('menuStateContext', menuStore);

	$effect(() => {
		menuStore.selectedIndex = selectedIndex;
	});
	$effect(() => {
		menuStore.tall = tall;
	});
	$effect(() => {
		if (element) {
			element.addEventListener<any>('menu:item:clicked', onMenuItemClick);

			element.addEventListener('click', () => {
				element?.focus();
			});
			element.addEventListener('menu:onnavigate', ((
				event: CustomEvent<{ selectedIndex: number }>
			) => {
				if (event?.detail?.selectedIndex) selectedIndex = event.detail.selectedIndex;
			}) as EventListener);
		}
	});

	function onMenuItemClick(e: CustomEvent<any>) {
		if (onclick) onclick(e.detail, 2);
	}

	function scrollToElement(target: HTMLElement) {
		if (target) {
			const tD = target.getBoundingClientRect();
			const sD = element?.getBoundingClientRect();
			if (sD) {
				if (tD.top - 10 <= sD.top || tD.bottom >= sD.bottom) {
					target.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<ul
	bind:this={element}
	class:showLastOnSelected
	class="slotui-menulist {className} {grid ? 'grid' : ''}"
	tabindex="0"
	style={`${style};var(--menulist-grid-items-count):${grid ? grid : '0'}`}
	{role}
	use:navigation={{ className: 'menulist-item', selectedIndex: -1 }}
	{...rest}
>
	{#if menuListItems}
		{#each menuListItems ?? [] as menuItem, itemIndex}
			<Slotted child={children} slotArgs={{ item: menuItem, itemIndex, menuItem }}>
				<MenuListItem {...menuListItemProps} {...menuItem} {itemIndex} />
			</Slotted>
		{/each}
	{:else if data}
		{#each data as dta, itemIndex}
			<Slotted child={children} slotArgs={{ item: dta, itemIndex, menuItem: dta }}>
				<MenuListItem {...menuListItemProps} data={dta} {itemIndex}>
					{@render menuListItem?.({ item: dta, itemIndex })}
				</MenuListItem>
			</Slotted>
		{/each}
	{:else}
		<Slotted child={children} />
	{/if}
	{@render listItemBottom?.({ item: {}, itemIndex: -1 })}
</ul>

<style global lang="postcss">
	@reference "tailwindcss";
	@import './menu-list.css';
</style>
