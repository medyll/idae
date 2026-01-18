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
		/** icon name  */
		icon?: string;
		/**
		 * size of the avatar
		 */
		size?: ElementProps["width"];
		/**
		 * size of the icon
		 */
		iconSize?: ElementProps["iconSize"];
		element?: HTMLElement;
		class?: string;
		children?: Snippet;
		avatarBadge?: Snippet;
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


