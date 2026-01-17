<script lang="ts">
	import TitleBar from '$lib/base/titleBar/TitleBar.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { BoxProps } from './types.js';
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
	<Content
		bind:element
		class="min-h-[160px] min-w-[320px] bg-background border-b border-primary rounded-[var(--box-radius)] shadow-[var(--box-elevation)] flex flex-col {className}"
		{style}
		{...rest}
	>
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
		<div class="flex-1">
			<Slotted child={children}>
				{@html content ?? ''}
			</Slotted>
		</div>
		<div class="flex gap-[var(--box-gap)] p-[var(--box-pad)] text-right justify-end">
			<Slotted child={boxBottomZone}>
				{@html bottomZone ?? ''}
			</Slotted>
		</div>
	</Content>
{/if}


