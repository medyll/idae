 
<script lang="ts">
	import ContentSwitcher from '$lib/base/contentSwitcher/ContentSwitcher.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ToggleBarProps } from './types.js';

	let {
		class: className = '',
		style,
		title,
		icon,
		contentSwitcherProps = {
			icon: 'search'
		},
		orientation = $bindable('right'),
		element = $bindable(),
		toggleBarIcon,
		toggleBarTitle,
		toggleBarButtons,
		contentSwitcherReveal,
		contentSwitcherIcon,
		children,
		...rest
	}: ToggleBarProps = $props();

	const posTitle = orientation === 'right' ? 1 : 3;
	const posCloser = orientation === 'right' ? 3 : 1;
</script>

<div bind:this={element} class="toggle-bar {className}" {style} {...rest}>
	{#if toggleBarIcon || icon}
		<div class="toggle-bar-icon">
			<Slotted child={toggleBarIcon}>
				<Icon {icon} />
			</Slotted>
		</div>
	{/if}
	<div class="toggle-bar-title" style="order:{posTitle};">
		{#if toggleBarTitle || Boolean(title)}
			<Slotted child={toggleBarTitle}>
				<div class="toggle-bar-title-content">
					<h5 class="text-ellipsis">{title}</h5>
				</div>
			</Slotted>
		{/if}
	</div>
	<div class="toggle-bar-content" style="order:2;">
		<Slotted child={toggleBarButtons} />
	</div>
	<div style="order:{posCloser}">
		<ContentSwitcher parent={element} {...contentSwitcherProps}>
			<Slotted child={contentSwitcherIcon} />
			<Slotted child={contentSwitcherReveal} />
		</ContentSwitcher>
	</div>
</div>

<style lang="scss">
	@use '../../slotui-css/toggleBar.tailwind.css';
</style>
