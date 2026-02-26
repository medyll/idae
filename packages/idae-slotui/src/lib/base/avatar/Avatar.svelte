<script module lang="ts" >
import type { Snippet } from "svelte";
import type {  ElementProps } from '$lib/types/index.js';
import Icon from '$lib/base/icon/Icon.svelte';
import type { ExpandProps } from '$lib/types/index.js'; 
import Content from '$lib/utils/content/Content.svelte';

export interface AvatarProps    {
  /** icon name 	*/
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
};

</script>

<script lang="ts">

	let {
		icon = 'icon-park-outline:avatar',
		size = 'med',
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
	class="avatar {className}"
	style="width:{sizes[size]};height:{sizes[size]}"
	{...rest}
>
	{@render avatarBadge?.()}

	{#if children}
		{@render children()}
	{:else}
		<Icon {icon} {iconSize} />
	{/if}
</Content>

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--avatar-radius: var(--sld-radius-round);
		--avatar-size: var(--sld-size-avatar);
		--avatar-border: var(--sld-color-border);
		--avatar-bg: var(--sld-color-background);
	}

	.avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--avatar-radius);
		width: var(--avatar-size);
		height: var(--avatar-size);
		border: 2px solid var(--avatar-border);
		background-color: var(--avatar-bg);
		overflow: hidden;
	}
	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--avatar-radius);
	}
	.avatar .initials {
		font-weight: bold;
		color: var(--sld-color-text);
		font-size: calc(var(--avatar-size) * 0.4);
	}
</style>
