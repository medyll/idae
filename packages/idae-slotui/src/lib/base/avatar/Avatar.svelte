/**
 * Avatar component
 *
 * Displays a user avatar with optional icon, size, and badge. Supports slot for custom content.
 *
 * @component
 * @example
 * <Avatar icon="mdi:user" size="medium" />
 */
<script module lang="ts">
	import { widthPreset, iconSize } from "$lib/types/index.js";
	import type { DemoerStoryProps } from "$lib/base/demoer/types.js";
	type EnumValueType<T> = T[keyof T];

	export enum statusPreset {
		success = "success",
		warning = "warning",
		alert = "alert",
		error = "error",
		info = "info",
		discrete = "discrete",
	}
	
	import type { CommonProps, ElementProps } from "$lib/types/index.js";
	import type { Snippet } from "svelte";
	import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";

	export interface AvatarProps {
		/**
		 * Icon name (Iconify string)
		 * @type {string}
		 */
		icon?: string;

		/**
		 * Size of the avatar
		 * @type {ElementProps["width"]}
		 */
		size?: ElementProps["width"];

		/**
		 * Size of the icon
		 * @type {ElementProps["iconSize"]}
		 */
		iconSize?: ElementProps["iconSize"];

		/**
		 * Reference to the avatar DOM element
		 * @type {HTMLElement}
		 */
		element?: HTMLElement;

		/**
		 * Custom class for the avatar
		 * @type {string}
		 */
		class?: string;

		/**
		 * Slot for custom avatar content
		 * @type {Snippet<[]>}
		 * @template []
		 */
		children?: Snippet<[]>;

		/**
		 * Slot for a badge displayed on the avatar
		 * @type {Snippet<[]>}
		 * @template []
		 */
		avatarBadge?: Snippet<[]>;
	}

	export const AvatarDemoValues: DemoerStoryProps<AvatarProps> = {
		icon: {
			type: "icon",
			default: "user",
		},
		size: {
			type: "width",
			default: widthPreset.med,
		},
		iconSize: {
			type: "iconSize",
			default: iconSize.medium,
		},
	};

	export let { parameters, componentArgs } = demoerArgs(AvatarDemoValues);
</script>

<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { ExpandProps } from '$lib/types/index.js'; 
	import Content from '$lib/utils/content/Content.svelte';

	let {
		icon = 'icon-park-outline:avatar',
		size,
		iconSize,
		class: className = '',
		element = $bindable(),
		children,
		avatarBadge,
		...rest
	}: AvatarProps = $props();

	const sizes = {
		tiny: '2rem',
		small: '4rem',
		medium: '8rem',
		large: '12rem',
		full: '100%'
	};
</script>

<Content
	bind:element
	tag="figure"
	class="avatar {className} relative grid place-items-center overflow-hidden border border-(--avatar-border-color) rounded-(--avatar-radius)"
	style="width:{sizes[size]};height:{sizes[size]}"
	{...rest}
>
	{#if avatarBadge}
		{@render avatarBadge()}
	{/if}

	{#if children}
		{@render children()}
	{:else}
		<Icon {icon} {iconSize} />
	{/if}
</Content>


