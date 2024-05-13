<svelte:options accessors />

<script lang="ts">
	import { getChromeFrame } from './chromeFrame.utils.js';

	type ChromeFrameProps = {
		frameId: string;
		showCommands: boolean;
	};

	let { frameId, showCommands }: ChromeFrameProps = $props();

	const frameStore = getChromeFrame(frameId);

	function handleRemove() {
		frameStore.remove();
	}
	function handleHide() {
		frameStore.toggle();
	}
</script>

<div
	on:chromeframe:hide
	on:chromeframe:close
	class="chrome-frame"
	style="z-index:{$frameStore?.zIndex};display:{$frameStore?.minimized ? 'none' : ''}"
>
	{#if $frameStore?.showCommandBar}
		<div class="chrome-frame-bar">
			<div class="flex-main h3">{frameId}</div>
			<div>{frameId}</div>
			<button onclick={handleHide}>hide</button>
			<button onclick={handleRemove}>close</button>
		</div>
	{/if}
	<div class="chrome-frame-content">
		<svelte:component this={$frameStore?.component} {...$frameStore?.componentProps} />
	</div>
</div>

<style global lang="scss">
	@import './chrome-frame.scss';
</style>
