<svelte:options runes={true} />

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { CommonProps } from '$lib/types/index.js';

	type Props = CommonProps & {
		/** icon name 	*/
		icon?: string;
		/**
		 * size of the avatar
		 * @type {'tiny' | 'small' | 'medium' | 'large' | 'full'}
		 */
		size?: 'tiny' | 'small' | 'medium' | 'large' | 'full';
		/**
		 * size of the icon
		 * @type {'tiny' | 'small' | 'medium' | 'large' | 'full'}
		 */
		iconSize?: 'tiny' | 'small' | 'medium' | 'default' | 'large' | 'big';
		element?: HTMLDivElement;
		class?: string;
		children?: Snippet;
		avatarBadge?: Snippet;
	};

	let {
		icon = 'icon-park-outline:avatar',
		size,
		iconSize,
		class: className = '',
		element = $bindable<HTMLDivElement>(),
		children,
		avatarBadge
	} = $props() as Props;

	const sizes = {
		tiny: '2rem',
		small: '4rem',
		medium: '8rem',
		large: '12rem',
		full: '100%'
	};
</script>

<div
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
		<Icon {icon} fontSize={iconSize} />
	{/if}
</div>

<style lang="scss">
	@import './avatar.scss';
</style>
