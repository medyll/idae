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

<style global lang="scss">
	@use './box.scss';
</style>
