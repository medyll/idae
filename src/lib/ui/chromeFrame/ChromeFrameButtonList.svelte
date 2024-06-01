<svelte:options accessors />

<script lang="ts">
	import { chromeFrameStore } from './chromeFrame.store.js';
	import Button from '$lib/controls/button/Button.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let { class: className = '', element, children, ...rest } = $props();
</script>

<div bind:this={element} class="flex-h gap-small {className}" {...rest}>
	{#each [...$chromeFrameStore.values()] as value, key}
		<div class="buttonRail">
			<Slotted child={children} slotArgs={{ chromeFrame: value }}>
				<Button
					style="position:relative"
					onclick={() => {
						chromeFrameStore.toggle(value.frameId);
					}}
					ondblclick={() => {
						chromeFrameStore.remove(value.frameId);
					}}
					class={value.active ? 'active' : ''}
					iconEnd="window-close"
				>
					{value.title ?? value.frameId}
				</Button>
			</Slotted>
		</div>
	{/each}
</div>

<style global lang="scss">
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';
	.buttonRail {
		button:not(.active) {
			border: 1px solid transparent;
			background-color: transparent;
		}
		button {
			&.active {
				border: 1px solid var(--sld-color-border);
			}
			&:hover {
				border: 1px solid var(--sld-color-primary);
			}
		}
	}
</style>
