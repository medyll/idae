<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import { popper } from '$lib/ui/popper/usePopper.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { ButtonProps } from './types.js';

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
	<!-- style:background="var(--sld-color-{bgTheme})" -->
	{#if buttonStart || icon}
		<div
			bind:this={startRef}
			class="buttonStart"
			style="--start-position:{children ?? primary ? 'absolute' : 'relative'}"
		>
			{#if buttonStart}
				{@render buttonStart()}
			{:else if icon || ico}
				<Icon fontSize="small" {icon} {...ico} />
			{/if}
		</div>
	{/if}
	{#if children ?? primary}
		<div class="central">
			<slot>{primary ?? ''}</slot>
		</div>
	{/if}
	{#if buttonEnd || iconEnd}
		<div class="action">
			{#if buttonEnd}
				{@render buttonEnd()}
			{:else if iconEnd}
				<Icon {...iconEnd} />
			{/if}
		</div>
	{/if}

	{#if loading}
		<div class="loadingButtonZone">
			<div>
				{#if buttonLoadingIcon}
					{@render buttonLoadingIcon()}
				{:else}
					<Icon icon="loading" rotate />
				{/if}
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
