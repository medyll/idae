<svelte:options />

<script lang="ts">
	import { popper } from '$lib/ui/popper/usePopper.js';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { TextFieldProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ExpandProps } from '$lib/types/index.js';

	let inputType = 'text';
	export { inputType as type };

	let {
		class: className = '',
		element = $bindable(),
		style,
		icon,
		iconColor = '#666',
		endIcon,
		endIconColor = '#666',
		usePopper,
		width = $bindable(),
		tall = 'default',
		borderless = false,
		transparent = false,
		value = $bindable(),
		children,
		inputFirst,
		inputLast,
		...rest
	}: ExpandProps<TextFieldProps> & Partial<HTMLInputElement> = $props();

	let niceIconStyle = $state('');

	niceIconStyle += icon || inputFirst ? 'padding-left:2.2rem;' : '';
	niceIconStyle += endIcon || inputLast ? 'padding-right:2.2rem;' : '';

	if (usePopper) {
		usePopper.disabled = false;
		usePopper.parentNode = element;
	} else {
		usePopper = { disabled: true };
	}
</script>

<div class="slotui-textfield-container">
	<div class="slotui-textfield-start">
		<Slotted child={inputFirst}>
			<Icon {icon} style="max-width:100%;max-height:100%;color:{iconColor}" />
		</Slotted>
	</div>

	{#if inputLast || endIcon || inputType === 'search'}
		<div class="slotui-textfield-end">
			{#if inputLast || endIcon}
				<Slotted child={inputLast}>
					<Icon icon={endIcon} style="max-width:100%;max-height:100%;color:{endIconColor}" />
				</Slotted>
			{/if}
			{#if inputType === 'search'}
				<Button
					onclick={() => {
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
		class="slotui-textfield width-{width} tall-{tall} {className}"
		style={niceIconStyle + ';' + style}
		{tall}
		{width}
		{...rest}
	/>
</div>

<style global lang="scss">
	@use './textfield.scss';
</style>
