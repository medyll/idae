<svelte:options accessors immutable={true} />

<script lang="ts">
	import { fade } from 'svelte/transition';

	import { sx4u } from '$lib/utils/uses/sx4u/sx4u.js';
	import { clickAway } from '$lib/utils/uses/clickAway/clickAway.js';
	import Panel from '$lib/ui/panel/Panel.svelte';
	import PanelSlide from '$lib/ui/panel/PanelSlide.svelte';

	import { toggleStartMenu, startMenuStore } from '$lib/utils/engine/wactions.utils.js';
	import { openWindow } from '$lib/ui/window/actions.js';
	import { afterUpdate, onMount, setContext, getContext } from 'svelte';

	import IconButton from '$lib/controls/button/IconButton.svelte';
	import { writable } from 'svelte/store';
	import Debug from '$lib/base/debug/Debug.svelte';

	const menuStore = writable<any>(null);

	let slideLeft: any;
	let slideRight: any;

	function toggleSlidePanels() {
		slideLeft.actions.toggle();
		slideRight.actions.toggle();

		menuStore.set({
			...$menuStore,
			open: !$menuStore?.open
		});
		setContext('PanelSlide', menuStore);
	}
</script>

{#if $startMenuStore}
	<div
		class="boot-menu"
		on:panel-button-clicked={toggleSlidePanels}
		transition:fade|global={{ duration: 50 }}
		use:sx4u={{ position: 'absolute', radius: 8, w: 96, h: 64 }}
		use:clickAway={{ action: toggleStartMenu }}
	>
		<div use:sx4u={{ p: 2, py: 2 }} style="margin-bottom:2rem">
			<input style="width: 100%;" type="search" placeholder="Recherche" />
		</div>
		<div style="position:relative" class="boot-menuContent">
			<PanelSlide open={true} bind:this={slideLeft}>
				<Panel title="Pinned Items">
					<div class="gridIcon">
						{#each [...Array(9)] as key, val}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								on:click={() => {
									openWindow('try ' + val, {
										component: Debug,
										componentProps: { some: 'props', someother: 'deprops' }
									});
								}}
								class="buttonPole"
							>
								key
							</div>
						{/each}
					</div>
				</Panel>
				<Panel title="Recent Items">
					<div class="gridIconBis">
						{#each [...Array(12)] as key}
							<div class="buttonPole">here</div>
						{/each}
					</div>
				</Panel>
				<Panel>
					<div class="gridOne">
						{#each [...Array(3)] as key}
							<div class="buttonPole">here</div>
						{/each}
					</div>
				</Panel>
			</PanelSlide>
			<PanelSlide open={false} bind:this={slideRight}>
				<Panel title="Zoom area">
					<div class="gridIconMid">
						{#each [...Array(130)] as key}
							<div class="buttonPole">here</div>
						{/each}
					</div>
				</Panel>
			</PanelSlide>
		</div>
		<div class="bottomBar">
			<IconButton style="color:white" icon="faBed" />
			<IconButton style="color:white" icon="faTruck" />
			<IconButton style="color:white" icon="faSign" />
		</div>
	</div>
{/if}

<style lang="scss">
	@import './boot-menu.scss';
</style>
