<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	import { fade } from 'svelte/transition';
	import type { PanelGridProps } from './types.js';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		data = [],
		columns = 3,
		isExpanded = $bindable(false),
		children,
		panelGridZoom,
		...rest
	}: PanelGridProps = $props();
</script>

{#if data}
	<div
		class="slotUiGrid panelGrid"
		style="--sld-column-size:{Math.floor(100 / columns)}%;gap:0.5rem"
		{...rest}
	>
		{#each data as dta}
			{#if !isExpanded}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					onclick={() => {
						if (panelGridZoom) isExpanded = true;
					}}
					class="panelGridThumb"
					in:fade|global
				>
					<Slotted child={children} slotArgs={{ data: dta }}></Slotted>
				</div>
			{/if}
		{/each}
	</div>
	{#if isExpanded}
		<div class="panelGridPreview" in:fade|global>
			<div>
				<Button
					onclick={() => {
						isExpanded = false;
					}}
					variant="naked"
					icon="chevron-left"
					class="theme-text-primary"
				/>
			</div>
			<div class="panelGridZoom">
				<Slotted child={panelGridZoom}></Slotted>
			</div>
		</div>
	{/if}
{/if}

<style lang="scss">
	@use '../../styles/slotui-presets.scss';
	@use '../../styles/slotui-mixins.scss';
	.panelGridPreview {
		display: flex;
		.panelGridZoom {
			flex: 1;
		}
	}

	.slotUiGrid {
		display: grid;
		grid-gap: 0.2rem;
		grid-template-columns: repeat(auto-fit, minmax(calc(var(--sld-column-size) - 0.5rem), 1fr));
	}
</style>
