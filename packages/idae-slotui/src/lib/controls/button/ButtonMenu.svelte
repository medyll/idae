<script lang="ts" generics="T">
	import Popper from '$lib/ui/popper/Popper.svelte';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import Button from './Button.svelte';
	import type { ButtonMenuProps } from './types.js';
	import type { MenuListProps } from '$lib/ui/menuList/types.js';
	import type { PopperProps } from '$lib/ui/popper/types.js';
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';

	let {
		menuProps = {} as MenuListProps<T>,
		popperProps = {} as PopperProps,
		disabled = false,
		element = $bindable(),
		popperElement,
		menuItem,
		children,
		...rest
	}: ButtonMenuProps<T> = $props();

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
	{children}
/>
{#if isOpen && !disabled}
	<Popper
		bind:element={popperElement}
		bind:isOpen
		parentNode={element}
		{...popperProps}
		position="BC"
		stickToHookWidth={true}
	>
		<MenuList {...menuProps}>
			{#snippet children({ item })}
				{#if menuItem}
					{@render menuItem?.({ item })}
				{:else}
					<MenuListItem {...item} />
				{/if}
			{/snippet}
		</MenuList>
	</Popper>
{/if}

<style lang="scss">
	@import './ButtonMenu.scss';
</style>
