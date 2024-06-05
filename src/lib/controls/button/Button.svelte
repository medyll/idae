<script lang="ts">
	import { popper, type UsePopperProps } from '$lib/ui/popper/usePopper.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { ButtonProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ExpandProps } from '$lib/types/index.js';

	let {
		class: className,
		element = $bindable(),
		style,
		type: buttonType = 'button',
		icon = $bindable(),
		iconEnd = $bindable(),
		variant = 'bordered',
		bgTheme,
		usePopper,
		loading,
		showChip,
		popperOpen,
		width: size = 'auto',
		dense = 'kind',
		nowrap,
		selected = false,
		value,
		reverse = false,
		ratio = 'auto',
		buttonPopper,
		buttonStart,
		buttonEnd,
		buttonLoadingIcon,
		children,
		...rest
	}: ExpandProps<ButtonProps> = $props();

	let startRef: HTMLDivElement;
	let clientWidth: number | undefined = $state();
</script>

<button
	class={className + ' button dense-' + dense + ' ' + variant}
	class:loading
	bind:this={element}
	use:popper={usePopper}
	onclickAway={() => {
		popperOpen = false;
	}}
	type={buttonType}
	{dense}
	{nowrap}
	{selected}
	{...rest}
	data-width={size}
	style:color={bgTheme ? 'white' : ''}
	style:aspect-ratio={ratio}
>
	{#if buttonStart || icon}
		<div
			bind:this={startRef}
			bind:clientWidth
			class="button-start"
			style="--start-position:{children ?? value ? 'absolute' : 'relative'}"
		>
			<Slotted child={buttonStart}>
				<Icon iconSize="small" {icon} />
			</Slotted>
		</div>
	{/if}
	{#if children ?? value}
		<div
			class="button-central"
			style="--content-padding:{buttonStart || icon ? `${clientWidth}px` : ''}"
		>
			<Slotted child={children}>{value ?? ''}</Slotted>
		</div>
	{/if}
	{#if buttonEnd || iconEnd}
		<div class="button-action">
			<Slotted child={buttonEnd}>
				<Icon icon={iconEnd} />
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
