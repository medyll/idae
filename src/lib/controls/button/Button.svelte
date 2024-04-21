<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import { popper } from '$lib/ui/popper/usePopper.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { ButtonProps } from './types.js';
	import Slotted from '$lib/utils/slot/Slotted.svelte';

	let {
		class: className,
		element = $bindable(),
		style,
		type: buttonType = 'button',
		icon,
		ico,
		variant = 'bordered',
		iconEnd,
		bgTheme,
		usePopper,
		loading,
		showChip,
		popperOpen,
		size = 'auto',
		dense = 'kind',
		nowrap,
		selected = false,
		value,
		primary,
		reverse = false,
		ratio = 'auto',
		buttonPopper,
		buttonStart,
		buttonEnd,
		buttonLoadingIcon,
		children,
		...restProps
	}: ButtonProps = $props();

	let startRef: HTMLDivElement;
	let clientWidth: number | undefined = $state();
</script>

<button
	class={className + ' button dense-' + dense + ' ' + variant}
	class:loading
	bind:this={element}
	use:popper={usePopper}
	on:clickAway={() => {
		popperOpen = false;
	}}
	type={buttonType}
	{dense}
	{nowrap}
	{selected}
	{...restProps}
	data-width={size}
	style:color={bgTheme ? 'white' : ''}
	style:aspect-ratio={ratio}
>
	{#if buttonStart || icon}
		<div
			bind:this={startRef}
			bind:clientWidth
			class="button-start"
			style="--start-position:{children ?? primary ? 'absolute' : 'relative'}"
		>
			<Slotted child={buttonStart}>
				<Icon fontSize="small" {icon} {...ico} />
			</Slotted>
		</div>
	{/if}
	{#if children ?? primary}
		<div
			class="button-central"
			style="--content-padding:{buttonStart || icon ? `${clientWidth}px` : ''}"
		>
			<Slotted child={children}>{primary ?? ''}</Slotted>
		</div>
	{/if}
	{#if buttonEnd || iconEnd}
		<div class="button-action">
			<Slotted child={buttonEnd}>
				<Icon {...iconEnd} />
			</Slotted>
		</div>
	{/if}

	{#if loading}
		<div class="loadingButtonZone">
			<div>
				<Slotted child={buttonLoadingIcon}>
					<Icon icon="loading" rotate />
				</Slotted>
			</div>
			<div>loading</div>
		</div>
	{/if}
	{#if showChip}
		<span class="chip" />
	{/if}
</button>

<style lang="scss">
	@import './button.scss';
</style>
