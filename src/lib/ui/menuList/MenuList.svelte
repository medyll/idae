<svelte:options accessors runes />

<script lang="ts" generics="T= Data">
	import { setContext } from 'svelte';
	import type { MenuListProps } from './types.js';
	import MenuItem from './MenuListItem.svelte';
	import type { Data } from '$lib/index.js';
	import Slotted from '$lib/utils/slot/Slotted.svelte';

	let {
		class: className = '',
		density = 'tight',
		dense = 'medium',
		style = undefined,
		bordered = false,
		selectorField,
		selectedData = $bindable({}),
		selectedIndex = $bindable(-1),
		element = $bindable(),
		menuListItems: menuItemsList = $bindable(undefined),
		data = $bindable(undefined),
		role = 'menu',
		onclick = undefined,
		showLastOnSelected = true,
		actions = {
			navigate: (idx: number) => {
				if (element && idx > -1) {
					selectedIndex = idx;
					if (menuStore) menuStore.selectedIndex = idx;
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
	}: MenuListProps = $props();

	let defaultStoreValues = {
		menuItemsList,
		menuItemsInstances: [],
		density,
		dense,
		data,
		onclick,
		selectorField,
		selectedIndex,
		actions
	};

	let menuStore = $state(defaultStoreValues);
	setContext('menuStateContext', menuStore);

	$effect(() => {
		element?.addEventListener<any>('menu:item:clicked', onMenuClick);
		menuStore.selectedIndex = selectedIndex;
	});

	function onMenuClick(e: CustomEvent<any>) {
		/** @deprecated */
		let event = new CustomEvent('menu:click', { detail: e.detail, bubbles: true });
		element?.dispatchEvent(event);
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<ul
	bind:this={element}
	class="dense-{density} menuList {className}"
	class:showLastOnSelected
	tabindex="0"
	{style}
	{role}
	{...rest}
>
	{#if menuItemsList}
		{#each menuItemsList ?? [] as menuItem, itemIndex}
			<Slotted child={children} slotArgs={{ item: menuItem, itemIndex, menuItem }}>
				<MenuItem {...menuItem} {itemIndex} />
			</Slotted>
		{/each}
	{:else if data}
		{#each data as dta, itemIndex}
			<Slotted child={children} slotArgs={{ item: dta, itemIndex, menuItem: dta }}>
				<MenuItem data={dta} {itemIndex} />
			</Slotted>
		{/each}
	{:else}
		<Slotted child={children} />
	{/if}
</ul>

<style global lang="scss">
	@import './menu-list.scss';
</style>
