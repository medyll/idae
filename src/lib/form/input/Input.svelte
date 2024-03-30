<svelte:options accessors />

<script lang="ts">
	import { popper, type UsePopperProps } from '$lib/ui/popper/usePopper.js';
	import type { ElementProps } from '$lib/types/index.js';
	import Button from '$lib/base/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';

	let inputType = 'text';
	export { inputType as type };

	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;

	export let style = '';

	/** icon as a parameter*/
	export let icon: string | undefined = undefined;
	/** icon as a parameter*/
	export let iconColor: string = '#666';
	/** icon as a parameter*/
	export let endIcon: string | undefined = undefined;
	/** icon color as a parameter*/
	export let endIconColor: string = '#666';
	/** paramters for usePopper */
	export let usePopper: UsePopperProps | undefined = undefined;
	/** with of the input using  presets */
	export let size: ElementProps['sizeType'] | 'full' = 'auto';
	/** height of the input, using preset values */
	export let height: string = 'default';
	/** has no border */
	export let borderless: boolean = false;
	/** has no border */
	export let transparent: boolean = false;

	export let value: any | undefined = undefined;

	let niceIconStyle = '';

	niceIconStyle += icon || $$slots.inputStart ? 'padding-left:2.2rem;' : '';
	niceIconStyle += endIcon || $$slots.inputEnd ? 'padding-right:2.2rem;' : '';

	$: if (usePopper) {
		usePopper.disabled = false;
		usePopper.parentNode = element;
	} else {
		usePopper = { disabled: true };
	}
</script>

{#if icon || endIcon || inputType === 'search' || $$slots.inputStart || $$slots.inputEnd}
	<div style="position:relative;display:block">
		{#if icon || $$slots.inputStart}
			<div class="inputStart">
				<slot name="inputStart">
					<Icon {icon} style="max-width:100%;max-height:100%;color:{iconColor}" />
				</slot>
			</div>
		{/if}
		{#if $$slots.inputEnd || endIcon || inputType === 'search'}
			<div class="inputEnd">
				{#if $$slots.inputEnd || endIcon}
					<slot name="inputEnd">
						<Icon icon={endIcon} style="max-width:100%;max-height:100%;color:{endIconColor}" />
					</slot>
				{/if}
				{#if inputType === 'search'}
					<Button
						on:click={() => {
							value = null;
						}}
						disabled={!value?.length}
						naked
						icon="close-circle-outline"
						iconFamily="mdi"
					/>
				{/if}
			</div>
		{/if}
		<input
			bind:value
			bind:this={element}
			use:popper={usePopper}
			type="text"
			class="w-{size} {className}"
			data-height={height}
			data-width={size}
			{borderless}
			style={niceIconStyle + ';' + style}
			{...$$restProps}
		/>
	</div>
{:else}
	<input
		bind:value
		bind:this={element}
		use:popper={usePopper}
		type="text"
		class="w-{size} {className}"
		data-height={height}
		{borderless}
		{style}
		{...$$restProps}
	/>
{/if}

<style lang="scss">
	@import './input.scss';
</style>
