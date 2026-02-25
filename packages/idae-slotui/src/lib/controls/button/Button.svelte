<script module lang="ts">
import type { Snippet } from 'svelte';
import type { MenuListProps } from '$lib/ui/menuList/types.js';
import type { PopperProps } from '$lib/ui/popper/types.js';

/**
 * Props for the Button component.
 * Represents a highly customizable button with icon, loading, chip, and popper support.
 */
export type ButtonProps = {
	/** Class name for the button */
	class?: string;
	/** Reference to the button element */
	element?: HTMLButtonElement;
	/** Button type attribute */
	type?: 'button' | 'submit' | 'reset';
	/** Icon to display at the start */
	icon?: any;
	/** Add ellipsis on overflowed text */
	wrap?: any;
	/** @deprecated Add ellipsis on overflowed text */
	nowrap?: boolean;
	/** Add ellipsis on overflowed text */
	ellipsis?: boolean;
	/** Icon to display at the end */
	iconEnd?: any;
	/** Background color theme */
	bgTheme?: string;
	/** Parameters for usePopper */
	usePopperProps?: any;
	/** Show/hide popper */
	popperOpen?: boolean;
	/** Show loading state */
	loading?: boolean;
	/** Show chip indicator */
	showChip?: boolean;
	/** Button style variant */
	variant?: any;
	/** Preset width of the button */
	width?: any;
	/** Preset height (tall) of the button */
	tall?: any;
	/** Button selected state */
	selected?: boolean;
	/** Button value */
	value?: string;
	/** Reverse the order of the button zone */
	reverse?: boolean;
	/** Rounded or rounded corners size */
	rounded?: boolean | string;
	/** Aspect ratio of the button */
	ratio?: string;
	/** Slot for children content */
	children?: Snippet;
	/** Slot for popper content */
	buttonPopper?: Snippet;
	/** Slot for start content */
	buttonStart?: Snippet;
	/** Slot for end content */
	buttonEnd?: Snippet;
	/** Slot for loading icon */
	buttonLoadingIcon?: Snippet;
};

</script>

<script lang="ts">
import { popper } from '$lib/ui/popper/usePopper.js';
import Icon from '$lib/base/icon/Icon.svelte';
import Slotted from '$lib/utils/slotted/Slotted.svelte';
import { tallPreset, widthPreset, type ExpandProps } from '$lib/types/index.js';

let {
	class: className,
	style,
	element = $bindable(),
	type: buttonType = 'button',
	icon = $bindable(),
	iconEnd = $bindable(),
	variant = 'bordered',
	bgTheme,
	usePopperProps = { disabled: true },
	loading,
	showChip,
	popperOpen,
	width = widthPreset.auto,
	tall = tallPreset.small,
	nowrap,
	ellipsis = true,
	selected = false,
	value,
	reverse = false,
	ratio,
	buttonPopper,
	buttonStart,
	buttonEnd,
	buttonLoadingIcon,
	children,
	...rest
}: ButtonProps = $props();

let startRef: HTMLDivElement | undefined = $state<HTMLDivElement | undefined>(undefined);
</script>

<button
	class={className + ' slotui-button '}
	class:loading
	bind:this={element}
	use:popper={usePopperProps}
	onclickAway={() => {
		popperOpen = false;
	}}
	type={buttonType}
	{tall}
	{width}
	variant={variant}
	{selected}
	{...rest}
	style:aspect-ratio={ratio}
	style="--content-padding:{buttonStart || icon ? `${startRef?.clientWidth ?? '0.5rem'}px` : '0.5rem'}"
>
	{#if buttonStart || icon}
		<div
			bind:this={startRef}
			class="start"
			style="--start-position:{(children ?? value) ? 'absolute' : 'relative'}"
		>
			<Slotted child={buttonStart}>
				<Icon iconSize="small" {icon} />
			</Slotted>
		</div>
	{/if}
	{#if children ?? value}
		<div
			class="central {ellipsis? 'ellipsis' : ''}"
			style="--content-padding:{buttonStart || icon ? `${startRef?.clientWidth ?? '0.5rem'}px` : '0.5rem'}"
		>
			<Slotted child={children}>{value ?? ''}</Slotted>
		</div>
	{/if}
	{#if buttonEnd || iconEnd}
		<div class="end">
			<Slotted child={buttonEnd}>
				<Icon icon={iconEnd} />
			</Slotted>
		</div>
	{/if}

	{#if loading}
		<div class="loadingButtonZone">
				<Slotted child={buttonLoadingIcon} /> 
		</div>
	{/if}
	{#if showChip}
		<span class="chip"></span>
	{/if}
</button>

<style global>
  @import './button.css';
</style>
