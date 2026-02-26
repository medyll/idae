<script module lang="ts">
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { tallPreset,  type CommonProps, type ElementProps } from '$lib/types/index.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';
/**
 * Props for the TextField component.
 */
export type TextFieldProps = CommonProps & {
	/** Icon as a parameter */
	icon?: ElementProps['icon'];
	/** Icon color as a parameter */
	iconColor?: string;
	/** End icon as a parameter */
	endIcon?: string;
	/** End icon color as a parameter */
	endIconColor?: string;
	/** Parameters for usePopper */
	usePopper?: UsePopperProps;
	/** Width of the input using presets */
	width?: ElementProps['width'];
	/** Height of the input, using preset values */
	tall?: ElementProps['tall'];
	/** Has no border */
	borderless?: boolean;
	/** Transparent input */
	transparent?: boolean;
	/** Value of the input */
	value?: any;
	/** Slot before the input */
	inputFirst?: Snippet;
	/** Slot after the input */
	inputLast?: Snippet;
};

export const TextFieldDemoValues: DemoerStoryProps<TextFieldProps> = {
	icon: {
		type: 'icon',
		values: ['search', undefined]
	},
	endIcon: {
		type: 'icon',
		values: ['search', undefined]
	},
	width: {
		type: 'width'
	},
	tall: {
		type: 'tall',
		default: tallPreset.default
	},
	transparent: {
		type: 'boolean'
	}
};

export let { parameters, componentArgs } = demoerArgs(TextFieldDemoValues);
</script>

<svelte:options />

<script lang="ts">
	import { popper } from '$lib/ui/popper/usePopper.js';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';

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

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--textfield-background: var(--sld-color-background-alpha-high);
		--textfield-border-width: 1px;
		--textfield-border-color: var(--sld-color-foreground-alpha-mid);
		--textfield-border-bottom-width: 2px;
		--textfield-border-bottom-color: var(--sld-color-primary-darker, rgb(208, 191, 151));
		--textfield-radius: var(--sld-radius-small);
		--textfield-padding: 0 0.5rem;
		--textfield-shadow: inset 0px 0px 3px 1px rgba(51, 51, 51, 0.1);
	}

	.slotui-textfield {
		border: var(--textfield-border-width) solid var(--textfield-border-color);
		border-bottom: var(--textfield-border-bottom-width) solid var(--textfield-border-bottom-color);
		border-radius: var(--textfield-radius);
		padding: var(--textfield-padding);
		box-shadow: var(--textfield-shadow);
		background-color: var(--textfield-background);
		color: var(--sld-color-foreground);
	}

	.slotui-textfield[error] { border-bottom: red; }

	.slotui-textfield-container { position: relative; display: inline-flex; overflow: hidden; }

	.slotui-textfield-start { position: absolute; height: 100%; max-height: 100%; width: 24px; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 0.25rem; background-color: rgba(255,255,255,0.1); border-radius: var(--textfield-radius, var(--sld-radius-small)); }

	.slotui-textfield-end { position: absolute; right: 0; height: 100%; max-height: 100%; min-width: 24px; overflow: hidden; display: flex; gap: 4px; padding: 2px; align-items: center; border-radius: var(--textfield-radius, var(--sld-radius-small)); }

	.slotui-textfield-end > * { max-height: calc(100% - 40px) !important; border: 1px solid pink; }
</style>
