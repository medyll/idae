<svelte:options accessors />

<script lang="ts">
	import Drawer from '$lib/navigation/drawer/Drawer.svelte';
	import type { DrawerProps } from '$lib/navigation/drawer/types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { FrameProps } from './types.js';

	const defaultDrawerProps: DrawerProps = {
		isOpen: false,
		hideCloseIcon: true,
		showOpenerIcon: true,
		stickTo: 'left',
		flow: 'relative',
		defaultWidth: '200px'
	};

	let {
		class: className = '',
		element = $bindable<HTMLDivElement>(),
		frameDrawerRef,
		elementNav,
		style = '',
		drawerWidth = '200px',
		drawerProps = { ...defaultDrawerProps },
		children,
		frameNavHeader,
		drawerTop,
		drawerContent,
		drawerFooter,
		drawerTitle,
		drawerIcon,
		drawerPrimary,
		drawerSecondary,
		frameTop,
		frameBottom,
		...rest
	}: FrameProps = $props();

	let menuOpen = $state(true);

	export const actions = {
		openNavLeft: () => {
			menuOpen = true;
		},
		toggleNavLeft: () => {
			menuOpen = !menuOpen;
		},
		closeNavLeft: () => {
			menuOpen = !menuOpen;
		}
	};
</script>

<div bind:this={element} class="frame {className}" {style} {...rest}>
	<div class="frame-container">
		<div bind:this={elementNav} class="frame-container-nav">
			{#if frameDrawerRef?.isOpen}
				<Slotted child={frameNavHeader}>
					<slot name="frameNavHeader" />
				</Slotted>
			{/if}
			<Drawer
				bind:this={frameDrawerRef}
				bind:isOpen={menuOpen}
				style="flex:1;position:relative;"
				defaultWidth={drawerWidth}
				{...defaultDrawerProps}
				{...drawerProps}
			>
				<slot name="drawerIcon" slot="drawerIcon">
					<Slotted child={drawerProps?.drawerIcon ?? drawerIcon} />
				</slot>
				<slot name="drawerFooter" slot="drawerFooter">
					<Slotted child={drawerProps?.drawerFooter ?? drawerFooter} />
				</slot>
				<slot name="drawerTitle" slot="drawerTitle">
					<Slotted child={drawerProps?.drawerTitle ?? drawerTitle} />
				</slot>
				<slot name="drawerPrimary" slot="drawerPrimary">
					<Slotted child={drawerProps?.drawerPrimary ?? drawerPrimary} />
				</slot>
				<slot name="drawerSecondary" slot="drawerSecondary">
					<Slotted child={drawerProps?.drawerSecondary ?? drawerSecondary} />
				</slot>
				<slot name="drawerTop" slot="drawerTop">
					<Slotted child={drawerProps?.drawerTop ?? drawerTop} />
				</slot>
				<slot name="drawerContent">
					<Slotted child={drawerContent} />
				</slot>
			</Drawer>
		</div>
		<div class="frame-container-main">
			<Slotted child={frameTop}><slot name="frameTop" /></Slotted>
			<div class="frame-container-main-content">
				<slot name="content" />
			</div>
			<Slotted child={frameBottom}><slot name="frameBottom" /></Slotted>
		</div>
	</div>
</div>

<style global lang="scss">
	@import './frame.scss';
</style>
