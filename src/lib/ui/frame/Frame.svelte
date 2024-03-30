<svelte:options accessors />

<script lang="ts">
	import Drawer from '$lib/navigation/drawer/Drawer.svelte';

	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;

	export let style: string = '';
	export let elementNav: HTMLDivElement | null = null;
	export let frameDrawerRef: typeof Drawer = null;

	export let hideCloseIcon: boolean = true;
	export let showOpenerIcon: boolean = true;

	export let drawerWidth: string = '200px';

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

<div bind:this={element} class="pos-rel flex-v h-full overflow-hidden frame {className}" {style}>
	<div class="frame-container">
		<div bind:this={elementNav} class="navLeft pos-rel flex-v h-full">
			{#if frameDrawerRef?.isOpen}
				<slot name="navLeftHeaderFrameSlot" />
			{/if}
			<Drawer
				bind:this={frameDrawerRef}
				{hideCloseIcon}
				bind:isOpen={menuOpen}
				flow="relative"
				stickTo="left"
				style="flex:1;position:relative;"
				defaultWidth={drawerWidth}
				{showOpenerIcon}
			>
				<slot name="drawerTop" slot="drawerTop" />
				<slot name="drawerContent" />
			</Drawer>
		</div>
		<div class="frame-main">
			<slot name="frameTop" />
			<div class=" frame-content">
				<slot name="content" />
			</div>
			<slot name="frameBottom" />
		</div>
	</div>
</div>

<style global lang="scss">
	@import './frame.scss';
</style>
