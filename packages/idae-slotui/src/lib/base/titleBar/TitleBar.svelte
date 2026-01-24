<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import IconButton from '$lib/controls/button/IconButton.svelte';
	import type { ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { TitleBarProps } from './types.js';

	let {
		onClose,
		hasMenu = false,
		icon,
		title,
		titleBarIcon,
		titleBarTitle
	}: ExpandProps<TitleBarProps> = $props();
</script>

<div class="title-bar">
	<div class="title-bar-content">
		<div class="title-bar-content-icon">
			<Slotted child={titleBarIcon}><Icon iconSize="small" {icon} /></Slotted>
		</div>
		<div class="title-bar-content-title">
			<Slotted child={titleBarTitle}>
				{title}
			</Slotted>
		</div>
	</div>
	{#if hasMenu}
		<div class="title-bar-menu">
			<!--<ButtonAction/>-->
		</div>
	{/if}
	{#if Boolean(onClose)}
		<IconButton onclick={onClose} variant="naked" icon="window-close" width={'mini'} />
	{/if}
</div>

<style global lang="scss">
	@use './title-bar.scss';
</style>
