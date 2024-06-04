<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PopperProps } from '$lib/ui/popper/types.js';
	import type { MenuProps } from '$lib/ui/menu/types.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Button from './Button.svelte';
	import type { ButtonProps } from './types.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ExpandProps } from '$lib/types/index.js';

	type ButtonActionProps = ButtonProps & {
		menuProps?: MenuProps;
		popperProps?: PopperProps;
		popperContent?: Snippet;
	};

	let {
		element,
		class: className = '',
		menuProps = {},
		popperProps = {},
		popperContent = undefined,
		disabled = false,
		variant = 'bordered',
		dense = 'kind',
		children,
		...rest
	}: ExpandProps<ButtonActionProps> = $props();
	let holder: HTMLDivElement;
	let isOpen = $state(popperProps?.isOpen);
	let chevron = 'fluent:chevron-down-20-regular';
</script>

<div bind:this={holder} class="button button-action selected {variant} dense-{dense} {className}">
	<Button {...rest} {dense} bind:element variant="naked">
		<Slotted child={children} />
	</Button>
	<Button
		{disabled}
		onclick={() => {
			isOpen = true;
		}}
		{dense}
		variant="naked"
		class="chevron"><Icon icon={chevron} rotation={isOpen ? 180 : 0} /></Button
	>
</div>
{#if isOpen && !disabled}
	<Popper bind:isOpen parentNode={holder} stickToHookWidth={true} {...popperProps}>
		<Slotted child={popperContent} />
	</Popper>
{/if}

<style lang="scss">
	@import './button.scss';
	@import './button-action.scss';
</style>
