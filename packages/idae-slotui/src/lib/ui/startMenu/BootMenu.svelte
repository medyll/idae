<svelte:options immutable={true} />

<script lang="ts">
	import { fade } from 'svelte/transition';

	import { sx4u } from '$lib/utils/uses/sx4u/sx4u.js';
	import { clickAway } from '$lib/utils/uses/clickAway/clickAway.js';
	import Panel from '$lib/ui/panel/Panel.svelte';
	import PanelSlide from '$lib/ui/panel/PanelSlide.svelte';

	import { toggleStartMenu, startMenuStore } from '$lib/utils/engine/wactions.utils.js';
	import { openWindow } from '$lib/ui/window/actions.svelte.js';
	import { setContext } from 'svelte';

	import IconButton from '$lib/controls/button/IconButton.svelte';
	import { writable } from 'svelte/store';
	import Debug from '$lib/base/debug/Debug.svelte';
	import { onEvent } from '$lib/utils/uses/event.js';

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
		transition:fade|global={{ duration: 50 }}
		use:sx4u={{ position: 'absolute', radius: 8, w: 96, h: 64 }}
		use:clickAway={{ action: toggleStartMenu }}
		use:onEvent={{ event: 'panel-button-clicked', action: toggleSlidePanels }}
	>
		<div use:sx4u={{ p: 2, py: 2 }} style="margin-bottom:2rem">
			<input style="width: 100%;" type="search" placeholder="Recherche" />
		</div>
		<div style="position:relative" class="boot-menuContent">
			<PanelSlide open={true} bind:this={slideLeft}>
				<Panel title="Pinned Items">
					<div class="gridIcon">
						{#each [...Array(9)] as key, val}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								onclick={() => {
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

<style global lang="css">
  @import './boot-menu.css';
</style>
