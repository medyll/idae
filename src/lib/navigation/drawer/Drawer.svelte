<script lang="ts" generics="T">
	import IconButton from '$lib/controls/button/IconButton.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { DrawerProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ExpandProps } from '$lib/types/index.js';

	/** @deprecated use actions.toggle */
	export const actions = {
		toggle: (visibleSate?: boolean) => {
			isOpen = visibleSate !== undefined ? visibleSate : !isOpen;
		}
	};
	export function toggle(visibleSate?: boolean) {
		isOpen = visibleSate !== undefined ? visibleSate : !isOpen;
	}

	let {
		class: className = '',
		style,
		primary = undefined,
		secondary = undefined,
		icon,
		hideCloseIcon = $bindable(false),
		showOpenerIcon = false,
		element = $bindable(),
		isOpen = $bindable(true),
		flow = $bindable('fixed'),
		stickTo = $bindable('left'),
		defaultWidth = '288px',
		defaultVisibleArea = '0px',
		defaultHeight = '288px',
		drawerContent,
		drawerIcon,
		drawerTitle,
		drawerPrimary,
		drawerSecondary,
		drawerTop,
		drawerFooter,
		children,
		...rest
	}: ExpandProps<DrawerProps<T>> = $props();

	let dspStyle: string;

	const stickToStyle = {
		right: 'right:0;top:0;height:100%;height:100%;',
		left: 'left:0;top:0;bottom:0;height:100%;height:100%;',
		top: `left:0;right:0;top:0;height:${defaultHeight};`,
		bottom: `left:0;right:0;bottom:0;height:${defaultHeight};`
	};

	const openerIconStyle = {
		right: 'left:-16px;top:8px;',
		left: 'right:-16px;top:8px;',
		top: 'bottom:-16px;right:8px;',
		bottom: 'top:-16px;right:8px;'
	};

	let sensSuffix = '';
	let dimKeyVary: string;
	let widthStyle: string;
	let finalStyle: string = $state('');
	let sens: number = 0;
	$effect(() => {
		dimKeyVary = ['top', 'bottom'].includes(stickTo) ? 'height' : 'width';
		switch (stickTo) {
			case 'top':
				sensSuffix = isOpen ? 'up' : 'down';
				sens = isOpen ? 180 : 0;
				break;
			case 'right':
				sensSuffix = isOpen ? 'right' : 'left';
				sens = isOpen ? 180 : 0;
				break;
			case 'bottom':
				sensSuffix = isOpen ? 'down' : 'up';
				sens = isOpen ? 180 : 0;
				break;
			case 'left':
				sensSuffix = isOpen ? 'left' : 'right';
				sens = isOpen ? 180 : 0;
				break;
		}
	});

	$effect(() => {
		dspStyle = isOpen ? 'flex' : 'flex';
		widthStyle = isOpen ? defaultWidth : defaultVisibleArea;
		finalStyle = `display:${dspStyle};position:${flow};${stickToStyle[stickTo]};${dimKeyVary}:${widthStyle};${style};`;
	});
</script>

<div
	bind:this={element}
	class="drawer {className}"
	style={finalStyle}
	aria-expanded={isOpen}
	aria-orientation="vertical"
	{...rest}
>
	{#if showOpenerIcon}
		<div class="drawer-opener" style={openerIconStyle[stickTo]}>
			<IconButton
				--sld-button-radius="50%"
				icon={'chevron-right'}
				rotation={sens}
				style="cursor:pointer;"
				onclick={() => actions.toggle()}
			/>
		</div>
	{/if}
	{#if isOpen}
		{#if drawerTop || drawerIcon || Boolean(primary) || Boolean(icon)}
			<header class="drawer-header">
				{#if Boolean(icon) || drawerIcon}
					<div class="drawer-icon">
						<Slotted child={drawerIcon}>
							<Icon {icon} iconSize="medium" />
						</Slotted>
					</div>
				{/if}
				<div class="drawer-header-bar">
					<div class="drawer-header-bar-title">
						<Slotted child={drawerTitle}>
							<Slotted child={drawerPrimary}>
								{#if primary}
									<div style="font-size:18px;">{primary}</div>
								{/if}
							</Slotted>
							<Slotted child={drawerSecondary}>
								{#if secondary}
									<div>{secondary}</div>
								{/if}
							</Slotted>
						</Slotted>
					</div>
					<Slotted child={drawerTop}></Slotted>
				</div>
				{#if !hideCloseIcon && !showOpenerIcon}
					<Button
						onclick={() => {
							toggle();
						}}
						icon="window-close"
						variant="naked"
					/>
				{/if}
			</header>
		{/if}
		<div class="drawer-content">
			<Slotted child={drawerContent}>
				<Slotted child={children}></Slotted>
			</Slotted>
		</div>
		<footer>
			<Slotted child={drawerFooter}></Slotted>
		</footer>
	{/if}
</div>

<style global lang="scss">
	@import './drawer.scss';
</style>
