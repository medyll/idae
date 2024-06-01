<svelte:options accessors runes />

<script lang="ts">
	import Popper from '$lib/ui/popper/Popper.svelte';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import Button from './Button.svelte';
	import type { ButtonMenuProps, ButtonProps } from './types.js';
	import type { MenuListProps } from '$lib/ui/menuList/types.js';
	import type { PopperProps } from '$lib/ui/popper/types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		element,
		menuProps = {} as MenuListProps,
		popperProps = {} as PopperProps,
		menuItem = undefined,
		disabled = false,
		children,
		...rest
	}: ButtonMenuProps = $props();

	let isOpen = $state(popperProps?.isOpen);
	let chevron = $derived(disabled ? 'fluent:chevron-up-20-regular' : 'fluent:chevron-up-12-down');
</script>

<Button
	onclick={() => {
		isOpen = true;
	}}
	{...rest}
	bind:element
	iconEnd={{ icon: chevron, rotation: isOpen ? 180 : 0 }}
>
	<Slotted child={children} />
</Button>
{#if isOpen && !disabled}
	<Popper bind:isOpen parentNode={element} {...popperProps}>
		<MenuList {...menuProps}>
			<Slotted child={menuItem} />
		</MenuList>
	</Popper>
{/if}

<style lang="scss">
	@import './ButtonMenu.scss';
</style>
