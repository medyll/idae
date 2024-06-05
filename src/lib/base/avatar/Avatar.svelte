<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { CommonProps, ExpandProps } from '$lib/types/index.js';
	import type { AvatarProps } from './types.js';

	let {
		icon = 'icon-park-outline:avatar',
		size,
		iconSize,
		class: className = '',
		element = $bindable<HTMLElement>(),
		children,
		avatarBadge
	}: ExpandProps<AvatarProps> = $props();

	const sizes = {
		tiny: '2rem',
		small: '4rem',
		medium: '8rem',
		large: '12rem',
		full: '100%'
	};
</script>

<figure
	bind:this={element}
	class="avatar {className}"
	style="width:{sizes[size]};height:{sizes[size]}"
>
	{#if avatarBadge}
		{@render avatarBadge()}
	{/if}
	{#if children}
		{@render children()}
	{:else}
		<Icon {icon} {iconSize} />
	{/if}
</figure>

<style lang="scss">
	@import './avatar.scss';
</style>
