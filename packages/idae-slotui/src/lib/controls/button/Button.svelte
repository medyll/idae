<script module lang="ts">
	import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
	import type { DemoerStoryProps } from "$lib/base/demoer/types.js";
	import {
		buttonVariant,
		densePreset,
		uiPresets,
		widthPreset,
		type CommonProps,
		type Data,
		type ElementProps,
	} from "$lib/types/index.js";
	import type { MenuListProps } from "$lib/ui/menuList/types.js";
	import type { PopperProps } from "$lib/ui/popper/types.js";
	import type { UsePopperProps } from "$lib/ui/popper/usePopper.js";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	export type ButtonProps = {
		element?: HTMLButtonElement;
		type?: "button" | "submit" | "reset";
		icon?: ElementProps["icon"];
		wrap?: ElementProps["wrap"];
		nowrap?: boolean;
		ellipsis?: boolean;
		iconEnd?: ElementProps["icon"];
		bgTheme?: string;
		usePopperProps?: UsePopperProps;
		popperOpen?: boolean;
		loading?: boolean;
		showChip?: boolean;
		variant?: ElementProps["buttonVariant"];
		width?: ElementProps["width"];
		tall?: ElementProps["tall"];
		selected?: boolean;
		value?: string;
		reverse?: boolean;
		rounded?: boolean | string;
		ratio?: string;
		children?: Snippet;
		buttonPopper?: Snippet;
		buttonStart?: Snippet;
		buttonEnd?: Snippet;
		buttonLoadingIcon?: Snippet;
	};

	export type ButtonMenuProps<T> = ButtonProps & {
		menuProps?: MenuListProps<T>;
		popperProps?: PopperProps;
		popperElement?: HTMLElement;
		menuItem?: Snippet<[{ item: T }]>;
	};

	const ButtonDemoValues: DemoerStoryProps<ButtonProps> = {
		type: {
			type: "string",
			values: ["button", "submit", "reset"],
			default: "button",
		},
		icon: {
			type: "icon",
			values: ["add", "user"],
			default: "add",
		},
		width: {
			type: "width",
			default: widthPreset.med,
		},
		tall: {
			type: "tall",
			default: densePreset.default,
		},
		bgTheme: {
			type: "theme",
			default: "primary",
		},
		variant: {
			type: "buttonVariant",
			default: buttonVariant.contained,
		},
		ellipsis: {
			type: "boolean",
			default: false,
		},
		selected: {
			type: "boolean",
			default: false,
		},
		reverse: {
			type: "boolean",
			default: false,
		},
		loading: {
			type: "boolean",
			default: false,
		},
	};

	export let { parameters, componentArgs } = demoerArgs(ButtonDemoValues);
</script>

<script lang="ts">
		import { popper} from '$lib/ui/popper/usePopper.js';
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
		}: import('./Button.svelte').ButtonProps = $props();

		let startRef: HTMLDivElement | undefined = $state<HTMLDivElement | undefined>(undefined);
  
</script>

<button
	class={className + ' slotui-button inline-flex items-center justify-center rounded-[var(--sld-button-radius)] text-[var(--sld-color-foreground)] transition-all overflow-hidden cursor-pointer relative'}
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


