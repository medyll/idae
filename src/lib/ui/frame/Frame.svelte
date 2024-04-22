<svelte:options accessors />

<script lang="ts">
	import Drawer from '$lib/navigation/drawer/Drawer.svelte';
	import type { DrawerProps } from '$lib/navigation/drawer/types.js';

	const defaultDrawerProps: DrawerProps = {
		isOpen: false,
		hideCloseIcon: true,
		showOpenerIcon: true,
		stickTo: 'left',
		flow: 'relative',
		defaultWidth: '200px'
	};
	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;

	export let style: string = '';
	export let elementNav: HTMLDivElement | null = null;
	export let frameDrawerRef: typeof Drawer = null;

	export let hideCloseIcon: boolean = true;
	export let showOpenerIcon: boolean = true;

	export let drawerWidth: string = '200px';

	export let drawerProps: DrawerProps = { ...defaultDrawerProps };

	let menuOpen = true;

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

<div bind:this={element} class="frame {className}" {style}>
	<div class="frame-container">
		<div bind:this={elementNav} class="navLeft">
			{#if frameDrawerRef?.isOpen}
				<slot name="navLeftHeaderFrameSlot" />
			{/if}
			<Drawer
				bind:this={frameDrawerRef}
				{hideCloseIcon}
				bind:isOpen={menuOpen}
				style="flex:1;position:relative;"
				defaultWidth={drawerWidth}
				{showOpenerIcon}
				{...defaultDrawerProps}
				{...drawerProps}
			>
				<slot name="drawerTop" slot="drawerTop" />
				<slot name="drawerContent" />
			</Drawer>
		</div>
		<div class="frame-container-main">
			<slot name="frameTop" />
			<div class="frame-container-main-content">
				<slot name="content" />
			</div>
			<slot name="frameBottom" />
		</div>
	</div>
</div>

<style global lang="scss">
	@import './frame.scss';
</style>
