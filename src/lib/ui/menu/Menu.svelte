<svelte:options accessors runes />

<script lang="ts" generics="T= Data">
	import { setContext, type Snippet } from 'svelte';
	import type { IMenuItemProps } from './types.js';
	import MenuItem from './MenuItem.svelte';
	import MenuContextAgent from './MenuContextAgent.svelte';
	import type { CommonProps } from '$lib/types/index.js';
	import type { Data } from '$lib/index.js';
	import Slotted from '$lib/utils/slot/Slotted.svelte';

	type MenuProps = CommonProps & {
		element: HTMLElement | null;

		menuItemsList?: IMenuItemProps[];

		data?: T[];
		/** @deprecated use dense*/
		density?: 'none' | 'tight' | 'default' | 'medium' | 'kind';
		dense?: 'small' | 'default' | 'medium' | 'kind';

		style?: string;
		/** menu can have no border */
		bordered?: boolean;
		selectedIndex?: number;
		/**  actions to be performed on the menu */
		actions: {
			navigate: (idx: number) => void;
		};
		children: Snippet<[{ item: Data; itemIndex: number }]>;
		rest: any;
	};

	let {
		class: className = '',
		element = $bindable(),
		menuItemsList = $bindable(undefined),
		data = $bindable(undefined),
		density = 'tight',
		dense = 'default',
		style = undefined,
		bordered = false,
		selectedIndex = $bindable(-1),
		actions = {
			navigate: (idx: number) => {
				if (idx > -1) {
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
			}
		},
		children,
		...rest
	}: MenuProps = $props();

	let menuContextRef: MenuContextAgent = {} as MenuContextAgent;
	let menuAgent = menuContextRef?.menuAgent;

	const defaultStoreValues = {
		menuItemsList,
		menuItemsInstances: [],
		density,
		data,
		selectedIndex,
		actions
	};

	let menuStore = $state(defaultStoreValues);
	setContext('menuStateContext', menuStore);

	$effect(() => {
		element.addEventListener<any>('menu:item:clicked', onMenuClick);
		menuStore.selectedIndex = selectedIndex;
	});
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
	class="density-{density} dense-{density} menu {className}"
	{style}
	class:bordered
	{...rest}
	tabindex="-1"
>
	{#if menuItemsList}
		{#each menuItemsList ?? [] as menuItem, itemIndex}
			<Slotted slotted={children} slotArgs={{ item: menuItem, itemIndex, menuItem }}>
				<MenuItem {...menuItem} {itemIndex} />
			</Slotted>
		{/each}
	{:else if data}
		{#each data as dta, itemIndex}
			<Slotted slotted={children} slotArgs={{ item: dta, itemIndex, menuItem: dta }}>
				<MenuItem data={dta} {itemIndex} />
			</Slotted>
		{/each}
	{:else}
		<Slotted slotted={children} />
	{/if}
</ul>

<style lang="scss">
	@import './menu.scss';
</style>
