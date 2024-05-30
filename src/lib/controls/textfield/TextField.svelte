<svelte:options accessors />

<script lang="ts">
	import { popper } from '$lib/ui/popper/usePopper.js';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { TextFieldProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let inputType = 'text';
	export { inputType as type };

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		icon = undefined,
		iconColor = '#666',
		endIcon = undefined,
		endIconColor = '#666',
		usePopper = undefined,
		size = 'auto',
		height = 'default',
		borderless = false,
		transparent = false,
		value = $bindable(),
		children,
		inputFirst: inputStart,
		inputLast: inputEnd,
		...rest
	}: TextFieldProps = $props();

	let niceIconStyle = '';

	niceIconStyle += icon || inputStart ? 'padding-left:2.2rem;' : '';
	niceIconStyle += endIcon || inputEnd ? 'padding-right:2.2rem;' : '';

	if (usePopper) {
		usePopper.disabled = false;
		usePopper.parentNode = element;
	} else {
		usePopper = { disabled: true };
	}
</script>

{#if icon || endIcon || inputType === 'search' || inputStart || inputEnd || $$slots.inputStart || $$slots.inputEnd}
	<div style="position:relative;display:contents">
		{#if icon || inputStart}
			<div class="inputStart">
				<!-- <slot name="inputStart">
						<Icon {icon} style="max-width:100%;max-height:100%;color:{iconColor}" />
					</slot> -->
				<Slotted child={inputEnd}>
					<Icon {icon} style="max-width:100%;max-height:100%;color:{iconColor}" />
				</Slotted>
			</div>
		{/if}
		{#if inputEnd || $$slots.inputEnd || endIcon || inputType === 'search'}
			<div class="inputEnd">
				{#if inputEnd || $$slots.inputEnd || endIcon}
					<!-- <slot name="inputEnd">
							<Icon icon={endIcon} style="max-width:100%;max-height:100%;color:{endIconColor}" />
						</slot> -->
					<Slotted child={inputEnd}>
						<Icon icon={endIcon} style="max-width:100%;max-height:100%;color:{endIconColor}" />
					</Slotted>
				{/if}
				{#if inputType === 'search'}
					<Button
						on:click={() => {
							value = null;
						}}
						disabled={!value?.length}
						variant="naked"
						icon="mdi:close-circle-outline"
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
			{...rest}
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
		{...rest}
	/>
{/if}

<style lang="scss">
	@import './textfield.scss';
</style>
