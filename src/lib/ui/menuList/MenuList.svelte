<script lang="ts" generics="T= Data">
	import { navigation } from '$lib/utils/uses/navigation.js';

	import { setContext } from 'svelte';
	import type { MenuListProps } from './types.js';
	import MenuItem from './MenuListItem.svelte';
	import { densePreset, type Data, type ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

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
		dense = densePreset.default,
		style = undefined,
		selectorField,
		selectedData = $bindable({}),
		selectedIndex = $bindable(-1),
		element = $bindable(),
		menuListItems: menuItemsList = $bindable(undefined),
		data = $bindable(undefined),
		role = 'menu',
		onclick,
		showLastOnSelected = true,
		children,
		...rest
	}: ExpandProps<MenuListProps> = $props();

	let defaultStoreValues = {
		menuItemsList,
		menuItemsInstances: [],
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
		menuStore.selectedIndex = selectedIndex;
	});
	$effect(() => {
		if (element) {
			element.addEventListener<any>('menu:item:clicked', onMenuClick);

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

	function onMenuClick(e: CustomEvent<any>) {
		/** @deprecated */
		let event = new CustomEvent('menu:click', { detail: e.detail, bubbles: true });
		element?.dispatchEvent(event);
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
	class="dense-{dense} menuList {className}"
	class:showLastOnSelected
	tabindex="0"
	{style}
	{role}
	use:navigation={{ className: 'menuListItem', selectedIndex: -1 }}
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
