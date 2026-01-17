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

<div class="title-bar flex flex-row items-center border-b border-[var(--title-bar-color-border-bottom)]">
	<div class="title-bar-content flex flex-row items-center gap-[var(--title-bar-gap)] min-h-[34px] flex-1">
		<div class="title-bar-content-icon p-[var(--title-bar-pad)]">
			<Slotted child={titleBarIcon}><Icon iconSize="small" {icon} /></Slotted>
		</div>
		<div class="title-bar-content-title flex-1">
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


