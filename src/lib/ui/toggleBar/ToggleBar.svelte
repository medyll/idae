<script lang="ts">
	import ContentSwitcher from '$lib/base/contentSwitcher/ContentSwitcher.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { CommonProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slot/Slotted.svelte';

	type ToggleBarProps = CommonProps & {
		/** title of the toggle bar */
		title: string | undefined;

		/** icon of the toggle bar */
		icon: string | undefined;

		/** orientation of the toggle bar */
		orientation: 'right' | 'left';

		/** icon of the content switcher */
		contentSwitcherIcon: string;
	};

	let {
		class: className = '',
		style = '',
		title,
		icon,
		contentSwitcherIcon = 'search',
		orientation = $bindable('right'),
		element = $bindable(),
		children,
		slots = {},
		...rest
	}: ToggleBarProps = $props();

	const posTitle = orientation === 'right' ? 1 : 3;
	const posCloser = orientation === 'right' ? 3 : 1;
</script>

<div bind:this={element} class="toggle-bar {className}" {style} {...rest}>
	{#if slots.toggleBarIcon || icon}
		<div class="pad">
			<Slotted slotted={slots.toggleBarIcon}>
				<Icon {icon} />
			</Slotted>
		</div>
	{/if}
	<div class="title flex-main text-500" style="order:{posTitle};min-width:auto;flex:1;">
		{#if slots.toggleBarTitle || Boolean(title)}
			<Slotted slotted={slots.toggleBarTitle}>
				<div
					style="font-size:18px;min-width:auto;overflow:hidden;height:100%;"
					class="flex flex-align-middle overflow-hidden text-ellipsis"
				>
					<h5 class="text-ellipsis">{title}</h5>
				</div>
			</Slotted>
		{/if}
	</div>
	<div class="toggle-bar-content" style="order:2;">
		<Slotted slotted={slots.toggleBarButtons} />
	</div>
	<div style="order:{posCloser}">
		<ContentSwitcher parent={element} icon={contentSwitcherIcon}>
			<!-- <slot slot="contentSwitcherIcon" name="contentSwitcherIcon" />
			<slot slot="contentSwitcherReveal" name="contentSwitcherReveal" /> -->
			<Slotted slotted={slots.contentSwitcherIcon} />
			<Slotted slotted={slots.contentSwitcherReveal} />
		</ContentSwitcher>
	</div>
</div>

<style lang="scss">
	@import './toggle-bar.scss';
</style>
