<script module lang="ts">
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the TitleBar component.
 * Represents a window or section title bar with icon, menu, and close support.
 */
export type TitleBarProps = {
	/** Title text for the title bar */
	title: string;
	/** Function to be called when the close button is clicked */
	readonly onClose?: () => void;
	/** Determines if the title bar has a menu */
	hasMenu?: boolean;
	/** Icon to be displayed in the title bar */
	icon?: ElementProps["icon"];
	/** Slot for the icon */
	titleBarIcon?: Snippet;
	/** Slot for the title */
	titleBarTitle?: Snippet;
	/** Slot for children content */
	children?: Snippet;
};
</script>
<script lang="ts">
		import Icon from '$lib/base/icon/Icon.svelte';
		import Button from '$lib/controls/button/Button.svelte';
		import IconButton from '$lib/controls/button/IconButton.svelte';
		import type { ExpandProps } from '$lib/types/index.js';
		import Slotted from '$lib/utils/slotted/Slotted.svelte';
		// TitleBarProps now in module script

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

<style global>
  @import './titleBar.css';
</style>
