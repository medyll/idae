<svelte:options immutable={true} />

<script module lang="ts">
// Module-level Props marker for migration tooling
export type BootMenuProps = Record<string, unknown>;
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';

	import { sx4u } from '$lib/utils/uses/sx4u/sx4u.js';
	import { clickAway } from '$lib/utils/uses/clickAway/clickAway.js';
	import Panel from '$lib/ui/panel/Panel.svelte';
	import PanelSlide from '$lib/ui/panel/PanelSlide.svelte';

	import { toggleStartMenu, startMenuStore } from '$lib/utils/engine/wactions.utils.js';
	import { openWindow } from '$lib/ui/window/actions.svelte.js';
	import { setContext } from 'svelte';

	import IconButton from '$lib/controls/buttonIcon/ButtonIcon.svelte';
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

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--boot-menu-background-color: rgba(90, 67, 52, 0.9);
		--boot-menu-backdrop-filter: blur(10px);
		--boot-menu-color: white;
		--boot-menu-max-height: 600px;
		--boot-menu-height: 80%;
		--boot-menu-box-shadow: 0px 0px 3px 1px rgba(51, 51, 51, 0.5);
		--boot-menu-z-index: 3000;
		--boot-menu-margin-top: 1rem;
		--boot-menu-button-pole-border-radius: var(--sld-radius-small);
		--boot-menu-button-pole-border: 1px solid rgba(208, 191, 151, 0.3);
		--boot-menu-button-pole-padding: var(--sld-pad-tiny);
		--boot-menu-grid-icon-gap: 10px;
		--boot-menu-grid-icon-template-columns: repeat(auto-fill, minmax(30%, auto));
		--boot-menu-grid-icon-bis-template-columns: repeat(auto-fill, minmax(15%, auto));
		--boot-menu-grid-icon-mid-template-columns: repeat(auto-fill, minmax(49%, auto));
		--boot-menu-grid-one-template-columns: repeat(auto-fill, minmax(100%, auto));
		--boot-menu-bottom-bar-box-shadow: 0px 0px 3px 1px rgba(51, 51, 51, 0.5);
		--boot-menu-bottom-bar-padding: var(--sld-pad-small) var(--sld-pad-medium);
	}

	.boot-menu {
		background-color: var(--boot-menu-background-color);
		backdrop-filter: var(--boot-menu-backdrop-filter);
		color: var(--boot-menu-color);
		display: flex;
		flex-direction: column;
		max-height: var(--boot-menu-max-height);
		height: var(--boot-menu-height);
		left: 50%;
		transform: translate(-50%, 0);
		box-shadow: var(--boot-menu-box-shadow);
		overflow: hidden;
		z-index: var(--boot-menu-z-index);
		position: absolute;
		margin-top: var(--boot-menu-margin-top);

		& .boot-menuContent {
			flex: 1;
			overflow-y: auto;
			overflow-x: hidden;
		}

		& .buttonPole {
			border-radius: var(--boot-menu-button-pole-border-radius);
			border: var(--boot-menu-button-pole-border);
			padding: var(--boot-menu-button-pole-padding);
		}

		& .gridIcon {
			width: 100%;
			display: grid;
			grid-gap: var(--boot-menu-grid-icon-gap);
			grid-template-columns: var(--boot-menu-grid-icon-template-columns);
		}

		& .gridIconBis {
			width: 100%;
			display: grid;
			grid-gap: var(--boot-menu-grid-icon-gap);
			grid-template-columns: var(--boot-menu-grid-icon-bis-template-columns);
		}

		& .gridIconMid {
			width: 100%;
			display: grid;
			grid-gap: var(--boot-menu-grid-icon-gap);
			grid-template-columns: var(--boot-menu-grid-icon-mid-template-columns);
		}

		& .gridOne {
			width: 100%;
			display: grid;
			grid-gap: var(--boot-menu-grid-icon-gap);
			grid-template-columns: var(--boot-menu-grid-one-template-columns);
		}

		& .bottomBar {
			box-shadow: var(--boot-menu-bottom-bar-box-shadow);
			display: flex;
			align-items: end;
			padding: var(--boot-menu-bottom-bar-padding);
		}
	}
</style>
