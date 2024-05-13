<script lang="ts">
	import TitleBar from '$lib/base/titleBar/TitleBar.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { BoxProps } from './types.js';

	let className = '';
	export { className as class };

	let {
		element,
		style = '',
		isOpen = $bindable(true),
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
		children,
		titleBarTitle,
		titleBarIcon,
		boxBottomZone,
		...rest
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
	<div bind:this={element} class="box {className}" {style} {...rest}>
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

<style lang="scss">
	@import './box.scss';
</style>
