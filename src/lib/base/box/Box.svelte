<script lang="ts">
	import TitleBar from '$lib/base/titleBar/TitleBar.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { BoxProps } from './types.js';

	let className = '';
	export { className as class };

	let {
		element = $bindable(),
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
			<!-- <slot name="titleBarTitle">{title ?? ''}</slot> -->
			<Slotted child={titleBarTitle}>
				{title ?? ''}
			</Slotted>

			<!-- <slot name="titleBarIcon">
					{#if icon}
						<Icon {icon} />
					{/if}
				</slot> -->
			<Slotted child={titleBarIcon}>
				{#if icon}
					<Icon {icon} />
				{/if}
			</Slotted>
		</TitleBar>
		<div class="box-content">
			<!-- <slot>{@html content ?? ''}</slot> -->
			<Slotted child={children}>
				{@html content ?? ''}
			</Slotted>
		</div>
		<div class="box-button-zone">
			<!-- <slot name="boxBottomZone">{@html bottomZone ?? ''}</slot> -->
			<Slotted child={boxBottomZone}>
				{@html bottomZone ?? ''}
			</Slotted>
		</div>
	</div>
{/if}

<style lang="scss">
	@import './box.scss';
</style>
