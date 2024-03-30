<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { sx4u } from '$lib/utils/uses/sx4u/sx4u';
	import { clickAway } from '$lib/utils/uses/clickAway/clickAway';
	import Paneler from '$lib/ui/panel/Paneler.svelte';
	import Panel from '$lib/ui/panel/Panel.svelte';
	import PanelGrid from '$lib/ui/panel/PanelGrid.svelte';
	import PanelSlide from '$lib/ui/panel/PanelSlide.svelte';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import { toggleStarter, starterStore } from './actions.js';

	import IconButton from '$lib/base/button/IconButton.svelte';
	import { writable } from 'svelte/store';
	import Debug from '$lib/base/debug/Debug.svelte';
	import Input from '$lib/form/input/Input.svelte';
</script>

<div />
<Popper autoClose position={'BC'} isOpen={$starterStore}>
	<div class="startMenu" transition:fade|global={{ duration: 50 }}>
		<div style="margin-bottom:2rem" class="pad-2">
			<Input style="width: 100%;" size="full" type="search" placeholder="Recherche" value="" />
		</div>
		<div style="position:relative" class="startMenuContent">
			<Paneler>
				<PanelSlide panelSlideId="source" open={true}>
					<Panel data={{ some: 'data' }} title="Pinned Items">
						<PanelGrid data={[...Array(9)]} let:data>
							<div class="buttonPole">Pinned</div>
							<div slot="zoomSlot" class="pad-4">Pinned large</div>
						</PanelGrid>
					</Panel>
					<Panel title="Recent Items">
						<PanelGrid data={[...Array(12)]} columns={6}>
							<div class="buttonPole">Recent</div>
						</PanelGrid>
					</Panel>
					<Panel title="Other Items">
						<PanelGrid data={[...Array(7)]} columns={2}>
							<div class="buttonPole">Others</div>
						</PanelGrid>
					</Panel>
				</PanelSlide>
				<PanelSlide panelSlideId="target" let:panelSlideId open={false} let:data>
					<Panel title="Zoom area">
						<div class="slotUiGrid" style="gap:0.5rem">
							{#each [...Array(130)] as key}
								<div class="buttonPole">here {panelSlideId}</div>
							{/each}
						</div>
					</Panel>
				</PanelSlide>
				<PanelSlide let:panelSlideId open={false}>
					<Panel title="Zoom area">on more</Panel>
				</PanelSlide>
			</Paneler>
		</div>
		<div class="bottomBar flex-h flex-align-right pad-tb-1 pad-ii-4">
			<IconButton style="color:white" icon="mdi:quit" />
		</div>
	</div>
</Popper>

<style lang="scss">
	.boot-menu {
		// background-color: rgba(90, 67, 52, 0.9);
		// color: white;
		backdrop-filter: blur(10px);
		display: flex;
		flex-direction: column;
		height: 600px;
		width: 530px;
		box-shadow: 0px 0px 3px 1px rgba(51, 51, 51, 0.5);
		overflow: hidden;
		z-index: 3000;

		.boot-menuContent {
			flex: 1;
			overflow-y: auto;
			overflow-x: hidden;
		}
		.buttonPole {
			border-radius: var(--sld-radius-small);
			border: 1px solid rgba(208, 191, 151, 0.3);
			padding: 0.5rem;
		}

		.slotUiGrid {
			display: grid;
			grid-gap: 0.2rem;
			grid-template-columns: repeat(auto-fit, minmax(var(--sld-column-size), 1fr));
		}

		.bottomBar {
			box-shadow: 0px 0px 3px 1px rgba(51, 51, 51, 0.5);
		}
	}
</style>
