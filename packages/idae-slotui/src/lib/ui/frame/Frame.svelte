<svelte:options />

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
		frameContent,
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
				<Slotted child={drawerProps?.drawerIcon ?? drawerIcon} />
				<Slotted child={drawerProps?.drawerFooter ?? drawerFooter} />
				<Slotted child={drawerProps?.drawerTitle ?? drawerTitle} />
				<Slotted child={drawerProps?.drawerPrimary ?? drawerPrimary} />
				<Slotted child={drawerProps?.drawerSecondary ?? drawerSecondary} />
				<Slotted child={drawerProps?.drawerTop ?? drawerTop} />
				<Slotted child={drawerContent} />
			</Drawer>
		</div>
		<div class="frame-container-main">
			<Slotted child={frameTop}></Slotted>

			<div class="frame-container-main-content">
				<Slotted child={frameContent}></Slotted>
			</div>
			<Slotted child={frameBottom}></Slotted>
		</div>
	</div>
</div>

<style global lang="postcss">
	@reference "tailwindcss";
	@import './frame.css';
</style>
