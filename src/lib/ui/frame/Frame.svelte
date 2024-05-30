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
				<!-- <slot name="frameNavHeader" /> -->
				<Slotted child={frameNavHeader}></Slotted>
			{/if}
			<Drawer
				bind:this={frameDrawerRef}
				bind:isOpen={menuOpen}
				style="flex:1;position:relative;"
				defaultWidth={drawerWidth}
				{...defaultDrawerProps}
				{...drawerProps}
			>
				<!-- <slot name="drawerIcon" slot="drawerIcon">
				</slot> -->
				<Slotted child={drawerProps?.drawerIcon ?? drawerIcon} />
				<!-- <slot name="drawerFooter" slot="drawerFooter">
				</slot> -->
				<Slotted child={drawerProps?.drawerFooter ?? drawerFooter} />
				<!-- <slot name="drawerTitle" slot="drawerTitle">
				</slot> -->
				<Slotted child={drawerProps?.drawerTitle ?? drawerTitle} />
				<!-- <slot name="drawerPrimary" slot="drawerPrimary">
				</slot> -->
				<Slotted child={drawerProps?.drawerPrimary ?? drawerPrimary} />
				<!-- <slot name="drawerSecondary" slot="drawerSecondary">
				</slot> -->
				<Slotted child={drawerProps?.drawerSecondary ?? drawerSecondary} />
				<!-- <slot name="drawerTop" slot="drawerTop">
				</slot> -->
				<Slotted child={drawerProps?.drawerTop ?? drawerTop} />
				<!-- <slot name="drawerContent">
				</slot> -->
				<Slotted child={drawerContent} />
			</Drawer>
		</div>
		<div class="frame-container-main">
			<!-- <slot name="frameTop" /> -->
			<Slotted child={frameTop}></Slotted>
			<!--  <slot name="content" /> -->
			<div class="frame-container-main-content"></div>
			<!-- <slot name="frameBottom" /> -->
			<Slotted child={frameBottom}></Slotted>
		</div>
	</div>
</div>

<style global lang="scss">
	@import './frame.scss';
</style>
