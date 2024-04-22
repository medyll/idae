<script lang="ts">
	import TitleBar from '$lib/base/titleBar/TitleBar.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { CommonProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';
	import Slotted from '$lib/utils/slot/Slotted.svelte';

	let className = '';
	export { className as class };

	type BoxProps = CommonProps & {
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
		/** alternative to contentSlot,  content to be shown in the main area */
		content: string | undefined;
		/** alternative to slot.bottomZone, content to be shown in the bottom button zone */
		bottomZone: string | undefined;
		/** component actions
		 * @type {Record<'open'|'toggle' | 'close', Function>}
		 */
		actions: Record<'open' | 'toggle' | 'close', Function>;
		boxBottomZone?: Snippet;
		titleBarTitle?: Snippet;
		titleBarIcon?: Snippet;
		slots?: {
			boxBottomZone: Snippet;
			titleBarTitle: Snippet;
			titleBarIcon: Snippet;
		};
		restProps: HTMLDivElement['attributes'];
	};

	let {
		element,
		style = '',
		isOpen = true,
		showCloseControl = true,
		hasMenu = false,
		title = undefined,
		icon = undefined,
		content = undefined,
		bottomZone = undefined,
		actions = {
			open,
			toggle,
			close
		},
		restProps = {},
		children,
		titleBarTitle,
		titleBarIcon,
		boxBottomZone
	} = $props() as BoxProps;

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
	<div bind:this={element} class="box {className}" {style} {...restProps}>
		<TitleBar {hasMenu} {...closer}>
			<Slotted child={titleBarTitle}>
				<slot name="titleBarTitle">{title ?? ''}</slot>
			</Slotted>
			<Slotted child={titleBarIcon}>
				<slot name="titleBarIcon">
					{#if icon}
						<Icon {icon} />
					{/if}
				</slot>
			</Slotted>
		</TitleBar>
		<div class="box-content">
			<Slotted child={children}>
				<slot>{@html content ?? ''}</slot>
			</Slotted>
		</div>
		<div class="box-button-zone">
			<Slotted child={boxBottomZone}>
				<slot name="boxBottomZone">{@html bottomZone ?? ''}</slot>
			</Slotted>
		</div>
	</div>
{/if}

<style global lang="scss">
	@import './box.scss';
</style>
