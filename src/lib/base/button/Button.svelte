<svelte:options accessors={true} runes={true} />

<script lang="ts">
	/** @restProps { button} */
	import { popper, type UsePopperProps } from '$lib/ui/popper/usePopper.js';
	import type { CommonProps, ElementProps } from '$lib/types/index.js';
	import Menu from '$lib/ui/menu/Menu.svelte';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { autofocus } from '$lib/utils/uses/autofocus/autofocus.js';
	import type { Snippet } from 'svelte';

	type Props = CommonProps & {
		element?: HTMLButtonElement;
		/** button type */
		type?: 'button' | 'submit' | 'reset';
		/** icon as a parameter */
		icon: string | undefined;
		/** icon color as a parameter*/
		iconColor?: string;
		/** endIcon as a parameter */
		endIcon?: string | undefined;
		/** endIcon color as a parameter*/
		endIconColor?: string;
		/**
		 * endIcon
		 * @type {'auto' | 'tiny' | 'small' | 'medium' | 'large' | 'full'}
		 */
		endIconSize?: string;
		/** background color theme */
		bgTheme?: string | undefined;
		/** paramters for usePopper */
		usePopper?: UsePopperProps | undefined;
		/** show loading state */
		loading?: boolean;
		/** show chip */
		showChip?: boolean;
		/** show / hide popper, when $$slots.popper exists */
		popperOpen?: boolean;
		/** button style contained */
		contained?: boolean | undefined;
		/** button style bordered */
		bordered?: boolean | undefined;
		/** button style link */
		link?: boolean | undefined;
		/** button style link */
		naked: boolean | undefined;
		/**
		 * with of the button using  presets
		 * @type {'auto' | 'tiny' | 'small' | 'medium' | 'large' | 'full'}
		 */
		size: ElementProps['sizeType'] | 'full';
		/**
		 * density of the button, using preset values
		 * @type {'default' | 'dense' | 'extra-dense'}
		 */
		density: ElementProps['density'];
		/** add ellipsis on overflowed text */
		nowrap: boolean;
		/**
		 * height of the button, using preset values
		 * @type {'auto' | 'tiny' | 'small' | 'medium' | 'large' | 'full'}
		 */
		height: string;
		/**  button selected */
		selected: boolean;
		/**  give focus to button on display */
		focus: boolean;
		/** action button css style */
		actionStyle: string | undefined;
		/** whole container css style */
		htmlRootStyle?: string | undefined;
		primary?: string | undefined;
		secondary?: string | undefined;
		/** reverse the order of the button zone*/
		reverse: boolean;
		/** aspect ratio of the button */
		ratio?: string;
		slots?: {
			buttonPopper?: Snippet;
			buttonStart?: Snippet;
			buttonEnd?: Snippet;
			buttonLoadingIcon?: Snippet;
		};
		onclick?: (event: MouseEvent) => void;
		restProps: HTMLButtonElement['attributes'];
	};

	let {
		class: className,
		element,
		style,
		type: buttonType = 'button',
		icon,
		iconColor = '#666',
		endIcon,
		endIconColor = '#666',
		endIconSize = 'small',
		bgTheme,
		usePopper,
		loading,
		showChip,
		popperOpen,
		contained,
		bordered,
		link,
		naked,
		size = 'auto',
		density = 'default',
		nowrap,
		height = 'default',
		selected = false,
		focus = false,
		actionStyle,
		htmlRootStyle,
		primary,
		secondary,
		reverse = false,
		ratio = 'auto',
		slots = {},
		children,
		onclick,
		...restProps
	} = $props() as Props;

	let presetDefault = 'bordered contained';

	if (contained || bordered || link || naked) presetDefault = '';

	let containerRef;
	let actionComponent = Menu;
	let actionComponentProps = {};
	let actionContent = '';
	// for action
	let actionArgs = $derived({
		code: 'node',
		parentNode: element,
		component: actionComponent,
		componentProps: actionComponentProps ?? {},
		position: 'BL',
		content: actionContent,
		disabled: false
	});

	if (contained || bordered || link) {
		presetDefault = '';
	} else {
		link = presetDefault.includes('link');
		bordered = presetDefault.includes('bordered');
		contained = presetDefault.includes('contained');
	}

	function useAutoFocus(node: HTMLElement) {
		if (focus) return autofocus(node);
	}

	/* $: if (usePopper) {
		usePopper.disabled = false;
		usePopper.parentNode = element;
	} else {
		usePopper = { disabled: true };
	} */
</script>

<div bind:this={containerRef} style="position:relative;display:flex;{htmlRootStyle}">
	<button
		class={className}
		class:loading
		bind:this={element}
		use:popper={usePopper}
		use:useAutoFocus
		{onclick}
		on:clickAway={() => {
			popperOpen = false;
		}}
		data-height={height}
		type={buttonType}
		{density}
		{nowrap}
		{link}
		{bordered}
		{contained}
		{naked}
		{selected}
		{presetDefault}
		{...restProps}
		data-width={size}
		style:background="var(--sld-color-{bgTheme})"
		style:color={bgTheme ? 'white' : ''}
		style:aspect-ratio={ratio}
	>
		<div class="innerButton">
			{#if slots.buttonStart || icon}
				<div class="buttonStart">
					{#if slots.buttonStart}
						{@render slots.buttonStart()}
					{:else if icon}
						<Icon fontSize="small" {icon} color={iconColor} />
					{/if}
				</div>
			{/if}
			{#if children ?? primary}
				<div class="central">
					<slot>{primary ?? ''}</slot>
				</div>
			{/if}
			{#if slots.buttonEnd || endIcon}
				<div class="action">
					{#if slots.buttonEnd}
						{@render slots.buttonEnd()}
					{:else}
						<Icon fontSize={endIconSize} icon={endIcon} color={endIconColor} />
					{/if}
				</div>
			{/if}
		</div>
		{#if loading}
			<div
				onclick={(event) => {
					event.preventDefault();
					event.stopPropagation();
				}}
				class="loadingButtonZone"
			>
				<div class="flex-h flex-align-middle gap-tiny">
					<div>
						{#if slots.buttonLoadingIcon}
							{@render slots.buttonLoadingIcon()}
						{:else}
							<Icon icon="loading" rotate />
						{/if}
					</div>
					<div>loading</div>
				</div>
			</div>
		{/if}
		{#if showChip}
			<span class="chip" />
		{/if}
	</button>
	{#if element && slots.buttonPopper}
		<svelte:self
			contained
			style="position:relative;height:100%;{actionStyle}"
			on:click={(event) => {
				event.preventDefault();
				popperOpen = !popperOpen;
			}}
			size="tiny"
			icon="chevron-{popperOpen ? 'up' : 'down'}"
			iconSize="small"
			class="actionButton"
		/>
		{#if popperOpen}
			<Popper code="button" {...actionArgs} parentNode={element}>
				{#if slots.buttonPopper}
					{@render slots.buttonPopper()}
				{/if}
			</Popper>
		{/if}
	{/if}
</div>

<style lang="scss">
	@import './button.scss';
</style>
