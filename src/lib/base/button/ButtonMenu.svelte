<svelte:options accessors runes />

<script lang="ts">
	import Menu from '$lib/ui/menu/Menu.svelte';
	import type { Snippet } from 'svelte';
	import type { PopperProps } from '$lib/ui/popper/types.js';
	import type { MenuProps } from '$lib/ui/menu/types.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Button from './Button.svelte';
	import type { ButtonProps } from './types.js';

	type ButtonMenuProps = ButtonProps & {
		menuProps: MenuProps;
		popperProps: PopperProps;
		menuItem?: Snippet;
	};

	let {
		element,
		menuProps = {},
		popperProps = {},
		menuItem = undefined,
		disabled = false,
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
	<slot />
</Button>
{#if isOpen && !disabled}
	<Popper bind:isOpen parentNode={element} {...popperProps}>
		<Menu {...menuProps}><slot name="menuItem">{@render menuItem?.()}</slot></Menu>
	</Popper>
{/if}

<style lang="scss">
	@import './ButtonMenu.scss';
</style>
