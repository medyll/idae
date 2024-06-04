<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
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
			<Slotted child={titleBarIcon}><Icon fontSize="small" {icon} /></Slotted>
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
		<Button onclick={onClose} variant="naked" icon="window-close" size="auto" />
	{/if}
</div>

<style global lang="scss">
	@import './title-bar.scss';
</style>
