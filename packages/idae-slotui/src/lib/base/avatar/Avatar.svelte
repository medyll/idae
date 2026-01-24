<script module lang="ts" >
import type { Snippet } from "svelte";
import type { CommonProps,ElementProps } from '$lib/types/index.js';

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

<style global>
	@import './avatar.scss';
</style>
