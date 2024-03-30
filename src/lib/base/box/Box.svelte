<script lang="ts">
	import TitleBar from '$lib/base/titleBar/TitleBar.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { CommonProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';

	let className = '';
	export { className as class };

	type Props = CommonProps & {
		element: HTMLDivElement;
		style: string;
		/** is the content visible */
		isOpen: boolean;
		/** show a working closer icon */
		showCloseControl: boolean;
		/** used to activate the slotui.TitleBar component */
		hasMenu: boolean;
		/** text to be shown in the title bar */
		title: string | undefined;
		/** alternative to iconSlot, icon to be used with the internat iconify component */
		icon: string | undefined;
		iconFamily: string | undefined;
		/** alternative to contentSlot,  content to be shown in the main area */
		content: string | undefined;
		/** alternative to slot.bottomZone, content to be shown in the bottom button zone */
		bottomZone: string | undefined;
		/** component actions
		 * @type {Record<'open'|'toggle' | 'close', Function>}
		 */
		actions: Record<'open' | 'toggle' | 'close', Function>;
		restProps: HTMLDivElement['attributes'];
		slots: {
			titleBarTitle: Snippet;
			titleBarIcon: Snippet;
			boxBottomZone: Snippet;
		};
	};

	let {
		element,
		style = '',
		isOpen = true,
		showCloseControl = true,
		hasMenu = false,
		title = undefined,
		icon = undefined,
		iconFamily = undefined,
		content = undefined,
		bottomZone = undefined,
		actions = {
			open,
			toggle,
			close
		},
		restProps = {},
		children,
		slots = { titleBarTitle: undefined, titleBarIcon: undefined, boxBottomZone: undefined }
	} = $props() as Props;

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
	<div bind:this={element} class="boxRoot shad-3 flex-v {className}" {style} {...restProps}>
		<TitleBar {hasMenu} {...closer}>
			{#if slots.titleBarTitle}
				{slots.titleBarTitle()}
			{:else}
				{title ?? ''}
			{/if}
			{#if slots?.titleBarIcon}
				{slots.titleBarIcon()}
			{:else if icon}
				<Icon {icon} {iconFamily} />
			{/if}
		</TitleBar>
		<div class="boxContent flex-main">
			{#if children}
				{@render children()}
			{:else if content}
				{@html content ?? ''}
			{/if}
		</div>
		<div class="boxButtonSlot">
			{#if slots.boxBottomZone}
				{@render slots.boxBottomZone()}
			{:else}
				{@html bottomZone ?? ''}
			{/if}
		</div>
	</div>
{/if}

<style global lang="scss">
	@import 'Box';
</style>
