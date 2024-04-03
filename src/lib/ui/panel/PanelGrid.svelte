<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import { transition } from 'd3';

	import { fade } from 'svelte/transition';

	export let data: any | undefined;
	export let columns: number = 3;

	export let isExpanded: boolean = false;
</script>

{#if data}
	<div
		class="slotUiGrid panelGrid"
		style="--sld-column-size:{Math.floor(100 / columns)}%;gap:0.5rem"
	>
		{#each data as dta}
			{#if !isExpanded}
				<div
					on:click={() => {
						if ($$slots.zoomSlot) isExpanded = true;
					}}
					class="panelGridThumb"
					in:fade|global
				>
					<slot data={dta} />
				</div>
			{/if}
		{/each}
	</div>
	{#if isExpanded}
		<div class="panelGridPreview" in:fade|global>
			<div
				on:click={() => {
					isExpanded = false;
				}}
			>
				<Button naked icon="chevron-left" class="theme-text-primary" />
			</div>
			<div class="zoomSlot">
				<slot name="zoomSlot" />
			</div>
		</div>
	{/if}
{/if}

<style lang="scss">
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';
	.panelGridPreview {
		display: flex;
		.zoomSlot {
			flex: 1;
		}
	}

	.slotUiGrid {
		display: grid;
		grid-gap: 0.2rem;
		grid-template-columns: repeat(auto-fit, minmax(calc(var(--sld-column-size) - 0.5rem), 1fr));
	}
</style>
