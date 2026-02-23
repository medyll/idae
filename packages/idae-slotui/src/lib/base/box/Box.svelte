<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the Box component.
 * Represents a container with optional title bar, icon, content, and actions.
 */
export interface BoxProps extends CommonProps {
	/** Reference to the root box element */
	element?: HTMLDivElement;
	/** Inline style for the box */
	style?: string;
	/** Whether the box content is visible */
	isOpen: boolean;
	/** Show a close control button */
	showCloseControl: boolean;
	/** Activate the slotted TitleBar component */
	hasMenu: boolean;
	/** Title text for the box */
	title: string;
	/** Icon name for the box (used with Iconify) */
	icon: string;
	/** Main content for the box */
	content: string;
	/** Content for the bottom button zone */
	bottomZone?: string;
	/** Slot for children content */
	children?: Snippet;
	/** Slot for the bottom zone */
	boxBottomZone?: Snippet;
	/** Slot for the title bar title */
	titleBarTitle?: Snippet;
	/** Slot for the title bar icon */
	titleBarIcon?: Snippet;
}
</script>
<script lang="ts">
	import TitleBar from '$lib/base/titleBar/TitleBar.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ExpandProps } from '$lib/types/index.js';
	import Content from '$lib/utils/content/Content.svelte';

	/** box actions */
	export const actions = {
		open,
		toggle,
		close
	};

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		isOpen = $bindable(true),
		showCloseControl = true,
		hasMenu = false,
		title,
		icon,
		content,
		bottomZone,
		children,
		titleBarTitle,
		titleBarIcon,
		boxBottomZone,
		...rest
	}: ExpandProps<BoxProps> = $props();

	function open() {
		isOpen = true;
	}
	function toggle() {
		isOpen = !isOpen;
	}
	function close() {
		isOpen = false;
	}

	let closer = !showCloseControl ? {} : { onClose: () => actions.close() };
</script>

{#if isOpen}
	<Content bind:element class="box {className}" {style} {...rest}>
		<TitleBar {hasMenu} {...closer}>
			<Slotted child={titleBarTitle}>
				{title ?? ''}
			</Slotted>
			<Slotted child={titleBarIcon}>
				{#if icon}
					<Icon {icon} />
				{/if}
			</Slotted>
		</TitleBar>
		<div class="box-content">
			<Slotted child={children}>
				{@html content ?? ''}
			</Slotted>
		</div>
		<div class="box-button-zone">
			<Slotted child={boxBottomZone}>
				{@html bottomZone ?? ''}
			</Slotted>
		</div>
	</Content>
{/if}

<style global>
  @import './box.css';
</style>
