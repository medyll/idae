<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { IconObj } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';

	type TitleBarProps = {
		/** Function to be called when the close button is clicked */
		onClose: () => void;

		/** Determines if the title bar has a menu */
		hasMenu: boolean;

		/** Icon to be displayed in the title bar */
		icon?: string | IconObj;
		title?: string;
		titleBarIcon?: Snippet;
		titleBarTitle?: Snippet;
		children?: Snippet;
	};

	let {
		onClose,
		hasMenu = false,
		icon = undefined,
		title,
		titleBarIcon,
		titleBarTitle
	}: TitleBarProps = $props();
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
