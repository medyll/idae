<script lang="ts" generics="T= Data">
	import { navigation } from '$lib/utils/uses/navigation.js';

	import { setContext } from 'svelte';
	import type { MenuListProps } from './types.js';
	import MenuListItem from './MenuListItem.svelte';
	import { tallPreset, type Data, type ExpandProps } from '$lib/types/index.js';
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
		tall = tallPreset.default,
		style,
		selectorField,
		selectedData = $bindable(),
		selectedIndex = $bindable(),
		element = $bindable(),
		menuListItems: menuItemsList = $bindable(),
		data = $bindable(),
		role = 'menu',
		grid,
		onclick,
		showLastOnSelected = true,
		children,
		menuListItem,
		listItemBottom,
		...rest
	}: MenuListProps = $props();

	let defaultStoreValues = {
		menuItemsList,
		menuItemsInstances: [],
		tall,
		data,
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
	class="tall-{tall} menuList {className} {grid ? 'grid' : ''}"
	class:showLastOnSelected
	tabindex="0"
	style={`${style};var(--menu-list-grid-items-count):${grid ? grid : '0'}`}
	{role}
	use:navigation={{ className: 'menu-list-item', selectedIndex: -1 }}
	{...rest}
>
	{#if menuItemsList}
		{#each menuItemsList ?? [] as menuItem, itemIndex}
			<Slotted child={children} slotArgs={{ item: menuItem, itemIndex, menuItem }}>
				<MenuListItem {...menuItem} {itemIndex} />
			</Slotted>
		{/each}
	{:else if data}
		{#each data as dta, itemIndex}
			<Slotted child={children} slotArgs={{ item: dta, itemIndex, menuItem: dta }}>
				<MenuListItem data={dta} {itemIndex}>
					{@render menuListItem?.({ item: dta, itemIndex })}
				</MenuListItem>
			</Slotted>
		{/each}
	{:else}
		<Slotted child={children} />
	{/if}
	{@render listItemBottom?.({ item: {}, itemIndex: -1 })}
</ul>

<style global lang="scss">
	@import './menu-list.scss';
</style>
