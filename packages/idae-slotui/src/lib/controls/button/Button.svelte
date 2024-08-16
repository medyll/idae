<script lang="ts">
	import { popper} from '$lib/ui/popper/usePopper.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { ButtonProps } from './types.js';
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
		usePopperProps={disabled:true},
		loading,
		showChip,
		popperOpen,
		width = widthPreset.auto,
		tall = tallPreset.small,
		nowrap,
		ellipsis=true,
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
 
	$inspect(startRef?.clientWidth)
</script>

<button
	class={className + ' button '}
	class:loading
	bind:this={element}
	use:popper={usePopperProps}
	onclickAway={() => {
		popperOpen = false;
	}}
	type={buttonType}
	{tall}
	{width}
	{variant}
	{selected}
	{...rest}
	style:aspect-ratio={ratio}
	style="--content-padding:{buttonStart || icon ? `${startRef?.clientWidth ?? '0.5rem'}px` : '0.5rem'}"
>
	{#if buttonStart || icon}
		<div
			bind:this={startRef}
			class="button-start"
			style="--start-position:{(children ?? value) ? 'absolute' : 'relative'}"
		>
			<Slotted child={buttonStart}>
				<Icon iconSize="small" {icon} />
			</Slotted>
		</div>
	{/if}
	{#if children ?? value}
		<div
			class="button-central {ellipsis? 'ellipsis' : ''}"
			style="--content-padding:{buttonStart || icon ? `${startRef?.clientWidth ?? '0.5rem'}px` : '0.5rem'}"
		>
			<Slotted child={children}>{value ?? ''}</Slotted>
		</div>
	{/if}
	{#if buttonEnd || iconEnd}
		<div class="button-end">
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

<style global lang="scss">
	@import './button.scss';
</style>
