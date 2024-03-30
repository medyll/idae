<svelte:options accessors runes />

<script lang="ts" generics="T= Data">
	import { setContext, type Snippet } from 'svelte';
	import type { IMenuItemProps } from './types.js';
	import MenuItem from './MenuItem.svelte';
	import { createMenuStore } from './store.js';
	import MenuContextAgent from './MenuContextAgent.svelte';
	import type { CommonProps } from '$lib/types/index.js';
	import Slot from '$lib/utils/slot/Slot.svelte';
	import type { Data } from '$lib/index.js';

	type MenuProps = CommonProps & {
		element: HTMLElement | null;
		/** @deprecated */
		menuList?: IMenuItemProps[];

		menuItemsList?: IMenuItemProps[];

		data?: T[];

		density?: 'none' | 'tight' | 'default' | 'medium' | 'kind';

		style?: string;

		/** menu can have no border */
		bordered?: boolean;

		selectedIndex?: number;
		children: Snippet<[{ item: Data; itemIndex: number }]>;
	};

	let {
		class: className = '',
		element = $bindable(null),
		menuList = $bindable(undefined),
		menuItemsList = $bindable(undefined),
		data = $bindable(undefined),
		density = 'tight',
		style = undefined,
		bordered = false,
		selectedIndex = $bindable(-1),
		children,
		slots = {}
	}: MenuProps = $props();

	let menuContextRef;
	let menuAgent = menuContextRef?.menuAgent;

	/* $effect(() => {
		menuAgent = menuContextRef?.menuAgent;
	}); */

	export const actions = {
		navigate: (idx: number) => {
			// set selectedIndex
			selectedIndex = idx;
			if (menuAgent) $menuAgent.selectedIndex = idx;
			const target = element.querySelector('[data-selected=true]');
			if (target) {
				const tD = target.getBoundingClientRect();
				const sD = element.getBoundingClientRect();
				if (tD.top - 10 <= sD.top || tD.bottom >= sD.bottom) {
					target.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}
		}
	};

	const defaultStoreValues = {
		menuList,
		menuItemsList,
		menuItemsInstances: [],
		density,
		data,
		selectedIndex,
		actions
	};

	const menuStore = createMenuStore(defaultStoreValues);
	setContext('menuStateContext', menuStore);

	function onMenuClick(e: CustomEvent<any>) {
		/** @deprecated */
		let event = new CustomEvent('menu:clicked', { detail: e.detail, bubbles: true });
		element.dispatchEvent(event);
		event = new CustomEvent('menu:click', { detail: e.detail, bubbles: true });
		element.dispatchEvent(event);
	}
</script>

<MenuContextAgent bind:this={menuContextRef} />
<ul
	bind:this={element}
	role="menu"
	class="density-{density} menu {className}"
	{style}
	class:bordered
	on:menu:item:clicked={onMenuClick}
>
	{#if menuItemsList || menuList}
		{#each menuItemsList ?? menuList ?? [] as menuItem, itemIndex}
			<Slot slotted={children} slotArgs={{ item: menuItem, itemIndex, menuItem }}>
				<MenuItem {...menuItem} {itemIndex} />
			</Slot>
			<!-- <slot item={menuItem} {itemIndex} {menuItem}>
				<MenuItem {...menuItem} {itemIndex} />
			</slot> -->
		{/each}
	{:else if data}
		{#each data as dta, itemIndex}
			<Slot slotted={children} slotArgs={{ item: dta, itemIndex, menuItem: dta }}>
				<MenuItem data={dta} {itemIndex} />
			</Slot>
			<!-- <slot item={dta} {itemIndex} menuItem={dta}>
				<MenuItem data={dta} {itemIndex} />
			</slot> -->
		{/each}
	{:else}
		<slot />
	{/if}
</ul>

<style lang="scss">
	@import 'menu';
</style>
